// Per-step required checks (errors block "Next") and advisory warnings for the review step.
import * as R from "./rules.js";
import { ABILITY_IDS } from "./data/skills.js";
import { choiceError, describeChoice, isSpellChoice, spellsMatching } from "./choices.js";

const sameMultiset = (a, b) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

export const ALIGNMENTS = [
  ["lg", "Lawful Good"], ["ng", "Neutral Good"], ["cg", "Chaotic Good"],
  ["ln", "Lawful Neutral"], ["n", "Neutral"], ["cn", "Chaotic Neutral"],
  ["le", "Lawful Evil"], ["ne", "Neutral Evil"], ["ce", "Chaotic Evil"],
];

// Does the spells step apply? (casters, or anyone with a feature that asks for spell picks)
export const hasSpellStep = (sheet) => !!sheet.spellcasting || sheet.choices.some(isSpellChoice);

function choiceErrors(sheet, reg, filter) {
  return sheet.choices
    .filter(filter)
    .map((c) => [c, choiceError(c, { reg, sheet })])
    .filter(([, err]) => err)
    .map(([c, err]) => `${describeChoice(c)}: ${err}.`);
}

// Wizard spellbook: right size, the first 6 are level 1, only Wizard spells you have slots for,
// and every prepared spell comes from the book.
function spellbookErrors(ch, sheet, reg) {
  const sc = sheet.spellcasting;
  const picks = ch.spells.spellbook ?? [];
  const errors = [];
  if (picks.length !== sc.spellbookSize) errors.push(`Choose ${sc.spellbookSize} spellbook spells (${picks.length} chosen).`);
  const levelOne = picks.filter((id) => reg.spells[id]?.level === 1).length;
  if (levelOne < Math.min(6, sc.spellbookSize)) errors.push("Your spellbook needs at least 6 level 1 spells (the ones you start with).");
  const allowed = new Set(spellsMatching({ list: "wizard", minLevel: 1 }, sheet, reg).map((s) => s.id));
  const bad = picks.filter((id) => !allowed.has(id));
  if (bad.length) errors.push(`Not a Wizard spell you can copy yet: ${bad.map((id) => reg.spells[id]?.name ?? id).join(", ")}.`);
  const book = new Set(sc.spellbook);
  const unprepared = ch.spells.prepared.filter((id) => !book.has(id));
  if (unprepared.length) errors.push(`Prepared spells must be in your spellbook: ${unprepared.map((id) => reg.spells[id]?.name ?? id).join(", ")}.`);
  return errors;
}

function equipmentErrors(src, option, ch, label) {
  if (!src) return [];
  if (!option) return [`Choose ${label} starting equipment.`];
  return (src.equipmentChoices ?? [])
    .filter((x) => x.option === option && !ch.choices[x.key]?.length)
    .map(() => `Pick the item of your choice in ${label} equipment option ${option}.`);
}

