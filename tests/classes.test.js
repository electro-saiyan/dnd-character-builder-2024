// One or more derive() checks per class and for subclasses with calculated effects.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { createCharacter, derive } from "../js/state.js";

const reg = createRegistry();

// Base scores: 15 in the first listed ability, 14 in the second, then 13 CON, rest 10.
function build(classId, level, { primary = ["str", "dex"], subclassId = null, choices = {}, inventory = [] } = {}) {
  const ch = createCharacter();
  const scores = { str: 10, dex: 10, con: 13, int: 10, wis: 10, cha: 10 };
  scores[primary[0]] = 15;
  if (primary[1]) scores[primary[1]] = 14;
  Object.assign(ch, { classId, level, subclassId, baseScores: scores, choices, inventory });
  return derive(ch, reg);
}

const resource = (s, id) => s.resources.find((r) => r.id === id);

test("all 12 classes and 48 subclasses are registered", () => {
  const classes = Object.values(reg.classes);
  assert.equal(classes.length, 12);
  assert.equal(classes.reduce((n, c) => n + c.subclasses.length, 0), 48);
  for (const c of classes) {
    for (const sub of c.subclasses) assert.ok(sub.features.length > 0, `${c.id}/${sub.id} has features`);
  }
});

test("every class derives at levels 1–20 without errors", () => {
  for (const c of Object.values(reg.classes)) {
    for (let level = 1; level <= 20; level++) {
      const s = build(c.id, level, { subclassId: c.subclasses[0].id });
      assert.ok(s.hp.max > 0, `${c.id} ${level}`);
    }
  }
});

test("Barbarian: Unarmored Defense with CON, Rage, Fast Movement", () => {
  const s1 = build("barbarian", 1, { primary: ["str", "dex"] });
  assert.equal(s1.ac, 10 + 2 + 1);
  assert.equal(s1.hp.max, 12 + 1);
  assert.equal(resource(s1, "rage").max, 2);
  assert.equal(s1.abilities.str.save, 2 + 2);
  const shield = [{ itemId: "shield", qty: 1, equipped: true }];
  assert.equal(build("barbarian", 1, { inventory: shield }).ac, 13 + 2); // shield stacks with Unarmored Defense
  const s5 = build("barbarian", 5);
  assert.equal(s5.speed, 40);
  assert.equal(s5.hp.max, 13 + 4 * 8);
  const heavy = build("barbarian", 5, { inventory: [{ itemId: "chain-mail", qty: 1, equipped: true }] });
  assert.equal(heavy.speed, 30); // no Fast Movement in Heavy armor (STR 15 meets Chain Mail's 13)
});

test("Bard: spellcasting, Bardic Inspiration, Jack of All Trades, Font of Inspiration", () => {
  const s1 = build("bard", 1, { primary: ["cha", "dex"] });
  assert.equal(s1.spellcasting.dc, 12);
  assert.equal(s1.spellcasting.attack, 4);
  assert.equal(s1.spellcasting.slots[0].total, 2);
  assert.equal(s1.spellcasting.cantripsKnown, 2);
  assert.equal(s1.spellcasting.preparedCount, 4);
  assert.equal(resource(s1, "bardic-inspiration").max, 2);
  assert.equal(resource(s1, "bardic-inspiration").recharge, "long");
  assert.equal(s1.skills.arcana.mod, 0);
  const s2 = build("bard", 2, { primary: ["cha", "dex"] });
  assert.equal(s2.skills.arcana.mod, 1); // half of +2
  assert.equal(resource(build("bard", 5, { primary: ["cha"] }), "bardic-inspiration").recharge, "short");
});

test("Bard College of Dance: Unarmored Defense with CHA and Bardic die strikes", () => {
  const s = build("bard", 3, { primary: ["cha", "dex"], subclassId: "dance" });
  assert.equal(s.ac, 10 + 2 + 2);
  assert.equal(s.attacks[0].damage, "d6+2");
});

test("Cleric: Divine Order options", () => {
  const thaum = build("cleric", 1, { primary: ["wis"], choices: { "cleric.divineOrder": ["thaumaturge"] } });
  assert.equal(thaum.spellcasting.cantripsKnown, 4);
  assert.equal(thaum.skills.religion.mod, 2); // +WIS (min +1)
  assert.ok(thaum.features.some((f) => f.name === "Divine Order: Thaumaturge"));
  const prot = build("cleric", 1, { primary: ["wis"], choices: { "cleric.divineOrder": ["protector"] } });
  assert.ok(prot.training.armor.includes("heavy"));
  assert.ok(prot.training.weapons.includes("martial"));
  assert.equal(resource(build("cleric", 2), "channel-divinity").max, 2);
});

test("Druid: Druidic language, Wild Shape, Warden", () => {
  const s = build("druid", 2, { primary: ["wis"], choices: { "druid.primalOrder": ["warden"] } });
  assert.ok(s.languages.includes("Druidic"));
  assert.equal(resource(s, "wild-shape").max, 2);
  assert.ok(s.training.armor.includes("medium"));
});

