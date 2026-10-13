# content-morphia library rules (reference)

> **Reference, not the rules in force.** The rules in force are `kit/report-kit/SPEC.md`, the Report
> Kit 1.1 specification. This file records the rules of the original 35-page content-morphia library
> as of its 28 Sep 2026 export. Use it when adopting a library feature into the kit
> (`docs/adoption.md`). Where this file and the kit disagree, the kit wins.

The rules of the content-morphia library. Each rule states the library's value once.
Reasons and history live in `docs/decisions/`; read a decision record only when you need to know why.

**How this file was built.** It merges three sources from the 28 Sep 2026 export:

1. The locked rules in `import/nodetrak-presentation-layer/CLAUDE.md` (state after round 40d).
2. The two later rulings recorded only in `CONTINUATION.md`: round 40e and round 40f.
3. The values the twelve shared components (`cm-*.dc.html`) actually render.

Where those sources disagree, this file states the value the shared components render, and marks the
rule **Open** with a link to `library-open-items.md`. An open item is a question for the owner, not a licence
to pick a side.

**Owner terms.** "The owner" is the person who rules on this system. A **view** is one rendered screen
or page section a reader sees at once. A **container** is any bounded surface: card, callout, figure,
table.

---

## 1. Product context

- content-morphia presents a **knowledge index**, not a marketing site. Topics are nested nodes; nodes
  and the relationships between them carry context nodes that aggregate many sources.
- Freshness, cadence, staleness and what-changed-since are load-bearing. Nothing updates live in the
  page: no live regions, no in-session mutation.
- Provenance, citation density and confidence are core grammar. No third-party listings, no user
  submissions.
- Imagery is diagrams and figures only.
- Two capability clusters lead the build order: navigating a deep index, and provenance with freshness.

## 2. Colour

**Ink**
- Text is `#000` or `#fff` only. There is no grey text, anywhere.
- Hierarchy is carried by weight, never by tinting ink.
- Code is the one place hue enters ink, and only inside a code surface:
  keyword `#6a3ea1` at 700 · string `#0e7a5f` · numeral `#a3441a` · callable `#000` at 600 ·
  comment `#000` at 300 italic · everything else `#000` at 400.

**Accent**
- Accent is `#1bbd94`. **Open: O1** (token file, rulebook and icon fills still carry `#1de9b6`).
- Accent is never text. It appears only as: bars, 1.5px link underlines at 3px offset, borders, chip
  fills, the reserved offset shadow, column and hover washes, list bullets, and chart data marks.
- Washes: `rgba(27,189,148,.12)` row hover · `.25` recommended column header and accent chip ·
  `.3` interactive hover.
- Accent is always redundant with a shape, label or position cue.
- One meaning per colour per view.

**Surfaces and greys**
- Page background is `#fff` on every page.
- `#f1f1f1` is a **track** only: rails, progress and magnitude bars, segmented-control tracks, disabled
  fields, and media placeholder zones. Never a table header, row wash, button fill, node or tile.
- `#ebebeb` survives as the table row rule. Container hairlines, inset dividers and dotted rules are
  retired. **Open: O7** (dividers named in §6 and 30 dashed frames still on pages).

**Semantics**
- A semantic is always black text plus a label from the closed vocabulary. Never colour alone.
- Two intensities:
  - **Tint**, the default: hue on white, black text, no border.
    ok `rgba(0,230,118,.2)` · warn `rgba(255,214,0,.3)` · crit `rgba(255,82,82,.16)` ·
    info `rgba(64,196,255,.22)` · note `rgba(179,136,255,.22)`.
  - **Solid**, the view's verdict, at most one per view: `#00e676` · `#ffd600` · `#ff5252` ·
    `#40c4ff` · `#b388ff`, each with a 1.5px black border.
- A semantic fill never serves as a heading or a column header.
- Exempt from the tint default: a token swatch naming its own hex, an unlabelled data mark, and an
  interactive control's border.

**Black fill**
- Black fill is retired on every button, chip and control; they take an outline instead.
- Disabled is the track fill with black text.
- **Open: O6** on which black fills survive (diagram terminals, chart axis and threshold lines, current
  step marker, the nav page badge).

## 3. Typography

**Families**
- **Nunito** 300 to 900 for reading and display.
- **JetBrains Mono** for meta only: labels, identifiers, units, timestamps, table headers, chip text,
  provenance, code.

**Heading tiers** (Nunito, letter-spacing −.01em)

