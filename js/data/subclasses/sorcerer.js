// Sorcerer subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

const sorcererSpells = (name, byLevel) => ({
  id: "subclass-spells", level: 3, name: `${name} Spells`, text: "Always prepared at the listed Sorcerer levels.",
  effects: [{ type: "spell", byLevel, alwaysPrepared: true }],
});

export const SORCERER_SUBCLASSES = [
  {
    id: "aberrant", name: "Aberrant Sorcery",
    features: [
      sorcererSpells("Psionic", {
        3: ["arms-of-hadar", "calm-emotions", "detect-thoughts", "dissonant-whispers", "mind-sliver"],
        5: ["hunger-of-hadar", "sending"],
        7: ["evards-black-tentacles", "summon-aberration"],
        9: ["rarys-telepathic-bond", "telekinesis"],
      }),
      {
        id: "telepathic-speech", level: 3, name: "Telepathic Speech",
        text: "Bonus Action: telepathic link with a creature within 30 ft (range CHA miles, lasts Sorcerer-level minutes).",
      },
      {
        id: "psionic-sorcery", level: 6, name: "Psionic Sorcery",
        text: "Cast Psionic spells with Sorcery Points equal to spell level, without V/S (or non-costly M) components.",
      },
      { id: "psychic-defenses", level: 6, name: "Psychic Defenses", text: "Resistance to Psychic; Advantage on saves vs Charmed and Frightened." },
      {
        id: "revelation-in-flesh", level: 14, name: "Revelation in Flesh",
        text: "Bonus Action, 1+ SP, 10 min: per point gain Swim 2× Speed, Fly (hover), see Invisible 60 ft, or squeeze through 1-inch spaces.",
      },
      {
        id: "warping-implosion", level: 18, name: "Warping Implosion",
        text: "Magic action: teleport 120 ft; creatures within 30 ft of your old space make a STR save, 3d10 Force and pulled (half on success). 1/Long Rest or 5 SP.",
      },
    ],
  },
  {
    id: "clockwork", name: "Clockwork Sorcery",
    features: [
      sorcererSpells("Clockwork", {
        3: ["aid", "alarm", "lesser-restoration", "protection-from-evil-and-good"],
        5: ["dispel-magic", "protection-from-energy"],
        7: ["freedom-of-movement", "summon-construct"],
        9: ["greater-restoration", "wall-of-force"],
      }),
      {
        id: "restore-balance", level: 3, name: "Restore Balance",
        text: "Reaction: cancel Advantage or Disadvantage on a d20 roll within 60 ft.",
        effects: [{ type: "resource", id: "restore-balance", name: "Restore Balance", max: { ability: "cha", min: 1 }, recharge: "long" }],
      },
      {
        id: "bastion-of-law", level: 6, name: "Bastion of Law",
        text: "Magic action, 1–5 SP: a creature within 30 ft gets a ward of that many d8s to reduce damage.",
      },
      {
        id: "trance-of-order", level: 14, name: "Trance of Order",
        text: "Bonus Action, 1 minute: no Advantage against you; d20 rolls of 9 or lower count as 10. 1/Long Rest or 5 SP.",
      },
      {
        id: "clockwork-cavalcade", level: 18, name: "Clockwork Cavalcade",
        text: "Magic action, 30-ft Cube: heal 100 HP total, repair objects, end spells of level 6 or lower. 1/Long Rest or 7 SP.",
      },
    ],
  },
  {
    id: "draconic", name: "Draconic Sorcery",
    features: [
      {
        id: "draconic-resilience", level: 3, name: "Draconic Resilience",
        text: "HP maximum +1 per Sorcerer level; without armor, AC = 10 + DEX + CHA.",
        effects: [
          { type: "bonus", target: "hpPerLevel", value: 1 },
          { type: "acFormula", base: 10, add: ["dex", "cha"], noArmor: true },
        ],
      },
      sorcererSpells("Draconic", {
        3: ["alter-self", "chromatic-orb", "command", "dragons-breath"],
        5: ["fear", "fly"],
        7: ["arcane-eye", "charm-monster"],
        9: ["legend-lore", "summon-dragon"],
      }),
      {
        id: "elemental-affinity", level: 6, name: "Elemental Affinity",
        text: "Choose Acid, Cold, Fire, Lightning or Poison: Resistance to it; add CHA to one damage roll of spells dealing it.",
      },
      {
        id: "dragon-wings", level: 14, name: "Dragon Wings",
        text: "Bonus Action: Fly Speed 60 ft for 1 hour. 1/Long Rest or 3 SP.",
      },
      {
        id: "dragon-companion", level: 18, name: "Dragon Companion",
        text: "Summon Dragon without Material components; once per Long Rest without a slot, optionally without Concentration.",
      },
    ],
  },
  {
    id: "wild-magic", name: "Wild Magic Sorcery",
    features: [
      {
        id: "wild-magic-surge", level: 3, name: "Wild Magic Surge",
        text: "Once per turn after a slot Sorcerer spell, roll d20; on a 20, roll on the Wild Magic Surge table.",
      },
      {
        id: "tides-of-chaos", level: 3, name: "Tides of Chaos",
        text: "Advantage on one D20 Test; recharges on a Long Rest or when you cast a slot Sorcerer spell (forcing a surge roll).",
        effects: [{ type: "resource", id: "tides-of-chaos", name: "Tides of Chaos", max: 1, recharge: "long" }],
      },
      { id: "bend-luck", level: 6, name: "Bend Luck", text: "Reaction, 1 SP: add or subtract 1d4 from another creature's D20 Test." },
      { id: "controlled-chaos", level: 14, name: "Controlled Chaos", text: "Roll twice on the surge table and choose." },
      { id: "tamed-surge", level: 18, name: "Tamed Surge", text: "After a slot Sorcerer spell, choose a surge effect. 1/Long Rest." },
    ],
  },
];
