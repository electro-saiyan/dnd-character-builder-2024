// Rogue — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, asi, epicBoon, weaponMastery, LIGHT_ARMOR } from "./common.js";
import { ROGUE_SUBCLASSES } from "../subclasses/rogue.js";

export const ROGUE = {
  id: "rogue",
  name: "Rogue",
  source: "PHB 2024",
  hitDie: 8,
  primary: ["dex"],
  saves: ["dex", "int"],
  armor: LIGHT_ARMOR,
  weapons: ["simple", "martial:finesse", "martial:light"],
  tools: ["thieves-tools"],
  skills: {
    count: 4,
    from: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "persuasion", "sleight-of-hand", "stealth"],
  },
  equipment: {
    A: [
      { item: "leather-armor", qty: 1 },
      { item: "dagger", qty: 2 },
      { item: "shortsword", qty: 1 },
      { item: "shortbow", qty: 1 },
      { item: "arrows", qty: 20 },
      { item: "quiver", qty: 1 },
      { item: "thieves-tools", qty: 1 },
      { item: "burglars-pack", qty: 1 },
      { gp: 8 },
    ],
    B: [{ gp: 100 }],
  },
  subclassLevel: 3,
  saveDC: { ability: "dex", name: "Cunning Strike DC" },
  tableColumns: [{ id: "sneakAttack", name: "Sneak Attack" }],
  table: buildTable({ sneakAttack: Array.from({ length: 20 }, (_, i) => `${Math.ceil((i + 1) / 2)}d6`) }),
  spellcasting: null,
  features: [
    {
      id: "expertise-1", level: 1, name: "Expertise", text: "Expertise in two of your skill proficiencies.",
      effects: [{ type: "choose", category: "expertise", from: "proficient", count: 2, key: "rogue.expertise1" }],
    },
    {
      id: "sneak-attack", level: 1, name: "Sneak Attack",
      text: "Once per turn, extra damage with a Finesse or Ranged weapon if you have Advantage or an ally is next to the target.",
    },
    {
      id: "thieves-cant", level: 1, name: "Thieves' Cant", text: "You know Thieves' Cant and one other language.",
      effects: [
        { type: "prof", category: "language", ids: ["thieves-cant"] },
        { type: "choose", category: "language", from: "any", count: 1, key: "rogue.language" },
      ],
    },
    weaponMastery("rogue", 2),
    { id: "cunning-action", level: 2, name: "Cunning Action", text: "Dash, Disengage or Hide as a Bonus Action." },
    {
      id: "steady-aim", level: 3, name: "Steady Aim",
      text: "Bonus Action (if you haven't moved): Advantage on your next attack this turn; Speed 0 until end of turn.",
    },
    asi("rogue", 4),
    {
      id: "cunning-strike", level: 5, name: "Cunning Strike",
      text: "Trade Sneak Attack dice for Poison (1d6, CON save), Trip (1d6, DEX save, Prone) or Withdraw (1d6, move half Speed).",
    },
    { id: "uncanny-dodge", level: 5, name: "Uncanny Dodge", text: "Reaction: halve the damage of an attack that hits you." },
    {
      id: "expertise-6", level: 6, name: "Expertise", text: "Expertise in two more skill proficiencies.",
      effects: [{ type: "choose", category: "expertise", from: "proficient", count: 2, key: "rogue.expertise6" }],
    },
    { id: "evasion", level: 7, name: "Evasion", text: "DEX save for half damage: take none on success, half on failure." },
    { id: "reliable-talent", level: 7, name: "Reliable Talent", text: "Treat a d20 roll of 9 or lower as 10 on proficient checks." },
    asi("rogue", 8),
    asi("rogue", 10),
    { id: "improved-cunning-strike", level: 11, name: "Improved Cunning Strike", text: "Use up to two Cunning Strike effects per Sneak Attack." },
    asi("rogue", 12),
    {
      id: "devious-strikes", level: 14, name: "Devious Strikes",
      text: "New Cunning Strike options: Daze (2d6, CON), Knock Out (6d6, CON), Obscure (3d6, DEX, Blinded).",
    },
    {
      id: "slippery-mind", level: 15, name: "Slippery Mind", text: "Proficiency in WIS and CHA saving throws.",
      effects: [{ type: "prof", category: "save", ids: ["wis", "cha"] }],
    },
    asi("rogue", 16),
    { id: "elusive", level: 18, name: "Elusive", text: "No attack has Advantage against you unless you're Incapacitated." },
    epicBoon("rogue"),
    {
      id: "stroke-of-luck", level: 20, name: "Stroke of Luck", text: "Turn a failed D20 Test into a 20.",
      effects: [{ type: "resource", id: "stroke-of-luck", name: "Stroke of Luck", max: 1, recharge: "short" }],
    },
  ],
  subclasses: ROGUE_SUBCLASSES,
};
