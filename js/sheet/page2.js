// Page 2: spellcasting, spell slots and spell table, details, languages, equipment, attunement, coins.
// Also the optional continuation page for anything that overflowed pages 1–2.
import { INK, box, caption, text, entries, measureEntries, checkbox, hline, signed, paragraph, PAGE_W } from "./draw.js";
import { PAGE2 as L } from "./layout.js";
import { ABILITY_NAMES } from "../choices.js";
import { ALIGNMENTS } from "../validate.js";

const ROW = 17;

function spellTable(ctx, sheet, flow) {
  const inner = box(ctx, L.spells, "Cantrips & Prepared Spells");
  const cols = [["Lvl", 0, 24], ["Name", 26, 150], ["Casting Time", 180, 92], ["Range", 274, 70], ["C R M", 346, 46], ["Notes", 394, inner.w - 394]];
  for (const [label, dx] of cols) caption(ctx, label, inner.x + dx, inner.y);
  const spells = [...sheet.spellList].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  const max = Math.floor((inner.h - 12) / ROW);
  let y = inner.y + 12;
  spells.forEach((s, i) => {
    if (i >= max) {
      flow.spells.push(s);
      return;
    }
    text(ctx, s.level || "C", inner.x + 4, y + 3, { size: 9.5, weight: 600 });
    text(ctx, s.name, inner.x + 26, y + 3, { size: 9.5, maxW: 150 });
    text(ctx, s.castingTime, inner.x + 180, y + 3, { size: 9, maxW: 92 });
    text(ctx, s.range, inner.x + 274, y + 3, { size: 9, maxW: 70 });
    [s.concentration, s.ritual, s.material].forEach((on, k) => checkbox(ctx, inner.x + 346 + k * 15, y + 3, 9, on));
    text(ctx, s.alwaysPrepared ? "always prepared" : s.notes, inner.x + 394, y + 3, { size: 8.5, maxW: inner.w - 394, color: INK.label });
    hline(ctx, inner.x, inner.x + inner.w, y + ROW - 1);
    y += ROW;
  });
  // Empty ruled rows for spells added later at the table.
  for (; y + ROW <= inner.y + inner.h; y += ROW) hline(ctx, inner.x, inner.x + inner.w, y + ROW - 1);
}

function textBox(ctx, rect, label, str) {
  const inner = box(ctx, rect, label);
  paragraph(ctx, str || "", inner, { size: 9.5, minSize: 7 });
}

