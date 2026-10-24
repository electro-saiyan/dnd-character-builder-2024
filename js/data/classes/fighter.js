// Fighter — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, weaponMastery, ALL_ARMOR } from "./common.js";
import { FIGHTER_SUBCLASSES } from "../subclasses/fighter.js";

export const FIGHTER = {
  id: "fighter",
  name: "Fighter",
  source: "PHB 2024",
  hitDie: 10,
  primary: ["str", "dex"],
  saves: ["str", "con"],
  armor: ALL_ARMOR,
  weapons: ["simple", "martial"],
  tools: [],
  skills: {
    count: 2,
    from: ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "persuasion", "perception", "survival"],
  },
  equipment: {
    A: [
      { item: "chain-mail", qty: 1 },
      { item: "greatsword", qty: 1 },
      { item: "flail", qty: 1 },
      { item: "javelin", qty: 8 },
      { item: "dungeoneers-pack", qty: 1 },
      { gp: 4 },
    ],
    B: [
      { item: "studded-leather-armor", qty: 1 },
      { item: "scimitar", qty: 1 },
      { item: "shortsword", qty: 1 },
      { item: "longbow", qty: 1 },
      { item: "arrows", qty: 20 },
      { item: "quiver", qty: 1 },
      { item: "dungeoneers-pack", qty: 1 },
      { gp: 11 },
    ],
    C: [{ gp: 155 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [
    { id: "secondWind", name: "Second Wind" },
    { id: "mastery", name: "Weapon Mastery" },
  ],
  table: buildTable({
    secondWind: run([2, 3], [3, 6], [4, 11]),
    mastery: run([3, 3], [4, 6], [5, 6], [6, 5]),
    actionSurge: run([0, 1], [1, 15], [2, 4]),
    indomitable: run([0, 8], [1, 4], [2, 4], [3, 4]),
  }),
  spellcasting: null,
  features: [
    {
      id: "fighting-style", level: 1, name: "Fighting Style",
      text: "Gain a Fighting Style feat; you can swap it whenever you gain a Fighter level.",
      effects: [{ type: "choose", category: "feat", from: { category: ["fighting-style"] }, count: 1, key: "fighter.fightingStyle" }],
    },
    {
      id: "second-wind", level: 1, name: "Second Wind",
      text: "Bonus Action: regain 1d10 + Fighter level HP. Regain 1 use on Short Rest, all on Long Rest.",
      effects: [{ type: "resource", id: "second-wind", name: "Second Wind", max: { table: "secondWind" }, recharge: "long", note: "regain 1 on Short Rest" }],
    },
    weaponMastery("fighter", { table: "mastery" }),
    {
      id: "action-surge", level: 2, name: "Action Surge",
      text: "Take one extra action (not Magic) on your turn. 2 uses from level 17, one per turn.",
      effects: [{ type: "resource", id: "action-surge", name: "Action Surge", max: { table: "actionSurge" }, recharge: "short" }],
    },
    {
      id: "tactical-mind", level: 2, name: "Tactical Mind",
      text: "On a failed ability check, spend Second Wind to add 1d10; not spent if it still fails.",
    },
    asi("fighter", 4),
    { id: "extra-attack", level: 5, name: "Extra Attack", text: "Attack twice when you take the Attack action." },
    {
      id: "tactical-shift", level: 5, name: "Tactical Shift",
      text: "When you use Second Wind, move up to half your Speed without provoking Opportunity Attacks.",
    },
    asi("fighter", 6),
    asi("fighter", 8),
    {
      id: "indomitable", level: 9, name: "Indomitable",
      text: "Reroll a failed save, adding your Fighter level. 2 uses at 13th, 3 at 17th.",
      effects: [{ type: "resource", id: "indomitable", name: "Indomitable", max: { table: "indomitable" }, recharge: "long" }],
    },
    {
      id: "tactical-master", level: 9, name: "Tactical Master",
      text: "When attacking with a mastery weapon, you can use Push, Sap or Slow instead of its property.",
    },
    { id: "two-extra-attacks", level: 11, name: "Two Extra Attacks", text: "Attack three times when you take the Attack action." },
    asi("fighter", 12),
    {
      id: "studied-attacks", level: 13, name: "Studied Attacks",
      text: "After missing a creature, Advantage on your next attack against it before the end of your next turn.",
    },
    asi("fighter", 14),
    asi("fighter", 16),
    epicBoon("fighter"),
    { id: "three-extra-attacks", level: 20, name: "Three Extra Attacks", text: "Attack four times when you take the Attack action." },
  ],
  subclasses: FIGHTER_SUBCLASSES,
};
