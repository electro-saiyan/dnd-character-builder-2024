// Bard subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

export const BARD_SUBCLASSES = [
  {
    id: "dance", name: "College of Dance",
    features: [
      {
        id: "dazzling-footwork", level: 3, name: "Dazzling Footwork",
        text: "Without armor or Shield: AC 10 + DEX + CHA; Advantage on dance Performance; Unarmed Strikes use DEX and can deal Bardic die + DEX; Unarmed Strike when spending Bardic Inspiration.",
        effects: [
          { type: "acFormula", base: 10, add: ["dex", "cha"], noArmor: true, noShield: true },
          { type: "unarmedStrike", die: { table: "bardicDie" }, abilities: ["dex"], noArmor: true, noShield: true },
        ],
      },
      {
        id: "inspiring-movement", level: 6, name: "Inspiring Movement",
        text: "Reaction + Bardic Inspiration when an enemy ends its turn next to you: you and an ally move half Speed without provoking.",
      },
      {
        id: "tandem-footwork", level: 6, name: "Tandem Footwork",
        text: "On Initiative, spend Bardic Inspiration: you and allies within 30 ft add the roll to Initiative.",
      },
      { id: "leading-evasion", level: 14, name: "Leading Evasion", text: "Evasion that also protects creatures within 5 ft making the same DEX save." },
    ],
  },
  {
    id: "glamour", name: "College of Glamour",
    features: [
      {
        id: "beguiling-magic", level: 3, name: "Beguiling Magic",
        text: "Charm Person and Mirror Image always prepared. After an Enchantment/Illusion slot spell, a creature within 60 ft makes a WIS save or is Charmed/Frightened 1 min. 1/Long Rest or spend Bardic Inspiration.",
        effects: [
          { type: "spell", ids: ["charm-person", "mirror-image"], alwaysPrepared: true },
          { type: "resource", id: "beguiling-magic", name: "Beguiling Magic", max: 1, recharge: "long", note: "or spend Bardic Inspiration" },
        ],
      },
      {
        id: "mantle-of-inspiration", level: 3, name: "Mantle of Inspiration",
        text: "Bonus Action + Bardic Inspiration: up to CHA-mod creatures gain 2 × roll Temp HP and can move without provoking.",
      },
      {
        id: "mantle-of-majesty", level: 6, name: "Mantle of Majesty",
        text: "Command always prepared. Bonus Action: cast Command free and as a Bonus Action each turn for 1 min (Concentration). 1/Long Rest or a level 3+ slot.",
        effects: [
          { type: "spell", ids: ["command"], alwaysPrepared: true },
          { type: "resource", id: "mantle-of-majesty", name: "Mantle of Majesty", max: 1, recharge: "long", note: "or spend a level 3+ slot" },
        ],
      },
      {
        id: "unbreakable-majesty", level: 14, name: "Unbreakable Majesty",
        text: "Bonus Action for 1 min: first attacker each turn makes a CHA save or misses.",
        effects: [{ type: "resource", id: "unbreakable-majesty", name: "Unbreakable Majesty", max: 1, recharge: "short" }],
      },
    ],
  },
  {
    id: "lore", name: "College of Lore",
    features: [
      {
        id: "bonus-proficiencies", level: 3, name: "Bonus Proficiencies", text: "Proficiency in three skills of your choice.",
        effects: [{ type: "choose", category: "skill", from: "any", count: 3, key: "lore.skills" }],
      },
      {
        id: "cutting-words", level: 3, name: "Cutting Words",
        text: "Reaction + Bardic Inspiration: subtract the die from a creature's attack, check or damage roll within 60 ft.",
      },
      {
        id: "magical-discoveries", level: 6, name: "Magical Discoveries",
        text: "Two always-prepared spells from the Cleric, Druid or Wizard lists (cantrip or a level you have slots for).",
        effects: [{ type: "choose", category: "spell", from: { list: ["cleric", "druid", "wizard"] }, count: 2, key: "lore.discoveries" }],
      },
      {
        id: "peerless-skill", level: 14, name: "Peerless Skill",
        text: "On a failed check or attack, add a Bardic Inspiration roll; not spent if it still fails.",
      },
    ],
  },
  {
    id: "valor", name: "College of Valor",
    features: [
      {
        id: "combat-inspiration", level: 3, name: "Combat Inspiration",
        text: "A creature with your Bardic die can add it to AC (Reaction, vs one attack) or to weapon damage on a hit.",
      },
      {
        id: "martial-training", level: 3, name: "Martial Training",
        text: "Martial weapons, Medium armor and Shields; use a weapon as a Spellcasting Focus.",
        effects: [
          { type: "prof", category: "weapon", ids: ["martial"] },
          { type: "prof", category: "armor", ids: ["medium", "shield"] },
        ],
      },
      { id: "extra-attack", level: 6, name: "Extra Attack", text: "Attack twice per Attack action; one attack can be an Action cantrip." },
      { id: "battle-magic", level: 14, name: "Battle Magic", text: "After casting an Action spell, make one weapon attack as a Bonus Action." },
    ],
  },
];