export function drawPage2(ctx, sheet, hit, flow, spellStep) {
  const sc = sheet.spellcasting;
  const value = (rect, label, v) => {
    const inner = box(ctx, rect, label);
    text(ctx, v, inner.x + inner.w / 2, inner.y + 2, { size: 16, weight: 700, align: "center", maxW: inner.w });
    hit(rect, spellStep, label);
  };
  value(L.spellAbility, "Spellcasting Ability", sc ? ABILITY_NAMES[sc.ability] : "—");
  value(L.spellMod, "Modifier", sc ? signed(sc.mod) : "—");
  value(L.spellDC, "Spell Save DC", sc ? sc.dc : "—");
  value(L.spellAttack, "Spell Attack", sc ? signed(sc.attack) : "—");

  const slots = box(ctx, L.slots, `Spell Slots${sc?.type === "pact" ? " (Pact Magic — Short Rest)" : ""}`);
  const cell = slots.w / 9;
  for (let i = 0; i < 9; i++) {
    const s = sc?.slots[i] ?? { total: 0, expended: 0 };
    const x = slots.x + i * cell;
    caption(ctx, `Level ${i + 1}`, x + cell / 2, slots.y, { align: "center", size: 6.5 });
    text(ctx, s.total || "–", x + cell / 2, slots.y + 11, { size: 13, weight: 700, align: "center", color: s.total ? INK.ink : INK.faint });
    const boxes = Math.min(s.total, 4);
    for (let k = 0; k < boxes; k++) checkbox(ctx, x + cell / 2 - (boxes * 11) / 2 + k * 11 + 1, slots.y + 30, 8, k < s.expended);
  }
  hit(L.slots, spellStep, "Spell Slots");

  spellTable(ctx, sheet, flow);
  hit(L.spells, spellStep, "Spells");

  textBox(ctx, L.appearance, "Appearance", sheet.details.appearance);
  hit(L.appearance, "details", "Appearance");
  const d = sheet.details;
  const story = [
    d.personality && `Personality: ${d.personality}`, d.ideals && `Ideals: ${d.ideals}`, d.bonds && `Bonds: ${d.bonds}`,
    d.flaws && `Flaws: ${d.flaws}`, d.backstory && `\n${d.backstory}`,
  ].filter(Boolean).join("\n");
  textBox(ctx, L.personality, "Backstory & Personality", story);
  hit(L.personality, "details", "Backstory & Personality");

  const al = box(ctx, L.alignment, "Alignment");
  text(ctx, ALIGNMENTS.find(([id]) => id === sheet.alignment)?.[1] ?? "", al.x, al.y - 2, { size: 12, maxW: al.w });
  hit(L.alignment, "alignment", "Alignment");

  textBox(ctx, L.languages, "Languages", sheet.languages.join(", "));
  hit(L.languages, "origin", "Languages");

  const eq = box(ctx, L.equipment, "Equipment");
  const items = sheet.equipment.map((e) => ({ title: `${e.qty > 1 ? `${e.qty} × ` : ""}${e.name}${e.equipped ? " (equipped)" : ""}` }));
  const fit = entries(ctx, items, eq, { size: 9.5, minSize: 7, gap: 1.5, bold: false });
  if (fit < items.length) flow.sections.push({ title: "Equipment (continued)", items: items.slice(fit) });
  hit(L.equipment, "equipment", "Equipment");

  const at = box(ctx, L.attunement, `Magic Item Attunement (${sheet.attunementSlots})`);
  for (let i = 0; i < sheet.attunementSlots; i++) {
    const y = at.y + 4 + i * ((at.h - 4) / sheet.attunementSlots);
    checkbox(ctx, at.x, y + 2, 9, !!sheet.attunement[i]);
    text(ctx, sheet.attunement[i] ?? "", at.x + 14, y, { size: 10, maxW: at.w - 14 });
    hline(ctx, at.x + 14, at.x + at.w, y + 14);
  }
  hit(L.attunement, "equipment", "Attunement");

  // Wizard spellbook goes on the continuation page, one line per spell level.
  if (sc?.spellbookSpells?.length) {
    const byLevel = {};
    for (const s of sc.spellbookSpells) (byLevel[s.level] ??= []).push(`${s.name}${s.ritual ? " (R)" : ""}`);
    flow.sections.push({
      title: `Spellbook (${sc.spellbookSpells.length} spells; R = Ritual Adept)`,
      items: Object.entries(byLevel).map(([lvl, names]) => ({ title: `Level ${lvl}`, text: names.join(", ") })),
    });
  }

  const co = box(ctx, L.coins, "Coins");
  const coinW = co.w / 5;
  ["cp", "sp", "ep", "gp", "pp"].forEach((c, i) => {
    const cx = co.x + i * coinW + coinW / 2;
    caption(ctx, c, cx, co.y, { align: "center" });
    text(ctx, sheet.coins[c] ?? 0, cx, co.y + 14, { size: 14, weight: 700, align: "center", maxW: coinW - 4 });
  });
  hit(L.coins, "equipment", "Coins");
}

export const hasOverflow = (flow) => flow.sections.length > 0 || flow.spells.length > 0 || flow.attacks.length > 0;

// Continuation page: overflowed sections in two columns.
export function drawContinuation(ctx, sheet, flow) {
  text(ctx, `${sheet.name || "Character"} — continued`, 30, 30, { size: 18, family: "head", weight: 700 });
  const sections = [...flow.sections];
  if (flow.attacks.length) {
    sections.unshift({ title: "Weapons & Damage Cantrips (continued)", items: flow.attacks.map((a) => ({ title: `${a.name}: ${a.dc ? `DC ${a.dc}` : signed(a.attack)}, ${a.damage} ${a.damageType}`, text: a.notes.join(", ") })) });
  }
  if (flow.spells.length) {
    sections.push({ title: "Spells (continued)", items: flow.spells.map((s) => ({ title: `${s.level || "C"} · ${s.name}`, text: `${s.castingTime}, ${s.range}${s.concentration ? ", Concentration" : ""}${s.ritual ? ", Ritual" : ""}` })) });
  }
  // Stack section boxes down two columns, each sized to the entries that fit in the remaining space.
  const colW = (PAGE_W - 70) / 2;
  const BOTTOM = 1070;
  let col = 0;
  let y = 64;
  for (const sec of sections) {
    let items = sec.items;
    while (items.length && col < 2) {
      const heights = measureEntries(ctx, items, colW - 14);
      const room = BOTTOM - y - 23;
      let n = 0;
      let used = 0;
      while (n < items.length && used + heights[n] <= room) used += heights[n++];
      if (n === 0) {
        col += 1;
        y = 64;
        continue;
      }
      const rect = { x: 30 + col * (colW + 10), y, w: colW, h: used + 23 };
      const inner = box(ctx, rect, sec.title);
      entries(ctx, items.slice(0, n), inner, { size: 9, minSize: 9 });
      items = items.slice(n);
      y += rect.h + 10;
      if (items.length) {
        col += 1;
        y = 64;
      }
    }
  }
}
