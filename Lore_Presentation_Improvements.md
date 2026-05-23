# YoHoH — Lore Presentation Improvements

**Document status:** Review of the expanded `LORE.md` (now ~1,580 lines with new Second / Third / Current Age content) against the current `docs/index.html` pitch-deck rendering and the `scripts/extract-lore.js` pipeline that feeds it. Recommendations for layout fixes, extractor gaps, and a phased plan to surface the new content properly.
**Last updated:** 2026-05-22
**Companion docs:** [LORE.md](LORE.md) (canonical source), [docs/index.html](docs/index.html) (pitch deck), [docs/LOREBOOK.html](docs/LOREBOOK.html) (standalone lorebook), [scripts/extract-lore.js](scripts/extract-lore.js) (data pipeline)

> Scope: anything that renders or extracts player-facing lore — the docs pitch deck's story slides, the king slides, the standalone Lorebook, and the `extract-lore.js` JSON output that feeds both.

---

## 1. What changed in `LORE.md`

The lore is no longer a single-cataclysm story; it's now a four-Age epic. The key additions:

| Section (new H2 in LORE.md) | Lines | What it adds |
|---|---|---|
| Ages-of-the-World table (under `## The World:`) | 17-24 | First-class Age framework (First / Cataclysm / Second / Collapse / Third / Current) with dominant-power column |
| **The Second Age: The Age of the Drowned Crown** | 388-437 | Atlantis-as-empire era + Adara's inheritance |
| **The Corruption of the Deep** | 439-461 | Sets up serpent + kraken corruption — feeds Mordekai + Nimue |
| **The Unbinding Tide** | 463-503 | Collapse of Atlantean infrastructure + Legacy sub-section |
| **The Third Age: The Age of Free Sails** | 505-532 | Pirate prosperity era + foreshadows Ebon |
| **Ebon's Glory and the Ashen Turn** | 534-613 | Ebon's hero-to-villain arc + Blackfang origin |
| **The Current Age: The Age of Five Crowns** | 615-655 | Kings-as-consequences table mapping each King → their historical wound |
| **Suggested Historical Reveal Questline: The Ages of the Sea** | 1372-1414 | 7 historical-reveal quests parallel to the Jasper questline |
| **Appendix: Historical Timeline** | 1430-1450 | Full era / event / notes timeline table |
| **Appendix: Faction Interpretations of History** | 1481-1493 | 9-row faction-vs-history matrix |
| **Appendix: Future Story Hooks / TODOs** | 1497-1554 | Design notes: Ebon tutorial, Blackfang arc, Second Drowning |
| Updated **Appendix: Key Terms** | 1454-1477 | New terms: Drowned Crown, Corruption of the Deep, Unbinding Tide, Ashen Prosperity, Blackfang, Dragonfire Spirit, Ashen Turn, Tidewardens, Dawnrest, Second Drowning |
| Updated **Appendix: Internal Truth Summary** | 1558-1582 | Expanded to cover all Ages — the canonical timeline for writer reference |

Net effect: the lore has doubled in narrative weight, but the pitch deck still renders the **pre-expansion structure** — 6 fixed story slides + 5 king slides — so 90% of the new material is reachable only by opening the Lorebook chapter modal one chapter at a time.

---

## 2. Audit — what the extractor misses

`scripts/extract-lore.js` builds `lore.json` from `LORE.md`. The new H2 sections are partially captured (`extractLoreBook()` is generic and grabs every H2 as a chapter), but the **dedicated extractors miss the new content** because they use hard-coded regex lists that haven't been updated.

### 2.1 🔴 `extractStory()` regex list is frozen at the old beats

[scripts/extract-lore.js:189-201](scripts/extract-lore.js)

```js
const res = [
  /^Story \/ Lore:/,
  /^The Atlantean Hunger$/,
  /^Admiral Barrow's Betrayal$/,
  /^Jasper Barrow and the False Treason$/,
  /^Aurelion's Dive$/,
  /^The Crown Below Ritual$/,
  /^Jasper's Binding$/,
  /^The Crown Below: The Wound That Still Pulses$/,
  /^Public Rumours vs\. Hidden Truth$/,
];
```

