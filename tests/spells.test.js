// Spell data parsing and cross-references from class/species/feat data.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { ALL_SPELLS } from "../js/data/spells.js";
import { createCharacter, derive } from "../js/state.js";

const reg = createRegistry();

// Every spell id named by a "spell" effect anywhere in the data.
function referencedSpellIds() {
  const ids = new Set();
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    if (node.type === "spell") {
      (node.ids ?? []).forEach((id) => ids.add(id));
      Object.values(node.byLevel ?? {}).flat().forEach((id) => ids.add(id));
    }
    Object.values(node).forEach(walk);
  };
  walk([Object.values(reg.classes), Object.values(reg.species), Object.values(reg.feats)]);
  return ids;
}

test("456 spells on the wiki list; ids unique", () => {
  assert.equal(ALL_SPELLS.length, 456);
  assert.equal(new Set(ALL_SPELLS.map((s) => s.id)).size, 456);
});

test("every spell granted by a feature, trait or feat exists in the PHB set", () => {
  const missing = [...referencedSpellIds()].filter((id) => !reg.spells[id]);
  assert.deepEqual(missing, []);
});

test("every PHB spell is on at least one class list", () => {
  const orphans = Object.values(reg.spells).filter((s) => s.classes.length === 0).map((s) => s.name);
  assert.deepEqual(orphans, []);
});

test("row parsing: ritual, concentration, costly and consumed components", () => {
  const s = reg.spells;
  assert.deepEqual([s["detect-magic"].ritual, s["detect-magic"].concentration, s["detect-magic"].castingTime], [true, true, "Action"]);
  assert.equal(s["detect-magic"].duration, "up to 10 minutes");
  assert.deepEqual([s.bless.components.m, s.bless.components.costly, s.bless.components.consumed], [true, true, false]);
  assert.equal(s["find-familiar"].components.consumed, true);
  assert.deepEqual([s.shield.castingTime, s.shield.trigger], ["Reaction", true]);
  assert.equal(s.fireball.level, 3);
  assert.ok(s["eldritch-blast"].classes.includes("warlock"));
  assert.ok(!s["fire-bolt"].classes.includes("artificer"));
  assert.equal(s["melfs-acid-arrow"].name, "Melf's Acid Arrow");
});

test("Light Domain cleric lists always-prepared domain spells by level", () => {
  const ch = createCharacter();
  Object.assign(ch, {
    classId: "cleric", level: 5, subclassId: "light",
    baseScores: { str: 10, dex: 12, con: 13, int: 10, wis: 16, cha: 8 },
    spells: { cantrips: ["sacred-flame"], prepared: ["healing-word"] },
  });
  const s = derive(ch, reg);
  const names = s.spellList.map((x) => x.name);
  assert.ok(names.includes("Fireball") && names.includes("Burning Hands") && names.includes("Sacred Flame"));
  assert.ok(!names.includes("Wall of Fire")); // level 7
  const fireball = s.spellList.find((x) => x.id === "fireball");
  assert.equal(fireball.alwaysPrepared, true);
  assert.equal(s.spellList.find((x) => x.id === "healing-word").alwaysPrepared, false);
});

test("damaging cantrips join the attack table and scale with level", () => {
  const ch = createCharacter();
  Object.assign(ch, {
    classId: "warlock", level: 5, baseScores: { str: 8, dex: 14, con: 13, int: 10, wis: 12, cha: 16 },
    spells: { cantrips: ["eldritch-blast", "mind-sliver"], prepared: [] },
  });
  const byName = Object.fromEntries(derive(ch, reg).attacks.map((a) => [a.name, a]));
  assert.deepEqual([byName["Eldritch Blast"].attack, byName["Eldritch Blast"].damage], [6, "2 beams × 1d10"]);
  assert.deepEqual([byName["Mind Sliver"].dc, byName["Mind Sliver"].save, byName["Mind Sliver"].damage], [14, "int", "2d6"]);
});

test("non-PHB spells only with allSources", () => {
  assert.equal(reg.spells["spellfire-flare"], undefined);
  assert.ok(createRegistry({}, { allSources: true }).spells["spellfire-flare"]);
});
