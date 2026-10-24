// Sorcerer — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, spellcasting } from "./common.js";
import { SORCERER_SUBCLASSES } from "../subclasses/sorcerer.js";

export const SORCERER = {
  id: "sorcerer",
  name: "Sorcerer",
  source: "PHB 2024",
  hitDie: 6,
  primary: ["cha"],
  saves: ["con", "cha"],
  armor: [],
  weapons: ["simple"],
  tools: [],
  skills: { count: 2, from: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"] },
  equipment: {
    A: [
      { item: "spear", qty: 1 },
      { item: "dagger", qty: 2 },
      { item: "arcane-focus-crystal", qty: 1 },
      { item: "dungeoneers-pack", qty: 1 },
      { gp: 28 },
    ],
    B: [{ gp: 50 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "sorceryPoints", name: "Sorcery Points" }],
  table: buildTable({ sorceryPoints: Array.from({ length: 20 }, (_, i) => (i === 0 ? 0 : i + 1)) }),
  spellcasting: spellcasting(
    "cha", "full",
    run([4, 3], [5, 6], [6, 11]),
    [2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
    "Arcane Focus",
  ),
  features: [
    { id: "spellcasting", level: 1, name: "Spellcasting", text: "CHA spellcasting from the Sorcerer list; Arcane Focus as focus." },
    {
      id: "innate-sorcery", level: 1, name: "Innate Sorcery",
      text: "Bonus Action for 1 minute: +1 Sorcerer spell save DC and Advantage on Sorcerer spell attacks.",
      effects: [{ type: "resource", id: "innate-sorcery", name: "Innate Sorcery", max: 2, recharge: "long" }],
    },
    {
      id: "font-of-magic", level: 2, name: "Font of Magic",
      text: "Convert spell slots to Sorcery Points (slot level) and back (1st 2 SP, 2nd 3, 3rd 5, 4th 6, 5th 7).",
      effects: [{ type: "resource", id: "sorcery-points", name: "Sorcery Points", max: { table: "sorceryPoints" }, recharge: "long" }],
    },
    {
      id: "metamagic", level: 2, name: "Metamagic",
      text: "Learn 2 Metamagic options (+2 at 10th and 17th); one per spell unless stated.",
      effects: [{ type: "choose", category: "metamagic", from: "any", count: 2, key: "sorcerer.metamagic2" }],
    },
    asi("sorcerer", 4),
    {
      id: "sorcerous-restoration", level: 5, name: "Sorcerous Restoration",
      text: "On a Short Rest, regain Sorcery Points up to half your Sorcerer level. 1/Long Rest.",
    },
    {
      id: "sorcery-incarnate", level: 7, name: "Sorcery Incarnate",
      text: "Spend 2 SP to activate Innate Sorcery with no uses left; while active, use two Metamagic options per spell.",
    },
    asi("sorcerer", 8),
    {
      id: "metamagic-10", level: 10, name: "Metamagic", text: "Learn 2 more Metamagic options.",
      effects: [{ type: "choose", category: "metamagic", from: "any", count: 2, key: "sorcerer.metamagic10" }],
    },
    asi("sorcerer", 12),
    asi("sorcerer", 16),
    {
      id: "metamagic-17", level: 17, name: "Metamagic", text: "Learn 2 more Metamagic options.",
      effects: [{ type: "choose", category: "metamagic", from: "any", count: 2, key: "sorcerer.metamagic17" }],
    },
    epicBoon("sorcerer"),
    {
      id: "arcane-apotheosis", level: 20, name: "Arcane Apotheosis",
      text: "While Innate Sorcery is active, one Metamagic option per turn costs no Sorcery Points.",
    },
  ],
  subclasses: SORCERER_SUBCLASSES,
};
