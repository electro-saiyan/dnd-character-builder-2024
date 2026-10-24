// Wizard logic without the DOM: option lists, choice errors, step validation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { createCharacter, derive, applyStartingEquipment } from "../js/state.js";
import { optionsFor, choiceError } from "../js/choices.js";
import { validateStep, hasSpellStep } from "../js/validate.js";

const reg = createRegistry();

function monk() {
  const ch = createCharacter();
  Object.assign(ch, {
    classId: "monk", level: 1, backgroundId: "sailor", speciesId: "human", size: "Medium",
    baseScores: { str: 12, dex: 15, con: 13, int: 10, wis: 14, cha: 8 }, bgBoosts: { dex: 2, wis: 1 },
    choices: { "monk.skills": ["insight", "stealth"], "monk.tools": ["flute"], "human.skillful": ["athletics"], "human.versatile": ["alert"] },
    equipmentOption: { class: "A", background: "A" },
    languages: ["common", "elvish", "dwarvish"], alignment: "ng",
  });
  ch.details.name = "Kael";
  applyStartingEquipment(ch, reg);
  return ch;
}

test("the finished Human Monk passes every step", () => {
  const ch = monk();
  const sheet = derive(ch, reg);
  for (const step of ["class", "origin", "abilities", "alignment", "details", "equipment"]) {
    assert.deepEqual(validateStep(step, ch, sheet, reg).errors, [], step);
  }
  assert.equal(hasSpellStep(sheet), false);
  assert.equal(ch.coins.gp, 31);
});

test("skills already granted elsewhere are blocked; own picks stay selectable", () => {
  const sheet = derive(monk(), reg);
  const skillful = sheet.choices.find((c) => c.key === "human.skillful");
  const opts = Object.fromEntries(optionsFor(skillful, { reg, sheet }).map((o) => [o.id, o]));
  assert.equal(opts.acrobatics.disabled, true); // from Sailor
  assert.equal(opts.athletics.disabled, false); // this choice's own pick
});

test("an invalid or duplicate pick is reported", () => {
  const ch = monk();
  ch.choices["human.skillful"] = ["perception"]; // Sailor already gives Perception
  const sheet = derive(ch, reg);
  const err = choiceError(sheet.choices.find((c) => c.key === "human.skillful"), { reg, sheet });
  assert.match(err, /already proficient/);
  assert.ok(validateStep("origin", ch, sheet, reg).errors.length > 0);
});

test("feat prerequisites: Great Weapon Master needs STR 13 and level 4", () => {
  const ch = monk();
  ch.level = 4;
  const sheet = derive(ch, reg);
  const asi = sheet.choices.find((c) => c.key === "monk.asi4");
  const gwm = optionsFor(asi, { reg, sheet }).find((o) => o.id === "great-weapon-master");
  assert.equal(gwm.disabled, true);
  assert.equal(gwm.reason, "STR 13+");
});

test("ability step: standard array must be a permutation; point buy within budget", () => {
  const ch = monk();
  ch.baseScores.cha = 15;
  assert.ok(validateStep("abilities", ch, derive(ch, reg), reg).errors.length);
  Object.assign(ch, { abilityMethod: "pointbuy", baseScores: { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 } });
  assert.deepEqual(validateStep("abilities", ch, derive(ch, reg), reg).errors, []);
  ch.baseScores.wis = 9;
  assert.match(validateStep("abilities", ch, derive(ch, reg), reg).errors[0], /28 of 27/);
});

test("ability step: manual scores are free; unusual ones only warn", () => {
  const ch = monk();
  Object.assign(ch, { abilityMethod: "manual", baseScores: { str: 17, dex: 15, con: 13, int: 10, wis: 14, cha: 8 } });
  assert.deepEqual(validateStep("abilities", ch, derive(ch, reg), reg), { errors: [], warnings: [] });
  ch.baseScores.str = 20;
  const res = validateStep("abilities", ch, derive(ch, reg), reg);
  assert.deepEqual(res.errors, []);
  assert.equal(res.warnings.length, 1);
  ch.baseScores.cha = null;
  assert.ok(validateStep("abilities", ch, derive(ch, reg), reg).errors.length);
});