export function validateStep(stepId, ch, sheet, reg) {
  const errors = [];
  const warnings = [];
  const cls = reg.classes[ch.classId];
  const bg = reg.backgrounds[ch.backgroundId];
  const species = reg.species[ch.speciesId];

  switch (stepId) {
    case "class":
      if (!cls) {
        errors.push("Choose a class.");
        break;
      }
      if (!(ch.level >= 1 && ch.level <= 20)) errors.push("Level must be 1–20.");
      if (ch.level >= cls.subclassLevel && !ch.subclassId) errors.push(`Choose a ${cls.name} subclass.`);
      errors.push(...choiceErrors(sheet, reg, (c) => c.step === "class" && !isSpellChoice(c)));
      errors.push(...equipmentErrors(cls, ch.equipmentOption.class, ch, "class"));
      break;

    case "origin": {
      if (!bg) errors.push("Choose a background.");
      else if (!R.validBackgroundBoosts(ch.bgBoosts, bg.abilities)) errors.push("Assign background ability boosts (+2/+1 or +1/+1/+1).");
      if (!species) errors.push("Choose a species.");
      else if ([].concat(species.size).length > 1 && !ch.size) errors.push("Choose a size.");
      errors.push(...choiceErrors(sheet, reg, (c) => c.step === "origin" && !isSpellChoice(c)));
      const extra = ch.languages.filter((l) => l !== "common");
      if (extra.length !== 2) errors.push(`Choose ${2 - extra.length > 0 ? 2 - extra.length : "only 2"} more language${extra.length === 1 ? "" : "s"}.`);
      errors.push(...equipmentErrors(bg, ch.equipmentOption.background, ch, "background"));
      break;
    }

    case "abilities": {
      const values = ABILITY_IDS.map((id) => ch.baseScores[id]);
      if (values.some((v) => v == null)) {
        errors.push("Assign a score to every ability.");
        break;
      }
      if (ch.abilityMethod === "standard" && !sameMultiset(values, R.STANDARD_ARRAY)) errors.push("Use each Standard Array value once.");
      if (ch.abilityMethod === "pointbuy") {
        const cost = R.pointBuyCost(ch.baseScores);
        if (cost === null) errors.push("Point Buy scores must be 8–15.");
        else if (cost > R.POINT_BUY_BUDGET) errors.push(`Point Buy uses ${cost} of ${R.POINT_BUY_BUDGET} points.`);
        else if (cost < R.POINT_BUY_BUDGET) warnings.push(`${R.POINT_BUY_BUDGET - cost} Point Buy points unspent.`);
      }
      if (ch.abilityMethod === "roll" && !sameMultiset(values, (ch.rolls ?? []).map((r) => r.total))) errors.push("Assign each rolled total once.");
      if (ch.abilityMethod === "manual" && values.some((v) => v < 3 || v > 18)) {
        warnings.push("Manual base scores outside 3–18 can't come from the standard methods.");
      }
      break;
    }

    case "alignment":
      if (!ch.alignment) errors.push("Choose an alignment.");
      break;

    case "details":
      if (!ch.details.name.trim()) errors.push("Enter a character name.");
      break;

    case "spells": {
      const sc = sheet.spellcasting;
      if (sc) {
        if (ch.spells.cantrips.length !== sc.cantripsKnown) errors.push(`Choose ${sc.cantripsKnown} cantrips (${ch.spells.cantrips.length} chosen).`);
        if (ch.spells.prepared.length !== sc.preparedCount) errors.push(`Prepare ${sc.preparedCount} spells (${ch.spells.prepared.length} chosen).`);
        if (sc.spellbookSize) errors.push(...spellbookErrors(ch, sheet, reg));
      }
      errors.push(...choiceErrors(sheet, reg, isSpellChoice));
      break;
    }

    case "equipment": {
      const inv = ch.inventory.map((e) => ({ e, item: reg.items[e.itemId] })).filter((x) => x.item);
      const worn = inv.filter((x) => x.e.equipped && x.item.kind === "armor");
      if (worn.length > 1) errors.push("You can wear only one suit of armor.");
      if (inv.filter((x) => x.e.equipped && x.item.kind === "shield").length > 1) errors.push("You can hold only one Shield.");
      for (const { item } of worn) {
        if (!sheet.training.armor.includes(item.armorType)) warnings.push(`No ${item.armorType} armor training: Disadvantage on STR/DEX tests and no spellcasting in ${item.name}.`);
        if (item.strReq && sheet.abilities.str.score < item.strReq) warnings.push(`${item.name} needs STR ${item.strReq}: Speed −10 ft.`);
      }
      if (inv.some((x) => x.e.equipped && x.item.kind === "shield") && !sheet.training.armor.includes("shield")) {
        warnings.push("No Shield training: the Shield gives no AC.");
      }
      const attuned = ch.inventory.filter((e) => e.attuned).length;
      if (attuned > sheet.attunementSlots) errors.push(`Attuned to ${attuned} items (max ${sheet.attunementSlots}).`);
      break;
    }

    default:
      break;
  }
  return { errors, warnings };
}
