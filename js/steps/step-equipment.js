// Step 7: inventory (equip, attune, quantities), adding items, coins.
import { applyStartingEquipment } from "../state.js";
import { h, panel, field, equipmentText } from "./widgets.js";

const KIND_LABEL = { weapon: "Weapons", armor: "Armor", shield: "Shields", tool: "Tools", gear: "Adventuring Gear", pack: "Packs", ammo: "Ammunition" };
const COINS = [["cp", "CP"], ["sp", "SP"], ["ep", "EP"], ["gp", "GP"], ["pp", "PP"]];
const equippable = (item) => ["weapon", "armor", "shield"].includes(item.kind);

export default {
  id: "equipment",
  title: "Equipment",
  render(ctx) {
    const { ch, reg, sheet } = ctx;
    const cls = reg.classes[ch.classId];
    const bg = reg.backgrounds[ch.backgroundId];
    const edit = (i, fn) => ctx.update((d) => fn(d.inventory[i]));

    const start = [
      cls && ch.equipmentOption.class && `${cls.name} (${ch.equipmentOption.class}): ${equipmentText(cls.equipment[ch.equipmentOption.class], reg, ch.choices)}`,
      bg && ch.equipmentOption.background && `${bg.name} (${ch.equipmentOption.background}): ${equipmentText(bg.equipment[ch.equipmentOption.background], reg, ch.choices)}`,
    ].filter(Boolean);

    const rows = ch.inventory.map((entry, i) => {
      const item = reg.items[entry.itemId];
      if (!item) return null;
      return h(
        "tr",
        {},
        h("td", {}, item.name, item.contents && h("div", { class: "small muted" }, item.contents.join(", "))),
        h("td", { class: "num" }, h("input", {
          type: "number", min: "1", value: String(entry.qty), style: "width:4.5em", "aria-label": `${item.name} quantity`,
          onchange: (e) => edit(i, (x) => {
            x.qty = Math.max(1, Number(e.target.value) || 1);
          }),
        })),
        h("td", { class: "num" }, equippable(item) && h("input", {
          type: "checkbox", checked: !!entry.equipped, "aria-label": `Equip ${item.name}`,
          onchange: (e) => edit(i, (x) => {
            x.equipped = e.target.checked;
          }),
        })),
        h("td", { class: "num" }, h("input", {
          type: "checkbox", checked: !!entry.attuned, "aria-label": `Attune ${item.name}`,
          onchange: (e) => edit(i, (x) => {
            x.attuned = e.target.checked;
          }),
        })),
        h("td", { class: "num" }, item.weight != null ? `${+(item.weight * entry.qty).toFixed(2)} lb` : ""),
        h("td", {}, h("button", { type: "button", class: "link", onclick: () => ctx.update((d) => {
          d.inventory.splice(i, 1);
        }) }, "Remove")),
      );
    });

    const totalWeight = ch.inventory.reduce((n, e) => n + (reg.items[e.itemId]?.weight ?? 0) * e.qty, 0);
    const capacity = sheet.abilities.str.score * 15;

    // Add-item form: grouped select + quantity.
    const groups = {};
    for (const item of Object.values(reg.items)) (groups[item.kind] ??= []).push(item);
    const picker = h(
      "select",
      { "aria-label": "Item to add" },
      Object.entries(groups).map(([kind, items]) =>
        h("optgroup", { label: KIND_LABEL[kind] ?? kind }, items.sort((a, b) => a.name.localeCompare(b.name)).map((it) => h("option", { value: it.id }, it.name)))),
    );
    const qty = h("input", { type: "number", min: "1", value: "1", style: "width:4.5em", "aria-label": "Quantity" });

    return h(
      "div",
      {},
      h("header", {}, h("h2", {}, "Equipment & Coins"), h("p", { class: "muted" }, "Tick “Equip” on worn armor, a held Shield and weapons you use.")),
      panel(
        "Starting Equipment",
        start.length ? start.map((s) => h("p", { class: "small" }, s)) : h("p", { class: "muted" }, "Choose equipment options in the Class and Origin steps."),
        start.length > 0 && h("button", {
          type: "button",
          onclick: () => {
            if (confirm("Reset starting items and set GP to the starting amount? Items you added stay.")) ctx.update((d) => applyStartingEquipment(d, reg));
          },
        }, "Reset starting equipment"),
      ),
      panel(
        "Inventory",
        h(
          "table",
          {},
          h("thead", {}, h("tr", {}, ["Item", "Qty", "Equip", "Attune", "Weight", ""].map((t, i) => h("th", { class: i && i < 5 ? "num" : "" }, t)))),
          h("tbody", {}, rows),
        ),
        h("p", { class: "small muted" }, `Total ${+totalWeight.toFixed(2)} lb · Carrying capacity ${capacity} lb · Attunement ${ch.inventory.filter((e) => e.attuned).length}/${sheet.attunementSlots}`),
        h(
          "div",
          { class: "row" },
          field("Add item", picker),
          field("Qty", qty),
          h("button", {
            type: "button", class: "field",
            onclick: () => ctx.update((d) => {
              d.inventory.push({ itemId: picker.value, qty: Math.max(1, Number(qty.value) || 1), equipped: false, attuned: false });
            }),
          }, "Add"),
        ),
      ),
      panel(
        "Coins",
        h("div", { class: "row" }, COINS.map(([id, label]) => field(label, h("input", {
          type: "number", min: "0", value: String(ch.coins[id] ?? 0), style: "width:6em",
          oninput: (e) => ctx.update((d) => {
            d.coins[id] = Math.max(0, Math.floor(Number(e.target.value) || 0));
          }, { quiet: true }),
        })))),
      ),
    );
  },
};
