// Page 1: header, combat, abilities/saves/skills, training, weapons & cantrips, features.
import { INK, box, caption, text, entries, checkbox, marker, hline, shield, signed, paragraph } from "./draw.js";
import { PAGE1 as L, ABILITY_COLUMNS } from "./layout.js";
import { ABILITY_NAMES, ABILITY_ABBR } from "../choices.js";

const ARMOR_TRAINING = [["light", "Light"], ["medium", "Medium"], ["heavy", "Heavy"], ["shield", "Shields"]];
const ROW = 16;

function labeledValue(ctx, rect, label, value, opts = {}) {
  const inner = box(ctx, rect, label, opts.box);
  text(ctx, value, inner.x + (opts.center ? inner.w / 2 : 0), inner.y + (inner.h - (opts.size ?? 14)) / 2,
    { size: opts.size ?? 14, maxW: inner.w, align: opts.center ? "center" : "left", family: opts.family ?? "body", weight: opts.weight ?? 400 });
}

function abilityBlock(ctx, sheet, id, x, y, w) {
  const skills = Object.entries(sheet.skills).filter(([, s]) => s.ability === id);
  const a = sheet.abilities[id];
  const h = 58 + (1 + skills.length) * ROW + 4;
  box(ctx, { x, y, w, h }, ABILITY_NAMES[id]);

  const sq = { x: x + 7, y: y + 18, w: 50, h: 34 };
  box(ctx, sq, null, { fill: INK.fill, radius: 4 });
  text(ctx, a.score, sq.x + sq.w / 2, sq.y + 7, { size: 19, family: "head", weight: 700, align: "center" });
  text(ctx, signed(a.mod), x + 64, y + 20, { size: 22, family: "head", weight: 700 });
  caption(ctx, "Modifier", x + 64 + 46, y + 30);
  caption(ctx, "Score", sq.x + sq.w / 2, sq.y + sq.h + 1, { align: "center", size: 6 });

  let ry = y + 60;
  const row = (level, label, value, bold) => {
    marker(ctx, x + 13, ry + 6, level);
    text(ctx, label, x + 23, ry, { size: 9.5, weight: bold ? 700 : 400, maxW: w - 62 });
    text(ctx, signed(value), x + w - 9, ry, { size: 10, weight: 600, align: "right" });
    hline(ctx, x + 6, x + w - 6, ry + ROW - 2);
    ry += ROW;
  };
  row(a.saveProf ? 1 : 0, "Saving Throw", a.save, true);
  for (const [, s] of skills) row(s.expertise ? 2 : s.prof ? 1 : 0, s.name, s.mod);
  return h;
}

function weaponsTable(ctx, sheet, flow) {
  const inner = box(ctx, L.weapons, "Weapons & Damage Cantrips");
  const cols = [["Name", 0, 110], ["Atk / DC", 112, 52], ["Damage & Type", 166, 100], ["Notes", 268, inner.w - 268]];
  for (const [label, dx] of cols) caption(ctx, label, inner.x + dx, inner.y);
  const rowH = 24;
  let y = inner.y + 12;
  const max = Math.floor((inner.h - 12) / rowH);
  sheet.attacks.forEach((a, i) => {
    if (i >= max) {
      flow.attacks.push(a);
      return;
    }
    const atk = a.dc ? `DC ${a.dc} ${ABILITY_ABBR[a.save]}` : signed(a.attack);
    text(ctx, a.name, inner.x, y + 3, { size: 10, weight: 600, maxW: 108 });
    text(ctx, atk, inner.x + 112, y + 3, { size: 10, maxW: 52 });
    text(ctx, `${a.damage} ${a.damageType}`, inner.x + 166, y + 3, { size: 9.5, maxW: 100 });
    const notes = [...a.notes, a.mastery && `mastery: ${a.mastery}`, a.proficient === false && "not proficient"].filter(Boolean).join(", ");
    paragraph(ctx, notes, { x: inner.x + 268, y: y + 1, w: inner.w - 268, h: rowH - 2 }, { size: 7.8, minSize: 6.5, lineHeight: 1.15 });
    hline(ctx, inner.x, inner.x + inner.w, y + rowH - 1);
    y += rowH;
  });
}

function featureBox(ctx, rect, label, items, flow) {
  const inner = box(ctx, rect, label);
  if (!items.length) {
    text(ctx, "—", inner.x, inner.y, { size: 10, color: INK.label });
    return;
  }
  const fit = entries(ctx, items, inner);
  if (fit < items.length) {
    flow.sections.push({ title: `${label} (continued)`, items: items.slice(fit) });
    caption(ctx, `continued on page 3 (${items.length - fit} more)`, rect.x + rect.w - 8, rect.y + rect.h - 12, { align: "right", color: INK.accent });
  }
}

