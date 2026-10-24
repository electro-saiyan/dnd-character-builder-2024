// Step 8: validation checklist + the canvas character sheet (click a field to jump to its step).
import { mountSheet } from "../sheet/renderer.js";
import { downloadPNG, printSheet } from "../sheet/export.js";
import { h, panel } from "./widgets.js";

export default {
  id: "review",
  title: "Review",
  render(ctx) {
    const { steps, status, sheet } = ctx;
    const checks = steps.filter((s) => s.id !== "review").map((s) => {
      const { errors, warnings } = status[s.id];
      return h(
        "li",
        {},
        h("b", {}, s.title), " ",
        errors.length === 0 ? h("span", { class: "status-ok" }, "✓ complete") : h("button", { type: "button", class: "link", onclick: () => ctx.go(s.id) }, "Fix"),
        errors.length > 0 && h("ul", { class: "messages errors" }, errors.map((e) => h("li", {}, e))),
        warnings.length > 0 && h("ul", { class: "messages warnings" }, warnings.map((w) => h("li", {}, w))),
      );
    });

    const pages = h("div", { class: "sheet-pages" });
    const hasSpells = steps.some((s) => s.id === "spells");
    mountSheet(pages, sheet, { onJump: ctx.go, spellStep: hasSpells ? "spells" : "class" });

    return h(
      "div",
      {},
      h("header", {}, h("h2", {}, "Review"), h("p", { class: "muted" }, "Check every step, then look over the finished sheet. Click any field on the sheet to edit it.")),
      panel("Checklist", h("ul", { class: "feature-list" }, checks)),
      panel(
        "Character Sheet",
        h(
          "div",
          { class: "row sheet-actions" },
          h("button", { type: "button", onclick: () => downloadPNG(sheet) }, "Download PNG"),
          h("button", { type: "button", onclick: () => printSheet(sheet) }, "Print / Save as PDF"),
        ),
        pages,
      ),
    );
  },
};
