export const ABILITIES = [
  { id: "str", name: "Strength" },
  { id: "dex", name: "Dexterity" },
  { id: "con", name: "Constitution" },
  { id: "int", name: "Intelligence" },
  { id: "wis", name: "Wisdom" },
  { id: "cha", name: "Charisma" },
];

export const ABILITY_IDS = ABILITIES.map((a) => a.id);

export const SKILLS = [
  { id: "athletics", name: "Athletics", ability: "str" },
  { id: "acrobatics", name: "Acrobatics", ability: "dex" },
  { id: "sleight-of-hand", name: "Sleight of Hand", ability: "dex" },
  { id: "stealth", name: "Stealth", ability: "dex" },
  { id: "arcana", name: "Arcana", ability: "int" },
  { id: "history", name: "History", ability: "int" },
  { id: "investigation", name: "Investigation", ability: "int" },
  { id: "nature", name: "Nature", ability: "int" },
  { id: "religion", name: "Religion", ability: "int" },
  { id: "animal-handling", name: "Animal Handling", ability: "wis" },
  { id: "insight", name: "Insight", ability: "wis" },
  { id: "medicine", name: "Medicine", ability: "wis" },
  { id: "perception", name: "Perception", ability: "wis" },
  { id: "survival", name: "Survival", ability: "wis" },
  { id: "deception", name: "Deception", ability: "cha" },
  { id: "intimidation", name: "Intimidation", ability: "cha" },
  { id: "performance", name: "Performance", ability: "cha" },
  { id: "persuasion", name: "Persuasion", ability: "cha" },
];

export const SKILL_IDS = SKILLS.map((s) => s.id);
