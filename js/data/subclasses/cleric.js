// Cleric subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

const domainSpells = (name, byLevel) => ({
  id: "domain-spells", level: 3, name: `${name} Spells`, text: "Always prepared at the listed Cleric levels.",
  effects: [{ type: "spell", byLevel, alwaysPrepared: true }],
});

export const CLERIC_SUBCLASSES = [
  {
    id: "life", name: "Life Domain",
    features: [
      { id: "disciple-of-life", level: 3, name: "Disciple of Life", text: "Slot healing spells restore an extra 2 + slot level HP." },
      domainSpells("Life Domain", {
        3: ["aid", "bless", "cure-wounds", "lesser-restoration"],
        5: ["mass-healing-word", "revivify"],
        7: ["aura-of-life", "death-ward"],
        9: ["greater-restoration", "mass-cure-wounds"],
      }),
      {
        id: "preserve-life", level: 3, name: "Preserve Life",
        text: "Channel Divinity: divide 5 × Cleric level HP among Bloodied creatures within 30 ft (max half their HP).",
      },
      { id: "blessed-healer", level: 6, name: "Blessed Healer", text: "Healing others with a slot spell heals you 2 + slot level." },
      { id: "supreme-healing", level: 17, name: "Supreme Healing", text: "Healing dice from spells and Channel Divinity use their maximum value." },
    ],
  },
  {
    id: "light", name: "Light Domain",
    features: [
      domainSpells("Light Domain", {
        3: ["burning-hands", "faerie-fire", "scorching-ray", "see-invisibility"],
        5: ["daylight", "fireball"],
        7: ["arcane-eye", "wall-of-fire"],
        9: ["flame-strike", "scrying"],
      }),
      {
        id: "radiance-of-the-dawn", level: 3, name: "Radiance of the Dawn",
        text: "Channel Divinity: dispel magical Darkness in 30 ft; chosen creatures make a CON save, 2d10 + Cleric level Radiant (half on success).",
      },
      {
        id: "warding-flare", level: 3, name: "Warding Flare",
        text: "Reaction: impose Disadvantage on an attack roll within 30 ft.",
        effects: [{ type: "resource", id: "warding-flare", name: "Warding Flare", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
      {
        id: "improved-warding-flare", level: 6, name: "Improved Warding Flare",
        text: "Warding Flare recharges on a Short Rest and grants the target 2d6 + WIS Temp HP.",
        effects: [{ type: "resourceRecharge", id: "warding-flare", recharge: "short" }],
      },
      {
        id: "corona-of-light", level: 17, name: "Corona of Light",
        text: "Magic action, 1 minute: 60-ft sunlight; enemies in it have Disadvantage on saves vs Fire/Radiant spells and Radiance of the Dawn.",
        effects: [{ type: "resource", id: "corona-of-light", name: "Corona of Light", max: { ability: "wis", min: 1 }, recharge: "long" }],
      },
    ],
  },
  {
    id: "trickery", name: "Trickery Domain",
    features: [
      {
        id: "blessing-of-the-trickster", level: 3, name: "Blessing of the Trickster",
        text: "Magic action: you or a willing creature within 30 ft has Advantage on Stealth until your next Long Rest.",
      },
      domainSpells("Trickery Domain", {
        3: ["charm-person", "disguise-self", "invisibility", "pass-without-trace"],
        5: ["hypnotic-pattern", "nondetection"],
        7: ["confusion", "dimension-door"],
        9: ["dominate-person", "modify-memory"],
      }),
      {
        id: "invoke-duplicity", level: 3, name: "Invoke Duplicity",
        text: "Channel Divinity, Bonus Action: illusion of yourself within 30 ft for 1 minute; cast spells from it, Advantage vs creatures near both of you, move it 30 ft.",
      },
      { id: "tricksters-transposition", level: 6, name: "Trickster's Transposition", text: "When you create or move the illusion, you can swap places with it." },
      {
        id: "improved-duplicity", level: 17, name: "Improved Duplicity",
        text: "Allies have Advantage vs creatures next to the illusion; when it ends, a creature nearby heals your Cleric level.",
      },
    ],
  },
  {
    id: "war", name: "War Domain",
    features: [
      { id: "guided-strike", level: 3, name: "Guided Strike", text: "Channel Divinity: +10 to a missed attack roll within 30 ft (Reaction for others)." },
      domainSpells("War Domain", {
        3: ["guiding-bolt", "magic-weapon", "shield-of-faith", "spiritual-weapon"],
        5: ["crusaders-mantle", "spirit-guardians"],
        7: ["fire-shield", "freedom-of-movement"],
        9: ["hold-monster", "steel-wind-strike"],
      }),
      {
        id: "war-priest", level: 3, name: "War Priest", text: "Bonus Action: one weapon attack or Unarmed Strike.",
        effects: [{ type: "resource", id: "war-priest", name: "War Priest", max: { ability: "wis", min: 1 }, recharge: "short" }],
      },
      {
        id: "war-gods-blessing", level: 6, name: "War God's Blessing",
        text: "Channel Divinity: cast Shield of Faith or Spiritual Weapon without a slot or Concentration (1 minute).",
      },
      { id: "avatar-of-battle", level: 17, name: "Avatar of Battle", text: "Resistance to Bludgeoning, Piercing and Slashing damage." },
    ],
  },
];
