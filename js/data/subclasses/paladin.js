// Paladin subclasses — PHB 2024. Feature text is a short summary, not the book's wording.

const oathSpells = (byLevel) => ({
  id: "oath-spells", level: 3, name: "Oath Spells", text: "Always prepared at the listed Paladin levels.",
  effects: [{ type: "spell", byLevel, alwaysPrepared: true }],
});

const capstone = (id, name, text) => ({
  id, level: 20, name, text: `${text} 1/Long Rest or spend a level 5 slot.`,
  effects: [{ type: "resource", id, name, max: 1, recharge: "long", note: "or spend a level 5 slot" }],
});

export const PALADIN_SUBCLASSES = [
  {
    id: "devotion", name: "Oath of Devotion",
    features: [
      oathSpells({
        3: ["protection-from-evil-and-good", "shield-of-faith"], 5: ["aid", "zone-of-truth"], 9: ["beacon-of-hope", "dispel-magic"],
        13: ["freedom-of-movement", "guardian-of-faith"], 17: ["commune", "flame-strike"],
      }),
      {
        id: "sacred-weapon", level: 3, name: "Sacred Weapon",
        text: "Channel Divinity with the Attack action: for 10 min add CHA (min +1) to attacks with a melee weapon; it can deal Radiant and sheds light.",
      },
      { id: "aura-of-devotion", level: 7, name: "Aura of Devotion", text: "You and allies in your aura are immune to Charmed." },
      { id: "smite-of-protection", level: 15, name: "Smite of Protection", text: "Divine Smite gives Half Cover to you and allies in your aura until your next turn." },
      capstone("holy-nimbus", "Holy Nimbus", "Bonus Action, 10 min: Advantage on saves vs Fiends/Undead; enemies starting in your aura take CHA + PB Radiant; aura is sunlight."),
    ],
  },
  {
    id: "glory", name: "Oath of Glory",
    features: [
      oathSpells({
        3: ["guiding-bolt", "heroism"], 5: ["enhance-ability", "magic-weapon"], 9: ["haste", "protection-from-energy"],
        13: ["compulsion", "freedom-of-movement"], 17: ["legend-lore", "yolandes-regal-presence"],
      }),
      { id: "inspiring-smite", level: 3, name: "Inspiring Smite", text: "After Divine Smite, Channel Divinity: share 2d8 + Paladin level Temp HP within 30 ft." },
      {
        id: "peerless-athlete", level: 3, name: "Peerless Athlete",
        text: "Channel Divinity, Bonus Action, 1 hour: Advantage on Athletics and Acrobatics; jumps +10 ft.",
      },
      {
        id: "aura-of-alacrity", level: 7, name: "Aura of Alacrity", text: "+10 ft Speed; allies starting in your aura gain +10 ft.",
        effects: [{ type: "bonus", target: "speed", value: 10 }],
      },
      {
        id: "glorious-defense", level: 15, name: "Glorious Defense",
        text: "Reaction: add CHA (min +1) to AC of you or a creature within 10 ft vs a hit; on a miss, attack the attacker.",
        effects: [{ type: "resource", id: "glorious-defense", name: "Glorious Defense", max: { ability: "cha", min: 1 }, recharge: "long" }],
      },
      capstone("living-legend", "Living Legend", "Bonus Action, 10 min: Advantage on CHA checks; reroll a failed save; once per turn a missed weapon attack hits."),
    ],
  },
  {
    id: "ancients", name: "Oath of the Ancients",
    features: [
      oathSpells({
        3: ["ensnaring-strike", "speak-with-animals"], 5: ["misty-step", "moonbeam"], 9: ["plant-growth", "protection-from-energy"],
        13: ["ice-storm", "stoneskin"], 17: ["commune-with-nature", "tree-stride"],
      }),
      { id: "natures-wrath", level: 3, name: "Nature's Wrath", text: "Channel Divinity: creatures within 15 ft make a STR save or are Restrained for 1 minute." },
      { id: "aura-of-warding", level: 7, name: "Aura of Warding", text: "You and allies in your aura have Resistance to Necrotic, Psychic and Radiant." },
      {
        id: "undying-sentinel", level: 15, name: "Undying Sentinel",
        text: "Dropping to 0 HP: go to 1 HP and regain 3 × Paladin level. 1/Long Rest. You don't age magically.",
        effects: [{ type: "resource", id: "undying-sentinel", name: "Undying Sentinel", max: 1, recharge: "long" }],
      },
      capstone("elder-champion", "Elder Champion", "Bonus Action, 1 min: enemies in aura have Disadvantage on saves vs you; regain 10 HP per turn; Action spells as Bonus Action."),
    ],
  },
  {
    id: "vengeance", name: "Oath of Vengeance",
    features: [
      oathSpells({
        3: ["bane", "hunters-mark"], 5: ["hold-person", "misty-step"], 9: ["haste", "protection-from-energy"],
        13: ["banishment", "dimension-door"], 17: ["hold-monster", "scrying"],
      }),
      {
        id: "vow-of-enmity", level: 3, name: "Vow of Enmity",
        text: "Channel Divinity with the Attack action: Advantage on attacks vs a creature within 30 ft for 1 minute; transfer it if the target drops.",
      },
      {
        id: "relentless-avenger", level: 7, name: "Relentless Avenger",
        text: "Opportunity Attack hit sets the target's Speed to 0; then move half your Speed without provoking.",
      },
      { id: "soul-of-vengeance", level: 15, name: "Soul of Vengeance", text: "Reaction: melee attack your Vow target after it attacks." },
      capstone("avenging-angel", "Avenging Angel", "Bonus Action, 10 min: Fly 60 ft (hover); enemies starting in your aura make a WIS save or are Frightened."),
    ],
  },
];
