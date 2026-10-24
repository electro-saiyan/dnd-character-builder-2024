// Cleric — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, spellcasting, FULL_PREPARED, MEDIUM_ARMOR } from "./common.js";
import { CLERIC_SUBCLASSES } from "../subclasses/cleric.js";

export const CLERIC = {
  id: "cleric",
  name: "Cleric",
  source: "PHB 2024",
  hitDie: 8,
  primary: ["wis"],
  saves: ["wis", "cha"],
  armor: MEDIUM_ARMOR,
  weapons: ["simple"],
  tools: [],
  skills: { count: 2, from: ["history", "insight", "medicine", "persuasion", "religion"] },
  equipment: {
    A: [
      { item: "chain-shirt", qty: 1 },
      { item: "shield", qty: 1 },
      { item: "mace", qty: 1 },
      { item: "holy-symbol", qty: 1 },
      { item: "priests-pack", qty: 1 },
      { gp: 7 },
    ],
    B: [{ gp: 110 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "channel", name: "Channel Divinity" }],
  table: buildTable({ channel: run([0, 1], [2, 4], [3, 12], [4, 3]) }),
  spellcasting: spellcasting("wis", "full", run([3, 3], [4, 6], [5, 11]), FULL_PREPARED, "Holy Symbol"),
  features: [
    { id: "spellcasting", level: 1, name: "Spellcasting", text: "WIS spellcasting from the Cleric list; Holy Symbol as focus." },
    {
      id: "divine-order", level: 1, name: "Divine Order", text: "Choose Protector or Thaumaturge.",
      effects: [{
        type: "choose", category: "option", count: 1, key: "cleric.divineOrder",
        options: [
          {
            id: "protector", name: "Protector", text: "Martial weapon proficiency and Heavy armor training.",
            effects: [{ type: "prof", category: "weapon", ids: ["martial"] }, { type: "prof", category: "armor", ids: ["heavy"] }],
          },
          {
            id: "thaumaturge", name: "Thaumaturge", text: "One extra Cleric cantrip; add WIS (min +1) to Arcana and Religion checks.",
            effects: [
              { type: "bonus", target: "cantrips", value: 1 },
              { type: "bonus", target: "skill:arcana", value: { ability: "wis", min: 1 } },
              { type: "bonus", target: "skill:religion", value: { ability: "wis", min: 1 } },
            ],
          },
        ],
      }],
    },
    {
      id: "channel-divinity", level: 2, name: "Channel Divinity",
      text: "Divine Spark (heal or 1d8 + WIS Necrotic/Radiant, CON save half) or Turn Undead (WIS save or Frightened). Regain 1 on Short Rest, all on Long Rest.",
      effects: [{ type: "resource", id: "channel-divinity", name: "Channel Divinity", max: { table: "channel" }, recharge: "long", note: "regain 1 on Short Rest" }],
    },
    asi("cleric", 4),
    {
      id: "sear-undead", level: 5, name: "Sear Undead",
      text: "Turn Undead also deals WIS-mod d8s (min 1) Radiant damage to Undead that fail the save.",
    },
    {
      id: "blessed-strikes", level: 7, name: "Blessed Strikes", text: "Choose Divine Strike or Potent Spellcasting.",
      effects: [{
        type: "choose", category: "option", count: 1, key: "cleric.blessedStrikes",
        options: [
          { id: "divine-strike", name: "Divine Strike", text: "Once per turn on a weapon hit, +1d8 Necrotic or Radiant (2d8 at level 14)." },
          { id: "potent-spellcasting", name: "Potent Spellcasting", text: "Add WIS to Cleric cantrip damage; at level 14, damaging cantrips grant 2 × WIS Temp HP." },
        ],
      }],
    },
    asi("cleric", 8),
    {
      id: "divine-intervention", level: 10, name: "Divine Intervention",
      text: "Magic action: cast a Cleric spell of level 5 or lower without a slot or Material components. 1/Long Rest.",
      effects: [{ type: "resource", id: "divine-intervention", name: "Divine Intervention", max: 1, recharge: "long" }],
    },
    asi("cleric", 12),
    {
      id: "improved-blessed-strikes", level: 14, name: "Improved Blessed Strikes",
      text: "Divine Strike becomes 2d8; Potent Spellcasting also grants Temp HP equal to 2 × WIS.",
    },
    asi("cleric", 16),
    epicBoon("cleric"),
    {
      id: "greater-divine-intervention", level: 20, name: "Greater Divine Intervention",
      text: "Divine Intervention can cast Wish; afterwards unusable for 2d4 Long Rests.",
    },
  ],
  subclasses: CLERIC_SUBCLASSES,
};
