// Step 4: alignment.
import { ALIGNMENTS } from "../validate.js";
import { h, panel, cardGrid } from "./widgets.js";

export default {
  id: "alignment",
  title: "Alignment",
  render(ctx) {
    return h(
      "div",
      {},
      h("header", {}, h("h2", {}, "Alignment"), h("p", { class: "muted" }, "Your character's moral and ethical outlook.")),
      panel(
        null,
        cardGrid(ALIGNMENTS.map(([id, name]) => ({ id, name })), ctx.ch.alignment, (id) => ctx.update((d) => {
          d.alignment = id;
        }), { cls: "align-grid" }),
      ),
    );
  },
};
