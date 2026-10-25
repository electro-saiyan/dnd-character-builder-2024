// Character state (player choices only) and derive() -> every value on the sheet.
import * as R from "./rules.js";
import { ABILITY_IDS } from "./data/skills.js";

export const STATE_VERSION = 1;

export function createCharacter() {
  return {
    version: STATE_VERSION,
    classId: null,
    level: 1,
    subclassId: null,
    xp: 0,
    choices: {}, // { [effect key]: [ids] }
    equipmentOption: { class: null, background: null },
    backgroundId: null,
    speciesId: null,
    lineageId: null,
    size: null,
    abilityMethod: "standard", // "standard" | "pointbuy" | "roll"
    baseScores: { str: null, dex: null, con: null, int: null, wis: null, cha: null },
    rolls: null,
    bgBoosts: {},
    languages: ["common"],
    alignment: null,
    details: { name: "", appearance: "", personality: "", ideals: "", bonds: "", flaws: "", backstory: "" },
    spells: { cantrips: [], prepared: [], spellbook: [] },
    inventory: [], // [{ itemId, qty, equipped, attuned }]
    coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    play: {
      hpCurrent: null,
      hpTemp: 0,
      hitDiceSpent: 0,
      deathSaves: { s: 0, f: 0 },
      slotsExpended: Array(9).fill(0),
      heroicInspiration: false,
    },
    // Campaign content invented by the DM (Custom page); kept when starting a new character.
    custom: { backgrounds: [], feats: [], spells: [], items: [], species: [] },
    boons: [], // feat ids (usually custom feats) the DM granted directly
  };
}

