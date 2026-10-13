# Round 40c (2026-09-07) — the whole library on the component layer

- **Date:** 2026-09-07
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1381–1434
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

**All 35 pages now mount the shared components. 1,864,512 → 1,231,864 chars, −34%, no content removed.**
Per page the reduction runs 21% (Foundations) to 47% (Questions). Converted: 35 menu bars, 35 page
mastheads, 148 section headers, 24 on-this-page strips, 3 footers, 2 tables, 8 callouts. No file is
left with unbalanced tags.

### Two defects in the pass itself, found by inspection and fixed
1. **The brand read "Content Morphia" on the six pages of batch one.** Every other page in the library
says `content-morphia`, lower case, and so do the footers. The component now carries the lower-case form.
The lesson is the one this round keeps teaching: a value hard-coded inside a shared component is a
library-wide decision, so it has to be read off the library rather than off the page in front of you.
2. **The nav's page chip was silently dropped on eleven pages.** The detector looked for a black-filled
badge; the real chip is white with a 1px black border. Restored from `_archive/pre-rebuild/` and now a
`chip` prop. A converter that discards what it cannot classify is worse than one that fails: the failure
is visible, the discard is not. The pass now reports every element it does not convert, by name.

### Three components added by what the pages actually contained
- `cm-footer` — the mono footer strip. Its link had been underlined with `border-bottom` and
`text-decoration:none` (three variants across the library); the component uses the canonical R28.1 underline.
- `cm-mast` gains **crumbs** — the breadcrumb above the page title, which is how all eleven template
specimens and the worked example open. One treatment now: mono 12/400 caps at .02em, canonical underline,
current item at 700 with `aria-current`.
- `cm-section` gains **chip** — 25 section headers carried an identity chip *beside* the h2
(`Tier 1 · 5 lifelines · 9 messages`, `Adjacency table`). R36.3 forbids exactly that at container level;
it is the same defect at section level. The chip now sits on the label row with `ss: NN` and the title
sits on its own line beneath.

### Off-token values corrected by the components, library-wide
Section rhythm 88 → 96px · page-header top padding 40/48/56/72/88 → 48 · page title 40/44px at
1.06/1.08/1.15 → 44 at 1.15 · page lede 16/1.8/68ch → 15.5/1.85/70ch · masthead bar `margin-top:34px`
(off both scales) → the component's rhythm · breadcrumb tracking .02/.06/.08em → .02em · label chips at
the retired 700/.08em treatment → 600/.02em.

### Left as authored, deliberately, and why
- **The eleven template specimens' document sections** (`Steps`, `Phases`, `Milestone table`) are
document parts, not `ss: NN` library sections. They convert when the specimen components are built out,
not by the library-page pass.
- **The sticky rail** (R36.13) is not a component yet, so it stays on the eleven T-pages and the worked
example. `cm-rail` is the next component.
- **Anatomy's and Exemplar's on-this-page strips** are click-driven through the page's own logic class
(this host suspends scroll listeners, so a clicked marker is the only marker available). A JSON prop
cannot carry a handler; both stay authored until `cm-toc` takes a current-index prop the page can drive.
- **2,622 label chips and 496 containers** are still inline. They convert per page, and only where the
chip is *used* rather than *specified* — Foundations ss: 06 keeps its literals because that section is
the token reference.

### One rule breach found while converting, not fixed
`Exemplar` carries a black-filled `REFERENCE BUILD · METHOD` badge under its strip and a black-filled
`PUBLISHED` status chip. Both are non-interactive, so rule 7c retired them: a status chip takes its
semantic tint, and black fill is reserved for the thing the reader acts on. Round 39c's sweep did not
reach them. Queued as a chip sweep, to run with the chip conversion.
