// Campaign content from the Custom page: registry merge and DM-granted boons.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { createCharacter, derive } from "../js/state.js";
import { migrate } from "../js/storage.js";

const custom = {
  feats: [{
    id: "custom-raven-blessing", name: "Raven Blessing", source: "Custom", category: "general", text: "+1 AC.",
    effects: [{ type: "bonus", target: "ac", value: 1 }, { type: "choose", category: "skill", from: ["stealth", "perception"], count: 1, key: "skill" }],
  }],
  species: [{
    id: "custom-ravenfolk", name: "Ravenfolk", source: "Custom", type: "Humanoid", size: "Medium", speed: 35,
    traits: [{ id: "darkvision", name: "Darkvision", text: "", effects: [{ type: "sense", id: "darkvision", range: 60 }] }],
  }],
  items: [{ id: "custom-raven-blade", name: "Raven Blade", kind: "weapon", category: "martial", type: "melee", damage: "1d8", damageType: "slashing", properties: ["finesse"], mastery: null, weight: 2 }],
};

function character(extra = {}) {
  const ch = createCharacter();
  Object.assign(ch, { classId: "rogue", baseScores: { str: 8, dex: 16, con: 14, int: 12, wis: 10, cha: 13 }, custom, ...extra });
  return ch;
}

test("custom species and items join the registry", () => {
  const reg = createRegistry(custom);
  assert.equal(reg.species["custom-ravenfolk"].speed, 35);
  assert.equal(reg.items["custom-raven-blade"].damage, "1d8");
  const sheet = derive(character({ speciesId: "custom-ravenfolk", inventory: [{ itemId: "custom-raven-blade", qty: 1 }] }), reg);
  assert.equal(sheet.speed, 35);
  assert.equal(sheet.senses.darkvision, 60);
  assert.equal(sheet.attacks.find((a) => a.name === "Raven Blade").attack, 3 + 2); // DEX (finesse) + PB
});

test("boons grant a feat with its effects and choices", () => {
  const reg = createRegistry(custom);
  const base = derive(character(), reg);
  const ch = character({ boons: ["custom-raven-blessing"], choices: { "boon/custom-raven-blessing/skill": ["perception"] } });
  const sheet = derive(ch, reg);
  assert.equal(sheet.ac, base.ac + 1);
  assert.ok(sheet.features.some((f) => f.kind === "feat" && f.name === "Raven Blessing"));
  assert.ok(sheet.skills.perception.prof);
  assert.ok(sheet.choices.some((c) => c.step === "custom"));
});

test("older saves get the new custom fields", () => {
  const ch = migrate({ classId: null, custom: { feats: [], spells: [], items: [], backgrounds: [] } });
  assert.deepEqual(ch.custom.species, []);
  assert.deepEqual(ch.boons, []);
});
