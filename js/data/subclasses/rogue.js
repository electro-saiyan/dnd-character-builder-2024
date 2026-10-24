// Rogue subclasses — PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, spellcasting } from "../classes/common.js";
import { THIRD_CANTRIPS, THIRD_PREPARED } from "./fighter.js";

export const ROGUE_SUBCLASSES = [
  {
    id: "arcane-trickster", name: "Arcane Trickster",
    // Mage Hand is granted on top of the 2 (3 at 10th) chosen Wizard cantrips.
    spellcasting: { ...spellcasting("int", "third", THIRD_CANTRIPS, THIRD_PREPARED, "Arcane Focus"), list: "wizard" },
    features: [
      {
        id: "spellcasting", level: 3, name: "Spellcasting",
        text: "INT spellcasting from the Wizard list; you always know Mage Hand.",
        effects: [{ type: "spell", ids: ["mage-hand"] }],
      },
      {
        id: "mage-hand-legerdemain", level: 3, name: "Mage Hand Legerdemain",
        text: "Cast Mage Hand as a Bonus Action; the hand is Invisible and can make Sleight of Hand checks.",
      },
      { id: "magical-ambush", level: 9, name: "Magical Ambush", text: "While Invisible, targets of your spells have Disadvantage on saves that turn." },
      { id: "versatile-trickster", level: 13, name: "Versatile Trickster", text: "Cunning Strike Trip can also affect a creature near your Mage Hand." },
      {
        id: "spell-thief", level: 17, name: "Spell Thief",
        text: "Reaction vs a spell targeting you: caster makes an INT save or the spell fails and you steal it for 8 hours. 1/Long Rest.",
        effects: [{ type: "resource", id: "spell-thief", name: "Spell Thief", max: 1, recharge: "long" }],
      },
    ],
  },
  {
    id: "assassin", name: "Assassin",
    features: [
      {
        id: "assassinate", level: 3, name: "Assassinate",
        text: "Advantage on Initiative; first round: Advantage vs creatures that haven't acted, Sneak Attack adds your Rogue level.",
      },
      {
        id: "assassins-tools", level: 3, name: "Assassin's Tools", text: "Gain a Disguise Kit and a Poisoner's Kit and proficiency with them.",
        effects: [{ type: "prof", category: "tool", ids: ["disguise-kit", "poisoners-kit"] }],
      },
      {
        id: "infiltration-expertise", level: 9, name: "Infiltration Expertise",
        text: "Mimic speech and handwriting after 1 hour of study; Steady Aim doesn't set your Speed to 0.",
      },
      { id: "envenom-weapons", level: 13, name: "Envenom Weapons", text: "Cunning Strike Poison also deals 2d6 Poison (ignores Resistance)." },
      {
        id: "death-strike", level: 17, name: "Death Strike",
        text: "First-round Sneak Attack hit: CON save (DC 8 + DEX + PB) or the attack's damage is doubled.",
      },
    ],
  },
  {
    id: "soulknife", name: "Soulknife",
    table: buildTable({
      psiDice: run([0, 2], [4, 2], [6, 4], [8, 4], [10, 4], [12, 4]),
      psiDie: run([null, 2], ["1d6", 2], ["1d8", 6], ["1d10", 6], ["1d12", 4]),
    }),
    features: [
      {
        id: "psionic-power", level: 3, name: "Psionic Power",
        text: "Psionic Energy Dice fuel Soulknife features. Regain 1 on a Short Rest, all on a Long Rest.",
        effects: [{
          type: "resource", id: "psionic-energy", name: "Psionic Energy", max: { table: "psiDice" }, die: { table: "psiDie" },
          recharge: "long", note: "regain 1 on Short Rest",
        }],
      },
      { id: "psi-bolstered-knack", level: 3, name: "Psi-Bolstered Knack", text: "Add a die to a failed proficient check; spent only if it then succeeds." },
      { id: "psychic-whispers", level: 3, name: "Psychic Whispers", text: "Magic action: telepathy with up to PB creatures for a die roll of hours." },
      {
        id: "psychic-blades", level: 3, name: "Psychic Blades",
        text: "Attack with a Psychic Blade (Simple melee, Finesse, Thrown 60/120, Vex); Bonus Action second blade deals 1d4.",
        effects: [{
          type: "attack", name: "Psychic Blade", die: "1d6", damageType: "psychic", abilities: ["str", "dex"],
          notes: ["finesse", "thrown (60/120)", "bonus action: 1d4"], mastery: "vex",
        }],
      },
      { id: "homing-strikes", level: 9, name: "Homing Strikes", text: "Add a die to a missed Psychic Blade attack; spent only if it then hits." },
      { id: "psychic-teleportation", level: 9, name: "Psychic Teleportation", text: "Bonus Action, 1 die: teleport up to 10 × the roll in feet." },
      { id: "psychic-veil", level: 13, name: "Psychic Veil", text: "Magic action: Invisible for 1 hour (ends on damage or forcing a save). 1/Long Rest or 1 die." },
      {
        id: "rend-mind", level: 17, name: "Rend Mind",
        text: "Psychic Blade Sneak Attack: WIS save (DC 8 + DEX + PB) or Stunned 1 minute. 1/Long Rest or 3 dice.",
      },
    ],
  },
  {
    id: "thief", name: "Thief",
    features: [
      {
        id: "fast-hands", level: 3, name: "Fast Hands",
        text: "Bonus Action: Sleight of Hand (pick lock, disarm trap, pick pocket), Utilize, or use a magic item's Magic action.",
      },
      { id: "second-story-work", level: 3, name: "Second-Story Work", text: "Climb Speed equal to your Speed; jump distance uses DEX." },
      { id: "supreme-sneak", level: 9, name: "Supreme Sneak", text: "Cunning Strike Stealth Attack (1d6): stay Invisible if you end your turn behind cover." },
      {
        id: "use-magic-device", level: 13, name: "Use Magic Device",
        text: "Attune to 4 items; 1d6 roll of 6 saves an item's charges; cast any Spell Scroll with INT.",
        effects: [{ type: "attunementSlots", value: 4 }],
      },
      { id: "thiefs-reflexes", level: 17, name: "Thief's Reflexes", text: "Take two turns in the first round of combat (second at Initiative − 10)." },
    ],
  },
];
