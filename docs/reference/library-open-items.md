# Library open items (reference)

> **Reference.** These are inconsistencies inside the original content-morphia library. The Report
> Kit defines its own values, so none of these block work. An item matters again
> only when the library feature it touches is adopted into the kit; resolve it then. Open items for the
> kit itself are in `docs/open-items.md`.

Places where the library's rulings, token files and built pages disagree. Each item names both values,
where each one comes from, and the question the owner needs to answer. `library-rules.md` states the
value the library's shared components render.

Measurements are from the 28 Sep 2026 export, counted over the 35 current library pages
(`import/nodetrak-presentation-layer/content-morphia *.dc.html`), excluding `_archive/` and `uploads/`.

---

## Decided but not applied

These have a ruling. The work is to carry it into the files that still disagree.

### O1 · Accent hex

| Source | Value |
| --- | --- |
| Round 40f ruling | `#1bbd94` |
| Pages and shared components | `#1bbd94`, 431 sites in 43 files |
| `tokens/colors.css` and the export's `CLAUDE.md` | `#1de9b6` |
| Icon solid fills, `icons/set/*-f.svg` | `#1de9b6`, all 16 files |

**Action.** Use `#1bbd94` in the token source and recompose the 16 filled icons. Washes move from
`rgba(29,233,182,…)` to `rgba(27,189,148,…)`.

### O10 · Template specimen headings off the tier ladder

Eight template specimens set their document-section headings inline at 21px (T2, T3, T4, T5, T7, T8)
or 28px (T6, T9): 35 headings. Round 40c left them as document parts, to convert when the specimen
components are built. The ladder now puts section titles at 36.

**Question.** Do a delivered document's section headings follow the library's T2 at 36, or does a
delivered document get its own tier set?

### O11 · Token values are documentation, not runtime

`styles.css` and `tokens/*.css` exist, but 0 of 6,132 inline style attributes on the pages reference a
variable. Round 40 recorded this as intended under the inline-styles constraint. In this repository the
tokens become the runtime (migration step 3), which resolves it.

---

## Conflicts that need a ruling

### O2 · Section and masthead marker

| Source | Section header | Masthead |
| --- | --- | --- |
| Round 40f ruling | 28×4 accent bar in a left column | 36×5 accent bar |
| `cm-section`, `cm-mast` as built | 14px hollow black circle, 2.5px border | 16px hollow black circle, 3px border |

No record explains the change from bar to circle. Every page renders the circle, because every page
mounts these two components.

**Question.** Which marker is current?

### O3 · Container interior padding

| Source | Value |
| --- | --- |
| Round 40f ruling | 32 |
| `cm-container` default | 28, with 32 for primary and reserved |
| Pages | 46 white S2 surfaces at 28 |

**Question.** Is 32 the padding for every container, or only for primary and reserved?

### O4 · Table row rule inset

| Source | Value |
| --- | --- |
| Round 40f ruling | Row rules inset 16px from the surface edge |
| `cm-table` as built | Rows inset 32px (`margin: 0 32px`) |

**Question.** 16 or 32?

### O5 · Stacked-group spacing is off both scales

Round 40f sets stacked groups at 36. The structural scale is 16 · 20 · 24 · 28 · 32 · 48 · 88 · 96, and
a value from the wrong scale is a violation by the system's own rule.

**Question.** Add 36 to the structural scale, or set stacked groups to 32 or 48?

### O6 · Which black fills survive

Round 40f retires black fill "on every button, chip and control". The earlier ration kept black fill
for: the primary button, the one selected control in a set, the current step marker, diagram terminals,
and chart axis and threshold lines plus one selected mark.

| Still black-filled | Where |
| --- | --- |
| Nav page badge | `cm-nav`, on every page |
| Black pills (`background:#000` with radius 999) | 10 pages: Diagrams, Diagrams II, Diagrams at Scale, Exemplar, Learning, Selection, Structured, T1, T8, Wayfinding |

The 10-page count is a pattern match. It does not separate step markers and terminals from controls.

**Question.** After round 40f, which of these keep black fill: the current step marker, diagram
terminals, chart axis and threshold lines, the selected chart mark, the nav page badge?

### O7 · Grey lines and frames

Round 40f removes container hairlines, inset dividers, dotted rules, and the nav and strip borders.
Table row rules stay.

Still in the rules or on the pages:

- The specimen-commentary rule: commentary separated from its specimen by a 1px `#ebebeb` rule at 28px.
- The sub-section rule: a sub-section inside a container is separated by 28px and an inset 1px rule.
- 30 dashed `#d9d9d9` frames on pages. `cm-container`'s canvas variant is now white with an inset
  1px `rgba(0,0,0,.06)` ring, which replaces the dashed `#fafafa` canvas.

**Questions.** Are the specimen-commentary and sub-section rules retired, and if so, what separates
those parts? Does every dashed canvas frame become the inset-ring canvas?

### O8 · Scope of the S1 retirement

Round 40f says every white surface carries S2 and "the S1 whisper retired on Foundations". `cm-container`'s
tile variant and the `cm-nav` bar still use S1.

**Question.** Is S1 retired library-wide, or kept for tiles and the nav bar?

### O9 · T4 weight and leading

On Foundations, card titles in a peer grid are 24 / 800 and sub-block titles are 24 / 700, both at
leading 1.25. `cm-bracket` sets its sub-block title at 24 / 700 / 1.3.

**Question.** Is T4 one tier with two weights by role, or should one weight win? Which leading?

---

## Deferred

Recorded as deferred in the export. Not conflicts.

- Dark mode. The polarity rules were written to invert.
- Motion specification and a reduced-motion pass.
- The sticky rail as a shared component.
- Label chips and containers converted to component instances on every page.
- Cyclical framework, per-visualization empty and print states.
