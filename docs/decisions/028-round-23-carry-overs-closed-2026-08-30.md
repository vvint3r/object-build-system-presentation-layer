# Round 23 — carry-overs closed (2026-08-30)

- **Date:** 2026-08-30
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 627–733
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

### Selection §02 — nine entries added, 56 → 65 components
Five under **Wayfinding** (search · faceted browse · ranked entry · version selector · diff block) and four under a new **Provenance** family (aggregation header · agreement and spread · confidence qualifier · citation marker). Family chips now ten. Each entry carries the four fields; the "when not" column resolves the three partials R22 folded in — release notes are named inside the diff block's own row rather than given a row of their own.

### Gate run — Wayfinding and Provenance
Run mechanically over both files. Passes 1–3 clear after four fixes.

| Pass | Result |
|---|---|
| 1 Count | Clear. 5 sections each (ceiling 8) · 1 untagged L2 each · 0 solid semantic fills · 1 corner bracket each · 0 dotted dividers. |
| 2 Tokens | Four breaches, all fixed: Provenance IQR band at teal .55 → .3 · Wayfinding input/select padding 11 → 12 · search button 11×22 → 12×24 (the Foundations large-pill value) · assorted 13/7/1px component values snapped to scale. |
| 3 Depth | Clear. No nested shadows, no shadow-plus-hairline surface, no two S2 peers. |
| 4 Hierarchy | Clear. Every container carries a T3 at 700/15; both reserved L2s are headed; no mono-only container heading. |
| 5 Composition | Clear. Both §05 rule lists sit on the page rather than in a container, per R19.7. |
| 6 Chrome | Clear. Canonical two-row nav, anchors at scroll-margin-top:126px. |

**Finding against the gate itself, not the pages:** pass 2's component-scale check (2/3/4/6/8/9/10/12/14) flags the shipped pill convention — nav pills at `5px 12px`, the Foundations medium pill at `9px 18px` — which predates rule 9 and appears on every page with a header. Either 5 and 18 join the component scale or the whole library re-scales. Not swept; recorded for a ruling. Nothing else in the check disagrees with shipped work.

