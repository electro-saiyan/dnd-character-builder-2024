import { test } from "node:test";
import assert from "node:assert/strict";
import * as R from "../js/rules.js";

test("ability modifier", () => {
  assert.equal(R.abilityMod(1), -5);
  assert.equal(R.abilityMod(8), -1);
  assert.equal(R.abilityMod(9), -1);
  assert.equal(R.abilityMod(10), 0);
  assert.equal(R.abilityMod(15), 2);
  assert.equal(R.abilityMod(17), 3);
  assert.equal(R.abilityMod(20), 5);
  assert.equal(R.abilityMod(25), 7);
});

test("proficiency bonus by level", () => {
  const expected = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
  expected.forEach((pb, i) => assert.equal(R.profBonus(i + 1), pb, `level ${i + 1}`));
});

test("point buy cost", () => {
  assert.equal(R.pointBuyCost({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }), 27);
  assert.equal(R.pointBuyCost({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }), 0);
  assert.equal(R.pointBuyCost({ str: 16, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }), null);
});

test("4d6 drop lowest", () => {
  const seq = [0, 0.99, 0.5, 0.2]; // dice 1, 6, 4, 2
  let i = 0;
  const r = R.roll4d6DropLowest(() => seq[i++]);
  assert.deepEqual(r.rolls, [1, 6, 4, 2]);
  assert.equal(r.total, 12);
});

test("background boosts: +2/+1 or +1/+1/+1 among allowed", () => {
  const allowed = ["str", "dex", "wis"];
  assert.ok(R.validBackgroundBoosts({ dex: 2, wis: 1 }, allowed));
  assert.ok(R.validBackgroundBoosts({ str: 1, dex: 1, wis: 1 }, allowed));
  assert.ok(!R.validBackgroundBoosts({ dex: 2 }, allowed));
  assert.ok(!R.validBackgroundBoosts({ dex: 2, cha: 1 }, allowed));
  assert.ok(!R.validBackgroundBoosts({ dex: 2, wis: 2 }, allowed));
  assert.ok(!R.validBackgroundBoosts({ dex: 1, wis: 1 }, allowed));
});

test("ability increase respects cap", () => {
  assert.equal(R.applyIncrease(19, 2), 20);
  assert.equal(R.applyIncrease(20, 1), 20);
  assert.equal(R.applyIncrease(20, 4, 25), 24);
});

test("max hit points", () => {
  assert.equal(R.maxHitPoints({ hitDie: 8, level: 1, conMod: 1 }), 9);
  assert.equal(R.maxHitPoints({ hitDie: 8, level: 5, conMod: 1 }), 9 + 4 * 6);
  assert.equal(R.maxHitPoints({ hitDie: 12, level: 3, conMod: 3 }), 15 + 2 * 10);
  assert.equal(R.maxHitPoints({ hitDie: 6, level: 2, conMod: 0, bonusPerLevel: 2 }), 6 + 4 + 4);
  // At least 1 HP per level, even with a big CON penalty.
  assert.equal(R.maxHitPoints({ hitDie: 6, level: 3, conMod: -5 }), 3);
});

test("armor class", () => {
  const mods = { str: 1, dex: 3, con: 1, int: 0, wis: 2, cha: -1 };
  const leather = { armorType: "light", ac: 11, dexCap: null };
  const scale = { armorType: "medium", ac: 14, dexCap: 2 };
  const chain = { armorType: "heavy", ac: 16, dexCap: 0 };
  const shield = { ac: 2 };
  const monk = { base: 10, add: ["dex", "wis"], noArmor: true, noShield: true };
  const barbarian = { base: 10, add: ["dex", "con"], noArmor: true };

  assert.equal(R.armorClass({ mods }), 13);
  assert.equal(R.armorClass({ mods, armor: leather }), 14);
  assert.equal(R.armorClass({ mods, armor: scale }), 16);
  assert.equal(R.armorClass({ mods, armor: chain, shield }), 18);
  assert.equal(R.armorClass({ mods: { ...mods, dex: -1 }, armor: chain }), 16);
  assert.equal(R.armorClass({ mods, formulas: [monk] }), 15);
  assert.equal(R.armorClass({ mods, shield, formulas: [monk] }), 15); // shield turns off Unarmored Defense
  assert.equal(R.armorClass({ mods, shield, formulas: [barbarian] }), 16);
  assert.equal(R.armorClass({ mods, shield, shieldTrained: false }), 13);
});

test("checks, passive, spell DC", () => {
  assert.equal(R.checkBonus(2, 0, 2), 2);
  assert.equal(R.checkBonus(2, 1, 2), 4);
  assert.equal(R.checkBonus(2, 2, 3), 8);
  assert.equal(R.passiveScore(4), 14);
  assert.equal(R.spellSaveDC(2, 3), 13);
  assert.equal(R.spellAttackBonus(2, 3), 5);
});

test("spell slots", () => {
  assert.deepEqual(R.spellSlots("full", 1), [2, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots("full", 5), [4, 3, 2, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots("full", 20), [4, 3, 3, 3, 3, 2, 2, 1, 1]);
  assert.deepEqual(R.spellSlots("half", 1), [2, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots("half", 5), [4, 2, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots("half", 20), [4, 3, 3, 3, 2, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots("pact", 1), [1, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots("pact", 11), [0, 0, 0, 0, 3, 0, 0, 0, 0]);
  assert.deepEqual(R.spellSlots(null, 5), [0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test("weapon proficiency and matching", () => {
  const dagger = { id: "dagger", category: "simple", type: "melee", properties: ["finesse", "light"] };
  const scimitar = { id: "scimitar", category: "martial", type: "melee", properties: ["finesse", "light"] };
  const longsword = { id: "longsword", category: "martial", type: "melee", properties: ["versatile"] };
  const profs = ["simple", "martial:light"];
  assert.ok(R.isWeaponProficient(dagger, profs));
  assert.ok(R.isWeaponProficient(scimitar, profs));
  assert.ok(!R.isWeaponProficient(longsword, profs));
  assert.ok(R.isWeaponProficient(longsword, ["longsword"]));

  const monkWeapons = [{ category: "simple", type: "melee" }, { category: "martial", type: "melee", property: "light" }];
  assert.ok(R.weaponMatches(scimitar, monkWeapons));
  assert.ok(!R.weaponMatches(longsword, monkWeapons));
  assert.deepEqual(R.weaponAbilities(dagger), ["str", "dex"]);
  assert.deepEqual(R.weaponAbilities(longsword), ["str"]);
});

test("die average", () => {
  assert.equal(R.dieAverage("1d6"), 3.5);
  assert.equal(R.dieAverage("2d6"), 7);
  assert.equal(R.dieAverage(null), 0);
});
