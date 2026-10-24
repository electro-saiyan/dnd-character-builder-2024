// PHB 2024 equipment (weapons, armor, tools, adventuring gear, packs).
// cost: "2 GP" style strings are parsed into { gp | sp | cp: n }; weight in lb (null = negligible).

const parseCost = (s) => {
  if (!s) return null;
  const [n, unit] = s.replace(",", "").split(" ");
  return { [unit.toLowerCase()]: Number(n) };
};
const slug = (name) => name.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---------- Weapons ----------
// [name, category, type, damage, damageType, properties, mastery, cost, weight, extra]
// extra: { range, versatile, ammo }
const W = [
  ["Club", "simple", "melee", "1d4", "bludgeoning", ["light"], "slow", "1 SP", 2],
  ["Dagger", "simple", "melee", "1d4", "piercing", ["finesse", "light", "thrown"], "nick", "2 GP", 1, { range: "20/60" }],
  ["Greatclub", "simple", "melee", "1d8", "bludgeoning", ["two-handed"], "push", "2 SP", 10],
  ["Handaxe", "simple", "melee", "1d6", "slashing", ["light", "thrown"], "vex", "5 GP", 2, { range: "20/60" }],
  ["Javelin", "simple", "melee", "1d6", "piercing", ["thrown"], "slow", "5 SP", 2, { range: "30/120" }],
  ["Light Hammer", "simple", "melee", "1d4", "bludgeoning", ["light", "thrown"], "nick", "2 GP", 2, { range: "20/60" }],
  ["Mace", "simple", "melee", "1d6", "bludgeoning", [], "sap", "5 GP", 4],
  ["Quarterstaff", "simple", "melee", "1d6", "bludgeoning", ["versatile"], "topple", "2 SP", 4, { versatile: "1d8" }],
  ["Sickle", "simple", "melee", "1d4", "slashing", ["light"], "nick", "1 GP", 2],
  ["Spear", "simple", "melee", "1d6", "piercing", ["thrown", "versatile"], "sap", "1 GP", 3, { range: "20/60", versatile: "1d8" }],
  ["Dart", "simple", "ranged", "1d4", "piercing", ["finesse", "thrown"], "vex", "5 CP", 0.25, { range: "20/60" }],
  ["Light Crossbow", "simple", "ranged", "1d8", "piercing", ["ammunition", "loading", "two-handed"], "slow", "25 GP", 5, { range: "80/320", ammo: "bolts" }],
  ["Shortbow", "simple", "ranged", "1d6", "piercing", ["ammunition", "two-handed"], "vex", "25 GP", 2, { range: "80/320", ammo: "arrows" }],
  ["Sling", "simple", "ranged", "1d4", "bludgeoning", ["ammunition"], "slow", "1 SP", null, { range: "30/120", ammo: "sling-bullets" }],
  ["Battleaxe", "martial", "melee", "1d8", "slashing", ["versatile"], "topple", "10 GP", 4, { versatile: "1d10" }],
  ["Flail", "martial", "melee", "1d8", "bludgeoning", [], "sap", "10 GP", 2],
  ["Glaive", "martial", "melee", "1d10", "slashing", ["heavy", "reach", "two-handed"], "graze", "20 GP", 6],
  ["Greataxe", "martial", "melee", "1d12", "slashing", ["heavy", "two-handed"], "cleave", "30 GP", 7],
  ["Greatsword", "martial", "melee", "2d6", "slashing", ["heavy", "two-handed"], "graze", "50 GP", 6],
  ["Halberd", "martial", "melee", "1d10", "slashing", ["heavy", "reach", "two-handed"], "cleave", "20 GP", 6],
  ["Lance", "martial", "melee", "1d10", "piercing", ["heavy", "reach", "two-handed"], "topple", "10 GP", 6, { note: "two-handed unless mounted" }],
  ["Longsword", "martial", "melee", "1d8", "slashing", ["versatile"], "sap", "15 GP", 3, { versatile: "1d10" }],
  ["Maul", "martial", "melee", "2d6", "bludgeoning", ["heavy", "two-handed"], "topple", "10 GP", 10],
  ["Morningstar", "martial", "melee", "1d8", "piercing", [], "sap", "15 GP", 4],
  ["Pike", "martial", "melee", "1d10", "piercing", ["heavy", "reach", "two-handed"], "push", "5 GP", 18],
  ["Rapier", "martial", "melee", "1d8", "piercing", ["finesse"], "vex", "25 GP", 2],
  ["Scimitar", "martial", "melee", "1d6", "slashing", ["finesse", "light"], "nick", "25 GP", 3],
  ["Shortsword", "martial", "melee", "1d6", "piercing", ["finesse", "light"], "vex", "10 GP", 2],
  ["Trident", "martial", "melee", "1d8", "piercing", ["thrown", "versatile"], "topple", "5 GP", 4, { range: "20/60", versatile: "1d10" }],
  ["Warhammer", "martial", "melee", "1d8", "bludgeoning", ["versatile"], "push", "15 GP", 5, { versatile: "1d10" }],
  ["War Pick", "martial", "melee", "1d8", "piercing", ["versatile"], "sap", "5 GP", 2, { versatile: "1d10" }],
  ["Whip", "martial", "melee", "1d4", "slashing", ["finesse", "reach"], "slow", "2 GP", 3],
  ["Blowgun", "martial", "ranged", "1", "piercing", ["ammunition", "loading"], "vex", "10 GP", 1, { range: "25/100", ammo: "needles" }],
  ["Hand Crossbow", "martial", "ranged", "1d6", "piercing", ["ammunition", "light", "loading"], "vex", "75 GP", 3, { range: "30/120", ammo: "bolts" }],
  ["Heavy Crossbow", "martial", "ranged", "1d10", "piercing", ["ammunition", "heavy", "loading", "two-handed"], "push", "50 GP", 18, { range: "100/400", ammo: "bolts" }],
  ["Longbow", "martial", "ranged", "1d8", "piercing", ["ammunition", "heavy", "two-handed"], "slow", "50 GP", 2, { range: "150/600", ammo: "arrows" }],
  ["Musket", "martial", "ranged", "1d12", "piercing", ["ammunition", "loading", "two-handed"], "slow", "500 GP", 10, { range: "40/120", ammo: "firearm-bullets" }],
  ["Pistol", "martial", "ranged", "1d10", "piercing", ["ammunition", "loading"], "vex", "250 GP", 3, { range: "30/90", ammo: "firearm-bullets" }],
];