### Charts — four charts, four empty conditions, R23.1–R23.6
`content-morphia Charts.dc.html`. §01 choosing a chart (five questions, each with its ceiling and the substitute it is mistaken for) · §02 trend over time (8 quarters × 3 populations, fills not hues, SLA threshold drawn, one crit breach bar, truncated axis declared; the page's one L2) · §03 spread and share (distribution over 10 buckets with a marked median and a click-to-read bucket; a four-part share bar over a stated total of 1,412) · §04 the four empty conditions, switchable, with the frame always drawn · §05 rules.

| Rule | Statement |
|---|---|
| R23.1 | One chart, one question. The title states the question; a second question is a second chart. |
| R23.2 | Series separate by fill — solid accent, accent hatch, track — never by hue. One hue at three densities, therefore three series maximum. |
| R23.3 | Every chart states its scale: zero baseline, or the truncation declared in mono. Units, window and population sit in the provenance line. |
| R23.4 | Part-to-whole is one stacked bar of at most five parts with the total stated. Pies, donuts and radial gauges are illegal — their encodings need hue. |
| R23.5 | A semantic fill on a data mark means a threshold breach, and the threshold is drawn on the same chart. |
| R23.6 | An empty chart draws its frame and names one of four conditions — not yet aggregated, insufficient sample, suppressed, partial window — each with what resolves it. |
| R23.7 | **Black is emphasis ink, not population ink.** A population is drawn in the accent; solid black on a chart is spent on the axis, a threshold or median line, and at most one selected mark. A field of black bars has no emphasis left to give. |
| R23.8 | **A chart surface spends the accent on its marks.** The container holding a chart takes no accent chrome — no reserved offset shadow, no accent-filled chips — and its controls carry the neutral active state (1px black border + `2px 2px 0 rgba(0,0,0,.18)`). A colour means one thing per surface. |

**R23.7 origin (Wynt3r, 2026-08-30, inline comment on §03):** the solid-black histogram bars read as overwhelming noise against the content. The ladder Provenance §02 already used — accent wash for the population, one black tick for the median — is now the system-wide data-mark ladder. Swept on Charts: trend primary series, distribution bars, share-bar first segment and the partial-window columns all moved #000 → #1de9b6; the distribution's selected bucket is the one black mark. Hatch and track fills keep their 1px black outline (a hairline, not a fill). **R23.8 origin (Wynt3r, same review):** with marks moved onto the accent, the §02 card had teal doing three jobs at once — the reserved L2 offset shadow, the toggle pills’ active offset, and the data. That is R12.3 (one meaning per colour per view) at surface scale. Applied: Charts §02 dropped L2 for S3 float, the series toggles and the §04 segmented control took the neutral active offset, the §03 readout chip went from an accent fill to a neutral white/1px-black chip; Provenance §01 (the aggregation header, which carries a staleness bar) likewise dropped L2 for S3. Both pages now carry zero L2, which is legal. Consequence for the ration: **a chart is never the view’s L2** — the reserved offset marks a verdict, and a chart is evidence. Rule 7c (black fill ration) now reads: chips and pills · the primary button · code surfaces · the one display slab per section · diagram terminals · **and on charts, lines and one selected mark only.**

Charts page is 8 rules (R23.1–R23.8). Selection §02 gains four Quantities rows (multi-series trend · distribution · share bar · chart empty state); matrix now 69 components across ten families.


### Learning — three check variants, the closing summary, the cycle, the model (R23.9–R23.14)
`content-morphia Learning.dc.html`. §01 checking understanding (multi-select with its set size stated and correct/missed/wrong marks · true-or-false on a one-clause claim · reflection with a reference answer, unscored) · §02 comprehension summary — objectives in the completed tense, where covered, how assessed, plus the boundary block · §03 cyclical framework — five stages on a line with the return drawn beneath and the cadence named, click-to-inspect takes-in / produces / hands-on-when · §04 model — the refresh placement model as a 2×2 of borderless white tiles on a dashed canvas, with parts, the relationship, holds-when / breaks-when brackets and a provenance line · §05 rules.

| Rule | Statement |
|---|---|
| R23.9 | Four check shapes and no fifth: single choice · multi-select · true or false · reflection. |
| R23.10 | A multi-select states how many options are correct before the answer, and marks every option on reveal as **correct, missed or wrong** — a closed three-word set, no partial score. |
| R23.11 | A reflection is never scored, never gates, never reports. It offers a reference answer on request: a worked example, not a key. |
| R23.12 | A comprehension summary introduces nothing. Objectives restated in the completed tense, the section that covered each, the check that assessed it, and what the module left out. |
| R23.13 | A cycle is a line with a stated return and a stated cadence, never a ring. No cadence means it is a process. |
| R23.14 | A model states schematic, parts, relationship **and the condition that breaks it**. Without the limit it is a diagram with a name on it. |

Axis labelling on the 2×2 avoids rotated text (R13.1) by naming both axes in one mono line above the canvas and giving every quadrant its own coordinate line — no axis furniture.

Selection §02: single choice renamed and three new Learning rows added (multi-select, true or false, reflection); comprehension summary, cyclical framework and model re-pointed from `Not built · R23` to their sections. No `Not built` placeholders remain in the matrix.

### Round-23 QA sweep (token pass, 29 pages, Options excluded as historical)
Static scan for grey text, retired radii (5/10), retired hairline #e4e4e4, sub-floor type, L2 count and solid semantic fills. Three real defects found and fixed:
1. **Teal bullets were set as text colour** — `color:#1de9b6` on a • or — glyph across Diagrams, Foundations, Review and Structured. Accent as text breaks rule 2 even when the glyph's job is a bullet. All converted to a 5px teal dot **shape**; the nested taxonomy-tree leaves took a 3px black square instead, per R19.6 (teal is for a flat list of ≤5 peers).
2. **Retired radius** — one `border-radius:10px` on Diagrams IV, now 12.
3. Confirmed false positives: `text-decoration-color:#1de9b6` in every helmet; Implementing's checklist row whose *text* names #e4e4e4.

**Ruled 2026-08-31 — weight-only code, no hue on ink (R23.15).** The hue-coded specimen and its caveat are deleted from Foundations §14. Rule 1 admits no exception for code bodies: hue would have been the one place in the system where colour carried meaning with no shape or label cue, and a code block already has three encodings available (weight, italic, position). The §14 caption now states the rule instead of choosing between options, and the glyph-tile caption no longer names a pending ruling — both were page-genre breaches of the same kind.

| Rule | Statement |
|---|---|
| R23.15 | Code is #fff on the black surface, always. Syntax is weight only — keywords 700, comments 300 italic, everything else 400. No hue on ink, in any language, ever. |


### Interaction — disclosure, sort/filter, overview↔detail, definitions, recently viewed (R24.1–R24.8)
`content-morphia Interaction.dc.html`. §01 disclosure (three peer policy sections on one surface, inset hairlines, marker + T3 heading + contents fact, one-open-at-a-time by default) · §02 sorting and filtering over the eight-row pipeline certification register (one sort key, teal underline on the active column, direction and filtered count in words above the table, empty state keeps its controls) · §03 overview and detail (five attached context nodes; dashed canvas of lifted rows against a hairline detail card) · §04 definitions in place (two defined terms in one passage, L3 overlay panel, one sentence + provenance + one link) · §05 recently viewed (five rows, newest first, delta per row) · §06 rules.

| Rule | Statement |
|---|---|
| R24.1 | Disclosure hides peers, never a sequence. If a later section depends on the folded one, it does not fold. |
| R24.2 | A disclosure header states its contents — a count, a date, a threshold, a verdict — not a teaser. Real button, own T3 heading, aria-expanded; peers share one surface split by inset hairlines. |
| R24.3 | A sort states key and direction in words. One sort at a time; the active column takes a 2px teal underline, the direction is written beside the row count. |
| R24.4 | A filtered table states its count against the whole and names every filter in force. Filters sit above the table, never in the header row; an empty result keeps its controls and says what restores the rows. |
| R24.5 | Detail is a peer surface, never an overlay. The overview stays visible and marks the selection; the two surfaces take different depth families (dashed canvas vs hairline card). |
| R24.6 | A definition panel defines and does not explain: one sentence, the source count, one link. Two paragraphs means the term needed a link. |
| R24.7 | One panel open at a time, at L3 overlay depth. The term carries the link marker and no second marker; the panel holds one link and its close control only. |
| R24.8 | A trail carries the delta or states there is none. Recently viewed is recency-ordered and capped at five; without deltas it is a bookmark list, which this product does not have. |

Selection §02 gains an **Interaction** family, six rows (disclosure · sort control · table filter · overview and detail · definition panel · recently viewed) — eleven families, 75 rows. The Components group is now six pages; the ALSO IN COMPONENTS strip on all five siblings carries Interaction.

Rule note: the disclosure marker is mono `+` / `−` in a 20px #f1f1f1 track — a track use of the grey, not a fill, and no glyph the words do not already carry. Table state chips stay tints (R19.1); the page runs zero solids, and its one L2 is the §01 disclosure surface.


### Anatomy and primitives — phase D (R24.9–R24.16)
`content-morphia Anatomy.dc.html`, in the Composition group (now four pages: Composition · Implementing · Selection · Anatomy). Closes the R24 phase-D carry-over: per-component anatomy/fields docs and layout primitives. Five sections — §01 the eight layout primitives (geometry / holds / never holds, the four-level legal stack, four illegal arrangements) · §02 the three part classes (required · optional · derived) and four reading rules · §03 the anatomy register: 29 components, ~130 parts, filterable by ten families with a search over component and field names and a required-only toggle · §04 the fourteen shared field types with type, presentation and the consequence of absence · §05 the eight rules.

Why the register is levelled at parts, not components: Selection §02 answers *which* component the material calls for; nothing in the system said what a component needs before it can render, so an implementer with partial data either invented an empty state or picked a component it could not fill. The absent-field column in §04 is the load-bearing one — it converts missing data into a selection decision instead of a rendering decision.

The register is the contract with the content model (produced separately): a field name carries one type, one limit and one presentation everywhere it appears. Derived parts are named explicitly so the model does not supply them — step index, staleness, set size, zebra, confidence, marks, tier/intensity, disclosure thresholds.

| Rule | Statement |
|---|---|
| R24.9 | The eight layout primitives are a closed set — page shell · section · reading column · module surface · peer grid · canvas · sub-block · rail split. Material that fits none of them is prose in the reading column, not a new container. |
| R24.10 | Nesting bottoms out at four levels: page shell, section, module surface, sub-block. A fifth level means the inner container becomes a sub-block or an inset divider. |
| R24.11 | Part order is fixed by the anatomy. A view that needs a different order needs a different component. |
| R24.12 | An optional part with no data renders nothing — no empty frame, no dash, no line stating that a value is unavailable. |
| R24.13 | A missing required part disqualifies the component. The material takes the simplest component whose requirements it does meet. |
| R24.14 | Derived parts are computed by the renderer. Supplied by the model, they are ignored. |
| R24.15 | Every repeatable part states a cap. Past the cap the material changes component: tiles become a table, a list becomes a register with a filter. |
| R24.16 | A field name is a contract — same type, same limit, same presentation in every component that reads it. |

Page runs zero L2 and zero solids; the register cards are borderless #fff + S1 on the page canvas (R20.1), part rows zebra at #fafafa, the illegal-arrangement tiles and the empty state are dashed canvases. Tweaks: defaultFamily, requiredOnly, showNotes.
