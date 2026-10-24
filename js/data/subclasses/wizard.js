// Wizard subclasses — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable } from "../classes/common.js";

// Savant spells: 2 at level 3, +1 for each new spell slot level (3rd at Wizard 5, … 9th at 17).
// The highest slot level of a full caster is ceil(level / 2), capped at 9.
const savantCount = (lvl) => (lvl < 3 ? 0 : Math.min(9, Math.ceil(lvl / 2)));
const SAVANT = Array.from({ length: 20 }, (_, i) => savantCount(i + 1));

const savant = (school) => ({
  id: `${school.toLowerCase()}-savant`, level: 3, name: `${school} Savant`,
  text: `Add two ${school} Wizard spells (level 2 or lower) free; one more each time you gain a new slot level.`,
  effects: [{
    type: "choose", category: "spellbook", from: { list: "wizard", school: [school.toLowerCase()], minLevel: 1 },
    count: { table: "savant" }, key: `wizard.savant`,
  }],
});

export const WIZARD_SUBCLASSES = [
  {
    id: "abjurer", name: "Abjurer",
    table: buildTable({ savant: SAVANT }),
    features: [
      savant("Abjuration"),
      {
        id: "arcane-ward", level: 3, name: "Arcane Ward",
        text: "Slot Abjuration spell creates a ward (HP 2 × Wizard level + INT) that absorbs damage; recharge it with Abjuration spells or slots.",
        effects: [{ type: "resource", id: "arcane-ward", name: "Arcane Ward HP", max: { times: 2, value: "level", add: "abilityMod:int" }, recharge: "long" }],
      },
      { id: "projected-ward", level: 6, name: "Projected Ward", text: "Reaction: your ward absorbs damage to a creature within 30 ft." },
      {
        id: "spell-breaker", level: 10, name: "Spell Breaker",
        text: "Counterspell and Dispel Magic always prepared; Dispel as Bonus Action + PB; failed attempts keep the slot.",
        effects: [{ type: "spell", ids: ["counterspell", "dispel-magic"], alwaysPrepared: true }],
      },
      { id: "spell-resistance", level: 14, name: "Spell Resistance", text: "Advantage on saves vs spells; Resistance to spell damage." },
    ],
  },
  {
    id: "diviner", name: "Diviner",
    table: buildTable({ savant: SAVANT, portent: Array.from({ length: 20 }, (_, i) => (i + 1 >= 14 ? 3 : i + 1 >= 3 ? 2 : 0)) }),
    features: [
      savant("Divination"),
      {
        id: "portent", level: 3, name: "Portent",
        text: "After a Long Rest roll d20s (2; 3 at 14th); replace any visible D20 Test with one, once per turn.",
        effects: [{ type: "resource", id: "portent", name: "Portent", max: { table: "portent" }, recharge: "long" }],
      },
      {
        id: "expert-divination", level: 6, name: "Expert Divination",
        text: "Casting a Divination spell with a level 2+ slot regains a lower slot (max level 5).",
      },
      {
        id: "the-third-eye", level: 10, name: "The Third Eye",
        text: "Bonus Action until a rest: Darkvision 120 ft, read any language, or See Invisibility free. 1/Short Rest.",
        effects: [{ type: "resource", id: "the-third-eye", name: "The Third Eye", max: 1, recharge: "short" }],
      },
      { id: "greater-portent", level: 14, name: "Greater Portent", text: "Portent uses 3d20." },
    ],
  },
  {
    id: "evoker", name: "Evoker",
    table: buildTable({ savant: SAVANT }),
    features: [
      savant("Evocation"),
      { id: "potent-cantrip", level: 3, name: "Potent Cantrip", text: "Damaging cantrips deal half damage on a miss or successful save." },
      {
        id: "sculpt-spells", level: 6, name: "Sculpt Spells",
        text: "Evocation spells: 1 + spell level chosen creatures auto-succeed and take no damage on a half-damage save.",
      },
      { id: "empowered-evocation", level: 10, name: "Empowered Evocation", text: "Add INT to one damage roll of a Wizard Evocation spell." },
      {
        id: "overchannel", level: 14, name: "Overchannel",
        text: "Level 1–5 damage spell deals maximum damage; repeats before a Long Rest cost escalating Necrotic damage.",
      },
    ],
  },
  {
    id: "illusionist", name: "Illusionist",
    table: buildTable({ savant: SAVANT }),
    features: [
      savant("Illusion"),
      {
        id: "improved-illusions", level: 3, name: "Improved Illusions",
        text: "Illusion spells need no V and gain +60 ft range; you know Minor Illusion (Bonus Action, sound + image).",
        effects: [{ type: "spell", ids: ["minor-illusion"] }],
      },
      {
        id: "phantasmal-creatures", level: 6, name: "Phantasmal Creatures",
        text: "Summon Beast and Summon Fey always prepared; cast an Illusion version once per Long Rest without a slot (half HP).",
        effects: [{ type: "spell", ids: ["summon-beast", "summon-fey"], alwaysPrepared: true }],
      },
      {
        id: "illusory-self", level: 10, name: "Illusory Self",
        text: "Reaction: an attack that hits you misses instead. 1/Short Rest or a level 2+ slot.",
        effects: [{ type: "resource", id: "illusory-self", name: "Illusory Self", max: 1, recharge: "short" }],
      },
      { id: "illusory-reality", level: 14, name: "Illusory Reality", text: "Make one object in a slot Illusion spell real for 1 minute (Bonus Action)." },
    ],
  },
];
