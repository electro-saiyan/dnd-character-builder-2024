// PHB 2024 backgrounds.
// tool: an item id, or { choose, from } (choice key `${id}.tool`); equipment { choice } entries
// reference a choice key, so "the same kind as the tool proficiency" reuses `${id}.tool`.

const B = { B: [{ gp: 50 }] };

export const BACKGROUNDS = [
  {
    id: "acolyte", name: "Acolyte", source: "PHB 2024",
    abilities: ["int", "wis", "cha"], feat: "magic-initiate-cleric",
    skills: ["insight", "religion"], tool: "calligraphers-supplies",
    equipment: {
      A: [
        { item: "calligraphers-supplies" }, { item: "book" }, { item: "holy-symbol" },
        { item: "parchment", qty: 10 }, { item: "robe" }, { gp: 8 },
      ],
      ...B,
    },
  },
  {
    id: "artisan", name: "Artisan", source: "PHB 2024",
    abilities: ["str", "dex", "int"], feat: "crafter",
    skills: ["investigation", "persuasion"], tool: { choose: 1, from: { toolType: ["artisan"] } },
    equipment: { A: [{ choice: "artisan.tool" }, { item: "pouch", qty: 2 }, { item: "travelers-clothes" }, { gp: 32 }], ...B },
  },
  {
    id: "charlatan", name: "Charlatan", source: "PHB 2024",
    abilities: ["dex", "con", "cha"], feat: "skilled",
    skills: ["deception", "sleight-of-hand"], tool: "forgery-kit",
    equipment: { A: [{ item: "forgery-kit" }, { item: "costume" }, { item: "fine-clothes" }, { gp: 15 }], ...B },
  },
  {
    id: "criminal", name: "Criminal", source: "PHB 2024",
    abilities: ["dex", "con", "int"], feat: "alert",
    skills: ["sleight-of-hand", "stealth"], tool: "thieves-tools",
    equipment: {
      A: [
        { item: "dagger", qty: 2 }, { item: "thieves-tools" }, { item: "crowbar" },
        { item: "pouch", qty: 2 }, { item: "travelers-clothes" }, { gp: 16 },
      ],
      ...B,
    },
  },
  {
    id: "entertainer", name: "Entertainer", source: "PHB 2024",
    abilities: ["str", "dex", "cha"], feat: "musician",
    skills: ["acrobatics", "performance"], tool: { choose: 1, from: { toolType: ["instrument"] } },
    equipment: {
      A: [
        { choice: "entertainer.tool" }, { item: "costume", qty: 2 }, { item: "mirror" },
        { item: "perfume" }, { item: "travelers-clothes" }, { gp: 11 },
      ],
      ...B,
    },
  },
  {
    id: "farmer", name: "Farmer", source: "PHB 2024",
    abilities: ["str", "con", "wis"], feat: "tough",
    skills: ["animal-handling", "nature"], tool: "carpenters-tools",
    equipment: {
      A: [
        { item: "sickle" }, { item: "carpenters-tools" }, { item: "healers-kit" }, { item: "iron-pot" },
        { item: "shovel" }, { item: "travelers-clothes" }, { gp: 30 },
      ],
      ...B,
    },
  },
  {
    id: "guard", name: "Guard", source: "PHB 2024",
    abilities: ["str", "int", "wis"], feat: "alert",
    skills: ["athletics", "perception"], tool: { choose: 1, from: { toolType: ["gaming"] } },
    equipment: {
      A: [
        { item: "spear" }, { item: "light-crossbow" }, { item: "bolts", qty: 20 }, { choice: "guard.tool" },
        { item: "hooded-lantern" }, { item: "manacles" }, { item: "quiver" }, { item: "travelers-clothes" }, { gp: 12 },
      ],
      ...B,
    },
  },
  {
    id: "guide", name: "Guide", source: "PHB 2024",
    abilities: ["dex", "con", "wis"], feat: "magic-initiate-druid",
    skills: ["stealth", "survival"], tool: "cartographers-tools",
    equipment: {
      A: [
        { item: "shortbow" }, { item: "arrows", qty: 20 }, { item: "cartographers-tools" }, { item: "bedroll" },
        { item: "quiver" }, { item: "tent" }, { item: "travelers-clothes" }, { gp: 3 },
      ],
      ...B,
    },
  },
  {
    id: "hermit", name: "Hermit", source: "PHB 2024",
    abilities: ["con", "wis", "cha"], feat: "healer",
    skills: ["medicine", "religion"], tool: "herbalism-kit",
    equipment: {
      A: [
        { item: "quarterstaff" }, { item: "herbalism-kit" }, { item: "bedroll" }, { item: "book" },
        { item: "lamp" }, { item: "oil", qty: 3 }, { item: "travelers-clothes" }, { gp: 16 },
      ],
      ...B,
    },
  },
  {
    id: "merchant", name: "Merchant", source: "PHB 2024",
    abilities: ["con", "int", "cha"], feat: "lucky",
    skills: ["animal-handling", "persuasion"], tool: "navigators-tools",
    equipment: { A: [{ item: "navigators-tools" }, { item: "pouch", qty: 2 }, { item: "travelers-clothes" }, { gp: 22 }], ...B },
  },
  {
    id: "noble", name: "Noble", source: "PHB 2024",
    abilities: ["str", "int", "cha"], feat: "skilled",
    skills: ["history", "persuasion"], tool: { choose: 1, from: { toolType: ["gaming"] } },
    equipment: { A: [{ choice: "noble.tool" }, { item: "fine-clothes" }, { item: "perfume" }, { gp: 29 }], ...B },
  },
  {
    id: "sage", name: "Sage", source: "PHB 2024",
    abilities: ["con", "int", "wis"], feat: "magic-initiate-wizard",
    skills: ["arcana", "history"], tool: "calligraphers-supplies",
    equipment: {
      A: [
        { item: "quarterstaff" }, { item: "calligraphers-supplies" }, { item: "book" },
        { item: "parchment", qty: 8 }, { item: "robe" }, { gp: 8 },
      ],
      ...B,
    },
  },
  {
    id: "sailor", name: "Sailor", source: "PHB 2024",
    abilities: ["str", "dex", "wis"], feat: "tavern-brawler",
    skills: ["acrobatics", "perception"], tool: "navigators-tools",
    equipment: {
      A: [{ item: "dagger" }, { item: "navigators-tools" }, { item: "rope" }, { item: "travelers-clothes" }, { gp: 20 }],
      ...B,
    },
  },
  {
    id: "scribe", name: "Scribe", source: "PHB 2024",
    abilities: ["dex", "int", "wis"], feat: "skilled",
    skills: ["investigation", "perception"], tool: "calligraphers-supplies",
    equipment: {
      A: [
        { item: "calligraphers-supplies" }, { item: "fine-clothes" }, { item: "lamp" },
        { item: "oil", qty: 3 }, { item: "parchment", qty: 12 }, { gp: 23 },
      ],
      ...B,
    },
  },
  {
    id: "soldier", name: "Soldier", source: "PHB 2024",
    abilities: ["str", "dex", "con"], feat: "savage-attacker",
    skills: ["athletics", "intimidation"], tool: { choose: 1, from: { toolType: ["gaming"] } },
    equipment: {
      A: [
        { item: "spear" }, { item: "shortbow" }, { item: "arrows", qty: 20 }, { choice: "soldier.tool" },
        { item: "healers-kit" }, { item: "quiver" }, { item: "travelers-clothes" }, { gp: 14 },
      ],
      ...B,
    },
  },
  {
    id: "wayfarer", name: "Wayfarer", source: "PHB 2024",
    abilities: ["dex", "wis", "cha"], feat: "lucky",
    skills: ["insight", "stealth"], tool: "thieves-tools",
    equipmentChoices: [{ key: "wayfarer.gamingSet", from: { toolType: ["gaming"] }, option: "A" }],
    equipment: {
      A: [
        { item: "dagger", qty: 2 }, { item: "thieves-tools" }, { choice: "wayfarer.gamingSet" }, { item: "bedroll" },
        { item: "pouch", qty: 2 }, { item: "travelers-clothes" }, { gp: 16 },
      ],
      ...B,
    },
  },
];
