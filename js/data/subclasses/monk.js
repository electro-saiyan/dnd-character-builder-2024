// Monk subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

export const MONK_SUBCLASSES = [
  {
    id: "mercy", name: "Warrior of Mercy",
    features: [
      { id: "hand-of-harm", level: 3, name: "Hand of Harm", text: "Once per turn on an Unarmed Strike hit, 1 Focus: + Martial Arts die + WIS Necrotic." },
      {
        id: "hand-of-healing", level: 3, name: "Hand of Healing",
        text: "Magic action, 1 Focus: heal Martial Arts die + WIS; can replace a Flurry of Blows strike for free.",
      },
      {
        id: "implements-of-mercy", level: 3, name: "Implements of Mercy", text: "Proficiency in Insight, Medicine and the Herbalism Kit.",
        effects: [
          { type: "prof", category: "skill", ids: ["insight", "medicine"] },
          { type: "prof", category: "tool", ids: ["herbalism-kit"] },
        ],
      },
      {
        id: "physicians-touch", level: 6, name: "Physician's Touch",
        text: "Hand of Harm can Poison; Hand of Healing can end Blinded, Deafened, Paralyzed, Poisoned or Stunned.",
      },
      {
        id: "flurry-of-healing-and-harm", level: 11, name: "Flurry of Healing and Harm",
        text: "Flurry of Blows strikes can use Hand of Healing or Hand of Harm without Focus.",
        effects: [{ type: "resource", id: "flurry-of-healing-and-harm", name: "Flurry of Healing and Harm", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
      {
        id: "hand-of-ultimate-mercy", level: 17, name: "Hand of Ultimate Mercy",
        text: "Magic action, 5 Focus: revive a creature dead under 24 hours with 4d10 + WIS HP. 1/Long Rest.",
      },
    ],
  },
  {
    id: "shadow", name: "Warrior of Shadow",
    features: [
      {
        id: "shadow-arts", level: 3, name: "Shadow Arts",
        text: "1 Focus: cast Darkness (no components), see through it and move it 60 ft per turn. Darkvision 60 ft. You know Minor Illusion (WIS).",
        effects: [
          { type: "sense", id: "darkvision", range: 60, stack: true },
          { type: "spell", ids: ["darkness", "minor-illusion"] },
        ],
      },
      {
        id: "shadow-step", level: 6, name: "Shadow Step",
        text: "Bonus Action: teleport 60 ft between Dim Light or Darkness; Advantage on your next melee attack this turn.",
      },
      {
        id: "improved-shadow-step", level: 11, name: "Improved Shadow Step",
        text: "1 Focus: ignore the darkness requirement; Unarmed Strike right after teleporting.",
      },
      {
        id: "cloak-of-shadows", level: 17, name: "Cloak of Shadows",
        text: "Magic action, 3 Focus, in Dim Light/Darkness: 1 minute Invisible, move through creatures, Flurry of Blows costs no Focus.",
      },
    ],
  },
  {
    id: "elements", name: "Warrior of the Elements",
    features: [
      {
        id: "elemental-attunement", level: 3, name: "Elemental Attunement",
        text: "1 Focus, 10 min: Unarmed Strike reach +10 ft, deal Acid/Cold/Fire/Lightning/Thunder and push or pull 10 ft (STR save).",
      },
      {
        id: "manipulate-elements", level: 3, name: "Manipulate Elements", text: "You know Elementalism (WIS).",
        effects: [{ type: "spell", ids: ["elementalism"] }],
      },
      {
        id: "elemental-burst", level: 6, name: "Elemental Burst",
        text: "Magic action, 2 Focus: 20-ft sphere within 120 ft, DEX save, 3 Martial Arts dice (half on success).",
      },
      { id: "stride-of-the-elements", level: 11, name: "Stride of the Elements", text: "While attuned: Fly and Swim Speed equal to your Speed." },
      {
        id: "elemental-epitome", level: 17, name: "Elemental Epitome",
        text: "While attuned: Resistance to a chosen element; Step of the Wind +20 ft and damages creatures you pass; +1 Martial Arts die once per turn.",
      },
    ],
  },
  {
    id: "open-hand", name: "Warrior of the Open Hand",
    features: [
      {
        id: "open-hand-technique", level: 3, name: "Open Hand Technique",
        text: "Flurry of Blows hits can Addle (no Opportunity Attacks), Push 15 ft (STR save) or Topple (DEX save, Prone).",
      },
      {
        id: "wholeness-of-body", level: 6, name: "Wholeness of Body",
        text: "Bonus Action: heal Martial Arts die + WIS (min 1).",
        effects: [{ type: "resource", id: "wholeness-of-body", name: "Wholeness of Body", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
      { id: "fleet-step", level: 11, name: "Fleet Step", text: "After another Bonus Action, you can also use Step of the Wind." },
      {
        id: "quivering-palm", level: 17, name: "Quivering Palm",
        text: "4 Focus on an Unarmed Strike hit: later end it for a CON save, 10d12 Force (half on success).",
      },
    ],
  },
];
