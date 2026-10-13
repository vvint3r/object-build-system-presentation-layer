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

## Capability coverage (round 17, 2026-08-08) — SUPERSEDES the round 15/16 taxonomy numbers
**50% built** of 256 presentation capabilities (129 built / 44 partial / 83 missing; 59% counting partials at half). Cross-check: **51%** of the 588 translatable corpus rows render today (297 ready / 168 gaps / 117 blocked / 6 needing a ruling). Ledger: `content-morphia Taxonomy Audit.dc.html`; data in `taxonomy-audit-data.js` (v2 — regenerate, never hand-edit).

### Historical (superseded)
## Taxonomy coverage (round 15 audit, 2026-08-07)
**45% built** of the 506 items this system is answerable for (228 built / 82 partial / 196 missing). Full ledger: `content-morphia Taxonomy Audit.dc.html`; scored data in `taxonomy-audit-data.js`. Distinct from the brief-weighted 80% below — different denominators, both reported, never blended.

## Coverage index vs implementation brief (2026-08-02)
Scope source: `uploads/Claude-Design-Instructions.md` (the 8-layer implementation scope), tracked here.

**1 Foundations — ✅ built.** Typography, spacing (breathing floors), layout, radius, color semantics, depth two-family ladder S1–S3 + L1–L3, interaction states, focus. Deferred: stroke iconography, motion spec, dark mode.
**2 Core content components — ✅ built.** Content header (full/compact), section header (collapsible), callouts (7), summary/key-concept/metric/related cards, checklist, definition + reference lists, tables (data/comparison), taxonomy labels, metadata group, status/requirement/difficulty indicators, tabs, buttons. Foundations §12: overview block (purpose/scope in-out/outcomes/audience/effort/related), prerequisite block (typed rows KNOWLEDGE/TOOL/TASK, met-circle + MET/OPEN mono, teal progress track), example block (collapsed + expanded states; INPUT/OUTPUT mono panels; black KEY TAKEAWAY strip — emphasis strips are black, never teal), use-case block (CONTEXT/PROBLEM/APPLICATION/PROCESS/OUTCOME field grid, inline numbered mini-stepper, 900-weight outcome metric).
**3 Structured-content components — mostly built.** ✅ Process (3 views + decisions), workflow (cards + swimlane), framework (pillar/layered/sequential/matrix), method, roadmap (phases × tracks), metric (detail + progress), comparison (cards; table in foundations), requirement, evaluation, learning objectives, knowledge check (single choice), learning progress. ⬜ Model component, cyclical framework, comprehension summary, knowledge-check variants (multi, T/F, reflection).
**4 Visualization library — ✅ built.** Diagram grammar + process flow, user flow, DFD L0/L1, decision tree, system flow, concept map, taxonomy tree, maturity model, selection guide (Diagrams page); swimlane/timeline/matrix/progress inline; 23 families over five pages with capacity tiers and the level model; the chart family and its four empty conditions (Charts). Empty and print states both closed — printed form per tier on the Print page (R25.7–R25.8). Nothing outstanding.
**5 Page templates — ✅ built.** Templates index page (§01 index cards, §02 shared anatomy, §03 nav specimens) + nine full sample pages: T1 topic overview (Experimentation), T2 framework detail (HEART), T3 process detail (A/B lifecycle), T4 implementation guide (platform rollout), T5 learning module (statistical inference), T6 metric detail (data freshness), T7 comparison (stats engine choice), T8 roadmap detail (platform FY27), T9 reference (event taxonomy). Complete — pager-chained T1→T9→hub.
**6 Navigation & discovery — mostly built.** ✅ Breadcrumbs (≤3 levels, spec + live on T1–T5), sticky section nav, tabs, local TOC rail (spec + live on T2), prev/next pager (all leaves), progress indicator, related-content strip, browse-by-type groups (T1), related-topic pills, learning-path resume ("you are here", T5). ⬜ Search results, faceted/filtering browse, recently viewed/saved.
**7 Interaction patterns — partial.** ✅ Expand/collapse, tabs, progress-enabled checklist, quiz feedback/retry. ⬜ Accordions, sorting, filtering, overview↔detail switch, definition popovers, diagram exploration.
**8 Documentation — partial.** ✅ This spec + inventories + assumptions. ⬜ Per-component anatomy/fields/usage docs.

## Docs-demo-v4 module audit (2026-08-03)
Coverage of the user's original docs-demo-v4 module set:
- ✅ Covered: summary/definition/key-insight callouts (Foundations §08 SUMMARY box, def list, §12 black KEY TAKEAWAY strip) · badges incl. inline-in-prose (Foundations §06, T9 naming rules; labels remappable) · 2-col / 2×2 text layouts (T7 option cards, Structured §03 matrix, §12 field grids).
- ⚠ Partial: code (inline code chips + T9 canonical payload + §12 INPUT/OUTPUT panels; NO filename-bar code-block module, syntax coloring needs a rule ruling — colored text is currently banned) · charts (bar trend strip + tokens only; line/scatter/composition + tabbed switcher pending) · heading ladder (H1 masthead + H2 § bars only; no H3–H6 depth encoding) · content layouts (work but not documented as a reusable layout-primitive family).
- ✅ Built this round: figure/image module · video embed · code block (filename bar + badge; syntax = weight-only pending option-B ruling) · inline highlight system (semantic washes + teal key-concept underline; non-teal underlines pending ruling) · tech reference labels (interim glyph tiles pending icon set) · H2–H6 heading ladder (Foundations §14–§15).
- ⚠ Still partial: charts (line/scatter/composition + tabbed switcher pending) · layout-primitive family undocumented.

## Pre-flight checklist — SUPERSEDED (round 20)
The runnable gate is `content-morphia Selection.dc.html` §03: 39 checks in six passes (count · tokens · depth · hierarchy and labels · composition · chrome and access), passes 1–3 ship-blocking. The ten-line version that lived here predated R12, R18 and R19 and was never run against output.

## Round 7 changelog (2026-08-02)
Review queue closed (items 01–11): focus ring + button reset in every helmet; div interactives → real `<button>` (tabs, quiz, checklist, collapsible, tree chips, concept nodes) + keyboard on taxonomy rows; rails → top strip ≤1150 with min-width releases (T2/T6/T7/T9) and global 640 stack rule; T9 refs rows → grid units; type floor swept (7–8.5px → 9–9.5px, ~300 declarations); radius 10→12, 5→4 everywhere; semantic chips bordered; two-row doc-page headers; h1/h2 + aria pass (role="img" diagrams, aria-current crumbs, aria-pressed/expanded state); chart tokens + inputs §13 + this checklist specced; T7 ± glyphs mono black; Structured teal + → black; T4 lead at 15.5px (experiment); Options archive banner.

## Round 8 sweep + gap modules (2026-08-03, this session)
**Per-page tranche COMPLETE** — all 13 live pages carry R8: hairline #ebebeb everywhere · S-tier assignment (rail TOCs → S3 borderless; primary cluster cards → S2: Foundations §12 overview + expanded example, Structured §06 metric + §09 quiz, T1 intro one-surface, T2–T5 worked-example cards, T6 formula block) · 1B corner brackets replace grey sub-tiles (Foundations §12 + example INPUT/OUTPUT, Structured stepper, T2 example) · zebra #fafafa rows replace dotted dividers in ALL data tables (Foundations §11 ×2, T4 workstream, T6 alert bands, T7 criteria, T8 milestones, T9 fields + catalog, Diagrams §10 guide) — dotted dividers REMAIN sanctioned for list/checklist/field rows · breathing floors swept (gaps 14→16, panels 22→24, tiles 18→20, label gaps ≥10).
**Gap modules built** — Foundations §14 Media & code (figure mat S1 + caption · video embed mat + play glyph · code block: filename bar + language badge + ink body, syntax option A = weight-only · tech reference labels with interim glyph tiles) and §15 Prose emphasis & headings (5 semantic-wash highlights + legend + prose sample · teal key-concept underline · heading ladder H2–H6, one shrinking bar). Old §14 expansion notes → §16.
**Open rulings for user:** (1) code syntax option B — semantic hues on ink (rule-1 exception, specimen tagged OPEN) · (2) non-teal "track this" underlines (tagged OPEN) · (3) stroke-icon set for tech labels.

## Round 8 (2026-08-03) — RATIFIED
All four decisions approved (D1 · D2 tiers · D3 = 1B brackets · 2A one-surface clusters + inset dividers + zebra tables) and folded into tokens/rules above, plus **breathing floors** for the user's global crowding note. Mechanical sweep done: #e4e4e4 → #ebebeb across all 13 live pages + Review (Options + the proposal page keep their historical values). **Per-page tranche**: ✅ Foundations (§03 floors noted · §04 rebuilt two-family · §11 zebra · §12 overview→brackets + S2, example expanded→S2, brackets on INPUT/OUTPUT · spacing floors swept) · ✅ T1 (intro duo → one-surface S2 module w/ inset vertical divider · audience pill demoted to meta · card padding/gap floors). Remaining: T6/T7/T9 (table-heavy) → Structured/Diagrams → T2–T5/T8 → Templates.

### Original proposal record
`content-morphia Depth & Density.dc.html` proposal page. User verdicts: **D1 APPROVED** — hairline #e4e4e4 → #ebebeb where structural · **D2 tiers APPROVED** — S1 `0 1px 2px rgba(0,0,0,.06)` / S2 `0 4px 14px rgba(0,0,0,.08)` / S3 `0 14px 28px -6px rgba(0,0,0,.11)` (soft = structure at rest, hard = emphasis/interaction; a surface carries a hairline OR a soft shadow, never both) · **D3 APPROVED — 1B corner brackets** (14×14, 2px black L + mono label) replace track fills for sub-blocks inside a module. **Open: 2A** — cluster treatment revision: sibling sections of one module share ONE white surface (soft shadow) split by #ebebeb hairline dividers, no inner enclosures/fills; separate enclosures reserved for independent peers. Refinements: section dividers are INSET (stop at the module's content padding — never edge-to-edge); tables drop dotted row dividers for #fafafa zebra stripes (alternating rows, radius 6, 10px horizontal bleed past text). Sweep of all 14 pages runs on 2A sign-off; tokens here update then.

## Recommended next steps (priority)
0. Per-page tranche of the ratified R8 language (S-tiers, brackets, one-surface, zebra, breathing floors) — Foundations first; then build docs-demo gap modules (figure, video, code block + syntax ruling, highlights/emphasis, tech labels, H3–H6 heading ladder).
1. Distribution/composition metric charts (tokens ready) 2. Knowledge-check variants (multi, T/F, reflection) + model component 3. Search results + faceted browse (field set ready, Foundations §13) 4. Per-component anatomy/fields/usage docs 5. Motion spec + reduced-motion pass 6. Body 15.5px verdict after reading T4.


## Round 9 (2026-08-06) — Diagrams at scale (v0.3 wave 0)
Research pass (Eraser 5 families · Mermaid ~29 types · Lucidchart catalogue · C4 · DFD levelling) established that our diagram library was complete on *grammar* and empty on *scale*: 10 built types, all T1/T2, no T3 specimen despite the tier claim.

**Decisions taken (agent-owned, user answered "decide for me"):** order = scale before breadth · levels UI = breadcrumb-style level strip, descend from a node, crumb to return · page split = Diagrams (grammar + core types) / Diagrams at Scale (rules + T3 canvas) / Diagrams II (extended families, wave 1–2) · all three round-8 rulings stay STRICT — code syntax weight-only (option A), teal-only underlines, 2-letter glyph tiles retained. Rule 1 and rule 2 are not widened.

**New page `content-morphia Diagrams at Scale.dc.html`** — §01 capacity · §02 levels · §03 legend + registry · §04 edges · §05 live canvas · §06 coverage.

### Capacity ceilings (RATIFIED)
- T1 inline ≤7 nodes — text alternative; one edge kind; no groups.
- T2 panel 8–24 — + legend at ≥3 node types; ≤2 groups; edge labels only while ≤12 edges.
- T3 canvas 25–80 — + level switcher, node registry, focus mode, fit control, collapsible groups.
- **80+ is illegal in a single view.** Decompose into levels.
- Node label truncates at 24ch (full name lives in the registry, never tooltip-only). One fixed node width per canvas — never content-sized.
- Density floor: node 196×62, column gap 64, row gap 26. Minimums, not suggestions.

### Level model (RATIFIED)
L0 context (5–12 nodes, no technology names) → L1 containers (15–40, lineage lives here) → L2 components (8–25, built selectively). Descent is initiated from a node carrying a descend chip; the crumb strip records the path, current crumb is the only bordered one (white pill + 1px black + 2px 2px 0 teal), earlier crumbs return and clear focus/filters.

### Legend + registry (RATIFIED)
Legend mandatory at ≥3 node types, pinned top-right of the panel on a #fafafa tile, never floating over the drawing. Node type set (5): actor (white/1.5 black/r4) · external system (white/1.5 dashed black/r12) · service (#f1f1f1/r12) · data store (#f1f1f1 + 2px black top+bottom rules/r0) · pipeline job (#f1f1f1 + 3px teal left bar/r12). Registry table required at T3: id · full name · type · layer · owner · in·out degree; zebra rows; focused row takes a teal .25 wash. Registry is the source of truth, canvas is the view. Ids double as the off-page-connector vocabulary.

### Edges at scale (RATIFIED)
Orthogonal only, corners rounded 10px, one turn band per column gap; leave source right-centre, enter target left-centre. Return edges drop below the last row into a dedicated band (dashed 6/5). Weight encodes magnitude in exactly three steps — 1.5 / 2.5 / 4 — named in the legend; this is how lineage reads without a second colour. Crossing budget 3 per view, then reorder / group / cut to an off-page connector (black id chip). Edge labels only while ≤12 edges in view.

### Authoring model (RATIFIED)
Diagrams at T2/T3 are declared as node/edge JSON in the DCLogic class; geometry is computed deterministically from col/row (no DOM measurement) and rendered through `sc-for` into real template DOM — absolutely-positioned button nodes + one SVG path layer. Hand-inlined absolute divs are retired above ~15 nodes. Focus/filter/collapse/search are state, not markup.

### Live canvas §05
NodeTrak analytics platform, one map at three levels: L0 9 nodes / L1 23 nodes + 3 collapsible boundaries / L2 12 nodes. All seven requested interactions ship: level switcher, click-to-focus (neighbours stay, rest drop to .14), collapse/expand groups (edges remap to the group node), layer filter chips, fit-to-width toggle, paired registry table, search.

### Family coverage (§06, 27 families)
Built 13 · Queued 10 · Parked 4. Wave 1 (technical): sequence, entity relationship, state machine, architecture layers, deployment/network topology. Wave 2 (business/learning): journey map + service blueprint, Sankey, mind map, Venn, fishbone, BPMN subset. Parked pending content need: Gantt, git graph, kanban, class/code.


## Round 10 (2026-08-06) — Wave 1 technical families
New page `content-morphia Diagrams II.dc.html`, all five built on the round-9 JSON authoring model (node/edge data in DCLogic, geometry computed from col/row, rendered via sc-for + one SVG path layer). Shared helpers now stable: `ortho(a,b)` picks exit/entry sides from relative position and returns an orthogonal path with 10px corners; `mid(a,b)` returns the label anchor; `grid()` maps col/row to pixels.

- **§01 Sequence** (T2, 5 lifelines / 9 messages). Only diagram where vertical position carries meaning, so lifelines are dotted #d9d9d9 rather than a node grid. Solid = call, dashed 6/5 = return, self-message turns right and returns (never a loop over the lifeline). Numbered mono chips. Live step-through: prev / next / show-all, current message chip takes a 1px black border, future messages drop to .12.
- **§02 Entity relationship** (T2, 5 entities / 24 fields). Entities are field tables, not named boxes: black mono header bar + zebra field rows + PK (black fill) / FK (white + 1px black) key chips. Cardinality chips (1 / N) at both ends of every relationship — crow's-foot notation deliberately not adopted, it does not survive the mono/geometric vocabulary. Star schema layout does the explaining.
- **§03 State machine** (T2, 6 states / 7 transitions). Initial = 14px black dot, terminal = double border via inset box-shadow. Dashed transitions are reversals. Click-to-isolate a state (in/out transitions stay, rest to .16) with a live prose note under the canvas.
- **§04 Deployment topology** (T2, 9 nodes / 3 zones). Trust boundaries drawn first, nodes inside. Every boundary-crossing edge carries its port; zone chips sit top-RIGHT of the zone (moved from top-left to stop colliding with incoming edges).
- **§05 Layered architecture** (T1, 6 layers). No edges at all — vertical order is the argument. Template markup, not data-driven. Cross-cutting concerns in a dashed column: "applies at every layer, owned at none."

Coverage after wave 1: **17 built / 6 queued / 4 parked**. Remaining queue is wave 2 — journey map + service blueprint, Sankey, mind map, Venn, fishbone, BPMN subset.

### Edge anchoring (R10 addendum, RATIFIED)
Anchoring every edge at the midpoint of a node side is wrong as soon as two edges share that side — reciprocal pairs collapse into one visual and fanned relationships stack their labels. Rule: **anchors fan along the side they share.** `anchorSet(pos, edges)` groups edge ends by node+side and distributes them across 22%–78% of that side's extent (single edge stays at 50%); paths and labels both derive from the fanned anchor, never from the node box. Corner radius clamps to half the shorter leg so short offsets do not produce reversed arc segments. ### Obstacle-aware routing (R10 addendum, RATIFIED)
Turning at the midpoint between two anchors is only safe for adjacent columns. Across a gap, the leg runs through whatever sits between — and because nodes paint above the SVG layer, the edge is *hidden* rather than visibly crossing, which is worse than a crossing: the reader sees a fragment emerging from the wrong box and infers a relationship that does not exist. Rule: **the turn band is chosen, not assumed.** `pickBand` scores candidate bands (midpoint, six span fractions, and the centre of every clear gap between blocking boxes) by how much of the resulting three-leg path lies inside a node box, and takes the lowest-penalty band, breaking ties toward the midpoint. Source and target boxes are excluded from their own obstacle set. Edge labels anchor on the chosen band (`labelA`), never between the node anchors, so a re-routed edge keeps its label on the line. Corner radii clamp to both legs.

Shared helper set for all data-driven diagrams: `sideOf` · `anchorSet` · `segHit` · `pickBand` · `pathA` · `labelA` · `midA` · `offA` · `obstacles`.


## Round 11 (2026-08-07) — Wave 2a: experience & magnitude
New page `content-morphia Diagrams III.dc.html`. Three families that the node/edge grammar could not carry, all of them **lane diagrams**: a fixed 100px mono rail on the left, fixed 160px phase columns across the top, 12px gutters — one 960px canvas grammar shared by all three, so the three specimens align column-for-column.