export const WEAPONS = W.map(([name, category, type, damage, damageType, properties, mastery, cost, weight, extra = {}]) => ({
  id: slug(name), name, kind: "weapon", category, type, damage, damageType, properties, mastery,
  cost: parseCost(cost), weight, ...extra,
}));

// ---------- Armor ----------
// [name, armorType, ac, dexCap (null = full, 0 = none), strReq, stealthDis, weight, cost]
const A = [
  ["Padded Armor", "light", 11, null, 0, true, 8, "5 GP"],
  ["Leather Armor", "light", 11, null, 0, false, 10, "10 GP"],
  ["Studded Leather Armor", "light", 12, null, 0, false, 13, "45 GP"],
  ["Hide Armor", "medium", 12, 2, 0, false, 12, "10 GP"],
  ["Chain Shirt", "medium", 13, 2, 0, false, 20, "50 GP"],
  ["Scale Mail", "medium", 14, 2, 0, true, 45, "50 GP"],
  ["Breastplate", "medium", 14, 2, 0, false, 20, "400 GP"],
  ["Half Plate Armor", "medium", 15, 2, 0, true, 40, "750 GP"],
  ["Ring Mail", "heavy", 14, 0, 0, true, 40, "30 GP"],
  ["Chain Mail", "heavy", 16, 0, 13, true, 55, "75 GP"],
  ["Splint Armor", "heavy", 17, 0, 15, true, 60, "200 GP"],
  ["Plate Armor", "heavy", 18, 0, 15, true, 65, "1500 GP"],
];

