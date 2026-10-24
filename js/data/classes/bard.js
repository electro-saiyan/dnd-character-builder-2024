// Bard — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, spellcasting, FULL_PREPARED, LIGHT_ARMOR } from "./common.js";
import { BARD_SUBCLASSES } from "../subclasses/bard.js";

export const BARD = {
  id: "bard",
  name: "Bard",
  source: "PHB 2024",
  hitDie: 8,
  primary: ["cha"],
  saves: ["dex", "cha"],
  armor: LIGHT_ARMOR,
  weapons: ["simple"],
  tools: { choose: 3, from: { toolType: ["instrument"] } },
  skills: { count: 3, from: "any" },
  equipment: {
    A: [
      { item: "leather-armor", qty: 1 },
      { item: "dagger", qty: 2 },
      { choice: "bard.instrument", qty: 1 },
      { item: "entertainers-pack", qty: 1 },
      { gp: 19 },
    ],
    B: [{ gp: 90 }],
  },
  equipmentChoices: [{ key: "bard.instrument", from: { toolType: ["instrument"] }, option: "A" }],
  subclassLevel: 3,
  saveDC: null,
  tableColumns: [{ id: "bardicDie", name: "Bardic Die" }],
  table: buildTable({ bardicDie: run(["d6", 4], ["d8", 5], ["d10", 5], ["d12", 6]) }),
  spellcasting: spellcasting("cha", "full", run([2, 3], [3, 6], [4, 11]), FULL_PREPARED, "Musical Instrument"),
  features: [
    {
      id: "bardic-inspiration", level: 1, name: "Bardic Inspiration",
      text: "Bonus Action: a creature within 60 ft gains your Bardic die to add to a failed D20 Test within 1 hour.",
      effects: [{ type: "resource", id: "bardic-inspiration", name: "Bardic Inspiration", max: { ability: "cha", min: 1 }, recharge: "long" }],
    },
    { id: "spellcasting", level: 1, name: "Spellcasting", text: "CHA spellcasting from the Bard list; Musical Instrument as focus." },
    {
      id: "expertise-2", level: 2, name: "Expertise", text: "Expertise in two of your skill proficiencies.",
      effects: [{ type: "choose", category: "expertise", from: "proficient", count: 2, key: "bard.expertise2" }],
    },
    {
      id: "jack-of-all-trades", level: 2, name: "Jack of All Trades",
      text: "Add half your Proficiency Bonus to skill checks you aren't proficient in.",
      effects: [{ type: "halfProfSkills" }],
    },
    asi("bard", 4),
    {
      id: "font-of-inspiration", level: 5, name: "Font of Inspiration",
      text: "Bardic Inspiration recharges on a Short or Long Rest; spend a spell slot to regain a use.",
      effects: [{ type: "resourceRecharge", id: "bardic-inspiration", recharge: "short" }],
    },
    {
      id: "countercharm", level: 7, name: "Countercharm",
      text: "Reaction: you or a creature within 30 ft rerolls a failed save against Charmed or Frightened with Advantage.",
    },
    asi("bard", 8),
    {
      id: "expertise-9", level: 9, name: "Expertise", text: "Expertise in two more skill proficiencies.",
      effects: [{ type: "choose", category: "expertise", from: "proficient", count: 2, key: "bard.expertise9" }],
    },
    {
      id: "magical-secrets", level: 10, name: "Magical Secrets",
      text: "Prepared spells can come from the Bard, Cleric, Druid and Wizard lists.",
    },
    asi("bard", 12),
    asi("bard", 16),
    {
      id: "superior-inspiration", level: 18, name: "Superior Inspiration",
      text: "When you roll Initiative, regain Bardic Inspiration up to 2 uses.",
    },
    epicBoon("bard"),
    {
      id: "words-of-creation", level: 20, name: "Words of Creation",
      text: "Power Word Heal and Power Word Kill always prepared; each can target a second creature within 10 ft.",
      effects: [{ type: "spell", ids: ["power-word-heal", "power-word-kill"], alwaysPrepared: true }],
    },
  ],
  subclasses: BARD_SUBCLASSES,
};