| Tier | Size / weight / leading | Use |
| --- | --- | --- |
| T1 | 44 / 900 / 1.15 | Page title (masthead) |
| T2 | 36 / 900 / 1.15 | Section title |
| T3 | 30 / 800 / 1.2 | Container heading: card, callout, figure, table |
| T4 | 24 / 800 or 700 / 1.25 | Card title in a peer grid (800); sub-block title (700). **Open: O9** |
| T5 | 18 / 700 / 1.3 | Minor heading under T4 |

- A heading is never smaller than the body it introduces.
- No two tiers share a size on one page. T2 outranks T3 on every page.
- Mono is never a heading tier. A mono label is never a container's sole heading.
- Template specimens still carry document-section headings at 21 and 28. **Open: O10**.

**Body**
- Page-canvas prose: 15.5px / 400 / 1.85, measure 70ch.
- Prose inside a container (card, table, callout, list): 14px / 400 / 1.8.
- Caption, source line and specimen commentary: 14px. Reading prose is never set at that floor.
- Input and select text: 14.5px.
- Figure scale for large metric numerals: 24 / 34 / 44 only, leading 1.15.
- Leading 1.15 for anything at or above 28px.

**Mono roles** (always 12px; the render environment floors every size at 12)
- **Label**, a string that is scanned: 12 / 600 / caps / tracking .02em. Units, table headers, chip
  text, timestamps, provenance.
- **Identifier**, a string that is read: 12 / 600 / verbatim case / no tracking. Metric identifiers,
  code, field values.
- Mono weight ladder: 400 quiet meta · 600 the label and every chip · 700 only for a bare emphasis run
  inside a label row, or the one active control in a set. A chip at 700 is a violation.
- Mono is scoped by section: a section picks the class of thing that is mono; everything else in that
  section is Nunito. Chips carrying words a reader reads are Nunito 14 / 600.
- Standing exemptions: nav group pills, and every control label (button, tab, pager) is mono
  12 / 600 / caps / .02em.
- The display slab for a section's defining equation sets its identifier at 17px.

**Weight**
- Weight marks a phrase, never a whole sentence.
- Where two passages must rank, the lighter goes to 300 and the heavier stays at 400.

## 4. Space and layout

- Grid 1060px max. Reading measure 70ch. Section rhythm 96px.
- Two spacing scales, split by altitude. A value from the wrong scale is a violation.
  - **Structural**, module altitude and above: 16 · 20 · 24 · 28 · 32 · 48 · 88 · 96.
  - **Component**, interior chrome: 2 · 3 · 4 · 6 · 8 · 9 · 10 · 12 · 14.
- Breathing floors:
  - Container interior padding 28, primary and reserved containers 32. **Open: O3**.
  - Label to content 16.
  - Stacked groups 36. **Open: O5** (36 is on neither scale).
  - Callout rows 28.
  - Tile and card grid gaps ≥ 20. Content column gaps ≥ 28. Sibling surfaces ≥ 16 apart.
  - List item gaps ≥ 12. Table row padding ≥ 16 vertical. Diagram gaps ≥ 14.
  - Body leading ≥ 1.75 at 14px and 1.85 at 15.5px.
- When in doubt, add one 4px step.
- Responsive is structural, in the sanctioned media block only: rails become a top strip at ≤1150 ·
  data min-widths release at ≤800 · 1fr grids stack at ≤640 · tables scroll below 641.
- A constraint that belongs to one responsive state is authored in that state's block, never on the
  element.

## 5. Shape and depth

**Radius**
- Pill 999 for every interactive. Card 14. Table and tile 12. Input 8. Code chip 6. Chip 4.
  Chart bar caps 2 to 3.
- 5 and 10 are never radii.
- Partial radii in two cases only: segmented-control end caps, and vertical bar caps.

**Soft depth** (structure at rest; never combined with an outline)
- S1 `0 1px 2px rgba(0,0,0,.06)`: tile and nav bar. **Open: O8**.
- S2 `0 4px 14px rgba(0,0,0,.08)`: every white container surface, and tables.
- S3 `0 14px 28px -6px rgba(0,0,0,.11)`: hero, chart and code frames, menus, sticky rails.

**Hard depth** (emphasis and interaction only)
- L1 hover lift: shift −1,−1 with `3px 3px 0 rgba(0,0,0,.18)` and a black border.
- L1e static emphasis: 1.5px black border with `6px 6px 0 rgba(0,0,0,.08)`.
- L2 reserved: 1.5px black border with `5px 5px 0 #1bbd94`. At most one untagged per view. Zero is
  legal. Never on a surface carrying accent data marks.
