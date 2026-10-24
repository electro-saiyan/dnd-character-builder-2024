// Equipment data integrity + starting equipment for every class and background.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRegistry } from "../js/data/index.js";
import { createCharacter, derive, startingEquipment } from "../js/state.js";

const reg = createRegistry();

test("item ids are unique", () => {
  const ids = Object.values(reg.items).map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("weapons: 38 PHB weapons with masteries; 12 armors + shield", () => {
  const items = Object.values(reg.items);
  const weapons = items.filter((i) => i.kind === "weapon" && !i.focus);
  assert.equal(weapons.length, 38);
  assert.ok(weapons.every((w) => w.mastery && w.damage && w.damageType));
  assert.equal(items.filter((i) => i.kind === "armor").length, 12);
  assert.deepEqual(reg.items.greatsword.cost, { gp: 50 });
  assert.deepEqual(reg.items.club.cost, { sp: 1 });
});

test("every starting-equipment item referenced by a class or background exists", () => {
  const sources = [...Object.values(reg.classes), ...Object.values(reg.backgrounds)];
  for (const src of sources) {
    for (const [option, entries] of Object.entries(src.equipment)) {
      for (const e of entries) {
        if (e.item) assert.ok(reg.items[e.item], `${src.id} option ${option}: ${e.item}`);
      }
    }
  }
});

test("Fighter option A: Chain Mail AC and Greatsword attack", () => {
  const ch = createCharacter();
  Object.assign(ch, { classId: "fighter", level: 1, baseScores: { str: 15, dex: 14, con: 13, int: 10, wis: 12, cha: 8 } });
  const { items, gp } = startingEquipment(reg.classes.fighter.equipment.A, ch.choices);
  ch.inventory = items.map((x) => (x.itemId === "chain-mail" ? { ...x, equipped: true } : x));
  ch.coins.gp = gp;
  const s = derive(ch, reg);
  assert.equal(s.ac, 16);
  assert.equal(s.coins.gp, 4);
  const gs = s.attacks.find((a) => a.name === "Greatsword");
  assert.deepEqual([gs.attack, gs.damage, gs.damageType], [4, "2d6+2", "slashing"]);
  const jav = s.attacks.find((a) => a.name === "Javelin");
  assert.ok(jav.notes.includes("thrown (30/120)"));
});

test("Archery adds +2 to ranged weapon attacks only", () => {
  const ch = createCharacter();
  Object.assign(ch, {
    classId: "fighter", level: 1, choices: { "fighter.fightingStyle": ["archery"] },
    baseScores: { str: 10, dex: 16, con: 13, int: 10, wis: 12, cha: 8 },
    inventory: [{ itemId: "longbow", qty: 1 }, { itemId: "shortsword", qty: 1 }],
  });
  const s = derive(ch, reg);
  assert.equal(s.attacks.find((a) => a.name === "Longbow").attack, 3 + 2 + 2);
  assert.equal(s.attacks.find((a) => a.name === "Shortsword").attack, 3 + 2);
  assert.ok(s.attacks.find((a) => a.name === "Longbow").notes.includes("range 150/600"));
});

test("Druid's wooden staff focus works as a Quarterstaff", () => {
  const ch = createCharacter();
  Object.assign(ch, {
    classId: "druid", level: 1, baseScores: { str: 12, dex: 10, con: 13, int: 10, wis: 15, cha: 8 },
    inventory: [{ itemId: "druidic-focus-staff", qty: 1 }],
  });
  const staff = derive(ch, reg).attacks.find((a) => a.name.startsWith("Druidic Focus"));
  assert.deepEqual([staff.attack, staff.damage], [3, "1d6+1"]);
});
