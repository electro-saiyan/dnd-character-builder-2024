// Barbarian subclasses — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run } from "../classes/common.js";

export const BARBARIAN_SUBCLASSES = [
  {
    id: "berserker", name: "Path of the Berserker",
    features: [
      { id: "frenzy", level: 3, name: "Frenzy", text: "Reckless Attack while raging: first STR hit each turn deals extra d6s equal to your Rage Damage." },
      { id: "mindless-rage", level: 6, name: "Mindless Rage", text: "Immune to Charmed and Frightened while raging; entering Rage ends them." },
      { id: "retaliation", level: 10, name: "Retaliation", text: "Reaction: melee attack a creature within 5 ft that damages you." },
      {
        id: "intimidating-presence", level: 14, name: "Intimidating Presence",
        text: "Bonus Action: creatures in a 30-ft Emanation make a WIS save (DC 8 + STR + PB) or are Frightened for 1 minute. 1/Long Rest or spend a Rage use.",
        effects: [{ type: "resource", id: "intimidating-presence", name: "Intimidating Presence", max: 1, recharge: "long", note: "or spend a Rage use" }],
      },
    ],
  },
  {
    id: "wild-heart", name: "Path of the Wild Heart",
    features: [
      { id: "animal-speaker", level: 3, name: "Animal Speaker", text: "Cast Beast Sense and Speak with Animals as Rituals (WIS)." },
      {
        id: "rage-of-the-wilds", level: 3, name: "Rage of the Wilds",
        text: "Each Rage choose: Bear (Resistance to all but Force, Necrotic, Psychic, Radiant), Eagle (Dash/Disengage as part of the Bonus Action), Wolf (allies have Advantage vs enemies within 5 ft of you).",
      },
      {
        id: "aspect-of-the-wilds", level: 6, name: "Aspect of the Wilds",
        text: "Choose after each Long Rest: Owl (Darkvision 60 ft), Panther (Climb Speed), Salmon (Swim Speed).",
      },
      { id: "nature-speaker", level: 10, name: "Nature Speaker", text: "Cast Commune with Nature as a Ritual (WIS)." },
      {
        id: "power-of-the-wilds", level: 14, name: "Power of the Wilds",
        text: "Each Rage choose: Falcon (Fly Speed if unarmored), Lion (enemies nearby have Disadvantage on attacks vs others), Ram (melee hit can knock Prone).",
      },
    ],
  },
  {
    id: "world-tree", name: "Path of the World Tree",
    features: [
      { id: "vitality-surge", level: 3, name: "Vitality Surge", text: "Entering Rage grants Temp HP equal to your Barbarian level." },
      {
        id: "life-giving-force", level: 3, name: "Life-Giving Force",
        text: "Start of each turn while raging: a creature within 10 ft gains Temp HP = d6s equal to your Rage Damage.",
      },
      {
        id: "branches-of-the-tree", level: 6, name: "Branches of the Tree",
        text: "Reaction while raging: creature within 30 ft makes a STR save (DC 8 + STR + PB) or teleports next to you; its Speed can drop to 0.",
      },
      {
        id: "battering-roots", level: 10, name: "Battering Roots",
        text: "+10 ft reach with Heavy or Versatile melee weapons on your turn; hits can add Push or Topple mastery.",
      },
      {
        id: "travel-along-the-tree", level: 14, name: "Travel along the Tree",
        text: "On Rage and as a Bonus Action while raging, teleport 60 ft; once per Rage, 150 ft with up to six willing creatures.",
      },
    ],
  },
  {
    id: "zealot", name: "Path of the Zealot",
    table: buildTable({ zealotDice: run([0, 2], [4, 3], [5, 6], [6, 5], [7, 4]) }),
    features: [
      { id: "divine-fury", level: 3, name: "Divine Fury", text: "While raging, first hit each turn deals +1d6 + half Barbarian level Necrotic or Radiant." },
      {
        id: "warrior-of-the-gods", level: 3, name: "Warrior of the Gods",
        text: "Pool of d12s (4; 5 at 6th, 6 at 12th, 7 at 17th). Bonus Action: spend and roll dice to heal.",
        effects: [{ type: "resource", id: "warrior-of-the-gods", name: "Warrior of the Gods (d12)", max: { table: "zealotDice" }, recharge: "long" }],
      },
      { id: "fanatical-focus", level: 6, name: "Fanatical Focus", text: "Once per Rage, reroll a failed save adding your Rage Damage." },
      {
        id: "zealous-presence", level: 10, name: "Zealous Presence",
        text: "Bonus Action: up to 10 creatures within 60 ft get Advantage on attacks and saves until your next turn. 1/Long Rest or spend a Rage use.",
        effects: [{ type: "resource", id: "zealous-presence", name: "Zealous Presence", max: 1, recharge: "long", note: "or spend a Rage use" }],
      },
      {
        id: "rage-of-the-gods", level: 14, name: "Rage of the Gods",
        text: "When you Rage, 1 minute: Fly Speed, Resistance to Necrotic/Psychic/Radiant, Reaction + Rage use to set a dying ally's HP to your level. 1/Long Rest.",
        effects: [{ type: "resource", id: "rage-of-the-gods", name: "Rage of the Gods", max: 1, recharge: "long" }],
      },
    ],
  },
];
