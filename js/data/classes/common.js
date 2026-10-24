// Shared builders for class data.

// columns: { colId: [20 values, index 0 = level 1] } -> { 1: { colId: v }, ..., 20: {...} }
export function buildTable(columns) {
  const table = {};
  for (let lvl = 1; lvl <= 20; lvl++) {
    table[lvl] = {};
    for (const [id, values] of Object.entries(columns)) table[lvl][id] = values[lvl - 1];
  }
  return table;
}

// Repeat values: run([2, 3], [3, 6]) -> [2,2,2, 3,3,3,3,3,3]
export const run = (...pairs) => pairs.flatMap(([value, count]) => Array(count).fill(value));

export const asi = (cls, level) => ({
  id: `asi-${level}`, level, name: "Ability Score Improvement",
  text: "Gain the Ability Score Improvement feat or another feat you qualify for.",
  effects: [{ type: "choose", category: "feat", from: { category: ["general"] }, count: 1, key: `${cls}.asi${level}` }],
});

export const epicBoon = (cls) => ({
  id: "epic-boon", level: 19, name: "Epic Boon",
  text: "Gain an Epic Boon feat or another feat you qualify for.",
  effects: [{ type: "choose", category: "feat", from: { category: ["epic", "general"] }, count: 1, key: `${cls}.boon19` }],
});

export const weaponMastery = (cls, count, from = { kind: "weapon" }) => ({
  id: "weapon-mastery", level: 1, name: "Weapon Mastery",
  text: "Use the mastery property of chosen weapon kinds you're proficient with; swap one on a Long Rest.",
  effects: [{ type: "choose", category: "mastery", from, count, key: `${cls}.mastery` }],
});

export const extraAttack = (level = 5) => ({
  id: "extra-attack", level, name: "Extra Attack", text: "Attack twice when you take the Attack action.",
});

// Spell slots come from rules.spellSlots(type, level); cantrips/prepared are 20-entry arrays.
export const spellcasting = (ability, type, cantrips, prepared, focus) => ({ ability, type, cantrips, prepared, focus });

// Prepared-spell progression shared by the full casters (Bard, Cleric, Druid).
export const FULL_PREPARED = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
// Paladin and Ranger.
export const HALF_PREPARED = [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15];

export const LIGHT_ARMOR = ["light"];
export const MEDIUM_ARMOR = ["light", "medium", "shield"];
export const ALL_ARMOR = ["light", "medium", "heavy", "shield"];
