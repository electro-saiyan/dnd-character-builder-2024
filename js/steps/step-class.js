// Step 1: class, level, subclass, class choices, starting equipment, features.
import { applyStartingEquipment } from "../state.js";
import { ABILITY_ABBR, isSpellChoice } from "../choices.js";
import { h, panel, field, select, cardGrid, segmented, choiceList, choicePicker, equipmentText } from "./widgets.js";

function equipmentPanel(ctx, src, optionKey, label) {
  const { ch, reg } = ctx;
  const value = ch.equipmentOption[optionKey];
  const set = (fn) => ctx.update((draft) => {
    fn(draft);
    applyStartingEquipment(draft, reg);
  });
  const extraPicks = (src.equipmentChoices ?? []).filter((x) => x.option === value);
  return panel(
    `${label} Starting Equipment`,
    segmented(Object.keys(src.equipment).map((k) => [k, `Option ${k}`]), value, (k) => set((d) => {
      d.equipmentOption[optionKey] = k;
    })),
    Object.entries(src.equipment).map(([k, entries]) =>
      h("p", { class: k === value ? "" : "muted" }, h("b", {}, `${k}: `), equipmentText(entries, reg, ch.choices))),
    extraPicks.map((x) =>
      choicePicker(
        { effect: { category: "tool", from: x.from }, count: 1, chosen: ch.choices[x.key] ?? [] },
        ctx,
        (ids) => set((d) => {
          d.choices[x.key] = ids;
        }),
        { title: "Item of your choice", options: Object.values(reg.items).filter((i) => i.kind === "tool" && x.from.toolType.includes(i.toolType)) },
      )),
  );
}

export { equipmentPanel };

export default {
  id: "class",
  title: "Class",
  render(ctx) {
    const { ch, reg, sheet } = ctx;
    const cls = reg.classes[ch.classId];
    const classes = Object.values(reg.classes).map((c) => ({
      id: c.id,
      name: c.name,
      meta: `d${c.hitDie} · ${c.primary.map((a) => ABILITY_ABBR[a]).join("/")}${c.spellcasting ? " · caster" : ""}`,
    }));

    const pickClass = (id) => ctx.update((d) => {
      if (d.classId === id) return;
      d.classId = id;
      d.subclassId = null;
      d.equipmentOption.class = null;
      d.spells = { cantrips: [], prepared: [] };
      applyStartingEquipment(d, reg);
    });

    const parts = [h("header", {}, h("h2", {}, "Choose a Class"), h("p", { class: "muted" }, "Your class sets your Hit Points, proficiencies and features."))];
    parts.push(panel("Class", cardGrid(classes, ch.classId, pickClass)));
    if (!cls) return h("div", {}, parts);

    const levels = Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1), name: `Level ${i + 1}` }));
    parts.push(panel(
      "Level & Subclass",
      h(
        "div",
        { class: "row" },
        field("Level", select(levels, String(ch.level), (v) => ctx.update((d) => {
          d.level = Number(v);
        }))),
        ch.level >= cls.subclassLevel
          ? field("Subclass", select(cls.subclasses, ch.subclassId, (v) => ctx.update((d) => {
            d.subclassId = v;
          }), { placeholder: "— choose —" }))
          : h("p", { class: "muted" }, `Subclass at level ${cls.subclassLevel}.`),
      ),
      sheet.classTable.length > 0 && h("p", { class: "small" }, sheet.classTable.map((c) => `${c.name}: ${c.prefix ?? ""}${c.value ?? "–"}${c.unit && c.value ? ` ${c.unit}` : ""}`).join(" · ")),
    ));

    const choices = choiceList(ctx, (c) => c.step === "class" && !isSpellChoice(c));
    if (choices.length) parts.push(panel("Class Choices", choices));

    parts.push(equipmentPanel(ctx, cls, "class", "Class"));

    parts.push(panel(
      `Features (${cls.name} ${ch.level})`,
      h(
        "p",
        { class: "small muted" },
        `Hit Die d${cls.hitDie} · Saves ${cls.saves.map((a) => ABILITY_ABBR[a]).join(", ")} · Armor ${cls.armor.join(", ") || "none"} · Weapons ${cls.weapons.join(", ")}`,
      ),
      h(
        "ul",
        { class: "feature-list" },
        sheet.features
          .filter((f) => f.kind === "class" || f.kind === "subclass")
          .map((f) => h("li", {}, h("span", { class: "lvl" }, `L${f.level}`), h("b", {}, f.name), f.kind === "subclass" ? h("small", { class: "muted" }, " (subclass)") : "", h("div", { class: "small" }, f.text))),
      ),
    ));
    return h("div", {}, parts);
  },
};
