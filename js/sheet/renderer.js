// Paints the sheet onto canvases (HiDPI aware) and wires click-to-jump hit regions.
import { PAGE_W, PAGE_H, INK } from "./draw.js";
import { drawPage1 } from "./page1.js";
import { drawPage2, drawContinuation, hasOverflow } from "./page2.js";

function newPage(canvas, scale) {
  canvas.width = Math.round(PAGE_W * scale);
  canvas.height = Math.round(PAGE_H * scale);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = INK.paper;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);
  return ctx;
}

// Paints all pages at `scale` device pixels per page unit.
// Returns [{ canvas, hits: [{ x, y, w, h, step, label }] }]; a 3rd page appears only for overflow.
export function paintSheet(sheet, { scale = 1, spellStep = "spells", makeCanvas = () => document.createElement("canvas") } = {}) {
  const flow = { sections: [], spells: [], attacks: [] };
  const pages = [];
  const page = (draw) => {
    const canvas = makeCanvas();
    const hits = [];
    const hit = (rect, step, label) => step && hits.push({ ...rect, step, label });
    draw(newPage(canvas, scale), hit);
    pages.push({ canvas, hits });
  };
  page((ctx, hit) => drawPage1(ctx, sheet, hit, flow));
  page((ctx, hit) => drawPage2(ctx, sheet, hit, flow, spellStep));
  if (hasOverflow(flow)) page((ctx) => drawContinuation(ctx, sheet, flow));
  return pages;
}

// Renders the sheet into `container`, re-painting on resize. onJump(step) is called on clicks.
// Returns a dispose function.
export function mountSheet(container, sheet, { onJump, spellStep }) {
  let canvases = [];
  const paint = () => {
    const width = Math.min(container.clientWidth || PAGE_W, PAGE_W);
    const scale = (width / PAGE_W) * (window.devicePixelRatio || 1);
    const pages = paintSheet(sheet, { scale, spellStep });
    canvases = pages.map(({ canvas, hits }, i) => {
      canvas.className = "sheet-page";
      canvas.style.width = `${width}px`;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `Character sheet page ${i + 1}`);
      const at = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * PAGE_W;
        const y = ((e.clientY - rect.top) / rect.height) * PAGE_H;
        return hits.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
      };
      canvas.addEventListener("mousemove", (e) => {
        const h = at(e);
        canvas.style.cursor = h ? "pointer" : "default";
        canvas.title = h ? `${h.label} — click to edit` : "";
      });
      canvas.addEventListener("click", (e) => {
        const h = at(e);
        if (h) onJump(h.step);
      });
      return canvas;
    });
    container.replaceChildren(...canvases);
  };

  // Re-paint when the container width changes. ResizeObserver doesn't deliver in background tabs,
  // so also check once right after the container has been inserted into the page.
  let lastWidth = container.clientWidth;
  const refit = () => {
    if (!container.isConnected || container.clientWidth === lastWidth) return;
    lastWidth = container.clientWidth;
    paint();
  };
  const observer = new ResizeObserver(refit);
  observer.observe(container);
  setTimeout(refit, 0);
  paint();
  return () => observer.disconnect();
}
