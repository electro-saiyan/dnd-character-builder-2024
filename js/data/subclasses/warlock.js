// Warlock subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

const patronSpells = (name, byLevel) => ({
  id: "patron-spells", level: 3, name: `${name} Spells`, text: "Always prepared at the listed Warlock levels.",
  effects: [{ type: "spell", byLevel, alwaysPrepared: true }],
});

export const WARLOCK_SUBCLASSES = [
  {
    id: "archfey", name: "Archfey Patron",
    features: [
      patronSpells("Archfey", {
        3: ["calm-emotions", "faerie-fire", "misty-step", "phantasmal-force", "sleep"],
        5: ["blink", "plant-growth"],
        7: ["dominate-beast", "greater-invisibility"],
        9: ["dominate-person", "seeming"],
      }),
      {
        id: "steps-of-the-fey", level: 3, name: "Steps of the Fey",
        text: "Cast Misty Step without a slot, adding Refreshing Step (1d10 Temp HP) or Taunting Step (WIS save, Disadvantage vs others).",
        effects: [{ type: "resource", id: "steps-of-the-fey", name: "Steps of the Fey", max: { ability: "cha", min: 1 }, recharge: "long" }],
      },
      {
        id: "misty-escape", level: 6, name: "Misty Escape",
        text: "Misty Step as a Reaction when damaged; new options Disappearing Step (Invisible) or Dreadful Step (WIS save, 2d10 Psychic).",
      },
      {
        id: "beguiling-defenses", level: 10, name: "Beguiling Defenses",
        text: "Immune to Charmed. Reaction when hit: halve the damage and attacker makes a WIS save or takes it as Psychic. 1/Long Rest or a Pact slot.",
      },
      { id: "bewitching-magic", level: 14, name: "Bewitching Magic", text: "After an Enchantment or Illusion slot spell, cast Misty Step free as part of the action." },
    ],
  },
  {
    id: "celestial", name: "Celestial Patron",
    features: [
      patronSpells("Celestial", {
        3: ["aid", "cure-wounds", "guiding-bolt", "lesser-restoration", "light", "sacred-flame"],
        5: ["daylight", "revivify"],
        7: ["guardian-of-faith", "wall-of-fire"],
        9: ["greater-restoration", "summon-celestial"],
      }),
      {
        id: "healing-light", level: 3, name: "Healing Light",
        text: "Bonus Action: spend up to CHA-mod d6s from the pool to heal a creature within 60 ft.",
        effects: [{ type: "resource", id: "healing-light", name: "Healing Light (d6)", max: { times: 1, value: "level", plus: 1 }, recharge: "long" }],
      },
      { id: "radiant-soul", level: 6, name: "Radiant Soul", text: "Resistance to Radiant; once per turn add CHA to a Radiant or Fire spell damage roll." },
      {
        id: "celestial-resilience", level: 10, name: "Celestial Resilience",
        text: "After Magical Cunning or a rest: Temp HP = Warlock level + CHA; up to five others get half level + CHA.",
      },
      {
        id: "searing-vengeance", level: 14, name: "Searing Vengeance",
        text: "When you or an ally makes a Death Save: regain half HP; nearby enemies take 2d8 + CHA Radiant and are Blinded. 1/Long Rest.",
        effects: [{ type: "resource", id: "searing-vengeance", name: "Searing Vengeance", max: 1, recharge: "long" }],
      },
    ],
  },
  {
    id: "fiend", name: "Fiend Patron",
    features: [
      {
        id: "dark-ones-blessing", level: 3, name: "Dark One's Blessing",
        text: "When you (or an ally near you) drop an enemy to 0 HP, gain CHA + Warlock level Temp HP.",
      },
      patronSpells("Fiend", {
        3: ["burning-hands", "command", "scorching-ray", "suggestion"],
        5: ["fireball", "stinking-cloud"],
        7: ["fire-shield", "wall-of-fire"],
        9: ["geas", "insect-plague"],
      }),
      {
        id: "dark-ones-own-luck", level: 6, name: "Dark One's Own Luck",
        text: "Add 1d10 to an ability check or save after seeing the roll.",
        effects: [{ type: "resource", id: "dark-ones-own-luck", name: "Dark One's Own Luck", max: { ability: "cha", min: 1 }, recharge: "long" }],
      },
      { id: "fiendish-resilience", level: 10, name: "Fiendish Resilience", text: "After a rest, choose a damage type (not Force): Resistance to it." },
      {
        id: "hurl-through-hell", level: 14, name: "Hurl Through Hell",
        text: "Once per turn on a hit: CHA save or 8d10 Psychic and Incapacitated until your next turn. 1/Long Rest or a Pact slot.",
      },
    ],
  },
  {
    id: "great-old-one", name: "Great Old One Patron",
    features: [
      {
        id: "awakened-mind", level: 3, name: "Awakened Mind",
        text: "Bonus Action: telepathic link with a creature within 30 ft (CHA miles, Warlock-level minutes).",
      },
      patronSpells("Great Old One", {
        3: ["detect-thoughts", "dissonant-whispers", "phantasmal-force", "tashas-hideous-laughter"],
        5: ["clairvoyance", "hunger-of-hadar"],
        7: ["confusion", "summon-aberration"],
        9: ["modify-memory", "telekinesis"],
      }),
      {
        id: "psychic-spells", level: 3, name: "Psychic Spells",
        text: "Warlock damage spells can deal Psychic; Enchantment and Illusion spells need no V/S components.",
      },
      {
        id: "clairvoyant-combatant", level: 6, name: "Clairvoyant Combatant",
        text: "Linked creature makes a WIS save or has Disadvantage vs you and you have Advantage vs it. 1/Short Rest or a Pact slot.",
      },
      {
        id: "eldritch-hex", level: 10, name: "Eldritch Hex",
        text: "Hex always prepared; its target has Disadvantage on saves of the chosen ability.",
        effects: [{ type: "spell", ids: ["hex"], alwaysPrepared: true }],
      },
      { id: "thought-shield", level: 10, name: "Thought Shield", text: "Thoughts can't be read; Resistance to Psychic and reflect Psychic damage." },
      {
        id: "create-thrall", level: 14, name: "Create Thrall",
        text: "Summon Aberration without Concentration (1 min); it gains Temp HP and adds Hex damage on hits.",
      },
    ],
  },
];
