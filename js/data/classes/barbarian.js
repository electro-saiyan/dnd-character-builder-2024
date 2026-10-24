// Barbarian — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, weaponMastery, extraAttack, MEDIUM_ARMOR } from "./common.js";
import { BARBARIAN_SUBCLASSES } from "../subclasses/barbarian.js";

const SKILLS = ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"];

export const BARBARIAN = {
  id: "barbarian",
  name: "Barbarian",
  source: "PHB 2024",
  hitDie: 12,
  primary: ["str"],
  saves: ["str", "con"],
  armor: MEDIUM_ARMOR,
  weapons: ["simple", "martial"],
  tools: [],
  skills: { count: 2, from: SKILLS },
  equipment: {
    A: [{ item: "greataxe", qty: 1 }, { item: "handaxe", qty: 4 }, { item: "explorers-pack", qty: 1 }, { gp: 15 }],
    B: [{ gp: 75 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [
    { id: "rages", name: "Rages" },
    { id: "rageDamage", name: "Rage Damage", prefix: "+" },
    { id: "mastery", name: "Weapon Mastery" },
  ],
  table: buildTable({
    rages: run([2, 2], [3, 3], [4, 6], [5, 5], [6, 4]),
    rageDamage: run([2, 8], [3, 7], [4, 5]),
    mastery: run([2, 3], [3, 6], [4, 11]),
  }),
  spellcasting: null,
  features: [
    {
      id: "rage", level: 1, name: "Rage",
      text: "Bonus Action (not in Heavy armor): Resistance to B/P/S, + Rage Damage on STR attacks, Advantage on STR checks/saves; no spells or Concentration. Regain 1 use on Short Rest, all on Long Rest.",
      effects: [{ type: "resource", id: "rage", name: "Rage", max: { table: "rages" }, recharge: "long", note: "regain 1 on Short Rest" }],
    },
    {
      id: "unarmored-defense", level: 1, name: "Unarmored Defense",
      text: "Without armor, AC = 10 + DEX + CON. A Shield still applies.",
      effects: [{ type: "acFormula", base: 10, add: ["dex", "con"], noArmor: true }],
    },
    weaponMastery("barbarian", { table: "mastery" }, { kind: "weapon", type: "melee" }),
    { id: "danger-sense", level: 2, name: "Danger Sense", text: "Advantage on DEX saves unless Incapacitated." },
    {
      id: "reckless-attack", level: 2, name: "Reckless Attack",
      text: "On your first attack of the turn, gain Advantage on STR attacks; attacks against you have Advantage until your next turn.",
    },
    {
      id: "primal-knowledge", level: 3, name: "Primal Knowledge",
      text: "One more Barbarian skill. While raging, use STR for Acrobatics, Intimidation, Perception, Stealth or Survival checks.",
      effects: [{ type: "choose", category: "skill", from: SKILLS, count: 1, key: "barbarian.primalKnowledge" }],
    },
    asi("barbarian", 4),
    extraAttack(5),
    {
      id: "fast-movement", level: 5, name: "Fast Movement", text: "+10 ft Speed while not in Heavy armor.",
      effects: [{ type: "bonus", target: "speed", value: 10, noHeavyArmor: true }],
    },
    { id: "feral-instinct", level: 7, name: "Feral Instinct", text: "Advantage on Initiative rolls." },
    { id: "instinctive-pounce", level: 7, name: "Instinctive Pounce", text: "When you Rage, move up to half your Speed." },
    asi("barbarian", 8),
    {
      id: "brutal-strike", level: 9, name: "Brutal Strike",
      text: "Give up Reckless Attack's Advantage on one STR attack: on a hit +1d10 damage and Forceful Blow (push 15 ft) or Hamstring Blow (−15 ft Speed).",
    },
    {
      id: "relentless-rage", level: 11, name: "Relentless Rage",
      text: "At 0 HP while raging, DC 10 CON save to drop to 2 × Barbarian level HP instead; DC +5 per use, resets on a rest.",
    },
    asi("barbarian", 12),
    {
      id: "improved-brutal-strike-13", level: 13, name: "Improved Brutal Strike",
      text: "New Brutal Strike options: Staggering Blow (Disadvantage on next save, no Opportunity Attacks) and Sundering Blow (+5 to next attack by another creature).",
    },
    {
      id: "persistent-rage", level: 15, name: "Persistent Rage",
      text: "On Initiative regain all Rage uses (1/Long Rest). Rage lasts 10 minutes without needing to be extended.",
    },
    asi("barbarian", 16),
    {
      id: "improved-brutal-strike-17", level: 17, name: "Improved Brutal Strike",
      text: "Brutal Strike deals +2d10 and can apply two different effects.",
    },
    {
      id: "indomitable-might", level: 18, name: "Indomitable Might",
      text: "If a STR check or save total is lower than your STR score, use the score instead.",
    },
    epicBoon("barbarian"),
    {
      id: "primal-champion", level: 20, name: "Primal Champion",
      text: "STR and CON increase by 4, to a maximum of 25.",
      effects: [{ type: "ability", ids: ["str", "con"], value: 4, max: 25 }],
    },
  ],
  subclasses: BARBARIAN_SUBCLASSES,
};