export const ARMOR = [
  ...A.map(([name, armorType, ac, dexCap, strReq, stealthDis, weight, cost]) => ({
    id: slug(name), name, kind: "armor", armorType, ac, dexCap, strReq, stealthDis, weight, cost: parseCost(cost),
  })),
  { id: "shield", name: "Shield", kind: "shield", ac: 2, stealthDis: false, weight: 6, cost: parseCost("10 GP") },
];

// ---------- Tools ----------
// [name, toolType, cost, weight, ability]
const T = [
  ["Alchemist's Supplies", "artisan", "50 GP", 8, "int"],
  ["Brewer's Supplies", "artisan", "20 GP", 9, "int"],
  ["Calligrapher's Supplies", "artisan", "10 GP", 5, "dex"],
  ["Carpenter's Tools", "artisan", "8 GP", 6, "str"],
  ["Cartographer's Tools", "artisan", "15 GP", 6, "wis"],
  ["Cobbler's Tools", "artisan", "5 GP", 5, "dex"],
  ["Cook's Utensils", "artisan", "1 GP", 8, "wis"],
  ["Glassblower's Tools", "artisan", "30 GP", 5, "int"],
  ["Jeweler's Tools", "artisan", "25 GP", 2, "int"],
  ["Leatherworker's Tools", "artisan", "5 GP", 5, "dex"],
  ["Mason's Tools", "artisan", "10 GP", 8, "str"],
  ["Painter's Supplies", "artisan", "10 GP", 5, "wis"],
  ["Potter's Tools", "artisan", "10 GP", 3, "int"],
  ["Smith's Tools", "artisan", "20 GP", 8, "str"],
  ["Tinker's Tools", "artisan", "50 GP", 10, "dex"],
  ["Weaver's Tools", "artisan", "1 GP", 5, "dex"],
  ["Woodcarver's Tools", "artisan", "1 GP", 5, "dex"],
  ["Disguise Kit", "other", "25 GP", 3, "cha"],
  ["Forgery Kit", "other", "15 GP", 5, "dex"],
  ["Herbalism Kit", "other", "5 GP", 3, "int"],
  ["Navigator's Tools", "other", "25 GP", 2, "wis"],
  ["Poisoner's Kit", "other", "50 GP", 2, "int"],
  ["Thieves' Tools", "other", "25 GP", 1, "dex"],
  ["Bagpipes", "instrument", "30 GP", 6, "cha"],
  ["Drum", "instrument", "6 GP", 3, "cha"],
  ["Dulcimer", "instrument", "25 GP", 10, "cha"],
  ["Flute", "instrument", "2 GP", 1, "cha"],
  ["Horn", "instrument", "3 GP", 2, "cha"],
  ["Lute", "instrument", "35 GP", 2, "cha"],
  ["Lyre", "instrument", "30 GP", 2, "cha"],
  ["Pan Flute", "instrument", "12 GP", 2, "cha"],
  ["Shawm", "instrument", "2 GP", 1, "cha"],
  ["Viol", "instrument", "30 GP", 1, "cha"],
];

const GAMING_SETS = [
  ["dice-set", "Gaming Set (Dice)", "1 SP"],
  ["dragonchess-set", "Gaming Set (Dragonchess)", "1 GP"],
  ["playing-cards", "Gaming Set (Playing Cards)", "5 SP"],
  ["three-dragon-ante", "Gaming Set (Three-Dragon Ante)", "1 GP"],
];

export const TOOLS = [
  ...T.map(([name, toolType, cost, weight, ability]) => ({ id: slug(name), name, kind: "tool", toolType, cost: parseCost(cost), weight, ability })),
  ...GAMING_SETS.map(([id, name, cost]) => ({ id, name, kind: "tool", toolType: "gaming", cost: parseCost(cost), weight: null, ability: "wis" })),
];
export const ARTISAN_TOOLS = TOOLS.filter((t) => t.toolType === "artisan");
export const MUSICAL_INSTRUMENTS = TOOLS.filter((t) => t.toolType === "instrument");

