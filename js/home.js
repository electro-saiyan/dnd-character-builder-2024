// Home page: what the app is, how it works, and a way into the wizard.
import { h } from "./steps/widgets.js";

const FEATURES = [
  ["Step by step", "Class, origin, ability scores, alignment, details, spells and equipment, in the 2024 creation order."],
  ["Only legal picks", "Feat and invocation prerequisites, spell levels and duplicate proficiencies are checked for you."],
  ["Printable sheet", "A finished multi-page character sheet you can download as PNG or print."],
  ["Saved locally", "Your character autosaves in this browser. Export or import JSON to keep a copy or switch devices."],
];

export default {
  id: "home",
  title: "Home",
  render({ ch, sheet, steps, go, newCharacter }) {
    const started = !!(ch.classId || ch.speciesId || ch.backgroundId || ch.details.name);
    const who = sheet.name || (sheet.className ? `${sheet.className} ${sheet.level}` : "your character");
    return h(
      "div",
      { class: "home" },
      h(
        "section",
        { class: "home-hero" },
        h("h2", {}, "D&D 2024 Character Builder"),
        h("p", { class: "lead" }, "Build a Dungeons & Dragons character with the 2024 Player's Handbook rules and get a ready-to-play character sheet."),
        h(
          "p",
          { class: "muted" },
          "Pick your class, background and species, assign ability scores and choose your spells and gear. "
            + "The builder works out the numbers (AC, hit points, saves, skills, spell DC) as you go and only offers options your character qualifies for.",
        ),
        h(
          "div",
          { class: "home-actions" },
          started
            ? [
              h("button", { type: "button", class: "primary", onclick: () => go(steps[0].id) }, `Continue ${who} →`),
              h("button", { type: "button", onclick: newCharacter }, "Start a new character"),
            ]
            : h("button", { type: "button", class: "primary", onclick: () => go(steps[0].id) }, "Start building →"),
        ),
      ),
      h(
        "div",
        { class: "home-features" },
        FEATURES.map(([title, text]) => h("div", { class: "panel" }, h("h3", {}, title), h("p", { class: "muted small" }, text))),
      ),
    );
  },
};
