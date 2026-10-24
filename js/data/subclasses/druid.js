// Druid subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

const land = (id, name, resistance, byLevel) => ({
  id, name, text: `Resistance (Nature's Ward, 10th): ${resistance}.`,
  effects: [{ type: "spell", byLevel, alwaysPrepared: true }],
});

export const DRUID_SUBCLASSES = [
  {
    id: "land", name: "Circle of the Land",
    features: [
      {
        id: "circle-of-the-land-spells", level: 3, name: "Circle of the Land Spells",
        text: "Choose a land type after each Long Rest; its spells are always prepared.",
        effects: [{
          type: "choose", category: "option", count: 1, key: "land.type",
          options: [
            land("arid", "Arid", "Fire", { 3: ["blur", "burning-hands", "fire-bolt"], 5: ["fireball"], 7: ["blight"], 9: ["wall-of-stone"] }),
            land("polar", "Polar", "Cold", { 3: ["fog-cloud", "hold-person", "ray-of-frost"], 5: ["sleet-storm"], 7: ["ice-storm"], 9: ["cone-of-cold"] }),
            land("temperate", "Temperate", "Lightning", { 3: ["misty-step", "shocking-grasp", "sleep"], 5: ["lightning-bolt"], 7: ["freedom-of-movement"], 9: ["tree-stride"] }),
            land("tropical", "Tropical", "Poison", { 3: ["acid-splash", "ray-of-sickness", "web"], 5: ["stinking-cloud"], 7: ["polymorph"], 9: ["insect-plague"] }),
          ],
        }],
      },
      {
        id: "lands-aid", level: 3, name: "Land's Aid",
        text: "Wild Shape use: 10-ft sphere within 60 ft, CON save, 2d6 Necrotic (half on success); one creature heals 2d6. 3d6 at 10th, 4d6 at 14th.",
      },
      {
        id: "natural-recovery", level: 6, name: "Natural Recovery",
        text: "Cast one prepared circle spell without a slot (1/Long Rest); on a Short Rest recover slots up to half Druid level (1/Long Rest).",
      },
      { id: "natures-ward", level: 10, name: "Nature's Ward", text: "Immune to Poisoned; Resistance by land type (Fire, Cold, Lightning or Poison)." },
      {
        id: "natures-sanctuary", level: 14, name: "Nature's Sanctuary",
        text: "Wild Shape use: 15-ft Cube of trees within 120 ft for 1 minute; Half Cover and your Nature's Ward resistance for allies inside.",
      },
    ],
  },
  {
    id: "moon", name: "Circle of the Moon",
    features: [
      {
        id: "circle-forms", level: 3, name: "Circle Forms",
        text: "Wild Shape max CR = Druid level ÷ 3; AC is at least 13 + WIS; Temp HP = 3 × Druid level.",
      },
      {
        id: "circle-of-the-moon-spells", level: 3, name: "Circle of the Moon Spells",
        text: "Always prepared; castable in Wild Shape.",
        effects: [{
          type: "spell", alwaysPrepared: true,
          byLevel: { 3: ["cure-wounds", "moonbeam", "starry-wisp"], 5: ["conjure-animals"], 7: ["fount-of-moonlight"], 9: ["mass-cure-wounds"] },
        }],
      },
      {
        id: "improved-circle-forms", level: 6, name: "Improved Circle Forms",
        text: "In Wild Shape: attacks can deal Radiant; add WIS to CON saves.",
      },
      {
        id: "moonlight-step", level: 10, name: "Moonlight Step",
        text: "Bonus Action: teleport 30 ft and gain Advantage on your next attack this turn. Regain uses with level 2+ slots.",
        effects: [{ type: "resource", id: "moonlight-step", name: "Moonlight Step", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
      {
        id: "lunar-form", level: 14, name: "Lunar Form",
        text: "Once per turn, +2d10 Radiant on a Wild Shape hit; Moonlight Step can bring a willing creature.",
      },
    ],
  },
  {
    id: "sea", name: "Circle of the Sea",
    features: [
      {
        id: "circle-of-the-sea-spells", level: 3, name: "Circle of the Sea Spells", text: "Always prepared.",
        effects: [{
          type: "spell", alwaysPrepared: true,
          byLevel: {
            3: ["fog-cloud", "gust-of-wind", "ray-of-frost", "thunderwave"],
            5: ["lightning-bolt", "water-breathing"],
            7: ["control-water", "ice-storm"],
            9: ["conjure-elemental", "hold-monster"],
          },
        }],
      },
      {
        id: "wrath-of-the-sea", level: 3, name: "Wrath of the Sea",
        text: "Wild Shape use, Bonus Action: 5-ft Emanation for 10 min; each turn a creature in it makes a CON save or takes WIS-mod d6 Cold and is pushed 15 ft.",
      },
      { id: "aquatic-affinity", level: 6, name: "Aquatic Affinity", text: "Emanation grows to 10 ft; Swim Speed equal to your Speed." },
      { id: "stormborn", level: 10, name: "Stormborn", text: "While the Emanation is active: Fly Speed and Resistance to Cold, Lightning, Thunder." },
      { id: "oceanic-gift", level: 14, name: "Oceanic Gift", text: "Center the Emanation on a willing ally within 60 ft (or both of you for 2 uses)." },
    ],
  },
  {
    id: "stars", name: "Circle of the Stars",
    features: [
      {
        id: "star-map", level: 3, name: "Star Map",
        text: "Spellcasting focus; Guidance and Guiding Bolt always prepared; cast Guiding Bolt without a slot.",
        effects: [
          { type: "spell", ids: ["guidance", "guiding-bolt"], alwaysPrepared: true },
          { type: "resource", id: "star-map", name: "Star Map (Guiding Bolt)", max: { ability: "wis", min: 1 }, recharge: "long" },
        ],
      },
      {
        id: "starry-form", level: 3, name: "Starry Form",
        text: "Wild Shape use, 10 min: Archer (Bonus Action 1d8 + WIS Radiant ranged attack), Chalice (healing spells heal 1d8 + WIS more), Dragon (9 or lower counts as 10 on INT/WIS checks and Concentration).",
      },
      {
        id: "cosmic-omen", level: 6, name: "Cosmic Omen",
        text: "After a Long Rest roll: even = Reaction add 1d6 to a D20 Test, odd = subtract 1d6.",
        effects: [{ type: "resource", id: "cosmic-omen", name: "Cosmic Omen", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
      {
        id: "twinkling-constellations", level: 10, name: "Twinkling Constellations",
        text: "Archer and Chalice use 2d8; Dragon grants 20-ft Fly (hover); change constellation each turn.",
      },
      { id: "full-of-stars", level: 14, name: "Full of Stars", text: "In Starry Form: Resistance to Bludgeoning, Piercing and Slashing." },
    ],
  },
];
