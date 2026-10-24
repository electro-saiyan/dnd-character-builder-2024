// Wizard — PHB 2024. Feature text is a short summary, not the book's wording.
import { run, asi, epicBoon, spellcasting } from "./common.js";
import { WIZARD_SUBCLASSES } from "../subclasses/wizard.js";

export const WIZARD = {
  id: "wizard",
  name: "Wizard",
  source: "PHB 2024",
  hitDie: 6,
  primary: ["int"],
  saves: ["int", "wis"],
  armor: [],
  weapons: ["simple"],
  tools: [],
  skills: { count: 2, from: ["arcana", "history", "insight", "investigation", "medicine", "nature", "religion"] },
  equipment: {
    A: [
      { item: "dagger", qty: 2 },
      { item: "arcane-focus-staff", qty: 1 },
      { item: "robe", qty: 1 },
      { item: "spellbook", qty: 1 },
      { item: "scholars-pack", qty: 1 },
      { gp: 5 },
    ],
    B: [{ gp: 55 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [],
  table: {},
  spellcasting: {
    ...spellcasting(
      "int", "full",
      run([3, 3], [4, 6], [5, 11]),
      [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25],
      "Arcane Focus or Spellbook",
    ),
    // Prepared spells come from the spellbook: 6 level 1 spells, +2 per Wizard level after 1st.
    spellbook: { start: 6, perLevel: 2 },
  },
  features: [
    {
      id: "spellcasting", level: 1, name: "Spellcasting",
      text: "INT spellcasting; spellbook starts with 6 level 1 spells, +2 per Wizard level. Prepare from the spellbook.",
    },
    { id: "ritual-adept", level: 1, name: "Ritual Adept", text: "Cast Ritual spells from your spellbook as rituals without preparing them." },
    {
      id: "arcane-recovery", level: 1, name: "Arcane Recovery",
      text: "On a Short Rest, recover slots totaling up to half your Wizard level (round up), none 6th+. 1/Long Rest.",
      effects: [{ type: "resource", id: "arcane-recovery", name: "Arcane Recovery", max: 1, recharge: "long" }],
    },
    {
      id: "scholar", level: 2, name: "Scholar",
      text: "Expertise in Arcana, History, Investigation, Medicine, Nature or Religion (one you're proficient in).",
      effects: [{
        type: "choose", category: "expertise", count: 1, key: "wizard.scholar",
        from: ["arcana", "history", "investigation", "medicine", "nature", "religion"],
      }],
    },
    asi("wizard", 4),
    {
      id: "memorize-spell", level: 5, name: "Memorize Spell",
      text: "On a Short Rest, swap one prepared spell for another from your spellbook.",
    },
    asi("wizard", 8),
    asi("wizard", 12),
    asi("wizard", 16),
    {
      id: "spell-mastery", level: 18, name: "Spell Mastery",
      text: "A level 1 and a level 2 spell (Action casting time) are always prepared and castable at lowest level without a slot.",
      effects: [1, 2].map((lvl) => ({
        type: "choose", category: "spell", from: { spellbook: true, level: lvl, castingTime: "Action" },
        count: 1, alwaysPrepared: true, key: `wizard.mastery${lvl}`,
      })),
    },
    epicBoon("wizard"),
    {
      id: "signature-spells", level: 20, name: "Signature Spells",
      text: "Two level 3 spells always prepared; cast each once at level 3 without a slot per Short or Long Rest.",
      effects: [{ type: "choose", category: "spell", from: { spellbook: true, level: 3 }, count: 2, alwaysPrepared: true, key: "wizard.signature" }],
    },
  ],
  subclasses: WIZARD_SUBCLASSES,
};
