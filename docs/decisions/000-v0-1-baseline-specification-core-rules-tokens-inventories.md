# v0.1 baseline specification (core rules, tokens, inventories)

- **Date:** not stated in source
- **Source:** `import/nodetrak-presentation-layer/content-morphia-SPEC.md`, lines 1–120
- **Status:** historical record from the original library, copied verbatim. The rules in force are in `kit/report-kit/SPEC.md`.

---

# content-morphia — Design System Specification v0.1

A design system for structured knowledge and learning content. Built for reference density with long-form reading comfort. This spec is the comparison target for the Claude Code content-model output.

## Core rules (non-negotiable)
1. **Text is black (#000) or white (#fff) only.** Context decides polarity. No grey/dull text — ever.
2. **Focus is weight, not color.** Nunito 300 (de-emphasis) → 900 (display). De-emphasized content uses weight 300/400, never a lighter color.
3. **Accent is never text.** Teal appears only as: bars, link underlines, borders, chip fills, offset shadows, column washes. Teal on white is 1.57:1 — accent must always be redundant with a shape, label, or position cue.
4. **At most one reserved emphasis per view.** The teal offset shadow (`5px 5px 0 #1de9b6` + 1.5px black border) marks the single most important element — zero is legal, two never. Documentation specimen instances carry a dashed mono SPEC SPECIMEN tag and don’t count.
5. **Meaning never depends on color alone.** Every semantic carries its mono uppercase label, and semantic chips always carry a 1px black border.
6. **Every interactive is a pill (999px).** Cards 14px, tables 12px, inputs 8px, chips 4px.
7. **Borders never nest.** Tiles, diagram nodes, and nested boxes inside a bordered container use track fills (#f1f1f1), not hairline outlines. Emphasized nodes (black border + shadow) are the exception.
8. **Type floor.** Mono labels ≥9.5px (standard 9.5–10); 9px only for chart ticks/axes; nothing below 9px, ever.
9. **Focus is visible.** Global ring on every interactive: 2px black outline, 3px offset (helmet reset). Interactives are real elements — `<a>`, `<button>`, inputs; clickable divs are banned.
10. **Headings are real.** Masthead = h1, section titles = h2, `margin:0`, styled inline. Breadcrumb current page carries `aria-current="page"`.
11. **Responsive is structural.** Sanctioned helmet media blocks only (ids + !important, structure not styling): TOC rails collapse to a top strip ≤1150; data-block min-widths release ≤800; 1fr-column grids stack ≤640 (attribute-selector rule); data tables/matrices scroll horizontally <641.

## Tokens

### Color
| Token | Value | Role |
|---|---|---|
| ink | #000000 | All text on light; fills for primary CTA, PUBLISHED/REQUIRED chips |
| paper | #ffffff | Surfaces; text on dark fills |
| canvas | #fafafa | Page background |
| track | #f1f1f1 | Tab tracks, subtle button, archived chip |
| hairline | #ebebeb | Default 1px borders + inset section dividers (R8; #e4e4e4 retired) |
| divider | #d9d9d9 | Dotted row dividers, table title rule |
| accent | #1de9b6 | Teal — bars, underlines, borders, chips, reserved shadow, washes (rgba .12/.25/.3) |
| ok | #00e676 | Approved, live, success chips (black text) |
| warn | #ffd600 | In review, degraded, warning chips (black text) |
| crit | #ff5252 | Deprecated, failing, limitation chips (black text) |
| info | #40c4ff | Note chips (black text) |
| note | #b388ff | Example chips (black text) |

Neutral chip = white fill + 1px black border. Greys are structural only (borders, fills) — never text.

### Typography
- **Nunito** — reading + display. Weights: 300 de-emph · 400 body · 600 gentle emph · 700 labels/actions · 800 component titles · 900 display/headings.
- **JetBrains Mono** — every label, metadata item, timestamp, table, code span, badge. 400/600/700.

| Style | Spec |
|---|---|
| Display | 40–52 / 900 / 1.05 |
| H1 | 28 / 900 / 1.15 |
| H2 | 21 / 800 / 1.2 |
| H3 | 16 / 800 / 1.3 |
| Body | 15 / 400 / 1.85 (generous) |
| Body-lg (lead) | 16–17 / 400 / 1.8 |
| Small | 13 / 400 / 1.7 |
| Mono label | 9.5–10 / 700 / caps / ls .08–.1em — hard floor 9.5; ticks/axes may be 9 |
| Mono meta | 11 / 400 |
| Mono table | 11 / 400–700 |
| Annotation | mono italic 9.5–10 / 400 — chart & payload notes |
| Code chip | 12.5 mono on #000, white text, 6px radius |

### Spacing & layout
4px base: 4, 8, 12, 16, 24, 32, 48, 96. Reading column 70ch; page grid 1060px; sections 96px apart. Breakpoints (structural media blocks, live on every affected page): 1150 — TOC rails → top strip · 800 — hero/table min-widths release · 640 — 1fr grids stack (attr-selector rule); data tables & matrices scroll horizontally below 641. One-surface modules with vertical inset dividers add a per-module id rule at ≤640: drop `border-left`/column padding, replace with `border-top` + 16px padding/margin (divider rotates horizontal when stacked).

### Radius
4 chip-sq · 6 code chip · 8 input · 12 table/tile · 14 card · 999 pill · 2–3px chart-bar caps. 5px and 10px are not in the set.

### Depth
| Level | Treatment | Use |
|---|---|---|
| L0 | 1px hairline #ebebeb, white | Default surface |
| S1 | `0 1px 2px rgba(0,0,0,.06)`, borderless white | Soft rest — rows, quiet frames, figure mats |
| S2 | `0 4px 14px rgba(0,0,0,.08)`, borderless white | Soft card — the one primary container per cluster |
| S3 | `0 14px 28px -6px rgba(0,0,0,.11)`, borderless white | Soft float — hero/chart/code frames, sticky rails |
| L1 | hover: −1,−1 lift + `3px 3px 0 rgba(0,0,0,.18)` + black border | Interactive surfaces |
| L1e | 1.5px black border + `6px 6px 0 rgba(0,0,0,.08)` (static) | Emphasized container — pop without claiming the reserved teal |
| L2 | 1.5px black border + `5px 5px 0 #1de9b6` | Reserved — at most one per view |
| L3 | 1.5px black border + `10px 10px 0 rgba(0,0,0,.12)` | Modals, popovers |

### Chart tokens (extracted from the T6 trend strip — use for every chart)
Baseline 1.5px solid #000 · target line 2px dotted #000 + mono flag · ticks/axes mono 9px/400 · bar gap ≥6px · bar caps radius 2–3px · series ink; semantic fills only for breach (crit) and current (accent) · annotation below chart in mono italic. Multi-series (decided before chart #2): differentiate by fill — solid ink / track / hatch — max three series, never by hue.

Division of labor (R8): SOFT tiers = structure at rest (borderless; a surface carries a hairline OR a soft shadow, never both); HARD offsets = emphasis & interaction only. Page mix ≈60% hairline / 40% soft shadow. Sibling sections of one module share ONE surface split by inset #ebebeb dividers; content sub-blocks are marked by 14×14 corner brackets (2px black L + mono label), not fills; separate enclosures = independent peers only. Diagram nodes keep #f1f1f1 fills.

**Breathing floors (R8):** module interior padding ≥24 (primary 26–28) · mono label → content ≥10 · tile gaps ≥16 · content column gaps ≥28 · sibling surfaces ≥16 apart · one-surface section padding-y ≥16 · table row padding-y ≥8. When in doubt, add one 4px step.

Primary CTA hover: `3px 3px 0 #1de9b6` + −1,−1 lift. Active/press: 1px shadow + +1,+1.

## Component inventory (v0.1 — built)
- **Buttons**: primary (black pill) / secondary (outline pill) / subtle (track pill) / icon pill / mono link (teal underline). Sizes S/M/L. States: default, hover, focus (2px black ring, 3px offset), active, disabled (opacity .3).
- **Tabs**: pill track #f1f1f1; active = white pill, 1px black border, 2px teal offset, weight 700; inactive weight 400.
- **Badges/chips**: 3 chromes — outline, bright fill, ink fill. Mono 9/700 caps pills.
- **Status set**: DRAFT (outline) · IN REVIEW (warn) · APPROVED (ok) · PUBLISHED (ink) · DEPRECATED (crit) · ARCHIVED (track).
- **Requirement levels**: REQUIRED (ink) · RECOMMENDED (accent) · OPTIONAL (outline).
- **Difficulty**: dot scale ●●○ + mono label; level count is data-driven.
- **Metadata group**: compact inline mono row; expanded 2-col label/value grid.
- **Content header**: breadcrumb → teal bar → title 900 → description → meta chips → actions. Compact single-row variant.
- **Section header**: teal bar + numbered title 800 + optional label/action; collapsible.
- **Callouts** (open layout, chip label + text): NOTE info · TIP accent · IMPORTANT ink · WARNING warn · REQUIREMENT outline+REQ-id · EXAMPLE note · LIMITATION crit. Boxed SUMMARY variant with 4px teal left border.
- **Cards**: summary · key-concept · metric (value + trend chip) · related-content row (relationship chip) · featured (L2 reserved).
- **Lists**: bulleted (teal •) · ordered (mono 01/02) · task/checklist (progress bar, teal ✓ boxes, strike + weight-300 done) · definition list (def chip + term 800) · reference list (INT/EXT/PDF chips, dotted dividers).
- **Inputs & fields** (Foundations §13): text field (default / error / disabled), select with mono ▾, search pill with ⌘K hint chip, filter-chip buttons. Field text 14.5/600; placeholder black 40% opacity italic (::placeholder reset); error = 1.5px crit border + labeled crit chip; disabled = track fill + hairline + not-allowed cursor. Radius: fields 8, search/chips 999.
- **Tables**: fully mono; title above frame; #f1f1f1 header; #fafafa zebra rows (R8 — dotted row dividers retired in tables; radius 6, ~10px stripe bleed past text); hover wash; status chips in cells; em-dash weight-300 empties. Comparison variant: teal wash on recommended column + ★. Mobile: rows collapse to label/value cards.

## Template inventory
- v0.1: design-system documentation shell (sticky mono nav + 1060px sections).
- Built (Templates page + T1–T5 sample pages, all cross-linked): **topic overview** (subtopic cards, featured L2, browse-by-type groups, related-topic pills) · **framework detail** (TOC rail 216px sticky, goal→signal→metric grid diagram as L2, use/not-for, numbered implementation, worked example, limitation callouts) · **process detail** (preconditions, 6-step stepper with role chips + IN/OUT mono lines + decision-gate chip, stop-condition callouts, pre-launch checklist as L2) · **implementation guide** (objective, phase cards — current = L2, workstream table, risk callouts with severity, metric cards with progress tracks) · **learning module** (module progress header, objectives with Bloom chips, outline with done/current states, lesson section with inline definition, concept map strip, answered knowledge check as L2, black summary card) · **metric detail** (value hero as L2 — 900-weight value, semantic trend/target chips, 12-week trend bar-strip with dotted target line + semantic breach bar; formula block, alert-band table, measurement meta grid, related metric cards) · **comparison** (option profile cards with strengths/tradeoffs, criteria table with recommended teal-wash column + ★, ADR-style verdict as L2, deviation guidance rows) · **roadmap detail** (full-width; quarter × track board with current-quarter wash, active/planned/done bars + legend; next-milestone L2 with exit-criteria checklist; milestone table; severity risk callouts; horizontal anchor-pill TOC) · **reference** (naming-rule rows with code chips, required-fields + catalog tables, canonical payload as L2, INT/EXT/PDF reference list).
- Shared anatomy (specced on Templates page §02): sticky header → breadcrumb+meta → content ≤70ch (+ optional sticky rail) → related → pager. Rules: breadcrumb depth ≤3 · TOC at 4+ sections · at most one L2 per page · every leaf ends with pager · related = key-concept cards.
- Template-demo chrome: black mono strip chip in sticky header ("TEMPLATE NN · NAME"); footer names template + sample content.

## Visualization inventory
- Diagram grammar (shared vocabulary): step / terminal / decision-diamond / data-store / entity / emphasized-×1 nodes; flow (solid), data (dotted), labeled edges; dashed group boundaries. New flowchart species (EPC, SDL, document, use-case, product) compose from this grammar.
- Built (Diagrams page): process flow (decision + rejection loop), user flow (screens + action-labeled edges + merge), DFD Level 0 / Level 1 (tabbed, entities/processes/stores), decision tree (live path walking + backtrack), system flow (dashed boundaries), concept map (live node inspection, solid=dependency dotted=association), taxonomy tree (live expand/collapse, selected node, long-label truncation), maturity model (achieved/current/target), diagram selection guide.
- Built (inline elsewhere): swimlane (Structured §02), phase timeline (Structured §05), 2×2 matrix (Structured §03), progress-to-target (Structured §06).
- Every diagram carries a text alternative and horizontal-scroll responsive behavior.
- Complexity tiers: T1 inline (≤7 nodes, in reading flow) · T2 panel (8–20 nodes, full-width + side-scroll) · T3 canvas sub-page (20+ nodes: layered architectures, ecosystem maps, multi-return DFDs; mandatory table alternative).
- Flowchart-type coverage: 9/14 of the reference index built (process, swimlane, workflow, data flowchart, DFD, system, decision tree, flow diagram, process map); document/SDL/use-case/EPC/product marked as grammar compositions — build on demand.
- Pending: distribution/composition metric charts (trend bar-strip built — T6 hero: black weekly bars, dotted target line, semantic breach bar, teal current bar), per-viz empty/print states, deep-zoom concept exploration.

## Assumptions & unresolved
- Semantic categories are remappable labels; new categories reuse the 3 chip chromes.
- Dark mode deferred; black/white polarity rules invert cleanly by design.
- Content schemas follow the implementation brief; new fields should map to existing chrome (chips, meta grid, callouts) before new components are invented.
- Accessibility: focus ring = 2px black outline offset 3px; touch targets ≥44px on touch viewports; reduced-motion pending implementation pass.
