// PNG download (one file per page) and a print view (one sheet page per printed page).
import { paintSheet } from "./renderer.js";

const EXPORT_SCALE = 3; // 2550 × 3300 px per page (300 dpi on US Letter)

const baseName = (sheet) => (sheet.name || "character").replace(/[^\w-]+/g, "_");

export async function downloadPNG(sheet) {
  const pages = paintSheet(sheet, { scale: EXPORT_SCALE });
  for (const [i, { canvas }] of pages.entries()) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${baseName(sheet)}-page-${i + 1}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
}

export function printSheet(sheet) {
  const pages = paintSheet(sheet, { scale: EXPORT_SCALE });
  const holder = document.createElement("div");
  holder.id = "print-pages";
  for (const { canvas } of pages) {
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.alt = "";
    holder.append(img);
  }
  document.body.append(holder);
  const cleanup = () => {
    holder.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  // Let the images decode before the print dialog snapshots the page.
  Promise.all([...holder.querySelectorAll("img")].map((img) => img.decode())).then(() => window.print());
}
