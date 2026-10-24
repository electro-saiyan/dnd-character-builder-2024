// Step 5: name, appearance, personality and backstory.
import { h, panel, field } from "./widgets.js";

export default {
  id: "details",
  title: "Details",
  render(ctx) {
    const { ch } = ctx;
    // Typing updates quietly so the field keeps focus (no full re-render).
    const text = (key, label, { multiline = false, hint } = {}) => {
      const props = {
        value: ch.details[key],
        oninput: (e) => ctx.update((d) => {
          d.details[key] = e.target.value;
        }, { quiet: true }),
      };
      const control = multiline ? h("textarea", props) : h("input", { type: "text", ...props });
      if (multiline) control.value = ch.details[key];
      return field(label, control, hint);
    };
    return h(
      "div",
      {},
      h("header", {}, h("h2", {}, "Details"), h("p", { class: "muted" }, "Who is your character?")),
      panel(
        "Identity",
        text("name", "Character name"),
        field("Experience points", h("input", {
          type: "number", min: "0", value: String(ch.xp ?? 0),
          oninput: (e) => ctx.update((d) => {
            d.xp = Math.max(0, Number(e.target.value) || 0);
          }, { quiet: true }),
        })),
        text("appearance", "Appearance", { multiline: true }),
      ),
      panel(
        "Personality",
        text("personality", "Personality traits", { multiline: true }),
        text("ideals", "Ideals", { multiline: true }),
        text("bonds", "Bonds", { multiline: true }),
        text("flaws", "Flaws", { multiline: true }),
      ),
      panel("Backstory", text("backstory", "Backstory", { multiline: true })),
    );
  },
};
