# D&D 2024 Character Builder

A step-by-step character builder for the 2024 *Player's Handbook* rules. It runs in the browser
with plain JavaScript (ES modules, no framework, no build step) and draws a finished character
sheet on `<canvas>` that you can download as PNG or print. Hosted on Github Pages.

You can try it here https://electro-saiyan.github.io/dnd-character-builder-2024/

Personal, non-commercial tool. See [Content & attribution](#content--attribution).

## Quick start

Requires [Node.js](https://nodejs.org/) 18+ (only for the tiny static server and the tests).

```bash
node serve.mjs
```

Open http://localhost:8080. Any static file server works too — the app just needs to be served
over HTTP (ES modules don't load from `file://`).

Run the tests:

```bash
node --test
```

## Using the builder

The wizard follows the 2024 creation order. Every step can be opened from the sidebar at any
time; **Next** stays disabled until the current step is complete, and the missing item is shown
next to it.

| Step | What you choose |
|---|---|
| **Class** | Class, level 1–20, subclass (3rd+), skills, tools, Expertise, options (Divine Order, Fighting Style, …), ASI/feats, Weapon Mastery, Invocations, Metamagic, Maneuvers, starting equipment A/B/C |
| **Origin** | Background (+2/+1 or +1/+1/+1 boosts, origin feat, equipment), species (size, lineage, trait choices), Common + 2 languages |
| **Ability Scores** | Standard Array, Point Buy (27), Roll (4d6 drop lowest) or Manual entry |
| **Alignment** | One of the nine alignments |
| **Details** | Name, XP, appearance, personality, ideals, bonds, flaws, backstory |
| **Spells** | Casters and anyone with spell picks: cantrips, prepared spells, Wizard spellbook, spells from feats/features |
| **Equipment** | Inventory (quantity, equip, attune), add items, coins |
| **Review** | Checklist with warnings + the canvas character sheet |

**Custom** (in the sidebar, under Home) holds content your DM invented for the campaign:
feats, spells, items (weapons, armor, shields, tools, gear/magic items), backgrounds and
species. They appear in the regular steps next to the official options. A custom feat can also
be ticked as *granted to this character* for boons the DM hands out outside the normal feat
slots. Custom content is kept when you start a new character, and **Export / Import campaign
content** shares it with the rest of the table.

Only valid options are offered: feat prerequisites, invocation prerequisites, spell levels you
have slots for, and duplicate skill/tool/language proficiencies are blocked.

**Saving:** the character autosaves in the browser (`localStorage`). Use **Export JSON** /
**Import JSON** in the top bar to keep files or move between browsers. **New character**
replaces the current one.

### The character sheet

- **Page 1:** header, AC, HP, Hit Dice, death saves, initiative, speed, size, passive
  Perception, proficiency bonus, Heroic Inspiration, abilities with saves and skills
  (● proficient, ◆ Expertise), training, resources/senses/resistances, weapons & damage
  cantrips, class features, species traits, feats.
- **Page 2:** spellcasting ability/DC/attack, slots 1–9, spell table (C/R/M), appearance,
  backstory & personality, alignment, languages, equipment, attunement, coins.
- **Page 3** (only when needed): anything that didn't fit, plus the Wizard spellbook.

Click any field on the sheet to jump to the step that sets it. **Download PNG** saves one
300 dpi image per page; **Print / Save as PDF** prints one sheet page per paper page.

## What's calculated

All numbers are derived from your choices, never stored:

- Ability modifiers, proficiency bonus, saves, skills (incl. Expertise, Jack of All Trades),
  passive Perception, initiative (Alert, Gloom Stalker…)
- HP (max die at 1st, then average + CON; Tough, Dwarven Toughness, Draconic Resilience…)
- AC from armor, shields and Unarmored Defense (Monk, Barbarian, Dance Bard, Draconic
  Sorcerer), Defense, Medium Armor Master; Shield needs training
- Speed (Unarmored Movement, Fast Movement, Roving, heavy-armor STR penalty…)
- Attacks: weapons (proficiency, finesse, Martial Arts die, Archery), Unarmed Strike,
  damaging cantrips scaled by level, Breath Weapon, Psychic Blades
- Spell save DC, attack bonus, slots for full / half / third casters and Pact Magic
- Class resources (Rage, Focus, Channel Divinity, Sorcery Points, Superiority Dice, …),
  class/subclass save DCs, senses, resistances

## Project structure

```
index.html            app shell
css/app.css           UI styles (light/dark) + print rules
serve.mjs             zero-dependency static server
js/
  main.js             bootstrap, hash router, step navigation, live summary
  home.js, custom.js  pages outside the wizard: home, campaign content editor
  state.js            character object (choices only) + derive() -> every sheet value
  rules.js            pure calculations (modifiers, HP, AC, slots, point buy, …)
  choices.js          option lists for each choice + pick validation
  validate.js         per-step errors (block Next) and warnings
  storage.js          localStorage autosave, JSON export/import
  data/               rules data: classes/, subclasses/, species, backgrounds, feats,
                      equipment, spells, options (invocations/metamagic/maneuvers), …
  steps/              one module per step + shared widgets
  sheet/              canvas sheet: draw primitives, layout, page 1/2, renderer, export
tests/                node:test suites (rules, classes, origins, equipment, spells, wizard)
```

### How the data works

The saved character (`createCharacter()` in `js/state.js`) holds **only the player's
choices** — class, level, background, picks keyed by choice, scores, inventory, details.
`derive(character, registry)` turns those into the full sheet, so nothing can go stale.

Features, traits and feats describe their mechanics as **effects**, which `derive()` applies
generically, for example:

```js
{ type: "acFormula", base: 10, add: ["dex", "wis"], noArmor: true, noShield: true }
{ type: "bonus", target: "initiative", value: "prof" }
{ type: "choose", category: "skill", from: ["insight", "perception", "survival"], count: 1, key: "elf.keenSenses" }
{ type: "resource", id: "rage", name: "Rage", max: { table: "rages" }, recharge: "long" }
{ type: "spell", byLevel: { 3: ["bless"], 5: ["revivify"] }, alwaysPrepared: true }
```

The full list of effect types is easiest to read in `derive()` (`js/state.js`).

### Custom entries

`createRegistry(custom)` (in `js/data/index.js`) merges user-defined backgrounds, feats,
spells, items and species over the built-ins by id; the character's `custom` field is passed
in automatically. The Custom page (`js/custom.js`) edits them: each entry keeps its raw form
values in `form` so it can be edited again. Hand-written entries in the same shapes as the
built-in data work too (add them to the JSON under `custom` and re-import). Feats listed in the
character's `boons` are applied as if granted by a feature.

Spells outside the 2024 PHB (present on the source wiki) are kept in `js/data/spells.js` but
excluded by default; `createRegistry({}, { allSources: true })` includes them.

## Known limitations

- Feature and spell descriptions are short summaries; spell entries have no full text or
  damage notes (except damaging cantrips). You can add your own text via custom entries.
- Single class only (no multiclassing).
- The Wizard spellbook holds the free spells from leveling; extra spells copied from scrolls
  aren't supported yet.
- Some situational features (e.g. Rage damage, Pact of the Blade using CHA) appear as text
  rather than changing numbers.
- Play-time fields (current HP, spent Hit Dice, death saves, expended slots, Heroic
  Inspiration) are drawn on the sheet but have no editing UI yet.

## Content & attribution

Rules data is summarized from the 2024 *Player's Handbook* via
[dnd2024.wikidot.com](https://dnd2024.wikidot.com/). Mechanics (numbers, dice, ranges,
proficiencies) are recorded as facts; feature text is paraphrased, not copied. This project
is for personal, non-commercial use and is not affiliated with Wizards of the Coast.
Dungeons & Dragons is a trademark of Wizards of the Coast.