export function drawPage1(ctx, sheet, hit, flow) {
  // ----- Header -----
  labeledValue(ctx, L.name, "Character Name", sheet.name || "", { size: 20, family: "head", weight: 700 });
  hit(L.name, "details", "Name");
  labeledValue(ctx, L.background, "Background", sheet.backgroundName, { size: 13 });
  hit(L.background, "origin", "Background");
  labeledValue(ctx, L.class, "Class", sheet.className, { size: 13 });
  hit(L.class, "class", "Class");
  labeledValue(ctx, L.level, "Level", sheet.level, { size: 18, center: true, family: "head", weight: 700 });
  hit(L.level, "class", "Level");
  labeledValue(ctx, L.xp, "XP", sheet.xp, { size: 12, center: true });
  hit(L.xp, "details", "XP");
  labeledValue(ctx, L.species, "Species", sheet.speciesName, { size: 12 });
  hit(L.species, "origin", "Species");
  labeledValue(ctx, L.subclass, "Subclass", sheet.subclassName, { size: 12 });
  hit(L.subclass, "class", "Subclass");
  labeledValue(ctx, L.prof, "Proficiency Bonus", signed(sheet.profBonus), { size: 15, center: true, weight: 700 });
  hit(L.prof, "class", "Proficiency Bonus");
  const insp = box(ctx, L.inspiration, "Heroic Inspiration");
  checkbox(ctx, insp.x + insp.w / 2 - 7, insp.y, 14, sheet.heroicInspiration);

  // ----- Combat -----
  shield(ctx, { ...L.ac, h: L.ac.h - 16 });
  caption(ctx, "Armor Class", L.ac.x + L.ac.w / 2, L.ac.y + 12, { align: "center" });
  text(ctx, sheet.ac, L.ac.x + L.ac.w / 2, L.ac.y + 28, { size: 28, family: "head", weight: 700, align: "center" });
  checkbox(ctx, L.ac.x + 14, L.ac.y + L.ac.h - 12, 10, sheet.shield);
  caption(ctx, "Shield", L.ac.x + 28, L.ac.y + L.ac.h - 11);
  hit(L.ac, "equipment", "Armor Class");

  const hp = box(ctx, L.hp, "Hit Points");
  const third = hp.w / 3;
  [["Current", sheet.hp.current], ["Temp", sheet.hp.temp || ""], ["Max", sheet.hp.max]].forEach(([label, v], i) => {
    const cx = hp.x + third * i + third / 2;
    text(ctx, v, cx, hp.y + 14, { size: 22, family: "head", weight: 700, align: "center" });
    caption(ctx, label, cx, hp.y + hp.h - 10, { align: "center" });
  });
  hit(L.hp, "class", "Hit Points");

  const hd = box(ctx, L.hitDice, "Hit Dice");
  text(ctx, `${sheet.hitDice.max}${sheet.hitDice.die}`, hd.x + hd.w / 2, hd.y + 14, { size: 20, family: "head", weight: 700, align: "center" });
  caption(ctx, `Spent: ${sheet.hitDice.spent}`, hd.x + hd.w / 2, hd.y + hd.h - 10, { align: "center" });
  hit(L.hitDice, "class", "Hit Dice");

  const ds = box(ctx, L.deathSaves, "Death Saves");
  [["Successes", sheet.deathSaves.s], ["Failures", sheet.deathSaves.f]].forEach(([label, n], row) => {
    const y = ds.y + 10 + row * 30;
    caption(ctx, label, ds.x, y + 2);
    for (let i = 0; i < 3; i++) marker(ctx, ds.x + 82 + i * 18, y + 6, i < n ? 1 : 0, 5.5);
  });

  labeledValue(ctx, L.speed, "Speed", `${sheet.speed} ft`, { size: 15, center: true, weight: 700 });
  hit(L.speed, "origin", "Speed");
  labeledValue(ctx, L.size, "Size", sheet.size || "—", { size: 13, center: true });
  hit(L.size, "origin", "Size");
  labeledValue(ctx, L.initiative, "Initiative", signed(sheet.initiative), { size: 17, center: true, weight: 700 });
  hit(L.initiative, "abilities", "Initiative");
  labeledValue(ctx, L.passive, "Passive Perception", sheet.passivePerception, { size: 17, center: true, weight: 700 });
  hit(L.passive, "abilities", "Passive Perception");

  // ----- Abilities (two columns) -----
  const colBottoms = ABILITY_COLUMNS.map((ids, ci) => {
    const col = ci === 0 ? L.colLeft : L.colMid;
    let y = col.y;
    for (const id of ids) {
      const h = abilityBlock(ctx, sheet, id, col.x, y, col.w);
      hit({ x: col.x, y, w: col.w, h }, "abilities", ABILITY_NAMES[id]);
      y += h + 8;
    }
    return y;
  });

  // ----- Training (under the left column) -----
  const tr = { ...L.training, y: colBottoms[0], h: 1070 - colBottoms[0] };
  const ti = box(ctx, tr, "Equipment Training & Proficiencies");
  caption(ctx, "Armor Training", ti.x, ti.y);
  ARMOR_TRAINING.forEach(([id, label], i) => {
    const x = ti.x + (i % 2) * 88;
    const y = ti.y + 12 + Math.floor(i / 2) * 15;
    checkbox(ctx, x, y, 9, sheet.training.armor.includes(id));
    text(ctx, label, x + 13, y - 1, { size: 9.5 });
  });
  const weaponLabel = (w) => w.replace(/^(\w+):(\w+)$/, (_, a, b) => `${a} (${b})`).replace(/^\w/, (c) => c.toUpperCase());
  const rest = [
    { title: "Weapons", text: sheet.training.weapons.map(weaponLabel).join(", ") || "—" },
    { title: "Tools", text: sheet.training.tools.join(", ") || "—" },
    sheet.training.masteries.length && { title: "Weapon Mastery", text: sheet.training.masteries.join(", ") },
  ].filter(Boolean);
  entries(ctx, rest, { x: ti.x, y: ti.y + 46, w: ti.w, h: ti.h - 46 }, { size: 9 });
  hit(tr, "class", "Training");

  // ----- Resources & senses (under the middle column) -----
  const rs = { x: L.colMid.x, y: colBottoms[1], w: L.colMid.w, h: 1070 - colBottoms[1] };
  if (rs.h > 40) {
    const ri = box(ctx, rs, "Resources, Senses & Defenses");
    const items = [
      ...sheet.resources.map((r) => ({ title: `${r.name}: ${r.max}${r.die ? ` × ${r.die}` : ""}`, text: `${r.recharge === "short" ? "Short or Long Rest" : "Long Rest"}${r.note ? `; ${r.note}` : ""}` })),
      ...sheet.classDCs.map((d) => ({ title: `${d.name}: ${d.value}` })),
      // Class table columns not already shown as a resource (e.g. Martial Arts die, Sneak Attack).
      ...sheet.classTable.filter((c) => c.value && !sheet.resources.some((r) => r.tableId === c.id))
        .map((c) => ({ title: `${c.name}: ${c.prefix ?? ""}${c.value ?? "–"}${c.unit && c.value ? ` ${c.unit}` : ""}` })),
      Object.keys(sheet.senses).length && { title: "Senses", text: Object.entries(sheet.senses).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)} ${v} ft`).join(", ") },
      sheet.resistances.length && { title: "Resistances", text: sheet.resistances.join(", ") },
    ].filter(Boolean);
    const fit = entries(ctx, items, ri, { size: 9 });
    if (fit < items.length) flow.sections.push({ title: "Resources (continued)", items: items.slice(fit) });
    hit(rs, "class", "Resources");
  }

  // ----- Right column -----
  weaponsTable(ctx, sheet, flow);
  hit(L.weapons, "equipment", "Weapons");

  const byKind = (...kinds) => sheet.features.filter((f) => kinds.includes(f.kind));
  // Chosen options (Divine Order, lineages, invocations…) go with the step they were picked in.
  const options = (step) => byKind("option").filter((f) => f.step === step);
  const classItems = [...byKind("class", "subclass"), ...options("class")].map((f) => ({ title: f.level ? `${f.name} (L${f.level})` : f.name, text: f.text }));
  featureBox(ctx, L.features, "Class Features", classItems, flow);
  hit(L.features, "class", "Class Features");
  featureBox(ctx, L.species_traits, "Species Traits", [...byKind("species"), ...options("origin")].map((f) => ({ title: f.name, text: f.text })), flow);
  hit(L.species_traits, "origin", "Species Traits");
  featureBox(ctx, L.feats, "Feats", byKind("feat").map((f) => ({ title: f.name, text: f.text })), flow);
  hit(L.feats, "origin", "Feats");
}
