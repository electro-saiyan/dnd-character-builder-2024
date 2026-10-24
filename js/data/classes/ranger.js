// Ranger — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, weaponMastery, extraAttack, spellcasting, HALF_PREPARED, MEDIUM_ARMOR } from "./common.js";
import { RANGER_SUBCLASSES } from "../subclasses/ranger.js";

export const RANGER = {
  id: "ranger",
  name: "Ranger",
  source: "PHB 2024",
  hitDie: 10,
  primary: ["dex", "wis"],
  saves: ["str", "dex"],
  armor: MEDIUM_ARMOR,
  weapons: ["simple", "martial"],
  tools: [],
  skills: { count: 3, from: ["animal-handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"] },
  equipment: {
    A: [
      { item: "studded-leather-armor", qty: 1 },
      { item: "scimitar", qty: 1 },
      { item: "shortsword", qty: 1 },
      { item: "longbow", qty: 1 },
      { item: "arrows", qty: 20 },
      { item: "quiver", qty: 1 },
      { item: "druidic-focus-mistletoe", qty: 1 },
      { item: "explorers-pack", qty: 1 },
      { gp: 7 },
    ],
    B: [{ gp: 150 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "favoredEnemy", name: "Favored Enemy" }],
  table: buildTable({ favoredEnemy: run([2, 4], [3, 4], [4, 4], [5, 4], [6, 4]) }),
  spellcasting: spellcasting("wis", "half", run([0, 20]), HALF_PREPARED, "Druidic Focus"),
  features: [
    { id: "spellcasting", level: 1, name: "Spellcasting", text: "WIS spellcasting from the Ranger list; Druidic Focus as focus." },
    {
      id: "favored-enemy", level: 1, name: "Favored Enemy",
      text: "Hunter's Mark always prepared; cast it without a slot a number of times per Long Rest.",
      effects: [
        { type: "spell", ids: ["hunters-mark"], alwaysPrepared: true },
        { type: "resource", id: "favored-enemy", name: "Favored Enemy", max: { table: "favoredEnemy" }, recharge: "long" },
      ],
    },
    weaponMastery("ranger", 2),
    {
      id: "deft-explorer", level: 2, name: "Deft Explorer",
      text: "Expertise in one of your skill proficiencies; learn two languages.",
      effects: [
        { type: "choose", category: "expertise", from: "proficient", count: 1, key: "ranger.deftExplorer" },
        { type: "choose", category: "language", from: "any", count: 2, key: "ranger.languages" },
      ],
    },
    {
      id: "fighting-style", level: 2, name: "Fighting Style", text: "Gain a Fighting Style feat or Druidic Warrior.",
      effects: [{
        type: "choose", category: "option", count: 1, key: "ranger.fightingStyle",
        options: [
          {
            id: "feat", name: "Fighting Style feat", text: "",
            effects: [{ type: "choose", category: "feat", from: { category: ["fighting-style"] }, count: 1, key: "feat" }],
          },
          {
            id: "druidic-warrior", name: "Druidic Warrior", text: "Two Druid cantrips (WIS, count as Ranger spells).",
            effects: [{ type: "choose", category: "spell", from: { list: "druid", level: 0 }, count: 2, key: "cantrips" }],
          },
        ],
      }],
    },
    asi("ranger", 4),
    extraAttack(5),
    {
      id: "roving", level: 6, name: "Roving",
      text: "+10 ft Speed while not in Heavy armor; Climb and Swim Speed equal to your Speed.",
      effects: [{ type: "bonus", target: "speed", value: 10, noHeavyArmor: true }],
    },
    asi("ranger", 8),
    {
      id: "expertise", level: 9, name: "Expertise", text: "Expertise in two more skill proficiencies.",
      effects: [{ type: "choose", category: "expertise", from: "proficient", count: 2, key: "ranger.expertise9" }],
    },
    {
      id: "tireless", level: 10, name: "Tireless",
      text: "Magic action: gain 1d8 + WIS Temp HP (WIS-mod uses per Long Rest); Short Rests reduce Exhaustion by 1.",
      effects: [{ type: "resource", id: "tireless", name: "Tireless", max: { ability: "wis", min: 1 }, recharge: "long" }],
    },
    asi("ranger", 12),
    { id: "relentless-hunter", level: 13, name: "Relentless Hunter", text: "Damage can't break your Concentration on Hunter's Mark." },
    {
      id: "natures-veil", level: 14, name: "Nature's Veil",
      text: "Bonus Action: Invisible until the end of your next turn.",
      effects: [{ type: "resource", id: "natures-veil", name: "Nature's Veil", max: { ability: "wis", min: 1 }, recharge: "long" }],
    },
    asi("ranger", 16),
    { id: "precise-hunter", level: 17, name: "Precise Hunter", text: "Advantage on attacks against the target of your Hunter's Mark." },
    { id: "feral-senses", level: 18, name: "Feral Senses", text: "Blindsight 30 ft." },
    epicBoon("ranger"),
    { id: "foe-slayer", level: 20, name: "Foe Slayer", text: "Hunter's Mark damage die becomes a d10." },
  ],
  subclasses: RANGER_SUBCLASSES,
};
