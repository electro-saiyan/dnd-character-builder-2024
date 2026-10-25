// Custom page: campaign content invented by the DM (feats, spells, items, backgrounds, species).
// Entries live in ch.custom and are merged into the registry, so they show up in the normal pickers.
// Each entry keeps the raw form values in `form`, so it can be edited again.
import { ABILITY_IDS } from "./data/skills.js";
import { ABILITY_NAMES, isSpellChoice } from "./choices.js";
import { exportCustom, importCustom } from "./storage.js";
import { h, panel, field, segmented, choiceList } from "./steps/widgets.js";

const SCHOOLS = ["abjuration", "conjuration", "divination", "enchantment", "evocation", "illusion", "necromancy", "transmutation"];
const SPELL_LISTS = ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"];
const DAMAGE_TYPES = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];
const WEAPON_PROPERTIES = ["ammunition", "finesse", "heavy", "light", "loading", "reach", "thrown", "two-handed", "versatile"];
const MASTERIES = ["cleave", "graze", "nick", "push", "sap", "slow", "topple", "vex"];
const FEAT_CATEGORIES = [["origin", "Origin"], ["general", "General"], ["fighting-style", "Fighting Style"], ["epic", "Epic Boon"]];
const ITEM_KINDS = [["gear", "Gear / magic item"], ["weapon", "Weapon"], ["armor", "Armor"], ["shield", "Shield"], ["tool", "Tool"]];

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);
const named = (ids) => ids.map((id) => ({ id, name: capitalize(id) }));
const slug = (name) => name.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function newId(name, taken) {
  const base = `custom-${slug(name) || "entry"}`;
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
}

// ----- Form controls: each returns an element; read values back with value()/checked() -----

const text = (value = "", props = {}) => h("input", { type: "text", value: value ?? "", ...props });
const number = (value, props = {}) => h("input", { type: "number", value: value == null ? "" : String(value), style: "width:6em", ...props });
function area(value = "") {
  const el = h("textarea", { rows: 3 });
  el.value = value ?? "";
  return el;
}
const choose = (options, value) =>
  h("select", {}, options.map(([id, name]) => h("option", { value: id, selected: id === value }, name)));
const checkbox = (on, label) => h("label", { class: "check" }, h("input", { type: "checkbox", checked: !!on }), label);
const isChecked = (label) => label.querySelector("input").checked;
const checks = (options, selected = []) =>
  h("div", { class: "checks" }, options.map((o) => h("label", { class: "check" }, h("input", { type: "checkbox", value: o.id, checked: selected.includes(o.id) }), o.name)));
const checked = (group) => [...group.querySelectorAll("input:checked")].map((i) => i.value);
const num = (el) => (el.value === "" ? null : Number(el.value));

// Repeating rows (traits, equipment): rowFn(values) -> { el, read }.
function rows(initial, rowFn, addLabel) {
  const list = h("div", { class: "edit-rows" });
  const items = [];
  const add = (values) => {
    const row = rowFn(values);
    const wrap = h("div", { class: "edit-row" }, row.el, h("button", { type: "button", class: "link", onclick: () => {
      items.splice(items.indexOf(item), 1);
      wrap.remove();
    } }, "Remove"));
    const item = { read: row.read };
    items.push(item);
    list.append(wrap);
  };
  initial.forEach(add);
  return {
    el: h("div", {}, list, h("button", { type: "button", onclick: () => add({}) }, addLabel)),
    read: () => items.map((i) => i.read()),
  };
}

// ----- Kinds: form(values, ctx) -> { el, read() -> form values }, build(form) -> registry entry -----

