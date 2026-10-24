// Species, backgrounds and feats.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { createCharacter, derive } from "../js/state.js";

const reg = createRegistry();

function build({ classId = "fighter", level = 1, speciesId = null, backgroundId = null, choices = {}, inventory = [], scores = {} } = {}) {
  const ch = createCharacter();
  Object.assign(ch, {
    classId, level, speciesId, backgroundId, choices, inventory,
    baseScores: { str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8, ...scores },
  });
  return derive(ch, reg);
}

test("registry: 10 species, 16 backgrounds, PHB feat counts", () => {
  assert.equal(Object.keys(reg.species).length, 10);
  assert.equal(Object.keys(reg.backgrounds).length, 16);
  const byCategory = {};
  for (const f of Object.values(reg.feats)) byCategory[f.category] = (byCategory[f.category] ?? 0) + 1;
  // Magic Initiate is stored once per spell list (Cleric, Druid, Wizard); general includes ASI.
  assert.deepEqual(byCategory, { origin: 12, general: 43, "fighting-style": 10, epic: 12 });
});

test("every background references a real feat and real skills", () => {
  const skills = new Set(reg.skills.map((s) => s.id));
  for (const bg of Object.values(reg.backgrounds)) {
    assert.ok(reg.feats[bg.feat], `${bg.id} feat ${bg.feat}`);
    assert.equal(reg.feats[bg.feat].category, "origin", bg.id);
    assert.equal(bg.abilities.length, 3, bg.id);
    bg.skills.forEach((s) => assert.ok(skills.has(s), `${bg.id} skill ${s}`));
  }
});

test("Dwarf: Darkvision 120, Toughness +1 HP per level, Poison Resistance", () => {
  const s = build({ speciesId: "dwarf", level: 5 });
  assert.equal(s.senses.darkvision, 120);
  assert.equal(s.hp.max, 10 + 1 + 4 * 7 + 5);
  assert.ok(s.resistances.includes("poison"));
});

test("Elf lineages: Drow Darkvision 120, Wood Elf Speed 35", () => {
  assert.equal(build({ speciesId: "elf", choices: { "elf.lineage": ["drow"] } }).senses.darkvision, 120);
  assert.equal(build({ speciesId: "elf", choices: { "elf.lineage": ["high-elf"] } }).senses.darkvision, 60);
  assert.equal(build({ speciesId: "elf", choices: { "elf.lineage": ["wood-elf"] } }).speed, 35);
});

test("Dragonborn: ancestry resistance and Breath Weapon scaling", () => {
  const s1 = build({ speciesId: "dragonborn", choices: { "dragonborn.ancestry": ["red"] } });
  assert.ok(s1.resistances.includes("fire"));
  const breath = s1.attacks.find((a) => a.name === "Breath Weapon");
  assert.deepEqual([breath.dc, breath.save, breath.damage, breath.damageType], [8 + 2 + 1, "dex", "1d10", "fire"]);
  const s5 = build({ speciesId: "dragonborn", level: 5, choices: { "dragonborn.ancestry": ["red"] } });
  assert.equal(s5.attacks.find((a) => a.name === "Breath Weapon").damage, "2d10");
  assert.ok(s5.resources.some((r) => r.id === "draconic-flight"));
  assert.ok(!s1.resources.some((r) => r.id === "draconic-flight"));
});

test("Goliath, Orc, Aasimar level-gated traits", () => {
  assert.equal(build({ speciesId: "goliath" }).speed, 35);
  assert.equal(build({ speciesId: "orc", level: 5 }).resources.find((r) => r.id === "adrenaline-rush").max, 3);
  assert.ok(!build({ speciesId: "aasimar" }).features.some((f) => f.id === "celestial-revelation"));
  assert.ok(build({ speciesId: "aasimar", level: 3 }).features.some((f) => f.id === "celestial-revelation"));
});

test("background: Criminal grants Alert, skills and Thieves' Tools", () => {
  const s = build({ backgroundId: "criminal" });
  assert.equal(s.initiative, 2 + 2);
  assert.ok(s.skills.stealth.prof && s.skills["sleight-of-hand"].prof);
  assert.ok(s.training.tools.includes("Thieves' Tools"));
});

test("feat: Skilled mixes skills and tools", () => {
  const s = build({ backgroundId: "charlatan", choices: { "background.feat/picks": ["arcana", "history", "dice-set"] } });
  assert.ok(s.skills.arcana.prof && s.skills.history.prof);
  assert.ok(s.training.tools.includes("Gaming Set (Dice)"));
});

test("feat: Tough (Farmer) adds 2 HP per level", () => {
  assert.equal(build({ backgroundId: "farmer", level: 3 }).hp.max, 10 + 1 + 2 * 7 + 6);
});

test("feat: ASI +2 via duplicate picks; Resilient grants the save", () => {
  const asi = build({ level: 4, choices: { "fighter.asi4": ["ability-score-improvement"], "fighter.asi4/ability-score-improvement/asi": ["str", "str"] } });
  assert.equal(asi.abilities.str.score, 17);
  const res = build({ level: 4, choices: { "fighter.asi4": ["resilient"], "fighter.asi4/resilient/asi": ["wis"] } });
  assert.equal(res.abilities.wis.score, 13);
  assert.ok(res.abilities.wis.saveProf);
});

test("feat: Keen Mind gives Expertise when already proficient", () => {
  const choices = {
    "fighter.skills": ["history", "athletics"],
    "fighter.asi4": ["keen-mind"],
    "fighter.asi4/keen-mind/skill": ["history"],
  };
  const s = build({ level: 4, choices, scores: { int: 13 } });
  assert.ok(s.skills.history.expertise);
  assert.equal(s.abilities.int.score, 14);
});

test("fighting style: Defense only applies in armor", () => {
  const choices = { "fighter.fightingStyle": ["defense"] };
  assert.equal(build({ choices }).ac, 12);
  const armored = build({ choices, inventory: [{ itemId: "chain-mail", qty: 1, equipped: true }] });
  assert.equal(armored.ac, 16 + 1);
});

test("epic boons: Fortitude +40 HP, Speed +30, Truesight", () => {
  const boon = (id) => build({ level: 19, choices: { "fighter.boon19": [id] } });
  const base = build({ level: 19 });
  assert.equal(boon("boon-of-fortitude").hp.max, base.hp.max + 40);
  assert.equal(boon("boon-of-speed").speed, 60);
  assert.equal(boon("boon-of-truesight").senses.truesight, 60);
});

test("Medium Armor Master raises the DEX cap to 3", () => {
  const inventory = [{ itemId: "scale-mail", qty: 1, equipped: true }];
  const choices = { "fighter.asi4": ["medium-armor-master"], "fighter.asi4/medium-armor-master/asi": ["str"] };
  assert.equal(build({ level: 4, inventory, scores: { dex: 16 } }).ac, 14 + 2);
  assert.equal(build({ level: 4, inventory, choices, scores: { dex: 16 } }).ac, 14 + 3);
});
