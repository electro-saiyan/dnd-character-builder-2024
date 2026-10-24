// Fighter subclasses — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, spellcasting } from "../classes/common.js";

const FIGHTER_SKILLS = ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "persuasion", "perception", "survival"];

// Eldritch Knight / Arcane Trickster: third-caster slots, 2 cantrips (+1 at 10th).
export const THIRD_CANTRIPS = run([0, 2], [2, 7], [3, 11]);
export const THIRD_PREPARED = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13];

export const FIGHTER_SUBCLASSES = [
  {
    id: "battle-master", name: "Battle Master",
    table: buildTable({
      supDice: run([0, 2], [4, 4], [5, 8], [6, 6]),
      supDie: run([null, 2], ["1d8", 7], ["1d10", 8], ["1d12", 3]),
      maneuvers: run([0, 2], [3, 4], [5, 3], [7, 5], [9, 6]),
    }),
    saveDC: { ability: ["str", "dex"], name: "Maneuver Save DC" },
    features: [
      {
        id: "combat-superiority", level: 3, name: "Combat Superiority",
        text: "Learn maneuvers and gain Superiority Dice (4d8, 5 at 7th, 6 at 15th; d10 at 10th, d12 at 18th). One maneuver per attack. Save DC 8 + STR or DEX + PB.",
        effects: [
          { type: "resource", id: "superiority-dice", name: "Superiority Dice", max: { table: "supDice" }, die: { table: "supDie" }, recharge: "short" },
          { type: "choose", category: "maneuver", from: "any", count: { table: "maneuvers" }, key: "battleMaster.maneuvers" },
        ],
      },
      {
        id: "student-of-war", level: 3, name: "Student of War",
        text: "Proficiency with one Artisan's Tools and one Fighter skill.",
        effects: [
          { type: "choose", category: "tool", from: { toolType: ["artisan"] }, count: 1, key: "battleMaster.tool" },
          { type: "choose", category: "skill", from: FIGHTER_SKILLS, count: 1, key: "battleMaster.skill" },
        ],
      },
      {
        id: "know-your-enemy", level: 7, name: "Know Your Enemy",
        text: "Bonus Action: learn a creature's Immunities, Resistances and Vulnerabilities within 30 ft. 1/Long Rest or spend a Superiority Die.",
      },
      { id: "improved-combat-superiority", level: 10, name: "Improved Combat Superiority", text: "Superiority Dice become d10s." },
      { id: "relentless", level: 15, name: "Relentless", text: "Once per turn, use a maneuver with a 1d8 instead of spending a Superiority Die." },
      { id: "ultimate-combat-superiority", level: 18, name: "Ultimate Combat Superiority", text: "Superiority Dice become d12s." },
    ],
  },
  {
    id: "champion", name: "Champion",
    features: [
      { id: "improved-critical", level: 3, name: "Improved Critical", text: "Weapon and Unarmed Strike attacks crit on 19–20." },
      {
        id: "remarkable-athlete", level: 3, name: "Remarkable Athlete",
        text: "Advantage on Initiative and Athletics; after a crit, move half Speed without provoking.",
      },
      {
        id: "additional-fighting-style", level: 7, name: "Additional Fighting Style", text: "Gain another Fighting Style feat.",
        effects: [{ type: "choose", category: "feat", from: { category: ["fighting-style"] }, count: 1, key: "champion.fightingStyle" }],
      },
      { id: "heroic-warrior", level: 10, name: "Heroic Warrior", text: "In combat, gain Heroic Inspiration at the start of your turn if you lack it." },
      { id: "superior-critical", level: 15, name: "Superior Critical", text: "Weapon and Unarmed Strike attacks crit on 18–20." },
      {
        id: "survivor", level: 18, name: "Survivor",
        text: "Advantage on Death Saves (18–20 counts as 20); while Bloodied, regain 5 + CON HP at the start of each turn.",
      },
    ],
  },
  {
    id: "eldritch-knight", name: "Eldritch Knight",
    spellcasting: { ...spellcasting("int", "third", THIRD_CANTRIPS, THIRD_PREPARED, "Arcane Focus"), list: "wizard" },
    features: [
      { id: "spellcasting", level: 3, name: "Spellcasting", text: "INT spellcasting from the Wizard list; Arcane Focus as focus." },
      { id: "war-bond", level: 3, name: "War Bond", text: "Bond up to two weapons: can't be disarmed; summon one as a Bonus Action." },
      { id: "war-magic", level: 7, name: "War Magic", text: "Replace one attack of the Attack action with an Action Wizard cantrip." },
      { id: "eldritch-strike", level: 10, name: "Eldritch Strike", text: "A weapon hit gives the target Disadvantage on its next save vs your spell before your next turn ends." },
      { id: "arcane-charge", level: 15, name: "Arcane Charge", text: "When you Action Surge, teleport up to 30 ft." },
      { id: "improved-war-magic", level: 18, name: "Improved War Magic", text: "Replace two attacks with a level 1 or 2 Action Wizard spell." },
    ],
  },
  {
    id: "psi-warrior", name: "Psi Warrior",
    table: buildTable({
      psiDice: run([0, 2], [4, 2], [6, 4], [8, 4], [10, 4], [12, 4]),
      psiDie: run([null, 2], ["1d6", 2], ["1d8", 6], ["1d10", 6], ["1d12", 4]),
    }),
    saveDC: { ability: "int", name: "Psionic Save DC" },
    features: [
      {
        id: "psionic-power", level: 3, name: "Psionic Power",
        text: "Psionic Energy Dice fuel powers. Regain 1 on a Short Rest, all on a Long Rest.",
        effects: [{
          type: "resource", id: "psionic-energy", name: "Psionic Energy", max: { table: "psiDice" }, die: { table: "psiDie" },
          recharge: "long", note: "regain 1 on Short Rest",
        }],
      },
      { id: "protective-field", level: 3, name: "Protective Field", text: "Reaction, 1 die: reduce damage to a creature within 30 ft by roll + INT (min 1)." },
      { id: "psionic-strike", level: 3, name: "Psionic Strike", text: "Once per turn after a weapon hit within 30 ft, 1 die: + roll + INT Force damage." },
      { id: "telekinetic-movement", level: 3, name: "Telekinetic Movement", text: "Magic action: move a Large or smaller object or willing creature 30 ft. 1/Short Rest or 1 die." },
      { id: "psi-powered-leap", level: 7, name: "Psi-Powered Leap", text: "Bonus Action: Fly Speed 2 × Speed this turn. 1/Short Rest or 1 die." },
      { id: "telekinetic-thrust", level: 7, name: "Telekinetic Thrust", text: "Psionic Strike target makes a STR save or is knocked Prone or moved 10 ft." },
      { id: "guarded-mind", level: 10, name: "Guarded Mind", text: "Resistance to Psychic; 1 die to end Charmed or Frightened at the start of your turn." },
      { id: "bulwark-of-force", level: 15, name: "Bulwark of Force", text: "Bonus Action: up to INT-mod creatures within 30 ft gain Half Cover for 1 minute. 1/Long Rest or 1 die." },
      {
        id: "telekinetic-master", level: 18, name: "Telekinetic Master",
        text: "Telekinesis always prepared; cast it free 1/Long Rest (or 1 die); Bonus Action weapon attack while concentrating.",
        effects: [{ type: "spell", ids: ["telekinesis"], alwaysPrepared: true }],
      },
    ],
  },
];
