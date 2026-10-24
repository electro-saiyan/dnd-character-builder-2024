// Druid — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, spellcasting, FULL_PREPARED } from "./common.js";
import { DRUID_SUBCLASSES } from "../subclasses/druid.js";

export const DRUID = {
  id: "druid",
  name: "Druid",
  source: "PHB 2024",
  hitDie: 8,
  primary: ["wis"],
  saves: ["int", "wis"],
  armor: ["light", "shield"],
  weapons: ["simple"],
  tools: ["herbalism-kit"],
  skills: { count: 2, from: ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"] },
  equipment: {
    A: [
      { item: "leather-armor", qty: 1 },
      { item: "shield", qty: 1 },
      { item: "sickle", qty: 1 },
      { item: "druidic-focus-staff", qty: 1 },
      { item: "explorers-pack", qty: 1 },
      { item: "herbalism-kit", qty: 1 },
      { gp: 9 },
    ],
    B: [{ gp: 50 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "wildShape", name: "Wild Shape" }],
  table: buildTable({ wildShape: run([0, 1], [2, 4], [3, 11], [4, 4]) }),
  spellcasting: spellcasting("wis", "full", run([2, 3], [3, 6], [4, 11]), FULL_PREPARED, "Druidic Focus"),
  features: [
    { id: "spellcasting", level: 1, name: "Spellcasting", text: "WIS spellcasting from the Druid list; Druidic Focus as focus." },
    {
      id: "druidic", level: 1, name: "Druidic",
      text: "You know Druidic; Speak with Animals is always prepared.",
      effects: [
        { type: "prof", category: "language", ids: ["druidic"] },
        { type: "spell", ids: ["speak-with-animals"], alwaysPrepared: true },
      ],
    },
    {
      id: "primal-order", level: 1, name: "Primal Order", text: "Choose Magician or Warden.",
      effects: [{
        type: "choose", category: "option", count: 1, key: "druid.primalOrder",
        options: [
          {
            id: "magician", name: "Magician", text: "One extra Druid cantrip; add WIS (min +1) to Arcana and Nature checks.",
            effects: [
              { type: "bonus", target: "cantrips", value: 1 },
              { type: "bonus", target: "skill:arcana", value: { ability: "wis", min: 1 } },
              { type: "bonus", target: "skill:nature", value: { ability: "wis", min: 1 } },
            ],
          },
          {
            id: "warden", name: "Warden", text: "Martial weapon proficiency and Medium armor training.",
            effects: [{ type: "prof", category: "weapon", ids: ["martial"] }, { type: "prof", category: "armor", ids: ["medium"] }],
          },
        ],
      }],
    },
    {
      id: "wild-shape", level: 2, name: "Wild Shape",
      text: "Bonus Action: become a known Beast for hours = half Druid level; gain Temp HP = Druid level. Known forms: 4 (CR 1/4, no Fly), 6 at 4th (CR 1/2), 8 at 8th (CR 1, Fly). Regain 1 on Short Rest, all on Long Rest.",
      effects: [{ type: "resource", id: "wild-shape", name: "Wild Shape", max: { table: "wildShape" }, recharge: "long", note: "regain 1 on Short Rest" }],
    },
    {
      id: "wild-companion", level: 2, name: "Wild Companion",
      text: "Spend a spell slot or Wild Shape use to cast Find Familiar without Material components (Fey familiar).",
    },
    asi("druid", 4),
    {
      id: "wild-resurgence", level: 5, name: "Wild Resurgence",
      text: "With no Wild Shape uses, spend a spell slot to regain one; or spend a use for a level 1 slot (1/Long Rest).",
    },
    {
      id: "elemental-fury", level: 7, name: "Elemental Fury", text: "Choose Potent Spellcasting or Primal Strike.",
      effects: [{
        type: "choose", category: "option", count: 1, key: "druid.elementalFury",
        options: [
          { id: "potent-spellcasting", name: "Potent Spellcasting", text: "Add WIS to Druid cantrip damage; at level 15, cantrips with 10+ ft range gain +300 ft." },
          { id: "primal-strike", name: "Primal Strike", text: "Once per turn on a weapon or Beast-form hit, +1d8 Cold, Fire, Lightning or Thunder (2d8 at level 15)." },
        ],
      }],
    },
    asi("druid", 8),
    asi("druid", 12),
    {
      id: "improved-elemental-fury", level: 15, name: "Improved Elemental Fury",
      text: "Potent Spellcasting: +300 ft cantrip range; Primal Strike: 2d8.",
    },
    asi("druid", 16),
    {
      id: "beast-spells", level: 18, name: "Beast Spells",
      text: "Cast spells in Beast form, except ones with a costly or consumed Material component.",
    },
    epicBoon("druid"),
    {
      id: "archdruid", level: 20, name: "Archdruid",
      text: "Regain a Wild Shape use on Initiative if you have none; convert Wild Shape uses into a spell slot (2 levels each, 1/Long Rest); age slowly.",
    },
  ],
  subclasses: DRUID_SUBCLASSES,
};
