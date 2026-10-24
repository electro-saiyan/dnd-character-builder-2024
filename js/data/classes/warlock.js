// Warlock — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, spellcasting, LIGHT_ARMOR } from "./common.js";
import { WARLOCK_SUBCLASSES } from "../subclasses/warlock.js";

const arcanum = (level, spellLevel) => ({
  id: `mystic-arcanum-${spellLevel}`, level, name: `Mystic Arcanum (level ${spellLevel})`,
  text: `Choose a level ${spellLevel} Warlock spell; cast it once per Long Rest without a slot.`,
  effects: [{ type: "choose", category: "spell", from: { list: "warlock", level: spellLevel }, count: 1, key: `warlock.arcanum${spellLevel}` }],
});

export const WARLOCK = {
  id: "warlock",
  name: "Warlock",
  source: "PHB 2024",
  hitDie: 8,
  primary: ["cha"],
  saves: ["wis", "cha"],
  armor: LIGHT_ARMOR,
  weapons: ["simple"],
  tools: [],
  skills: { count: 2, from: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"] },
  equipment: {
    A: [
      { item: "leather-armor", qty: 1 },
      { item: "sickle", qty: 1 },
      { item: "dagger", qty: 2 },
      { item: "arcane-focus-orb", qty: 1 },
      { item: "book", qty: 1 },
      { item: "scholars-pack", qty: 1 },
      { gp: 15 },
    ],
    B: [{ gp: 100 }],
  },
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "invocations", name: "Eldritch Invocations" }],
  table: buildTable({ invocations: [1, 3, 3, 3, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10] }),
  spellcasting: spellcasting(
    "cha", "pact",
    run([2, 3], [3, 6], [4, 11]),
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    "Arcane Focus",
  ),
  features: [
    {
      id: "eldritch-invocations", level: 1, name: "Eldritch Invocations",
      text: "Gain Eldritch Invocations (count per table); replace one when you gain a Warlock level.",
      effects: [{ type: "choose", category: "invocation", from: "any", count: { table: "invocations" }, key: "warlock.invocations" }],
    },
    {
      id: "pact-magic", level: 1, name: "Pact Magic",
      text: "CHA spellcasting; all slots are the same level and recharge on a Short or Long Rest.",
    },
    {
      id: "magical-cunning", level: 2, name: "Magical Cunning",
      text: "1-minute rite: regain up to half your Pact Magic slots (round up). 1/Long Rest.",
      effects: [{ type: "resource", id: "magical-cunning", name: "Magical Cunning", max: 1, recharge: "long" }],
    },
    asi("warlock", 4),
    asi("warlock", 8),
    {
      id: "contact-patron", level: 9, name: "Contact Patron",
      text: "Contact Other Plane always prepared; cast it once per Long Rest without a slot and auto-succeed on its save.",
      effects: [{ type: "spell", ids: ["contact-other-plane"], alwaysPrepared: true }],
    },
    arcanum(11, 6),
    asi("warlock", 12),
    arcanum(13, 7),
    arcanum(15, 8),
    asi("warlock", 16),
    arcanum(17, 9),
    epicBoon("warlock"),
    { id: "eldritch-master", level: 20, name: "Eldritch Master", text: "Magical Cunning restores all expended Pact Magic slots." },
  ],
  subclasses: WARLOCK_SUBCLASSES,
};