const KINDS = [
  {
    id: "feats", label: "Feats", one: "feat",
    help: "Custom feats appear in feat pickers for their category. You can also grant one to this character as a DM boon.",
    meta: (f) => [FEAT_CATEGORIES.find(([id]) => id === f.category)?.[1], f.prereq?.level && `level ${f.prereq.level}+`].filter(Boolean).join(" · "),
    form(v) {
      const el = {
        name: text(v.name), category: choose(FEAT_CATEGORIES, v.category ?? "general"), level: number(v.level, { min: 1, max: 20 }),
        repeatable: checkbox(v.repeatable, "Can be taken more than once"), text: area(v.text),
        increase: checks(ABILITY_IDS.map((id) => ({ id, name: ABILITY_NAMES[id] })), v.increase ?? []),
        effects: area(v.effects ? JSON.stringify(v.effects, null, 2) : ""),
      };
      return {
        el: [
          h("div", { class: "row" }, field("Name", el.name), field("Category", el.category), field("Minimum level", el.level, "blank = none")),
          field("Description", el.text),
          field("+1 to an ability score (choose from)", el.increase, "Leave all unticked for no increase."),
          el.repeatable,
          h("details", { class: "advanced" }, h("summary", {}, "Advanced: rule effects (JSON)"),
            h("p", { class: "small muted" }, "Optional list of effects in the same format as the built-in data, e.g. ",
              h("code", {}, '[{ "type": "bonus", "target": "ac", "value": 1 }]'), ". See README → How the data works."),
            el.effects),
        ],
        read: () => ({
          name: el.name.value.trim(), category: el.category.value, level: num(el.level), repeatable: isChecked(el.repeatable),
          text: el.text.value.trim(), increase: checked(el.increase), effects: el.effects.value.trim() ? JSON.parse(el.effects.value) : [],
        }),
      };
    },
    check: (f) => (Array.isArray(f.effects) ? "" : "Effects must be a JSON list ([ … ])."),
    build(f) {
      const max = f.category === "epic" ? 30 : 20;
      const increase = f.increase.length === 1
        ? [{ type: "ability", ids: f.increase, value: 1, max }]
        : f.increase.length ? [{ type: "choose", category: "ability", from: f.increase, count: 1, value: 1, max, key: "asi" }] : [];
      return {
        name: f.name, source: "Custom", category: f.category, text: f.text, effects: [...increase, ...f.effects],
        ...(f.level ? { prereq: { level: f.level } } : {}), ...(f.repeatable ? { repeatable: true } : {}),
      };
    },
  },
  {
    id: "spells", label: "Spells", one: "spell",
    help: "Custom spells join the spell lists you tick, so casters of those classes can pick them.",
    meta: (s) => `${s.level === 0 ? "Cantrip" : `Level ${s.level}`} · ${capitalize(s.school)} · ${s.classes.map(capitalize).join(", ") || "no class list"}`,
    form(v) {
      const c = v.components ?? { v: true, s: true };
      const el = {
        name: text(v.name), level: choose([...Array(10).keys()].map((n) => [String(n), n ? `Level ${n}` : "Cantrip"]), String(v.level ?? 1)),
        school: choose(SCHOOLS.map((s) => [s, capitalize(s)]), v.school ?? "evocation"),
        classes: checks(named(SPELL_LISTS), v.classes ?? []),
        castingTime: text(v.castingTime ?? "Action", { list: "custom-casting-times" }), range: text(v.range ?? "60 feet"),
        duration: text(v.duration ?? "Instantaneous"),
        compV: checkbox(c.v, "V"), compS: checkbox(c.s, "S"), compM: checkbox(c.m, "M"),
        concentration: checkbox(v.concentration, "Concentration"), ritual: checkbox(v.ritual, "Ritual"),
        text: area(v.text), notes: text(v.notes, { maxlength: 40 }),
        die: choose([["", "—"], ...["d4", "d6", "d8", "d10", "d12"].map((d) => [d, `1${d}`])], v.damage?.die ?? ""),
        damageType: choose(DAMAGE_TYPES.map((t) => [t, capitalize(t)]), v.damage?.type ?? "fire"),
        hit: choose([["ranged", "Ranged spell attack"], ["melee", "Melee spell attack"], ...ABILITY_IDS.map((a) => [`save:${a}`, `${ABILITY_NAMES[a]} save`])],
          v.damage ? (v.damage.save ? `save:${v.damage.save}` : v.damage.attack) : "ranged"),
      };
      return {
        el: [
          h("div", { class: "row" }, field("Name", el.name), field("Level", el.level), field("School", el.school)),
          field("Spell lists", el.classes),
          h("datalist", { id: "custom-casting-times" }, ["Action", "Bonus Action", "Reaction", "1 minute", "10 minutes", "1 hour"].map((t) => h("option", { value: t }))),
          h("div", { class: "row" }, field("Casting time", el.castingTime), field("Range", el.range), field("Duration", el.duration)),
          h("div", { class: "row checks" }, el.compV, el.compS, el.compM, el.concentration, el.ritual),
          field("Description", el.text),
          field("Sheet note", el.notes, "Short text for the spell table on the sheet."),
          h("div", { class: "row" }, field("Cantrip damage", el.die, "Cantrips only; scales at 5/11/17."), field("Type", el.damageType), field("Hits with", el.hit)),
        ],
        read: () => ({
          name: el.name.value.trim(), level: Number(el.level.value), school: el.school.value, classes: checked(el.classes),
          castingTime: el.castingTime.value.trim(), range: el.range.value.trim(), duration: el.duration.value.trim(),
          components: { v: isChecked(el.compV), s: isChecked(el.compS), m: isChecked(el.compM) },
          concentration: isChecked(el.concentration), ritual: isChecked(el.ritual),
          text: el.text.value.trim(), notes: el.notes.value.trim(),
          damage: el.die.value ? { die: el.die.value, type: el.damageType.value, ...(el.hit.value.startsWith("save:") ? { save: el.hit.value.slice(5) } : { attack: el.hit.value }) } : null,
        }),
      };
    },
    build: (f) => ({
      name: f.name, level: f.level, school: f.school, classes: f.classes, castingTime: f.castingTime, trigger: false, range: f.range,
      components: { ...f.components, costly: false, consumed: false }, duration: f.duration, concentration: f.concentration,
      ritual: f.ritual, source: "Custom", damage: f.level === 0 ? f.damage : null, text: f.text, notes: f.notes,
    }),
  },
  {
    id: "items", label: "Items", one: "item",
    help: "Custom items can be added to the inventory in the Equipment step. Weapons and armor work in the attack table and AC.",
    meta: (i) => {
      if (i.kind === "weapon") return `${capitalize(i.category)} ${i.type} weapon · ${i.damage} ${i.damageType}`;
      if (i.kind === "armor") return `${capitalize(i.armorType)} armor · AC ${i.ac}`;
      if (i.kind === "shield") return `Shield · +${i.ac} AC`;
      return ITEM_KINDS.find(([id]) => id === i.kind)?.[1] ?? i.kind;
    },
    form(v) {
      const el = {
        name: text(v.name), kind: choose(ITEM_KINDS, v.kind ?? "gear"), weight: number(v.weight, { min: 0, step: "any" }),
        cost: number(v.cost?.gp, { min: 0, step: "any" }), text: area(v.text),
        category: choose([["simple", "Simple"], ["martial", "Martial"]], v.category), type: choose([["melee", "Melee"], ["ranged", "Ranged"]], v.type),
        damage: text(v.damage ?? "1d8", { style: "width:6em" }), damageType: choose(DAMAGE_TYPES.map((t) => [t, capitalize(t)]), v.damageType ?? "slashing"),
        properties: checks(named(WEAPON_PROPERTIES), v.properties ?? []), mastery: choose([["", "—"], ...MASTERIES.map((m) => [m, capitalize(m)])], v.mastery ?? ""),
        weaponRange: text(v.range, { placeholder: "e.g. 20/60", style: "width:8em" }), versatile: text(v.versatile, { placeholder: "e.g. 1d10", style: "width:6em" }),
        armorType: choose([["light", "Light"], ["medium", "Medium"], ["heavy", "Heavy"]], v.armorType), ac: number(v.ac ?? (v.kind === "shield" ? 2 : 12), { min: 0 }),
        strReq: number(v.strReq || null, { min: 0 }), stealthDis: checkbox(v.stealthDis, "Disadvantage on Stealth"),
        toolType: choose([["other", "Other"], ["artisan", "Artisan's tools"], ["instrument", "Musical instrument"], ["gaming", "Gaming set"]], v.toolType ?? "other"),
      };
      const groups = {
        weapon: h("div", {},
          h("div", { class: "row" }, field("Category", el.category), field("Type", el.type), field("Damage", el.damage), field("Damage type", el.damageType), field("Mastery", el.mastery)),
          field("Properties", el.properties),
          h("div", { class: "row" }, field("Range", el.weaponRange, "Ranged or thrown"), field("Versatile damage", el.versatile))),
        armor: h("div", { class: "row" }, field("Armor type", el.armorType), field("Base AC", el.ac), field("STR required", el.strReq), el.stealthDis),
        tool: h("div", { class: "row" }, field("Tool type", el.toolType)),
      };
      const showGroups = () => {
        const shield = el.kind.value === "shield";
        groups.weapon.hidden = el.kind.value !== "weapon";
        groups.armor.hidden = el.kind.value !== "armor" && !shield;
        for (const x of [el.armorType, el.strReq, el.stealthDis]) x.closest("label").hidden = shield;
        groups.tool.hidden = el.kind.value !== "tool";
      };
      el.kind.addEventListener("change", showGroups);
      showGroups();
      return {
        el: [
          h("div", { class: "row" }, field("Name", el.name), field("Kind", el.kind), field("Weight (lb)", el.weight), field("Cost (GP)", el.cost)),
          groups.weapon, groups.armor, groups.tool,
          field("Description", el.text, "Magic properties, charges, attunement requirements…"),
        ],
        read: () => {
          const f = { name: el.name.value.trim(), kind: el.kind.value, weight: num(el.weight), cost: num(el.cost) == null ? null : { gp: num(el.cost) }, text: el.text.value.trim() };
          if (f.kind === "weapon") {
            Object.assign(f, {
              category: el.category.value, type: el.type.value, damage: el.damage.value.trim() || "1", damageType: el.damageType.value,
              properties: checked(el.properties), mastery: el.mastery.value || null,
            });
            if (el.weaponRange.value.trim()) f.range = el.weaponRange.value.trim();
            if (el.versatile.value.trim()) f.versatile = el.versatile.value.trim();
          }
          if (f.kind === "armor") {
            const armorType = el.armorType.value;
            Object.assign(f, { armorType, ac: num(el.ac) ?? 10, dexCap: { light: null, medium: 2, heavy: 0 }[armorType], strReq: num(el.strReq) ?? 0, stealthDis: isChecked(el.stealthDis) });
          }
          if (f.kind === "shield") Object.assign(f, { ac: num(el.ac) ?? 2, stealthDis: false });
          if (f.kind === "tool") Object.assign(f, { toolType: el.toolType.value, ability: null });
          return f;
        },
      };
    },
    check: (f) => (f.kind === "weapon" && !/^\d*d?\d+$/.test(f.damage) ? "Damage should look like 1d8 or 2d6." : ""),
    build: (f) => ({ ...f, source: "Custom" }),
  },
  {
    id: "backgrounds", label: "Backgrounds", one: "background",
    help: "Custom backgrounds appear in the Origin step: three abilities for the +2/+1 boosts, an origin feat, two skills and a tool.",
    meta: (b, reg) => `${b.abilities.map((a) => a.toUpperCase()).join(" ")} · ${reg.feats[b.feat]?.name ?? b.feat}`,
    form(v, { reg }) {
      const feats = Object.values(reg.feats).filter((f) => f.category === "origin").sort((a, b) => a.name.localeCompare(b.name));
      const tools = Object.values(reg.items).filter((i) => i.kind === "tool").sort((a, b) => a.name.localeCompare(b.name));
      const items = Object.values(reg.items).sort((a, b) => a.name.localeCompare(b.name));
      const el = {
        name: text(v.name), abilities: checks(ABILITY_IDS.map((id) => ({ id, name: ABILITY_NAMES[id] })), v.abilities ?? []),
        feat: choose(feats.map((f) => [f.id, f.name]), v.feat), skills: checks(reg.skills, v.skills ?? []),
        tool: choose([["", "— none —"], ...tools.map((t) => [t.id, t.name])], v.tool ?? ""), gold: number(v.gold ?? 0, { min: 0 }),
        equipment: rows(v.equipment ?? [], (e) => {
          const item = choose(items.map((i) => [i.id, i.name]), e.item);
          const qty = number(e.qty ?? 1, { min: 1, style: "width:4.5em" });
          return { el: h("div", { class: "row" }, field("Item", item), field("Qty", qty)), read: () => ({ item: item.value, qty: Math.max(1, num(qty) ?? 1) }) };
        }, "+ Item"),
      };
      return {
        el: [
          field("Name", el.name),
          field("Ability scores (choose 3)", el.abilities),
          h("div", { class: "row" }, field("Origin feat", el.feat), field("Tool proficiency", el.tool)),
          field("Skill proficiencies (choose 2)", el.skills),
          field("Equipment option A", el.equipment.el, "Option B is always 50 GP."),
          field("Option A gold", el.gold),
        ],
        read: () => ({
          name: el.name.value.trim(), abilities: checked(el.abilities), feat: el.feat.value, skills: checked(el.skills),
          tool: el.tool.value || null, gold: num(el.gold) ?? 0, equipment: el.equipment.read(),
        }),
      };
    },
    check: (f) => {
      if (f.abilities.length !== 3) return "Choose exactly 3 ability scores.";
      if (f.skills.length !== 2) return "Choose exactly 2 skills.";
      if (!f.feat) return "Choose an origin feat.";
      return "";
    },
    build: (f) => ({
      name: f.name, source: "Custom", abilities: f.abilities, feat: f.feat, skills: f.skills, ...(f.tool ? { tool: f.tool } : {}),
      equipment: { A: [...f.equipment, ...(f.gold ? [{ gp: f.gold }] : [])], B: [{ gp: 50 }] },
    }),
  },
  {
    id: "species", label: "Species", one: "species",
    help: "Custom species appear in the Origin step with their size, speed and traits.",
    meta: (s) => `${[].concat(s.size).join("/")} · ${s.speed} ft · ${s.traits.length} trait${s.traits.length === 1 ? "" : "s"}`,
    form(v) {
      const el = {
        name: text(v.name), sizes: checks(named(["Small", "Medium", "Large"]).map((o) => ({ ...o, id: o.name })), v.sizes ?? ["Medium"]),
        speed: number(v.speed ?? 30, { min: 0, step: 5 }), darkvision: choose([["0", "None"], ["60", "60 ft"], ["120", "120 ft"]], String(v.darkvision ?? 0)),
        resistances: checks(named(DAMAGE_TYPES), v.resistances ?? []),
        traits: rows(v.traits ?? [], (t) => {
          const name = text(t.name);
          const desc = area(t.text);
          return { el: h("div", { class: "trait-row" }, field("Trait", name), field("Description", desc)), read: () => ({ name: name.value.trim(), text: desc.value.trim() }) };
        }, "+ Trait"),
      };
      return {
        el: [
          h("div", { class: "row" }, field("Name", el.name), field("Speed (ft)", el.speed), field("Darkvision", el.darkvision)),
          field("Size", el.sizes),
          field("Damage resistances", el.resistances),
          field("Traits", el.traits.el),
        ],
        read: () => ({
          name: el.name.value.trim(), sizes: checked(el.sizes), speed: num(el.speed) ?? 30, darkvision: Number(el.darkvision.value),
          resistances: checked(el.resistances), traits: el.traits.read().filter((t) => t.name),
        }),
      };
    },
    check: (f) => (f.sizes.length ? "" : "Choose at least one size."),
    build: (f) => ({
      name: f.name, source: "Custom", type: "Humanoid", size: f.sizes.length === 1 ? f.sizes[0] : f.sizes, speed: f.speed,
      traits: [
        ...(f.darkvision ? [{ id: "darkvision", name: "Darkvision", text: `See in dim light within ${f.darkvision} ft as if bright, and in darkness as dim.`, effects: [{ type: "sense", id: "darkvision", range: f.darkvision }] }] : []),
        ...(f.resistances.length ? [{ id: "resistance", name: "Resistance", text: `Resistance to ${f.resistances.map(capitalize).join(", ")} damage.`, effects: [{ type: "resistance", ids: f.resistances }] }] : []),
        ...f.traits.map((t, i) => ({ id: `trait-${i + 1}`, name: t.name, text: t.text, effects: [] })),
      ],
    }),
  },
];