// ---------- Adventuring gear ----------
// [name, cost, weight, id?]
const G = [
  ["Acid", "25 GP", 1], ["Alchemist's Fire", "50 GP", 1], ["Antitoxin", "50 GP", null], ["Backpack", "2 GP", 5],
  ["Ball Bearings", "1 GP", 2], ["Barrel", "2 GP", 70], ["Basket", "4 SP", 2], ["Bedroll", "1 GP", 7], ["Bell", "1 GP", null],
  ["Blanket", "5 SP", 3], ["Block and Tackle", "1 GP", 5], ["Book", "25 GP", 5], ["Glass Bottle", "2 GP", 2],
  ["Bucket", "5 CP", 2], ["Caltrops", "1 GP", 2], ["Candle", "1 CP", null], ["Crossbow Bolt Case", "1 GP", 1],
  ["Map or Scroll Case", "1 GP", 1], ["Chain", "5 GP", 10], ["Chest", "5 GP", 25], ["Climber's Kit", "25 GP", 12],
  ["Fine Clothes", "15 GP", 6], ["Traveler's Clothes", "2 GP", 4], ["Component Pouch", "25 GP", 2], ["Costume", "5 GP", 4],
  ["Crowbar", "2 GP", 5], ["Flask", "2 CP", 1], ["Grappling Hook", "5 GP", 4], ["Healer's Kit", "5 GP", 3],
  ["Holy Water", "25 GP", 1], ["Hunting Trap", "5 GP", 25], ["Ink", "10 GP", null], ["Ink Pen", "2 CP", null],
  ["Jug", "2 CP", 4], ["Ladder", "1 SP", 25], ["Lamp", "5 SP", 1], ["Bullseye Lantern", "10 GP", 2],
  ["Hooded Lantern", "5 GP", 2], ["Lock", "10 GP", 1], ["Magnifying Glass", "100 GP", null], ["Manacles", "2 GP", 6],
  ["Map", "1 GP", null], ["Mirror", "5 GP", 0.5], ["Net", "1 GP", 3], ["Oil", "1 SP", 1], ["Paper", "2 SP", null],
  ["Parchment", "1 SP", null], ["Perfume", "5 GP", null], ["Basic Poison", "100 GP", null], ["Pole", "5 CP", 7],
  ["Iron Pot", "2 GP", 10], ["Potion of Healing", "50 GP", 0.5], ["Pouch", "5 SP", 1], ["Quiver", "1 GP", 1],
  ["Portable Ram", "4 GP", 35], ["Rations", "5 SP", 2], ["Robe", "1 GP", 4], ["Rope", "1 GP", 5], ["Sack", "1 CP", 0.5],
  ["Shovel", "2 GP", 5], ["Signal Whistle", "5 CP", null], ["Spell Scroll (Cantrip)", "30 GP", null],
  ["Spell Scroll (Level 1)", "50 GP", null], ["Iron Spikes", "1 GP", 5], ["Spyglass", "1000 GP", 1], ["String", "1 SP", null],
  ["Tent", "2 GP", 20], ["Tinderbox", "5 SP", 1], ["Torch", "1 CP", 1], ["Vial", "1 GP", null], ["Waterskin", "2 SP", 5],
  // Spellbook and focus variants: values from the 2024 PHB (not listed on the wiki's gear page).
  ["Spellbook", "50 GP", 3],
  ["Arcane Focus (Crystal)", "10 GP", 1, "arcane-focus-crystal"], ["Arcane Focus (Orb)", "20 GP", 3, "arcane-focus-orb"],
  ["Arcane Focus (Rod)", "10 GP", 2, "arcane-focus-rod"], ["Arcane Focus (Staff)", "5 GP", 4, "arcane-focus-staff"],
  ["Arcane Focus (Wand)", "10 GP", 1, "arcane-focus-wand"],
  ["Druidic Focus (Sprig of Mistletoe)", "1 GP", null, "druidic-focus-mistletoe"],
  ["Druidic Focus (Wooden Staff)", "5 GP", 4, "druidic-focus-staff"], ["Druidic Focus (Yew Wand)", "10 GP", 1, "druidic-focus-wand"],
  ["Holy Symbol (Amulet)", "5 GP", 1, "holy-symbol"], ["Holy Symbol (Emblem)", "5 GP", null, "holy-symbol-emblem"],
  ["Holy Symbol (Reliquary)", "5 GP", 2, "holy-symbol-reliquary"],
];

