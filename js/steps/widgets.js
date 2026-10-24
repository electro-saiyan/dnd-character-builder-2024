// Small DOM helpers and shared pickers for the wizard steps.
import { optionsFor, describeChoice } from "../choices.js";

// h("div", { class: "x", onclick: fn }, child, "text", [more])
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k in el && typeof v !== "string") el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

export const panel = (title, ...children) => h("section", { class: "panel" }, title && h("h3", {}, title), ...children);

export const field = (label, control, hint) =>
  h("label", { class: "field" }, h("span", {}, label), control, hint && h("small", { class: "muted" }, hint));

export function select(options, value, onChange, { placeholder } = {}) {
  return h(
    "select",
    { onchange: (e) => onChange(e.target.value || null) },
    placeholder !== undefined && h("option", { value: "", selected: value == null }, placeholder),
    options.map((o) => h("option", { value: o.id, selected: o.id === value, disabled: o.disabled }, o.name)),
  );
}

// items: [{ id, name, meta?, text? }]
export function cardGrid(items, selectedId, onPick, { cls = "cards" } = {}) {
  return h(
    "div",
    { class: cls },
    items.map((it) =>
      h(
        "button",
        { type: "button", class: "card", "aria-pressed": String(it.id === selectedId), onclick: () => onPick(it.id), title: it.reason || null, disabled: it.disabled },
        h("strong", {}, it.name),
        it.meta && h("span", { class: "meta" }, it.meta),
        it.text && h("div", { class: "text" }, it.text),
      ),
    ),
  );
}

export function segmented(items, value, onPick) {
  return h(
    "div",
    { class: "segmented", role: "group" },
    items.map(([id, label]) => h("button", { type: "button", "aria-pressed": String(id === value), onclick: () => onPick(id) }, label)),
  );
}

// Toggle an id in a pick list limited to `count` (count 1 = replace).
function toggle(chosen, id, count) {
  if (chosen.includes(id)) return chosen.filter((x) => x !== id);
  if (count === 1) return [id];
  return chosen.length < count ? [...chosen, id] : chosen;
}

// Generic picker for a derive() choice, or a pseudo-choice { effect, count, chosen }.
// options: optional precomputed [{ id, name, detail?, text?, disabled?, reason? }].
export function choicePicker(choice, ctx, onChange, { title, options } = {}) {
  const opts = options ?? optionsFor(choice, ctx);
  const { count, chosen, effect } = choice;
  const full = chosen.length >= count;
  const head = h(
    "div",
    { class: "picker-head" },
    h("h4", {}, title ?? describeChoice(choice)),
    h("span", { class: `count${full ? " full" : ""}` }, `${chosen.length} / ${count}`),
  );

  // "+2 to one or +1 to two": the same option may be picked more than once.
  if (effect.allowDuplicates) {
    return h(
      "div",
      { class: "picker" },
      head,
      opts.map((o) => {
        const n = chosen.filter((x) => x === o.id).length;
        const remove = () => {
          const i = chosen.lastIndexOf(o.id);
          onChange(chosen.filter((_, j) => j !== i));
        };
        return h(
          "span",
          { class: "stepper" },
          h("button", { type: "button", disabled: n === 0, onclick: remove, "aria-label": `Less ${o.name}` }, "−"),
          `${o.name} +${n}`,
          h("button", { type: "button", disabled: full, onclick: () => onChange([...chosen, o.id]), "aria-label": `More ${o.name}` }, "+"),
        );
      }),
    );
  }

  // Options with descriptions (Divine Order, feats, invocations…) render as cards.
  if (opts.some((o) => o.text)) {
    const items = opts.map((o) => ({
      ...o,
      meta: o.disabled ? o.reason : o.detail,
      disabled: (o.disabled && !chosen.includes(o.id)) || (!chosen.includes(o.id) && full && count > 1),
    }));
    const grid = h(
      "div",
      { class: "option-cards" },
      items.map((it) =>
        h(
          "button",
          { type: "button", class: "card", "aria-pressed": String(chosen.includes(it.id)), disabled: it.disabled, onclick: () => onChange(toggle(chosen, it.id, count)), dataset: { name: it.name.toLowerCase() } },
          h("strong", {}, it.name),
          it.meta && h("span", { class: "meta" }, it.meta),
          it.text && h("div", { class: "text" }, it.text),
        ),
      ),
    );
    return h("div", { class: "picker" }, head, opts.length > 12 && filterBox(grid), grid);
  }

  const chip = (o) => {
    const on = chosen.includes(o.id);
    return h(
      "button",
      {
        type: "button", class: "chip", "aria-pressed": String(on), title: o.reason || null,
        disabled: (o.disabled && !on) || (!on && full && count > 1), dataset: { name: o.name.toLowerCase() },
        onclick: () => onChange(toggle(chosen, o.id, count)),
      },
      o.name,
      (o.detail || (o.disabled && o.reason)) && h("small", {}, o.disabled && !on ? o.reason : o.detail),
    );
  };

  // Options tagged with a group (e.g. spell level) get a sub-heading per group, in first-seen order.
  const groups = new Map();
  for (const o of opts) groups.set(o.group ?? "", [...(groups.get(o.group ?? "") ?? []), o]);
  const chips = groups.size > 1
    ? h(
      "div",
      { class: "chip-groups" },
      [...groups].map(([name, list]) => h("div", { class: "chip-group" }, h("h5", {}, name), h("div", { class: "chips" }, list.map(chip)))),
    )
    : h("div", { class: "chips" }, opts.map(chip));
  return h("div", { class: "picker" }, head, opts.length > 24 && filterBox(chips), chips);
}

// Text filter that hides options in `list` whose data-name doesn't match (DOM only, no state).
function filterBox(list) {
  return h("input", {
    type: "text", class: "picker-filter", placeholder: "Filter…", "aria-label": "Filter options",
    oninput: (e) => {
      const q = e.target.value.trim().toLowerCase();
      for (const el of list.querySelectorAll("[data-name]")) el.hidden = q && !el.dataset.name.includes(q);
      for (const g of list.querySelectorAll(".chip-group")) g.hidden = !g.querySelector("[data-name]:not([hidden])");
    },
  });
}

// Renders all choices that pass `filter`, wiring changes into ch.choices.
export function choiceList(ctx, filter) {
  const list = ctx.sheet.choices.filter(filter);
  return list.map((c) =>
    choicePicker(c, ctx, (ids) => ctx.update((ch) => {
      ch.choices[c.key] = ids;
    })),
  );
}

// Lists the items of a starting-equipment option as text.
export function equipmentText(entries, reg, choices) {
  return entries
    .map((e) => {
      if (e.gp) return `${e.gp} GP`;
      const id = e.item ?? choices[e.choice]?.[0];
      const name = id ? reg.items[id]?.name ?? id : "item of your choice";
      return (e.qty ?? 1) > 1 ? `${e.qty} × ${name}` : name;
    })
    .join(", ");
}

export const fmt = (n) => (n >= 0 ? `+${n}` : `${n}`);