- L2-tab: `2px 2px 0 #1bbd94` on the one active control in a set.
- L3 overlay: `10px 10px 0 rgba(0,0,0,.12)`.

**Container surfaces** (`cm-container` variants; there are no others)

| Variant | Surface | Default padding |
| --- | --- | --- |
| card, hairline, primary | white, radius 14, S2 | 28 (primary 32) |
| float | white, radius 14, S3 | 28 |
| canvas | white, radius 14, inset 1px `rgba(0,0,0,.06)` ring | 28 |
| emphasis | white, radius 14, L1e | 28 |
| reserved | white, radius 14, L2 | 32 |
| tile | white, radius 12, S1 | 28 |

- One depth family per nesting level. A container whose children carry shadows carries none itself;
  it uses the canvas variant.
- A container is never fenced on one side. Emphasis is L1e; a semantic is a label chip.
- A third boundary is never drawn inside a container's child.

## 6. Structure and composition

**Page anatomy**
- Masthead: optional breadcrumb, then a marker beside the T1 title. **Open: O2** on the marker.
- Section header: marker in a left column, optional identity chip above the T2 title, body in the
  right column. **Open: O2** on the marker.
- Section numbers (`ss: NN`) are retired from display. Anchor ids remain.

**Sub-block**
- Corner brackets are retired. A sub-block carries a 16×3 accent bar left of a T4 title at 24 / 700,
  with content 16px below (`cm-bracket`).

**Containment**
- Wrap material in a container only if it is one of two or more compared peers, a skippable aside, or
  an interactive surface. Sequential prose, numbered lists and single passages sit on the page.
- Never two container levels. A container is never a container's first child.
- A canvas never contains another canvas. Count the frames above before adding one.

**Composition order**
- A heading is never followed immediately by a container group. At least one sentence names the
  group first.
- A container's identity label never shares a line with its heading. Order: label row (identity chip
  left, at most one status chip right), then heading, then body.
- Dividers separate siblings only: never heading-to-body, never between list items, never directly
  above or below a container. **Open: O7** on whether dividers survive at all.

**Tables**
- Borderless white, radius 12, S2. Title above as a mono label, no rule under it.
- Header row white under one 1.5px black rule. Body rows on 1px `#ebebeb` rules, inset from the
  surface edge. **Open: O4** on the inset.
- Cells ≥ 16px vertical padding. No zebra. No outline.
- Never put `sc-for` or `sc-if` inside `table`, `thead` or `tbody`; build tables as grid rows.

**Figures and code**
- A figure carries a T3 title, one line of description above, and provenance in mono below.
- Code is its own component (filename, language badge, syntax), never a media variant.
- One display slab per section for its defining equation: white, 1.5px black border, ≥ 24px padding.
  All other maths is inline.

**Lists**
- One item, one paragraph: a bold lead-in runs inline with its explanation. One level of nesting only.
- Teal bullets only in a scannable list of five or fewer peers at body size. Longer or nested lists take
  a 3px black square. A list whose items carry sub-lines takes no teal.

**Progress markers**
- Completed step: 22px white circle, 1.5px black border, black check, 1.5px accent connector below.
- Ahead: the same circle with a mono numeral and a dotted connector.
- Current: the one filled circle with the reserved teal offset. **Open: O6** on its fill.

## 7. Links and navigation

- A link is drawn as a link: 1.5px accent underline at 3px offset. One marker per link: underline or
  arrow prefix, never both. The arrow prefix belongs to standalone jump lists.
- The nav group pills are the only unmarked anchors; they are tabs.
- **Menu bar** (`cm-nav`): one sticky white bar, identical on every page. Brand, page chip, five group
  pills in fixed order: Foundations · Components · Diagrams · Templates · Composition. Each pill opens
  a dropdown listing every page in that group, in the same order, on every page.
  - Current group: white pill, 1px black border, L2-tab.
  - Current page in its dropdown: `#f1f1f1` pill at 700, not a link.
  - Dropdown items: Nunito 400 / 14 with the accent underline.
- **Group membership is closed.** A new page joins a group or it does not ship.
  - Foundations: Foundations · Icons · Print · Equivalents.
  - Components: Structured · Prose · Wayfinding · Provenance · Charts · Interaction · Learning ·
    Questions · Change.
  - Diagrams: library · at Scale · II technical · III experience · IV structure.
  - Templates: index · T1 to T11.
  - Composition: Composition · Anatomy · Selection · Implementing · Exemplar.
