// Pure rules calculations (2024 PHB). No DOM, no state.

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const ABILITY_CAP = 20;

export const abilityMod = (score) => Math.floor((score - 10) / 2);

export const profBonus = (level) => 2 + Math.floor((clampLevel(level) - 1) / 4);

export const formatMod = (n) => (n >= 0 ? `+${n}` : `${n}`);

function clampLevel(level) {
  return Math.min(20, Math.max(1, Math.trunc(level) || 1));
}

// ---------- Ability scores ----------

// Returns total cost, or null if any score is outside 8–15.
export function pointBuyCost(scores) {
  let total = 0;
  for (const s of Object.values(scores)) {
    const c = POINT_BUY_COST[s];
    if (c === undefined) return null;
    total += c;
  }
  return total;
}

// rng(): float in [0,1). Returns { rolls: [4 dice], total } with the lowest die dropped.
export function roll4d6DropLowest(rng = Math.random) {
  const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(rng() * 6));
  const sorted = [...rolls].sort((a, b) => a - b);
  return { rolls, total: sorted[1] + sorted[2] + sorted[3] };
}

// Background boosts: +2/+1 to two different abilities, or +1/+1/+1, all among the background's three.
export function validBackgroundBoosts(boosts, allowed) {
  const entries = Object.entries(boosts).filter(([, v]) => v);
  if (!entries.every(([id, v]) => allowed.includes(id) && (v === 1 || v === 2))) return false;
  const values = entries.map(([, v]) => v).sort();
  return (values.length === 2 && values[0] === 1 && values[1] === 2)
    || (values.length === 3 && values.every((v) => v === 1));
}

export function applyIncrease(score, amount, max = ABILITY_CAP) {
  if (score >= max) return score;
  return Math.min(max, score + amount);
}

// ---------- Hit points ----------

// Level 1: max die + CON; each later level: fixed average (die/2 + 1) + CON. Min 1 HP per level.
export function maxHitPoints({ hitDie, level, conMod, bonusPerLevel = 0 }) {
  const lvl = clampLevel(level);
  const first = Math.max(1, hitDie + conMod);
  const perLevel = Math.max(1, hitDie / 2 + 1 + conMod);
  return first + (lvl - 1) * perLevel + bonusPerLevel * lvl;
}

// ---------- Armor class ----------

// armor: item { armorType, ac, dexCap } or null; shield: item or null.
// formulas: [{ base, add: [abilityId], noArmor, noShield }]; mods: { str: n, ... }
export function armorClass({ mods, armor = null, shield = null, shieldTrained = true, formulas = [], bonus = 0 }) {
  const candidates = [];
  if (armor) {
    // dexCap: null = full DEX, 0 = heavy armor (DEX ignored, even if negative), n = capped
    let dex = mods.dex;
    if (armor.dexCap === 0) dex = 0;
    else if (armor.dexCap != null) dex = Math.min(dex, armor.dexCap);
    candidates.push(armor.ac + dex);
  } else {
    candidates.push(10 + mods.dex);
  }
  for (const f of formulas) {
    if (f.noArmor && armor) continue;
    if (f.noShield && shield) continue;
    candidates.push(f.base + f.add.reduce((sum, a) => sum + mods[a], 0));
  }
  const shieldAc = shield && shieldTrained ? shield.ac : 0;
  return Math.max(...candidates) + shieldAc + bonus;
}

// ---------- Checks ----------

// prof: 0 none, 1 proficient, 2 expertise
export const checkBonus = (mod, prof, pb) => mod + prof * pb;

export const passiveScore = (checkMod, bonus = 0) => 10 + checkMod + bonus;

// ---------- Spellcasting ----------

export const spellSaveDC = (pb, mod) => 8 + pb + mod;
export const spellAttackBonus = (pb, mod) => pb + mod;

// Full-caster slots by level, index 0 = 1st-level slots.
const FULL_CASTER_SLOTS = [
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
  [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

// Warlock Pact Magic: [slot count, slot level]
const PACT_SLOTS = [
  [1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5],
  [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5],
];

// casterType: "full" | "half" | "third" | "pact". Returns array of 9 slot counts (index 0 = level 1).
// Half casters (2024 Paladin/Ranger) use the full table at ceil(level / 2); third casters
// (Eldritch Knight, Arcane Trickster) use it at ceil(level / 3), starting at level 3.
export function spellSlots(casterType, level) {
  const lvl = clampLevel(level);
  const slots = Array(9).fill(0);
  let row = [];
  if (casterType === "full") row = FULL_CASTER_SLOTS[lvl - 1];
  else if (casterType === "half") row = FULL_CASTER_SLOTS[Math.ceil(lvl / 2) - 1];
  else if (casterType === "third" && lvl >= 3) row = FULL_CASTER_SLOTS[Math.ceil(lvl / 3) - 1];
  else if (casterType === "pact") {
    const [count, slotLevel] = PACT_SLOTS[lvl - 1];
    slots[slotLevel - 1] = count;
    return slots;
  }
  row.forEach((n, i) => (slots[i] = n));
  return slots;
}

// ---------- Dice ----------

export function dieAverage(die) {
  const m = /^(\d*)d(\d+)$/.exec(die ?? ""); // "1d6" or "d6"
  if (!m) return Number(die) || 0;
  return (Number(m[1] || 1) * (Number(m[2]) + 1)) / 2;
}

// ---------- Weapons ----------

// profs: ids like "simple", "martial", "martial:light", "improvised", or an item id.
export function isWeaponProficient(weapon, profs) {
  return profs.some((p) => {
    if (p === weapon.id || p === weapon.category) return true;
    const [cat, prop] = p.split(":");
    return prop && cat === weapon.category && weapon.properties?.includes(prop);
  });
}

// match: [{ category?, type?, property? }] — weapon must satisfy every key of one entry.
export function weaponMatches(weapon, match) {
  return match.some((m) =>
    (!m.category || m.category === weapon.category)
    && (!m.type || m.type === weapon.type)
    && (!m.property || weapon.properties?.includes(m.property)));
}

// Default attack ability: ranged → DEX, finesse → better of STR/DEX, else STR.
export function weaponAbilities(weapon) {
  if (weapon.properties?.includes("finesse")) return ["str", "dex"];
  return weapon.type === "ranged" ? ["dex"] : ["str"];
}