// UI state that isn't part of the character.
let tab = "feats";
let editing = null; // entry id, or "new"

// Re-render without changing the character.
const refresh = (ctx) => ctx.update(() => {});

function editor(ctx, kind, entry) {
  // Hand-written entries (from JSON) have no `form`; their own fields cover most of it.
  const form = kind.form(entry ? { ...entry, ...entry.form } : {}, ctx);
  // Errors are shown in place: a re-render would rebuild the form and lose what was typed.
  const error = h("span", { class: "errors small", role: "alert" });
  const close = () => {
    editing = null;
    refresh(ctx);
  };
  const save = () => {
    let values;
    try {
      values = form.read();
    } catch (err) {
      error.textContent = `Could not read the form: ${err.message}`;
      return;
    }
    error.textContent = !values.name ? "Give it a name." : kind.check?.(values) ?? "";
    if (error.textContent) return;
    editing = null;
    ctx.update((d) => {
      const list = (d.custom[kind.id] ??= []);
      const id = entry?.id ?? newId(values.name, new Set([...Object.keys(ctx.reg[kind.id]), ...list.map((x) => x.id)]));
      const built = { ...kind.build(values), id, form: values };
      const i = list.findIndex((x) => x.id === id);
      if (i >= 0) list[i] = built;
      else list.push(built);
    });
  };
  return panel(
    entry ? `Edit ${entry.name}` : `New ${kind.one}`,
    form.el,
    h("div", { class: "row form-actions" },
      h("button", { type: "button", class: "primary", onclick: save }, "Save"),
      h("button", { type: "button", onclick: close }, "Cancel"),
      error),
  );
}