export function createStore(initial = createCharacter()) {
  let current = initial;
  const listeners = new Set();
  // meta.quiet: listeners may skip a full re-render (e.g. typing in a text field).
  const emit = (meta = {}) => listeners.forEach((fn) => fn(current, meta));
  return {
    get: () => current,
    update(fn, meta) {
      const draft = structuredClone(current);
      fn(draft);
      current = draft;
      emit(meta);
    },
    replace(next) {
      current = next;
      emit();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

// Turns an equipment option ([{ item, qty } | { choice, qty } | { gp }]) into inventory entries + gold.
export function startingEquipment(option = [], choices = {}) {
  const items = [];
  let gp = 0;
  for (const entry of option) {
    if (entry.gp) gp += entry.gp;
    const itemId = entry.item ?? choices[entry.choice]?.[0];
    if (itemId) items.push({ itemId, qty: entry.qty ?? 1, equipped: false, attuned: false });
  }
  return { items, gp };
}

// Replaces the starting-equipment part of the inventory (entries with start: true) from the chosen
// class and background options, keeps items the player added, and sets GP to the starting total.
export function applyStartingEquipment(ch, reg) {
  const cls = reg.classes[ch.classId];
  const bg = reg.backgrounds[ch.backgroundId];
  const parts = [
    cls && ch.equipmentOption.class ? startingEquipment(cls.equipment[ch.equipmentOption.class], ch.choices) : null,
    bg && ch.equipmentOption.background ? startingEquipment(bg.equipment[ch.equipmentOption.background], ch.choices) : null,
  ].filter(Boolean);
  const items = parts.flatMap((p) => p.items).map((x) => ({ ...x, start: true }));
  ch.inventory = [...items, ...ch.inventory.filter((x) => !x.start)];
  ch.coins.gp = parts.reduce((n, p) => n + p.gp, 0);
}

const scoped = (scope, key) => (scope ? `${scope}/${key}` : key);

function classCoreEffects(cls) {
  const effects = [
    { type: "prof", category: "save", ids: cls.saves },
    { type: "prof", category: "armor", ids: cls.armor },
    { type: "prof", category: "weapon", ids: cls.weapons },
    { type: "choose", category: "skill", from: cls.skills.from, count: cls.skills.count, key: `${cls.id}.skills` },
  ];
  if (Array.isArray(cls.tools)) effects.push({ type: "prof", category: "tool", ids: cls.tools });
  else if (cls.tools) effects.push({ type: "choose", category: "tool", from: cls.tools.from, count: cls.tools.choose, key: `${cls.id}.tools` });
  return effects;
}

function backgroundCoreEffects(bg) {
  const effects = [{ type: "prof", category: "skill", ids: bg.skills }];
  if (typeof bg.tool === "string") effects.push({ type: "prof", category: "tool", ids: [bg.tool] });
  else if (bg.tool) effects.push({ type: "choose", category: "tool", from: bg.tool.from, count: bg.tool.choose, key: `${bg.id}.tool` });
  if (bg.feat) effects.push({ type: "feat", id: bg.feat, scope: "background.feat" });
  return effects;
}

export function derive(ch, reg) {
  const level = Math.min(20, Math.max(1, ch.level || 1));
  const pb = R.profBonus(level);
  const cls = reg.classes[ch.classId] ?? null;
  const subclass = cls && level >= cls.subclassLevel ? cls.subclasses.find((s) => s.id === ch.subclassId) ?? null : null;
  const bg = reg.backgrounds[ch.backgroundId] ?? null;
  const species = reg.species[ch.speciesId] ?? null;
  const row = { ...cls?.table?.[level], ...subclass?.table?.[level] };

  // ----- Collect effect sources -----
  // step: the wizard step whose choices a source belongs to; granted feats/options inherit it.
  const sources = [];
  if (cls) {
    sources.push({ kind: "class-core", id: cls.id, name: cls.name, scope: "", step: "class", effects: classCoreEffects(cls) });
    for (const f of cls.features) if (f.level <= level) sources.push({ kind: "class", ...f, scope: "", step: "class" });
  }
  if (subclass) {
    for (const f of subclass.features) if (f.level <= level) sources.push({ kind: "subclass", ...f, scope: "", step: "class" });
  }
  if (bg) sources.push({ kind: "background-core", id: bg.id, name: bg.name, scope: "", step: "origin", effects: backgroundCoreEffects(bg) });
  if (species) {
    // Trait `level` is a character-level gate (e.g. Dragonborn Draconic Flight at 5th).
    for (const t of species.traits) if ((t.level ?? 1) <= level) sources.push({ kind: "species", ...t, scope: "", step: "origin" });
  }
  // Feats the DM granted outside the normal feat slots (picked on the Custom page).
  for (const id of ch.boons ?? []) {
    const feat = reg.feats[id];
    if (feat) sources.push({ kind: "feat", id, name: feat.name, text: feat.text, effects: feat.effects, scope: `boon/${id}`, step: "custom" });
  }

  // Choice categories whose picks are registry entries that act like features (with their own effects).
  const pickTables = { invocation: reg.invocations ?? {}, metamagic: reg.metamagic ?? {}, maneuver: reg.maneuvers ?? {} };
  const pickLabel = { invocation: "Invocation", metamagic: "Metamagic", maneuver: "Maneuver" };

  // Counts may come from the class table (e.g. Weapon Mastery), so resolve them before abilities.
  const countOf = (e) => {
    if (typeof e.count === "number") return e.count;
    if (e.count === "level") return level;
    if (e.count === "prof") return pb;
    if (e.count?.table) return Number(row[e.count.table]) || 0;
    return 1;
  };

  // Walk effects; granted/chosen feats and chosen options are appended as new sources.
  const applied = [];
  const pendingChoices = [];
  const choices = []; // every choose effect, for the wizard UI
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    for (const e of src.effects ?? []) {
      const key = e.key ? scoped(src.scope, e.key) : null;
      const count = e.type === "choose" ? countOf(e) : 0;
      const chosen = e.type === "choose" ? (ch.choices[key] ?? []).slice(0, count) : [];
      applied.push({ e, key, chosen, src });

      let grants = [];
      if (e.type === "feat") grants = [[e.id, e.scope ?? `${src.id}.feat`]];
      if (e.type === "choose") {
        choices.push({ key, effect: e, count, chosen, source: src.name, sourceKind: src.kind, step: src.step });
        if (chosen.length < count) {
          pendingChoices.push({ key, category: e.category, count, chosen: chosen.length, source: src.name, step: src.step });
        }
        if (e.category === "feat") grants = chosen.map((id) => [id, `${key}/${id}`]);
        if (e.category === "option") {
          for (const opt of e.options.filter((o) => chosen.includes(o.id))) {
            sources.push({ kind: "option", id: opt.id, name: `${src.name}: ${opt.name}`, text: opt.text, effects: opt.effects, scope: `${key}/${opt.id}`, step: src.step });
          }
        }
        if (pickTables[e.category]) {
          chosen.forEach((id, n) => {
            const pick = pickTables[e.category][id];
            if (pick) sources.push({ kind: "option", id, name: `${pickLabel[e.category]}: ${pick.name}`, text: pick.text, effects: pick.effects, scope: `${key}/${id}.${n}`, step: src.step });
          });
        }
      }
      for (const [id, scope] of grants) {
        const feat = reg.feats[id];
        if (feat) sources.push({ kind: "feat", id, name: feat.name, text: feat.text, effects: feat.effects, scope, step: src.step });
      }
    }
  }

  // ----- Equipment state -----
  const inventory = ch.inventory
    .map((entry) => ({ entry, item: reg.items[entry.itemId] }))
    .filter((x) => x.item);
  const armor = inventory.find((x) => x.entry.equipped && x.item.kind === "armor")?.item ?? null;
  const shield = inventory.find((x) => x.entry.equipped && x.item.kind === "shield")?.item ?? null;
  const active = (e) => !(e.noArmor && armor) && !(e.noShield && shield)
    && !(e.noHeavyArmor && armor?.armorType === "heavy") && !(e.requiresArmor && !armor);
  const effectsOf = (type) => applied.filter((a) => a.e.type === type && active(a.e));

  // ----- Ability scores -----
  const scores = {};
  for (const id of ABILITY_IDS) scores[id] = R.applyIncrease(ch.baseScores[id] ?? 10, ch.bgBoosts[id] ?? 0);
  for (const { e, chosen } of applied) {
    if (e.type === "ability") for (const id of e.ids) scores[id] = R.applyIncrease(scores[id], e.value, e.max);
    if (e.type === "choose" && e.category === "ability") {
      for (const id of chosen) scores[id] = R.applyIncrease(scores[id], e.value ?? 1, e.max);
    }
  }
  const mods = Object.fromEntries(ABILITY_IDS.map((id) => [id, R.abilityMod(scores[id])]));

  const resolve = (v) => {
    if (typeof v === "number") return v;
    if (v === "prof") return pb;
    if (v === "level") return level;
    if (typeof v === "string" && v.startsWith("abilityMod:")) return mods[v.slice(11)] ?? 0;
    if (v?.table) return Number(row[v.table]) || 0;
    if (v?.ability) return Math.max(v.min ?? -Infinity, mods[v.ability]);
    if (v?.times) return v.times * resolve(v.value) + resolve(v.add ?? 0) + (v.plus ?? 0);
    return 0;
  };
  const dieOf = (v) => {
    if (v?.table) return row[v.table];
    if (v?.byLevel) return Object.entries(v.byLevel).filter(([lvl]) => Number(lvl) <= level).at(-1)?.[1] ?? null;
    return v;
  };
  const bonus = (target) => effectsOf("bonus").filter((a) => a.e.target === target).reduce((n, a) => n + resolve(a.e.value), 0);

  // ----- Proficiencies -----
  const prof = { save: new Set(), skill: new Set(), armor: new Set(), weapon: new Set(), tool: new Set(), language: new Set() };
  const expertise = new Set();
  const selections = {}; // other chosen things by category: mastery, metamagic, invocation, spell
  const skillIds = new Set(reg.skills.map((s) => s.id));
  // profSources[category][id] = keys of the choices (or "fixed") that grant it, to spot duplicates.
  const profSources = { skill: {}, tool: {}, language: {} };
  const grant = (category, id, by) => {
    prof[category].add(id);
    if (profSources[category]) (profSources[category][id] ??= []).push(by);
  };
  ch.languages.forEach((id) => grant("language", id, "languages"));
  for (const { e, key, chosen } of applied) {
    if (e.type === "prof") (e.ids === "all" ? [...skillIds] : e.ids).forEach((id) => grant(e.category, id, "fixed"));
    if (e.type !== "choose") continue;
    if (prof[e.category]) chosen.forEach((id) => grant(e.category, id, key));
    else if (e.category === "expertise") chosen.forEach((id) => expertise.add(id));
    else if (e.category === "skillOrTool") chosen.forEach((id) => grant(skillIds.has(id) ? "skill" : "tool", id, key));
    else if (e.category === "ability") { if (e.saveProf) chosen.forEach((id) => prof.save.add(id)); }
    else if (!["feat", "option", "skillOrExpertise"].includes(e.category)) (selections[e.category] ??= []).push(...chosen);
  }
  // Keen Mind / Observant: Expertise if already proficient, otherwise proficiency (after all other profs).
  for (const { e, chosen } of applied) {
    if (e.type === "choose" && e.category === "skillOrExpertise") {
      chosen.forEach((id) => (prof.skill.has(id) ? expertise.add(id) : prof.skill.add(id)));
    }
  }
  const halfProf = applied.some((a) => a.e.type === "halfProfSkills");

  const abilities = Object.fromEntries(ABILITY_IDS.map((id) => {
    const saveProf = prof.save.has(id);
    return [id, { score: scores[id], mod: mods[id], saveProf, save: R.checkBonus(mods[id], saveProf ? 1 : 0, pb) + bonus("save") }];
  }));

  const skills = Object.fromEntries(reg.skills.map((s) => {
    const level = expertise.has(s.id) ? 2 : prof.skill.has(s.id) ? 1 : 0;
    const extra = (level === 0 && halfProf ? Math.floor(pb / 2) : 0) + bonus(`skill:${s.id}`) + bonus(`check:${s.ability}`);
    return [s.id, { name: s.name, ability: s.ability, prof: level >= 1, expertise: level === 2, mod: R.checkBonus(mods[s.ability], level, pb) + extra }];
  }));

  // ----- Combat -----
  const shieldTrained = prof.armor.has("shield");
  // Medium Armor Master raises the Medium armor DEX cap (only matters with DEX 16+).
  const mediumCap = Math.max(0, ...effectsOf("mediumArmorDexCap").map((a) => a.e.value));
  const wornArmor = armor?.armorType === "medium" && mediumCap > armor.dexCap ? { ...armor, dexCap: mediumCap } : armor;
  const ac = R.armorClass({
    mods, armor: wornArmor, shield, shieldTrained,
    formulas: effectsOf("acFormula").map((a) => a.e),
    bonus: bonus("ac"),
  });
  let speed = (species?.speed ?? 30) + bonus("speed");
  if (armor?.strReq && scores.str < armor.strReq) speed -= 10;

  const hpMax = cls ? R.maxHitPoints({ hitDie: cls.hitDie, level, conMod: mods.con, bonusPerLevel: bonus("hpPerLevel") }) + bonus("hp") : 0;

  const bestAbility = (ids) => ids.reduce((best, id) => (mods[id] > mods[best] ? id : best), ids[0]);
  const damageText = (die, mod) => (mod ? `${die}${R.formatMod(mod)}` : die);

  // Unarmed Strike: base 1 + STR, or the best die option from effects (Martial Arts, Tavern Brawler...).
  const strikeOptions = [{ die: null, abilities: ["str"] }, ...effectsOf("unarmedStrike").map((a) => ({ die: dieOf(a.e.die), abilities: a.e.abilities }))];
  const strikeValue = (o) => (o.die ? R.dieAverage(o.die) : 1) + mods[bestAbility(o.abilities)];
  const strike = strikeOptions.reduce((best, o) => (strikeValue(o) > strikeValue(best) ? o : best));
  const strikeAbility = bestAbility(strike.abilities);
  const attacks = [{
    name: "Unarmed Strike",
    attack: mods[strikeAbility] + pb,
    damage: strike.die ? damageText(strike.die, mods[strikeAbility]) : String(Math.max(0, 1 + mods[strikeAbility])),
    damageType: "bludgeoning",
    notes: effectsOf("unarmedStrike").flatMap((a) => a.e.notes ?? []),
  }];

  const weaponProfs = [...prof.weapon];
  const seenWeapons = new Set();
  for (const { item: w } of inventory) {
    if (w.kind !== "weapon" || seenWeapons.has(w.id)) continue;
    seenWeapons.add(w.id);
    let abilityIds = R.weaponAbilities(w);
    let die = w.damage;
    for (const { e } of effectsOf("weaponAbility")) {
      if (!R.weaponMatches(w, e.match)) continue;
      abilityIds = [...new Set([...abilityIds, ...e.abilities])];
      const d = dieOf(e.die);
      if (d && R.dieAverage(d) > R.dieAverage(die)) die = d;
    }
    const ability = bestAbility(abilityIds);
    const proficient = R.isWeaponProficient(w, weaponProfs);
    const attackBonus = effectsOf("weaponBonus").filter((a) => R.weaponMatches(w, a.e.match)).reduce((n, a) => n + (a.e.attack ?? 0), 0);
    const notes = (w.properties ?? []).map((p) => {
      if (p === "thrown" && w.range) return `thrown (${w.range})`;
      if (p === "versatile" && w.versatile) return `versatile (${w.versatile})`;
      return p;
    });
    if (w.type === "ranged" && w.range) notes.unshift(`range ${w.range}`);
    attacks.push({
      name: w.name,
      attack: mods[ability] + (proficient ? pb : 0) + attackBonus,
      damage: damageText(die, mods[ability]),
      damageType: w.damageType,
      notes,
      proficient,
      mastery: w.mastery && selections.mastery?.includes(w.id) ? w.mastery : null,
    });
  }

  // Attacks granted by features: attack rolls (Psychic Blade) or saves (Breath Weapon); always proficient.
  for (const { e } of effectsOf("attack")) {
    const die = dieOf(e.die);
    if (e.save) {
      attacks.push({
        name: e.name, dc: R.spellSaveDC(pb, mods[e.save.dcAbility]), save: e.save.ability, damage: die,
        damageType: e.damageType, notes: e.notes ?? [], proficient: true, mastery: null,
      });
      continue;
    }
    const ability = bestAbility(e.abilities);
    attacks.push({
      name: e.name, attack: mods[ability] + pb, damage: damageText(die, mods[ability]),
      damageType: e.damageType, notes: e.notes ?? [], proficient: true, mastery: e.mastery ?? null,
    });
  }

  // ----- Features & resources -----
  const features = sources
    .filter((s) => ["class", "subclass", "option", "species", "feat"].includes(s.kind))
    .map((s) => ({ kind: s.kind, id: s.id, name: s.name, level: s.level ?? null, text: s.text ?? "", step: s.step }));

  const rechargeOverride = Object.fromEntries(effectsOf("resourceRecharge").map((a) => [a.e.id, a.e.recharge]));
  const resources = effectsOf("resource")
    .map((a) => ({
      id: a.e.id, name: a.e.name, max: resolve(a.e.max), die: a.e.die ? dieOf(a.e.die) : null, tableId: a.e.max?.table ?? null,
      recharge: rechargeOverride[a.e.id] ?? a.e.recharge, note: rechargeOverride[a.e.id] ? "" : a.e.note ?? "",
    }))
    .filter((r) => r.max > 0);

  // Class/subclass save DCs (Focus, Cunning Strike, Maneuvers...): 8 + PB + ability (best of a list).
  const classDCs = [cls?.saveDC, subclass?.saveDC].filter(Boolean).map((dc) => {
    const ability = bestAbility([].concat(dc.ability));
    return { name: dc.name, ability, value: R.spellSaveDC(pb, mods[ability]) };
  });

  // Darkvision etc.: best fixed range, plus "+60 if you already have it" bonuses.
  const senses = {};
  for (const { e } of effectsOf("sense")) {
    const s = (senses[e.id] ??= { base: 0, stack: 0 });
    if (e.stack) s.stack += e.range;
    else s.base = Math.max(s.base, e.range);
  }
  const senseRanges = Object.fromEntries(Object.entries(senses).map(([id, s]) => [id, s.base ? s.base + s.stack : s.stack]));

  // ----- Spellcasting -----
  let spellcasting = null;
  const sc = cls?.spellcasting ?? subclass?.spellcasting;
  if (sc) {
    const mod = mods[sc.ability];
    const slotCounts = R.spellSlots(sc.type, level);
    spellcasting = {
      ability: sc.ability,
      type: sc.type,
      list: sc.list ?? cls.id, // spell list to prepare from (EK / Arcane Trickster use the Wizard list)
      maxLevel: slotCounts.reduce((max, n, i) => (n > 0 ? i + 1 : max), 0),
      mod,
      dc: R.spellSaveDC(pb, mod),
      attack: R.spellAttackBonus(pb, mod),
      slots: slotCounts.map((total, i) => ({ level: i + 1, total, expended: ch.play.slotsExpended[i] ?? 0 })),
      cantripsKnown: (sc.cantrips?.[level - 1] ?? 0) + bonus("cantrips"),
      preparedCount: sc.prepared?.[level - 1] ?? 0,
    };
    // Wizard: spellbook (picked spells + free spells from features like Savant); prepare from it.
    if (sc.spellbook) {
      spellcasting.spellbookSize = sc.spellbook.start + sc.spellbook.perLevel * (level - 1);
      spellcasting.spellbook = [...new Set([...(ch.spells.spellbook ?? []), ...(selections.spellbook ?? [])])];
      spellcasting.spellbookSpells = spellcasting.spellbook
        .map((id) => reg.spells[id])
        .filter(Boolean)
        .map((s) => ({ id: s.id, name: s.name, level: s.level, ritual: !!s.ritual }))
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    }
  }
  // Player-picked spells, then spells granted by features (always prepared) or feature choices.
  const granted = new Set();
  const alwaysPrepared = new Set();
  for (const { e } of effectsOf("spell")) {
    const ids = [...(e.ids ?? []), ...Object.entries(e.byLevel ?? {}).filter(([lvl]) => Number(lvl) <= level).flatMap(([, list]) => list)];
    for (const id of ids) {
      granted.add(id);
      if (e.alwaysPrepared) alwaysPrepared.add(id);
    }
  }
  // Spell picks that make the spell always prepared (Spell Mastery, Signature Spells).
  for (const { e, chosen } of applied) {
    if (e.type === "choose" && e.category === "spell" && e.alwaysPrepared) chosen.forEach((id) => alwaysPrepared.add(id));
  }
  const spellIds = [...new Set([...ch.spells.cantrips, ...ch.spells.prepared, ...granted, ...(selections.spell ?? [])])];
  const spellList = spellIds
    .map((id) => reg.spells[id])
    .filter(Boolean)
    .map((s) => ({
      id: s.id, level: s.level, name: s.name, castingTime: s.castingTime, range: s.range,
      concentration: !!s.concentration, ritual: !!s.ritual, material: !!s.components?.m, notes: s.notes ?? "",
      alwaysPrepared: alwaysPrepared.has(s.id),
    }));

  // Damaging cantrips join the attack table. Without a Spellcasting feature (e.g. Magic Initiate),
  // use the spellcasting ability picked for the feat/trait, else the best mental ability.
  const castMod = sc ? mods[sc.ability] : mods[selections.spellAbility?.[0] ?? bestAbility(["int", "wis", "cha"])];
  const tier = 1 + (level >= 5) + (level >= 11) + (level >= 17);
  for (const id of spellIds) {
    const s = reg.spells[id];
    if (!s?.damage || s.level !== 0) continue;
    const d = s.damage;
    const damage = d.beams ? `${tier} beam${tier > 1 ? "s" : ""} × 1${d.die}` : `${tier}${d.die}`;
    attacks.push({
      name: s.name, kind: "cantrip", damage, damageType: d.type, proficient: true, mastery: null,
      ...(d.save ? { dc: R.spellSaveDC(pb, castMod), save: d.save } : { attack: R.spellAttackBonus(pb, castMod) }),
      notes: [d.attack ? `${d.attack} spell attack` : "", s.range, d.note].filter(Boolean),
    });
  }

  // ----- Other -----
  const nameOf = (table, id) => table[id]?.name ?? id;
  const attunementSlots = Math.max(3, ...effectsOf("attunementSlots").map((a) => a.e.value));
  const sizeOptions = species ? [].concat(species.size) : [];

  return {
    name: ch.details.name,
    className: cls?.name ?? "",
    subclassName: subclass?.name ?? "",
    backgroundName: bg?.name ?? "",
    speciesName: species?.name ?? "",
    level,
    xp: ch.xp,
    profBonus: pb,
    abilities,
    skills,
    ac,
    shield: !!shield,
    hp: { max: hpMax, current: ch.play.hpCurrent ?? hpMax, temp: ch.play.hpTemp },
    hitDice: { die: cls ? `d${cls.hitDie}` : "", max: cls ? level : 0, spent: ch.play.hitDiceSpent },
    deathSaves: { ...ch.play.deathSaves },
    initiative: mods.dex + bonus("initiative"),
    speed,
    size: ch.size ?? (sizeOptions.length === 1 ? sizeOptions[0] : ""),
    passivePerception: R.passiveScore(skills.perception.mod, bonus("passive.perception")),
    heroicInspiration: ch.play.heroicInspiration,
    attacks,
    features,
    resources,
    classDCs,
    senses: senseRanges,
    resistances: [...new Set([...effectsOf("resistance").flatMap((a) => a.e.ids), ...(selections.resistance ?? [])])],
    classTable: cls?.tableColumns?.map((c) => ({ ...c, value: row[c.id] })) ?? [],
    training: {
      armor: [...prof.armor],
      weapons: weaponProfs,
      tools: [...prof.tool].map((id) => nameOf(reg.items, id)),
      toolIds: [...prof.tool],
      masteries: (selections.mastery ?? []).map((id) => nameOf(reg.items, id)),
    },
    selections,
    spellcasting,
    spellList,
    languages: [...prof.language].map((id) => nameOf(reg.languages, id)),
    languageIds: [...prof.language],
    alignment: ch.alignment,
    details: { ...ch.details },
    equipment: inventory.map(({ entry, item }) => ({ name: item.name, qty: entry.qty, equipped: !!entry.equipped, weight: item.weight ?? null })),
    attunementSlots,
    attunement: inventory.filter((x) => x.entry.attuned).slice(0, attunementSlots).map((x) => x.item.name),
    coins: { ...ch.coins },
    choices,
    pendingChoices,
    profSources,
  };
}
