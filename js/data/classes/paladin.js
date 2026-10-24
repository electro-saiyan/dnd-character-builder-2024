// Paladin — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, weaponMastery, extraAttack, spellcasting, HALF_PREPARED, ALL_ARMOR } from "./common.js";
import { PALADIN_SUBCLASSES } from "../subclasses/paladin.js";

export const PALADIN = {
  id: "paladin",
  name: "Paladin",
  source: "PHB 2024",
  hitDie: 10,
  primary: ["str", "cha"],
  saves: ["wis", "cha"],
  armor: ALL_ARMOR,
  weapons: ["simple", "martial"],
  tools: [],
  skills: { count: 2, from: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"] },
  equipment: {
    A: [
      { item: "chain-mail", qty: 1 },
      { item: "shield", qty: 1 },
      { item: "longsword", qty: 1 },
      { item: "javelin", qty: 6 },
      { item: "holy-symbol", qty: 1 },
      { item: "priests-pack", qty: 1 },
      { gp: 9 },
    ],
    B: [{ gp: 150 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "channel", name: "Channel Divinity" }],
  table: buildTable({ channel: run([0, 2], [2, 8], [3, 10]) }),
  spellcasting: spellcasting("cha", "half", run([0, 20]), HALF_PREPARED, "Holy Symbol"),
  features: [
    {
      id: "lay-on-hands", level: 1, name: "Lay On Hands",
      text: "Bonus Action: restore HP from a pool of 5 × Paladin level, or spend 5 to remove Poisoned.",
      effects: [{ type: "resource", id: "lay-on-hands", name: "Lay On Hands", max: { times: 5, value: "level" }, recharge: "long" }],
    },
    { id: "spellcasting", level: 1, name: "Spellcasting", text: "CHA spellcasting from the Paladin list; Holy Symbol as focus." },
    weaponMastery("paladin", 2),
    {
      id: "fighting-style", level: 2, name: "Fighting Style", text: "Gain a Fighting Style feat or Blessed Warrior.",
      effects: [{
        type: "choose", category: "option", count: 1, key: "paladin.fightingStyle",
        options: [
          {
            id: "feat", name: "Fighting Style feat", text: "",
            effects: [{ type: "choose", category: "feat", from: { category: ["fighting-style"] }, count: 1, key: "feat" }],
          },
          {
            id: "blessed-warrior", name: "Blessed Warrior", text: "Two Cleric cantrips (CHA, count as Paladin spells).",
            effects: [{ type: "choose", category: "spell", from: { list: "cleric", level: 0 }, count: 2, key: "cantrips" }],
          },
        ],
      }],
    },
    {
      id: "paladins-smite", level: 2, name: "Paladin's Smite",
      text: "Divine Smite is always prepared; cast it once per Long Rest without a slot.",
      effects: [{ type: "spell", ids: ["divine-smite"], alwaysPrepared: true }],
    },
    {
      id: "channel-divinity", level: 3, name: "Channel Divinity",
      text: "Divine Sense (Bonus Action: sense Celestials, Fiends, Undead within 60 ft for 10 min). Regain 1 on Short Rest, all on Long Rest.",
      effects: [{ type: "resource", id: "channel-divinity", name: "Channel Divinity", max: { table: "channel" }, recharge: "long", note: "regain 1 on Short Rest" }],
    },
    asi("paladin", 4),
    extraAttack(5),
    {
      id: "faithful-steed", level: 5, name: "Faithful Steed",
      text: "Find Steed is always prepared; cast it once per Long Rest without a slot.",
      effects: [{ type: "spell", ids: ["find-steed"], alwaysPrepared: true }],
    },
    {
      id: "aura-of-protection", level: 6, name: "Aura of Protection",
      text: "You and allies within 10 ft add your CHA (min +1) to saving throws.",
      effects: [{ type: "bonus", target: "save", value: { ability: "cha", min: 1 } }],
    },
    asi("paladin", 8),
    {
      id: "abjure-foes", level: 9, name: "Abjure Foes",
      text: "Channel Divinity: up to CHA-mod creatures within 60 ft make a WIS save or are Frightened for 1 minute.",
    },
    { id: "aura-of-courage", level: 10, name: "Aura of Courage", text: "You and allies in your aura are immune to Frightened." },
    { id: "radiant-strikes", level: 11, name: "Radiant Strikes", text: "Melee weapon and Unarmed Strike hits deal +1d8 Radiant." },
    asi("paladin", 12),
    {
      id: "restoring-touch", level: 14, name: "Restoring Touch",
      text: "Lay On Hands can end Blinded, Charmed, Deafened, Frightened, Paralyzed or Stunned (5 HP each).",
    },
    asi("paladin", 16),
    { id: "aura-expansion", level: 18, name: "Aura Expansion", text: "Your auras extend to 30 ft." },
    epicBoon("paladin"),
  ],
  subclasses: PALADIN_SUBCLASSES,
};
