// Test case: Human Monk level 1, Sailor background, standard array.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { createCharacter, derive, startingEquipment } from "../js/state.js";

const reg = createRegistry();

function humanMonk(level = 1) {
  const ch = createCharacter();
  Object.assign(ch, {
    classId: "monk",
    level,
    backgroundId: "sailor",
    speciesId: "human",
    size: "Medium",
    baseScores: { str: 12, dex: 15, con: 13, int: 10, wis: 14, cha: 8 },
    bgBoosts: { dex: 2, wis: 1 },
    choices: {
      "monk.skills": ["insight", "stealth"],
      "monk.tools": ["flute"],
      "human.skillful": ["athletics"],
      "human.versatile": ["alert"],
    },
    equipmentOption: { class: "A", background: "A" },
  });
  const fromClass = startingEquipment(reg.classes.monk.equipment.A, ch.choices);
  const fromBg = startingEquipment(reg.backgrounds.sailor.equipment.A, ch.choices);
  ch.inventory = [...fromClass.items, ...fromBg.items];
  ch.coins.gp = fromClass.gp + fromBg.gp;
  return ch;
}

test("headline numbers: AC 15, HP 9, Init +5, prof +2", () => {
  const s = derive(humanMonk(), reg);
  assert.equal(s.ac, 15);
  assert.equal(s.hp.max, 9);
  assert.equal(s.initiative, 5);
  assert.equal(s.profBonus, 2);
});

test("ability scores after Sailor boosts", () => {
  const { abilities: a } = derive(humanMonk(), reg);
  assert.deepEqual(
    Object.fromEntries(Object.entries(a).map(([id, v]) => [id, v.score])),
    { str: 12, dex: 17, con: 13, int: 10, wis: 15, cha: 8 },
  );
  assert.equal(a.dex.mod, 3);
  assert.equal(a.wis.mod, 2);
});

test("saving throws: STR and DEX proficient", () => {
  const { abilities: a } = derive(humanMonk(), reg);
  assert.equal(a.str.save, 3);
  assert.equal(a.dex.save, 5);
  assert.equal(a.con.save, 1);
  assert.equal(a.wis.save, 2);
  assert.ok(a.str.saveProf && a.dex.saveProf && !a.wis.saveProf);
});

test("skills: Acrobatics, Perception, Insight, Stealth, Athletics", () => {
  const s = derive(humanMonk(), reg);
  const proficient = Object.entries(s.skills).filter(([, v]) => v.prof).map(([id]) => id).sort();
  assert.deepEqual(proficient, ["acrobatics", "athletics", "insight", "perception", "stealth"]);
  assert.equal(s.skills.acrobatics.mod, 5);
  assert.equal(s.skills.perception.mod, 4);
  assert.equal(s.skills.athletics.mod, 3);
  assert.equal(s.skills.history.mod, 0);
  assert.equal(s.passivePerception, 14);
});

test("feats: Tavern Brawler and Alert", () => {
  const s = derive(humanMonk(), reg);
  const feats = s.features.filter((f) => f.kind === "feat").map((f) => f.name).sort();
  assert.deepEqual(feats, ["Alert", "Tavern Brawler"]);
});

test("attacks: Martial Arts die beats Tavern Brawler; DEX used", () => {
  const s = derive(humanMonk(), reg);
  const byName = Object.fromEntries(s.attacks.map((a) => [a.name, a]));
  assert.equal(byName["Unarmed Strike"].attack, 5);
  assert.equal(byName["Unarmed Strike"].damage, "1d6+3");
  assert.ok(byName["Unarmed Strike"].notes.includes("reroll 1s"));
  assert.equal(byName.Dagger.attack, 5);
  assert.equal(byName.Dagger.damage, "1d6+3");
  assert.equal(byName.Spear.damage, "1d6+3");
});

test("other sheet fields", () => {
  const s = derive(humanMonk(), reg);
  assert.equal(s.speed, 30);
  assert.equal(s.size, "Medium");
  assert.deepEqual(s.hitDice, { die: "d8", max: 1, spent: 0 });
  assert.equal(s.coins.gp, 31);
  assert.ok(s.training.tools.includes("Navigator's Tools"));
  assert.ok(s.training.tools.includes("Flute"));
  assert.ok(s.training.weapons.includes("improvised"));
  assert.deepEqual(s.resources, []); // no Focus Points at level 1
  assert.equal(s.classDCs[0].value, 12); // Focus save DC: 8 + 2 + WIS 2
  assert.deepEqual(s.pendingChoices, []);
});

test("armor or shield turns off Unarmored Defense and Martial Arts", () => {
  const ch = humanMonk();
  ch.inventory.push({ itemId: "shield", qty: 1, equipped: true });
  const s = derive(ch, reg);
  // Monks aren't trained with Shields, so no +2 either: 10 + DEX only.
  assert.equal(s.ac, 13);
  assert.equal(s.attacks[0].damage, "1d4+1"); // Tavern Brawler, STR
});

test("level 5: Focus, Unarmored Movement, Martial Arts d8", () => {
  const ch = humanMonk(5);
  ch.choices["monk.asi4"] = [];
  const s = derive(ch, reg);
  assert.equal(s.profBonus, 3);
  assert.equal(s.hp.max, 9 + 4 * 6);
  assert.equal(s.speed, 40);
  assert.deepEqual(s.resources.map((r) => [r.id, r.max]), [["focus", 5]]);
  assert.equal(s.attacks[0].damage, "1d8+3");
  assert.equal(s.initiative, 6); // DEX 3 + prof 3 from Alert
  assert.deepEqual(s.pendingChoices.map((p) => p.key), ["monk.asi4"]);
});

test("level 20: Body and Mind raises DEX/WIS by 4 (max 25)", () => {
  const s = derive(humanMonk(20), reg);
  assert.equal(s.abilities.dex.score, 21);
  assert.equal(s.abilities.wis.score, 19);
  assert.equal(s.speed, 60);
  assert.ok(Object.values(s.abilities).every((a) => a.saveProf)); // Disciplined Survivor
});