test("Fighter: Weapon Mastery count, Battle Master dice and DC", () => {
  const s1 = build("fighter", 1);
  const mastery = s1.pendingChoices.find((p) => p.key === "fighter.mastery");
  assert.equal(mastery.count, 3);
  const bm = build("fighter", 3, { primary: ["str", "dex"], subclassId: "battle-master" });
  const dice = resource(bm, "superiority-dice");
  assert.deepEqual([dice.max, dice.die], [4, "1d8"]);
  assert.equal(bm.classDCs.find((d) => d.name === "Maneuver Save DC").value, 8 + 2 + 2);
  const bm18 = build("fighter", 18, { subclassId: "battle-master" });
  assert.deepEqual([resource(bm18, "superiority-dice").max, resource(bm18, "superiority-dice").die], [6, "1d12"]);
});

test("Eldritch Knight and Arcane Trickster: third-caster slots", () => {
  const ek3 = build("fighter", 3, { primary: ["str", "int"], subclassId: "eldritch-knight" });
  assert.equal(ek3.spellcasting.ability, "int");
  assert.deepEqual(ek3.spellcasting.slots.map((x) => x.total).slice(0, 4), [2, 0, 0, 0]);
  const ek19 = build("fighter", 19, { subclassId: "eldritch-knight" });
  assert.deepEqual(ek19.spellcasting.slots.map((x) => x.total).slice(0, 4), [4, 3, 3, 1]);
  assert.equal(build("fighter", 2, { subclassId: "eldritch-knight" }).spellcasting, null);
  const at7 = build("rogue", 7, { subclassId: "arcane-trickster" });
  assert.deepEqual(at7.spellcasting.slots.map((x) => x.total).slice(0, 2), [4, 2]);
});

test("Paladin: half-caster slots, Lay On Hands, Aura of Protection", () => {
  const s1 = build("paladin", 1, { primary: ["str", "cha"] });
  assert.equal(s1.spellcasting.slots[0].total, 2);
  assert.equal(s1.spellcasting.cantripsKnown, 0);
  assert.equal(resource(s1, "lay-on-hands").max, 5);
  const s6 = build("paladin", 6, { primary: ["str", "cha"] });
  assert.equal(s6.abilities.wis.save, 0 + 3 + 2); // prof + CHA aura
  assert.equal(s6.abilities.str.save, 2 + 2);
});

test("Ranger: Favored Enemy, Roving, Gloom Stalker", () => {
  assert.equal(resource(build("ranger", 1), "favored-enemy").max, 2);
  assert.equal(build("ranger", 6).speed, 40);
  const gs = build("ranger", 7, { primary: ["dex", "wis"], subclassId: "gloom-stalker" });
  assert.equal(gs.initiative, 2 + 2);
  assert.equal(gs.senses.darkvision, 60);
  assert.ok(gs.abilities.wis.saveProf);
});

test("Rogue: Expertise, Sneak Attack, Slippery Mind, Soulknife, Thief", () => {
  const s1 = build("rogue", 1, { primary: ["dex"], choices: { "rogue.skills": ["stealth", "perception", "insight", "acrobatics"], "rogue.expertise1": ["stealth", "perception"] } });
  assert.equal(s1.skills.stealth.mod, 2 + 4);
  assert.equal(s1.skills.acrobatics.mod, 2 + 2);
  assert.equal(s1.classTable.find((c) => c.id === "sneakAttack").value, "1d6");
  assert.ok(build("rogue", 15).abilities.cha.saveProf);
  const sk = build("rogue", 3, { primary: ["dex"], subclassId: "soulknife" });
  const blade = sk.attacks.find((a) => a.name === "Psychic Blade");
  assert.deepEqual([blade.attack, blade.damage], [4, "1d6+2"]);
  assert.equal(build("rogue", 13, { subclassId: "thief" }).attunementSlots, 4);
});

test("Sorcerer: Sorcery Points, Draconic Resilience", () => {
  const s = build("sorcerer", 3, { primary: ["cha", "dex"], subclassId: "draconic" });
  assert.equal(resource(s, "sorcery-points").max, 3);
  assert.equal(s.hp.max, 7 + 2 * 5 + 3);
  assert.equal(s.ac, 10 + 2 + 2);
  assert.equal(s.spellcasting.cantripsKnown, 4);
});

test("Warlock: Pact Magic slots and invocations", () => {
  assert.deepEqual(build("warlock", 1).spellcasting.slots.map((x) => x.total).slice(0, 5), [1, 0, 0, 0, 0]);
  assert.deepEqual(build("warlock", 11).spellcasting.slots.map((x) => x.total).slice(0, 5), [0, 0, 0, 0, 3]);
  assert.equal(build("warlock", 5).pendingChoices.find((p) => p.key === "warlock.invocations").count, 5);
});

test("Wizard: slots, Arcane Ward, Portent", () => {
  const s = build("wizard", 3, { primary: ["int"], subclassId: "abjurer" });
  assert.deepEqual(s.spellcasting.slots.map((x) => x.total).slice(0, 2), [4, 2]);
  assert.equal(resource(s, "arcane-ward").max, 2 * 3 + 2);
  assert.equal(resource(build("wizard", 14, { subclassId: "diviner" }), "portent").max, 3);
});

test("Monk Warrior of Shadow: Darkvision", () => {
  assert.equal(build("monk", 3, { subclassId: "shadow" }).senses.darkvision, 60);
});

test("Zealot: Warrior of the Gods dice from the subclass table", () => {
  assert.equal(resource(build("barbarian", 6, { subclassId: "zealot" }), "warrior-of-the-gods").max, 5);
});