- **Section lists**: a library page carries the on-this-page strip (`cm-toc`) under the menu bar:
  white, not sticky. A template specimen carries a sticky rail instead: ≤ 260px wide, ≤ 60vh with
  internal scroll, released to a static row at 1150.
- In every section list, strip or rail, the current item is weight 700 and not a link. No bar, disc
  or fill marks it.
- Anchor targets take `scroll-margin-top: 78px`.

## 8. Labels and vocabulary

- Labels come from a closed vocabulary. A word outside it is not a label.
  - Eight callout labels: Note · Tip · Important · Warning · Example · Requirement · Limitation ·
    Correction.
  - Six status chips, three requirement levels, three check marks (full lists in
    `content-morphia Selection.dc.html`, section 01).
- Neutral chip: white with a 1px black border.
- A title block carries at most three status chips; aliases past four collapse behind a disclosure.
- Pick components against the selection matrix (Selection, section 02), not by subject association.

## 9. Icons

- One 24px outline family (Basil Icons, community), black at 1.5px, with a solid twin per shape.
- The accent enters as a partial fill above a waterline at 13 of 24, the same constant for every glyph.
- Fill only at 20px and above. At most one filled glyph per view. Never the only cue.
- Four placements: callout label 20px with fill · empty state 32px with fill · index or hub card 24px
  outline only · register row label 20px outline only.
- Never inside a sentence, nav pill, tab, table cell, status chip, button or list bullet.
- A glyph enters only through the closed register of 23 concepts (Icons page, section 04).

## 10. Diagrams and charts

- Ad-hoc diagrams use three fixed layouts: single-column ladder, two columns with one join, decision
  gate. Material that fits none becomes a table. Named families carry their own geometry.
- Nodes are borderless white with soft depth. De-emphasis is opacity .55 with the shadow dropped,
  never a grey fill. Black borders are reserved for markers and the one emphasized node.
- Connectors never touch: ≥ 8px standoff at both ends. One emphasized node per diagram.
- An edge label sits beside its line. An interactive branch control sits above it at 8px clearance.
- Charts: a population is drawn in the accent, never in solid black. A chart is evidence, not a
  verdict, so it never carries the reserved offset.
- Capacity ceilings and the level model for diagrams at scale are in decision record 010.
- The build logic for diagrams and charts (routing, label placement, layout) is being developed as a
  separate kit. It adopts these styling rules; it does not define its own.

## 11. Interaction and accessibility

- Focus: a 2px black ring at 3px offset on every interactive.
- Interactives are real `a`, `button` and input elements. Never clickable divs.
- Headings are real `h1` and `h2`. The current breadcrumb item carries `aria-current`.
- Scrollbars: 8px, `rgba(0,0,0,.22)` thumb at radius 999, `.45` on hover, `#f1f1f1` track.

## 12. Copy

- No em dash in page copy. A colon where the second clause explains the first, a comma where it
  qualifies, a full stop where it is a second statement. Titles take a colon. En dash only in
  numeric ranges.
- A dash standing in for missing data reads `n/a`.
- Attribution binds up: 6px below the thing it attributes, prefixed by a mono label, never by a dash.
- A page is the design system, not a report on it: rules, specifications, limits and specimens only.
  No diagnosis, defence, cost, ratification status, options, round numbers or change history.
  Test each block: would an agent building a new document need it to build correctly?

## 13. Shared components

Every repeated part has exactly one implementation. Never hand-author one. The component owns geometry,
type and depth; the page owns words. Body text is never a prop.

| Component | Part | Props |
| --- | --- | --- |
| `cm-nav` | Menu bar, holds group membership as data | page, badge |
| `cm-toc` | On-this-page strip for library pages | items, current |
| `cm-mast` | Masthead: breadcrumb and T1 title | title, crumbs |
| `cm-section` | Section header and body frame | n, id, title, label, chip, padBottom |
| `cm-container` | The eight container surfaces | variant, pad |
| `cm-chip` | Label chip or status pill, 13 tones, 3 roles | tone, role, shape |
| `cm-callout` | Glyph, label chip and body; closed eight-label vocabulary | label, fill |
| `cm-table` | Table surface, header and rows | cols, head, title, mono |
| `cm-bar` | Magnitude bar with label and value | label, pct, value, tone |
| `cm-bracket` | Sub-block: accent bar and T4 title | title |
| `cm-code` | Code surface with filename and language badge | file, lang |
| `cm-footer` | Footer strip | page, links |

Not yet components: the sticky rail, and label chips and containers as instances on most pages.
