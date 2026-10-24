// Canvas drawing primitives for the character sheet. All coordinates are in page units
// (PAGE_W × PAGE_H); the renderer scales the context for screen DPI or export resolution.

export const PAGE_W = 850;
export const PAGE_H = 1100;

export const INK = {
  paper: "#fffdf8",
  ink: "#231d19",
  line: "#7d6e5e",
  faint: "#d9cdb9",
  fill: "#f4ede1",
  label: "#6f6152",
  accent: "#8c2f1f",
};

const FAMILY = {
  head: "Georgia, 'Times New Roman', serif",
  body: "'Segoe UI', system-ui, -apple-system, Arial, sans-serif",
};

export function setFont(ctx, size, { weight = 400, family = "body", italic = false } = {}) {
  ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${FAMILY[family]}`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Bordered box with a small-caps label. Returns the inner content rect (below the label).
export function box(ctx, r, label, { fill = INK.paper, radius = 6, labelPos = "top" } = {}) {
  ctx.save();
  roundRect(ctx, r.x, r.y, r.w, r.h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = INK.line;
  ctx.stroke();
  ctx.restore();
  if (!label) return { x: r.x + 6, y: r.y + 5, w: r.w - 12, h: r.h - 10 };
  if (labelPos === "bottom") {
    caption(ctx, label, r.x + r.w / 2, r.y + r.h - 11, { align: "center" });
    return { x: r.x + 6, y: r.y + 4, w: r.w - 12, h: r.h - 18 };
  }
  caption(ctx, label, r.x + 7, r.y + 5);
  return { x: r.x + 7, y: r.y + 18, w: r.w - 14, h: r.h - 23 };
}

// Small uppercase label.
export function caption(ctx, str, x, y, { align = "left", color = INK.label, size = 7.5 } = {}) {
  setFont(ctx, size, { weight: 600 });
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0.6px";
  ctx.fillText(str.toUpperCase(), x, y);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

// Single line of text, shrunk (down to minSize) and then ellipsized to fit maxW.
export function text(ctx, str, x, y, { size = 11, minSize = 7, maxW = Infinity, weight = 400, family = "body", align = "left", color = INK.ink, italic = false } = {}) {
  str = String(str ?? "");
  let s = size;
  setFont(ctx, s, { weight, family, italic });
  while (ctx.measureText(str).width > maxW && s > minSize) setFont(ctx, (s -= 0.5), { weight, family, italic });
  if (ctx.measureText(str).width > maxW) {
    while (str.length > 1 && ctx.measureText(`${str}…`).width > maxW) str = str.slice(0, -1);
    str += "…";
  }
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(str, x, y);
  return s;
}

// Breaks text into lines no wider than maxW (current font). Respects "\n".
export function wrap(ctx, str, maxW) {
  const lines = [];
  for (const para of String(str ?? "").split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= maxW || !line) line = next;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

// Wrapped paragraph inside rect r, shrinking the font from size to minSize until it fits.
// Lines that still don't fit are dropped; returns true if everything fit.
export function paragraph(ctx, str, r, { size = 10, minSize = 7, color = INK.ink, lineHeight = 1.25 } = {}) {
  let s = size;
  let lines;
  for (;;) {
    setFont(ctx, s);
    lines = wrap(ctx, str, r.w);
    if (lines.length * s * lineHeight <= r.h || s <= minSize) break;
    s -= 0.5;
  }
  const max = Math.floor(r.h / (s * lineHeight));
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.slice(0, max).forEach((line, i) => ctx.fillText(line, r.x, r.y + i * s * lineHeight));
  return lines.length <= max;
}

// List of { title, text } entries (bold title, then text) in rect r with a shared shrinking font.
// Returns the index of the first entry that didn't fit (entries.length when all fit).
export function entries(ctx, items, r, { size = 9.5, minSize = 7, lineHeight = 1.22, gap = 4, bold = true } = {}) {
  const titleWeight = bold ? 700 : 400;
  const layout = (s) => {
    let y = 0;
    const placed = [];
    for (const it of items) {
      setFont(ctx, s, { weight: titleWeight });
      const head = wrap(ctx, it.title, r.w);
      setFont(ctx, s);
      const body = it.text ? wrap(ctx, it.text, r.w) : [];
      const h = (head.length + body.length) * s * lineHeight;
      if (y + h > r.h) break;
      placed.push({ head, body, y });
      y += h + gap;
    }
    return placed;
  };
  let s = size;
  let placed = layout(s);
  while (placed.length < items.length && s > minSize) placed = layout((s -= 0.5));
  ctx.fillStyle = INK.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  for (const p of placed) {
    let y = r.y + p.y;
    setFont(ctx, s, { weight: titleWeight });
    for (const line of p.head) {
      ctx.fillText(line, r.x, y);
      y += s * lineHeight;
    }
    setFont(ctx, s);
    for (const line of p.body) {
      ctx.fillText(line, r.x, y);
      y += s * lineHeight;
    }
  }
  return placed.length;
}

// Height of each entry at a fixed font size (for stacking boxes to fit their content).
export function measureEntries(ctx, items, w, { size = 9, lineHeight = 1.22, gap = 4 } = {}) {
  return items.map((it) => {
    setFont(ctx, size, { weight: 700 });
    const head = wrap(ctx, it.title, w).length;
    setFont(ctx, size);
    const body = it.text ? wrap(ctx, it.text, w).length : 0;
    return (head + body) * size * lineHeight + gap;
  });
}

export function checkbox(ctx, x, y, size, checked) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = INK.line;
  ctx.fillStyle = INK.paper;
  ctx.fillRect(x, y, size, size);
  ctx.strokeRect(x, y, size, size);
  if (checked) {
    ctx.fillStyle = INK.ink;
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
  }
  ctx.restore();
}

// Proficiency marker: empty circle, filled circle (proficient) or filled diamond (expertise).
export function marker(ctx, cx, cy, level, r = 3.6) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = INK.line;
  ctx.fillStyle = level ? INK.ink : INK.paper;
  ctx.beginPath();
  if (level === 2) {
    ctx.moveTo(cx, cy - r - 1);
    ctx.lineTo(cx + r + 1, cy);
    ctx.lineTo(cx, cy + r + 1);
    ctx.lineTo(cx - r - 1, cy);
    ctx.closePath();
  } else {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function hline(ctx, x1, x2, y, color = INK.faint) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

// Heater-shield outline for Armor Class.
export function shield(ctx, r) {
  const { x, y, w, h } = r;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + 8);
  ctx.quadraticCurveTo(x + w / 2, y - 4, x + w, y + 8);
  ctx.lineTo(x + w, y + h * 0.55);
  ctx.quadraticCurveTo(x + w, y + h * 0.85, x + w / 2, y + h);
  ctx.quadraticCurveTo(x, y + h * 0.85, x, y + h * 0.55);
  ctx.closePath();
  ctx.fillStyle = INK.fill;
  ctx.fill();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = INK.line;
  ctx.stroke();
  ctx.restore();
}

export const signed = (n) => (n == null ? "" : n >= 0 ? `+${n}` : `${n}`);