test("spells step: counts must match the class table", () => {
  const ch = createCharacter();
  Object.assign(ch, { classId: "wizard", level: 1, baseScores: { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 } });
  let sheet = derive(ch, reg);
  assert.ok(hasSpellStep(sheet));
  assert.equal(validateStep("spells", ch, sheet, reg).errors.length, 4); // cantrips, prepared, spellbook size, 6 level 1
  ch.spells = {
    cantrips: ["fire-bolt", "light", "mage-hand"],
    prepared: ["magic-missile", "shield", "sleep", "mage-armor"],
    spellbook: ["magic-missile", "shield", "sleep", "mage-armor", "detect-magic", "find-familiar"],
  };
  sheet = derive(ch, reg);
  assert.deepEqual(validateStep("spells", ch, sheet, reg).errors, []);
});

function wizard(level, subclassId = null) {
  const ch = createCharacter();
  Object.assign(ch, { classId: "wizard", level, subclassId, baseScores: { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 } });
  return ch;
}
const L1 = ["alarm", "burning-hands", "charm-person", "chromatic-orb", "color-spray", "comprehend-languages", "detect-magic", "disguise-self"];

test("wizard spellbook: size 6 + 2 per level, prepare only from it", () => {
  const ch = wizard(1);
  assert.equal(derive(ch, reg).spellcasting.spellbookSize, 6);
  assert.equal(derive(wizard(5), reg).spellcasting.spellbookSize, 14);
  ch.spells = { cantrips: ["fire-bolt", "light", "mage-hand"], spellbook: L1.slice(0, 6), prepared: L1.slice(0, 3).concat("magic-missile") };
  let errors = validateStep("spells", ch, derive(ch, reg), reg).errors;
  assert.ok(errors.some((e) => /must be in your spellbook: Magic Missile/.test(e)), errors.join(" | "));
  ch.spells.prepared = L1.slice(0, 4);
  assert.deepEqual(validateStep("spells", ch, derive(ch, reg), reg).errors, []);
});

test("wizard spellbook: the first 6 must be level 1; spells above your slots are rejected", () => {
  const ch = wizard(3);
  ch.spells = { cantrips: ["fire-bolt", "light", "mage-hand"], prepared: [], spellbook: [...L1.slice(0, 5), "misty-step", "web", "shatter", "blur", "fireball"] };
  const errors = validateStep("spells", ch, derive(ch, reg), reg).errors;
  assert.ok(errors.some((e) => /at least 6 level 1/.test(e)));
  assert.ok(errors.some((e) => /Fireball/.test(e)));
});

test("Savant: free school spells (2 at 3rd, +1 per new slot level) join the spellbook", () => {
  const evoker = (lvl) => derive(wizard(lvl, "evoker"), reg).choices.find((c) => c.effect.category === "spellbook");
  assert.deepEqual([3, 4, 5, 9, 17, 20].map((l) => evoker(l).count), [2, 2, 3, 5, 9, 9]);
  const ch = wizard(3, "evoker");
  ch.choices["wizard.savant"] = ["magic-missile", "shatter"];
  const sheet = derive(ch, reg);
  assert.ok(sheet.spellcasting.spellbook.includes("shatter"));
  const opts = optionsFor(sheet.choices.find((c) => c.key === "wizard.savant"), { reg, sheet });
  assert.ok(opts.every((o) => reg.spells[o.id].school === "evocation" && reg.spells[o.id].level >= 1));
});

test("Spell Mastery and Signature Spells pick from the spellbook and are always prepared", () => {
  const ch = wizard(20);
  ch.spells.spellbook = ["shield", "magic-missile", "misty-step", "fireball", "counterspell"];
  ch.choices = { "wizard.mastery1": ["shield"], "wizard.mastery2": ["misty-step"], "wizard.signature": ["fireball", "counterspell"] };
  const sheet = derive(ch, reg);
  const m1 = sheet.choices.find((c) => c.key === "wizard.mastery1");
  // Level 1 spellbook spells with an Action casting time: Magic Missile and Shield (a Reaction)
  // is in the book but excluded.
  assert.deepEqual(optionsFor(m1, { reg, sheet }).map((o) => o.id), ["magic-missile"]);
  for (const id of ["misty-step", "fireball", "counterspell"]) assert.equal(sheet.spellList.find((s) => s.id === id).alwaysPrepared, true, id);
});

test("applyStartingEquipment keeps player-added items", () => {
  const ch = monk();
  ch.inventory.push({ itemId: "torch", qty: 3 });
  ch.equipmentOption.class = "B";
  applyStartingEquipment(ch, reg);
  assert.ok(ch.inventory.some((x) => x.itemId === "torch" && !x.start));
  assert.ok(!ch.inventory.some((x) => x.itemId === "spear"));
  assert.equal(ch.coins.gp, 50 + 20);
});