- **§01 Journey map** (T2, 5 phases / 5 lanes). One person, one arc. Lanes: actions (white S1 tiles) · touchpoints (neutral chips) · emotion · pain · opportunities (both borderless text, marked once in the rail). Click a phase to isolate its column — focused header takes the reserved L2 teal offset, every other column drops to .24. **Sentiment is drawn as position**: a 3-tick labelled axis (HIGH / MID / LOW, dotted #d9d9d9), a 2px black polyline, white dots with 2px black rims, plus a mono mood word per phase. No colour, no faces.
- **§02 Service blueprint** (T2, 5 steps / 4 lanes / 3 lines). Same columns as §01; the three boundary lines are the subject. Solid black = line of interaction · dashed black = line of visibility · dotted black = line of internal interaction. Each line carries a mono label knocked out of the surface, sitting on the line. "Explain each line" toggle drops a dashed annotation frame under each line describing what the crossing means (the lane row below reflows down by 60px rather than being overlapped).
- **§03 Magnitude flow** (T2, 14 nodes / 17 flows, 92M events/day). Sankey. Band width is the quantity, cubic-curved, #f1f1f1 at rest. Nodes are black 13px bars (real buttons, label beside them; last column mirrors with row-reverse). Click a node to trace: its bands go teal wash rgba(.42), everything else drops to rgba(0,0,0,.045), and a mono readout reports value plus in/out counts. Legend states scale (1px = 0.31M/day), column total and smallest band.

**Rules added (R11, folded into the grammar):**
- **R11.1 Lane rail** — lane diagrams carry a fixed 100px mono rail; lane names never sit inside the first content column.
- **R11.2 Proportional magnitude** — magnitude flow is the sole exemption from the 3-step edge-weight rule: continuously proportional width on one scale across all columns, scale + column total always stated in the legend. Every column must sum to the same total.
- **R11.3 Boundary lines are labelled** — solid = interaction, dashed = visibility, dotted = internal; no boundary line is drawn unlabelled.
- **R11.4 Sentiment is position** — emotion on a labelled 3-tick axis plus a mono mood word. Never colour, never face glyphs.

Coverage after wave 2a: **19 built / 4 queued / 4 parked**. Remaining queue: mind map, Venn, fishbone, BPMN subset — all four shipped in wave 2b (R13).

### R11 density pass (review feedback, RATIFIED)
Wynt3r's review of the first cut: the blueprint and flow canvases were crowded and the repeated semantic chips were too loud when zoomed out. Three corrections, all generalisable:
- **R11.5 Mark the lane, not every cell.** A semantic that is true for a whole lane is declared once in the rail — a 10px swatch (1px black border) beside the mono lane label — never repeated as a chip in every cell. Ten bright chips became two swatches. The chip form stays correct for cell-level semantics that vary within a lane.
- **R11.6 Boundaries do the work, tiles do not.** Where labelled boundary lines already structure a canvas (service blueprint), cells are borderless text blocks on the shared surface — no white tile, no S1 shadow. Enclosure on top of an existing boundary is the "heavy UI" failure mode. Journey keeps tiles on the actions lane only, where no line separates the columns.
- **R11.7 Magnitude canvases get height before they get nodes.** Sankey canvas 300→372px and node gaps 14→24px; the crossing count came down by one flow (Revenue now feeds Reverse ETL only). Band tangle is a spacing problem first and a data problem second.
Blueprint vertical rhythm also raised: 16→36/44px above each boundary line, cell line-height 1.55→1.7.


## Round 12 (2026-08-07) — Diagrams page retro-fit (review feedback)
Wynt3r reviewed the original `content-morphia Diagrams.dc.html` specimens (§02 process, §03 user flow, §04 DFD, §05 decision tree, §09 maturity): connectors touching nodes, inconsistency with the newer pages, "dull and flat — nothing pops", crowding, and colour doing two jobs at once in the maturity model. Three rules added, then applied across every specimen on the page.

- **R12.1 Connectors never touch.** Every connector cell carries ≥8px horizontal standoff, so a line starts clear of the node it leaves and its arrowhead stops clear of the node it points at (matching the 4px path standoff the data-driven pages already used). Loop elbows drop 15px before turning and their arrowheads stop 7px short. Vertical stubs get the same treatment. Decision-tree branches gained arrowheads — they were the only edges on the page without them.
- **R12.2 One emphasized node per diagram.** A diagram with no focal point reads as a dull aggregation. Every specimen now names its subject with **L1e** (1.5px black border + `6px 6px 0 rgba(0,0,0,.08)`): process → Publish, DFD L0 → the P0 system process, DFD L1 → 2.0 Transform. L1e (not the teal L2) is the right tool because it is unlimited per page; the reserved teal offset stays at one node.
- **R12.3 One meaning per colour, per view.** Maturity used teal for "achieved" bars *and* for the guidance chip *and* as the current-stage offset shadow — three meanings, one colour. Teal now means achieved and nothing else: the guidance chip is the neutral white/1px-black chip, and the current stage carries black fill + the CURRENT chip alone.

**R12.1 addendum — SVG edges are computed, never eyeballed.** Percentage-positioned `<line>` edges (concept map, §07) were drawn centre-to-centre, so every edge started and ended *under* a node and read as touching it. Trimming the percentages by hand fixed it at one viewport width and reopened it at another: the endpoints scale with a fluid container while the pills keep their fixed px size. Rule: **a radial/free-placed diagram gets a fixed-width canvas plus `overflow-x:auto` (like every grid specimen), and edge endpoints are computed in the logic class** — node centre, rectangle inset along the edge's unit vector (`min(hw/|ux|, hh/|uy|)`), plus the 13px standoff constant. Measured result: minimum gap 8px on every one of the five edges, stable at any viewport.

**R12.2 addendum — the reserved teal is page-wide, not per diagram.** The page carried five teal offsets at four sizes (2/3/4/5px). Now: §03 Workspace is the single untagged L2 at the canonical 5px; the §01 grammar swatch keeps 5px and carries the dashed SPEC SPECIMEN tag that exempts documentation specimens; §06 Pipelines, §07 selected concept node and the §05 reached outcome are L1e; the DFD level tabs keep the sanctioned 2px tab token. Emphasis inside a diagram is L1e — teal offset is a page-level reservation.

Also swept: chart bars back to the 3px cap radius (8px was drift) · maturity stage chips positioned from the bar baseline (`bottom`), so CURRENT and TARGET sit at a consistent height above their own bars · stage gap 16→22 · diagram frame padding 24→28 · DFD level-1 connector columns 48→60px so flow labels are not squeezed · decision-tree recede state .25→.5 (lines/chips) and .35→.55 (nodes) — at .25 a dimmed branch over a dotted line was unreadable, and heavy opacity on black text is grey text by another route.

### Round 12.4 — depth inversion (Wynt3r ruling, 2026-08-07)

The grey node fill was the single biggest reason diagrams read dull: a canvas of #f1f1f1 tiles inside a hairline frame is flat at every level. Two rules replace it.

- **R12.4 Nodes are white and lifted, not grey and flat.** Every diagram node and tile is borderless `#fff` + **S1** (`0 1px 2px rgba(0,0,0,.06)`). `#f1f1f1` is retired as a node fill and survives only where it is genuinely a *track*: segmented-control tracks, subtle-fill buttons, magnitude/progress bars, table header rows. Because every node is now the same white, **de-emphasis can no longer be a darker fill** — recede states are opacity (.55) with the shadow removed, which is what the decision tree and click-to-isolate interactions already did. Black borders keep their old job: markers only (decision diamonds, DFD entities, store rules, the one emphasized node).
- **R12.5 One depth family per nesting level.** If the children carry shadows, the parent does not. A diagram canvas holding lifted nodes drops its `1px solid #ebebeb` hairline for a **`1px dashed #d9d9d9` frame** — the frame is drawn, the depth is at the leaves. This also gives the system a legible distinction it lacked: **dashed frame = diagram canvas, hairline = content card.** (§08's tree panel is a canvas → dashed; its Behavior panel is prose → hairline.) The canvas surface also steps down to **`#fafafa`**: white nodes at S1 on a white canvas have no value step, so the shadow was doing all the work and doing it faintly. On #fafafa the same S1 node reads crisply, and the dashed frame — not a fill contrast — is what marks the canvas against the #fafafa page. Chosen `dashed` over `dotted` because #d9d9d9's dotted variant is already assigned to *dividers*, and at 1px over a 1000px span dotted goes fuzzy while dashed holds.

**R12.1 addendum 2 — loop-backs are routed, not drawn behind.** §02 and §03 both drew the return edge as one ⊔ elbow spanning the full loop, then dropped the intermediate node on top of it at `z-index:1` — so the line ran *under* "Quarantine & fix" and "Manager review". That is what read as inconsistent lines. Both are now real orthogonal routes: the loop node sits directly beneath the edge's **target**, the route enters its near side and leaves its top edge, and both ends keep the R12.1 8px standoff. Corner radius stays 12px on the single elbow of each leg.

**Edge labels vs. branch controls.** Two element classes that were being styled alike. A **label** names an edge and sits *beside* the line it names (above a horizontal, left of a vertical) — never on it. A **branch control** is an interactive selector and *does* sit on the line, with a `0 0 0 4px #fff` halo so the stroke stops clear of the pill (§05 YES/NO, Wynt3r's pick). Semantic branch chips also picked up the 1px black border rule 7 always required and they were missing.

Also swept on the Diagrams page: §01 tier ceilings corrected to the R9 numbers (T2 8–24, T3 25–80 — the page still said 8–20 / 20+) and the §01 grammar copy no longer describes nodes as fills.

## R13 — wave 2b: structure & notation (RATIFIED)
`content-morphia Diagrams IV.dc.html` — mind map, set relations, cause & effect, BPMN subset. First families authored *on* the R12.4/R12.5 grammar rather than retro-fitted to it, which is why this wave produced rulings about notation rather than about fills.

- **R13.1 Radial layouts are balanced and computed.** Leaves sit on a fixed pitch (42px); each branch is placed at the centroid of its own leaves; branches split left and right of the subject so the map balances. Nothing is nudged by eye. **No label is ever rotated** — horizontal text at every ring is what separates a readable decomposition from a decorative one. Mind-map edges are **undirected**: no arrowheads, no labels. A mind map that grows arrowheads has become a flow and must be redrawn as one. Edges are bezier (the one curved-edge family), still at the R12.1 8px standoff both ends.
- **R13.2 Overlap depth is the only thing colour counts.** Set diagrams cap at **three sets** (four circles cannot draw all sixteen regions). Circles are `rgba(29,233,182,.12)` fills with a 1.5px black stroke; alpha stacking produces the sanctioned ramp — one set .12, two ≈.25, three ≈.32 — so overlap *depth* is membership *count*, readable before any number. Region counts are 900-weight numerals placed at computed region centroids, **never labels**: the pair and triple regions of a symmetric Venn are only ~60px wide, so any label placed inside overflows into its neighbours. Set names go in the wide "only" lobes; region names live in the readout. **The population outside all sets is always stated** — an unlabelled outside is the most common lie in a Venn diagram.
- **R13.3 The diagonal is notation, not a shortcut.** Cause-and-effect diagrams are exempt from orthogonal routing (R10) because the angled bone *is* the family's identity. The exemption is narrow and does not generalise: bones share one angle, all text stays horizontal, causes attach by a horizontal tick, and every bone terminates on the spine with the R12.1 standoff. The effect is the diagram's single emphasized node (R12.2).
- **R13.4 In a notation, shape carries the meaning.** The BPMN subset is six symbols — start event (2px circle), task (white + S1, radius 10), exclusive gateway (rotated 2px square), end event (4px circle), sequence flow (solid + filled arrowhead), message flow (dashed + open arrowhead). Semantics live in shape and line style **only**; the accent never marks a node type and semantic fills would compete with the notation they sit inside. A subset must declare itself in a legend the reader can toggle.
- **R13.5 Boundaries are drawn once, and named.** Pools, lanes and set circles are boundary *lines*, not containers to fill. Lanes divide with an inset hairline; a pool whose internals are out of scope is drawn **collapsed** (a single labelled node) rather than emptied. Nodes stay white and lifted inside every boundary (R12.4), so the boundary reads as a boundary and never as a card.

Coverage after wave 2b: **23 built / 0 queued / 4 parked.** The §06 queue on *Diagrams at scale* is empty; the four parked families stay parked until a content need names them. Still open on the original library page: tier badges on every specimen, and re-setting §07 / §08 on the data-driven authoring model.


## Round 15 (2026-08-07) — Q01 taxonomy audit (the v0.3 gate)
`uploads/contenttaxonomychecklist.md` scored item by item against the live inventory. New page `content-morphia Taxonomy Audit.dc.html` (§01 verdict · §02 method + scope boundary · §03 scorecard by level · §04 the 691-row filterable ledger · §05 what it adds to the queue · §06 the one ruling). Data is generated into `taxonomy-audit-data.js` and loaded from the helmet; the page is the view, the file is the record.

**Two corrections to the record.** The checklist holds **907 checkboxes, not 1083** — that figure was the file's line count. And §13 (216 items) is a condensed restatement of §§1–3, so scoring it would inflate numerator and denominator together.

**Denominator.** 907 − 216 restated − 140 in ten out-of-scope groups − 45 items ruled out individually = **506 scored**. Result: **228 built (45.1%) · 82 partial (16.2%) · 196 missing (38.7%)**; 61% counting partials at half.

**Method (RATIFIED).** Four verdicts — BUILT / PARTIAL / MISSING / OUT OF SCOPE. A BUILT verdict must name the component, page or section that earns it; the default for an unnamed item is MISSING, so silence counts against the system. Existence and rule-compliance only — quality is the round-6 review's job, not this one's.

**Scope boundary (pending ruling R-f).** Out: the commercial funnel (§1.4, §2.7), community and UGC (§1.9), corporate/legal pages (§1.11), the classification, purpose, funnel, SEO and analytics model layers (§0, §5, §8, §9, §10), and other channels (§11 email/social/sales/downloads — print overlaps and stays as Q10). 185 items total. Confirming settles the denominator; reopening a group is new work.

**Shape of the result** (built ÷ scored, out-of-scope excluded). Nano objects 66% · content structures 64% · blueprint steps 54% · CMS fields 52% · meso modules 49% · micro components 40% · macro containers 19%. The system is deep where it is built and narrow across container types: nine page templates against forty-plus named page types.

**§14 conformance — 8 of 10 built, 1 partial.** The taxonomy's own test is whether a model keeps macro / meso / micro / nano apart; ours does, and the SPEC is organised on exactly that split. Only "nano level defined and applied" is partial: atoms render but are not documented as a field family (Q18).

**Queue effect.** Q01 closes. The 196 missing items collapse into eight families, added as **Q25–Q32** (prose primitives · question-and-answer · glossary + definition template T10 · change and status · case study T11 · API reference blocks · troubleshooting and recovery · authorship and governance). Three existing items gained a count behind them: Q09 charts (17 of 25 visualisation components), Q11/Q12 search and facets (11 items), Q20 icons (three levels of the taxonomy at once). Queue 24 → 31.


---

## Round 16 — taxonomy audit re-scored (R16.1–R16.4)

The round-15 boundary was challenged and did not survive. The parse was faithful — all 907 rows come verbatim from `uploads/contenttaxonomychecklist.md` — but the scoring model on top of it had three faults. These four rules replace the round-15 scope note.

**R16.1 — A verdict class per kind of row.** Six classes, not four. BUILT / PARTIAL / MISSING score. **OUT OF SCOPE** is a surface this system will not draw. **NOT A SURFACE** is a classification axis — a dimension content is tagged with (`§0` dimensions, `§5` purpose, `§8` funnel, `§9` SEO role, `§10` measurement, and the `funnel_stage` / `conversion_goal` / `measurement_events` fields). Scoring an axis as built or missing is a category error; it is neither. **CROSS-REF** is the same item listed a second time elsewhere in the source. Only the first three enter the denominator.

**R16.2 — The scope line is content, not subject matter.** If a thing can be published as an artifact it is in, whatever domain it comes from: comparisons, alternatives, competitor battlecards, personas, industries, integrations, tool profiles, downloadables. If its job is to convert, collect or distribute rather than to inform it is out: pricing and plans, landing and lead-magnet pages, signup and lead forms, conversion modules, community and UGC, email, social, sales enablement. Ruling out a whole group is only legal when every row in it fails that test — §1.4 failed this and took seven real page types with it.

**R16.3 — Score once, show the parent path.** An item that appears in several sections is scored at its primary and marked CROSS-REF everywhere else, naming where the primary is. Rollup rows ("blueprint complete") are never items. Every ledger row displays its full parent path — the source lists Checklist as a page (§1.3), a component (§3.2) and a blueprint step, and only the path distinguishes them. Level-distinct namesakes (a §2.4 module and its §3.3 component, a §3.7 component and its §4.3 atom) are separate items, not duplicates.

**R16.4 — §13 is not carried.** The condensed master list restates §§1–3 in shorter words. It is dropped from the ledger entirely rather than held as an unscored mirror.

**Corrected result.** 907 rows − 216 (§13) − 61 axes − 19 cross-refs − 94 out of scope = **517 scored: 224 built · 80 partial · 213 missing · 43% built, 51% with partials at half.** The score fell from 45%: 29 items were reclaimed and most are unbuilt, and the old figure was flattered by axes that could never fail.

**Shape restated** (built ÷ scored): nano objects 66% · blueprint steps 61% · content structures 56% · CMS fields 52% · meso modules 49% · micro components 39% · macro containers 17% · distribution formats 0%. Macro coverage is worse than round 15 reported, because the reclaimed page types are all missing.

**Queue effect.** **Q33 Comparison and profile pages** joins Phase F — alternatives, battlecard, persona, industry and integration pages plus the profile shape behind the product/plan/review/customer cards. Nine families now, Q25–Q33; queue 31 → 32. R-f is settled and closed.


---

## Round 17 (2026-08-08) — the audit model replaced (R17.1–R17.5)

Wynt3r's challenge: the ledger's item names carried no meaning in our context. "Feature Page", "Landing Page", "Short Video" were read literally out of the reference checklist and scored as if each were a deliverable, and the in/out boundary was a pile of judgement calls papering over the mismatch. Diagnosis: **two vocabularies were being scored against each other.** The checklist names content *genres*; this system ships presentation *surfaces*. "Is Landing Page built?" has no answer — landing, product and feature pages are the same blocks in different arrangements.

**R17.1 — Capabilities are the unit of account, not genres.** The audit scores 256 presentation capabilities, each named for what it is (criteria comparison table, step sequence, metric with trend) and carrying a level: nano · micro · chart · meso · macro · struct. A BUILT verdict still must name the page or section that earns it; silence is MISSING. This is the only number the roadmap carries forward.

**R17.2 — The checklist is a test corpus, never a roadmap.** All 691 rows stay verbatim for traceability, and every row's status is *derived* from the capabilities it maps to: READY (all built) · GAPS (some partial/missing, which ones named) · BLOCKED (nothing exists). A row is never judged directly.

**R17.3 — Nothing is excluded; rows are classified.** OUT OF SCOPE is retired. A row translates into capabilities, or it is a stated fact about the row: 58 classification axes, 27 content-model fields or off-platform artefacts, 8 roll-ups, 10 §14 conformance checks. Email and social resolve as **delivery channels** — same modules, a different rendering engine — not as things we refuse to build. R-f (the scope boundary) is therefore dissolved rather than settled.

**R17.4 — Ambiguity goes back to the user, it is not guessed.** Six rows are NEEDS RULING (Marketplace Directory, Generator, Live Blog, Live Event Page, User Showcase, Illustration), tracked as R-g. Guessing them would put a wrong number in the denominator and hide it behind a chip.

**R17.5 — Two numbers cross-check each other.** Capability coverage (50%) and corpus renderability (51%) are reported together. A wide gap in either direction is the defect signal: capabilities ahead means the list is padded with surfaces nothing needs; corpus ahead means the list missed something the corpus depends on. Within a point, both can be trusted.

**Findings.** Chart types compressed 25 → 10 families (the design question is which shape of data we can draw). Missing capabilities cluster into eight families, not 83 scattered items: charts beyond one bar strip · forms and inputs · media playback · browse and search · proof and testimonial · authorship and governance · commerce shapes · page shells for glossary, status, event and profile. **18 capabilities have zero corpus demand, 17 of them built** (frameworks, learning modules, journey maps, sequence, ERD, state machines, topology, set relations, BPMN, roadmap board, maturity, progress; the eighteenth, empty state, is an unbuilt phase-B gap and is tagged as such rather than counted with them) — the sharpest evidence that the reference doc describes a marketing site and this system is not one, and the reason it must stay a corpus.

**Standing rule on user-supplied reference documents.** Uploaded lists, checklists and inventories are directional raw material, not literal specifications. Translate them into this system's vocabulary before scoring or building against them; carry the source names for traceability only. Taking one literally is what produced the round 15/16 ledger.

---

## Round 18 (2026-08-08) — product context established (R18.1–R18.3)

The R-g intent rulings returned two answers and one reframe. The reframe supersedes the questions.

**The product is a knowledge index, not a content marketing site.** Wynt3r: topics are nodes nested deeply; nodes, *and the relationships between nodes*, carry attached **context nodes**; each context node aggregates hundreds of sources and re-aggregates at intervals as net-new information comes into scope.

**R18.1 — the two answers, correctly scoped.** "Nothing updates live" means no live regions, no in-session mutation, no append-while-reading — it does **not** mean undated. Context nodes update between visits, so freshness state (last aggregated, cadence, staleness, what changed since) is load-bearing, not decorative. "No third-party content" means we host no foreign listings and no user submissions — it does **not** mean unsourced. An aggregation of hundreds of sources makes provenance, citation density, and confidence qualifiers core grammar. Marketplace Directory and User Showcase are dropped; Live Blog and Live Event Page are dropped; Generator output renders in-surface as a context-node result view, never as a file handoff.

**R18.2 — imagery ruling.** Diagrams and figures only. A node/relationship index is diagrammatic by nature; illustration slots and user-submitted showcase are out of scope. Existing figure/caption mats stay for supplied diagrams and screenshots.

**R18.3 — the demand column is invalid under this product.** Demand scores were derived from the 691-row marketing-genre corpus and rank the wrong things. Two clusters, measured against the 256 capabilities:

- **Navigate a deep index — 6 built / 2 partial / 7 missing.** Every miss is primary navigation for this product and every one is under-weighted: Faceted browsing (demand 4), Facets (1), Internal search module (1), Search results page (1), Popular & recently updated (2), Diff block (1), Version selector (1). A deeply nested index whose only wayfinding is breadcrumbs plus a partial search bar cannot be browsed.
- **Provenance & freshness — 9 built / 6 partial / 0 missing.** Nothing is absent, but all six partials are exactly the ones that carry "hundreds of sources": inline citation, data qualifier (confidence, sample size), person attribution, research finding module, library/resource centre, release notes. They were built as single-source decoration and must become aggregation-density grammar (source counts, agreement/spread, confidence, last-aggregated).

Consequence for the roadmap: **search + faceted browse and the provenance-density pass displace the Phase B queue.** Corpus rows whose only demand came from marketing genres no longer justify build order. Coverage percentages are unchanged — this reweights priority, not scoring.

## Round 18b (2026-08-27) — the implementer gap (R18.4–R18.5)

Wynt3r ran an agent build on a reference document using this system as-written. The result was poor, and the diagnosis is not a missing component: **this spec fully determines appearance and says almost nothing about selection or composition.** Queued as Q34 (spacing decision table) and Q35 (selection rules), both Phase A, both ahead of Phase B.

**R18.4 — floors are not defaults.** Spacing exists here as a legal set (4/8/12/16/24/32/48/96) and a set of minimums (breathing floors, R8). Neither answers "how far apart are these two specific things." An implementer reading "module interior padding ≥24" builds everything at 24, and an implementer with a legal scale and no adjacency rule picks by feel — both happened. What is needed is a lookup keyed on the *pair*: heading → intro, intro → first module, module → module, card → card within a grid, grid → next heading, label → its content, figure → caption, table → note. One number per adjacency, no ranges, floors retained as the violation check underneath.

**R18.5 — a component library without selection rules is not usable by an agent.** Nothing in the system maps a content shape to a component, so an agent presented with prose picks by keyword association. Four things are missing and none is per-component documentation: (1) content-shape → component mapping, read from the shape of the source material, not its topic; (2) precedence when several components fit — the comparison table vs. the comparison cards vs. the criteria matrix problem; (3) a density ceiling per view, since nothing currently forbids stacking nine modules; (4) a default composition order for each template. Q18's per-component pages remain useful for anatomy and states, but the usage half moves here — a page-per-component reference does not help an implementer who has already chosen the wrong component.

## Round 18c (2026-08-27) — the agent build, measured (R18.6–R18.7)

Wynt3r supplied the agent output (`uploads/b7-morphia-output/`, B7 "Power, Sample Size & Duration", 671,583 chars). Audited mechanically against the locked rules.

**R18.6 — the build is token-compliant; the spec's appearance layer is not the problem.** Measured: 337 colour declarations, all #000 or #fff, zero grey and zero tinted text · 75 teal uses, zero as `color` (the single `#1de9b6` hit is `text-decoration-color`) · smallest type 9.5px, nothing below the floor · #e4e4e4 absent · every radius in the legal set (3/4/6/8/12/14/999), no 5 and no 10 · all five shadow tiers canonical, zero hairline-plus-soft collisions, exactly one L2 teal offset. It followed the rulebook. What it produced is 22 h2 sections, 48 h3 sub-heads, 82 shadowed modules, 19 tables, 12 SVG figures, 102 corner brackets and 120 dotted dividers in one document — every element legal, the composition unusable. This is the direct evidence for Q35: appearance rules cannot prevent a bad build, because nothing in them constrains selection, quantity, or order.

**R18.7 — floors are read as defaults, with numbers.** In the agent build, `gap:16` (the tile-gap floor) appears 184 times, more than every other gap value combined, and `padding:24` (the module floor) outnumbers the 26 and 28 the spec prefers for primary containers two to one. The live pages show the same pull more mildly — 24 leads module padding at 61 uses against 27 at 26px and 15 at 28px. Told a minimum and nothing else, an implementer builds at the minimum everywhere. Q34's adjacency table is now drafted at `content-morphia Implementing.dc.html` — 25 adjacencies, one value each, no ranges, floors demoted to a post-hoc violation check and marked where a value sits on one.

**R-h (RATIFIED 2026-08-27) — rule 9's 4px scale is fiction.** Rule 9 states 4/8/12/16/24/32/48/96. Every `padding` and `gap` declaration across all seventeen live specimen pages was counted: **41% are off the stated scale** (540 on / 380 off). Distribution: 12 (220), 10 (138), 16 (135), 8 (108), 24 (68), 14 (51), 20 (41), 6 (35), 26 (27), 9 (26), 28 (15), 2 (13), 7 (11). **10px is the third most used value in the system and has never been legal.** The agent build matched the pages rather than the spec, correctly. Proposed: restate rule 9 as two scales by altitude — **structural** 16/20/24/28/32/48/88/96 on 4px steps for module altitude and above, **component** 2/3/4/6/8/9/10/12/14 for interior chrome, since a 4px grid cannot seat a 9.5px mono label inside a pill. One exception stays sanctioned rather than hidden: 26px primary-container padding (27 uses), because rule 5 gives primary containers a visibly deeper inset than their siblings. This describes what seventeen pages already do. Wynt3r ratified the split on 2026-08-27. Rule 9 in CLAUDE.md now reads as two scales, with 26 named as the one sanctioned off-step structural value. A value drawn from the wrong altitude is a violation from here.

**Provenance discipline (caught by the verifier, worth stating as a rule).** The first draft of R-h attributed the *agent build's* padding distribution to the live pages — the numbers were real but measured from the wrong file. On a page whose headline claim is "measured, not assumed", every figure must name the file set it came from. §01 of Implementing reports the agent build; §02 and §03 report the seventeen live pages; the two are never mixed.

## Round 18d (2026-08-27) — Q35 selection rules drafted (R18.8–R18.11)

`content-morphia Implementing.dc.html` §04–§07. The four things R18.5 named, each grounded in a measurement rather than taste.

**R18.8 — density ceilings (§04).** The unit is a **surface cluster**: one primary surface, or one grid of sibling tiles read as a single set. Tiles nested inside a cluster are not separate surfaces — an eight-tile stat grid is one cluster, eight unrelated modules are eight. Measured in that unit: live pages **52 clusters across 110 sections, 0.47 each** (1.29 on the densest, Diagrams at Scale); agent build **22 across 24, 0.92** — a 2.0× overshoot. An earlier draft claimed 4.3× by comparing a shadow-occurrence count against a cluster count; both figures are now clusters. **The density overshoot is the smaller half of the failure — the larger half is length**: 24 sections against a live average of 6.5, so 22 clusters accumulate where a typical page carries three. Ceilings now stated: surface clusters per section 2 · sections per page 8 · corner-bracket sub-blocks per page 6 (the live total is 23 across all seventeen pages, 1.4 a page, against 102 in one document) · dotted dividers per section 2 (95 across 110 sections, against 120) · charts per section 1 · tables per section 1 · surface nesting depth 2 (restating R12.5) · untagged L2 offsets per view 1 (restating R12.2 as a density rule, which is what it always was). One exemption: a catalogue page whose subject *is* its specimens declares it in the header. A teaching document is never a catalogue.

**R18.9 — shape → component (§05).** 20 source shapes across five families (sets, sequences, structures, quantities, assertions), each mapping to one component with the disqualifying condition attached. **Read the shape of the material, never its topic** — a page about a process does not get a process diagram, material that is ordered steps does. Guessing by subject is what produced 19 tables in a document whose seventeen reference pages contain zero `<table>` elements. Four rows point at unbuilt components (cyclical framework Q06, composition chart Q09, Q&A block Q26, the aggregation half of research finding R18.1) and each says so plus what to do meanwhile; a mapping that silently pointed at vapour would be worse than none.

**R18.10 — precedence (§06), applied in order, stop at the first that decides.** 01 Prose wins by default — a component is a claim that the shape carries meaning the prose cannot. 02 Fewest new surfaces — this is what 0.86 modules per section is made of. 03 No empty fields, ever — a component the source cannot fill is the wrong component however well its subject matches. 04 Items or relationships — a diagram is correct only when the relationships are what is being read. 05 Reuse over variety — variety is not a goal and reads as inconsistency. 06 Escalate once — one L2 offset, one S3 float, or one full-bleed figure per view.

**R18.11 — composition order (§07).** Content header → orientation prose → **the one thing** → supporting detail (bracketed sub-blocks, not new surfaces) → evidence → caveats at the point of risk → where next. The load-bearing item is the third: the single most important structure goes first and takes the S2 or S3 surface. The agent build put its strongest table in the nineteenth section.

Q34 and Q35 are both ratified as of 2026-08-27. R-h is closed (rule 9 restated as two scales); superseded note: originally drafted-not-ratified — R-h (rule 9's two scales) is the only one that needs Wynt3r's word, since it edits a locked rule; the ceilings, mapping, precedence and spine are new ground and take effect on the next build unless he objects.

**R12.5 correction (2026-08-27).** Building Implementing broke R12.5 twice: §01 wrapped fourteen S1 tiles in an S2 container and §03 wrapped two S1 cards in an S3 float, both without the mandated dashed frame. Both wrappers are now `1px dashed #d9d9d9` with no shadow. A third defect came from the same append: the R-h call-out was authored after an unbalanced `</div>`, putting a HARD L2 offset *inside* a SOFT S3 float — the precise combination R12.5 forbids. Now a direct child of `#sec-scale`. Verified in the DOM: zero nesting violations across all seven sections, two dashed frames, L2 parent is the section.

**Standing check for any new page.** Before delivery, walk every section and assert: no shadowed element contains another shadowed element. It is the one locked rule that authoring by append reliably breaks, because the violation only appears when a wrapper and its children are written in different passes.

**R18.6 addendum (2026-08-27).** Re-measured with the same cluster method: the agent build also has **zero R12.5 depth-nesting violations** — no shadowed element contains another, across 72 shadowed surfaces. It was better behaved on that locked rule than the first draft of Implementing itself was. This sharpens R18.6 rather than softening it: the build's compliance is not partial, and its per-section density is only 2× the system's. What made it unusable is length and selection, which is precisely what Q35 governs and no appearance rule can.

## Round 18e (2026-08-27) — R-h closed, reporting standard set

**R-h ratified.** Rule 9 now states two spacing scales by altitude: structural 16/20/24/28/32/48/88/96 (+26 sanctioned for primary-container padding) at module altitude and above, component 2/3/4/6/8/9/10/12/14 for interior chrome. The 41%-off-scale figure resolves to ~0%: the pages were right and the rule was wrong. No sweep needed. Radii are unaffected — 5 and 10 stay illegal as radii.

**R18.12 — reporting standard (Wynt3r, 2026-08-27).** The documentation is thorough and that is where it should stay: in this file. Deliverable pages he reviews are executive-level — the call, the one number behind it, the consequence of each option. Not the derivation, not the provenance note, not the audit table. Now rule "Reporting to Wynt3r" in CLAUDE.md. Practical effect: Implementing at seven sections was two or three too long for its reader; Phase C pages target ≤5 sections and lead with the decision.

## Round 19 (2026-08-29) — Wynt3r's 21-point review of the B7 agent build → 11 corrections

Source: 21 annotated screenshots of the agent-restyled B7 document (`uploads/Screenshot 2026-08-28 *.png`, one 165149). Verbatim feedback captured in chat message m0008. Triage below maps every observation to a cause and a fix. Deliverable page: `content-morphia Corrections.dc.html` (5 sections, executive level per R18.12).

### Counts taken off the screenshots (defensible, not estimated)
- **Image 10** (Money Staircase card): 14 black fills (6 right-edge value chips + 8 inline arithmetic chips) + 2 yellow ILLUSTRATIVE chips + 6 mono step labels + 6 numbered circles + 5 dotted row dividers = **25 emphasis devices in one container**.
- **Image 1** (title block): 1 black UNIT chip + 4 outlined status chips + 1 teal CASE chip + 6 alias chips + 1 black IMPORTANT chip = **13 devices above the first sentence of content**.
- 21 observations → 11 causes → **6 amend locked rules, 5 fill gaps**.

### Observation → cause map
| # | Wynt3r's point | Cause |
|---|---|---|
| 1 | label count/logic overwhelming in title block | A1 semantic+chip budget |
| 2 | module headings too small; unclear when a box gets a black outline | A2 module-title tier; also R8 L1e/L2 reservation was never stated in usage terms |
| 3 | teal bullets overwhelming, text too small, mono sub-lines drown | A6 teal ration + A2 (mono sub-lines) |
| 4 | yellow label + black bars overwhelm the row label | A6 bar geometry |
| 5 | quote-mark + labels dropped into 3 columns at random | G1 containment + G2 prose-before-containers |
| 6 | cramped Q&A; black formula no padding; underline too tight; arrow AND underline | A4 formula ration, A5 link marker, G3 divider abuse |
| 7 | black-on-black label loud; unstyled scrollbar; eye has nowhere to rest | A1, G5 chrome spec |
| 8 | heading → 4 containers with no text; grey line; random blockquotes | G2 (his own proposal), G3, G1 |
| 9 | red/green labels blend with black text; outline inside outline | A1 tint/solid split |
| 10 | why containerise a numbered list; dotted lines between items; list headings smaller than body; black chips loud | G1, G3, A2, A4 |
| 11 | table → list → container → 3 containers → shadowed container → black banner, no prose between | G1 (nesting), G2, A4 |
| 12 | diagram text overflowing nodes, arrows overlapping, tiny heading, is the border needed | G4 fixed diagram layouts |
| 13 | link underline spacing; callout inside container inside divider sandwich; random blockquotes | A5, G3, G1 |
| 14 | two figures with no title, no description, no provenance, no transition | G5 figure spec |
| 15 | IMPORTANT → CAUTION → KEY POINT stacked, unaligned, no prose between | A1 budget, G2 |
| 16 | small container heading; black formula banner; purple bar unexplained; NOTE used as a heading; grey line | A2, A4, A1 (semantic-as-heading ban), G3 |
| 17 | black bars loud; stray 70%-width italic block outside its container; KEY POINT with no transition; diagram arrows a mess | A4, G1, G2, G4 |
| 18 | PART 2 OF 4 · PRACTITIONER rendered at 9.5px — a quarter-document transition invisible | A3 part-transition tier |
| 19 | black backgrounds + containers + callouts overwhelming in Reference Implementation | A4, A1 |
| 20 | table: label as column heading, six saturated semantic labels, unstyled scrollbar, whole rows bolded | A1 (incl. semantic-as-heading ban), G5 |
| 21 | sticky TOC occupies half the viewport and travels with the reader | G5 rail cap |

### A — six amendments to LOCKED rules (need Wynt3r's word, R-h precedent)
- **A1 (rule 7) — semantic fills get two intensities.** TINT default: hue at 16–30% on white, black text, NO border (ok rgba(0,230,118,.2) · warn rgba(255,214,0,.3) · crit rgba(255,82,82,.16) · info rgba(64,196,255,.22) · note rgba(179,136,255,.22)). SOLID (full fill + 1.5px black border) reserved for a verdict, ≤1 per view. A semantic label may NEVER serve as a heading (kills img 16's NOTE-as-heading and img 20's label-as-column-header). Title blocks ≤3 status chips; aliases past 4 collapse behind a disclosure. Note: the failure is not WCAG ratio — black on #ff5252 computes ~7:1 — it is 9.5px mono on a saturated field adjacent to black body text.
- **A2 (rules 1, 3) — module-title tier.** Nunito 700 / 15px / #000 / sentence case. Root cause: rule 1 bans grey and rule 3 puts all labels at 9.5px mono, leaving mono caps as the ONLY sub-heading device. Mono is now meta-only (units, IDs, timestamps, table headers, chip text). A mono label may never be a container's sole heading. A bullet's explanatory sub-line is body 13.5px, never mono.
- **A3 (rule 9) — part/pillar transition tier.** Full-width surface, part name 900/28px, pillar + section range in mono beneath, 96px clearance above. Outranks every section title within it.
- **A4 (rules 4, 8) — formula ration.** ONE black display slab per section, ≥24px padding, only the section's defining equation. All other math inline: mono on white, 1px #ebebeb hairline, radius 6. Raw arithmetic in a sentence takes NO chip — a chip means the token is named again elsewhere. This is the deepest sweep (judgement per section).
- **A5 (rule 2) — one marker per link.** Underline 1.5px, offset 3px (was 2px/1px). Arrow prefix restricted to standalone jump lists.
- **A6 (rule 2) — teal marker ration + bar balance.** Teal bullet only in a scannable list of ≤5 peers at body size; longer/nested take a 3px black square. Magnitude bars 6px (from 10px), row label at 700, no chip inside a bar row — provenance goes below the figure.

### G — five gaps where the system was silent (take effect next build unless objected)
- **G1 containment test.** Wrap only if: one of ≥2 compared peers · a skippable aside · an interactive surface. Sequential prose, numbered lists, single passages sit on the page. Never two container levels; a container may not be a container's first child.
- **G2 heading → prose → containers.** Wynt3r's proposal, adopted. ≥1 sentence naming the group before a container group **that directly follows a heading**. A heading is never followed immediately by cards. A group following prose or another container already has context and needs no lead. (Scope narrowed from "any container group" after the verifier found the Composition page violating its own rule three times — the original wording caught pairs of sibling rule cards nested inside prose, which was never the failure in img 8. The precise rule is about the heading adjacency, not about containers in general.)
- **G3 dividers separate siblings only.** Legal only between two sibling sections sharing one surface (rule 6's inset hairline). Never heading-to-own-body, never between list items, never directly above/below a container. It was being used as a substitute for spacing.
- **G4 diagrams use three fixed layouts.** Single-column ladder · two-column with one join · decision gate. Nodes size to text; arrows run on layout axes only. No absolute positioning. Material fitting none of the three becomes a table.
- **G5 figure + chrome spec.** Figures: module-tier title, one-line description above, provenance in mono below. Scrollbars: 8px, black thumb, #f1f1f1 track (legal — it IS a track under rule 4). Sticky rail: ≤260px wide, ≤60vh with internal scroll, collapses to top strip at 1150px per rule 12.

### Cost
Cheap (A1, A5, A6 + G5 chrome): one token pass, no layout change. Moderate (A2, A3): every container heading and part transition across 17 pages. Deep (A4): per-section judgement. Options put to Wynt3r: A ratify+sweep now (2 rounds) · **B ratify now, sweep opportunistically as roadmap rounds touch each page (recommended, ~0.5 round)** · C gaps only (free, leaves ~half the complaints).

### Standing note
Two of his questions are answered by existing rules that were never written in usage terms, which is itself the finding: "when does a box get a black outline" (img 2) is R8's L1e/L2 reservation, and "why is there a purple bar" (img 16) is rule 7's note semantic. The specs existed; nothing told an implementer when to reach for them. Same shape as the Q35 gap.

### Round 19 verifier catches (fixed same round)
- §05 recommended card had a 1.5px black border welded to soft S2 `0 4px 14px` — neither depth family. Now clean L1e (`6px 6px 0 rgba(0,0,0,.08)`). Worth noting: the page arguing against unsanctioned treatments shipped one, which is evidence for how easy R8's two families are to cross by accident. Candidate for a future amendment: name the illegal combinations explicitly, not just the legal ones.
- Header status chip and §04 tier labels were pre-applying the *unratified* A1 tint outside a specimen frame. Reverted to currently-locked rule 7 (chip: #ffd600 + 1px black border; tier labels: neutral white + 1px black border). Standing discipline: an unratified amendment may only appear inside a dashed specimen frame, never as live page chrome.
- Header second-row `padding-bottom:11` — off both ratified scales, inherited from the Implementing shell. Fixed here to 12; **the same 11 exists across the library's header shells and belongs in the A1/A5/A6 token sweep.**

- §01's three count cards were all S2 in one peer cluster — rule 5 allows one primary per cluster. Dropped to S1, matching §04/§05 and the library's peer-grid convention. **Third rule-5 crossing caught by the verifier in one page, all three by accident.** That is now a pattern, not a coincidence: rule 5 lists five legal shadow recipes and no illegal combinations, and says "one primary container per cluster" without saying what a cluster is. Recommend a seventh amendment, A7 — state rule 5 as a decision (peer grid → S1 · the one primary container in a section → S2 · hero/chart/code frame or sticky rail → S3 · hard families only on hover or reserved emphasis) and name the two illegal mixes outright: blurred shadow + border, and two S2 peers side by side.

### Round 19 correction — the deliverable was a memo, not a spec (Wynt3r, 2026-08-29)
`content-morphia Corrections.dc.html` was deleted and replaced by **`content-morphia Composition.dc.html`**, a design-system reference page. His objection: sections like "Why the agent cannot be blamed for most of it", "Six amendments to locked rules", the cost breakdown and the A/B/C options are all *conversation addressed to him*, not documentation an implementer reads. A design-system page carries rules, specs, limits and specimens — nothing else.

Now rule "Deliverable pages are the design system, not a report on it" in CLAUDE.md, with the test: would an agent building a new document need this block to build correctly? If no, it does not go in the page. Banned from pages: diagnosis, blame/defence, cost, ratification status, options for Wynt3r, round numbers, change history.

Note this is the second reporting correction in two rounds (R18.12 was "too long"; this is "wrong genre"). R18.12 was under-read: shortening a memo still leaves a memo. The corrected understanding is that the page is not a report at any length.

**Composition page contents** (all 11 corrections restated as implementable rules, plus A7): §01 Hierarchy — T1/T2/T3/T4/Meta tier table, mono-is-never-a-heading, part-transition tier · §02 Emphasis — tint/solid semantic split with values, six-row per-view limit table (solid label 1 · title chips 3 · L2 1 · black slab 1/section · teal marker ≤5 · successive callouts 1) · §03 Containment — three-condition wrap test, no nesting, heading→prose→containers, dividers separate siblings only, depth-by-position table naming the two illegal mixes (A7) · §04 Math and links — one slab per section, inline math is not a chip, one link marker · §05 Figures and chrome — three-part figure requirement, bar geometry, three fixed diagram layouts, scrollbar spec, rail caps.

Ratification of A1–A7 is still open and lives here, not on the page.

### Round 19, second verifier pass on Composition
- §05's diagram container carried S1 while its three children carried S1 — the exact nesting prohibition rendered in the page's own §03 depth table. Now `1px dashed #d9d9d9`. **Fourth accidental rule-5 crossing in two pages this round.** A7 is no longer a nice-to-have: four crossings by an implementer who had just written the rule down means the rule cannot be followed as stated. Recommend A7 be ratified first, before the sweep.
- The one black display slab — the specimen for §04's own rule — had a garbled subscript (U+208D read as "z1−α(2"). Now plain mono `z_(1−α/2)`. Standing note: a specimen that demonstrates a rationing rule is the only instance of that device on the page, so it gets proofread as content, not as decoration.
- G2 scope narrowed (see above).


## Round 20 (2026-08-29) — A1–A7 + G1–G5 RATIFIED, option A (ratify + sweep every page now)

Wynt3r's call, form answer: ratify all eleven and sweep now. Also settled in the same answer: the selection matrix covers the FULL inventory (every shipped component, four fields each), and the R21 exemplar is **one page type done exhaustively**, not a whole document.

### Rule numbers assigned (now locked; CLAUDE.md carries the short form)
| New | Was | Amends | Substance |
|---|---|---|---|
| R19.1 | A1 | rule 7 | Semantic fills in two intensities: TINT default (16–30% hue, black text, no border), SOLID (full fill + 1.5px black border) = the view's verdict, ≤1 per view. A semantic fill is never a heading or a column header. Title blocks ≤3 status chips; aliases past four behind a disclosure. |
| R19.2 | A2 | rules 1, 3 | Module-title tier T3 = Nunito 700/15/sentence case. Mono is meta-only and never a container's sole heading; bullet sub-lines are body 13.5px. |
| R19.3 | A3 | rule 9 | Part/pillar transition tier: own full-width surface, 900/28px, mono pillar + section range, 96px clearance. |
| R19.4 | A4 | rules 4, 8 | One black display slab per section; all other math inline (mono on white, #ebebeb hairline, radius 6). Raw arithmetic in a sentence takes no chip. |
| R19.5 | A5 | rule 2 | One marker per link: underline 1.5px at 3px offset, OR an arrow prefix in a standalone jump list. Never both. |
| R19.6 | A6 | rule 2 | Teal bullet only in a ≤5-item peer list at body size; longer/nested take a 3px black square; none on lists with sub-lines. Magnitude bars 6px, row label 700, no chip inside a bar row. |
| R19.7 | G1 | new rule 13 | Containment test: compared peer · skippable aside · interactive surface. Otherwise it sits on the page. Never two container levels; never a container as a container's first child. |
| R19.8 | G2 | new rule 14 | A heading is never followed immediately by a container group — one sentence names the group first. |
| R19.9 | G3 | new rule 14 | Dividers separate siblings sharing one surface only. Never heading-to-body, between list items, or adjacent to a container. |
| R19.10 | G4 | new rule 15 | Ad-hoc diagrams use three fixed layouts (ladder · two columns one join · decision gate). Library families keep their own geometry. Otherwise it is a table. |
| R19.11 | G5 | new rule 16 | Figure = T3 title + one-line description above + mono provenance below. Scrollbar 8px black-on-#f1f1f1, declared in the helmet. Sticky rail ≤260px / ≤60vh, strip at 1150. |
| — | A7 | rule 5 restated | Depth by position, and the two illegal mixes named: blurred shadow + border on one element; two S2 peers side by side. |

Rule 17 (canonical page nav) was added in the same pass — see CONTINUATION "CANONICAL PAGE NAV".

### Sweep — tranche 1 (mechanical, complete)
Applied across all 22 pages with a header, plus Options:
- **R19.5** — helmet `a{}` underline 2px → 1.5px at 3px offset (22 pages); inline teal link underlines 2px → 1.5px; 14 links carrying BOTH an arrow and an underline lost the arrow.
- **R19.11 chrome** — the 8px black-thumb / #f1f1f1-track scrollbar reset was present on exactly ONE page (Composition). Now declared in every helmet (21 added).
- Anchor offsets normalised to `scroll-margin-top:126px` on every page with an anchor strip (78 sections; Templates had none at all).

### Sweep — tranche 2 (per-page judgement, OPEN)
R19.1 solid → tint is 172 solid semantic fills across the set (Review 53 · Foundations 34 · Structured 19 · T6 12 · Diagrams 5 · rest single digits). Each page keeps at most one solid as its verdict; the rest become tints. This cannot be done by pattern — it needs a read per page. Same for R19.2 (module titles), R19.4 (formula slabs), R19.6 (bar geometry), R19.7–R19.10 (containment, composition order, dividers, ad-hoc diagrams).

Order: Foundations (also needs a new tint/solid specimen pair in its semantics section) → Structured → T1–T9 → the four diagram pages → Templates → Roadmap / Audit / Review → Depth & Density → Options last (historical).


---

## Round 20 (2026-08-30) — tranche 2 swept, three deliverables shipped, four new rules

Tranche 1 (mechanical) closed last round. This round closes tranche 2 and ships the three R20 deliverables. Four new rules came out of Wynt3r's review comments on Composition / Structured / T2 / Diagrams, all of them generalisations of things he had already said once about diagram pages only.

### R19.1 sweep — 172 solid semantic fills → tints
Swept by style attribute across 19 pages plus the four runtime chip generators (Taxonomy Audit `CHIP`/`CHIP_X`, Roadmap `fills`/`rulChip`, Implementing `flagStyle`/`overStyle`, Diagrams at Scale `CHIP`). Tint carries no border; the neutral `#fff` fallback keeps its 1px black. Six pages keep exactly one solid verdict — T6 `Below target`, T8 `High`, T4 `High`, T3 `Critical`, T9 `Deprecated`, Composition `Resolved` — each upgraded to the 1.5px black border the solid form requires. Structured's one solid is the quiz result dot, which only ever renders one state at a time. Every other page now runs at zero, which is legal.

**Two exemptions, both stated rather than discovered later.**
- **Token swatch.** A swatch that names its own hex value (Foundations §01) is the palette, not a semantic fill. Same class of exemption as the dashed SPEC SPECIMEN tag on L2.
- **Data mark.** A chart bar, a legend square, a lane-rail swatch or a progress segment is a mark, not a chip: no label sits inside it, and its meaning comes from the legend. Marks keep the solid hue. Chips, callout labels and status pills do not.
- **Interactive control.** A tint chip that is also an on-canvas control (the decision-tree YES/NO) keeps its 1px black border — there the border is the affordance, not the semantic marker.

### R19.2 sweep — 55 mono container headings promoted to T3
A mono label directly inside a card, shadowed surface or hairline frame was, in 55 places, that container's only heading. All are now `<h3>` at Nunito 700/15/sentence case, keeping their authored casing (the caps came from `text-transform`, so the source strings were already sentence case). Skipped deliberately: metric-card labels above a 900-weight number (the label names the unit, the number is the content), diagram node captions, and spacing-scale specimen labels.

### R20.1 — repeated outlines on the canvas are noise
Wynt3r, on the §07 comparison cards: it is already a container because it is a different colour from the background. What he pointed at was a *grid of three identical outlined boxes*, so the rule is scoped to that: **a grid of peer cards sitting on the #fafafa page canvas is borderless white plus S1.** A single standalone card may keep its hairline, and a card on a white parent always does — which preserves the R8 60/40 mix rather than retiring the hairline. Swept: 86 peer-grid cards across 13 pages (of 133 hairline cards in the library; the other 47 are standalone or nested and are untouched). Depth nesting re-verified at zero afterwards.

### R20.2 — R12.4 was never page-scoped
`#f1f1f1` was retired as a node fill in round 12.4, but the sweep ran on the four diagram pages only. Sixty grey content tiles survived on Structured, T2, T5, T8, T1, T3 and Foundations, and three of Wynt3r's five review comments are about exactly those. Rule now reads for the whole system: **#f1f1f1 is a track and nothing else** — rails, progress and magnitude bars, segmented-control tracks, subtle-fill buttons, table header rows, hover washes, wireframe placeholder zones. A content tile is borderless `#fff` + S1, and its container takes the R12.5 dashed frame. Eleven containers were converted this round (Structured ×5, T2, T5, T8, Diagrams II, III, IV, at Scale) and the whole library now measures **zero depth-nesting violations**.

### R20.3 — the solid black banner is retired
Wynt3r: *"We have to do away with these solid black banners — way too overwhelming."* Black fill survives in five places and no others: chips and pills, the primary button, code surfaces, the one black display slab per section (R19.4), and diagram terminals. A full-width emphasis strip is now either a **corner-bracket sub-block** (KEY TAKEAWAY, Foundations §12 and T2) or **white with a 1.5px black border** (the pillar-framework base, Structured §03). The black table header on Diagrams at Scale §06 went back to the `#f1f1f1` track every other table uses.

### R20.4 — branch controls sit above the line
Round 12.4 put interactive branch controls *on* the line with a 4px white halo. Wynt3r's follow-up: the YES / NO labels still are not visible; place them above or below. Rule: **an edge label sits beside the line, and a branch control sits above it** — `translate(-50%,-100%)` at 8px clearance, no halo. The halo convention is withdrawn.

### Header wrap
The two-row header wrapped its group pills into a line with no row gap, so at ~900px the sixth pill overlapped the second row. `row-gap:6px` on the nav and `row-gap:10px` on the header row, swept across all 22 pages.

### Deliverable — `content-morphia Selection.dc.html` (new page, Composition group)
Three sections, one job: which label, which component, and what must be true before it ships.

- **§01 Label vocabulary — closed.** Seven callouts (NOTE · TIP · IMPORTANT · WARNING · REQUIREMENT · EXAMPLE · LIMITATION), each with its fill intensity, its use condition, and **the nearest label it is not** — because every wrong label observed in the B7 build was a near miss, not a wild one. Plus the six status chips, the three requirement levels, and a ten-row mapping of labels that are *not* in the vocabulary (CAUTION, KEY POINT, RULE, INFO, PRO TIP, BEST PRACTICE, GOTCHA, REMEMBER, KEY TAKEAWAY, DEPRECATED) to the sanctioned label each resolves to. This is the direct answer to R19's finding that there were no rules to break.
- **§02 Component selection matrix — 56 components, four fields each** (when · when not · what goes inside · what never does), filterable by family: containers, sequences, sets, quantities, learning, structures, diagrams, wayfinding. Extends Implementing §05 from 20 source shapes to the full shipped inventory. Three rows name unbuilt components (comprehension summary, cyclical framework, model), each carrying the warn-tint NOT BUILT marker and the substitute to use meanwhile, per the R18.9 precedent.
- **§03 Pre-flight gate — 39 checks in six passes**, ordered to be run against finished output rather than read before starting: count it · tokens · depth · hierarchy and labels · composition · chrome and access. Every item names a number or a boolean, so a pass is a fact. Passes 1–3 are ship-blocking; 4–6 are corrected in place. Interactive, with a progress track, so a run can actually be recorded. Replaces the ten-line checklist below, which predated R12, R18 and R19 and was never run.

### Deferred out of R20
R19.4 (formula ration) and R19.6 (bar geometry) still need a per-section read on the pages that carry maths and magnitude bars — neither pattern is mechanically detectable and neither blocks R21. Recorded here rather than silently dropped.


---

## Round 21 (2026-08-30) — the reference exemplar

`content-morphia Exemplar.dc.html`. The B7 source document ("Power, Sample Size & Duration", 22 h2 sections / 48 h3 / 671k chars) rebuilt as **one page type done exhaustively** — a method leaf. Seventeen pages describe the system; this is the first that shows an agent what correct output looks like. Points at it first, spec second.

**Why a method page.** The source material is a statistical method with four parameters, one defining equation, a costed design, a registered timeline, and five failure patterns. The template set had no method leaf, and the R20 matrix exposed the gap. It is also the shape that exercises the hardest R19/R20 rules at once: the formula ration, the density ceilings, the figure spec, the containment test, and the one-verdict rule.

**Structure — 6 sections against a ceiling of 8.** §01 what sizing decides (the anchor, one S2 module with an inset divider) · §02 four dials, one equation (the section's one black slab + a four-tile S1 peer grid + an IMPORTANT callout) · §03 what the design costs (the itemised invoice table + a magnitude-bar figure at the R19.6 geometry, with the full R19.11 three-part treatment) · §04 the registered timeline (the page's single L2, holding two corner-bracket sub-blocks) · §05 reading a null (its own slab + two compared peer cards + a LIMITATION callout) · §06 how it goes wrong (a numbered list sitting on the page with no containers at all, plus a NOTE).

**Measured gate run, recorded on Selection §03.** 6 sections · 1 surface cluster per section against a ceiling of 2 · 1 untagged L2 · 1 solid semantic fill (pitfall 2's `8.7× under-sized`, the document's sharpest verdict) · 1 black slab in each of two sections and none elsewhere · 0 depth-nesting breaches · 0 grey or teal text · 0 type below 9.5px · radii {4, 6, 12, 14} · 0 clickable divs · h1 ×1, h2 ×6, aria-current present. The run ships on the gate page as "a cleared run" so an implementer can see what passing looks like in numbers.

**Contrast with the agent build it replaces.** 22 sections → 6. 82 shadowed modules → 5 surfaces. 102 corner brackets → 2. 120 dotted dividers → 0. 19 tables → 1. The material is the same material; what changed is selection and quantity, which is exactly what R18.6 predicted no appearance rule could fix.

**Type-floor sweep, caught by the gate's own pass 2.** Running the gate on the exemplar surfaced 173 mono labels at 9px across 15 pages — page badges, related-card relationship lines, pager labels — all below rule 3's 9.5px floor and all pre-existing. Raised in the same pass; 9px survives only where rule 3 allows it, on chart ticks and axes. The gate found a library-wide defect on its first real run, which is the argument for it existing.

**Two gate-mechanics notes, from running it for real.**
- **Probe against the host scale, not against the authored value.** The first run reported `brackets: 0` on a page that renders two. The probe tested `borderLeftWidth === '2px'`, but the host applies a ~0.877 scale to the frame, so the computed value is 1.754px. Any pass-1 or pass-3 check written as an equality on a computed length is unreliable; compare against the authored value scaled, or test `> 1`.
- **A one-surface module with a vertical inset divider needs its own stack rule.** The exemplar shipped without one, so below 640px the divider stayed as a 144px hairline pointing at nothing with an orphan 28px indent. The per-module `@media(max-width:640px)` block that rotates the divider to `border-top` is not optional and is now on `#x1-anchor`. T1 already carried its equivalent on `#t1-intro-split`; those two are the only vertical inset dividers in the library. Added to pass 6 in practice: check 640 on any module that divides vertically.

**Cross-links.** Templates hub gains a REFERENCE BUILD card (L1e, so it reads as the emphasised entry without claiming the hub's reserved teal); the T1→T9 pager chain extends T9 → Exemplar → hub; the exemplar footer links back to the gate run.


---

## Round 22 (2026-08-30) — wayfinding + the provenance-density pass

Two deliverables, both in the Components group, both built to the R20 gate: `content-morphia Wayfinding.dc.html` and `content-morphia Provenance.dc.html`. Between them they close the seven missing capabilities in "navigate a deep index" and convert the six "provenance & freshness" partials from single-source decoration into aggregation grammar (R18.3).

### Wayfinding — five components, R22.1–R22.6

§01 search (field + scope select + result rows + empty state, live over a 15-node sample index) · §02 faceted browse (three facet groups, counts recomputed against the other groups only, zero-count values disabled not removed, removable active-filter pills, disclosure past six values) · §03 ranked entry (most read over a switchable 7/30/90-day window with 6px magnitude bars; recently updated with what-changed lines) · §04 change over time (five-version selector + diff block, three kinds as tints, first-aggregation state) · §05 the rules.

| Rule | Statement |
|---|---|
| R22.1 | Search returns nodes, not pages. Every result states type, path and aggregation state; a result without a source count is not a result. |
| R22.2 | A facet is a fact about a node, never a topic. Counts recompute against other groups but never a facet's own group; a zero-count value stays visible at .55 and disabled. |
| R22.3 | Active filters are restated above the results as removable pills. Rail state alone does not count — the rail collapses at 1150px. |
| R22.4 | Rank is a mono ordinal in its own column, never a badge. A ranked list names its window; recency is an absolute date, never a NEW flag. |
| R22.5 | A diff names what changed, not how it looked. Three kinds only — added, removed, revised — each a tint with its mono label, anchored to a section reference. |
| R22.6 | Version is a control, not a chip. The selector names the current version with its date and what it compares against, and keeps superseded versions reachable. |

### Provenance — four components, R22.7–R22.12

§01 aggregation header (four facts in fixed order; staleness derived, demonstrated across fresh/due/stale) · §02 agreement and spread (three-segment agreement bar over 214 sources, IQR strip over the 96 that quantify, minority position with its shared cause) · §03 the confidence qualifier (three levels, three thresholds each, all must hold) · §04 citation at density (markers state their count and open a panel characterising the source set by class) · §05 the rules.

| Rule | Statement |
|---|---|
| R22.7 | Four facts open every context node — source count, last aggregated, cadence, next due — above the first sentence. Staleness is derived, never stated alone. |
| R22.8 | The source count is exact. Never a range, never rounded, never "hundreds of"; discards are reported in the panel, not netted off. |
| R22.9 | Agreement and spread are both stated and neither substitutes for the other. No-position sources are counted and shown. Agreement segments are label-free data marks, so solid semantic fills are legal under the rule-7 exemption. |
| R22.10 | A dissenting minority is reported with its explanation where the dissent clusters on a shared cause. |
| R22.11 | Confidence is derived, not asserted, and attaches to a claim rather than a page. All three thresholds must hold; failing one drops a level. |
| R22.12 | A citation marker states its count and opens a panel characterising the set. The panel is the resource centre — there is no separate library page. Attribution names the accountable role, never an author. |

### Rulings folded in without a new rule number
- **Release notes** resolve as the diff block plus the version selector (R22.5/R22.6); there is no separate release-notes component.
- **Library / resource centre** resolves as the source panel (R22.12). A standalone list of everything the index has read would be a second, worse index.
- **Person attribution** resolves as role attribution (R22.12), with named individuals appearing only inside the panel where a source is a person.

### Nav
Components group is now four pages — Structured · Wayfinding · Provenance · Charts — and all four carry the `ALSO IN COMPONENTS` strip listing the others.

---

## Round 23 — carry-overs closed (2026-08-30)

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


## Round 25 — the gate run, the tier badges, and a silent renderer bug

**Q04 — the pre-flight gate, run as a static scan over all 30 live pages** (not the four diagram pages the item named). Passes 1–3 are token passes, so they can be measured rather than eyeballed. Findings and fixes:

| Finding | Count | Fix |
|---|---|---|
| `#f7f7f7` hover wash — off the sanctioned grey set | 16 (Diagrams §10, Foundations §11 + tables) | → `#f1f1f1`, which rule 4 already names as the hover wash |
| `#e6e6e6` control hover | 7 (tabs, subtle buttons, tree reset) | Inactive tabs on an `#f1f1f1` track hover to `#fff`; subtle-fill controls take the L1 lift instead of a darker fill |
| Mono labels at 9px against the 9.5 floor | 85 across 11 pages | Swept to 9.5. Ticks may sit at 9 but 9.5 is legal there too, so the sweep is uniform |
| Hover lift at `rgba(0,0,0,.25)` | 1 (Foundations secondary button) | → `.18`, the R8 L1 value |
| Second untagged L2 on Diagrams | 1 (§03 user-flow emphasis) | → L1e. R12.2 always required emphasis to be L1e, not the reserved teal; the §01 token specimen keeps its dashed SPEC SPECIMEN tag |
| `#e4e4e4` on Implementing | 1 | Confirmed false positive — it is a checklist row whose *text* names the retired token |

Remaining solid semantic fills (Foundations 6, T6 3, Taxonomy Audit 3, T8 2, Structured 2, Diagrams III 2) were vetted in R20 as token swatches, data marks and one-verdict pages; not re-litigated. Off-palette hexes: zero after the sweep.

**Q02 — tier badges.** 21 specimens across the five diagram pages now carry a mono chip stating tier and node count: Diagrams §02 7 nodes · §03 5 · §04 L0 4 / L1 7 · §05 5 · §06 8 + 4 boundaries · §07 6 nodes / 5 edges · §08 20 rows / 4 groups · §09 5 stages; Diagrams II 5 participants / 5 entities / 6 states / 9 nodes / 5 layers; III 5×5 phases-lanes, 5×4 steps-lanes, 14 nodes / 17 flows; IV 20 nodes / 3 sets + 7 regions / 19 nodes / 8 nodes + 3 lanes; At Scale §05 9 · 23 · 12. The §07/§08 half of Q02 needed no work: both were already node/edge data rendered through `sc-for` (the concept map computes edge geometry from a six-node registry; the tree renders 20 rows from a group/item structure). Counts were read from the data, not estimated.

**A silent renderer bug, found while building Anatomy — and it had shipped.** `<sc-for>` placed inside `<table>`/`<thead>`/`<tbody>` is foster-parented out of the table by the HTML parser, so every hole inside the loop resolves to nothing and the rows render blank. Affected, live, unnoticed: **Implementing §02 the 25-row adjacency table, §04 density ceilings, §05 shape→component, §07 composition spine · Composition §01 type tiers, §02 device limits, §03 depth positions · Interaction §02 the sortable register.** Eight blocks — the entire evidential content of the implementer guide. All eight rebuilt as grid rows (one `grid-template-columns` repeated per row, zebra and radius on the row); all four pages now load with zero runtime warnings. Rule added to CLAUDE.md's environment section, because nothing in the visual language caused it and nothing in the visual language would have caught it.

**Roadmap re-baselined.** Layer completion re-scored against what R23/R24 actually shipped: foundations 95 · core 100 · structured 95 · visualization 90 · templates 100 · nav 95 · interaction 90 · docs 80 → weighted **93.8 → 94%** (was 80%). Queue: 17 items flipped to done with their evidence named (Q02–Q09, Q11–Q19), Q10 narrowed to print states only, three rulings closed on the tracker (R-a code hue, R-b non-teal underlines, R-i the 11 corrections). v0.3's three gates are met; v0.4 is in progress. Open rulings: three — stroke icon set, body at 15.5px, and the ecosystem-map offer.


## Round 26 — the printed form (R25.1–R25.10)

Closes **Q10**, the last item before v0.4. Deliverable: `content-morphia Print.dc.html`, in the Composition group (now five pages: Composition · Implementing · Selection · Anatomy · Print). Five sections — §01 what paper removes and the print contract · §02 one printed value per token, 26 tokens in five classes, filterable · §03 diagrams on paper by tier, switchable T1/T2/T3 · §04 every control resolved or removed · §05 the ten rules.

**Why print needed a page and not a stylesheet.** The queue item read "print states" as a per-visualization property, which is how it sat unbuilt for eleven rounds — there is no such property. Print removes three things (interaction, blurred depth, colour on a monochrome device) and every one of them is a system-wide substitution, not a per-component variant. Writing it per component would have produced 75 answers to one question.

**The contract, and why it was already met.** Rule 7 has always required a mono label beside every semantic fill, and rule 2 has always required an accent mark to be redundant with a shape or a position. The consequence, never previously stated: printed in greyscale this system loses emphasis and no information. That is the strongest claim on the page and it cost nothing — it was already true. The one place it forced a decision was semantic tints: five hues at 16–30% flatten to five indistinguishable greys, so all five print at one value (14% black) and the mono word carries the distinction, on paper as on screen.

**The tier-3 answer** (what Q10 actually named). A 25–80 node canvas has no legible printed scale. It decomposes by the level model it already carries: worked against the live ecosystem canvas — sheet 1 L0 (9 nodes), sheet 2 L1 (23, at the tier-2 ceiling), sheet 3 L2 (12), sheet 4 the 44-row node registry. No printed sheet exceeds 24 nodes; cross-sheet edges terminate in off-page connectors carrying a **sheet number and node name**, never a node id; the registry is not optional, because without it four levels are four unrelated pictures.

| Rule | Statement |
|---|---|
| R25.1 | Print resolves state, never freezes chrome. Every control renders in the state it held with that state stated in words, or it is removed. Nothing prints inert. |
| R25.2 | Blurred depth does not print. S1/S2/S3 → 0.5pt rule at 20% black; L1e, L2 and L3 print as drawn (solid ink); L1 is a hover state and has no printed form. |
| R25.3 | Greyscale is the design target, not a fallback. Every accent mark is redundant with a shape, a position or a label; every semantic fill carries its mono word. A mark that fails this is redrawn, not reprinted in colour. |
| R25.4 | One printed value per token, fixed in §02 and never chosen at print time. Printed measures are stated in points and percentages of black. |
| R25.5 | Type converts once at 0.75 and rounds to the point: body 11pt, T3 11pt bold, T2 21pt, T1 33pt, mono 7.5pt. Print floor 7pt, ticks and axis labels included. |
| R25.6 | Nothing breaks across a sheet that must be read as one object — figure with provenance, callout, code block, table row, diagram, step. A table that must break repeats its header and says it is continued. |
| R25.7 | A diagram is scaled only while every label holds 8pt. Past that it decomposes by the level model — never shrunk further, never cropped, never split anywhere but a level boundary. |
| R25.8 | No printed sheet carries more than the tier-2 ceiling of 24 nodes; a decomposed diagram prints its node registry. Off-page connectors carry the target sheet number and node name. |
| R25.9 | A printed link is text. Cross-references print §NN and sheet number in mono; the teal underline drops with the interaction. Nothing prints a URL. |
| R25.10 | The L2 ration is per document, not per sheet. The running footer carries title, §NN and sheet n of m on every sheet including the first. |

Two rules that cost something and were kept anyway: code wraps on paper with a 2ch hanging indent and a ↳ marker (screen code does not wrap, and clipping loses the line), and the `#fafafa` page canvas prints white while `#fafafa` zebra rows and recessed canvases print at 4% — the same token with two printed values, because on screen it is a background and inside a card it is a step.

Page conformance: one L2 (the print contract), zero solids, five sections, register rows as grid rows (never `<table>` + `sc-for`), all labels 9.5px. Tweaks: defaultTier, defaultClass, showWhy.

**Roadmap.** Layer 04 visualization 90 → 100 (nothing outstanding); weighted total **93.8 → 95.8, reads 96%**. Q10 flipped to done; phases B and C are now closed. v0.4 still open on layers 3, 6 and 7 (95/95/90), all three of which are held by deferred items — motion, icons, dark mode. Open rulings unchanged: stroke icon set, body at 15.5px, the ecosystem-map offer.


## Round 26b — non-visual equivalents (R26.1–R26.6)

**How this was found.** v0.4's gate reads "no pattern in the brief without a live specimen", so the brief was re-read end to end against the live inventory rather than against the coverage index. Everything it names as a component exists — including the four core blocks (overview, prerequisite, example, use-case) at Foundations §12, which the audit had previously read as gaps. One requirement did not: the brief asks for a **text or table alternative** in two separate places — under "for every visualization, provide" and again under accessibility, where it is stated twice more as "text alternatives for diagrams" and "data-table alternatives for charts", and closed with "do not use a diagram or interactive visual as the only way to access information". Nothing in the system answered it. Diagrams carried ad-hoc `role="img"` labels on some SVG layers; the four charts carried none and no tables.

Deliverable: `content-morphia Equivalents.dc.html`, third page of the Foundations group. Four sections — §01 the three forms and what needs none · §02 the four-part description with two worked examples and three failure modes · §03 the chart table, live over the ten-bucket distribution with its disclosure · §04 the six rules.

**The three forms, and why three.** Description for diagrams (structure is describable in a sentence), table for charts without exception (values are not), register for T2/T3 canvases (a population too large for either). The exemption that keeps the rule from becoming noise: a mark whose value is already written beside it — magnitude bar, progress track, legend swatch, status chip — has its equivalent, and adding a table under a 6px bar restates a number that was never hidden.

**The four-part description** — type · population · relation · notice, in that order. The three failure modes are the ones that show up in practice: naming the picture ("diagram showing the data pipeline architecture"), restating the title, and describing the styling. The last is the interesting one — colour, shape and position are the *encoding*; a description that lists them has decoded nothing.

| Rule | Statement |
|---|---|
| R26.1 | Nothing is reachable only by looking. Every diagram, chart and canvas carries one non-visual equivalent: a description, a data table or a node register. |
| R26.2 | The form follows what is encoded, not size. Diagrams take a description; charts take a table without exception; T2/T3 canvases take a register as well as their description. |
| R26.3 | A description is one sentence in four parts — type, population, relation, notice. It states what the visual shows, never what it looks like. |
| R26.4 | A chart's table carries every mark's value in axis order plus every value a selection would have revealed, in a closed disclosure beneath the chart with its row count in the header. |
| R26.5 | A mark whose value is written beside it already has its equivalent. Magnitude bars, progress tracks, legend swatches and status chips take no second one. |
| R26.6 | An interaction is not an equivalent. If selecting, hovering or stepping is the only way to reach a number, that number belongs in the table. |

R26.6 is the one with teeth, and it indicts existing work: the Charts §03 distribution readout and the Wayfinding ranked-entry bars both hold values reachable only by clicking. It also chains to R25.1 — the print rule already required that every value a readout would have given appear on the axis or in a table, which was the same requirement arriving from the other direction.

**Debt created deliberately.** The rules are specified; the existing specimens predate them. Queue item **Q35** (phase B, next): every chart on Charts, T6, Provenance and Wayfinding takes its table, every diagram its four-part accessible name. One sweep after the rules stop moving, per the standing "one sweep, not one per build" discipline. v0.4's third gate was rewritten to name it: *every chart carries its table and every diagram its description*.

Page conformance: one L2 (the never-only-by-looking rule), zero solids, four sections, one interactive (the table disclosure, R24.1 marker), all labels 9.5px. Tweaks: tableOpen, showFailures. Foundations group is now three pages.


## Round 27 (2026-08-31) — the equivalents retro-fit (Q35 closed)

R26 was specified in round 26b and the shipped specimens predated it. This sweep applies it. Scope was decided by the rules rather than by a count of visuals: **R26.4** puts a table under every chart, **R26.5** exempts any mark whose value is already written beside it, and **R26.3** requires the four-part description on every diagram.

**Tables added (4).**
- Charts §02 trend — 8 rows × 3 populations. Carries all three series regardless of which are toggled on, closing R26.6 against the series switcher.
- Charts §03 distribution — 10 buckets with count, share and cumulative. This is the readout R26.6 named: those numbers were reachable only by clicking a bar.
- T6 §01 hero trend strip — 12 weeks with value and distance from target. Built as a native `<details>` because T6 is template-only with no logic class; the disclosure chrome matches the scripted one.
- Wayfinding §03 most read — the union of the three windows, 8 nodes × 7/30/90 days, em dash where a node is outside that window's top five. The window switcher was the only path to two thirds of the numbers.

**Exempt under R26.5, verified not added.** Charts §03 share bar (legend writes count and percentage per segment) · Provenance §02 agreement bar (legend writes the count per segment) and spread band (min, IQR bounds and max all written on the axis) · every magnitude bar row across the library, which carries its value at 700 beside the label.

**Descriptions added (6).** Diagrams §05 decision tree, §07 concept map, §08 taxonomy tree · Diagrams II §03 state machine, §05 layered architecture · Diagrams at Scale §05 ecosystem canvas. The last is computed rather than static: the canvas switches level, so the description names the current level, its node and edge counts, and points at the register beneath.

**One description rewritten.** Diagrams §06 system flow read "marked by dashed group borders" — appearance, which R26.3 forbids. It now names the three boundaries and the rule that no component appears in two systems.

**One token breach found and fixed in passing.** T6's hero trend strip drew its twelve weekly bars in solid black with the current week in teal — inverted against R23.7, which reserves black for emphasis and draws populations in the accent. Now: population teal, the breach week crit, the current week the single black selected mark the rule allows.

**Number that does not reconcile, left alone.** T6's hero carries a chip reading "+0.9 pp / 4 wk". Derived from the bar geometry the four-week movement is −0.6 pp, and on a trailing four-week mean +0.4 pp. The table states the twelve weekly values as drawn; the chip is pre-existing copy and was not rewritten. Wynt3r to rule whether the chip or the series changes.


## R27.1 — mono at content size (2026-08-31)

Rule 3 sets mono labels at 9.5–10px. That floor is for **labels**: units, table headers, chip text, timestamps, provenance. It was being applied to mono that carries **content** — a metric identifier in a matrix cell, a worked example's input and output lines — and at 10px those are unreadable. Wynt3r found it twice on one page.

**The rule.** Mono has two sizes by role, and the role is decided by whether the string is read or scanned.
- **Label mono** — 9.5–10px, 700, caps, letter-spacing .08–.1em. Unchanged.
- **Identifier mono** — 12px, 600, sentence or verbatim case, no letter-spacing. Any mono string a reader has to actually read: metric identifiers in a cell, code-adjacent values in prose blocks, worked-example lines, field values in a register.

**One named exception, and only one.** **Section-number mono** — the `§NN` that sits beside a section title: 11px, 400, letter-spacing .1em, no caps transform because it is already a numeral. It is neither scanned meta nor read content; it is page chrome, sized against the 28px title it pairs with. At label size it stops reading as part of the title; at identifier size it competes with it. This is the single most-repeated mono token in the library, on every one of the thirty-plus pages, and the first draft of R27.1 declared it illegal — corrected here rather than in the pages.

Nothing else sits between the two role sizes. A mono string at 10.5px, or an 11px mono that is not a section number, is one of the two roles set wrongly.

**Applied.** T2 §the five dimensions (metric row, five cells) and §worked example (input and output bodies). **Owed:** Structured §04 uses the same matrix pattern and needs the same read; queued as Q36.


## Round 27b — prose primitives (R27.2–R27.7), phase F opens

`content-morphia Prose.dc.html`, seventh page of the Components group. Closes Q25, the first of the nine taxonomy families, and the one five shipping page types already referenced without having.

**What it settles.** Seven primitives, organised as three decisions rather than seven specimens.
- §01 **Quotation against pull quote** — the two look alike and mean opposites. Borrowed words are bracketed and attributed; our own amplified sentence is barred and is not. The failure mode is a document appearing to cite itself.
- §02 **Citation marker against footnote** — a citation points outward at evidence and states a count; a footnote points downward at an aside and states an ordinal. Both are superscripts, so the two must be distinguishable without opening either. The citation marker is the inline half of the Provenance §04 component, not a second one.
- §03 **Three lists that claim more than membership** — ranked (order is the finding, ordinal in its own column, population stated), paired (equal columns, one decision seen twice), nested (two levels, containment only). All three take the black square; R19.6 already bars the teal bullet from lists that are read rather than scanned, and these are read.

**Vocabulary addition.** **Do / Do not** joins the closed label set as a seventh entry, restricted to the paired list. It is the first addition since R20 and is deliberate: the shape needs two labels and neither existed.

**Rules R27.2–R27.7** on the page. Seven Selection §02 rows in a new **Prose** family (twelve families, 82 rows). Cross-linked across all six sibling Components pages; group is now seven pages.

**Also in this round.** Structured §04's 2×2 matrix was carrying 12px/11px cells at weights 400 and 300 — the same unreadable-at-content-size fault Wynt3r found on T2, in Nunito rather than mono. Raised to 13.5/12.5 with the weight ladder intact, so the two de-emphasised quadrants still recede. `REQ-04` in §08 moved from label mono to identifier mono per R27.1.


---

## Round 28 (2026-09-01) — Wynt3r pass on chrome and list shape.

Five changes, all system-wide, all applied across the 35 pages in one sweep.

**R27.8 — one item, one paragraph.** A list item never breaks into a bold title line with a sub-line under it. The lead-in stays bold and runs inline with its explanation in the same flowing line. Nesting (one level, containment) remains the only sanctioned break inside an item. Applied to the ranked list and the rule register on Prose; the paired and nested lists already complied.

**Section marker is `ss: NN`.** The section sign is retired everywhere — page headers, on-this-page strips, screen labels, cross-references. Mono, 11px/400, ls .1em, no caps transform, unchanged otherwise.

**LABEL mono raised 9.5 → 10.5px.** Hard floor is now 10.5; chart ticks and axes may go to 9.5, nothing below. IDENTIFIER mono unchanged at 12px/600. The two roles stay one point apart in size and separate in weight and case.

**A corner-bracket sub-block takes a T3 title, not a mono label (rule 6 amended).** Mono was serving as the heading of a specimen while the card beside it used Nunito 700/15 — the same rank set two ways on one page. The bracket stays as the sub-block marker; mono below the title stays as attribution and provenance. Rule 1's T3 definition now names the corner-bracket sub-block alongside container, card, callout, figure and table.

**Scrollbar is chrome (rule 16 amended).** The 8px thumb goes from #000 to rgba(0,0,0,.22), rgba(0,0,0,.45) on hover. A black thumb under a wide table was the heaviest mark in its frame and outranked the data above it.

**Templates index spacing.** Card grid gaps 16 → 28 (rows and columns), wayfinding grids 16 → 24, card padding 24/26 → 26/28, and interior label, description and link gaps up one step. The hero card's teal offset shadow now clears the row beneath it.

**Open.** The nine new template pages still lack the ALSO IN GROUP strip. Icons still blocked on a Figma file.


---

## Round 29 (2026-09-01) — Wynt3r review pass: chrome weight, hierarchy, breathing

Ten comments across Prose, Learning, Structured and Foundations. Five became rules.

**R28.1 — a link is drawn as a link.** Every in-page and cross-page anchor now carries the 1.5px teal underline at 3px offset: on-this-page strips, sticky-rail TOCs, also-in-group lists. Swept across 24 pages. One exemption stays unmarked because it is a tabset, not a link list: the six group pills (rule 17). The scroll-spy indicator bar is retired from every on-this-page strip — it marked one anchor of five and left the rest bare, and the two strip designs made identical navigation look different page to page. Every strip is now the same: underlined mono anchors at 5px 9px, no bar.

**R28.2 — progress markers carry teal as a rail, not a disc.** The vertical stepper's completed steps were 28px teal-filled discs with black borders; four of them in a column outweighed the step text. Completed is now a 22px white circle, 1.5px black border, black check, with the connector beneath it in 1.5px solid #1de9b6. Teal stays redundant with the check glyph and with position. Ahead steps take the same circle with a mono numeral; the current step keeps the single black fill plus reserved teal offset. All circles down 28 → 22px, numerals now LABEL mono 10.5/700.

**R28.3 — no third boundary inside a container's child.** The stepper's INPUTS / OUTPUTS pair sat in 12×12 corner brackets, three boundary levels deep inside a card inside a step. Brackets dropped: a labelled pair inside a step, cell or card is a mono label with its value beneath, at 28px column gap.

**R28.4 — a T3 heading must outrank its own rows.** The module-summary table set both its heading and its row text at 15/700, so the heading read as another row. Rows to 400; the heading keeps 700. Where a container's body rows share the heading's size they are always the lighter weight.

**R28.5 — specimen commentary is separated, attribution binds up.** In the quotation specimen, quote, attribution and commentary all sat 12–16px apart at three sizes, so the attribution line could be read as belonging to either neighbour. Attribution now sits 6px under the quote with an em-dash prefix; commentary sits 28px below behind a 1px #ebebeb rule. Answers the standing question about why commentary is 13.5px: it describes the specimen rather than being it.

**Learning ss: 04 rebuilt.** The placement model was four container levels deep — S2 card → dashed figure frame → tile grid, with a bracketed detail panel and two more bracketed sub-blocks below. Now one container: the dashed figure frame holding the 2×2 tiles, with title, description, axis legend and provenance on the page around it per rule 16. The detail column is a bare definition list; HOLDS WHEN / BREAKS WHEN became two sentences with bold lead-ins under R27.8. Body text in the section up from 14 to 15px throughout.

**Breathing.** Structured: stage-card padding 16 → 20, card gap 12 → 18, stage titles 13.5 → 15/800, descriptions 12 → 13.5, stepper step clearance 22 → 34, sibling modules 16 → 28. Prose: sibling list cards 16 → 28, list row gaps up one step, paired-column gap 28 → 32. Learning: quadrant tile gap 16 → 20.

**Open.** ALSO IN GROUP strip on the nine new template pages; icons blocked on a Figma file.


---

## Round 30 (2026-09-01) — T10 Glossary (Q27)

**What it settles.** The vocabulary layer. Definition components existed on Interaction; nothing hosted them, so every page that needed a term exact either restated it or linked nowhere.

- ss: 01 **Index** — A–Z strip over fourteen terms, filterable by initial and by family, one row per canonical term: term, one-line gloss, family, source count. Selecting a row drives the entry below. Zebra rows, header row on the #f1f1f1 track.
- ss: 02 **Term entry** — definition first, one sentence, at 19px. Usage, disambiguation, aliases, related terms and provenance follow. The right column holds aliases as neutral chips, related terms as underlined jumps, and source count with agreement band and last-aggregated date.
- ss: 03 **Compound terms** — one entry for a three-word term, with a breakdown row per part in reading order. Sample: certified freshness window.
- ss: 04 **In running text** — the three atoms that let a passage use a defined term: acronym first use, synonym resolving to the canonical term, disambiguation sentence.
- ss: 05 **Six rules (R29.1–R29.6)** — defined once · one-sentence definition not containing the term · acronym expanded once per page · synonyms resolve to one canonical term and are not counted in the total · a disambiguation names what the term is not · every entry carries provenance or is held out.

**Registered.** Template index card (Template 10 · Vocabulary leaf), five Selection matrix rows in a new Glossary family, Q27 marked done.

**Remaining in phase F.** Q26 question-and-answer · Q28 change and status · Q29 case study and proof · Q30 API reference blocks · Q31 troubleshooting and recovery · Q32 authorship and governance meta · Q33 comparison and profile pages.


---

## Round 31 (2026-09-01) — Questions and answers (Q26)

**What it settles.** Material the reader arrives with. Previously served by callouts and by topic headings phrased as questions, neither of which survives search.

- ss: 01 **The question-answer pair**, shown beside the same material written as a topic — the failure mode is the specimen's other half.
- ss: 02 **FAQ list** — collapsed rows on one surface, ordered by ask frequency with the count and period as provenance, expand-all as the escape hatch. Reuses the Interaction accordion grammar: 20px #f1f1f1 disc, mono glyph, inset hairlines.
- ss: 03 **Said and actual** — one row, two halves. Claim quoted as people say it at 400; correction beside it at 700.
- ss: 04 **Confusion table** — the term, what it gets read as, and the one question that separates them. The test column is what makes it a component rather than two glossary entries.
- ss: 05 **Six rules (R30.1–R30.6)** — reader's words · resolve in the first sentence · ordered by frequency with the period stated · collapsed on arrival · a correction is one row · no confusion row without a test.

**R30.7 added (Wynt3r, same day).** Weight marks a phrase, never a whole sentence. The said-and-actual row originally set the correction at 700 across its full sentence; ranking now runs 300 against 400, with 700 reserved for lead-ins, terms and clauses.

**Registered.** Four Selection matrix rows in a new Questions family, Q26 done, cross-linked into the Components strip on every page.

**Remaining in phase F.** Q28 change and status · Q29 case study and proof · Q30 API reference blocks · Q31 troubleshooting and recovery · Q32 authorship and governance meta · Q33 comparison and profile pages.

---

## Round 32 (2026-09-01) — Change and status (Q28)

**What it settles.** What a node says about itself. A node re-aggregates on a cadence and is never deleted, so state and movement are load-bearing; until now the six status chips existed with no rule for what each one obliges the node to tell a reader, and index-wide change had no surface at all.

`content-morphia Change.dc.html`, ninth page of the Components group.

- ss: 01 **State on a node** — the six closed chips mapped to meaning, what the node must say, and reachability. Draft is unreachable; in review and approved are direct-link only; deprecated and archived stay in the index because other nodes point at them. Live specimen: a six-way segmented control swapping the notice, with **published showing no notice at all**.
- ss: 02 **The index change log** — every change across the index, newest first, filterable by kind with counts. Distinct from the per-node diff at Wayfinding ss: 04, which stays the release-notes answer.
- ss: 03 **Correction** — the notice in place beside its permanent register row, and the one-question test against a revision: was the statement wrong when it was published?
- ss: 04 **Known limitations** — the LIMITATION callout for one limit, the register past three, every row carrying a reason and a date or "no date".
- ss: 05 **Six rules (R31.1–R31.6)** — nothing is removed · only a non-published state draws chrome · absolute dates only · a row exists only where meaning changed · a correction is never silent · a limitation names a reason and a date or no date.

**Vocabulary addition — CORRECTION, the eighth callout.** Crit tint, nearest neighbour "not REVISED — a revision replaced material that was right at the time; only a correction carries a date." The change log therefore takes **four** kinds where a diff takes three (R22.5 unchanged: three kinds inside a diff). Selection ss: 01 intro re-counted to eight callouts / seventeen labels, with Do and Do not stated as paired-list markers outside the count.

**Selection ss: 02** gains a **Change** family, four rows (state notice · index change log · correction notice · limitation register). Also fixed in the same pass: the family chip list had never been updated for rounds 30–31, so the Questions and Glossary rows were unreachable by filter — chips now read fifteen families.

**Nav.** The Components strip was ragged — Prose listed six siblings, Questions five, Charts seven. Normalised across all nine pages to one canonical order: Structured · Charts · Learning · Wayfinding · Provenance · Interaction · Prose · Questions · Change, each page omitting itself.

---

## Round 33 (2026-09-01) — T11 Case study (Q29)

**What it settles.** Evidence. Method nodes assert what works; nothing in the library recorded an instance where one was applied and measured, so the ss: 6.5 blueprint scored zero across all nine steps. The genre risk here is the marketing case study, and every rule below exists to block it.

`content-morphia T11 Case study.dc.html`, eleventh template. Sample: certification turned into a merge gate in the payments domain, Feb–Jul 2026.

- ss: 01 **What this is evidence for** — the claim under test at 19px/800, the finding in one sentence ("half held"), the method node it supports and which cites it back, then scope / period / measured / confidence as four label-value pairs on the page canvas. This block is the page's one L2.
- ss: 02 **Before and after** — four measures, each scaled to its own larger value, both values written beside their bars (which is what exempts the module from R26.4's table), direction as a mono word. Two measures carry confounds, revealed in place by a control rather than pooled into a footnote. The module sits on S3, not L2 — it is data, and R23.8 holds.
- ss: 03 **What was done** — four dated changes on the page, no container; then the practitioner note as a corner-bracket sub-block, 19px/300 verbatim with role and date at 6px binding up.
- ss: 04 **What did not work** — three withdrawn or never-attempted pieces with the reason and the end date, plus a LIMITATION callout stating one domain, one period, no control group.
- ss: 05 **Six rules (R32.1–R32.6)** — name the claim and link the method · same measure, same definition, stated periods · state everything else that changed · a measure that worsened sits in the same list · a quotation carries what the measures cannot · what did not work is a section.

**The reported result is deliberately mixed** — drift down 79%, certified share up from 11 to 31 of 34, and median merge time up half a day. R32.4 makes that structural rather than a matter of authorial honesty: the losing row is in the same list, at the same weight, with its direction stated in the same column as the others.

**Registrations.** Templates hub card added (nine shells → eleven, T10 having gone in unnumbered in the intro line). Selection ss: 02 gains a **Case study** family, four rows — proof node · before and after · confound statement · practitioner note.


## Round 35 (2026-09-02) — the two open calls ruled, plus the ecosystem offer closed

Wynt3r's three answers, in his words: icons approved, body at 15.5px, and the NodeTrak example stays because there is no real ecosystem data to share yet. All three were open rulings on the Roadmap (R-c, R-d, R-e); all three are now closed and none remains open.

**R33.1 — icons.** Treatment C (partial fill) is adopted. One 24px outline family, black at 1.5px, with a solid twin per shape; the accent enters as a fill above a waterline at **13 of 24**, one constant for the whole family, drawn by clipping the solid twin under the unchanged outline. It was chosen over outline-only (no accent at all, so the reference image's effect is lost) and full-fill (every glyph becomes an accent mark, which spends the reservation). Cost per glyph is zero because the twin already knocks its own interior detail out.

The ration, now locked as rule 18: fill at 20px and above only (at 16px the band is under 9px and reads as a printing error) · at most one filled glyph per view, at the same altitude as the reserved offset shadow · four allowed placements, and where two meet in one view the fill goes to the higher — callout label 20 (fill) · empty state 32 (fill) · index or hub card 24 (outline only, because a grid of peers filling every card is the texture the ration forbids) · register row label 20 (outline only) · never in a sentence, a nav pill or tab, a table cell, a status chip, a button, or a list bullet.

**R33.2 — body at 15.5px.** Swept across every live page: **320 body declarations** (313 weighted `400/15`, 7 unweighted at 1.85 leading), plus the Foundations type ladder annotation, the Composition T4 row, the Anatomy reading-column and body-field rows, and the Print token table's screen value. Only the body tier moved. A 15px string at weight 700 is a T3 module title and a 15px string at 800 is a card title; both were left alone, which is why the sweep keyed on `font-size:15px;font-weight:400` rather than on the size. R28.4 (a T3 heading outranks its own rows) now reads "at body size" instead of naming 15px, since the collision it guarded against no longer exists — T3 700/15 against body 400/15.5.

**R-e — the ecosystem map.** Declined for now, at his call. The tier-3 canvas at Diagrams at Scale ss: 05 keeps the invented NodeTrak analytics platform (9 / 23 / 12 nodes). The offer stands for when real data exists; the value would be proving the capacity ceilings against node counts that were not designed to fit them.

**Page changes.** `content-morphia Icons and body size.dc.html` is deleted and replaced by `content-morphia Icons.dc.html` — a rules page, not a decision sheet, per the page-genre rule: ss: 01 the set and its treatment (both states on seven glyphs, how the fill is drawn, where the fill starts on the 16/20/24/32 ladder) · ss: 02 the ration and the three conditions it was set against · ss: 03 the four allowed placements as a register, plus the six placements that never carry a glyph. The A/B/C comparison and the 15-versus-15.5 measurement block are gone: both were decision aids, and a deliverable page carries the outcome. Foundations group is now four pages; the strip on Foundations and Equivalents carries Icons.

**Roadmap.** R-c, R-d and R-e closed; **zero rulings open** for the first time, so ss: 05 carries an empty state naming the condition. Q20 turns from a deferred build into the next sweep — the treatment is specified, so what remains is pulling the working glyphs the four placements need and replacing the interim two-letter glyph tiles. Layer 01 Foundations 95 → 97; weighted total 96.0%.

**Debt created.** Two items, both deliberate. (1) The glyph-tile sweep (Q20) is queued, not done — Foundations ss: 14 and every other interim tile still stands. (2) `content-morphia Depth & Density.dc.html` has no ALSO IN FOUNDATIONS strip at all, so Icons is not reachable from it; it predates the nav sweep and needs the second header row added. Also noted in passing and not fixed: Implementing ss: 02 sets two numeric cells in mono at 15px, which is neither of R27.1's two role sizes.

## Round 36 — the glyph sweep (2026-09-02)

Q20 closed. The treatment was ruled in round 35; this round pulls the working set, closes it as a register, and places it.

**Source correction.** The specimens were recorded as Iconex. The mounted file is **Basil Icons (community)** — 497 glyphs on a 24px grid, `Outline/<Category>/<Name>` with a `Solid/` twin per shape. The naming in the round-34 materialisation matches this file exactly, so the round-34 mount was the same file under the wrong name. Attribution corrected on the Icons page and in locked rule 18. No glyph geometry changed.

**R33.2 — a glyph enters only through a closed register.** Icons ss: 04: 23 concepts, one shape each — eight callout labels, three empty states, twelve index cards. Same closure as the label vocabulary: a concept absent from the register takes no glyph, and no two concepts share a shape.

**R33.3 — the fourth admission condition, found by building it.** The constant waterline at 13 of 24 only reads when the solid twin *floods an enclosed area* above it. On a glyph drawn as a stroke the solid twin is nearly identical to the outline, so the black outline covers the teal exactly and the fill is invisible at every size. Measured on the first working set: lightning, flask, lock, magnifier and check all showed no band. Five swaps followed — Important lightning → pin, Example flask → file, Limitation lock → cancel, nothing-matched magnifier → open folder, nothing-open check → box. The condition is now stated on the page: stroke-shaped glyphs stay out of the fill placements. The alternative — a per-glyph waterline — was rejected because rule 18 makes the waterline a constant of the family.

**Placement sweep.**
| Where | What | Treatment |
|---|---|---|
| Foundations ss: 08 | eight callout labels | 20px outline — eight shown together are a grid of peers, so no fill |
| Templates ss: 01 | eleven template cards + the reference build | 24px outline |
| Wayfinding ss: 01 | search with no results | 32px filled |
| Charts ss: 04 | the four empty conditions | 32px filled |
| Roadmap ss: 05 | nothing open | 32px filled |

**Two defects found while sweeping, both fixed.**
1. `Selection.dc.html` shipped with a missing comma in the callout array, so `CO` evaluated to seven entries with the last `undefined` and `renderVals()` threw — the whole page, including the ship-blocking pre-flight gate, was dead. Two occurrences of the same fault: one in the callout array (introduced when Correction was added in round 31) and one in the selection matrix after the Provenance citation-marker row. Neither was caught because the failure is a blank render, not a console-visible layout fault — the whole file must be scanned for the pattern, not just the line that surfaced it. Gate check 4.3 also still read "one of the seven in ss: 01"; corrected to eight.
2. Foundations ss: 08 carried seven callouts, not eight. Correction was added to the vocabulary in round 31 and never added to the specimen. Eighth row added with the freshness-metric correction sentence.

**Interim tiles removed.** The two two-letter technology tiles at Foundations ss: 14 are deleted rather than replaced: a tech reference label is not one of the four sanctioned placements, and the caption already ruled that technology is named in mono and never by logo.

**Not swept, and why.** Interaction ss: 02's filtered-to-zero state has no static markup — it renders only when the filter empties — so the funnel glyph has no placement and was dropped from the register rather than left in it unplaced. Register row labels remain an available placement with no entries: no family in the Anatomy, Change or Print registers is a closed-vocabulary name, so under condition one none of them earns a glyph.

**Files.** `icons/set/` — 35 composed SVGs, `<key>-o.svg` outline and `<key>-f.svg` partial fill, referenced by `<img src>`; the fill file clips the solid twin to `rect(0,0,24,13)` in #1de9b6 under the unchanged black outline. Composed files rather than a sprite because cross-root `<use>` is dropped by the screenshot and print pipelines. `icons/duo/` deleted (superseded, and each file carried ~9KB of provenance metadata). `icons/icon-data.js` regenerated at 35 entries.


## Round 37 — the 14px type floor (2026-09-02)

Wynt3r's ruling, answered on a three-question form: the floor is 14px, it covers mono labels as well as reading text, 14px is caption and source size, and the sweep runs across all pages now.

**R34.1 — one floor, 14px, no exceptions.** Every size below it is retired: 9 · 10 · 10.5 · 11 · 11.5 · 12 · 12.5 · 13.5 all move to 14. The former exceptions go with them — axis and tick labels at 9–9.5 and the 10.5 hard floor for labels are both gone. **3,139 declarations across all 40 pages.**

**R34.2 — mono is one size in two roles, replacing R27.1.** The two mono role sizes (LABEL 10.5, IDENTIFIER 12) collapse to 14px, and the roles are now told apart by case and tracking alone: LABEL 700 caps ls .08–.1em for strings that are scanned, IDENTIFIER 600 verbatim case no tracking for strings that are read. The `ss: NN` section number, previously the one sanctioned value between the role sizes at 11px, is 14px/400 at ls .1em — it keeps its own treatment but no longer its own size, so the named exception in R27.1 dissolves rather than being restated. A mono string distinguished from its neighbour by size is now a violation in the same way a sub-floor size is.

**Reading text versus the floor.** 14px is the caption tier — a source line under a figure or table, an attribution, a specimen note. Reading prose is never set at the floor, so the 13px card and description paragraphs (those carrying `font-weight:400` and a leading of 1.7–1.85) went to **15.5px body**, 18 of them, rather than to 14. Specimen commentary and bullet sub-lines, which are commentary rather than prose, sit at 14.

**Consequence to expect.** Chips, badges, table headers and nav pills grow by roughly a third. The six group pills plus brand and version chip now wrap sooner in a narrow viewport; that is the cost of the ruling, not a defect.

## Round 37b — template index cards

Wynt3r's three notes on the ss: 01 grid, from a marked-up screenshot.

**Glyph placement corrected.** The glyph sat inline before the title, pushing it right and leaving it out of alignment with the text beneath. It now sits on its own line above the title at **20px**, left edge flush with the whole text column. This is a general correction to rule 18's index-card placement, not a page fix: an index-card glyph is never inline with the title it labels.

**The featured card was set differently from its peers for no reason.** T1 carried its description to the right of the title while the other twelve carry it beneath; it now matches. Card descriptions 13 → 15.5px, interior rhythm opened to 22px before the glyph and the blocks line and 24px before the link, padding 26/28 → 28/30.

**The black pill is gone from the featured card.** It was the heaviest mark in the first screen and outranked the card it sat in, while the same action on the other twelve cards is a plain text link. T1 now uses that link too, so the featured card's emphasis comes only from its reserved offset shadow — which is what the shadow is for. Rule 7c's black-fill ration is unchanged; this card simply was not the place to spend it.

**Also fixed:** the header stated three inconsistent counts for the same grid — "eleven shells", "a tenth shape", "9 shells" — because T10 and T11 were added without updating them. All three now read against the twelve cards in the grid.

### Round 37c — geometry follows the type

The 14px sweep changed `font-size` and nothing else, so every hard-coded width tuned to the retired 10.5–12px mono became too small. Fixed, and the general rule: **a px width or grid track holding a mono label is a derived value, not a constant — when the type tier moves, it moves with it.**

| Where | Was | Now |
|---|---|---|
| Diagrams ss: 02 process lane tracks | `88 56 118 56 118 56 88 64 118 56 88`, min 920 | `96 80 126 80 126 80 96 80 126 80 96`, min 1066 |
| Diagrams ss: 03 user-flow tracks | `140 68 140 68 88 68 140`, min 730 | `140 92 140 92 88 92 140`, min 802 |
| Diagrams ss: 08 taxonomy long label | `max-width:230px` + nowrap + ellipsis | `max-width:300px`, wraps at 1.5 — a tree label is read, so it is never truncated |
| Diagrams II ss: 01 sequence | PW 150 · PP 194 · PH 56 · MY0 104 | PW 196 · PP 244 · PH 68 · MY0 116 |
| Diagrams II ss: 03 state machine | SNW 168 · SNH 58 | SNW 216 · SNH 70 |
| Diagrams II ss: 04 topology | TNW 172 · TNH 58 | TNW 220 · TNH 70 |
| Diagrams at Scale canvas | NW 196 · NH 62 | NW 228 · NH 70 (density-floor prose and the registry specimen updated with it) |
| Diagrams at Scale ss: 06 coverage | `1.5fr 1.1fr 82px` | `1.5fr 1.1fr max-content` — a chip track sizes to its chip |

Not changed: the system-flow row at `min-width:780px` overflows its dashed canvas by 9px, and that canvas carries `overflow-x:auto` — a scrolling diagram canvas is the specified behaviour, not a clip.

### Round 37d — the rest of the geometry

**R11.1 restated.** The lane canvas is **152px mono rail + 160px columns + 12px gutters at 1024px** (was 100 / 160 / 12 at 960). Two rail labels — "Touchpoints" and "Opportunities" — overflowed the 100px track into the first lane column; the other nine fitted only by wrapping to two lines. The blueprint's boundary-line chip offset and note width follow the rail: left 100 → 152, note 848 → 860. The prose at Diagrams III ss: 04 states the new number.

**Label columns raised with the tier.** Every `grid-template-columns:<n>px 1fr` between 40 and 100px — rule-id columns, ordinal columns, lane labels — raised by the same factor the type moved: 80 declarations across 18 pages. Columns at 26 and 34px hold a numeral or a bullet and are untouched; columns over 100px already had the room.

**max-content reverted on the coverage table.** `1.5fr 1.1fr max-content` is wrong in this system: every table here is built as one grid per row (the `<sc-for>`-in-`<table>` rule), so a content-sized track resolves per row and columns drift out of alignment between rows. It measured clean only because the chips happened to be near-identical widths. Back to a fixed 104px. **Standing consequence: never size a track to its content in a per-row grid — widen the fixed value instead.**

## Round 38 — density, and the rules that kept regenerating the same defects (2026-09-02)

Wynt3r's fifth complaint about compactness. Reading the previous four back, every one was answered as a local fix to the thing he pointed at, so the rule that produced it stayed in force and produced it again somewhere else. This round changes the rules.

**R35.1 — mono sets at 12px.** The 14px floor (R34.1) is a *reading* floor. JetBrains Mono runs optically larger than Nunito at the same nominal size, so applying one number to both made every label shout. Mono is 12px, the optical match for 14px Nunito. **2,192 declarations.**

**R35.2 — mono is scoped by section, not sprinkled per element.** The old rule 3 said mono for "ALL labels/meta/timestamps/tables/badges/code", which licensed a mono string anywhere a word could be called a label. On the journey map that produced a view where mono outnumbered Nunito: phase numbers, lane names, touchpoint chips, mood words and axis ticks were all mono. New rule: a section picks the CLASS of thing that is mono — its table, its code, its identifiers, its one label column — and everything else is Nunito. A chip carrying a word a reader reads is Nunito; a chip carrying a code, unit or id is mono.

**R35.3 — zebra is retired.** Rows are separated by space and a 1px #ebebeb hairline. Table row padding floor raised 8 → 14px. **24 alternating fills removed, 282 row paddings raised.** A table that needs a stripe to be legible is a table with too little air in it.

**R35.4 — the title after a corner bracket is Nunito, never mono caps.** Rule 6 has said the sub-block title is Nunito 700/15 since round 28, and 28 sub-blocks across seven pages were still mono. This was the single most repeated breach in the library, and it is why "BOUNDARY LINES" read as smaller than the rows beneath it: a module title in 12px mono cannot outrank a 15px Nunito row, so the hierarchy inverted every time it appeared.

**R35.5 — a dashed canvas never contains another dashed canvas.** Two live cases: the label-discipline specimen sat in a dashed frame, inside a corner-bracket sub-block, inside a dashed section canvas; the blueprint's lane canvas sat in a dashed frame inside another dashed frame. Each frame looked reasonable where it was added, which is why the rule has to be about counting rather than judgement: before adding a frame, count the frames already above the thing you are framing.

**The L2 ecosystem canvas.** Edge labels were placed at the horizontal midpoint of the column gap, and the gap was 64px while a label is around 110px wide — so with four edges converging, every label spilled across the node boxes on both sides. Column gap 64 → 176, row gap 26 → 34. The published density floor states the new numbers. The old ones were written when labels were 10.5px mono and were never re-derived when the type moved — the same class of error as round 37c.

**Why this kept happening.** Four of the five defects were already forbidden by rules this system had written down. The gap was not knowledge, it was that nothing in the build loop checks a page against the rules before shipping it — the pre-flight gate exists at Selection ss: 03 and had not been run on any page built since it was written, and was itself broken for seven rounds. Passes 1–3 are ship-blocking; they need to run.

### Round 38b — R35.2 actually applied, and the sweep hole that let mono through

**Two mono literals survived the 12px sweep** because the size sat in a *separate concatenation* from the family: `… + MONO + 'font-size:14px;…'`. The regex matched the family-then-size order and skipped this one. Three blueprint boundary-line chips and one taxonomy mark were left at 14px beside 99 siblings at 12px — and the boundary-line chip is the element Wynt3r's arrow pointed at. Fixed, and the scan now checks the 320 characters preceding every `font-size:14px` for a mono family or a mono style constant, not just the adjacent declaration.

**R35.2 was written and not applied.** Halving mono's size does not answer "we mix and match too much". On the journey map — the page named in the round-38 entry — mono still outnumbered Nunito 102 to 91 because only the size had changed. Re-scoped: the ten touchpoint chips, the five mood words and the three emotion axis ticks are Nunito (chips 14/600 in a pill, moods 14/600, ticks 14/400). Mono keeps this section's genuine label and unit class: the lane rail, the `ss: NN` markers, the phase and step ordinals, the tier chips and the Sankey volume figures. Nunito now leads 109 to 84.

**Rule stated for the next section built:** writing a scoping rule is not applying it. A rule that redistributes two typefaces has to be executed per section, because only a section knows which of its own strings are codes and which are words.

### Round 38c — two elements doing one job, and a contradiction they were hiding

**Twelve duplicate tier chips removed.** The Q02 badge sweep (round 25b) added a tier chip to specimens that already carried one, so twelve specimens across Diagrams II, III and IV ran two chips side by side stating the same fact. Wynt3r's complaint about overutilised components, in its plainest form.

**Three of the pairs did not agree.** Diagrams II's sequence, ERD and state-machine specimens were labelled `Tier 1` by the original chip and `T2` by the sweep. Checked against the published ceilings at Diagrams at Scale ss: 01 (T1 ≤7 nodes · T2 8–24 · T3 25–80): 5 lifelines, 5 entities and 6 states are all T1, so the sweep's badge was wrong and had been shipped for thirteen rounds. Corrected to T1. Topology at 9 nodes and layered at 6 layers were already right. **The duplication is what concealed the error — one chip contradicting another is only visible when you read both, and nothing was reading either.**

**Instruction sentences are Nunito.** Four control-row hints ("Click a phase to isolate its column" and its siblings) were mono caps. An instruction is the clearest case R35.2 covers; mono stays on the label beside it.

### Round 38d — the sweeps were matching literals, not generators

**Root cause, stated once.** Every density fix so far has been a search-and-replace over literal style strings. Anything produced by a differently-written code path — a row generator that composes its background separately, a title written as a `div` rather than after a corner bracket, a legend built from a type map — was invisible to the pattern and survived. That is why the same three complaints kept reappearing on pages reported as fixed. The fix is to edit the generator, not the string it happens to emit.

**Diagrams II, re-scoped at the generator.** This page's mono class is declared: field names, PK/FK chips, port numbers, message ordinals, node ids and layer numbers. Everything else is Nunito.

| Generator | Was | Now |
|---|---|---|
| ERD field row | `padding:3px 12px`, `i % 2 ? ';background:#fafafa'`, EROW 22 | `padding:8px 14px`, top hairline, EROW 36 · EW 190 → 214, EHEAD 34 → 40 (entity height derives from these, so the box and its SVG anchors follow) |
| Four specimen titles | mono 12/700 caps in a `div` | `<h3>` Nunito 700/15 sentence case |
| ERD and state legends | mono caps — Primary, Foreign, Initial, Terminal | Nunito 14/600 |
| Topology legend + zone chips | mono caps via the type map and `MONO` constant | Nunito 14/600 |
| Layer capability lists | mono 12/400 | Nunito 14/400 — these are prose lists, not identifiers |

**Deliberately not changed: button labels.** `← Prev`, `Next →`, `Show all`, `Reset` are mono on every page in the library, and R35.2 would make them Nunito. Changing them on one page would make that page inconsistent with thirty-nine others, so this is a system-wide call, not a page fix — recorded as open rather than half-applied.

### Round 38e — stripping the family is not converting the label

**R35.6.** Mono's family and mono's treatment are one thing. Deleting the `MONO` constant from a composed style leaves 12px, 700, caps and .08em tracking behind, which produces a Nunito string set as a mono label — a third typographic role the system does not have, breaking the 14px Nunito floor and the case-and-tracking definition of the two mono roles at the same time. **Converting a label to Nunito means replacing the whole treatment: 14px, 600, no letter-spacing, no text-transform.**

Fixed at the two sites where last round's edit stripped only the family: the topology zone chips (`Public edge`, `Application subnet`, `Data subnet`) and the ss: 05 cross-cutting column label, which had been left mono while the layer names beside it moved. `Layer 01`–`Layer 06` are numerals and stay mono.

**Where the page's mono now sits, checked rather than assumed.** 135 mono to 75 Nunito, and the remainder is accounted for: the declared code class (ports, field names, PK/FK/N chips, message ordinals, state ids, node type-and-id pairs, layer numbers, tier chips, `ss: NN`), around 22 nav and footer strings that locked rule 17 *requires* to be mono pills, and the five button labels deferred as a system-wide call. A raw mono-to-Nunito ratio is therefore not the test — R35.2 is about whether each string is a code or a word, and a page whose codes genuinely outnumber its prose will read mono-heavy and be correct.

### Round 38f — R35.5 enforced by scan, not by instance

Three rounds running, a pattern rule was applied only where it had been pointed out. R35.5 was written in round 38 and fixed at the two places that appeared in Wynt3r's screenshots; a third nested canvas survived on Diagrams II ss: 05 (two identical #fafafa / 1px dashed #d9d9d9 frames 27px apart) and two more on Diagrams IV and Diagrams at Scale.

**Enforced properly.** A depth-aware pass over every page now walks `div`/`section` open and close tags, tracks nesting, and flags any element carrying the canvas signature that sits inside another one. Three outer frames stripped; the scan re-runs to zero. The inner element is the one kept in each case, because it is the `role="img"` diagram canvas carrying the accessible label.

**The signature matters.** The filter is `background:#fafafa` **and** `1px dashed #d9d9d9` together. Dashed borders that are diagram *marks* must survive and do: the topology zone boundaries at 1.5px dashed #000, the external-system node type, and the blueprint's dashed boundary lines. A rule about frames must not catch strokes.

**Method note, which is the real output of this round.** A rule expressed as a pattern needs a check expressed as a pattern. Every time one of these was implemented as "fix the reported element", the next round found it again somewhere else — nesting (three rounds), mono size (two rounds), mono scope (three rounds), duplicate chips (one round). The pre-flight gate at Selection ss: 03 is where these belong as executable checks.

### Round 38g — the strip should have been a conversion

The nested-canvas scan removed `background`, `border` and `border-radius` from each redundant outer frame. On three of them that element was doing **two** jobs — the specimen card *and* the canvas frame — and only the frame job was redundant, so stripping properties left a wrapper with 26–28px of padding and no surface. On Diagrams II ss: 05 that made one section the only one of five peers with no container.

**Converted, not stripped.** All three outer wrappers now carry the S3 specimen card their sibling sections use: `background:#fff;border-radius:14px;padding:26–28px;box-shadow:0 14px 28px -6px rgba(0,0,0,.11)`. A white card is not a canvas, so R35.5 stays satisfied and the stack is card → dashed canvas → lifted tiles, which is what every other specimen on those pages already did.

**Rule for the next pattern sweep.** Removing a treatment is only safe when the element has one job. When a container is both a surface and a frame, the sweep has to name what the element becomes, not what it loses — and the check is peer comparison: if four sibling sections wrap their specimen the same way, the fifth is wrong, not novel.

### Round 38h — enumerate by ancestry, not by string

**The pattern that missed on six consecutive rounds, and why.** Every mono and zebra sweep matched a *string shape*: `font-size:14px` inside a style attribute that also contained the mono family, `(i % 2 ? ';background:#fafafa;border-radius:6px' : '')`, and so on. Two forms defeated it. Mono size is frequently declared on a **child that inherits the family from a grid parent** — `<div style="…;font-family:'JetBrains Mono',monospace">` with children carrying only `font-size` — and `#fafafa` is written with a leading semicolon, without a radius, or as a bare inline value on a template span. Both were visible in an early grep of Diagrams at Scale and deferred as "less common"; they accounted for the majority.

**Replaced with enumeration.** A depth-aware walk now resolves the *inherited* font family for every element and corrects any mono descendant whose size is not 12px, at whichever element declares it; and `background:#fafafa` is removed everywhere it is not accompanied by a dashed frame. **219 mono sizes and 51 stray fills across 14 pages** — none of which the six previous sweeps had reached. Re-scan leaves four cases, all resolved or deliberate:

- Two `Implementing` ss: 02 metric cells at 15px (the open debt carried since round 35) → 12px, IDENTIFIER role.
- One `Exemplar` display slab at 17px → kept, and the rule now bounds itself (below).
- One `Diagrams IV` edge label using `background:#fafafa` as a knockout so the connector does not run through the text → kept; that is a functional mask on a canvas, not a row fill.

**R34.2 bounded.** "Mono is one size, 12px" governs mono in its **meta** roles — labels and identifiers. The one black display slab per section (rule 7b) is content, not meta, and sets its equation at 17px as part of that component's spec. Stating the boundary is better than either forcing a display equation to label size or reopening the size-based role distinction R34.2 closed.

### Round 38i — padding raised by value, and the coverage table re-scoped

**Same failure, eighth round: a fixed list of literal pairs.** The round-38 padding raise mapped eight specific `padding:<v>px <h>px` strings. `9px 14px` was not among them, so the ss: 06 coverage table's 27 rows stayed at 9px — 5px tighter than their own header — while rule 10 said ≥14px.

**Replaced with a value parse, bounded structurally.** Two passes, neither matching a literal pair: cells that are direct children of a **per-row grid table** (identified as a `grid-template-columns` value repeated three or more times in the file, which is this system's table signature) and cells rendering a template hole. Any vertical padding under 14 is raised to 14, horizontal to at least 14. **279 + 5 cells across twelve pages.** Chips, pills and buttons are untouched because neither pass reaches them.

**The coverage table's mono class decided rather than left over.** The whole table inherited mono from its frame, including a Family column of prose names ("Process flow / process map", "Concept map") and a State column reading Built / Queued / Parked. Under R35.2 those are words: Family is Nunito 14/400, the State chip is a Nunito 14/600 pill, and mono keeps the `Where` column, which is a reference (`Diagrams ss: 02`). Mono on the frame is no longer doing the deciding.


## Round 37 (2026-09-02) — navigation rebuilt, non-system pages removed

**The complaint.** Selecting a menu item changed the options inside that menu: each page carried an ad-hoc `ALSO IN <GROUP>` strip listing a different subset of siblings, so the same parent appeared to hold different children depending on where you stood. The page's own section list also sat inside the menu container, making a table of contents look like site navigation.

**R37.1 — the menu is fixed, the dropdown is the group.** Five groups (Programme retired): Foundations · Components · Diagrams · Templates · Composition. Each pill carries a hover/focus dropdown listing every page in that group, same order, on every page. Current group = active-tab pill; current page = #f1f1f1 pill at 700 inside its own dropdown, not a link. Dropdown items Nunito 400/14 + teal underline; pills stay mono caps and unmarked. `ALSO IN <GROUP>` retired.

**R37.2 — the table of contents is not navigation.** `ON THIS PAGE` moved to its own non-sticky #fafafa strip below the menu bar with a bottom hairline. Anchor targets 126 → 78px. One sanctioned helmet exception: `[data-nav-group] [data-nav-menu]{display:none}` + `:hover,:focus-within{display:block}` — a descendant hover cannot be expressed inline.

**R37.3 — dashed frames are diagram canvases only.** 54 `1px dashed #d9d9d9` frames audited in context; 27 converted to borderless white + S1, 27 kept. Kept: the twelve scrolling drawing canvases (Diagrams II ×5, III ×3, IV ×4, at Scale ×1), the seven diagram specimens on the library page, the cycle diagram on Learning, and the three small annotation frames (Anatomy, Equivalents, Print). Converted: every case where the frame existed only because a container held shadowed children — the frame was solving a problem created by nesting a tile inside a card. Matrices and register grids that had been framed as canvases (Structured, T2, T8, Learning) are tables and lost the frame with the rest. A redundant corner bracket inside a newly enclosed card is dropped.

**Pages removed.** `Review` (inspection findings) and `Options` (visual-direction explorations) on the user's instruction; `Depth & Density` on the same principle — a proposal record written in second person about the user's marks, whose rules are locked in CLAUDE.md and specified at Foundations ss: 04. `Roadmap` and `Taxonomy Audit` were kept by the user but sit outside all five groups: they carry the standard menu with no active pill and appear in no dropdown.

**Reporting stripped from system pages.** Diagrams at Scale ss: 06 turned from a built/queued/parked coverage table into a **family index** (family → page carrying its specimen, Built rows only, state column and the wave-plan block gone). Diagrams III/IV: wave framing out of both mastheads and footers, "Rules added" → "Rules", the coverage-after-wave and still-open cards deleted. Foundations: masthead status row (IN REVIEW · depth language · updated Aug) and the v0.1 footer stamp gone; page chip dropped where it merely repeated the active group pill (Foundations, Composition).

**Standing rule.** A page in this project contains rules, specifications, limits and specimens. Round numbers, coverage percentages, ratification status, queue state and anything addressed to the user belong here, not in a page. The test: would an agent building a new document need this to build it correctly?


## Round 39 (2026-09-06) — the type and spacing rules the library kept failing

Twelve marks from the user across Structured ss: 06–09 and Foundations ss: 08–16. Every one was a rule defect, not an instance defect, so each is ratified in CLAUDE.md before any page was touched. Pages rebuilt this round: **Structured** (Metric, Comparison, Requirement & evaluation, Learning) and **Foundations** (Callouts, Tables, Media, Code, Prose, Extension points). The remaining 32 pages are queued.

### Ratified

**R36.1 labels recede by weight and tracking, not by size.** First pass authored every label at 10px; the render environment floors font-size at 12px (probe: 8/9/10/11/11.9px all compute to 12px, 13px computes to 13px), so 234 declarations changed and nothing moved on screen. Size is not the lever available. LABEL is now 12px/**600**/caps/ls **.05em** against the previous 12px/700/ls .08–.1em: the tracked caps string was optically wider and blacker than the 15.5px prose it annotated, and dropping weight one step while more than halving tracking pulls it back without touching the caps signal. IDENTIFIER stays 12px/600 verbatim, no tracking; case and tracking carry the role split, as R34.2 intended. Standing consequence: **a size claim in this system must be verified against computed style, not the authored value** — 238 label declarations across the two pages now match what they paint.

**R36.2 heading tiers, and the floor under them.** T3 was 700/15 against 15.5px body: a container heading set *smaller* than its own contents. Now T3 800/19 lh 1.3 ls −.01em, with T3b 700/16 for the corner-bracket sub-block. 45 headings raised; 6 corner-bracket titles converted from mono caps to Nunito (R35.4 was already law and still being broken).

**R36.3 label never on the heading's line.** The metric card read `METRIC | Pipeline freshness | PUBLISHED` on one row, and the evaluation card `EVALUATION | Orchestrator selection | MED CONFIDENCE`. Both now run label row → heading → body. This was the user's most specific structural complaint and had been raised before.

**R36.2 breathing floors raised.** Container padding ≥28 (primary 32), sub-section separation 28px + inset hairline, label→content 12, card grid gaps 20, list item gaps 12, row padding-y 16, line-height ≥1.75 at 14px. The compare card is the reference case: label row, heading, description, **rule**, pro/con, **rule**, best-for label + value.

**R36.4 no one-sided fence.** The callout summary box and the two technology reference labels carried a left accent border. Retired: emphasis is L1e (offset below and to the right), and the accent enters the reference header as a 44×3 bar under the heading.

**R36.5 grey retired as a surface.** Table header rows, row hover washes and subtle-fill buttons lose #f1f1f1. Header rows are white under a 1.5px black rule; hover is rgba(29,233,182,.12); the quiz option is white + 1px #ebebeb. #f1f1f1 survives as a track and as the figure/video placeholder zone only.

**R36.6 code is colour-coded.** Five token roles: keyword #6a3ea1/700, string #0e7a5f, numeral #a3441a, callable #000/600, comment #000/300 italic. Contrast on white is 5.3:1 or better for every hue. Weight still carries structure, so the palette is additive. This is the single exemption from the black/white ink law, and it is scoped to a code surface.

**R36.7 black fill ration tightened.** Retired: black status chips, the black code surface, the black display slab, the black inline-code chip. Kept: primary button, the one selected control in a set, the current step marker, diagram terminals, chart axis/threshold lines. The display slab becomes white with a 1.5px black border.

**R36.8 tables carry no outline.** Borderless white at S1 radius 12, title above as a label with no rule beneath it, header row white under one 1.5px black rule, rows on #ebebeb hairlines at 16px padding.

**R36.9 no em dash in page copy.** 53 instances removed across the two pages: colon where the second clause explains, comma where it qualifies, full stop where it is a second statement. Attribution takes a mono label, never a dash. En dash survives in numeric ranges.

**R36.10 code split from media.** Foundations ss: 14 is Media (figure + video, each now with a T3 title and a one-line description above the slot per R19.11); ss: 15 is Code, carrying the block, the token palette, inline code, the language badge and the technology reference header. Prose moved to ss: 16, Extension points to ss: 17.

### Pages removed
`Roadmap` and `Taxonomy Audit`, on the user's instruction: temporary working pages, outside all five groups, not product-level output. Three footer links to Roadmap (Interaction, Provenance, Wayfinding) removed; `taxonomy-audit-data.js` deleted. Library is 34 pages.

### Also removed
Foundations ss: 16 "Expansion notes" was half specification (remappable semantics, data-driven scales) and half roadmap ("Next components — priority order", "then page templates:"). The roadmap card is gone and the section is now **Extension points**, four rules on the page canvas with no container, per R19.7.

### Queued
The 32 remaining pages need the same six mechanical sweeps (mono 10px, T3 19/800, corner-bracket titles, spacing floors, grey surfaces, em dash) plus per-page checks for black fills, one-sided fences, table outlines and label-on-heading rows. Two open calls for the user: whether button labels move from mono to Nunito, and whether the technology reference header pattern is right before it is applied library-wide.


### Round 39b — the sweep was blind by construction, and two tiers collided

**The blind spot, named.** Three rounds running, mono labels survived a sweep that reported success: Foundations table cells, then Foundications chips, then T6's title-block chips and breadcrumb. One cause each time: both the sweep and the checker tested `style.includes('JetBrains Mono')` on the element's OWN attribute, and a label almost always inherits the family from its row and never names it. A check scoped that way structurally cannot see the violation it exists to catch.

Fixed at the cause. `dc-inherit.js` parses the page into a real tree and resolves `font-family`, `font-size`, `font-weight`, `letter-spacing` and `text-transform` through each element's ancestors; `sweep.js` and `lint.js` both consume it. A literal is only rewritten when **every** element carrying it resolves to a mono caps label, so a shared style string cannot be changed out from under a Nunito context. It found 19 labels across the seven finished pages that three prior string passes had missed.

**Tier collision (R36.11).** Raising T3 15 → 19 → 21 collided with pages whose section titles were authored at 800/21 (T6 Metric, T9 Reference: five each). Both tiers painted 21px/800, so a section title and a card heading were indistinguishable — the exact complaint the round was fixing, reintroduced one level up. Section titles raised to the ratified T2 900/28. The checker now asserts `max(h2) > max(h3)` per page; before this, a page could pass with both tiers equal.

**Scroll-spy bars (R36.12).** R28.1 banned the bar in on-this-page strips; T6 and T9 carried one in a sticky rail TOC, which the rule's wording did not reach. Scope widened to every section list, strip or rail: the current item is weight 700 and not a link, with no bar beside it.

**Checker false positives tuned out** so its counts are trustworthy: sanctioned segmented-control tracks, token swatches, the rule-17 current-page pill, the `ss: NN` + h2 section header (not a label on a heading), two-sided borders (not a fence), rows padded like rows, and deliberate label/value micro-pairs.

**Stale specification text.** Anatomy documented retired rules in its own field tables: zebra rows, grey header fills, white-on-black code, mono at 9/9.5/10px. Nine strings corrected. A page that specifies the old system to implementers is worse than one that merely looks wrong, and no visual sweep can find it — this class needs a content read, not a scan.

**State.** Seven pages at zero blocking findings: Foundations, Structured, T9 Reference, Diagrams, Anatomy, Diagrams II, T6 Metric. Twenty-eight queued, 78 blocking findings between them.


### Round 39c — black fill, checked as a class

Same blind spot, third instance, now closed by the same method. The black inline-code chip retired in R36.7 survived on seven pages the checker had passed at zero, because `sweep.js` matched one literal (`padding:.35em .8em`) and `lint.js` required either padding ≥12px (a surface) or `text-transform:uppercase` (a caps chip). A lowercase mono identifier at `padding:2px 8px` fell between all three tests.

**The rule, stated so it can be checked:** a black fill carrying **monospace** text is legal only on an interactive control. Black fill on Nunito is the sanctioned set (diagram terminal, current-step marker); black fill on mono is a chip, a slab or a code surface, all of which R36.7 retired. `blackFillFixes()` in `dc-inherit.js` resolves family and interactivity through the tree and returns chip corrections plus a hand-fix list for surfaces. Across the library it found **23 black mono chip styles and 4 black mono surfaces**, 17 of them on pages already reported clean.

**Consequences on the finished pages.** T9 Reference 6, Diagrams 3, T6 Metric 3, Foundations 2, Structured 1, Diagrams II 1. The Diagrams node legend drew its START terminal as mono on black; a terminal label is a node label, so it is now Nunito 700/14 like the Step node beside it, and the legend reads consistently: nodes and terminals in Nunito, only their type labels in mono.

**T6's equation is the display slab, not a code surface.** The black→white conversion had treated it as code (borderless white, S3 float, mono 12px). Per R7b it is the section's defining equation: white, 1.5px black border, identifier mono at 17px, 26px padding. A code surface and a display slab are different components and the conversion should not have inherited across them.

**Checker note.** The body line-height floor now skips mono runs, since a slab or code block sets its own leading.


### Round 39d — the em dash as a value, and the rail question decided

**Dash check widened to the class.** `lint.js` counted ` — ` with surrounding spaces, so a bare em dash used as a **no-data glyph in a table cell** was invisible to it and T6 reported clean with one on screen. Foundations had already resolved this construct to `n/a` in its own tables; the rule had just never been stated. Now: a dash standing in for missing data is a value, not punctuation, and reads `n/a`. The check reads rendered copy with `<script>` blocks stripped (Anatomy's field tables use `"—"` as a programmatic sentinel that never renders) and catches both forms. Found: T6 ×1, T9 Reference ×1, Diagrams ×2 (an em dash used as an arrow shaft in a diagram's text alternative, now `→ request →` like the rest of that sentence, and a JS placeholder).

**R36.13 — which rule owns a page's section list.** Rules 16 and 17b both described "a page's section list" and neither said which artifact it governed, so T6's rail sat between them for two rounds. Decided: **17b governs library documentation pages** (the horizontal ON THIS PAGE strip under the menu bar, #fafafa, not sticky). **A template sample is a specimen of a delivered document, not a library page, so its in-page navigation is the rule 16 sticky rail** — ≤260px, ≤60vh with internal scroll, released to a static row at 1150px. The horizontal strip is library chrome a specimen does not carry. Both patterns mark the current item by weight alone (R28.1). T6 and T9 rails brought inside the 60vh internal-scroll limit; the checker now asserts it, so the twelve template pages inherit a decided pattern.

**Pattern across 39b, 39c and 39d.** Three consecutive defects had one shape: a check scoped narrower than the rule it enforced — family read from the element's own attribute, black fill gated on padding size and caps, dash matched only with spaces. Each was invisible to a passing checker. The standing correction: **a check asserts the resolved, rendered property, and it must be able to see every form the violation takes.** The three fixes live in `dc-inherit.js` and are shared by sweep and checker so a rule cannot drift between them.


### Round 39e — the rail cap belonged to the sticky state

Adding `max-height:60vh;overflow:auto` to `#page-rail` inline put the cap on the element instead of inside the sticky branch, so it survived the ≤1150px release: below that width the rail is `position:static`, full-width ordinary page content, still capped at 60vh with internal scroll. It did not clip at the review width (two cards side by side, scrollHeight = clientHeight) but would on any viewport under roughly 657px tall, once `flex-wrap` stacks the cards to ~394px — a nested scroll box trapping page content mid-flow.

The cap now lives in the media block alongside the release (`max-height:none!important;overflow:visible!important`) on both rail pages. The checker asserted only that the cap **exists**; it now also asserts the release **drops** it, and that assertion is ship-blocking, because a page could otherwise pass while carrying the trap.

**Rule for responsive state generally:** a constraint that belongs to one responsive state is authored in that state's block, never on the element. An inline constraint is unconditional by definition, and a media query that does not name it cannot undo it.


### Round 39f — the checker was only testing the negative half of a rule

R36.8 has two halves. The checker tested three prohibitions (no grey header, no zebra, no outline) and asserted **none of the requirements**, so a table with no row separators at all and cells at 3px padding passed at zero blocking. T6 carried two such tables while a register two blocks down on the same page had the hairlines, so one page showed two tabular components that did not match.

**Now asserted:** a run of sibling grid rows sharing one template is a table; every body row after the first carries a row separator (1px #ebebeb solid, or the dotted #d9d9d9 register variant), and rows are padded ≥16px vertically on the row or on its cells. Two refinements were needed before the count could be trusted: grouping by **parent identity** rather than a positional key (a weak key had collapsed unrelated grids into one 13-row phantom table and produced 151 false findings), and allowing the run's open edge (a bottom-based separator run legitimately omits its last row).

**Applied as a pass, not by hand.** `applyTableFixes()` works by source position, because rows in one group share a style literal and the first body row sits under the header rule and must not take a top hairline. Fixed this round: T9 Reference 11 hairlines, Diagrams 11 hairlines, plus cell padding raised from 3px and 14px to the 16px floor on four pages. The 12-week series table under T6's chart was the extreme case at 3px cell padding.

**Queue: 94 blocking findings across 28 pages, 47 of them table rows on 7 pages.** The count keeps rising as the checker learns to see; that is the intended direction.


## Round 40 (2026-09-07) — the shared component layer, and the pilot rebuild

**Four calls answered on a form:** start the rebuild now rather than hold for an outside audit (none had
arrived in the project) · **Foundations is the pilot page** · **one shared component file per part, imported
by every page** · **button labels stay mono caps** · the technology reference header is signed off for
library-wide application.

### R37.1 — control labels are mono caps, by exemption
R35.2 asks whether a string is a code or a word, and by that test a button label is a word. Ruled the other
way: a control label is mono 12/600 caps with .02em tracking on every page. The label of a control is not
prose about the control, it is the control's identity, and the system has 40 pages of buttons that read as one
family only because they share that treatment. This is the second standing exemption to R35.2 after the
rule 17 nav pills. It closes the open item carried since round 38d.

### R37.2 — a repeated part has exactly one implementation
The component census counted 2,622 label chips, 496 containers, 280 authored menu bars and 152 section
headers, every one hand-written on the page it appears on. Nine shared Design Components now exist and are
the only legal way to author those parts:

| File | Part | Props |
|---|---|---|
| `cm-nav.dc.html` | rule 17 menu bar, closed group/page registry in its logic | page, badge |
| `cm-toc.dc.html` | the on-this-page strip for library pages | items (JSON), current |
| `cm-mast.dc.html` | masthead: bar + page title at 900/44/1.15 | title |
| `cm-section.dc.html` | teal bar + `ss: NN` + T2 900/28 title | n, id, title, label, padBottom |
| `cm-container.dc.html` | the eight legal surfaces (card, hairline, primary, float, canvas, emphasis, reserved, tile) | variant, pad |
| `cm-chip.dc.html` | label chip / status pill, thirteen tones, three roles | tone, role, shape |
| `cm-callout.dc.html` | callout row: glyph + label chip + body, closed eight-label vocabulary | label, fill |
| `cm-table.dc.html` | rule R36.8 table: label title, white header under a 1.5px rule, hairline rows, ≥16px cells | cols, head (JSON), title, mono |
| `cm-bar.dc.html` / `cm-bracket.dc.html` / `cm-code.dc.html` | magnitude bar, corner-bracket sub-block, code surface | pct/label/value · title · file/lang |

**Page prose stays on the page.** Verified before building: template children pass through a
`<dc-import>` to `{{ children }}`, so a container, callout, table cell or section body is authored as page
markup inside the component. The component owns geometry, type and depth; the page owns words. That is what
makes the shared model compatible with in-place editing, and it is why the components take no body-text props.

**The registry is the point.** `cm-nav` holds rule 17c group membership as data, so the defect rule 17
exists to prevent — a dropdown whose contents vary by page — is now unrepresentable rather than forbidden.

### Pilot: Foundations rebuilt as a composition
17 sections, masthead, nav and on-this-page strip all now mount shared components; the 8 callouts and both
table specimens are component instances. **141,625 → 116,982 chars, a 17% cut with no content removed**,
almost all of it the 14,385-char authored menu bar. Two off-token values fixed in passing: the masthead title
52px → 44px at 1.15 leading (the decided figure scale), its lede 17px → 15.5px at 70ch. One labelling defect
found and fixed: `sec-blocks` carried `data-screen-label="Core blocks"` with no section number, so a comment
on ss: 12 could not be placed.

**Deliberately not converted:** the chip specimens at ss: 06. That section's job is to display raw token
values, so it is the one place the literals belong. Chips convert on pages that *use* them.

**Token files stay documentation.** `styles.css` and `tokens/*.css` record the ratified values; the runtime
mechanism is the inline literal inside each shared component, one copy per part.

### Queued next
Batch of five pages against the component layer: Icons, Print, Equivalents, Structured, Prose. Then the
technology reference header applied library-wide, now that it is signed off.


## Round 40b (2026-09-07) — first batch of five, and the pass that does it

Icons · Print · Equivalents · Structured · Prose rebuilt as compositions. **376,570 → 294,057 chars across
the six pages now on the component layer** (Foundations included), between 23% and 45% off each page, no
content removed. `cm-footer` added as a twelfth component.

**The pass is a pass, not a set of page edits.** `_rebuild/compose.js` records the patterns; every page is
converted by the same routine, which asserts before it writes — nav and on-this-page bounds found, at least
one anchor in the strip, a section header row under every teal bar, `<dc-import>` and `<section>` tags
balanced. A page that fails any assertion is reported and left untouched. That is the discipline round 38f
named and never had: a rule expressed as a pattern needs a check expressed as a pattern.

**Four off-token values normalised by the components rather than by hand**, which is the whole return on the
shared layer:
- section rhythm 88px → 96px (rule 9), on the four pages that had drifted
- page-header top padding 40 / 48 / 72 / 88 → one value, 48px, on the structural scale
- page title 40 / 44px at 1.06 / 1.08 leading → 44px at 1.15 (the decided display leading)
- page lede 16px / 1.8 / 68ch → 15.5px / 1.85 / 70ch (the page-canvas body tier)

None of these can drift again on a rebuilt page: the value exists once, inside the component.

**One mislabelling found:** `Structured`'s footer strip carried `data-screen-label="Expansion notes"`, so a
comment on the footer arrived tagged as a section that does not exist. The footer row also underlined its
link with `border-bottom` rather than the canonical `text-decoration` underline (R28.1); `cm-footer` uses
the canonical treatment. **The other 33 pages carry footer variants the pattern does not match** — they
convert as each page is rebuilt, not in a sweep.

### Queued next
Batch two: Wayfinding · Provenance · Charts · Interaction · Learning. Then Questions · Change · the four
Composition pages. Templates and the eleven T-pages last, since they carry the sticky rail (R36.13) and a
page badge, neither of which is in the component set yet.


## Round 40c (2026-09-07) — the whole library on the component layer

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


## Round 40d (2026-09-07) — the correction pass, applied without further questions

Reviewer's note, recorded because it changes how this work is reported: the previous three rounds were
reported as machinery (passes, counts, declarations) and closed with a form asking him to arbitrate
technical scope. Both were wrong. **The rules and the component layer exist so these decisions are made
here, not escalated.** Progress is shown as pages, not as counts.

Applied across all 35 pages:
- **114 container headings** were set at 15px/700, smaller than the 15.5px prose beneath them, which is the
defect R36.2 exists to prevent. Now T3: 21px/800 at 1.3.
- **613 mono labels** still carried the retired wide tracking (.06–.09em). Now .02em.
- **624 spacing values** sat off both scales (5, 7, 11, 15, 18, 22, 26px). Stepped onto the nearest legal
value. Gaps on the five diagram pages were left alone: their connector geometry derives from them.
- **93 prose blocks** were leading under the floor (1.4–1.6). Now 1.75 at 14px, 1.85 at 15.5px.
- **21 grey header rows** (#f1f1f1, retired by R36.5) are white under a 1.5px black rule.
- **130 mono chips at 700** are 600. A chip already carries a fill or a border; weight has nothing left to mark.
- **Six black-filled chips** that mark nothing actionable: four `Published` status chips now take the ok
tint, two `Reference build` badges are neutral. Rule 7c retired both.
- **One full-sentence claim** at 19px/800 on T11 is prose at 15.5/400. Weight marks a phrase, never a sentence.
- **The menu bar and section strip wrapped badly under ~1040px**, orphaning the last pill on an indented
second line. Both rows now break to full width, so the pills start at the left margin. Fixed once, in the
two components.

Still authored by hand and queued: the sticky rail, the label chips as instances, container surfaces.
Neither blocks anything; both are maintenance now that the values live in one place.
