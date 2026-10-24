// PHB 2024 species. Trait text is a short summary, not the book's wording.

const darkvision = (range = 60) => ({
  id: "darkvision", name: "Darkvision", text: `See in dim light within ${range} ft as if bright, and in darkness as dim.`,
  effects: [{ type: "sense", id: "darkvision", range }],
});

// Spellcasting ability for species spells (Elf lineage, Gnome lineage, Tiefling legacy).
const spellAbility = (key) => ({ type: "choose", category: "spellAbility", from: ["int", "wis", "cha"], count: 1, key });

const DRAGONS = [
  ["black", "Black", "acid"], ["blue", "Blue", "lightning"], ["brass", "Brass", "fire"], ["bronze", "Bronze", "lightning"],
  ["copper", "Copper", "acid"], ["gold", "Gold", "fire"], ["green", "Green", "poison"], ["red", "Red", "fire"],
  ["silver", "Silver", "cold"], ["white", "White", "cold"],
];

export const SPECIES = [
  {
    id: "aasimar", name: "Aasimar", source: "PHB 2024", type: "Humanoid", size: ["Medium", "Small"], speed: 30,
    traits: [
      {
        id: "celestial-resistance", name: "Celestial Resistance", text: "Resistance to Necrotic and Radiant damage.",
        effects: [{ type: "resistance", ids: ["necrotic", "radiant"] }],
      },
      darkvision(60),
      {
        id: "healing-hands", name: "Healing Hands", text: "Magic action: touch to heal PB d4s.",
        effects: [{ type: "resource", id: "healing-hands", name: "Healing Hands", max: 1, recharge: "long" }],
      },
      {
        id: "light-bearer", name: "Light Bearer", text: "You know Light (CHA).",
        effects: [{ type: "spell", ids: ["light"] }],
      },
      {
        id: "celestial-revelation", name: "Celestial Revelation", level: 3,
        text: "From level 3, Bonus Action for 1 minute: +PB damage once per turn and Heavenly Wings (Fly), Inner Radiance (light, PB Radiant aura) or Necrotic Shroud (CHA save or Frightened).",
        effects: [{ type: "resource", id: "celestial-revelation", name: "Celestial Revelation", max: 1, recharge: "long" }],
      },
    ],
  },
  {
    id: "dragonborn", name: "Dragonborn", source: "PHB 2024", type: "Humanoid", size: "Medium", speed: 30,
    traits: [
      {
        id: "draconic-ancestry", name: "Draconic Ancestry", text: "Choose a dragon: sets Breath Weapon damage and Resistance.",
        effects: [{
          type: "choose", category: "option", count: 1, key: "dragonborn.ancestry",
          options: DRAGONS.map(([id, name, damage]) => ({
            id, name: `${name} Dragon`, text: `${damage[0].toUpperCase()}${damage.slice(1)} breath and Resistance.`,
            effects: [
              { type: "resistance", ids: [damage] },
              {
                type: "attack", name: "Breath Weapon", damageType: damage,
                die: { byLevel: { 1: "1d10", 5: "2d10", 11: "3d10", 17: "4d10" } },
                save: { ability: "dex", dcAbility: "con" },
                notes: ["15-ft Cone or 30Ã—5-ft Line", "half on save", "replaces one attack"],
              },
            ],
          })),
        }],
      },
      {
        id: "breath-weapon", name: "Breath Weapon",
        text: "Replace an attack: 15-ft Cone or 30-ft Line, DEX save (DC 8 + CON + PB), 1d10 (2d10 at 5th, 3d10 at 11th, 4d10 at 17th), half on success.",
        effects: [{ type: "resource", id: "breath-weapon", name: "Breath Weapon", max: "prof", recharge: "long" }],
      },
      { id: "damage-resistance", name: "Damage Resistance", text: "Resistance to your ancestry's damage type." },
      darkvision(60),
      {
        id: "draconic-flight", name: "Draconic Flight", level: 5,
        text: "From level 5, Bonus Action: Fly Speed for 10 minutes.",
        effects: [{ type: "resource", id: "draconic-flight", name: "Draconic Flight", max: 1, recharge: "long" }],
      },
    ],
  },
  {
    id: "dwarf", name: "Dwarf", source: "PHB 2024", type: "Humanoid", size: "Medium", speed: 30,
    traits: [
      darkvision(120),
      {
        id: "dwarven-resilience", name: "Dwarven Resilience", text: "Resistance to Poison; Advantage on saves vs Poisoned.",
        effects: [{ type: "resistance", ids: ["poison"] }],
      },
      {
        id: "dwarven-toughness", name: "Dwarven Toughness", text: "HP maximum +1 per level.",
        effects: [{ type: "bonus", target: "hpPerLevel", value: 1 }],
      },
      {
        id: "stonecunning", name: "Stonecunning", text: "Bonus Action: Tremorsense 60 ft for 10 minutes while on stone.",
        effects: [{ type: "resource", id: "stonecunning", name: "Stonecunning", max: "prof", recharge: "long" }],
      },
    ],
  },
  {
    id: "elf", name: "Elf", source: "PHB 2024", type: "Humanoid", size: "Medium", speed: 30,
    traits: [
      darkvision(60),
      {
        id: "elven-lineage", name: "Elven Lineage",
        text: "Choose a lineage; its level 3 and 5 spells are always prepared and castable once per Long Rest without a slot.",
        effects: [
          spellAbility("elf.spellAbility"),
          {
            type: "choose", category: "option", count: 1, key: "elf.lineage",
            options: [
              {
                id: "drow", name: "Drow", text: "Darkvision 120 ft; Dancing Lights, Faerie Fire (3rd), Darkness (5th).",
                effects: [
                  { type: "sense", id: "darkvision", range: 120 },
                  { type: "spell", byLevel: { 1: ["dancing-lights"], 3: ["faerie-fire"], 5: ["darkness"] }, alwaysPrepared: true },
                ],
              },
              {
                id: "high-elf", name: "High Elf", text: "Prestidigitation (swap for a Wizard cantrip on a Long Rest), Detect Magic (3rd), Misty Step (5th).",
                effects: [{ type: "spell", byLevel: { 1: ["prestidigitation"], 3: ["detect-magic"], 5: ["misty-step"] }, alwaysPrepared: true }],
              },
              {
                id: "wood-elf", name: "Wood Elf", text: "Speed 35 ft; Druidcraft, Longstrider (3rd), Pass without Trace (5th).",
                effects: [
                  { type: "bonus", target: "speed", value: 5 },
                  { type: "spell", byLevel: { 1: ["druidcraft"], 3: ["longstrider"], 5: ["pass-without-trace"] }, alwaysPrepared: true },
                ],
              },
            ],
          },
        ],
      },
      { id: "fey-ancestry", name: "Fey Ancestry", text: "Advantage on saves to avoid or end Charmed." },
      {
        id: "keen-senses", name: "Keen Senses", text: "Proficiency in Insight, Perception or Survival.",
        effects: [{ type: "choose", category: "skill", from: ["insight", "perception", "survival"], count: 1, key: "elf.keenSenses" }],
      },
      { id: "trance", name: "Trance", text: "Can't be magically put to sleep; Long Rest in 4 hours of trance." },
    ],
  },
  {
    id: "gnome", name: "Gnome", source: "PHB 2024", type: "Humanoid", size: "Small", speed: 30,
    traits: [
      darkvision(60),
      { id: "gnomish-cunning", name: "Gnomish Cunning", text: "Advantage on INT, WIS and CHA saving throws." },
      {
        id: "gnomish-lineage", name: "Gnomish Lineage", text: "Choose Forest or Rock Gnome.",
        effects: [
          spellAbility("gnome.spellAbility"),
          {
            type: "choose", category: "option", count: 1, key: "gnome.lineage",
            options: [
              {
                id: "forest", name: "Forest Gnome", text: "Minor Illusion; Speak with Animals always prepared, cast free PB times per Long Rest.",
                effects: [
                  { type: "spell", ids: ["minor-illusion"] },
                  { type: "spell", ids: ["speak-with-animals"], alwaysPrepared: true },
                  { type: "resource", id: "forest-gnome", name: "Speak with Animals (free)", max: "prof", recharge: "long" },
                ],
              },
              {
                id: "rock", name: "Rock Gnome", text: "Mending and Prestidigitation; build up to 3 Tiny clockwork devices.",
                effects: [{ type: "spell", ids: ["mending", "prestidigitation"] }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "goliath", name: "Goliath", source: "PHB 2024", type: "Humanoid", size: "Medium", speed: 35,
    traits: [
      {
        id: "giant-ancestry", name: "Giant Ancestry", text: "Choose a giant boon, usable PB times per Long Rest.",
        effects: [
          { type: "resource", id: "giant-ancestry", name: "Giant Ancestry", max: "prof", recharge: "long" },
          {
            type: "choose", category: "option", count: 1, key: "goliath.ancestry",
            options: [
              { id: "cloud", name: "Cloud's Jaunt", text: "Bonus Action: teleport 30 ft." },
              { id: "fire", name: "Fire's Burn", text: "On a hit, +1d10 Fire." },
              { id: "frost", name: "Frost's Chill", text: "On a hit, +1d6 Cold and âˆ’10 ft Speed." },
              { id: "hill", name: "Hill's Tumble", text: "On a hit, knock a Large or smaller creature Prone." },
              { id: "stone", name: "Stone's Endurance", text: "Reaction when damaged: reduce by 1d12 + CON." },
              { id: "storm", name: "Storm's Thunder", text: "Reaction when damaged within 60 ft: 1d8 Thunder to the attacker." },
            ],
          },
        ],
      },
      {
        id: "large-form", name: "Large Form", level: 5,
        text: "From level 5, Bonus Action for 10 minutes: become Large, Advantage on STR checks, +10 ft Speed.",
        effects: [{ type: "resource", id: "large-form", name: "Large Form", max: 1, recharge: "long" }],
      },
      { id: "powerful-build", name: "Powerful Build", text: "Advantage to end Grappled; count as one size larger for carrying." },
    ],
  },
  {
    id: "halfling", name: "Halfling", source: "PHB 2024", type: "Humanoid", size: "Small", speed: 30,
    traits: [
      { id: "brave", name: "Brave", text: "Advantage on saves to avoid or end Frightened." },
      { id: "halfling-nimbleness", name: "Halfling Nimbleness", text: "Move through the space of larger creatures." },
      { id: "luck", name: "Luck", text: "Reroll a 1 on a D20 Test." },
      { id: "naturally-stealthy", name: "Naturally Stealthy", text: "Hide behind a creature at least one size larger." },
    ],
  },
  {
    id: "human", name: "Human", source: "PHB 2024", type: "Humanoid", size: ["Medium", "Small"], speed: 30,
    traits: [
      { id: "resourceful", name: "Resourceful", text: "Gain Heroic Inspiration whenever you finish a Long Rest." },
      {
        id: "skillful", name: "Skillful", text: "Proficiency in one skill of your choice.",
        effects: [{ type: "choose", category: "skill", from: "any", count: 1, key: "human.skillful" }],
      },
      {
        id: "versatile", name: "Versatile", text: "Gain one Origin feat of your choice.",
        effects: [{ type: "choose", category: "feat", from: { category: ["origin"] }, count: 1, key: "human.versatile" }],
      },
    ],
  },
  {
    id: "orc", name: "Orc", source: "PHB 2024", type: "Humanoid", size: "Medium", speed: 30,
    traits: [
      {
        id: "adrenaline-rush", name: "Adrenaline Rush", text: "Bonus Action: Dash and gain PB Temp HP.",
        effects: [{ type: "resource", id: "adrenaline-rush", name: "Adrenaline Rush", max: "prof", recharge: "short" }],
      },
      darkvision(120),
      {
        id: "relentless-endurance", name: "Relentless Endurance", text: "Drop to 1 HP instead of 0 (not killed outright).",
        effects: [{ type: "resource", id: "relentless-endurance", name: "Relentless Endurance", max: 1, recharge: "long" }],
      },
    ],
  },
  {
    id: "tiefling", name: "Tiefling", source: "PHB 2024", type: "Humanoid", size: ["Medium", "Small"], speed: 30,
    traits: [
      darkvision(60),
      {
        id: "fiendish-legacy", name: "Fiendish Legacy",
        text: "Choose a legacy; its level 3 and 5 spells are always prepared and castable once per Long Rest without a slot.",
        effects: [
          spellAbility("tiefling.spellAbility"),
          {
            type: "choose", category: "option", count: 1, key: "tiefling.legacy",
            options: [
              {
                id: "abyssal", name: "Abyssal", text: "Resistance to Poison; Poison Spray, Ray of Sickness (3rd), Hold Person (5th).",
                effects: [
                  { type: "resistance", ids: ["poison"] },
                  { type: "spell", byLevel: { 1: ["poison-spray"], 3: ["ray-of-sickness"], 5: ["hold-person"] }, alwaysPrepared: true },
                ],
              },
              {
                id: "chthonic", name: "Chthonic", text: "Resistance to Necrotic; Chill Touch, False Life (3rd), Ray of Enfeeblement (5th).",
                effects: [
                  { type: "resistance", ids: ["necrotic"] },
                  { type: "spell", byLevel: { 1: ["chill-touch"], 3: ["false-life"], 5: ["ray-of-enfeeblement"] }, alwaysPrepared: true },
                ],
              },
              {
                id: "infernal", name: "Infernal", text: "Resistance to Fire; Fire Bolt, Hellish Rebuke (3rd), Darkness (5th).",
                effects: [
                  { type: "resistance", ids: ["fire"] },
                  { type: "spell", byLevel: { 1: ["fire-bolt"], 3: ["hellish-rebuke"], 5: ["darkness"] }, alwaysPrepared: true },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "otherworldly-presence", name: "Otherworldly Presence", text: "You know Thaumaturgy (legacy ability).",
        effects: [{ type: "spell", ids: ["thaumaturgy"] }],
      },
    ],
  },
];
