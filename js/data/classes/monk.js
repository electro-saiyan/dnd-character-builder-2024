// Monk â€” PHB 2024. Feature text is a short summary, not the book's wording.
import { buildTable, run, asi, epicBoon, extraAttack } from "./common.js";
import { MONK_SUBCLASSES } from "../subclasses/monk.js";

const table = buildTable({
  martialArts: run(["1d6", 4], ["1d8", 6], ["1d10", 6], ["1d12", 4]),
  focus: Array.from({ length: 20 }, (_, i) => (i === 0 ? 0 : i + 1)),
  unarmoredMove: run([0, 1], [10, 4], [15, 4], [20, 4], [25, 4], [30, 3]),
});

// Simple melee weapons and martial melee weapons with the Light property.
const monkWeapons = [
  { category: "simple", type: "melee" },
  { category: "martial", type: "melee", property: "light" },
];

export const MONK = {
  id: "monk",
  name: "Monk",
  source: "PHB 2024",
  hitDie: 8,
  primary: ["dex", "wis"],
  saves: ["str", "dex"],
  armor: [],
  weapons: ["simple", "martial:light"],
  tools: { choose: 1, from: { toolType: ["artisan", "instrument"] } },
  skills: { count: 2, from: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"] },
  equipment: {
    A: [
      { item: "spear", qty: 1 },
      { item: "dagger", qty: 5 },
      { choice: "monk.tools", qty: 1 },
      { item: "explorers-pack", qty: 1 },
      { gp: 11 },
    ],
    B: [{ gp: 50 }],
  },
  subclassLevel: 3,
  saveDC: { ability: "wis", name: "Focus Save DC" },
  tableColumns: [
    { id: "martialArts", name: "Martial Arts" },
    { id: "focus", name: "Focus Points" },
    { id: "unarmoredMove", name: "Unarmored Movement", unit: "ft" },
  ],
  table,
  spellcasting: null,
  features: [
    {
      id: "martial-arts", level: 1, name: "Martial Arts",
      text: "Unarmed Strikes and Monk weapons can use DEX; roll the Martial Arts die for damage; Bonus Action Unarmed Strike.",
      effects: [
        { type: "unarmedStrike", die: { table: "martialArts" }, abilities: ["str", "dex"], noArmor: true, noShield: true },
        { type: "weaponAbility", match: monkWeapons, abilities: ["str", "dex"], die: { table: "martialArts" }, noArmor: true, noShield: true },
      ],
    },
    {
      id: "unarmored-defense", level: 1, name: "Unarmored Defense",
      text: "Without armor or a Shield, AC = 10 + DEX + WIS.",
      effects: [{ type: "acFormula", base: 10, add: ["dex", "wis"], noArmor: true, noShield: true }],
    },
    {
      id: "monks-focus", level: 2, name: "Monk's Focus",
      text: "Focus Points fuel Flurry of Blows, Patient Defense and Step of the Wind. Regain on Short or Long Rest.",
      effects: [{ type: "resource", id: "focus", name: "Focus Points", max: { table: "focus" }, recharge: "short" }],
    },
    {
      id: "unarmored-movement", level: 2, name: "Unarmored Movement",
      text: "Speed increases while not wearing armor or wielding a Shield.",
      effects: [{ type: "bonus", target: "speed", value: { table: "unarmoredMove" }, noArmor: true, noShield: true }],
    },
    {
      id: "uncanny-metabolism", level: 2, name: "Uncanny Metabolism",
      text: "When you roll Initiative, regain all Focus Points and heal Martial Arts die + Monk level. Once per Long Rest.",
    },
    {
      id: "deflect-attacks", level: 3, name: "Deflect Attacks",
      text: "Reaction: reduce attack damage by 1d10 + DEX + Monk level; if reduced to 0, spend 1 Focus to redirect.",
    },
    asi("monk", 4),
    { id: "slow-fall", level: 4, name: "Slow Fall", text: "Reaction: reduce falling damage by 5 Ã— Monk level." },
    extraAttack(5),
    {
      id: "stunning-strike", level: 5, name: "Stunning Strike",
      text: "Once per turn on a hit, spend 1 Focus: target makes a CON save or is Stunned until your next turn.",
    },
    { id: "empowered-strikes", level: 6, name: "Empowered Strikes", text: "Unarmed Strikes can deal Force damage." },
    { id: "evasion", level: 7, name: "Evasion", text: "DEX save for half damage: take none on success, half on failure." },
    asi("monk", 8),
    {
      id: "acrobatic-movement", level: 9, name: "Acrobatic Movement",
      text: "Without armor or a Shield, move along vertical surfaces and across liquids on your turn.",
    },
    { id: "heightened-focus", level: 10, name: "Heightened Focus", text: "Flurry of Blows, Patient Defense and Step of the Wind gain extra benefits." },
    {
      id: "self-restoration", level: 10, name: "Self-Restoration",
      text: "End one of Charmed, Frightened or Poisoned on yourself at end of turn; no Exhaustion from skipping food and drink.",
    },
    asi("monk", 12),
    { id: "deflect-energy", level: 13, name: "Deflect Energy", text: "Deflect Attacks works against any damage type." },
    {
      id: "disciplined-survivor", level: 14, name: "Disciplined Survivor",
      text: "Proficiency in all saving throws; spend 1 Focus to reroll a failed save.",
      effects: [{ type: "prof", category: "save", ids: ["str", "dex", "con", "int", "wis", "cha"] }],
    },
    {
      id: "perfect-focus", level: 15, name: "Perfect Focus",
      text: "When you roll Initiative with 3 or fewer Focus Points (and don't use Uncanny Metabolism), regain up to 4.",
    },
    asi("monk", 16),
    {
      id: "superior-defense", level: 18, name: "Superior Defense",
      text: "Spend 3 Focus: Resistance to all damage except Force for 1 minute.",
    },
    epicBoon("monk"),
    {
      id: "body-and-mind", level: 20, name: "Body and Mind",
      text: "DEX and WIS increase by 4, to a maximum of 25.",
      effects: [{ type: "ability", ids: ["dex", "wis"], value: 4, max: 25 }],
    },
  ],
  subclasses: MONK_SUBCLASSES,
};
