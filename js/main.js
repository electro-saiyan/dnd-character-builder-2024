// App bootstrap: store, autosave, hash router, step navigation and the live summary.
import { createRegistry } from "./data/index.js";
import { createStore, createCharacter, derive } from "./state.js";
import { loadCharacter, saveCharacter, exportJSON, importJSON } from "./storage.js";
import { validateStep, hasSpellStep } from "./validate.js";
import { h, fmt } from "./steps/widgets.js";
import classStep from "./steps/step-class.js";
import originStep from "./steps/step-origin.js";
import abilitiesStep from "./steps/step-abilities.js";
import alignmentStep from "./steps/step-alignment.js";
import detailsStep from "./steps/step-details.js";
import spellsStep from "./steps/step-spells.js";
import equipmentStep from "./steps/step-equipment.js";
import reviewStep from "./steps/step-review.js";
import homePage from "./home.js";

const STEPS = [classStep, originStep, abilitiesStep, alignmentStep, detailsStep, spellsStep, equipmentStep, reviewStep];

const store = createStore(loadCharacter() ?? createCharacter());
const $ = (id) => document.getElementById(id);
// No hash = the home page.
let current = location.hash.slice(1) || homePage.id;

const go = (id) => {
  if (location.hash.slice(1) === id) render();
  else location.hash = id;
};

function context() {
  const ch = store.get();
  const reg = createRegistry(ch.custom);
  const sheet = derive(ch, reg);
  const steps = STEPS.filter((s) => s.id !== "spells" || hasSpellStep(sheet));
  const status = Object.fromEntries(steps.map((s) => [s.id, validateStep(s.id, ch, sheet, reg)]));
  // Every step can be opened from the sidebar at any time; only "Next" waits for the current step.
  return { ch, reg, sheet, steps, status, update: store.update, go, newCharacter };
}

function newCharacter() {
  if (!confirm("Start a new character? The current one is replaced (export it first to keep it).")) return;
  store.replace(createCharacter());
  go(STEPS[0].id);
}

function renderNav(ctx) {
  $("steps").replaceChildren(
    h(
      "a",
      { href: `#${homePage.id}`, class: "home-link", "aria-current": current === homePage.id ? "step" : null },
      h("span", { class: "dot" }, "⌂"),
      h("span", { class: "label" }, homePage.title),
    ),
    ...ctx.steps.map((s, i) => {
      const done = !ctx.status[s.id].errors.length;
      return h(
        "a",
        { href: `#${s.id}`, class: done ? "done" : "todo", "aria-current": s.id === current ? "step" : null },
        h("span", { class: "dot" }, done ? "✓" : String(i + 1)),
        h("span", { class: "label" }, s.title),
      );
    }),
  );
}

function stepNav(ctx) {
  const i = ctx.steps.findIndex((s) => s.id === current);
  const prev = ctx.steps[i - 1];
  const next = ctx.steps[i + 1];
  const { errors } = ctx.status[current];
  return h(
    "div",
    { class: "step-nav", id: "step-nav" },
    prev ? h("button", { type: "button", onclick: () => go(prev.id) }, `← ${prev.title}`) : h("span"),
    h("span", { class: "errors" }, errors[0] ?? ""),
    next && h("button", { type: "button", class: "primary", disabled: errors.length > 0, onclick: () => go(next.id) }, `${next.title} →`),
  );
}

function renderSummary({ sheet }) {
  const stat = (label, value) => h("div", { class: "stat" }, h("b", {}, value), h("span", {}, label));
  const sub = [sheet.speciesName, sheet.className && `${sheet.className} ${sheet.level}`, sheet.subclassName].filter(Boolean).join(" · ");
  $("summary").replaceChildren(
    h(
      "div",
      { class: "panel" },
      h("h3", {}, sheet.name || "Unnamed hero"),
      h("div", { class: "muted small" }, sub || "No class chosen yet"),
      sheet.backgroundName && h("div", { class: "muted small" }, sheet.backgroundName),
      h(
        "div",
        { class: "stat-grid" },
        stat("AC", sheet.ac),
        stat("HP", sheet.hp.max),
        stat("Init", fmt(sheet.initiative)),
        stat("Speed", sheet.speed),
        stat("Prof", fmt(sheet.profBonus)),
        stat("Passive", sheet.passivePerception),
      ),
      h(
        "div",
        { class: "stat-grid" },
        Object.entries(sheet.abilities).map(([id, a]) => stat(id, `${a.score} (${fmt(a.mod)})`)),
      ),
      sheet.pendingChoices.length > 0 && h("div", { class: "small muted" }, `${sheet.pendingChoices.length} choice(s) still open`),
    ),
  );
}

function render(meta = {}) {
  const ctx = context();
  if (current !== homePage.id && !ctx.steps.some((s) => s.id === current)) current = ctx.steps[0].id;
  renderNav(ctx);
  renderSummary(ctx);
  // The home page is about the app, not the character: no summary panel.
  const home = current === homePage.id;
  $("summary").hidden = home;
  $("summary").parentElement.classList.toggle("is-home", home);
  if (home) {
    $("step").replaceChildren(homePage.render(ctx));
    if (meta.keepScroll === false) window.scrollTo(0, 0);
    return;
  }
  if (meta.quiet && $("step-nav")) {
    $("step-nav").replaceWith(stepNav(ctx));
    return;
  }
  const step = STEPS.find((s) => s.id === current);
  const scroll = window.scrollY;
  $("step").replaceChildren(step.render(ctx), stepNav(ctx));
  window.scrollTo(0, meta.keepScroll === false ? 0 : scroll);
}

store.subscribe((ch, meta) => {
  saveCharacter(ch);
  render(meta);
});

window.addEventListener("hashchange", () => {
  current = location.hash.slice(1) || homePage.id;
  render({ keepScroll: false });
});

$("btn-export").addEventListener("click", () => exportJSON(store.get()));
$("btn-import").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    store.replace(await importJSON(file));
  } catch (err) {
    alert(`Could not import: ${err.message}`);
  }
});
$("btn-new").addEventListener("click", newCharacter);

render();