function entryList(ctx, kind) {
  const { ch, reg } = ctx;
  const list = ch.custom[kind.id] ?? [];
  const remove = (entry) => {
    if (!confirm(`Delete ${entry.name}? Characters that use it will lose it.`)) return;
    if (editing === entry.id) editing = null;
    ctx.update((d) => {
      d.custom[kind.id] = d.custom[kind.id].filter((x) => x.id !== entry.id);
      if (kind.id === "feats") d.boons = d.boons.filter((id) => id !== entry.id);
    });
  };
  const toggleBoon = (id, on) => ctx.update((d) => {
    d.boons = on ? [...new Set([...d.boons, id])] : d.boons.filter((x) => x !== id);
  });
  return panel(
    `Custom ${kind.label.toLowerCase()}`,
    h("p", { class: "muted small" }, kind.help),
    list.length
      ? h("ul", { class: "feature-list custom-list" }, list.map((entry) => h(
        "li",
        {},
        h("div", { class: "custom-entry-head" },
          h("b", {}, entry.name),
          h("span", { class: "muted small" }, kind.meta(entry, reg)),
          h("span", { class: "custom-entry-actions" },
            kind.id === "feats" && h("label", { class: "check small" }, h("input", {
              type: "checkbox", checked: ch.boons.includes(entry.id), onchange: (e) => toggleBoon(entry.id, e.target.checked),
            }), "Granted to this character"),
            h("button", { type: "button", class: "link", onclick: () => {
              editing = entry.id;
              refresh(ctx);
            } }, "Edit"),
            h("button", { type: "button", class: "link danger", onclick: () => remove(entry) }, "Delete"))),
        entry.text && h("div", { class: "small" }, entry.text),
      )))
      : h("p", { class: "muted" }, `No custom ${kind.label.toLowerCase()} yet.`),
    editing === null && h("button", { type: "button", onclick: () => {
      editing = "new";
      refresh(ctx);
    } }, `+ New ${kind.one}`),
  );
}

