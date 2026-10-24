// Step 2: background (ability boosts, feat, equipment), species (size, traits), languages.
import { applyStartingEquipment } from "../state.js";
import { ABILITY_ABBR, ABILITY_NAMES, isSpellChoice } from "../choices.js";
import { h, panel, field, select, cardGrid, segmented, choiceList, choicePicker } from "./widgets.js";
import { equipmentPanel } from "./step-class.js";

function boostPanel(ctx, bg) {
  const { ch } = ctx;
  const values = Object.values(ch.bgBoosts).filter(Boolean);
  const mode = values.length === 3 ? "111" : "21";
  const plus2 = Object.keys(ch.bgBoosts).find((k) => ch.bgBoosts[k] === 2) ?? null;
  const plus1 = mode === "21" ? Object.keys(ch.bgBoosts).find((k) => ch.bgBoosts[k] === 1) ?? null : null;
  const opts = (exclude) => bg.abilities.map((a) => ({ id: a, name: ABILITY_NAMES[a], disabled: a === exclude }));
  const set21 = (two, one) => ctx.update((d) => {
    d.bgBoosts = {};
    if (two) d.bgBoosts[two] = 2;
    if (one && one !== two) d.bgBoosts[one] = 1;
  });
  return panel(
    "Ability Score Increases",
    h("p", { class: "muted small" }, `${bg.name}: ${bg.abilities.map((a) => ABILITY_NAMES[a]).join(", ")}. No score can go above 20.`),
    segmented([["21", "+2 / +1"], ["111", "+1 / +1 / +1"]], mode, (m) => ctx.update((d) => {
      d.bgBoosts = m === "111" ? Object.fromEntries(bg.abilities.map((a) => [a, 1])) : {};
    })),
    mode === "21" && h(
      "div",
      { class: "row" },
      field("+2", select(opts(plus1), plus2, (v) => set21(v, plus1), { placeholder: "— choose —" })),
      field("+1", select(opts(plus2), plus1, (v) => set21(plus2, v), { placeholder: "— choose —" })),
    ),
  );
}

function languagesPanel(ctx) {
  const { ch, reg, sheet } = ctx;
  const picks = ch.languages.filter((l) => l !== "common");
  // Languages known from other sources (e.g. Thieves' Cant, Druidic) can't be picked again.
  const fromOthers = new Set(sheet.languageIds.filter((id) => !ch.languages.includes(id)));
  const options = Object.values(reg.languages)
    .filter((l) => l.rarity === "standard" && l.id !== "common")
    .map((l) => ({ id: l.id, name: l.name, disabled: fromOthers.has(l.id), reason: "already known" }));
  return panel(
    "Languages",
    h("p", { class: "muted small" }, "You know Common plus two languages from the Standard Languages table."),
    choicePicker(
      { effect: { category: "language" }, count: 2, chosen: picks },
      ctx,
      (ids) => ctx.update((d) => {
        d.languages = ["common", ...ids];
      }),
      { title: "Standard languages", options },
    ),
  );
}

export default {
  id: "origin",
  title: "Origin",
  render(ctx) {
    const { ch, reg, sheet } = ctx;
    const bg = reg.backgrounds[ch.backgroundId];
    const species = reg.species[ch.speciesId];
    const parts = [h("header", {}, h("h2", {}, "Origin"), h("p", { class: "muted" }, "Background, species and languages."))];

    const backgrounds = Object.values(reg.backgrounds).map((b) => ({
      id: b.id,
      name: b.name,
      meta: `${b.abilities.map((a) => ABILITY_ABBR[a]).join(" ")} · ${reg.feats[b.feat]?.name ?? b.feat}`,
      text: b.skills.map((s) => reg.skills.find((x) => x.id === s)?.name).join(", "),
    }));
    parts.push(panel("Background", cardGrid(backgrounds, ch.backgroundId, (id) => ctx.update((d) => {
      if (d.backgroundId === id) return;
      d.backgroundId = id;
      d.bgBoosts = {};
      d.equipmentOption.background = null;
      applyStartingEquipment(d, reg);
    }))));

    if (bg) {
      parts.push(boostPanel(ctx, bg));
      const feat = reg.feats[bg.feat];
      const bgChoices = choiceList(ctx, (c) => c.step === "origin" && c.key.startsWith("background.") && !isSpellChoice(c));
      const toolChoice = choiceList(ctx, (c) => c.key === `${bg.id}.tool`);
      parts.push(panel(
        `${bg.name} Background`,
        h("p", { class: "small" }, h("b", {}, "Skills: "), bg.skills.map((s) => sheet.skills[s].name).join(", "),
          typeof bg.tool === "string" ? [h("br"), h("b", {}, "Tool: "), reg.items[bg.tool]?.name] : ""),
        feat && h("p", { class: "small" }, h("b", {}, `Feat — ${feat.name}: `), feat.text),
        toolChoice, bgChoices,
      ));
      parts.push(equipmentPanel(ctx, bg, "background", "Background"));
    }

    const speciesCards = Object.values(reg.species).map((s) => ({
      id: s.id, name: s.name, meta: `${[].concat(s.size).join("/")} · ${s.speed} ft`,
    }));
    parts.push(panel("Species", cardGrid(speciesCards, ch.speciesId, (id) => ctx.update((d) => {
      if (d.speciesId === id) return;
      d.speciesId = id;
      const sizes = [].concat(reg.species[id].size);
      d.size = sizes.length === 1 ? sizes[0] : null;
    }))));

    if (species) {
      const sizes = [].concat(species.size);
      const speciesChoices = choiceList(ctx, (c) => c.step === "origin" && !c.key.startsWith("background.") && c.key !== `${bg?.id}.tool` && !isSpellChoice(c));
      parts.push(panel(
        `${species.name} Traits`,
        sizes.length > 1 && field("Size", select(sizes.map((s) => ({ id: s, name: s })), ch.size, (v) => ctx.update((d) => {
          d.size = v;
        }), { placeholder: "— choose —" })),
        h("ul", { class: "feature-list" }, species.traits.map((t) =>
          h("li", {}, h("b", {}, t.name), t.level ? h("small", { class: "muted" }, ` (level ${t.level}+)`) : "", h("div", { class: "small" }, t.text)))),
        speciesChoices,
      ));
    }

    parts.push(languagesPanel(ctx));
    return h("div", {}, parts);
  },
};
