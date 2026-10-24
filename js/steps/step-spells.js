// Step 6: cantrips, prepared spells, and spell picks granted by features/feats.
import { spellsMatching, spellDetail, spellGroup, ABILITY_NAMES } from "../choices.js";
import { h, panel, choiceList, choicePicker, fmt } from "./widgets.js";

const flags = (s) => [s.concentration && "C", s.ritual && "R", s.material && "M"].filter(Boolean).join(" ");

export default {
  id: "spells",
  title: "Spells",
  render(ctx) {
    const { ch, reg, sheet } = ctx;
    const sc = sheet.spellcasting;
    const parts = [h("header", {}, h("h2", {}, "Spells"), h("p", { class: "muted" }, "Cantrips and prepared spells from your class list."))];

    if (sc) {
      // Spells granted by features don't count against your picks, so hide them from the lists.
      const granted = new Set(sheet.spellList.filter((s) => !ch.spells.cantrips.includes(s.id) && !ch.spells.prepared.includes(s.id)).map((s) => s.id));
      const asOptions = (spells) => spells.filter((s) => !granted.has(s.id)).map((s) => ({ id: s.id, name: s.name, detail: spellDetail(s), group: spellGroup(s), dataset: s.name }));
      const cantrips = asOptions(spellsMatching({ list: sc.list, level: 0 }, sheet, reg));
      const leveled = asOptions(spellsMatching({ list: sc.list, minLevel: 1 }, sheet, reg));
      const slots = sc.slots.filter((s) => s.total > 0);

      // Wizard: pick spellbook spells, then prepare only from the book (incl. free Savant spells).
      const hasBook = !!sc.spellbookSize;
      const freeBook = new Set(sheet.selections.spellbook ?? []);
      const bookOptions = leveled.map((o) => (freeBook.has(o.id) ? { ...o, disabled: true, reason: "free Savant spell" } : o));
      const book = new Set(sc.spellbook ?? []);
      const prepareFrom = hasBook ? leveled.filter((o) => book.has(o.id)) : leveled;

      parts.push(panel(
        "Spellcasting",
        h(
          "p",
          {},
          `${ABILITY_NAMES[sc.ability]} · Save DC ${sc.dc} · Attack ${fmt(sc.attack)} · `,
          slots.length ? `Slots: ${slots.map((s) => `L${s.level}×${s.total}`).join(", ")}` : "No spell slots yet",
          sc.type === "pact" ? " (Pact Magic, recharge on a Short Rest)" : "",
        ),
        sc.cantripsKnown > 0 && choicePicker(
          { effect: { category: "spell" }, count: sc.cantripsKnown, chosen: ch.spells.cantrips },
          ctx,
          (ids) => ctx.update((d) => {
            d.spells.cantrips = ids;
          }),
          { title: "Cantrips", options: cantrips },
        ),
        hasBook && h("p", { class: "small muted" }, `Spellbook: 6 level 1 spells, +2 per Wizard level of any level you have slots for (${sc.spellbookSize} total). Ritual Adept lets you cast its Ritual spells without preparing them.`),
        hasBook && choicePicker(
          { effect: { category: "spell" }, count: sc.spellbookSize, chosen: ch.spells.spellbook ?? [] },
          ctx,
          (ids) => ctx.update((d) => {
            d.spells.spellbook = ids;
            // Spells removed from the book can't stay prepared.
            const keep = new Set([...ids, ...freeBook]);
            d.spells.prepared = d.spells.prepared.filter((id) => keep.has(id));
          }),
          { title: "Spellbook", options: bookOptions },
        ),
        hasBook && choiceList(ctx, (c) => c.effect.category === "spellbook"),
        sc.preparedCount > 0 && choicePicker(
          { effect: { category: "spell" }, count: sc.preparedCount, chosen: ch.spells.prepared },
          ctx,
          (ids) => ctx.update((d) => {
            d.spells.prepared = ids;
          }),
          {
            title: hasBook ? "Prepared spells (from your spellbook)" : `Prepared spells (level 1–${sc.maxLevel})`,
            options: prepareFrom,
          },
        ),
        hasBook && prepareFrom.length === 0 && h("p", { class: "muted small" }, "Add spells to your spellbook to prepare them."),
      ));
    }

    const featureSpells = choiceList(ctx, (c) => c.effect.category === "spell" || (c.effect.category === "spellbook" && !sc?.spellbookSize));
    if (featureSpells.length) parts.push(panel("Spells from Features & Feats", featureSpells));

    parts.push(panel(
      "Your Spell List",
      sheet.spellList.length === 0
        ? h("p", { class: "muted" }, "No spells yet.")
        : h(
          "table",
          {},
          h("thead", {}, h("tr", {}, ["Lvl", "Spell", "Casting Time", "Range", "C/R/M", ""].map((t) => h("th", {}, t)))),
          h(
            "tbody",
            {},
            [...sheet.spellList].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)).map((s, i, all) => [
              // A heading row each time the level changes.
              (i === 0 || all[i - 1].level !== s.level) && h("tr", { class: "group-row" }, h("th", { colspan: 6 }, spellGroup(s))),
              h(
                "tr",
                {},
                h("td", { class: "num" }, s.level || "C"),
                h("td", {}, s.name),
                h("td", {}, s.castingTime),
                h("td", {}, s.range),
                h("td", {}, flags(s)),
                h("td", { class: "small muted" }, s.alwaysPrepared ? "always prepared" : ""),
              ),
            ]),
          ),
        ),
    ));
    return h("div", {}, parts);
  },
};
