# D&D 2024 Character Builder — Plan

Single-page vanilla JS app (ES modules, no framework, no build step) for step-by-step
character creation under the 2024 Player's Handbook rules. Output: every field of the
2024 character sheet, drawn on `<canvas>`. Personal, non-commercial use.

## Decisions so far

| Topic | Decision |
|---|---|
| Rules scope | **2024 Player's Handbook** (not SRD-only) |
| Data source | https://dnd2024.wikidot.com/ |
| What gets copied exactly | All mechanics: numbers, dice, ranges, durations, components, proficiencies, tables, feature names/levels, equipment stats |
| Long description text | Short summary in own words (fits the sheet's notes column). Each entry has a `text` field where you can paste full text yourself; saved in your library |
| Calculations | Official 2024 rules. Test case uses **Initiative +5** (DEX +3, Alert + prof +2) |
| Custom entries | Supported for homebrew / other books (background, feat, spell, item) |
| Multiclassing | Out of scope for now |
| Tests | Plain `node --test` (Node 24 installed) |

## File structure

```
index.html                  app shell: step nav, wizard panel, sheet panel
css/app.css                 wizard UI + @media print rules
js/
  main.js                   bootstrap, router (step <-> URL hash), autosave hook
  state.js                  character object, load/save, events, derive()
  rules.js                  pure calc functions (no DOM, no state import)
  validate.js               per-step required-choice checks + review warnings
  storage.js                localStorage autosave, JSON export/import
  data/
    index.js                merges PHB data + custom entries into one registry
    classes/                one file per class (12), incl. its 4 subclasses
    species.js              10 species + lineages
    backgrounds.js          16 backgrounds
    feats.js                origin, general, fighting style, epic boon
    spells.js
    equipment.js            weapons (+ mastery), armor, gear, tools, packs
    languages.js
    skills.js               18 skills -> ability; ability list
  steps/
    step-class.js  step-origin.js  step-abilities.js  step-alignment.js
    step-details.js  step-spells.js  step-equipment.js  step-review.js
    widgets.js              shared pickers (choose N from list, radio, ...)
    custom-entry.js         form for user-defined entries
  sheet/
    renderer.js             HiDPI canvas setup, pages, click hit-regions
    draw.js                 primitives: box, label, wrapped text, checkbox, pips
    layout.js               field rectangles for page 1 & 2 (pure data)
    page1.js  page2.js      fill layout with derived values
    export.js               PNG download + print view
tests/
  rules.test.js
  monk.test.js              Human Monk test case end-to-end through derive()
```

## Core design

- `character` stores **only player choices**. All sheet values come from
  `derive(character, registry)`, so nothing is stored that can go stale when you go
  back and change a choice.
- Data entries describe mechanics as **effects**, so `rules.js` stays generic
  (no `if (class === "monk")` scattered around).
- The canvas renderer reads only the derived sheet object. Each layout field knows
  its wizard step, so clicking it jumps back there.

## Data schema

### Effect (used by class features, species traits, feats)

```js
{ type: "prof",      category: "skill"|"save"|"armor"|"weapon"|"tool", ids: [...] }
{ type: "choose",    category: "skill"|"tool"|"language"|"feat"|"ability",
                     count: 2, from: [...] | "any", key: "monk.skills" }
{ type: "expertise", count: 2, from: "proficient", key: "..." }
{ type: "acFormula", base: 10, add: ["dex","wis"], noArmor: true, noShield: true }
{ type: "bonus",     target: "initiative"|"hpPerLevel"|"speed"|"passive.perception",
                     value: 2 | "prof" | "abilityMod:con" }
{ type: "speed", value: 30 }   { type: "size", value: "Medium" | ["Small","Medium"] }
{ type: "resource",  id: "focus", name: "Focus Points", max: "level" | { table: "focus" },
                     recharge: "short" }
{ type: "spellcasting", ability: "wis", ... }
{ type: "text" }               // descriptive only
```

### Class

```js
{
  id: "monk", name: "Monk", hitDie: 8, primary: ["dex","wis"],
  saves: ["str","dex"],
  armor: [], weapons: ["simple", "martial:light"], tools: { choose: 1, from: [...] },
  skills: { count: 2, from: ["acrobatics","athletics","history","insight","religion","stealth"] },
  equipment: { A: [{ item: "spear", qty: 1 }, ...], B: { gp: 50 } },
  subclassLevel: 3,
  table: { 1: { martialArts: "1d6", focus: 0, unarmoredMove: 0 }, ... },
  features: [ { id, level, name, text, effects: [...] }, ... ],
  spellcasting: null | { ability, type: "full"|"half"|"pact", cantrips: {...},
                         prepared: {...}, list: "wizard" },
  subclasses: [ { id, name, features: [...] } ],
  source: "PHB 2024"
}
```

Spell slots come from shared full / half / pact tables in `rules.js`.

### Background

```js
{ id: "sailor", name: "Sailor", abilities: ["str","dex","wis"],
  skills: ["acrobatics","perception"], tool: "navigators-tools", feat: "tavern-brawler",
  equipment: { A: [dagger, navigator's tools, rope, traveler's clothes, 20 GP], B: { gp: 50 } },
  source: "PHB 2024" }
```

### Species

`{ id, name, type, size, speed, traits: [{ id, name, text, effects }], lineages?: [...] }`
— e.g. Human: Resourceful (Heroic Inspiration on Long Rest), Skillful (choose 1 skill),
Versatile (choose 1 Origin feat), size Small or Medium, speed 30.

### Feat

`{ id, name, category: "origin"|"general"|"fighting-style"|"epic", prereq?, repeatable?, effects }`
— e.g. Alert: origin, `{ type: "bonus", target: "initiative", value: "prof" }` + Initiative Swap (text).

### Spell

`{ id, name, level, school, castingTime, range, components: { v, s, m: "text"|null },
materialCost?, duration, concentration, ritual, classes: [...], text,
damage?: { dice, type, scaling }, save?: "dex", attack?: true }`

### Item

`{ id, name, kind: "weapon"|"armor"|"shield"|"gear"|"tool"|"pack", cost, weight, ... }`
- weapon: `{ category, damage, damageType, properties, mastery }`
- armor: `{ armorType, ac, dexCap, strReq, stealthDis }`

### Character (saved state)

```js
{
  version: 1,
  classId, level, subclassId, xp,
  choices: { "monk.skills": ["insight","stealth"], "human.skillful": ["athletics"],
             "human.versatile": ["alert"] },          // keyed by effect.key
  equipmentOption: { class: "A", background: "A" },
  backgroundId, speciesId, lineageId, size,
  abilityMethod: "standard"|"pointbuy"|"roll",
  baseScores: { str, dex, con, int, wis, cha }, rolls?: [...],
  bgBoosts: { dex: 2, wis: 1 },
  languages: ["common", ...],
  alignment,
  details: { name, appearance, personality, ideals, bonds, flaws, backstory },
  spells: { cantrips: [...], prepared: [...] },
  inventory: [{ itemId, qty, equipped, attuned }], coins: { cp, sp, ep, gp, pp },
  play: { hpCurrent, hpTemp, hitDiceSpent, deathSaves: { s, f }, slotsExpended: {...},
          heroicInspiration, shieldEquipped },
  custom: { backgrounds: [], feats: [], spells: [], items: [] }
}
```

### Derived sheet (output of `derive`)

Every sheet field: `abilities[x].{score, mod, save, saveProf}`, `skills[x].{mod, prof,
expertise}`, `ac`, `hpMax`, `initiative`, `passivePerception`, `profBonus`, `speed`,
`size`, `hitDice`, `attacks[]`, `features[]`, `training`, `spellcasting.{ability, mod,
dc, attack, slots}`, `spellList[]`, `resources` (Martial Arts die, Focus Points,
Unarmored Movement), languages, equipment, attunement, coins, details.

## Wizard steps (2024 order)

1. **Class** — class, level 1–20, subclass (level 3+), skills, equipment A/B, features per level
2. **Origin** — background (+2/+1 or +1/+1/+1, skills, tool, origin feat, equipment/50 GP),
   species (traits, size, speed, choices), languages (Common + 2)
3. **Ability scores** — Standard Array / Point Buy 27 / Roll 4d6 drop lowest; apply boosts; max 20
4. **Alignment**
5. **Details** — name, appearance, personality, backstory
6. **Spells** (casters only) — cantrips + prepared per class table
7. **Equipment & coins**
8. **Review** — full canvas sheet + validation warnings

Each step shows only valid choices, blocks "Next" until required choices are made, and
keeps data when going back.

## Test case (monk.test.js)

Human Monk level 1, Sailor background.
- Standard array: STR 12, DEX 15, CON 13, INT 10, WIS 14, CHA 8
- Sailor boosts +2 DEX, +1 WIS -> DEX 17, WIS 15
- Skills: Acrobatics, Perception (Sailor), Insight, Stealth (Monk), Athletics (Human Skillful)
- Feats: Tavern Brawler (Sailor), Alert (Human Versatile)

Expected (official rules):

| Field | Value | Why |
|---|---|---|
| AC | 15 | 10 + DEX 3 + WIS 2 (Unarmored Defense) |
| HP | 9 | d8 max 8 + CON 1 |
| Initiative | **+5** | DEX 3 + prof 2 (Alert) |
| Proficiency | +2 | level 1 |

## Build order

1. ~~Propose structure + schema~~ (this document)
2. ~~`rules.js` + `state.js` + tests, with data for the test case first~~
3. ~~Remaining PHB data: classes/subclasses, species, backgrounds, feats, equipment, spells~~
   (spell descriptions/damage notes still empty — `text`/`notes` fields)
4. ~~Wizard steps~~ — run with `node serve.mjs` and open http://localhost:8080
5. ~~Canvas sheet~~ (page 1 core/combat/skills/weapons/features; page 2 spells/details/equipment;
   page 3 only for overflow), HiDPI, text wrapping, click-to-jump, PNG export + print view
