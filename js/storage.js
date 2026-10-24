// localStorage autosave + JSON export/import.
import { createCharacter, STATE_VERSION } from "./state.js";

const KEY = "dnd2024.character";

// Fills in fields missing from older saves with current defaults (plain objects merge, arrays replace).
export function migrate(data) {
  const merge = (base, over) => {
    if (Array.isArray(base) || typeof base !== "object" || base === null) return over === undefined ? base : over;
    const out = { ...base };
    for (const [k, v] of Object.entries(over ?? {})) out[k] = k in base ? merge(base[k], v) : v;
    return out;
  };
  return { ...merge(createCharacter(), data), version: STATE_VERSION };
}

export function loadCharacter() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveCharacter(ch) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ch));
  } catch {
    // Storage full or blocked: the app keeps working, it just won't survive a reload.
  }
}

export function exportJSON(ch) {
  const blob = new Blob([JSON.stringify(ch, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(ch.details.name || "character").replace(/[^\w-]+/g, "_")}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export async function importJSON(file) {
  const data = JSON.parse(await file.text());
  if (typeof data !== "object" || data === null || !("classId" in data)) throw new Error("Not a character file.");
  return migrate(data);
}