These are the **First-Age-only** beats. The new beats (Second Age / Corruption / Unbinding / Third Age / Ebon's Glory / Current Age) are entirely absent from `story.sections` and `story.beats`. They survive only as raw chapters in `loreBook.chapters` (which is the generic catch-all).

`beatTitles` immediately after (lines 211-219) hard-codes the same 7 titles — even if we added the new H2s to `res`, they wouldn't appear in the Mythic Timeline slide without also being added to `beatTitles`.

### 2.2 🔴 `extractQuestline()` only finds the Jasper questline

[scripts/extract-lore.js:302-305](scripts/extract-lore.js)

```js
function extractQuestline(md) {
  const block = h2(md, /^Suggested Jasper Questline$/);
  return { ... };
}
```

The new **Suggested Historical Reveal Questline: The Ages of the Sea** (7 historical-reveal quests, lines 1372-1414) is not extracted into its own `lore.historicalQuestline` field. It's buried inside the chapter modal.

### 2.3 🔴 Historical Timeline, Faction Interpretations, Future Hooks not extracted

The script extracts:
- `extractDomains()` (Domain Map appendix)
- `extractTerms()` (Key Terms appendix)
- `extractInternalTruth()` (Internal Truth Summary)

But **three new appendices have no dedicated extractor**:

- **`## Appendix: Historical Timeline`** — a perfectly-structured era / event / notes table that's the ideal data source for a horizontal Ages timeline slide.
- **`## Appendix: Faction Interpretations of History`** — a 9-row matrix that should fuel a "Whose Story Will You Believe?" comparison slide (powerful pitch-deck moment).
- **`## Appendix: Future Story Hooks / TODOs`** — internal design notes; less critical for the deck but useful as a writer's-room view in the Lorebook.

### 2.4 🟠 `extractWorld()` silently drops the Ages-of-the-World table

[scripts/extract-lore.js:185-188](scripts/extract-lore.js)

```js
function extractWorld(md) {
  const block = h2(md, /^The World:/);
  return { title: ..., body: paragraphs(block).join('\n\n'), rumours: bullets(block) };
}
```

`paragraphs()` filters lines starting with `|` (table rows) and lines starting with `-` (bullets). So when the new lore added the `| Age | Common Name | Dominant Power | What It Means |` table inside `## The World:`, the table text is dropped silently. You can see the lossy output in the injected JSON in `docs/index.html` line 2096 — the world `body` has two paragraphs separated by an empty paragraph where the table should be.

The "ages" structure that the entire new lore is built around is **invisible to the data layer**.

### 2.5 🟠 `extractDragons()` drops the bullet list of dragon roles

[scripts/extract-lore.js:232-239](scripts/extract-lore.js)

The "Why Dragons Matter" bullet list (Volcanic dragons / Wind dragons / Frost dragons / Reef dragons / Elder dragons) sits inside `## Dragons:` but `paragraphs()` strips bullet lines, so `dragons.body` is just the intro prose without the per-breed roles.

### 2.6 🟡 `extractReveal()` no longer captures all reveal layers

[scripts/extract-lore.js:298-301](scripts/extract-lore.js)

The reveal layers are picked up via `getH3Sections()` so this should still work — but renderStory in `docs/index.html` does `.slice(0, 5)`. If the lore grows past 5 layers (or if any non-layer H3 sneaks in), they're truncated silently.

### 2.7 🟡 `loreBook` category derivation is brittle

[scripts/extract-lore.js:170-178](scripts/extract-lore.js)

```js
category: b.title.startsWith('Appendix') ? 'Appendix'
  : b.title.includes('Pirate Kings') ? 'Characters'
  : b.title.includes('Dragon') ? 'Dragons'
  : b.title.includes('Lore') || b.title.includes('Crown') || b.title.includes('Barrow') ...
  : 'World',
```

This keyword-soup miscategorises the new sections:

| New chapter | Current category | Should be |
|---|---|---|
| The Second Age | World | Ages / Myth |
| The Corruption of the Deep | World | Myth |
| The Unbinding Tide | World | Myth |
| The Third Age | World | Ages / Myth |
| Ebon's Glory and the Ashen Turn | World | Characters |
| The Current Age | Myth (matches 'Crown') | Ages / World |
| Appendix: Historical Timeline | Appendix | Appendix (✓) |
| Appendix: Faction Interpretations | Appendix | Appendix (✓) |

The Lorebook's chapter grid groups by category, so the miscategorisation creates a confusing taxonomy where most new lore lands in "World" or "Myth" without distinction.

### 2.8 🟡 No `lore.ages` first-class object

The lore is explicitly structured around the Ages but the extractor produces no `lore.ages` field. Building that from the Ages-of-the-World table (fixed 2.4) gives us:

```js
lore.ages = [
  { key: 'first',     label: 'The Age of Three Crowns',  power: 'Humans, Atlanteans, Dragons', summary: 'Balance between Land, Sea, and Sky' },
  { key: 'cataclysm', label: 'The Shattering / The Drowning', power: 'None', summary: 'The Crown Below breaks the old world' },
  { key: 'second',    label: 'The Age of the Drowned Crown', power: 'Atlanteans', summary: 'Atlantis dominates the flooded world' },
  { key: 'collapse',  label: 'The Unbinding Tide',  power: 'Sea Serpents, Krakens, Deep Beasts', summary: 'The deep rebels against Atlantean rule' },
  { key: 'third',     label: 'The Age of Free Sails',  power: 'Pirates, Merchants, Free Captains', summary: 'Trade returns and pirate glory rises' },
  { key: 'current',   label: 'The Age of Five Crowns / Broken Tides', power: 'The Pirate Kings', summary: 'Five powers divide the seas while dragons near extinction' },
];
```

Once that exists, every Age becomes a navigable anchor across the slides + Lorebook + king-card "Historical Wound" badges.

### 2.9 🟡 Tooling output is misleading

The closing console line in `extract-lore.js:387` reports:

```
Extracted N Pirate Kings, M story beats, P lorebook chapters, ...
```

With the expansion this is now wildly under-counting the meaningful payload — no mention of ages, no mention of the new historical questline, no warning that some content fell into "World" by default. Worth surfacing more fields in the summary so the next contributor notices missing extractors.

---

## 3. Audit — what `docs/index.html` doesn't render

The pitch deck has 20 numbered slides. The lore consumes:

| Slide # | Title | Source |
|---|---|---|
| 02 | The Shattered Seas | Static + `lore.world` quote |
| 04 | Dragons of the Shattered Seas | Static + dragon images |
| 05 | The Five Pirate Kings | Static intro |
| 06-10 | (one per King) | `lore.pirateKings[]` via `renderKings()` |
| 11 | The Familiars | Static |
| 13 | The Archipelago | Static |
| — (injected before #02 by `renderStory()`) | 6 story slides | `lore.storyLore`, `lore.loreBook`, `lore.reveal`, `lore.jasperQuestline`, `lore.keyTerms` |

The 6 story slides injected by `renderStory()`:

1. **Cover** — Sundering of the Three Crowns + crown cards
2. **The First Age** — sacred balance + limitation
3. **The Mythic Timeline** — beats split L/R (only the 7 First-Age beats; new Ages absent)
4. **Rumour, Evidence, Truth** — sailor rumours + reveal layers
5. **Jasper's Lore Arc** — Jasper questline + key terms
6. **The Lorebook** — chapter grid linking to the modal

### 3.1 🔴 No dedicated slide for any of the new Ages

The Second Age, Third Age, and Current Age — three of the four major Ages the new lore is built around — have **zero visual prominence in the pitch deck**. They exist only as Lorebook chapters reachable via the chapter-card modal. A reader scrolling the deck would see "First Age + Mythic Timeline (= old beats) + Lorebook grid" and conclude the lore is the same as before.

### 3.2 🔴 The Historical Reveal Questline is invisible

The new 7-quest "Ages of the Sea" reveal path has no extractor (§2.2) and no slide. It's a parallel reveal path to Jasper's questline — they should be presented as two complementary discovery routes.

### 3.3 🔴 Faction Interpretations matrix is unused

The single most pitch-deck-friendly piece of the lore expansion (the 9-faction "how they describe the Ages" matrix) is invisible. A grid slide showing all 9 perspectives side-by-side would communicate "this world has no single truth" in one glance — a powerful pitch beat. Currently it's buried in the Appendix chapter modal.

### 3.4 🔴 Pirate King cards don't surface the new "Historical Wound" framing

The new Current Age table explicitly maps each King to their historical wound:

| King | Historical Wound |
|------|------------------|
| Jasper Barrow | The betrayal that caused the Shattering |
| Adara Thalassa | The failed empire of the Drowned Crown |
| Mordekai Drakon | The human trauma of Atlantean domination and serpent corruption |
| Nimue Tideborn | The freedom and horror of the Unbinding Tide |
| Ebon Flameheart | The pirate prosperity that became dragon genocide |

This is a fantastic one-line summary per King — but the king slides only show theme, alignment, status, mythic role, etc. The wound framing would make each King immediately readable as "I am the consequence of X age".

### 3.5 🟠 Domain Map appendix is extracted but unused

`extractDomains()` produces `lore.domains[]` but `renderStory()` never renders it. The pirate-king slides cover each domain individually but there's no side-by-side comparison view — you can't see "all 5 domains, all hazards, all dragon stances" on a single slide.

### 3.6 🟠 The Mythic Timeline slide reads as "First Age only"

After the expansion, the timeline should be readable as a four-Age epic. The current implementation puts the seven old beats into a two-column timeline and stops. New readers can't tell the story doesn't end at "The Crown Below: The Wound That Still Pulses".

### 3.7 🟠 No Ages overview ribbon / orientation

A reader landing on the deck has no quick way to understand "this world has 4 Ages, here are the names, here's how they relate". An ages overview slide (or a ribbon at the top of every story slide showing First → Second → Third → Current with the current one highlighted) would orient the reader before diving into any specific era.

### 3.8 🟡 The Lorebook chapter grid is now noisy

With the expansion, the chapter grid in slide 6 of the story sub-deck now lists ~17 chapters with miscategorised tags (§2.7). The grid is the player's only entry point into the new Ages — yet they appear scattered under "World" / "Myth" without temporal ordering.

### 3.9 🟡 Slide numbering hardcoded `00` then renumbered

[docs/index.html](docs/index.html) — every story slide has `<span class="slide-number">00</span>` and a `renumberSlides()` call walks all slides and rewrites the number. This works but is fragile — adding a new story slide doesn't automatically respect the static numbering scheme, and rearranging requires hand-editing both `renderStory()` and the static slide IDs.

### 3.10 🟡 Story slides inject BEFORE the static slides

`storyContainer` is positioned in the DOM before the static slides, so after `renderStory()` runs, the deck reads: **story slides (00, 00, 00, ...) → static slides 02-20**. The "01 — Hero" slide is the static first slide but the renumber pass walks all `.slide` elements and assigns sequential numbers, so slide 01 becomes whatever comes first in DOM order. This is currently consistent but tangled — adding a story slide shifts every numbered reference.

### 3.11 🟡 The "Read more" modal duplicates the Lorebook chapter modal

There are two clickable paths into long-form lore from the deck:

- `book-detail-btn` → `openLoreText(title, markdown)` → simple modal
- `chapter-card[data-chapter-id]` → `openLoreChapter(id)` → richer modal with sections

These could be unified (always open the rich chapter modal, scrolled to the relevant detail).

---

## 4. Recommendations — phased plan

Three phases, each independently shippable. The user can pick how deep to go.

> **Status (2026-05-22):** Phase 1, Phase 2, and most of Phase 3 have landed in this pass. Items left intentionally are marked 🟡 with a one-line reason.

### Phase 1 — Extractor parity (one focused session, all mechanical) ✅ LANDED

Brings `lore.json` up to date with the expanded LORE.md. **No UI changes** — just fields the future slides will need.

| # | Item | Status | Where |
|---|---|---|---|
| 1.1 | Add the 6 new H2 sections to the `extractStory()` regex list + `beatTitles` set + `beatAgeMap` for per-beat Age tagging | ✅ | `scripts/extract-lore.js` `extractStory()` |
| 1.2 | Add `extractHistoricalQuestline()` for "The Ages of the Sea" → `lore.historicalQuestline` | ✅ | new fn |
| 1.3 | Add `extractHistoricalTimeline()` → `lore.historicalTimeline[]` from the era / event / notes table | ✅ | new fn |
| 1.4 | Add `extractFactionInterpretations()` → `lore.factionInterpretations[]` | ✅ | new fn |
| 1.5 | Add `extractFutureHooks()` → `lore.futureHooks` (sections array) | ✅ | new fn |
| 1.6 | Add `extractAges()` → `lore.ages[]` + preserve `world.agesTable`; stop `extractWorld()` dropping the table | ✅ | new `extractAges()` + patched `extractWorld()` |
| 1.7 | Fix `extractDragons()` to preserve the "Why Dragons Matter" bullets → `dragons.matters[]` | ✅ | `extractDragons()` |
| 1.8 | Tighten `loreBook` category derivation — explicit `LOREBOOK_CATEGORY_MAP`, adds `Ages` + `Reveal` categories | ✅ | `categoriseChapter()` |
| 1.9 | Extend the closing summary log to print all extracted fields including category-counts and per-King wound counts | ✅ | bottom of `extract-lore.js` |
| 1.10 | Update `validate()` to assert ages ≥4, historicalTimeline ≥5, factionInterpretations ≥5, per-King historicalWound present | ✅ | `validate()` |
| 1.11 | `attachKingWounds()` — derive each King's `historicalWound` from the Current Age table (strips titles like "Captain"/"Lady" before name match) | ✅ (added during impl) | `attachKingWounds()` |

**Outcome:** `lore.json` now exposes `ages` (6), `historicalQuestline` (7 quests), `historicalTimeline` (17 rows), `factionInterpretations` (9), `futureHooks` (3 sections), and a per-King `historicalWound`. Validation fails-fast if any future LORE.md edit breaks coverage.

### Phase 2 — Layout improvements (new slides, reorganisation) ✅ LANDED

Bring the pitch deck up to the new narrative. Each item is one or two new slides, max.

| # | Item | Status | Note |
|---|---|---|---|
| 2.1 | **NEW "The Ages of the Sea" overview slide** | ✅ | Six `.age-card`s in a 3×2 grid, colour-coded per-Age palette (`.age--first` etc.), top-border by Age colour. Data: `lore.ages[]`. |
| 2.2 | **Replace "Mythic Timeline" with a 3-slide Age spread** | ✅ | Three book-spread slides driven by `beatsForAge(ageKey)`: (a) First Age, (b) Sundering & Drowned Crown, (c) Free Sails → Five Crowns. Beats tagged with `ageKey` by extractor. |
| 2.3 | **NEW "Whose Story Will You Believe?" slide** — Faction Interpretations matrix | ✅ | Nine colour-coded rows (`faction-atlantean`, `faction-pirate`, etc.) rendered as a `role="table"` for a11y. |
| 2.4 | **NEW "Two Reveal Paths" slide** | ✅ | Two-column layout: Jasper personal arc (left, 7 quests) / Ages of the Sea historical arc (right, 7 quests). |
| 2.5 | **Pirate King cards — add "Historical Wound" badge** | ✅ | `.king-wound` purple-bordered chip under King title. Uses `attachKingWounds()` data. |
| 2.6 | **NEW "Domain Comparison" slide** — uses `lore.domains[]` | ✅ | Five-row table: Domain · King + Dragon Stance pill · Waters & Hazards · Mythic Function. |
| 2.7 | **Updated slide 02 cover to highlight Ages framing** | ✅ | Sub-title now reads "Five crowns. Four ages. One captain who refuses to inherit any of them." plus rewritten body copy. |
| 2.8 | **Updated "Story Cover" slide kicker** | ✅ | "Story / Lore · Extracted from LORE.md" replaced with "A history written by survivors, traitors, and ghosts." |
| 2.9 | **Age ribbon at the top of every story slide** | ✅ | `.age-ribbon` component with per-Age colour dot; rendered by `ageRibbon(ageKey, label)` helper in `renderStory()`. |
| 2.10 | **Reorder the slide flow** | ✅ (already-correct) | The story slides already inject into `#story-lore-container` between slide 02 (Shattered Seas) and slide 03 (Your Mission: Dragons), which is the desired "world → history → mission" flow. No structural change needed. |

### Phase 3 — Polish & lorebook parity ✅ MOSTLY LANDED

| # | Item | Status | Note |
|---|---|---|---|
| 3.1 | Unify the two read-more paths | 🟡 Deferred | Current `openLoreText()` + `openLoreChapter()` split works cleanly; refactor risk outweighed the polish gain. Note for future pass. |
| 3.2 | Lorebook category palette | ✅ | Chapter cards now have `data-category` attribute; CSS colour-codes Ages (gold), Myth (indigo), Characters (crimson), Dragons (jade), Reveal (amber), World (sea-blue), Appendix (slate). |
| 3.3 | Cross-link Pirate King cards to their Age | ✅ | `KING_AGE_CHAPTER` map + `.king-see-also` chip on each King card opens the matching lorebook chapter modal. |
| 3.4 | LOREBOOK ages timeline as a feature page | 🟡 Deferred | Requires LOREBOOK.html spread changes — out of scope for the index.html pitch pass. Timeline data IS already present in `lore.historicalTimeline` and surfaces inside the auto-paginated Appendix chapter. |
| 3.5 | Hover-preview for chapter cards | ✅ | Chapter card now lifts on hover and unclamps the excerpt paragraph (CSS-only). |
| 3.6 | Numbered slide IDs from a single source | 🟡 Existing-works | `renumberSlides()` already walks every `.slide` and rewrites `.slide-number` after both renderStory + renderKings + writer-mode injection. No drift observed. |
| 3.7 | Faction poster in Lorebook | 🟡 Deferred | Requires LOREBOOK.html template — index.html-only pass. Faction interpretations DO appear as their own auto-paginated appendix chapter. |
| 3.8 | Surface `lore.futureHooks` in a hidden writer-mode toggle | ✅ | `?writer` URL param sets `body.writer-mode`, drops a Writer Mode badge, and appends a Future Hooks slide built from `lore.futureHooks.sections`. |
| 3.9 | Generated-at watermark | ✅ | `.lore-watermark` fixed-corner caption shows `Generated YYYY-MM-DD · from LORE.md` from `lore.meta.generatedAt`. Hidden in print. |
| 3.10 | A11y pass on the new slides | ✅ | Faction matrix + Domain comparison use `role="table"`/`role="row"`/`role="cell"`/`role="rowheader"` / `role="columnheader"`. Slide with the matrix uses `aria-labelledby`. Existing `<article>` book-pages already provide landmarks. |

### Phase 4 — STORYBOOK.html parity (added 2026-05-22)

Discovered after Phase 3 landed: `STORYBOOK.html` (the standalone King storybook page) still carried a 90-line hardcoded `KINGS` array, completely independent of LORE.md. Folded into the same data pipeline:

| # | Item | Status | Note |
|---|---|---|---|
| 4.1 | Add `<!-- PIRATE_KINGS_LORE_DATA -->` placeholder + `storybookPath` resolution in `scripts/extract-lore.js` | ✅ | Mirrors the `lorebookPath` pattern; injects `window.LORE_DATA` and `window.PIRATE_KINGS_LORE` inline. |
| 4.2 | Replace hardcoded `KINGS` array in `STORYBOOK.html` with `loadKings()` chain — inline window data → `data/pirate-kings-lore.json` fetch → empty-state telling the reader to run `npm run extract-lore` | ✅ | Both `docs/STORYBOOK.html` and root `STORYBOOK.html` updated. Root file tries `public/data/`, `docs/data/`, and `data/` paths in order. |
| 4.3 | Surface the new King fields — `historicalWound` (tile badge + modal section), `mythicRole` (modal subtitle), `relationshipToPlayer` (modal section) | ✅ | Adds the purple-bordered ⚖ Historical Wound chip to each tile, matching the pitch deck's King slide styling. |
| 4.4 | Support `dragonStance: 'neutral'` (was only `protects`/`hunts`) | ✅ | New `.tile-dragon.neutral` + `.lore-dragon.neutral` CSS so future neutral Kings render cleanly. |

---

## 5. Detailed sketch — what the new story-slide sequence would look like

After Phase 2 lands, the story-slide sub-deck injected by `renderStory()` would change from 6 slides to ~10, structured as:

```
S01 · The Shattered Seas (cover)           ← cover, unchanged
S02 · The Ages of the Sea (NEW)             ← ribbon overview + Age cards
S03 · The First Age — Three Crowns          ← First Age spread (renamed)
S04 · The Sundering                         ← First-Age beats (Hunger → Barrow → Crown Below → Jasper's Binding)
S05 · The Drowned Crown (NEW)               ← Second Age + Corruption + Unbinding Tide
S06 · Free Sails & the Ashen Turn (NEW)     ← Third Age + Ebon's Glory + Current Age
S07 · Whose Story Will You Believe? (NEW)   ← Faction Interpretations matrix
S08 · Rumour, Evidence, Truth               ← Sailor rumours + reveal layers (kept, scoped)
S09 · Two Reveal Paths (NEW)                ← Jasper Questline + Historical Reveal Questline side-by-side
S10 · The Vocabulary of the World            ← Key Terms (kept, separated from Jasper)
S11 · The Lorebook                           ← Chapter grid (kept, now sorted by Ages category)
```

The static deck slides 02-20 then read naturally afterward: Pirate Kings, Dragons, Familiars, Ships, Maps, Gameplay, Story, Close. The Age ribbon (Phase 2 item #9) appears at the top of S03-S11 so the reader always knows which Age they're reading about.

---

## 6. Concrete extractor code change — Phase 1 patch outline

For the developer who picks this up, here's the shape of the change to `scripts/extract-lore.js`:

```js
// 1.1 Expand the story regex list and beatTitles
function extractStory(md) {
  const res = [
    /^Story \/ Lore:/,
    /^The Atlantean Hunger$/,
    /^Admiral Barrow's Betrayal$/,
    /^Jasper Barrow and the False Treason$/,
    /^Aurelion's Dive$/,
    /^The Crown Below Ritual$/,
    /^Jasper's Binding$/,
    /^The Crown Below: The Wound That Still Pulses$/,
    /^The Second Age: The Age of the Drowned Crown$/,   // ← new
    /^The Corruption of the Deep$/,                       // ← new
    /^The Unbinding Tide$/,                               // ← new
    /^The Third Age: The Age of Free Sails$/,             // ← new
    /^Ebon's Glory and the Ashen Turn$/,                  // ← new
    /^The Current Age: The Age of Five Crowns$/,          // ← new
    /^Public Rumours vs\. Hidden Truth$/,
  ];
  // ... sections building unchanged ...
  const beatTitles = new Set([
    'Story / Lore: The Sundering of the Three Crowns',
    'The Atlantean Hunger',
    "Admiral Barrow's Betrayal",
    'Jasper Barrow and the False Treason',
    "Aurelion's Dive",
    'The Crown Below Ritual',
    "Jasper's Binding",
    'The Second Age: The Age of the Drowned Crown',     // ← new
    'The Corruption of the Deep',                       // ← new
    'The Unbinding Tide',                               // ← new
    'The Third Age: The Age of Free Sails',             // ← new
    "Ebon's Glory and the Ashen Turn",                  // ← new
    'The Current Age: The Age of Five Crowns',          // ← new
  ]);
  // ... rest unchanged
}

// 1.6 New: extract Ages from the Ages-of-the-World table
function extractAges(md) {
  const block = h2(md, /^The World:/);
  const rows = table(block);
  if (!rows.length) return [];
  return rows.map(r => ({
    age: r.age || '',
    label: r.common_name || '',
    power: r.dominant_power || '',
    summary: r.what_it_means || '',
    key: slug(r.age || ''),
  }));
}

// 1.3 Historical Timeline
function extractHistoricalTimeline(md) {
  return table(h2(md, /^Appendix: Historical Timeline$/)).map(r => ({
    era: r.era || '',
    event: r.event || '',
    notes: r.notes || '',
  }));
}

// 1.4 Faction Interpretations
function extractFactionInterpretations(md) {
  return table(h2(md, /^Appendix: Faction Interpretations of History$/)).map(r => ({
    faction: r.faction || '',
    description: r.how_they_describe_the_ages || '',
  }));
}

// 1.2 Historical Reveal Questline
function extractHistoricalQuestline(md) {
  const block = h2(md, /^Suggested Historical Reveal Questline: The Ages of the Sea$/);
  return {
    title: title(block),
    quests: getH3Sections(block).map((q, i) => ({ ...q, number: i + 1 })),
  };
}

// 1.5 Future Hooks
function extractFutureHooks(md) {
  const block = h2(md, /^Appendix: Future Story Hooks/);
  return { title: title(block), sections: getH3Sections(block) };
}

// 2.5 Historical wound — derive from the Current Age table for each King
function attachKingWounds(kings, md) {
  const currentAge = h2(md, /^The Current Age: The Age of Five Crowns$/);
  const rows = table(currentAge);
  if (!rows.length) return;
  const woundByName = Object.fromEntries(rows.map(r => [
    (r.king || '').replace(/\*\*/g, '').trim().toLowerCase(),
    r.historical_wound || '',
  ]));
  for (const k of kings) {
    const fullName = k.name.toLowerCase();
    k.historicalWound = woundByName[fullName]
      || Object.entries(woundByName).find(([key]) => fullName.includes(key.split(' ')[0]))?.[1]
      || '';
  }
}

// Wire into the lore object
const lore = {
  // ... existing fields ...
  ages: extractAges(md),
  historicalTimeline: extractHistoricalTimeline(md),
  factionInterpretations: extractFactionInterpretations(md),
  historicalQuestline: extractHistoricalQuestline(md),
  futureHooks: extractFutureHooks(md),
  // pirateKings now also have .historicalWound
};
attachKingWounds(lore.pirateKings, md);
```

That patch leaves the existing UI working (every old field still exists) while making the new content available for the Phase 2 slides.

---

## 7. Open questions for the user

1. **Pitch deck audience** — is this deck for investors, internal team, or playtest community? "Five crowns. Four ages. One captain." copy assumes a marketing tone; technical sections like the Faction Interpretations matrix lean more "writer's room".
2. **Number of story slides acceptable?** — Phase 2's expansion takes the story sub-deck from 6 slides to ~10. Is that too long for the deck flow, or is the deeper lore now worth the airtime?
3. **Faction matrix density** — 9 factions × 1 long sentence each. Show all on one slide (dense but immediate) or split across two (more legible but interrupts the flow)?
4. **Future Hooks visibility** — should the writer-mode toggle (3.8) be a dev-only thing, or do you want to show prospective collaborators the "where this is going" appendix?
5. **Lorebook vs. pitch deck split** — does anything on this list belong ONLY in the Lorebook (3.4, 3.7) and not the deck? Or should pitch-deck readers see everything?

---

## 8. Cross-references

- **`LORE.md`** — the canonical source. All bracketed line refs in §1-§3 point here.
- **`scripts/extract-lore.js`** — Phase 1 work happens here.
- **`docs/index.html`** — Phase 2 / 3 layout work happens here. The story-slide rendering is inside an IIFE that consumes `window.LORE_DATA`.
- **`docs/LOREBOOK.html`** — auto-paginates chapters. Phase 1 changes flow automatically; Phase 3 #3.2 / #3.7 are LOREBOOK-specific polish.