// Ammunition: sold in bundles; qty is per purchase.
const AMMO = [
  ["arrows", "Arrows", 20, "1 GP", 1],
  ["bolts", "Bolts", 20, "1 GP", 1.5],
  ["firearm-bullets", "Bullets, Firearm", 10, "3 GP", 2],
  ["sling-bullets", "Bullets, Sling", 20, "4 CP", 1.5],
  ["needles", "Needles", 50, "1 GP", 1],
];

// Staff foci double as a Quarterstaff (same stats).
const quarterstaff = WEAPONS.find((w) => w.id === "quarterstaff");
const staffWeapon = (item) => ({ ...item, kind: "weapon", focus: true, ...Object.fromEntries(
  ["category", "type", "damage", "damageType", "properties", "mastery", "versatile"].map((k) => [k, quarterstaff[k]])) });

export const GEAR = [
  ...G.map(([name, cost, weight, id]) => ({ id: id ?? slug(name), name, kind: "gear", cost: parseCost(cost), weight }))
    .map((item) => (item.id.endsWith("-staff") ? staffWeapon(item) : item)),
  ...AMMO.map(([id, name, bundle, cost, weight]) => ({ id, name, kind: "ammo", bundle, cost: parseCost(cost), weight })),
];

// ---------- Packs ----------
const P = [
  ["Burglar's Pack", "16 GP", 42, ["Backpack", "Ball Bearings", "Bell", "10 Candles", "Crowbar", "Hooded Lantern", "7 flasks of Oil", "5 days of Rations", "Rope", "Tinderbox", "Waterskin"]],
  ["Diplomat's Pack", "39 GP", 39, ["Chest", "Fine Clothes", "Ink", "5 Ink Pens", "Lamp", "2 Map or Scroll Cases", "4 flasks of Oil", "5 sheets of Paper", "5 sheets of Parchment", "Perfume", "Tinderbox"]],
  ["Dungeoneer's Pack", "12 GP", 55, ["Backpack", "Caltrops", "Crowbar", "2 flasks of Oil", "10 days of Rations", "Rope", "Tinderbox", "10 Torches", "Waterskin"]],
  ["Entertainer's Pack", "40 GP", 58.5, ["Backpack", "Bedroll", "Bell", "Bullseye Lantern", "3 Costumes", "Mirror", "8 flasks of Oil", "9 days of Rations", "Tinderbox", "Waterskin"]],
  ["Explorer's Pack", "10 GP", 55, ["Backpack", "Bedroll", "2 flasks of Oil", "10 days of Rations", "Rope", "Tinderbox", "10 Torches", "Waterskin"]],
  ["Priest's Pack", "33 GP", 29, ["Backpack", "Blanket", "Holy Water", "Lamp", "7 days of Rations", "Robe", "Tinderbox"]],
  ["Scholar's Pack", "40 GP", 22, ["Backpack", "Book", "Ink", "Ink Pen", "Lamp", "10 flasks of Oil", "10 sheets of Parchment", "Tinderbox"]],
];

export const PACKS = P.map(([name, cost, weight, contents]) => ({ id: slug(name), name, kind: "pack", cost: parseCost(cost), weight, contents }));

export const ITEMS = [...WEAPONS, ...ARMOR, ...TOOLS, ...GEAR, ...PACKS];
