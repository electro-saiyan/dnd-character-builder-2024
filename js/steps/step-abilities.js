// Step 3: ability scores by Standard Array, Point Buy (27) or 4d6-drop-lowest rolls.
import * as R from "../rules.js";
import { ABILITY_IDS } from "../data/skills.js";
import { ABILITY_NAMES } from "../choices.js";
import { h, panel, segmented, fmt } from "./widgets.js";

// Secure random float in [0, 1).
const rng = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

// Assign values from a pool (multiset) to abilities; each value can be used as often as it appears.
function assignTable(ctx, pool) {
  const { ch } = ctx;
  const used = (except) => ABILITY_IDS.filter((a) => a !== except).map((a) => ch.baseScores[a]).filter((v) => v != null);
  const available = (ability) => {
    const left = [...pool];
    for (const v of used(ability)) left.splice(left.indexOf(v), 1);
    return [...new Set(left)].sort((a, b) => b - a);
  };
  return h(
    "div",
    { class: "row" },
    ABILITY_IDS.map((a) =>
      h(
        "label",
        { class: "field" },
        h("span", {}, ABILITY_NAMES[a]),
        h(
          "select",
          { onchange: (e) => ctx.update((d) => {
            d.baseScores[a] = e.target.value === "" ? null : Number(e.target.value);
          }) },
          h("option", { value: "", selected: ch.baseScores[a] == null }, "—"),
          available(a).map((v) => h("option", { value: String(v), selected: ch.baseScores[a] === v }, String(v))),
        ),
      )),
  );
}

function pointBuy(ctx) {
  const { ch } = ctx;
  const cost = R.pointBuyCost(ch.baseScores) ?? 0;
  const left = R.POINT_BUY_BUDGET - cost;
  const step = (a, delta) => ctx.update((d) => {
    d.baseScores[a] = (d.baseScores[a] ?? 8) + delta;
  });
  const nextCost = (v) => R.POINT_BUY_COST[v + 1] - R.POINT_BUY_COST[v];
  return h(
    "div",
    {},
    h("p", {}, h("b", {}, `${left}`), ` of ${R.POINT_BUY_BUDGET} points left. Scores range 8–15 before bonuses.`),
    h(
      "div",
      { class: "row" },
      ABILITY_IDS.map((a) => {
        const v = ch.baseScores[a] ?? 8;
        return h(
          "div",
          { class: "field" },
          h("span", {}, ABILITY_NAMES[a]),
          h(
            "span",
            { class: "stepper" },
            h("button", { type: "button", disabled: v <= 8, onclick: () => step(a, -1), "aria-label": `Lower ${ABILITY_NAMES[a]}` }, "−"),
            h("b", {}, String(v)),
            h("button", { type: "button", disabled: v >= 15 || nextCost(v) > left, onclick: () => step(a, 1), "aria-label": `Raise ${ABILITY_NAMES[a]}` }, "+"),
          ),
        );
      }),
    ),
  );
}

// Free entry: type any base score (before background boosts).
function manualEntry(ctx) {
  const { ch } = ctx;
  return h(
    "div",
    {},
    h("p", { class: "muted small" }, "Type any base score (1–30). Background boosts and feats are added on top."),
    h(
      "div",
      { class: "row" },
      ABILITY_IDS.map((a) =>
        h(
          "label",
          { class: "field" },
          h("span", {}, ABILITY_NAMES[a]),
          h("input", {
            type: "number", min: "1", max: "30", step: "1", style: "width:5em", value: ch.baseScores[a] == null ? "" : String(ch.baseScores[a]),
            onchange: (e) => ctx.update((d) => {
              const v = Math.round(Number(e.target.value));
              d.baseScores[a] = e.target.value === "" || !Number.isFinite(v) ? null : Math.min(30, Math.max(1, v));
            }),
          }),
        )),
    ),
  );
}

export default {
  id: "abilities",
  title: "Ability Scores",
  render(ctx) {
    const { ch, reg, sheet } = ctx;
    const bg = reg.backgrounds[ch.backgroundId];
    const setMethod = (m) => ctx.update((d) => {
      if (d.abilityMethod === m) return;
      d.abilityMethod = m;
      // Manual keeps the current scores so they can be adjusted; other methods start fresh.
      if (m !== "manual") d.baseScores = Object.fromEntries(ABILITY_IDS.map((a) => [a, m === "pointbuy" ? 8 : null]));
      if (m !== "roll" && m !== "manual") d.rolls = null;
    });

    let body;
    if (ch.abilityMethod === "standard") {
      body = [h("p", { class: "muted small" }, `Assign ${R.STANDARD_ARRAY.join(", ")} — each once.`), assignTable(ctx, R.STANDARD_ARRAY)];
    } else if (ch.abilityMethod === "pointbuy") {
      body = pointBuy(ctx);
    } else if (ch.abilityMethod === "manual") {
      body = manualEntry(ctx);
    } else {
      const rolls = ch.rolls ?? [];
      body = [
        h("p", {}, h("button", { type: "button", onclick: () => ctx.update((d) => {
          d.rolls = ABILITY_IDS.map(() => R.roll4d6DropLowest(rng));
          d.baseScores = Object.fromEntries(ABILITY_IDS.map((a) => [a, null]));
        }) }, rolls.length ? "Reroll all" : "Roll 4d6 × 6")),
        rolls.length > 0 && h("p", { class: "small" }, rolls.map((r) => `${r.total} [${r.rolls.join(", ")}]`).join(" · ")),
        rolls.length > 0 && assignTable(ctx, rolls.map((r) => r.total)),
      ];
    }

    const rows = ABILITY_IDS.map((a) => {
      const base = ch.baseScores[a];
      const boost = ch.bgBoosts[a] ?? 0;
      const final = sheet.abilities[a].score;
      const other = base == null ? 0 : final - Math.min(20, base + boost);
      return h(
        "tr",
        {},
        h("td", {}, ABILITY_NAMES[a]),
        h("td", { class: "num" }, base ?? "—"),
        h("td", { class: "num" }, boost ? `+${boost}` : ""),
        h("td", { class: "num" }, other ? fmt(other) : ""),
        h("td", { class: "num" }, h("b", {}, base == null ? "—" : final)),
        h("td", { class: "num" }, base == null ? "" : fmt(sheet.abilities[a].mod)),
      );
    });

    return h(
      "div",
      {},
      h("header", {}, h("h2", {}, "Ability Scores"), h("p", { class: "muted" }, "Generate scores, then your background boosts are added.")),
      panel(
        "Method",
        segmented([["standard", "Standard Array"], ["pointbuy", "Point Buy"], ["roll", "Roll"], ["manual", "Manual"]], ch.abilityMethod, setMethod),
        body,
      ),
      panel(
        "Result",
        !bg && h("p", { class: "muted small" }, "Choose a background in Origin to apply its boosts."),
        h(
          "table",
          {},
          h("thead", {}, h("tr", {}, ["Ability", "Base", "Background", "Other", "Score", "Mod"].map((t, i) => h("th", { class: i ? "num" : "" }, t)))),
          h("tbody", {}, rows),
        ),
        h("p", { class: "muted small" }, "“Other” includes feats and class features (e.g. Ability Score Improvement)."),
      ),
    );
  },
};
