// Class option lists picked by count: Eldritch Invocations, Metamagic, Battle Master Maneuvers.
// Text is a short summary, not the book's wording.

const inv = (id, name, prereq, text, extra = {}) => ({ id, name, prereq, text, ...extra });

export const INVOCATIONS = [
  inv("agonizing-blast", "Agonizing Blast", { level: 2 }, "Add CHA to the damage of one damaging Warlock cantrip.", { repeatable: true }),
  inv("armor-of-shadows", "Armor of Shadows", {}, "Cast Mage Armor on yourself without a slot."),
  inv("ascendant-step", "Ascendant Step", { level: 5 }, "Cast Levitate on yourself without a slot."),
  inv("devils-sight", "Devil's Sight", { level: 2 }, "See normally in magical and nonmagical darkness within 120 ft."),
  inv("devouring-blade", "Devouring Blade", { level: 12, invocation: "thirsting-blade" }, "Thirsting Blade grants two extra attacks."),
  inv("eldritch-mind", "Eldritch Mind", {}, "Advantage on CON saves to maintain Concentration."),
  inv("eldritch-smite", "Eldritch Smite", { level: 5, invocation: "pact-of-the-blade" }, "Once per turn on a pact weapon hit, spend a Pact slot for extra Force damage and knock Prone."),
  inv("eldritch-spear", "Eldritch Spear", { level: 2 }, "A damaging cantrip's range increases by 30 ft × Warlock level.", { repeatable: true }),
  inv("fiendish-vigor", "Fiendish Vigor", { level: 2 }, "Cast False Life on yourself without a slot (maximum Temp HP)."),
  inv("gaze-of-two-minds", "Gaze of Two Minds", { level: 5 }, "Perceive through a willing creature's senses and cast spells from its space."),
  inv("gift-of-the-depths", "Gift of the Depths", { level: 5 }, "Breathe underwater, Swim Speed, Water Breathing free 1/Long Rest."),
  inv("gift-of-the-protectors", "Gift of the Protectors", { level: 9, invocation: "pact-of-the-tome" }, "Creatures named in your book drop to 1 HP instead of 0 (1/Long Rest)."),
  inv("investment-of-the-chain-master", "Investment of the Chain Master", { level: 5, invocation: "pact-of-the-chain" }, "Familiar gains Fly/Swim 40 ft, Bonus Action attacks, your save DC and resistance."),
  inv("lessons-of-the-first-ones", "Lessons of the First Ones", { level: 2 }, "Gain an Origin feat.", {
    repeatable: true,
    effects: [{ type: "choose", category: "feat", from: { category: ["origin"] }, count: 1, key: "feat" }],
  }),
  inv("lifedrinker", "Lifedrinker", { level: 9, invocation: "pact-of-the-blade" }, "Once per turn on a pact weapon hit, +1d6 Necrotic/Psychic/Radiant and spend a Hit Die to heal."),
  inv("mask-of-many-faces", "Mask of Many Faces", { level: 2 }, "Cast Disguise Self without a slot."),
  inv("master-of-myriad-forms", "Master of Myriad Forms", { level: 5 }, "Cast Alter Self without a slot."),
  inv("misty-visions", "Misty Visions", { level: 2 }, "Cast Silent Image without a slot."),
  inv("one-with-shadows", "One with Shadows", { level: 5 }, "In dim light or darkness, cast Invisibility on yourself without a slot."),
  inv("otherworldly-leap", "Otherworldly Leap", { level: 2 }, "Cast Jump on yourself without a slot."),
  inv("pact-of-the-blade", "Pact of the Blade", {}, "Conjure or bond a pact weapon; use CHA for its attacks and damage."),
  inv("pact-of-the-chain", "Pact of the Chain", {}, "Find Familiar without a slot, special forms, familiar attacks with your Reaction."),
  inv("pact-of-the-tome", "Pact of the Tome", {}, "Book of Shadows: 3 cantrips and 2 level 1 rituals always prepared."),
  inv("repelling-blast", "Repelling Blast", { level: 2 }, "Cantrip attack hits push Large or smaller creatures 10 ft.", { repeatable: true }),
  inv("thirsting-blade", "Thirsting Blade", { level: 5, invocation: "pact-of-the-blade" }, "Extra Attack with your pact weapon."),
  inv("visions-of-distant-realms", "Visions of Distant Realms", { level: 9 }, "Cast Arcane Eye without a slot."),
  inv("whispers-of-the-grave", "Whispers of the Grave", { level: 7 }, "Cast Speak with Dead without a slot."),
  inv("witch-sight", "Witch Sight", { level: 15 }, "Truesight 30 ft.", { effects: [{ type: "sense", id: "truesight", range: 30 }] }),
];

export const METAMAGIC = [
  ["careful-spell", "Careful Spell", 1, "Up to CHA-mod creatures auto-succeed on the save and take no damage on half-damage saves."],
  ["distant-spell", "Distant Spell", 1, "Double a spell's range, or Touch becomes 30 ft."],
  ["empowered-spell", "Empowered Spell", 1, "Reroll up to CHA-mod damage dice."],
  ["extended-spell", "Extended Spell", 1, "Double a 1+ minute duration (max 24 hours); Advantage on Concentration."],
  ["heightened-spell", "Heightened Spell", 2, "One target has Disadvantage on its save."],
  ["quickened-spell", "Quickened Spell", 2, "Action casting time becomes a Bonus Action."],
  ["seeking-spell", "Seeking Spell", 1, "Reroll a missed spell attack."],
  ["subtle-spell", "Subtle Spell", 1, "Cast without V, S or non-costly M components."],
  ["transmuted-spell", "Transmuted Spell", 1, "Swap acid, cold, fire, lightning, poison or thunder damage for another of those."],
  ["twinned-spell", "Twinned Spell", 1, "Spell counts one level higher to target an extra creature."],
].map(([id, name, cost, text]) => ({ id, name, cost, text: `${cost} SP: ${text}` }));

export const MANEUVERS = [
  "Ambush", "Bait and Switch", "Commander's Strike", "Commanding Presence", "Disarming Attack", "Distracting Strike",
  "Evasive Footwork", "Feinting Attack", "Goading Attack", "Lunging Attack", "Maneuvering Attack", "Menacing Attack",
  "Parry", "Precision Attack", "Pushing Attack", "Rally", "Riposte", "Sweeping Attack", "Tactical Assessment", "Trip Attack",
].map((name) => ({ id: name.toLowerCase().replace(/'/g, "").replace(/ /g, "-"), name, text: "" }));
