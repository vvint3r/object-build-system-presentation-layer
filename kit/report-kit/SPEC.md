# Content Morphia · Report Kit 1.2 — Agent Specification

This file tells an agent how to produce a report, document or analysis as a single HTML artifact in the Content Morphia style. Follow it exactly. When this file and your own taste disagree, this file wins.

Keywords: **MUST** / **MUST NOT** are hard rules; a report that breaks one is not publishable. **SHOULD** is the default; deviate only with a stated reason in an HTML comment.

Kit files (all in `report-kit/`):

| File | Role |
| --- | --- |
| `cm-report.css` | Tokens (light, dark, print) and every component class. The only stylesheet. |
| `cm-report.js` | Theme toggle, ECharts theme + draw-in, diagram drawing and text versions, sortable tables, contents scroll-spy, link targets clear of the top bar, citation back links, print prep. |
| `template.html` | Starter. Copy it for every report. |
| `SPEC.md` | This file. |

Human-readable version with live examples and copy-paste markup: `Report Kit - Spec & Gallery.html`. Reference output: `Sample Report - Q3 Support Review.html`.

---

## 1. Non-negotiable rules

1. **MUST** start from `template.html` and compose only from classes in `cm-report.css`.
2. **MUST NOT** add stylesheets, `<style>` blocks, classes of your own, or inline `style` attributes. Allowed inline custom properties only: `--h` (chart height), `--v` (bar/meter fill), `--t` (meter target), `--steps` (process step count), plus `style="align-items:center"` or `style="align-items:start"` on a grid.
3. **MUST NOT** write hex, rgb or named colors anywhere in markup. In chart JSON use token strings (`"$accent"`, see §9).
4. **Text is black or white.** **MUST NOT** use grey text or lowered opacity for de-emphasis. Rank text with weight: 300 (de-emphasised, kickers), 400 (body), 600 (code, chart axis labels), 700 (bold phrase, row keys, role tags), 800 (labels, block titles, terms), 900 (page/section title). These are the weights the kit loads; use no other. Two exceptions to black or white, both applied by the CSS: keywords, strings and numbers in code take the syntax colours (§8.17), and the verdict chip's text takes the paper colour on its ink fill.
5. **One family for text, one for code.** Nunito for all text, labels, tables, chips and charts. JetBrains Mono **only** for code: `<code>`, `.cm-code`, file names. **MUST NOT** use mono for labels, numbers, dates or IDs.
6. **Accent is never text.** Teal appears only as bars, underlines, borders, chips, chart marks and the reserved shadow.
7. **One emphasis per view.** Exactly one `cm-featured` (L2, teal offset) per report, on the recommendations; none when a document with no actions leaves the Recommendations section out (§7). At most one solid verdict chip (`cm-chip--verdict`) per table or figure. One `cm-summary` per report.
8. **Color never fills a label.** Status color appears as a chip's 2px offset, a callout label's underline, a table row flag, or a chart mark. **MUST NOT** put a colored background behind a chip, tag or label.
9. **Meaning never rests on color alone.** Every status chip and flagged row carries a word; every highlight is backed by the sentence; every recommended column carries ★.
10. **No corners outside the radius set:** 2 thin bar, 4 chip/tag, 6 code chip, 8 input/slot, 12 table/tile, 14 card, 999 pill. Every drawn shape is rounded; square corners belong only to lines (rules, dotted connectors, the timeline rail), masked icons and the full-width top bar. The CSS applies them; never override.
11. **No decoration.** No emoji, no stock imagery, no icons beyond the glyphs the CSS supplies, no gradients except where one carries meaning (the dashed rail of a planned timeline item, a chart's colour-scale legend), no colored left borders on cards or callouts, no drop caps.
12. **No filler.** Omit an optional block rather than pad it. Every number shown is sourced.

## 2. Packaging

Two modes. Both use the same markup.

**Linked** (default for sites and shared folders):

```html
<link rel="stylesheet" href="report-kit/cm-report.css">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer></script>
<script src="report-kit/cm-report.js" defer></script>
```

**Self-contained** (for email or attachments): replace the CSS link with `<style>` + the full contents of `cm-report.css`, and the kit script with `<script>` + the full contents of `cm-report.js`, placed as the last element in `<body>`. Keep the font and ECharts CDN links. Do not edit the pasted code.

Required `<head>` (copy from `template.html`, in this order): charset, viewport, `<title>{Report title} · {Period}</title>` (`<title>{Report title}</title>` when the document covers no period, §7), `<meta name="cm-kit" content="1.2">`, the inline theme pre-paint script, font preconnects + Google Fonts link (Nunito 300–900 + italic 300/400, JetBrains Mono 400/600/700), kit CSS, ECharts 5.5.1, kit JS. `<html lang>` **MUST** be set.

## 3. Tokens

Never write these values; reference them by class or, in chart JSON, by `$name`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--cm-ink` / `$ink` | #000 | #fff | All text, rules, markers |
| `--cm-paper` / `$paper` | #fff | #0d0d0d | Page background |
| `--cm-surface` / `$surface` | #fff | #171717 | Cards, figures, tables |
| `--cm-track` / `$track` | #f1f1f1 | #262626 | Bar tracks, slots, current TOC item |
| `--cm-hairline` / `$hairline` | #ebebeb | #2c2c2c | Row rules, gridlines |
| `--cm-field` / `$field` | #d9d9d9 | #4a4a4a | Bullet dots, timeline rail, print borders |
| `--cm-accent` / `$accent` | #1bbd94 | #2fd4a8 | Accent bar, underlines, focal series |
| `$ok` `$warn` `$crit` `$info` `$note` | #00e676 #ffd600 #ff5252 #40c4ff #b388ff | same | Chip offsets, label underlines, row flags, verdict offsets |
| `--cm-*-wash` | 10–20% alpha | 16–20% alpha | Inline highlights only |
| `$c1` `$c2` `$c3` `$c4` | accent, ink, #2d6fdc, #8a4fd6 | accent, ink, #5b9af2, #a982f0 | Chart categories in order |
| `$context` | #d9d9d9 | #4a4a4a | Comparison/background series |
| `$seq` | 5-step teal ramp | 5-step teal ramp (dark→bright) | Heatmaps, choropleths |

Semantic meaning is fixed: ok = healthy/validated, warn = attention/at risk, crit = failing/breach, info = reference/external, note = caveat/sample. Never use a semantic color for decoration.

## 4. Type and headings

| Tier | Class / element | Size / weight | Rule under it |
| --- | --- | --- | --- |
| T1 | `.cm-mast__title` (h1) | 44 / 900 | Accent bar above, none below |
| Kicker | `.cm-section__num` | 26 / 300, caps, “Part 01 /” | — |
| T2 | `.cm-section__title` (h2) | 38 / 900 | 4px ink, full column width, closing the section header |
| T3 | `.cm-h3`, `.cm-card__title`, `.cm-figure__title` (h3) | 24 / 800 (`--sm` 20) | 2.5px ink, fit to the text |
| T4 | `.cm-h4` (h4) | 18 / 700 | 1.5px ink, fit to the text |
| T5 | `.cm-t5`, `.cm-timeline__title`, `.cm-step__title`, `.cm-findings__claim`, terms | 16–18 / 700–800 | none |
| Body | default | 16 / 400 / 1.9 | Reading column, max 70ch |
| Small | `.cm-small`, text inside surfaces | 15 / 400 / 1.8 | — |
| Label | `.cm-label`, kinds, metadata and status keys, callout, definition and question labels, table heads, contents rail and process step numbers; `.cm-tag`, `.cm-delta` | 10 / 800 / caps, +0.08em | — |
| Chip | `.cm-chip`, text centred in the 20px pill | 9 / 800 / caps, +0.08em, line height 10px | — |
| Role tag | property-sheet `<sup>` | 10 / 700, sentence case | — |
| Meta | `.cm-meta` | 13 / 400 | Dates, sizes, provenance |
| Code | `<code>`, `.cm-code` | JetBrains Mono 600, 0.8em / 13px | — |

The rule thickness follows the heading level; the CSS applies it. Headings never skip a level (h1 → h2 → h3 → h4). Nunito never below 9px (chips), 10px (labels, tags, deltas, role tags and table sort arrows) or 13px (running text). The breadcrumb is a label with three weights: links 700, the current page 900, separators 300. `<strong>` marks a phrase, never a whole paragraph. `.cm-aside` (300 italic) de-emphasises a phrase.

## 5. Layout and spacing

- Page: `.cm-shell` (rail + main). Reports with fewer than four sections use `.cm-shell.cm-shell--norail` and drop the `<nav class="cm-rail">`.
- Main column caps at 1060px; prose blocks (`.cm-prose`) cap at 70ch.
- **Spacing scale.** Between blocks: 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 56 · 64 · 80 · 96 · 120 · 128 · 160 px. Inside components (chips, rails, list gaps, markers): 2 · 3 · 4 · 6 · 7 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 px. Half-pixel paddings on outlined chips and buttons offset a thicker border so outer sizes match; small negative margins align glyphs. The kit applies all of these; never add your own. Sections start 128px apart (160px before the first appendix). Direct children of `.cm-section__body` are 64px apart automatically, and direct children of `.cm-collapse__body` 32px apart.
- **Link targets.** A link within the page stops its target (a section, a note, a footnote marker, a table title, a figure, a disclosure: any element with an `id`) 24px below the sticky top bar, at whatever height the bar wraps to. A page opened at an address with a fragment jumps straight to its target; links within the page scroll smoothly once the page and its fonts have loaded, and instantly under reduced motion. `cm-report.js` measures the bar into `--cm-topbar-h` and marks the loaded page with `data-cm-loaded` on `<html>`; neither is set by hand.
- **Floor (MUST):** nothing sits closer than 24px to a distinct neighbouring block, and no label sits closer than 8px to the content it names. The kit's spacing already meets this; never add negative margins or tighter wrappers.
- **Bleed rule:** every top-level surface in a section (figure, card, summary, KPI strip, table wrap, code, collapsible group) carries `.cm-bleed`, so its inner text aligns with the body text. Surfaces nested inside a grid do not; put `.cm-bleed` on the grid instead.
- Grids: `.cm-grid` + `--2`, `--3`, `--4`, or `--wide` (1.5 : 1). Add `.cm-grid--cols` for 40px text-column gaps. Grids collapse at 800px and 640px automatically.
- Responsive behaviour is built in: rail becomes a top strip below 1150px, process diagrams stack below 800px, everything single-column below 640px.
- **Current section.** The rail marks the current section's link bold on the track fill. In the strip the link keeps its normal weight and takes a 2px ink underline on the track fill, so no link changes width and the strip keeps its height whichever section is current.

## 6. Elevation and emphasis budget

| Level | Class | Where | Budget |
| --- | --- | --- | --- |
| S1 | `.cm-tile` | Nested inside a surface | Unlimited |
| S2 | `.cm-card`, `.cm-figure`, `.cm-kpi`, `.cm-table-wrap`, `.cm-collapse`, `.cm-status` | Top-level surfaces | Unlimited; one `.cm-status` per document |
| S3 | `.cm-summary`, `.cm-code` | Summary box, code | 1 summary per report |
| L1e | `.cm-emph` | A bottleneck step, a must-read card, an emphasised diagram node | ≤ 1 per section |
| L2 | `.cm-featured` | Recommendations card | Exactly 1 per report; none when Recommendations is left out (§7) |

Never stack a shadow with a border except where the class does it. Never nest a card inside a card; use `.cm-tile` or `.cm-sub` (inset hairline sub-section) inside a card.

## 7. Report anatomy

Order is fixed. Required blocks are never omitted, except as **Blocks left out** below allows.

1. **Top bar** (required): `.cm-topbar` with the wordmark (publisher, lowercase-hyphenated), one series chip and the theme toggle. A print button after the toggle is optional, added only when the document is asked to carry one: `<button class="cm-btn cm-btn--secondary cm-btn--sm" type="button" data-cm-print>Print / PDF</button>`. Browser printing works without it (§12).
2. **Contents rail** (recommended; required at ≥ 4 sections) — one link per section id. Numbers `01…`, appendices `A`, `B`.
3. **Masthead** (required) — breadcrumb, `.cm-bar`, title (4–10 words, ≤ 22ch per line), dek (one sentence), then `dl.cm-mast__meta` with one `<div><dt>Label</dt><dd>Value</dd></div>` per field: Status (type chip: Analysis | Report | Brief | Guide; status chip: Draft `cm-chip`, In review `cm-chip--warn`, Final `cm-chip--ok`; optional `cm-chip--note` “Sample data” / “Preliminary”), Period `YYYY-MM-DD → YYYY-MM-DD`, Published `YYYY-MM-DD`, Reading time `N min` (the words in `<main>` ÷ 220, rounded up; scripts, chart data tables and screen-reader-only text do not count, and a word is any run of characters between spaces that holds a letter or digit), Version `X.Y`. Then `dl.cm-byline`: Prepared by, optional Reviewed by, Distribution. Labels name the value; never leave a value unlabelled.
4. **Part 01 · Executive summary** (required) — 2–4 sentence lede; KPI strip of 2–4; `.cm-summary` with 3–5 key findings.
5. **Part 02 … N** (required) — one topic per section. Inside: TL;DR or lede stating the finding → figure(s) or table → at most two callouts → optional questions block.
6. **Recommendations** (recommended) — its own section after the body and before the appendices, holding the single `.cm-featured` card; each action has owner, due date and expected impact chips.
7. **Appendix A · Methodology** (required when numbers are computed): `.cm-section--part`; collapsibles: A.1 Terms (a `.cm-def` block, open), A.2 Data sources and coverage (holding the limitation register when the document has three or more limits, §8.22), A.3 Queries.
8. **Appendix B · Notes & sources** (required): `.cm-notes`, then the source register `.cm-sources` (§8.21); then the revision history and the change log, when the document has them (§8.22).
9. **Footer** (required) — title, version + published date, owner, `Content Morphia Report Kit 1.2`.

**Blocks left out.** A document without measured numbers (a briefing, a guide, interview preparation) can lack the content of some blocks the kit otherwise requires. It leaves such a block out, invents nothing to fill it, and puts an omission comment where the block would be. The comment starts `cm-omit`, names the block, and says why after a colon:

```html
<!-- cm-omit kpi-strip: The briefing reports no measured numbers. -->
```

| Block | Left out when | Name | Where the comment sits |
| --- | --- | --- | --- |
| KPI strip | The document reports no measured numbers | `kpi-strip` | In the executive summary section, where the strip would be |
| Masthead Period field | The document covers no period | `period` | In `dl.cm-mast__meta`, where the field would be |
| Period in the title | The document covers no period | `title-period` | In `<head>`, after `<title>` |
| Recommendations section, with its `cm-featured` card | The document has no actions | `recommendations` | In `<main>`, after the body sections, where the section would be |

No other block is left out this way. A required block missing without its omission comment fails the checks.

Section ids are short, lowercase and stable (`summary`, `demand`, `methodology`, `sources`). Every `<section>` has `aria-labelledby` pointing at its h2.

## 8. Components

Markup below is canonical. Copy structure and classes exactly; change only text, data and the allowed custom properties.

### 8.1 Section

```html
<section class="cm-section" id="demand" aria-labelledby="demand-t">
  <header class="cm-section__head">
    <span class="cm-section__num">Part 02</span>            <!-- CSS adds the " /" -->
    <h2 class="cm-section__title" id="demand-t">Demand</h2>
    <p class="cm-section__tldr"><span class="cm-label">TL;DR</span> The finding, with its number.</p>  <!-- optional -->
  </header>
  <div class="cm-section__body">
    <div class="cm-prose"><p>…</p></div>
  </div>
</section>
```

Number with two digits: `Part 01`. Appendices: `class="cm-section cm-section--part"` on the first appendix, kicker `Appendix A`. A TL;DR is one or two sentences, 40 words at most, under its label on a line of its own. It stands in for the section lede (§13.1) and carries no bold phrase. Force a print page break with `cm-section--break`.

### 8.2 KPI strip

```html
<div class="cm-kpis cm-bleed">            <!-- add cm-kpis--3 or --2 for fewer than four -->
  <div class="cm-kpi">
    <span class="cm-kpi__label">Resolved within SLA</span>
    <span class="cm-kpi__value">91.2<small>%</small></span>
    <span class="cm-kpi__delta"><span class="cm-delta cm-delta--good">▲ +1.6 pp</span></span>
    <div class="cm-kpi__spark" data-spark data-values="89.8,90.1,90.6,91.4,93.4" aria-hidden="true"></div>
    <div class="cm-kpi__foot"><span>Target 95%</span><b>−3.8 pp</b></div>
  </div>
</div>
```

- Value: the number in 900 weight; unit in `<small>`. Use the report's precision consistently.
- Delta: `▲`/`▼` + signed change + comparison. `cm-delta` neutral, `cm-delta--good` favourable, `cm-delta--bad` unfavourable, judged by the reader's interest.
- Spark: optional, ≥ 6 points, same period as the KPI. `data-color="ink"` for neutral metrics.
- Progress against a target can replace the spark: `<div class="cm-meter" style="--v:91.2%;--t:95%"><span></span><i></i></div>`.

### 8.3 Summary and key findings

```html
<div class="cm-summary cm-bleed">
  <span class="cm-chip cm-chip--accent">Summary</span>
  <h3 class="cm-card__title">Key findings</h3>
  <ol class="cm-findings">
    <li><span class="cm-findings__claim">Claim in one sentence.</span> Evidence with the number and comparison.</li>
  </ol>
</div>
```

3–5 findings, ordered by importance. Each claim is a full sentence that would survive on its own. It sits on a line of its own in `.cm-findings__claim`, at 800, with the evidence on the next line. A finding has exactly one claim line, and it opens the item.

### 8.4 Callouts

```html
<aside class="cm-callout cm-callout--warning">
  <span class="cm-callout__label">Warning</span>
  <div class="cm-callout__body">One or two sentences.</div>
</aside>
```

Icon and label share a row; the body sits under the label. Closed set: `note` (context), `tip` (better method), `important` (must not miss; ≤ 1 per section), `warning` (a condition that produces a wrong result if ignored), `example` (worked instance), `requirement` (rule; may end with a `cm-id` like REQ-04), `limitation` (what the data cannot show), `correction` (previously published value was wrong: state old and new). Label text equals the variant name. ≤ 2 callouts in a row.

### 8.5 Definition

```html
<aside class="cm-def">
  <span class="cm-def__label">Definition</span>       <!-- "Definitions" for more than one term -->
  <dl>
    <div><dt>Backlog</dt><dd>Tickets in open or pending state at the snapshot time. At Sunday close, 1,186 tickets were open.</dd></div>
  </dl>
</aside>
```

Use where a term first matters, or as the A.1 glossary. Each definition says what the term counts and how; add an example, as a sentence of its own, when the definition is abstract. 15–60 words per definition.

### 8.6 Questions

```html
<div class="cm-qa">
  <span class="cm-qa__label">Questions</span>
  <dl>
    <div><dt>Why did the backlog rise in week 7?</dt><dd>Answer with the number or decision first.</dd></div>
  </dl>
</div>
```

2–5 questions a reader of the section would ask, phrased as they would ask them. Place at the end of the section they belong to. Answers 1–3 sentences.

### 8.7 Property sheet

```html
<div class="cm-props">
  <dl>
    <dt>Metric</dt><dd>Resolved within SLA</dd>
    <dt>Rule<small>(per ticket)</small></dt><dd><code>resolved_at &lt;= sla_due_at</code></dd>
  </dl>
  <dl>                                                  <!-- each dl is a group -->
    <dt>Lineage</dt><dd>Helpdesk API → <b>tickets_fact</b><sup>Source</sup> → sla_daily<sup>Derived</sup></dd>
  </dl>
</div>
```

Facts about one thing: a metric, dataset, system or document. Keys are 1–3 words. Group related keys; 2–4 groups. Role tags in `<sup>` (one word).

### 8.8 Inline emphasis

```html
<span class="cm-hl cm-hl--validated">+1.8 pp recovery</span>
```

Light wash, 1px smaller than the surrounding text, at its weight. `--attention` (thresholds, deadlines), `--validated` (confirmed gains), `--reference` (named methods, sources), `--failing` (deprecated, broken), `--caveat` (tempering context). `<span class="cm-concept">term</span>` marks a key term at first use: bold, with a dotted accent underline. Links keep a solid underline, so a key term never reads as a link. ≤ 3 highlights per paragraph; never a whole sentence.

### 8.9 Pull quote

```html
<blockquote class="cm-quote">
  <p>Verbatim words, with <strong>the decisive phrase</strong> bolded.</p>
  <footer><b>Speaker role</b>Source · Month YYYY</footer>
</blockquote>
```

Verbatim only. ≤ 1 per section. Pair with a figure in `.cm-grid.cm-grid--wide.cm-grid--cols` or stand alone (it runs to 44ch).

### 8.10 Figure (chart, image, placeholder)

```html
<figure class="cm-figure cm-bleed">
  <span class="cm-figure__kind">Figure 3</span>
  <h3 class="cm-figure__title">What the chart shows</h3>        <!-- add cm-figure__title--sm inside a 2-column grid -->
  <p class="cm-figure__desc">Measure, unit, scope and period in one sentence.</p>
  <div class="cm-chart" style="--h:320px" data-chart role="img"
       aria-label="Chart type. The finding in one sentence, with key values.">
    <script type="application/json">{ …ECharts option… }</script>
  </div>
  <figcaption class="cm-caption">
    <span class="cm-caption__line">Source: dataset · scope · refresh date.</span>
    <span class="cm-caption__line">Note: exclusions.</span>             <!-- optional -->
  </figcaption>
</figure>
```

- Figures are numbered in order of appearance across the whole report. The kind label carries the number; the caption does not repeat it.
- A figure is captioned by its title and one sentence, its description, above the chart. Under it, `.cm-caption` holds the source line, then any note line.
- Each caption line is a `.cm-caption__line` of its own, in the caption's regular weight. "Source:" and "Note:" open their lines; nothing in a caption is bold.
- Height: 280–360px full width; 260–300px in a 2-column grid; heatmaps by row count (~40px per row + 80).
- Image: replace the chart div with `<img src alt>`; alt describes the content. Missing material: `<div class="cm-slot"><b>Drop figure · 16:9</b><i>What belongs here</i></div>`.
- Optional data fallback under the caption: `<details class="cm-data"><summary>View data</summary><table class="cm-table">…</table></details>`. **SHOULD** be included for any chart whose values are not all stated in the prose.
- Side-by-side figures: wrap in `<div class="cm-grid cm-grid--2 cm-bleed cm-print-stack">` (remove `cm-bleed` from the figures).

### 8.11 Table

```html
<div>
  <div class="cm-table-title" id="tbl-1"><span class="cm-table-title__kind">Table 1</span>Team performance, Q3 2026</div>
  <div class="cm-table-wrap cm-bleed">
    <table class="cm-table" data-sortable aria-labelledby="tbl-1">
      <thead><tr><th>Team</th><th class="num" aria-sort="descending">Tickets</th><th class="num">Share</th><th data-nosort>Status</th></tr></thead>
      <tbody>
        <tr data-flag="ok">
          <td class="strong">Tier 1 · AMER</td>
          <td class="num" data-value="17940">17,940</td>
          <td class="num" data-value="37.2"><div class="cm-cellbar"><span>37.2%</span><span class="cm-cellbar__track"><span style="--v:100%"></span></span></div></td>
          <td>On track</td>
        </tr>
      </tbody>
      <tfoot><tr><td>All teams</td><td class="num">48,210</td><td class="num">100%</td><td></td></tr></tfoot>
    </table>
  </div>
  <span class="cm-caption">
    <span class="cm-caption__line">Source: … · scope · date.</span>
    <span class="cm-caption__line">Flags: what each color means.</span>
  </span>
</div>
```

- Real `<table>` with `<thead>`; `<tfoot>` for a totals or calculated row (the kit adds space and a dotted rule above it).
- The title sits above the table; the caption under it holds the source line, then any flags or note line, as for a figure (§8.10).
- Columns are separated by 16px gutters automatically; never add borders.
- Numeric columns: `.num` on `th` and `td`; consistent decimals; thousands separators; `−` (U+2212) for negatives; `—` for not applicable.
- `.strong` for the row key and the column the reader should compare; `.soft` for n/a values; `.wrap` for prose cells.
- **Row flags:** `data-flag="ok|warn|crit|info|note|accent"` on a `<tr>` draws a 4px status bar in the left gutter. Use it instead of colored chips in status columns; keep the status word in the row and explain the colors in a caption line that opens "Flags:".
- `data-sortable` when the table has ≥ 5 rows. `data-value` holds the raw number whenever the cell text is formatted. Mark the initial sort with `aria-sort`. Status columns get `data-nosort`.
- Recommended column in a comparison: `class="is-rec"` on its `th` and `td`s, and ★ in the header text. The header gets a 4px rule; each body cell gets bold text and a teal bar in the left gutter, centred on its row, so one highlighted cell reads the same as a whole column. Never highlight the header cell.
- No zebra striping, no outer border, no colored header.

### 8.12 Timeline

```html
<ol class="cm-timeline">
  <li class="is-done">
    <span class="cm-timeline__date">Jul 08<small>2026</small></span><span class="cm-timeline__mark"></span>
    <div>
      <div class="cm-timeline__title">What happened</div>
      <p class="cm-timeline__body">One or two sentences.</p>
      <div class="cm-chips"><span class="cm-chip cm-chip--ok">Shipped</span></div>
    </div>
  </li>
</ol>
```

States: `is-done` (hollow ink marker), `is-current` (filled accent, ≤ 1), `is-planned` (dashed marker and rail). Oldest first. Date as `Mon DD` with the year in `<small>`. Usually inside a `.cm-card.cm-bleed` with a T3 title; ≤ 1 chip per item.

### 8.13 Process diagram

```html
<ol class="cm-process" style="--steps:5">
  <li class="cm-step"><span class="cm-step__n">01</span><span class="cm-step__title">Triage</span><span class="cm-step__body">One line.</span></li>
  <li class="cm-step cm-emph">…<span class="cm-chip cm-chip--warn">Bottleneck</span></li>
</ol>
```

3–6 steps; `--steps` equals the count; titles ≤ 3 words; ≤ 1 `cm-emph` step with a chip naming why. A process with a branch, a loop or a hand-off between roles is a flow diagram (§8.20).

### 8.14 Lists

`ul.cm-list` (grey dots) and `ol.cm-olist` (01, 02). Add `.cm-small` inside surfaces. Items may contain inline code, links and bold, but no item opens with a bold label or phrase run into its text (§13.2). A term with its explanation goes in a definition block (§8.5), a property sheet (§8.7) or a table (§8.11).

### 8.15 Footnotes and sources

In text, after punctuation: `<a class="cm-fn" href="#fn-1" id="fnref-1">1</a>` (brackets are added by CSS). In Appendix B, the notes come first, then the source register (§8.21):

```html
<ol class="cm-notes">
  <li id="fn-1">Note text. <a class="cm-back" href="#fnref-1" aria-label="Back to text">↩</a></li>
</ol>
```

A note explains a point in the text. A source is cited with `a.cm-cite` and listed in `ol.cm-sources`, as §8.21 sets out.

### 8.16 Collapsible

```html
<div class="cm-bleed">
  <details class="cm-collapse" open>
    <summary><div><span class="cm-label">A.1</span><h3>Terms used in this report</h3></div></summary>
    <div class="cm-collapse__body">…</div>
  </details>
</div>
```

Appendices only. First item `open`. Never hide findings or anything the summary depends on. The body spaces its own blocks, so several blocks go straight into it.

### 8.17 Code

```html
<div class="cm-code cm-bleed">
  <div class="cm-code__bar"><span class="cm-code__file">query.sql</span><span class="cm-tag">SQL</span></div>
<pre><code><span class="k">select</span> <span class="f">count</span>(*) <span class="k">from</span> t <span class="k">where</span> d = <span class="s">'2026-09-30'</span></code></pre>
</div>
```

Token spans: `k` keyword, `s` string, `n` number, `f` callable, `c` comment. Keywords, strings and numbers take the syntax colours the CSS sets; it is the only coloured text in the kit. Escape `<` as `&lt;`. Inline identifiers, file names and token names use `<code>`.

### 8.18 Chips, tags, buttons

- `cm-chip` (outlined pill): status and metadata. Variants `--ok --warn --crit --info --note` add a 2px color offset to the right and bottom; `--accent` (teal outline: Summary, Recommended, expected impact); `--dashed` (optional or recommended level); `--verdict` (solid ink with a crit offset; `.is-ok`, `.is-warn` for other offsets).
- `cm-tag` (4px): types, languages, source kinds. `cm-tag--dashed` only for specimens in documentation.
- `cm-btn`, `--secondary`, `--quiet`, `--sm`: top bar and interactive reports only. Labels are caps verbs.
- ≤ 3 chips in a masthead status; ≤ 3 chips per findings item; ≤ 1 per timeline item.

### 8.19 Recommendations card

```html
<div class="cm-card cm-featured cm-bleed">
  <div class="cm-card__kicker"><span class="cm-chip cm-chip--accent">Recommended</span></div>
  <h3 class="cm-card__title">Three actions for Q4</h3>
  <ol class="cm-findings">
    <li><span class="cm-findings__claim">Imperative action in one sentence.</span> One sentence of reason.<div class="cm-chips"><span class="cm-chip">Owner · Team</span><span class="cm-chip">Due YYYY-MM-DD</span><span class="cm-chip cm-chip--accent">Expected impact</span></div></li>
  </ol>
</div>
```

The only `cm-featured` in the report, inside the Recommendations section. 1–5 actions. Each action opens with one claim line, the action as an imperative sentence, then one sentence of reason and its chips. The card width follows the reading measure.

### 8.20 Diagram

A flow diagram shows a process with branches, loops or hand-offs between roles. Three to six steps in one line, with no branch, stay a process diagram (§8.13). The author writes the diagram as data, as a chart is written; the kit draws it.

```html
<figure class="cm-figure cm-bleed">
  <span class="cm-figure__kind">Figure 5</span>
  <h3 class="cm-figure__title">Ticket routing by channel</h3>
  <p class="cm-figure__desc">The path a chat, email or web-form ticket takes from arrival to an agent.</p>
  <div class="cm-diagram" data-diagram="flow" role="img" aria-label="">   <!-- empty: the kit writes the summary -->
    <script type="application/json">
    {
      "nodes": [
        {"id": "arrive", "type": "terminal", "label": "Ticket arrives", "col": 1, "row": 1},
        {"id": "channel", "type": "decision", "label": "Which channel?", "col": 2, "row": 1},
        {"id": "classify", "type": "step", "label": "Intent classifier", "detail": "Billing, technical or account queue", "col": 3, "row": 1},
        {"id": "shared", "type": "step", "label": "Shared queue", "detail": "One queue for every topic", "col": 3, "row": 2},
        {"id": "agent", "type": "terminal", "label": "Agent picks it up", "col": 4, "row": 1}
      ],
      "edges": [
        {"from": "arrive", "to": "channel"},
        {"from": "channel", "to": "classify", "label": "Chat"},
        {"from": "channel", "to": "shared", "label": "Email, web form"},
        {"from": "classify", "to": "agent"},
        {"from": "shared", "to": "agent"}
      ]
    }
    </script>
  </div>
  <figcaption class="cm-caption"><span class="cm-caption__line">Source: dataset · scope · date.</span></figcaption>
</figure>
```

The JSON holds four fields and nothing else: no coordinates, sizes, classes or styles. Placement is the author's; geometry is the kit's.

| Field | Holds | Values |
| --- | --- | --- |
| `nodes` | One entry for each node | `id` (unique), `type`, `label`, optional `detail`, `col` and `row` (whole numbers from 1, one node a cell), optional `emphasis` |
| `edges` | One entry for each connection | `from` and `to` (node ids), optional `kind`, optional `label` |
| `groups` | Optional lanes and boundaries | Lane: `"type": "lane"`, `label`, `row`, optional `rows`. Boundary: `"type": "boundary"`, `label`, `col`, `row`, optional `cols` and `rows` |
| `direction` | Optional reading direction | `right` (default) or `down` |

Shape marks the node type and line style the edge kind. A key above the drawing names each type and kind in use when the diagram has a data store, an external entity, a data edge or an optional edge.

| Value | Drawn as | Use |
| --- | --- | --- |
| `terminal` | Pill | Where the flow starts and ends |
| `step` | Rectangle; `detail` adds a second line | An action |
| `decision` | Rotated square holding the question; no `detail` | A choice |
| `store` | Ruled above and below | Where data rests |
| `external` | Heavy border | A person or system outside the process |
| `flow` | Solid line, the default | Control passes on |
| `data` | Dotted line | Data or a message moves |
| `optional` | Dashed line | An optional or planned path |

- The flow reads left to right, or top to bottom with `"direction": "down"`. A diagram with lanes flows right.
- Every branch out of a decision carries a label: "Yes" and "No", or the condition. No two branches of one decision share a label.
- A lane is a row band named on the left, one role or system each. With lanes, every row sits in exactly one lane, so each hand-off crosses a lane line.
- A boundary is a rounded frame around a block of cells, named on its top line.
- One node at most is emphasised: a step, with a chip of one or two words naming why. It counts toward the section's one `cm-emph` (§6).

Capacity. A flow past any ceiling splits into an overview and details: one diagram of the stages, then one for each stage that needs it.

| Item | At most | Reason |
| --- | --- | --- |
| Nodes | 24 | The library's panel tier holds 8 to 24 nodes |
| Columns | 5, or 4 with lanes | Six steps in a row do not fit the printed column at 80%; with lanes, five do not, since the lane names take a column's width |
| Rows | 5 | Six rows of steps with a detail line do not fit a printed page at 80% |
| Lanes | 5 | The library's journey map, its widest lane diagram, has 5 lanes |
| Boundaries | 2 | The library's panel tier allows 2 groups |
| Edge labels | 12 | The library labels edges only while a view has 12 or fewer |
| Line crossings | 3 | The library's crossing budget for one view |
| Emphasised nodes | 1 | §6 |

Print is the final test. A diagram near several ceilings at once can still be too large to print at 80%; the check then fails it, and it splits or its text shortens.

Diagram text is not prose (§13). It keeps its own limits:

| Text | Limit |
| --- | --- |
| Node `label` | 24 characters, the length at which the library cut node names |
| Node `detail` | 40 characters, two lines in print |
| Edge `label` | 1 to 3 words, as a chart annotation (§9) |
| `emphasis` | 1 or 2 words |
| Lane or boundary `label` | 24 characters |

The kit applies the rest:

- Nodes in one column share a width and nodes in one row share a height. A decision's square grows to hold its question.
- Edges run at right angles through the gaps between columns and rows, with rounded elbows and an arrowhead, in 2px ink. Edges that leave or enter one side share a line. Decision outlines and boundaries are 1.5px.
- Edge labels sit beside their line in the label style, on the page colour, 8px clear of every line, node and other label.
- The drawing recomputes on resize, on a theme change and before print.
- A text version follows the caption: a `details.cm-data` disclosure, "View as text", with one numbered item for each node in reading order. Each item gives the node's name and detail, then where the flow goes next: each branch with its label and step number, and a loop as "Back to step N". Lanes and the emphasised node are named.
- An empty `aria-label` takes a summary from the data: the number of steps, the first and last, and the count of lanes, decisions and loops. An author's `aria-label` stays; it states what the diagram shows in one sentence.
- On a narrow screen the diagram keeps its geometry and scrolls sideways inside its own box. Labels never shrink.
- Print narrows the gaps and the nodes, then scales the drawing to fit the printed column and a page, never below 80%. The text version prints open.

### 8.21 Sources and citations

The source register lists every source a document rests on, and closes Appendix B after the notes. A citation ties a claim to its sources; an evidence date says how current a claim is.

```html
<p>Median first response fell to 2h 14m.<a class="cm-cite" href="#src-1" id="cite-1">S1</a></p>

<ol class="cm-sources">
  <li id="src-1">
    <span class="cm-id">S1</span>
    <span><b>Helpdesk warehouse, ticket facts</b><br><span class="cm-tag">Dataset</span> Support Operations Analytics · <code>support.tickets_fact</code> <a class="cm-back" href="#cite-1" aria-label="Back to text">↩</a></span>
    <span class="cm-meta">refreshed <time datetime="2026-10-05">2026-10-05</time></span>
  </li>
</ol>
```

- Each entry carries a key, a title, its author or publisher, a type, a locator and a date.
- The key is `S` and a number, in `.cm-id`. The entry's id is `src-` and the same number: `S4` is `src-4`. A source keeps its key in every version, and a new source takes the next unused number. Entries run in key order.
- The type is a tag from a closed set: `Dataset`, `Report`, `Interview`, `Document`, `System export`.
- The locator says where to find the source: its URL as a link, or the system and path in `<code>`. Printing adds each URL after its link.
- The date is the one the source carries, as an ISO date in `<time datetime>`. A word before it says what it dates: published, refreshed, exported, recorded or accessed.
- A citation is `a.cm-cite` after punctuation, like a footnote reference. Its text is the source's key; its id is unique, `cite-1`, `cite-2` in order of appearance. A claim with several sources carries one citation for each, side by side.
- A cited entry ends with one back link, `a.cm-back`, to its first citation. Following any citation lands on the entry, and the kit's script points the back link at that citation. An entry no claim cites is listed with no back link.
- A source count never stands in for confidence. The kit has no confidence chip or score; what several sources agree on is stated as a claim, with its citations.

An evidence date says how current a figure, table or claim is: "as of" and a `<time datetime>`. In prose the date is readable (`as of <time datetime="2026-09-30">30 September</time>`); in a caption it is ISO. Every `<time>` carries an ISO `datetime`.

When two sources give different values for one quantity, a disagreement block states both, each with its citation, and the reason they differ.

```html
<div class="cm-disagree">
  <span class="cm-label">Disagreement</span>
  <p class="cm-t5">Tickets handled in Q2 2026</p>
  <dl>
    <div><dt>44,870</dt><dd>Helpdesk warehouse, re-run 2026-10-05<a class="cm-cite" href="#src-1" id="cite-4">S1</a></dd></div>
    <div><dt>45,310</dt><dd>Q2 review, published 2026-07-13<a class="cm-cite" href="#src-4" id="cite-5">S4</a></dd></div>
  </dl>
  <p>The re-run drops 440 merged duplicates that the Q2 review counted. This report uses the re-run.</p>
</div>
```

- The label reads Disagreement. The line under it names the quantity, with its period.
- Two values, or three when three sources differ, each as its source gives it, with the source named and cited.
- The closing paragraph gives the reason the values differ and says which value the document uses.
- It sits after the figure, table or paragraph that uses the quantity.

### 8.22 Status and change

Four blocks say what a document knows about itself. The status block holds the numbers that will change; the change log and the revision history record what changed; the limitation register lists what the document cannot show.

The status block:

```html
<div class="cm-status cm-bleed">
  <div class="cm-status__head"><span class="cm-label">Status</span><span class="cm-meta">as of <time datetime="2026-10-30">2026-10-30</time></span></div>
  <dl>
    <div><dt>Shifts staffed</dt><dd>14 of 16</dd></div>
    <div><dt>Monday first response</dt><dd>2h 35m</dd></div>
  </dl>
</div>
```

- It is the one place for the numbers in a document that will change (§13.2). A document has one at most, after the lede of the section whose work it tracks.
- Its head carries the date its numbers were true, as an ISO date in `<time datetime>`.
- Steps, rules and definitions elsewhere name a quantity and leave its value to the block.
- Keys are 1 to 3 words. Values carry their unit, and a count against a total reads `14 of 16`.

The change log:

```html
<ol class="cm-changes">
  <li><span class="cm-tag">Correction</span><span>APAC weekday first response corrected from 2h 41m to 2h 31m. <a href="#teams">Part 04</a></span><span class="cm-meta"><time datetime="2026-10-20">2026-10-20</time></span></li>
</ol>
```

- One entry for each change in meaning. Rewording, reordering and restyling are not changes.
- The kind is a tag from a closed set: `Added`, `Revised`, `Removed`, `Correction`. A correction also stands where the error was, as a correction callout (§8.4).
- Each entry says what changed in one sentence and links the section, figure or table it changed.
- Newest first, since a returning reader looks for the latest change. A timeline runs oldest first because it tells a sequence (§8.12).

The revision history:

```html
<ol class="cm-versions">
  <li><span class="cm-id">v1.1</span><span>APAC weekday first response corrected; limitation register added.<br><span class="cm-meta">Support Operations Analytics</span></span><span class="cm-meta"><time datetime="2026-10-20">2026-10-20</time></span></li>
</ol>
```

- One entry for each published version: the version, a summary of what changed, the owner who published it, and the date.
- Newest first. The newest entry carries the masthead's Version and Published date.
- A document carries a revision history from its second version. The revision history, then the change log, close Appendix B after the sources.

The limitation register:

```html
<ul class="cm-limits">
  <li><span><b>Unstaffed APAC weekends</b><br>APAC first response counts weekend hours, so its median reads 3h 20m against 2h 31m on weekdays.</span><span class="cm-chips"><span class="cm-chip cm-chip--warn">Open</span></span></li>
</ul>
```

- Each limit has a name of a few words, its effect on what the document shows in one sentence, and a status.
- The status is a chip from a closed set: `Open` (`cm-chip--warn`), `By design` (`cm-chip--note`), `Resolved` (`cm-chip--ok`). The word carries the meaning; colour is only the chip's offset. An open limit with a planned fix adds a plain chip with its date: `Fix due 2026-12-14`.
- One or two limits are limitation callouts, where a reader would look for the missing answer (§8.4). Three or more go in the register instead, in Appendix A under A.2.

## 9. Charts

**Method:** ECharts 5.5.1, SVG renderer, option JSON inside `<script type="application/json">` within `.cm-chart[data-chart]`. Agents **MUST NOT** call `echarts.init` or write chart JavaScript. The JSON **MUST** be valid JSON (double quotes, no comments, no functions, no trailing commas).

**Applied automatically — do not set these:** fonts, text colors, axis lines, gridlines, tick removal, legend look and placement, axis-title placement, plot top/bottom padding (worked out from the legend, axis titles, reference-line labels and a heatmap's scale bar), tooltip look, series palette, bar width (≤ 16px) and rounding, stacked-segment gaps, line width 2.5, hidden symbols, area opacity 0.18, markLine/markArea styling, label styling, heatmap ramp, animation timing, renderer.

**Anatomy (MUST, in this order):**

| Part | Where | Rule |
| --- | --- | --- |
| Kind and number | `.cm-figure__kind` | “Figure N”, sequential across the report |
| Title | `.cm-figure__title` | What is shown, ≤ 10 words |
| Description | `.cm-figure__desc` | Measure, unit, scope and period |
| Legend | automatic | Shown for 2+ series, top left, series order. `"legend": false` only to suppress it on a single series. End labels or value labels may be added; they never replace the legend |
| Axis titles | `xAxis.name`, `yAxis.name` | Quantity and unit (“Tickets per week”). Required on the value axis unless every tick shows the unit (“90%”). Scatter names both axes. The kit places a y-axis title above the plot and an x-axis title under it, on a value or a category axis, and makes room for each |
| Data labels | `label`, `endLabel` | Values the reader should quote; every bar when there are ≤ 12 |
| Annotations | `markLine`, `markArea` | Target, event or period, labelled in 1–3 words |
| Source and notes | `.cm-caption` | A source line always; a note line for exclusions. Each is a `.cm-caption__line`, not bold |
| Text alternative | `aria-label`, `.cm-data` | Chart type + finding with key values |

**Token strings:** a string that is `$` followed by a token name from section 3 is replaced with the current theme's token (`"$accent"`, `"$ink"`, `"$context"`, `"$surface"`, `"$c3"`, `"$crit"`…; `"$seq"` gives the ramp array). This is the only way to set a color. Only token names resolve: any other text starting with `$`, such as a `"$50"` label, stays as written.

**Color by role:**
- One series: default (`$c1`).
- Current vs. prior: current default, prior `"lineStyle"/"itemStyle": {"color": "$context"}`.
- Categories: `$c1`, `$c2`, `$c3`, `$c4` in order of importance. **MUST NOT** exceed four colored series; use small multiples or a table, or grey the rest with `$context`.
- A `$context` mark the reader needs to read carries a direct value label (`label`, or `endLabel` on a line): the grey sits below 3:1 against the figure surface, so the label carries the value.
- Focus on one mark: in a bar, line or area series, the picked-out mark keeps the default colour and the rest of the series takes `$context`.
- Scatter points and other point marks keep their series colour, and the picked-out point takes `$c1` and a label. Grey points would sit below 3:1, each needing a value label.
- Semantic solids (`$ok`, `$warn`, `$crit`) only when the series *is* a status, with words in the legend.

**Chart choice:**

| Question | Chart | Notes |
| --- | --- | --- |
| Change over time | `line` | Category x-axis with `"boundaryGap": false`; y may start above zero |
| Level over time, one series | `line` + `"areaStyle": {}` | y starts at zero |
| Compare categories | `bar` | Horizontal (`yAxis.type: "category"`) when labels are long or ranked; sort largest at top (data listed smallest first) |
| Composition over time | stacked `bar` | ≤ 4 parts, `"stack": "name"`; do not set radius or width |
| Relationship | `scatter` | Name both axes with units |
| Two categories × magnitude | `heatmap` | `visualMap` with min/max and `text` end labels; `"yAxis": {"inverse": true}` |
| Part of a whole | `pie` with `"radius": ["44%","66%"]` | ≤ 4 slices, labels with name and value, only when the total matters |

**MUST NOT:** 3D, gradient fills, dual y-axes, radar, gauge, word clouds, more than one chart per figure, bars or areas that do not start at zero, a `barWidth` above 16.

**Annotations:**
- Target or threshold: `"markLine": {"data": [{"yAxis": 95, "label": {"formatter": "Target 95%", "position": "insideStartTop"}}]}` (use `xAxis` for vertical lines and horizontal bars, `position: "end"`).
- Event: vertical markLine on the category (`{"xAxis": "Wk 7"}`) with a 1–3 word label.
- Period band: `"markArea": {"data": [[{"xAxis": "Wk 6"}, {"xAxis": "Wk 8"}]]}`.
- Direct labels: `"endLabel": {"show": true, "formatter": "Q3"}` on lines (add `"grid": {"right": 64}`); `"label": {"show": true, "position": "right", "formatter": "{c}%"}` on bars. The kit sets every value label, on a series or on a single point, in ink on the surface colour, and draws a series above its reference lines, so a line never runs through a number.

**Formatting:** axis label formatters as template strings only (`"{value}%"`). Category labels short (`Wk 1`, `Jul`, `Mon`). Thin crowded axes with `"axisLabel": {"interval": 2}`.

**Accessibility:** every `.cm-chart` **MUST** have `role="img"` and an `aria-label` stating the chart type and the finding with key values. The prose above the figure states the same finding.

## 10. Motion

Only charts move; diagrams draw static. Each chart draws in once when 15% of it enters the viewport (900ms, ease-out, 120ms stagger between series). Theme switches redraw without animation. `prefers-reduced-motion`, print, background tabs and headless rendering draw static. Agents **MUST NOT** add other animation.

## 11. Dark mode

Automatic from tokens; agents write nothing extra. The pre-paint script in `<head>` applies the reader's stored choice or system setting before first paint; `[data-cm-theme-toggle]` switches and persists (`localStorage["cm-theme"]`). To force a theme for a specific artifact, set `<html data-theme="light">` and remove the pre-paint script.

## 12. Print and PDF

- Browser print (the browser's own command, or the optional print button): always light; chrome hidden; 16 × 14mm margins; shadows become 1px borders; the L2 card keeps its offset; appendices open; charts redraw static at print width; figures, KPIs, callouts, definitions and table rows never split.
- Mark side-by-side figure grids `cm-print-stack` so they print full width.
- Diagrams redraw with narrower gaps and nodes, scaled to fit the printed column and a page, never below 80%; their text versions print open (§8.20).
- Use `cm-section--break` to start a section on a new page (typically the first appendix in long reports).
- **Headless pipelines** (Puppeteer, Playwright, wkhtmltopdf): set `<html data-cm-static>` or call `CM.drawAll()` after load, then `CM.beforePrint()` before generating the PDF. Wait for `document.fonts.ready`.

## 13. Writing rules

Prose is the running text of `<main>`: paragraphs, list items, definitions, questions and answers, callout bodies, captions and process-step bodies. Code, tables, chart and diagram data and screen-reader-only text are not prose. Words are counted as in §7; inline code counts as one word, and a template placeholder (`{{ … }}`) as none.

### 13.1 Limits

Each limit **MUST** hold. The 25-word sentence is a target (**SHOULD**).

| Item | Limit |
| --- | --- |
| Paragraph | 3 sentences and 60 words at most |
| Sentence | 25 words as the target and 30 at most; 18 words or fewer on average across the document |
| List item | 2 sentences and 40 words at most |
| Prose between headings | 150 words at most |
| Section lede | 45 words at most, with its key phrase in bold |
| Caption (`.cm-caption`) | 30 words at most |

A section's lede is the paragraph that opens its body. In a section with a TL;DR, the TL;DR stands in for the lede. It keeps its own limit of 40 words (§8.1) and carries no bold phrase; its label marks it. A definition, a question and an answer are each measured as a paragraph.

Components set limits of their own. Where a component limit and a limit above both apply, both hold.

| Element | Limit | Section |
| --- | --- | --- |
| Report title | 4 to 10 words, 22 characters a line at most | §7 |
| Dek | One sentence | §7 |
| Executive summary lede | 2 to 4 sentences | §7 |
| TL;DR | One or two sentences, 40 words at most | §8.1 |
| Key finding | A claim line of one full sentence, then its evidence | §8.3 |
| Definition | 15 to 60 words | §8.5 |
| Answer | 1 to 3 sentences | §8.6 |
| Property key | 1 to 3 words | §8.7 |
| Process step title | 3 words at most | §8.13 |
| Figure title | 10 words at most | §9 |
| Chart annotation | 1 to 3 words | §9 |
| Diagram node label | 24 characters at most | §8.20 |
| Diagram edge label | 1 to 3 words | §8.20 |

### 13.2 Register

- Plain, factual sentences. State the number, the comparison and the period: “rose 2.3 points to 87.4% against Q2”, not “improved significantly”.
- Plain words: “use”, not “utilize”; “so”, not “in order to”. No emoji.
- Lead every section with the finding, then the evidence.
- Neutral third person, written for any reader. No “you”, “your”, “we” or “our” in the body; a document is never a message to the person who asked for it. A pull quote is verbatim (§8.9) and keeps its speaker's words.
- No chat-style labels such as “Done so far”, “Your part” or “Next up”. A person's action appears as a role-named item (“Owner approval of the shortlist”) with what it does and what it unblocks.
- A document describes its subject as it stands. It carries no history of how it was made and no notes about the work.
- Numbers that will change never sit inside definitions of steps or rules. They go in one dated status block (§8.22).
- No signposting, such as “this section describes”, “note that” or “as shown below”.
- No hype, no rhetorical questions, no “this isn't X, it's Y”.
- No em dashes or en dashes in prose.
- Bold marks the phrase that carries a sentence's meaning: one or two per paragraph, never a whole sentence. The claim of a key finding or a recommended action is a line of its own, not bold running text (§8.3, §8.19).
- No bold label runs into the text that follows it, anywhere. A label that must stay takes its own line (a card or callout title line), a heading, a table row or a definition-list term.
- A bold phrase never opens a paragraph, list item or callout body with more text on the same line; it would read as a label.
- A caption's source and note lines are lines of their own, in the caption's regular weight (§8.10).
- Dates ISO in metadata (`2026-10-12`), readable in prose (`12 August`). Durations as `2h 14m`. Percentage-point changes as `pp`.

### 13.3 Headings

Headings are `h1` to `h6` and table titles.

- A heading is the plainest noun phrase that names what sits under it. No articles or framing words, no questions, no verbs unless the section is a procedure, and no adjectives that argue, such as proposed, honest, current, revised or improved.
- Sentence case for all headings and labels; CSS uppercases labels.
- Figure titles describe what is shown; the finding lives in the prose, the TL;DR and `aria-label`.
- Headings never skip a level (§4).

## 14. Pre-publish checklist

1. Started from `template.html`; no class, color, font or inline style outside §1 rule 2.
2. Top bar with the wordmark, one series chip and the theme toggle; a print button only when the document is asked to carry one. Masthead complete with labelled metadata; title ≤ 10 words. A period left out of the masthead or the title carries its omission comment (§7).
3. Summary: lede, 2–4 KPIs with stated comparisons (or the KPI strip's omission comment, §7), 3–5 findings.
4. Every summary number reappears in the body with its source.
5. Every figure: kind, title, description, legend for 2+ series, value-axis title with unit, `role="img"`, `aria-label`, caption with a source line. Figure numbers sequential.
6. Every table: kind and title, `.num` on numeric columns, `data-value` on formatted cells, source caption; row flags explained.
7. Budgets: 1 `cm-featured` (none with the Recommendations omission comment, §7), 1 `cm-summary`, ≤ 1 verdict chip per table, ≤ 1 `cm-emph` per section, ≤ 4 colored chart series.
8. Mono only inside code; no colored fills behind labels or chips.
9. No bold label or opening bold phrase runs into its text. Nothing closer than 24px to the next block.
10. Chart JSON parses; colors only via `$tokens`; bars/areas start at zero.
11. Footnotes and citations link both ways; every source has a key, type, locator and date, and the sources list every dataset (§8.21).
12. Contents rail links match section ids; every section has `aria-labelledby`.
13. Opened in light, dark and print preview with no console errors.
14. Writing within §13: prose inside the limits, in plain words and neutral third person, with no em or en dashes; each section leads with its finding; headings are plain noun phrases in sentence case.
15. Changing numbers sit in one dated status block; change log and revision history run newest first with dated entries; each limitation status is a word from its set (§8.22).
16. Every diagram: JSON within the flow fields and capacity, a label on every decision branch, `role="img"`, a caption with a source line, and nothing overlapping or clipped in light, dark and print (§8.20).

## 15. Changes from Content Morphia Foundations

Kept unchanged: the three rules, color law, five semantics, radii, soft and hard elevation families, callout set, highlight set, link and focus treatment.

Changed in 1.1: labels, tables, chips and charts moved from JetBrains Mono to Nunito (mono is code only); section headers use a “Part 01 /” kicker, optional TL;DR and a 4px closing rule, and H3/H4 carry fit-to-text rules; chips are outlined with color offsets; callouts stack the body under an underlined label; tables have column gutters, dotted totals rules and row flags; the timeline runs on one continuous rail; chart colors c3 and c4 are deeper; charts get automatic legends and axis titles; spacing scale enlarged with a 24px floor.

Changed in 1.2:

- Section 13 holds the writing rules: limits, register and headings. The checks enforce them.
- Headings are in sentence case, and a check warns on a title-case heading (§13.3).
- A TL;DR sits under its own label line and stands in for the section lede: 40 words, no bold phrase (§8.1, §13.1).
- The claim of a key finding or a recommended action is a line of its own at 800, above its evidence (§8.3, §8.19).
- No bold label runs into its text, and no bold phrase opens a paragraph, list item or callout body (§13.2).
- A caption's source, note and flags lines are lines of their own, not bold (§8.10, §8.11).
- Focus on one mark greys the rest of a bar, line or area series; point marks keep their series colour (§9).
- A `$context` mark the reader needs to read carries a direct value label (§9).
- A category axis title gets the same room as a value axis title (§9).
- The chart script works out plot padding; none is set by hand (§9).
- Only token names resolve as colours in chart JSON; other text starting with `$` stays text (§9).
- A link target stops 24px below the top bar, whatever the bar's height (§5).
- In the contents strip, the current link keeps its weight and takes an underline, so no link changes width (§5).
- A paragraph carries three highlights at most, and a check enforces it (§8.8).
- A key term takes a dotted accent underline, which links never use (§8.8).
- A disclosure body spaces its own blocks (§8.16).
- The print button is optional, added only when the document asks for one (§7).
- A document without measured numbers leaves out a required block it has nothing for, with an omission comment (§7).

Added for reports: ECharts chart method and theme; categorical and sequential palettes; dark token set; print rules; report masthead and contents rail; KPI strip; key findings; native tables with sorting and in-cell bars; pull quote; timeline; process diagram; definition, questions and property-sheet blocks; footnotes; collapsible appendix; chart draw-in motion; packaging modes.

Not yet covered: maps, diagram modes other than flow (sequence, state, layer stack, hierarchy, entity relationship), network diagrams, interactive filters, a PDF cover page. Use a figure with `cm-slot` and flag the gap in an HTML comment until these exist.
