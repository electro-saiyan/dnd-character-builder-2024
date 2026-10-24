// Field rectangles (page units, 850 × 1100) and which wizard step each one jumps to.
// Layout follows the structure of the 2024 sheet; the artwork is our own.

const r = (x, y, w, h) => ({ x, y, w, h });

export const PAGE1 = {
  name: r(30, 30, 330, 46),
  background: r(370, 30, 150, 46),
  class: r(530, 30, 150, 46),
  level: r(690, 30, 60, 46),
  xp: r(760, 30, 60, 46),
  species: r(30, 84, 200, 38),
  subclass: r(240, 84, 280, 38),
  prof: r(530, 84, 140, 38),
  inspiration: r(680, 84, 140, 38),

  ac: r(30, 132, 84, 100),
  hp: r(124, 132, 240, 100),
  hitDice: r(374, 132, 130, 100),
  deathSaves: r(514, 132, 150, 100),
  speed: r(674, 132, 146, 47),
  size: r(674, 185, 146, 47),

  initiative: r(30, 242, 190, 46),
  passive: r(230, 242, 190, 46),
  training: r(30, 0, 190, 0), // y/h set after the ability blocks (see page1.js)

  colLeft: { x: 30, y: 298, w: 190 },
  colMid: { x: 230, y: 298, w: 190 },

  weapons: r(430, 242, 390, 250),
  features: r(430, 502, 390, 330),
  species_traits: r(430, 842, 390, 112),
  feats: r(430, 964, 390, 106),
};

export const PAGE2 = {
  spellAbility: r(30, 30, 160, 46),
  spellMod: r(200, 30, 110, 46),
  spellDC: r(320, 30, 110, 46),
  spellAttack: r(440, 30, 110, 46),
  slots: r(30, 86, 520, 70),
  spells: r(30, 166, 520, 904),

  appearance: r(570, 30, 250, 120),
  personality: r(570, 160, 250, 270),
  alignment: r(570, 440, 250, 40),
  languages: r(570, 490, 250, 70),
  equipment: r(570, 570, 250, 280),
  attunement: r(570, 860, 250, 120),
  coins: r(570, 990, 250, 80),
};

// Abilities in the 2024 sheet's two-column arrangement, with their skills.
export const ABILITY_COLUMNS = [
  ["str", "dex", "con"],
  ["int", "wis", "cha"],
];
