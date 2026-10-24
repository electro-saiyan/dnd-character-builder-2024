// Turns a choice (from derive().choices) into the list of options the player can pick, and checks picks.
// Pure (no DOM) so it can be used by the wizard and validate.js alike.
import { isWeaponProficient } from "./rules.js";

export const ABILITY_NAMES = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };
export const ABILITY_ABBR = { str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA" };

export const CATEGORY_LABEL = {
  skill: "Skill", tool: "Tool", language: "Language", feat: "Feat", ability: "Ability Score", expertise: "Expertise",
  skillOrTool: "Skill or Tool", skillOrExpertise: "Skill", option: "Option", mastery: "Weapon Mastery", spell: "Spell",
  spellbook: "Spellbook Spell",
  spellAbility: "Spellcasting Ability", damageType: "Damage Type", resistance: "Resistance", invocation: "Eldritch Invocation",
  metamagic: "Metamagic", maneuver: "Maneuver",
};

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

// Spell picks (incl. spellbook additions) are made in the Spells step, not where the feature is.
export const isSpellChoice = (c) => c.effect.category === "spell" || c.effect.category === "spellbook";

// Why a feat can't be picked right now, or "" if it can.
function featBlocked(feat, sheet, mine) {
  const p = feat.prereq ?? {};
  if (p.level && sheet.level < p.level) return `Level ${p.level}+`;
  if (p.scores) {
    const [abilities, min] = p.scores;
    if (!abilities.some((a) => sheet.abilities[a].score >= min)) return `${abilities.map((a) => ABILITY_ABBR[a]).join(" or ")} ${min}+`;
  }
  if (p.training && !sheet.training.armor.includes(p.training)) return `${capitalize(p.training)} training`;
  if (p.spellcasting && !sheet.spellcasting) return "Spellcasting feature";
  const taken = sheet.features.some((f) => f.kind === "feat" && f.id === feat.id);
  if (taken && !feat.repeatable && !mine.has(feat.id)) return "already taken";
  return "";
}

const spellDetail = (s) => `${s.level === 0 ? "Cantrip" : `Lvl ${s.level}`} · ${capitalize(s.school)}`;
// Picker group heading for a spell's level.
const spellGroup = (s) => (s.level === 0 ? "Cantrips" : `Level ${s.level}`);

// spec: { list?: id | ids, level?, minLevel?, school?: [...], ritual?, castingTime?, spellbook? (only spells in it) };
// without a level: minLevel (default 0, cantrips) up to the highest slot level.
export function spellsMatching(spec, sheet, reg) {
  const lists = spec.list ? [].concat(spec.list) : null;
  const maxLevel = sheet.spellcasting?.maxLevel ?? 9;
  const book = spec.spellbook ? new Set(sheet.spellcasting?.spellbook ?? []) : null;
  return Object.values(reg.spells)
    .filter((s) => (spec.level === undefined ? s.level >= (spec.minLevel ?? 0) && s.level <= maxLevel : s.level === spec.level))
    .filter((s) => !lists || s.classes.some((c) => lists.includes(c)))
    .filter((s) => !spec.school || spec.school.includes(s.school))
    .filter((s) => !spec.ritual || s.ritual)
    .filter((s) => !spec.castingTime || s.castingTime === spec.castingTime)
    .filter((s) => !book || book.has(s.id))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

export function optionsFor(choice, { reg, sheet }) {
  const e = choice.effect;
  const from = e.from;
  const mine = new Set(choice.chosen);
  const taken = (has, id) => has && !mine.has(id);
  // Granted by some source other than this choice (so picking it here would be a duplicate).
  const elsewhere = (category, id) => (sheet.profSources?.[category]?.[id] ?? []).some((by) => by !== choice.key);

  const skillOpt = (id) => {
    const s = sheet.skills[id];
    const t = elsewhere("skill", id);
    return { id, name: s.name, detail: ABILITY_ABBR[s.ability], disabled: t, reason: t ? "already proficient" : "" };
  };
  const toolOpt = (t) => {
    const blocked = elsewhere("tool", t.id);
    return { id: t.id, name: t.name, detail: t.toolType, disabled: blocked, reason: blocked ? "already proficient" : "" };
  };
  const tools = (spec) =>
    Array.isArray(spec)
      ? spec.map((id) => reg.items[id]).filter(Boolean)
      : Object.values(reg.items).filter((i) => i.kind === "tool" && (!spec?.toolType || spec.toolType.includes(i.toolType)));
  const named = (table) => Object.values(table).map((x) => ({ id: x.id, name: x.name, text: x.text }));

  switch (e.category) {
    case "skill":
      return (from === "any" ? reg.skills.map((s) => s.id) : from).map(skillOpt);
    case "tool":
      return tools(from === "any" ? null : from).map(toolOpt);
    case "skillOrTool":
      return [...reg.skills.map((s) => skillOpt(s.id)), ...tools(null).map(toolOpt)];
    case "skillOrExpertise":
      return from.map((id) => ({ id, name: sheet.skills[id].name, detail: sheet.skills[id].prof && !mine.has(id) ? "Expertise" : "Proficiency" }));
    case "expertise": {
      const ids = from === "proficient" ? reg.skills.map((s) => s.id) : from;
      return ids
        .filter((id) => sheet.skills[id].prof || mine.has(id))
        .map((id) => {
          const t = taken(sheet.skills[id].expertise, id);
          return { id, name: sheet.skills[id].name, disabled: t, reason: t ? "already Expertise" : "" };
        });
    }
    case "language": {
      return Object.values(reg.languages)
        .filter((l) => !l.secret)
        .map((l) => {
          const t = elsewhere("language", l.id);
          return { id: l.id, name: l.name, detail: l.rarity === "rare" ? "rare" : "", disabled: t, reason: t ? "already known" : "" };
        });
    }
    case "ability":
      return from.map((id) => ({ id, name: ABILITY_NAMES[id], detail: String(sheet.abilities[id].score) }));
    case "spellAbility":
      return from.map((id) => ({ id, name: ABILITY_NAMES[id] }));
    case "damageType":
    case "resistance":
      return from.map((id) => ({ id, name: capitalize(id) }));
    case "option":
      return e.options.map((o) => ({ id: o.id, name: o.name, text: o.text }));
    case "feat":
      return Object.values(reg.feats)
        .filter((f) => from.category.includes(f.category))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => {
          const why = featBlocked(f, sheet, mine);
          return { id: f.id, name: f.name, text: f.text, disabled: !!why, reason: why };
        });
    case "mastery":
      return Object.values(reg.items)
        .filter((w) => w.kind === "weapon" && !w.focus && (!from?.type || w.type === from.type))
        .filter((w) => isWeaponProficient(w, sheet.training.weapons))
        .map((w) => ({ id: w.id, name: w.name, detail: w.mastery ? capitalize(w.mastery) : "" }));
    case "spellbook": {
      const book = new Set(sheet.spellcasting?.spellbook ?? []);
      return spellsMatching(from, sheet, reg).map((s) => {
        const t = taken(book.has(s.id), s.id);
        return { id: s.id, name: s.name, detail: spellDetail(s), group: spellGroup(s), disabled: t, reason: t ? "already in spellbook" : "" };
      });
    }
    case "spell": {
      const known = new Set(sheet.spellList.map((s) => s.id));
      return spellsMatching(from, sheet, reg).map((s) => {
        const t = taken(known.has(s.id), s.id);
        return { id: s.id, name: s.name, detail: spellDetail(s), group: spellGroup(s), disabled: t, reason: t ? "already known" : "" };
      });
    }
    case "invocation": {
      const have = new Set(sheet.selections.invocation ?? []);
      return Object.values(reg.invocations).map((inv) => {
        let why = "";
        if (inv.prereq.level && sheet.level < inv.prereq.level) why = `Warlock ${inv.prereq.level}+`;
        else if (inv.prereq.invocation && !have.has(inv.prereq.invocation)) why = `needs ${reg.invocations[inv.prereq.invocation].name}`;
        return { id: inv.id, name: inv.name, text: inv.text, disabled: !!why && !mine.has(inv.id), reason: why };
      });
    }
    case "metamagic":
      return named(reg.metamagic);
    case "maneuver":
      return named(reg.maneuvers);
    default:
      return [];
  }
}

// Returns an error message for an incomplete or invalid choice, or "".
export function choiceError(choice, ctx) {
  const { chosen, count, effect } = choice;
  if (chosen.length < count) return `choose ${count - chosen.length} more`;
  const options = new Map(optionsFor(choice, ctx).map((o) => [o.id, o]));
  for (const id of chosen) {
    const o = options.get(id);
    if (!o) return `"${id}" is not a valid pick`;
    if (o.disabled) return `${o.name}: ${o.reason}`;
  }
  if (!effect.allowDuplicates && new Set(chosen).size !== chosen.length) return "duplicate picks";
  return "";
}

export const describeChoice = (choice) =>
  choice.effect.category === "option"
    ? `${choice.source} — choose ${choice.count === 1 ? "one" : choice.count}`
    : `${choice.source} — ${choice.count > 1 ? `${choice.count} × ` : ""}${CATEGORY_LABEL[choice.effect.category] ?? choice.effect.category}`;

export { spellDetail, spellGroup };
