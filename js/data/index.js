import { BARBARIAN } from "./classes/barbarian.js";
import { BARD } from "./classes/bard.js";
import { CLERIC } from "./classes/cleric.js";
import { DRUID } from "./classes/druid.js";
import { FIGHTER } from "./classes/fighter.js";
import { MONK } from "./classes/monk.js";
import { PALADIN } from "./classes/paladin.js";
import { RANGER } from "./classes/ranger.js";
import { ROGUE } from "./classes/rogue.js";
import { SORCERER } from "./classes/sorcerer.js";
import { WARLOCK } from "./classes/warlock.js";
import { WIZARD } from "./classes/wizard.js";
import { SPECIES } from "./species.js";
import { BACKGROUNDS } from "./backgrounds.js";
import { FEATS } from "./feats.js";
import { ITEMS } from "./equipment.js";
import { SPELLS, ALL_SPELLS } from "./spells.js";
import { INVOCATIONS, METAMAGIC, MANEUVERS } from "./options.js";
import { LANGUAGES } from "./languages.js";
import { ABILITIES, SKILLS } from "./skills.js";

export const CLASSES = [BARBARIAN, BARD, CLERIC, DRUID, FIGHTER, MONK, PALADIN, RANGER, ROGUE, SORCERER, WARLOCK, WIZARD];

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

// custom: { backgrounds, feats, spells, items, species } — user-defined entries, override built-ins by id.
// options.allSources: also include spells from outside the 2024 PHB.
export function createRegistry(custom = {}, { allSources = false } = {}) {
  return {
    classes: byId(CLASSES),
    species: byId([...SPECIES, ...(custom.species ?? [])]),
    backgrounds: byId([...BACKGROUNDS, ...(custom.backgrounds ?? [])]),
    feats: byId([...FEATS, ...(custom.feats ?? [])]),
    spells: byId([...(allSources ? ALL_SPELLS : SPELLS), ...(custom.spells ?? [])]),
    items: byId([...ITEMS, ...(custom.items ?? [])]),
    languages: byId(LANGUAGES),
    invocations: byId(INVOCATIONS),
    metamagic: byId(METAMAGIC),
    maneuvers: byId(MANEUVERS),
    abilities: ABILITIES,
    skills: SKILLS,
  };
}