function sharePanel(ctx) {
  const total = KINDS.reduce((n, k) => n + (ctx.ch.custom[k.id]?.length ?? 0), 0);
  const onImport = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const incoming = await importCustom(file);
      // Same id = same entry: the imported version replaces it.
      ctx.update((d) => {
        for (const kind of KINDS) {
          const ids = new Set(incoming[kind.id].map((x) => x.id));
          d.custom[kind.id] = [...(d.custom[kind.id] ?? []).filter((x) => !ids.has(x.id)), ...incoming[kind.id]];
        }
      });
    } catch (err) {
      alert(`Could not import: ${err.message}`);
    }
  };
  return panel(
    "Share with your table",
    h("p", { class: "muted small" },
      "Custom content is saved with this character and kept when you start a new one. "
        + "Export it to a file the DM can hand to the other players, or import one you were given (a character file works too)."),
    h("div", { class: "row" },
      h("button", { type: "button", disabled: total === 0, onclick: () => exportCustom(ctx.ch.custom) }, `Export campaign content (${total})`),
      h("label", { class: "button" }, "Import campaign content", h("input", { type: "file", accept: "application/json,.json", hidden: true, onchange: onImport }))),
  );
}

export default {
  id: "custom",
  title: "Custom",
  render(ctx) {
    const kind = KINDS.find((k) => k.id === tab);
    const entry = editing && editing !== "new" ? ctx.ch.custom[kind.id]?.find((x) => x.id === editing) : null;
    const boonChoices = choiceList(ctx, (c) => c.step === "custom" && !isSpellChoice(c));
    return h(
      "div",
      {},
      h("header", {}, h("h2", {}, "Custom Content"), h("p", { class: "muted" }, "Add things your Dungeon Master invented for the campaign. They show up in the regular steps next to the official options.")),
      segmented(KINDS.map((k) => [k.id, `${k.label}${ctx.ch.custom[k.id]?.length ? ` (${ctx.ch.custom[k.id].length})` : ""}`]), tab, (id) => {
        tab = id;
        editing = null;
        refresh(ctx);
      }),
      entryList(ctx, kind),
      editing !== null && editor(ctx, kind, entry),
      boonChoices.length > 0 && panel("Boon choices", boonChoices),
      sharePanel(ctx),
    );
  },
};
