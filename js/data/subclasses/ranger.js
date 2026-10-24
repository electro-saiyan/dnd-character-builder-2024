// Ranger subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

const rangerSpells = (byLevel) => ({
  id: "subclass-spells", level: 3, name: "Subclass Spells", text: "Always prepared at the listed Ranger levels.",
  effects: [{ type: "spell", byLevel, alwaysPrepared: true }],
});

export const RANGER_SUBCLASSES = [
  {
    id: "beast-master", name: "Beast Master",
    features: [
      {
        id: "primal-companion", level: 3, name: "Primal Companion",
        text: "Beast of the Land, Sea or Sky (AC 13 + WIS, HP 5 + 5 × level, or 4 + 4 × level for Sky). It Dodges unless you command it (Bonus Action or replace an attack).",
      },
      {
        id: "exceptional-training", level: 7, name: "Exceptional Training",
        text: "Commanding the beast also lets it Dash, Disengage, Dodge or Help; its attacks can deal Force.",
      },
      { id: "bestial-fury", level: 11, name: "Bestial Fury", text: "Beast's Strike twice per command; first hit on your Hunter's Mark target adds the Mark damage as Force." },
      { id: "share-spells", level: 15, name: "Share Spells", text: "Spells you cast on yourself also affect the beast within 30 ft." },
    ],
  },
  {
    id: "fey-wanderer", name: "Fey Wanderer",
    features: [
      rangerSpells({ 3: ["charm-person"], 5: ["misty-step"], 9: ["summon-fey"], 13: ["dimension-door"], 17: ["mislead"] }),
      { id: "dreadful-strikes", level: 3, name: "Dreadful Strikes", text: "Once per turn, a weapon hit deals +1d4 Psychic (1d6 at 11th)." },
      {
        id: "otherworldly-glamour", level: 3, name: "Otherworldly Glamour",
        text: "Add WIS (min +1) to CHA checks; proficiency in Deception, Performance or Persuasion.",
        effects: [
          { type: "bonus", target: "check:cha", value: { ability: "wis", min: 1 } },
          { type: "choose", category: "skill", from: ["deception", "performance", "persuasion"], count: 1, key: "feyWanderer.skill" },
        ],
      },
      {
        id: "beguiling-twist", level: 7, name: "Beguiling Twist",
        text: "Advantage on saves vs Charmed/Frightened; when one succeeds near you, Reaction: another creature makes a WIS save or is Charmed/Frightened.",
      },
      {
        id: "fey-reinforcements", level: 11, name: "Fey Reinforcements",
        text: "Summon Fey without Material components; once per Long Rest without a slot, optionally without Concentration.",
      },
      {
        id: "misty-wanderer", level: 15, name: "Misty Wanderer",
        text: "Cast Misty Step without a slot and bring a willing creature within 5 ft.",
        effects: [{ type: "resource", id: "misty-wanderer", name: "Misty Wanderer", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
    ],
  },
  {
    id: "gloom-stalker", name: "Gloom Stalker",
    features: [
      rangerSpells({ 3: ["disguise-self"], 5: ["rope-trick"], 9: ["fear"], 13: ["greater-invisibility"], 17: ["seeming"] }),
      {
        id: "dread-ambusher", level: 3, name: "Dread Ambusher",
        text: "Add WIS to Initiative; +10 ft Speed on your first combat turn; Dreadful Strike: +2d6 Psychic once per turn.",
        effects: [
          { type: "bonus", target: "initiative", value: "abilityMod:wis" },
          { type: "resource", id: "dreadful-strike", name: "Dreadful Strike", max: { ability: "wis", min: 1 }, recharge: "long" },
        ],
      },
      {
        id: "umbral-sight", level: 3, name: "Umbral Sight",
        text: "Darkvision 60 ft (or +60 ft); Invisible to Darkvision while in Darkness.",
        effects: [{ type: "sense", id: "darkvision", range: 60, stack: true }],
      },
      {
        id: "iron-mind", level: 7, name: "Iron Mind", text: "Proficiency in WIS saving throws.",
        effects: [{ type: "prof", category: "save", ids: ["wis"] }],
      },
      {
        id: "stalkers-flurry", level: 11, name: "Stalker's Flurry",
        text: "Dreadful Strike becomes 2d8 and adds Sudden Strike (extra attack nearby) or Mass Fear (WIS save, Frightened).",
      },
      { id: "shadowy-dodge", level: 15, name: "Shadowy Dodge", text: "Reaction: impose Disadvantage on an attack against you, then teleport 30 ft." },
    ],
  },
  {
    id: "hunter", name: "Hunter",
    features: [
      { id: "hunters-lore", level: 3, name: "Hunter's Lore", text: "Know the Immunities, Resistances and Vulnerabilities of your Hunter's Mark target." },
      {
        id: "hunters-prey", level: 3, name: "Hunter's Prey",
        text: "Colossus Slayer (+1d8 once per turn vs a wounded target) or Horde Breaker (extra attack vs an adjacent creature). Swap on a rest.",
      },
      {
        id: "defensive-tactics", level: 7, name: "Defensive Tactics",
        text: "Escape the Horde (Opportunity Attacks vs you have Disadvantage) or Multiattack Defense. Swap on a rest.",
      },
      { id: "superior-hunters-prey", level: 11, name: "Superior Hunter's Prey", text: "Once per turn, Hunter's Mark damage also hits a second creature within 30 ft." },
      { id: "superior-hunters-defense", level: 15, name: "Superior Hunter's Defense", text: "Reaction when damaged: Resistance to that damage type this turn." },
    ],
  },
];
