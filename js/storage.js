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

const download = (data, name) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name.replace(/[^\w-]+/g, "_")}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

export function exportJSON(ch) {
  download(ch, ch.details.name || "character");
}

export async function importJSON(file) {
  const data = JSON.parse(await file.text());
  if (typeof data !== "object" || data === null || !("classId" in data)) throw new Error("Not a character file.");
  return migrate(data);
}

// Campaign content only (the character's `custom` entries), to share with the rest of the table.
const CUSTOM_FORMAT = "dnd2024.custom";
const CUSTOM_KINDS = ["feats", "spells", "items", "backgrounds", "species"];

export function exportCustom(custom) {
  download({ format: CUSTOM_FORMAT, ...custom }, "campaign-content");
}

// Accepts a campaign-content file or a whole character file; returns { feats: [], spells: [], ... }.
export async function importCustom(file) {
  const data = JSON.parse(await file.text());
  const source = data?.format === CUSTOM_FORMAT ? data : data?.custom;
  if (typeof source !== "object" || source === null) throw new Error("No custom content in this file.");
  return Object.fromEntries(CUSTOM_KINDS.map((k) => [k, Array.isArray(source[k]) ? source[k] : []]));
}
