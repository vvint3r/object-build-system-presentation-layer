# Content Morphia · Report Kit 1.2 — Agent Specification

This file tells an agent how to produce a report, document or analysis as a single HTML artifact in the Content Morphia style. Follow it exactly. When this file and your own taste disagree, this file wins.

Keywords: **MUST** / **MUST NOT** are hard rules; a report that breaks one is not publishable. **SHOULD** is the default; deviate only with a stated reason in an HTML comment.

Kit files (all in `report-kit/`):

| File | Role |
| --- | --- |
| `cm-report.css` | Tokens (light, dark, print) and every component class. The only stylesheet. |
| `cm-report.js` | Theme toggle, ECharts theme + draw-in, charts built from kit declarations, diagram drawing and text versions, sortable tables, contents scroll-spy, link targets clear of the top bar, citation back links, print prep. |
| `template.html` | Report starter. Copy it for every report. |
| `template-guide.html` | Guide starter. Copy it for every guide. |
| `template-reference.html` | Reference starter. Copy it for every reference. |
| `template-topic.html` | Topic starter: a reference with the topic's parts (§7.7). |
| `template-glossary.html` | Glossary starter: a reference with Terms in the place of Properties (§7.8). |
| `template-module.html` | Module starter: a guide with the module's parts (§7.9). |
| `template-framework.html` | Framework starter: a reference with the framework page's parts (§7.10). |
| `template-process.html` | Process starter: a reference with the process page's parts (§7.11). |
| `template-metric.html` | Metric starter: a reference with the metric page's parts (§7.12). |
| `template-comparison.html` | Comparison starter: a reference with the comparison page's parts (§7.13). |
| `template-roadmap.html` | Roadmap starter: a report with the roadmap’s parts (§7.14). |
| `template-case-study.html` | Case study starter: a report with the case study’s parts (§7.15). |
| `SPEC.md` | This file. |

Human-readable version with live examples and copy-paste markup: `Report Kit - Spec & Gallery.html`. Reference output, one document per kind (§7): `Sample Report - Q3 Support Review.html`, `Guide - Billing Escalation.html` and `Reference - First Response Time.html`. The three form a document set, and `index.html` lists them (§8.31). Each page type has one worked example in the set, such as `Reference - Support Glossary.html` for the glossary (§7.6).

---

## 1. Non-negotiable rules

1. **MUST** start from the template for the document's kind (§7): `template.html` for a report, `template-guide.html` for a guide, `template-reference.html` for a reference. Compose only from classes in `cm-report.css`.
2. **MUST NOT** add stylesheets, `<style>` blocks, classes of your own, or inline `style` attributes. Allowed inline custom properties only: `--h` (chart height), `--v` (bar/meter fill), `--t` (meter target), `--steps` (process step count), plus `style="align-items:center"` or `style="align-items:start"` on a grid.
3. **MUST NOT** write hex, rgb or named colors anywhere in markup. In chart JSON use token strings (`"$accent"`, see §9).
4. **Text is black or white.** **MUST NOT** use grey text or lowered opacity for de-emphasis. Rank text with weight: 300 (de-emphasised, kickers), 400 (body), 600 (code, chart axis labels), 700 (bold phrase, row keys, role tags), 800 (labels, block titles, terms), 900 (page/section title). These are the weights the kit loads; use no other. Two exceptions to black or white, both applied by the CSS: keywords, strings and numbers in code take the syntax colours (§8.17), and the verdict chip's text takes the paper colour on its ink fill.
5. **One family for text, one for code.** Nunito for all text, labels, tables, chips and charts. JetBrains Mono **only** for code: `<code>`, `.cm-code`, file names. **MUST NOT** use mono for labels, numbers, dates or IDs.
6. **Accent is never text.** Teal appears only as bars, underlines, borders, chips, chart marks and the reserved shadow.
7. **One emphasis per view.** Exactly one `cm-featured` (L2, teal offset) per report, on the recommendations; none when a report with no actions leaves the Recommendations section out (§7.5). At most one solid verdict chip (`cm-chip--verdict`) per table or figure. One `cm-summary` per report. A guide or a reference carries no `cm-featured` and no `cm-summary`.
8. **Color never fills a label.** Status color appears as a chip's 2px offset, a callout label's underline, a table row flag, or a chart mark. **MUST NOT** put a colored background behind a chip, tag or label.
9. **Meaning never rests on color alone.** Every status chip and flagged row carries a word; every highlight is backed by the sentence; every recommended column carries ★.
10. **No corners outside the radius set:** 2 thin bar, 4 chip/tag, 6 code chip, 8 input/slot, 12 table/tile, 14 card, 999 pill. Every drawn shape is rounded; square corners belong only to lines (rules, dotted connectors, the timeline rail), masked icons and the full-width top bar. The CSS applies them; never override.
11. **No decoration.** No emoji, no stock imagery, no icons beyond the glyphs the CSS supplies, no gradients except where one carries meaning (the dashed rail of a planned timeline item, a chart's colour-scale legend), no colored left borders on cards or callouts, no drop caps.
12. **No filler.** Omit an optional block rather than pad it. Every number shown is sourced (§8.21).

## 2. Packaging

Three modes. All use the same markup.

**Linked** (default for sites and shared folders): the document sits beside the `report-kit/` folder, and its `<head>` ends with these lines, after the `cm-` meta tags:

```html
<script>(function(){var t;try{t=localStorage.getItem('cm-theme')}catch(e){}document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')})()</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,300;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap">
<link rel="stylesheet" href="report-kit/cm-report.css">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js" defer></script>
<script src="report-kit/cm-report.js" defer></script>
```

**Self-contained** (for email or attachments): replace the CSS link with `<style>` + the full contents of `cm-report.css`, and the kit script with `<script>` + the full contents of `cm-report.js`, placed as the last element in `<body>`. Keep the font and ECharts CDN links. Do not edit the pasted code.

**Offline** (for reading with no network at all):

```
npm run pack -- "<page>.html"
```

The pack tool (`tools/pack.mjs`) writes the offline form of a page in either other mode to `offline/<page file name>` and leaves the source page unchanged. An offline file is never written or edited by hand. It differs from the self-contained mode in two places:

- One `<style>` of `@font-face` rules replaces the font preconnects and the Google Fonts link. It holds each face that link names as WOFF2 data, Latin subset, from the pinned `@fontsource/nunito` and `@fontsource/jetbrains-mono` packages.
- `<script>` + the full text of ECharts 5.5.1, from the installed `echarts` package, replaces the ECharts CDN link.

The file makes no network request. Characters outside the Latin subset fall back to a system face.

Required `<head>` (copy from the kind's template, in this order): charset, viewport, `<title>{Report title} · {Period}</title>` with the period named as in the title (§7.2), or `<title>{Title}</title>` for a guide, a reference, or a report that covers no period, `<meta name="cm-kit" content="1.2">`, `<meta name="cm-kind" content="{kind}">` naming the kind (`report`, `guide` or `reference`; a page without it is a report, §7), `<meta name="cm-id" content="{id}">` naming the document (§8.31), an optional `<meta name="cm-type" content="{type}">` naming the page type (§7.6), the inline theme pre-paint script, font preconnects + Google Fonts link (Nunito 300 to 900 + italic 300/400, JetBrains Mono 400/600/700; offline: the font `<style>` in their place), kit CSS, ECharts 5.5.1, kit JS. `<html lang>` **MUST** be set.

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
| Label | `.cm-label`, kinds, metadata, status and fact keys, callout, definition and question labels, table heads, contents rail and process step numbers; `.cm-chip` (text centred in the 20px pill), `.cm-tag` (in a 20px box) | 11 / 800 / caps, +0.06em | — |
| Delta | `.cm-delta` | 11 / 800, +0.06em, in the case written, so units read as written (`−50s`, `+2.1 pp`) | — |
| Role tag | property-sheet `<sup>` | 11 / 700, sentence case | — |
| Meta | `.cm-meta` | 13 / 400 | Dates, sizes, provenance |
| Code | `<code>` | JetBrains Mono, 0.8em and never under 11px / 600 | none |
| Code block | `.cm-code`; its file name `.cm-code__file` | JetBrains Mono, 13 / 400; file name 12 / 600 | none |

The rule thickness follows the heading level; the CSS applies it. Headings never skip a level (h1 → h2 → h3 → h4). **Type floor (MUST):** no text is smaller than 11px, on screen or on paper after print scaling. Labels, chips, tags, deltas, role tags, table sort arrows and diagram labels sit at the floor; running text never goes below 13px. Footnote markers (`<sup>`, `<sub>`) and screen-reader-only text are the only exceptions. The breadcrumb is a label with three weights: links 700, the current page 900, separators 300. `<strong>` marks a phrase, never a whole paragraph. `.cm-aside` (300 italic) de-emphasises a phrase.

## 5. Layout and spacing

- Page: `.cm-shell` (rail + main). Reports with fewer than four sections use `.cm-shell.cm-shell--norail` and drop the `<nav class="cm-rail">`.
- Main column caps at 1060px; prose blocks (`.cm-prose`) cap at 70ch.
- **Spacing scale.** Between blocks: 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 56 · 64 · 80 · 96 · 120 · 128 · 160 px. Inside components (chips, rails, list gaps, markers): 2 · 3 · 4 · 6 · 7 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 px. Half-pixel paddings on outlined chips and buttons offset a thicker border so outer sizes match; small negative margins align glyphs. The kit applies all of these; never add your own. Sections start 128px apart (160px before the first appendix). Direct children of `.cm-section__body` are 64px apart automatically, and direct children of `.cm-collapse__body` 32px apart.
- **Link targets.** A link within the page stops its target (a section, a note, a footnote marker, a table title, a figure, a disclosure: any element with an `id`) 24px below the sticky top bar, at whatever height the bar wraps to. A page opened at an address with a fragment jumps straight to its target; links within the page scroll smoothly once the page and its fonts have loaded, and instantly under reduced motion. `cm-report.js` measures the bar into `--cm-topbar-h` and marks the loaded page with `data-cm-loaded` on `<html>`; neither is set by hand.
- **Floor (MUST):** nothing sits closer than 24px to a distinct neighbouring block, and no label sits closer than 8px to the content it names. The kit's spacing already meets this; never add negative margins or tighter wrappers.
- **Bleed rule:** every top-level surface in a section (figure, card, summary, KPI strip, table wrap, code, collapsible group) carries `.cm-bleed`, so its inner text aligns with the body text. Surfaces nested inside a grid do not; put `.cm-bleed` on the grid instead.
- Grids: `.cm-grid` + `--2`, `--3`, `--4`, or `--wide` (1.5 : 1). Add `.cm-grid--cols` for 40px text-column gaps. Grids collapse at 800px and 640px automatically.
- Responsive behaviour is built in: rail becomes a top strip below 1150px, process diagrams stack below 800px, everything single-column below 640px.
- **Phone width (MUST):** at 390px the page never scrolls sideways and no text runs out of its box or is cut off. A table, a code block or a diagram may scroll sideways inside its own box; nothing else does.
- **Current section.** The rail marks the current section's link bold on the track fill. In the strip the link keeps its normal weight and takes a 2px ink underline on the track fill, so no link changes width and the strip keeps its height whichever section is current.

## 6. Elevation and emphasis budget

| Level | Class | Where | Budget |
| --- | --- | --- | --- |
| S1 | `.cm-tile` | Nested inside a surface | Unlimited |
| S2 | `.cm-card`, `.cm-figure`, `.cm-kpi`, `.cm-table-wrap`, `.cm-collapse`, `.cm-status` | Top-level surfaces | Unlimited; one `.cm-status` per document |
| S3 | `.cm-summary`, `.cm-code` | Summary box, code | 1 summary per report; none in a guide or a reference |
| L1e | `.cm-emph` | A bottleneck step, a must-read card, an emphasised diagram node | ≤ 1 per section |
| L2 | `.cm-featured` | Recommendations card | Exactly 1 per report; none when Recommendations is left out (§7.5), and none in a guide or a reference |

Never stack a shadow with a border except where the class does it. Never nest a card inside a card; use `.cm-tile` or `.cm-sub` (inset hairline sub-section) inside a card.

## 7. Document anatomy

The kit builds three kinds of document. A **report** sets out what the numbers show and what to do about them. A **guide** takes a reader through one task, step by step. A **reference** describes one thing, such as a metric, a dataset or a system, for a reader to look up.

A `<meta name="cm-kind">` tag in `<head>`, straight after `cm-kit`, names the kind: `report`, `guide` or `reference`. A page without the tag is a report. Each kind starts from its own template (§1 rule 1). A `cm-id` tag follows, naming the document (§8.31). A page without one passes with a warning until kit 2.0, when the tag becomes required. The index page of a document set carries the kind `index`; a script writes it (§8.31). An optional `cm-type` tag after `cm-id` names a page type, a recipe on one kind (§7.6).

```html
<meta name="cm-kit" content="1.2">
<meta name="cm-kind" content="guide">
<meta name="cm-id" content="guide-billing-escalation">
```

| Kind | Type chip | Required parts, in order | Never carries |
| --- | --- | --- | --- |
| Report | Analysis, Report or Brief | Executive summary; body parts; Recommendations (recommended); Methodology (with a KPI strip, a chart or a table); Notes & sources | |
| Guide | Guide | Purpose; Prerequisites; Steps; Exceptions and recovery; Related documents; Notes & sources | Executive summary, KPI strip, summary card, recommendations card, Period |
| Reference | Reference | Definition; Properties; Relationships; Examples; Notes & sources | Executive summary, KPI strip, summary card, recommendations card, Period |

Every kind shares the top bar, contents rail, masthead, Notes & sources and footer (§7.1). Order is fixed. Required blocks are never omitted, except as §7.5 allows.

### 7.1 Shared blocks

1. **Top bar** (required): `.cm-topbar` with the wordmark (publisher, lowercase-hyphenated), one series chip and the theme toggle. A print button after the toggle is optional, added only when the document is asked to carry one: `<button class="cm-btn cm-btn--secondary cm-btn--sm" type="button" data-cm-print>Print / PDF</button>`. Browser printing works without it (§12). In a document set, the wordmark links to the set's index page (§8.31); outside one, it links to `#top`.
   - A document belongs to a set when it is published in a folder beside the set's index page, which the index script writes (§8.31). Any other document stands alone.
   - The publisher is the organisation or team that publishes the document, the same on every document of a set: `support-operations`. When the source names no publisher, the wordmark takes the team or role in Prepared by: `head-of-billing-support`.
   - The series chip names the series the document belongs to, such as `Support processes`. When the source names no series, it names the page type, such as `Process`, or the kind for a page with no type.
2. **Contents rail** (recommended; required at ≥ 4 sections): one link per section id. Numbers `01…`, appendices `A`, `B`.
3. **Masthead** (required): breadcrumb from set to area to document (§8.31); a document that stands alone writes its set and area steps as `span` elements, with no links, `.cm-bar`, title, dek (one sentence), then `dl.cm-mast__meta` with one `<div><dt>Label</dt><dd>Value</dd></div>` per field, then `dl.cm-byline`. Labels name the value; never leave a value unlabelled.
   - Title: 4 to 10 words. The masthead wraps it at 22 characters a line (`max-width: 22ch`), so no single word in it runs longer. A reference's title is the name of the thing it describes, 1 to 10 words.
   - Status: the type chip for the kind (table above); a status chip, Draft `cm-chip`, In review `cm-chip--warn` or Final `cm-chip--ok`; an optional `cm-chip--note` “Sample data” or “Preliminary”. The status chip reads Draft until the document's owner approves it, and Draft when the source states no status.
   - Period `YYYY-MM-DD → YYYY-MM-DD`: reports only. A guide or a reference has no Period field.
   - Published `YYYY-MM-DD`: the date this version reaches its readers. A source that gives the version an effective date gives this date. With no date in the source, it is the date the document is finished.
   - Reading time `N min`: the words in `<main>` ÷ 220, rounded up. Every word a reader sees counts, headings, labels, chips, KPI values and table cells among them. Scripts, data disclosures (`details.cm-data`: a chart's data table, a diagram's text version), `aria-hidden` text and screen-reader-only text do not. A chart's or a diagram's JSON is a script, so its labels do not count. A word is any run of characters between spaces that holds a letter or digit.
   - Version `X.Y`.
   - These fields are the whole list. Any other fact about the subject, such as the day a policy takes effect, sits in the body: in Properties for a reference.
   - Byline: Prepared by, then Reviewed by when the source names a reviewer, then Distribution. Prepared by names the team or role answerable for the document, the owner the footer names. When the source names an owner and no preparer, Prepared by names the owner. Distribution names the readers the document is for, such as `Internal · all staff`. When they are not known, the field is left out with its omission comment (§7.5).
4. **The kind's parts** (required): §7.2 for a report, §7.3 for a guide, §7.4 for a reference.
5. **Notes & sources** (required): the last section, an appendix with the id `sources`. It holds `.cm-notes` when the document has notes, then the source register `.cm-sources` (§8.15, §8.21). The revision history and the change log follow when the document has them (§8.22). A document with no notes has no notes list and no comment in its place.
6. **Footer** (required): title, version + published date, owner, `Content Morphia Report Kit 1.2`.

Section ids are short, lowercase and stable (`summary`, `demand`, `methodology`, `sources`). Every `<section>` has `aria-labelledby` pointing at its h2.

### 7.2 Report

1. **Part 01 · Executive summary** (required): a lede of 2 to 4 sentences; a KPI strip of 2 to 4; `.cm-summary` with 3 to 5 key findings.
2. **Part 02 … N** (required): one topic per section. Inside: TL;DR or lede stating the finding → figure(s) or table → at most two callouts → optional questions block.
3. **Recommendations** (recommended): its own section after the body and before the appendices. It holds the single `.cm-featured` card (§8.19), then at most one callout, such as the combined effect of several actions.
4. **Appendix A · Methodology** (required when the report shows numbers in a KPI strip, a chart or a table): `.cm-section--part`, then collapsibles numbered A.1, A.2 in order. Terms comes first, a `.cm-def` block, open. Data sources and coverage, then Queries, follow when the document has them. Data sources and coverage holds the limitation register when the document has three or more limits (§8.22).
5. **Appendix B · Notes & sources** (required, §7.1).

The type chip names the report's form: `Report` for a review of a period, `Analysis` for an investigation of one question, `Brief` for a short briefing, such as one without measured numbers.

A report that covers a period names it in its title, after a comma: `Customer support operations review, Q3 2026`. Its `<title>` gives the same words with ` · ` in place of the comma: `Customer support operations review · Q3 2026`. Both name the period as a reader would (`Q3 2026`, `September 2026`); the masthead's Period field gives its dates.

### 7.3 Guide

A guide takes one reader through one task, from the event that starts it to the state that ends it. Its parts follow the order of the work. Each required part is a section with a fixed id.

1. **Part 01 · Purpose** (required, `purpose`): one paragraph that opens the document. It names the task, who carries it out and what it achieves, with its key phrase in bold. It is the section's lede, so it runs 45 words at most (§13.1).
2. **Prerequisites** (required, `prerequisites`): a `ul.cm-list` of what must be in place before the first step: access, tools, information.
3. **Steps** (required, `steps`): a lede, then a procedure (§8.23) of 3 to 9 steps, each closing with its outcome. A longer task splits into several procedures, each under an h3 that names its stage.
4. **Exceptions and recovery** (required, `exceptions`): one h3 per case, named for the condition, then what to do instead. A case that changes a step names that step.
5. **Related documents** (required, `related`): a related list (§8.24) of the documents a reader needs alongside this one.
6. **Appendix A · Notes & sources** (required, §7.1).

A guide may add sections of its own between these parts. Limits, due times and other rules inside a step carry their source. Figures that change over time stay out of the steps and go in the status block (§8.22).

### 7.4 Reference

A reference describes one thing for a reader who looks it up: what it is, its facts, what it connects to and how it applies. Each required part is a section with a fixed id.

1. **Part 01 · Definition** (required, `definition`): one paragraph that opens the document and says what the thing is, with its key phrase in bold. It is the section's lede, so it runs 45 words at most (§13.1).
2. **Properties** (required, `properties`): a property sheet (§8.7) of the facts a reader looks up, such as unit, owner, source system, update frequency and target.
3. **Relationships** (required, `relationships`): the other documents of the kit that describe what the thing feeds, depends on or is reported with, as a related list (§8.24). A policy, dataset or system with no document of its own is named in Properties and cited (§8.21), not listed here.
4. **Examples** (required, `examples`): worked cases, one h3 each, that apply the thing to concrete inputs. Cases made up to show the rules say so in the section's lede, with the word illustrative; a real case cites its source.
5. **Appendix A · Notes & sources** (required, §7.1).

A reference may add sections of its own between these parts, such as one on how the thing is measured.

### 7.5 Blocks left out

A document can lack the content of a block or a field its kind requires: a briefing without measured numbers, a guide for a task with nothing to set up, a source whose path is not recorded. It leaves such a block out, invents nothing to fill it, and puts an omission comment where the block would be. The comment starts `cm-omit`, names the block, and says why after a colon:

```html
<!-- cm-omit kpi-strip: The briefing reports no measured numbers. -->
```

| Block | Kind | Left out when | Name | Where the comment sits |
| --- | --- | --- | --- | --- |
| KPI strip | Report | The document reports no measured numbers | `kpi-strip` | In the executive summary section, where the strip would be |
| Masthead Period field | Report | The document covers no period | `period` | In `dl.cm-mast__meta`, where the field would be |
| Period in the title | Report | The document covers no period | `title-period` | In `<head>`, after `<title>` |
| Recommendations section, with its `cm-featured` card | Report | The document has no actions | `recommendations` | In `<main>`, after the body sections, where the section would be |
| Prerequisites section | Guide | Nothing needs to be in place before the first step | `prerequisites` | In `<main>`, where the section would be |
| Exceptions and recovery section | Guide | No case departs from the steps | `exceptions` | In `<main>`, where the section would be |
| Related documents section | Guide | No other document bears on the task | `related` | In `<main>`, where the section would be |
| Relationships section | Reference | No other document of the kit bears on the thing; what it depends on outside the kit is in Properties and the sources | `relationships` | In `<main>`, where the section would be |
| Examples section | Reference | The thing has no case to work through | `examples` | In `<main>`, where the section would be |
| Byline Distribution field | Any | The readers the document is for are not known | `distribution` | In `dl.cm-byline`, where the field would be |
| Breadcrumb set step, with its separator | Any standing alone | The source names no document set | `set` | In `nav.cm-crumbs`, before the area step |
| Source publisher | Any | The source's author or publisher is not recorded | `publisher` | In the source entry (§8.21), where the publisher would be |
| Source locator | Any | The source's path or address is not recorded | `locator` | In the source entry (§8.21), where the locator would be |

No other block or field is left out this way. A required block missing without its omission comment fails the checks.

Section numbers run over the sections present. The section after an omitted one takes the next number, so a process page without Relationships numbers Examples `Part 05`, straight after Stages at `Part 04`. The contents rail matches.

Other facts a source can leave out take one stated form each, never a guess:

| Fact the source does not give | Stated form | Section |
| --- | --- | --- |
| Status | The status chip reads Draft | §7.1 |
| Publication date | Published is the date the document is finished; an effective date for the version is its Published date | §7.1 |
| Publisher | The wordmark takes the team or role in Prepared by | §7.1 |
| Series | The series chip names the page type, or the kind | §7.1 |
| Preparer | Prepared by names the owner | §7.1 |
| Reviewer | No Reviewed by field, and no comment | §7.1 |
| Document set | The set step's omission comment, `set` | §8.31 |
| Source of a number | A note saying no source is recorded | §8.21 |

### 7.6 Page types

A page type is **a recipe on one document kind** for a reader's question that recurs, such as what a set of terms means. A typed page is a document of its kind: it keeps every required part of the kind, in order, and adds parts of its own. A type never removes a kind's part. The one substitution is the glossary's, where Terms takes the place of Properties (§7.8).

A `<meta name="cm-type">` tag in `<head>`, straight after `cm-id`, names the type. The tag is optional: a page without it is a plain document of its kind, held to the kind's parts alone. The value comes from the selection table below, and the type's kind is the page's `cm-kind`.

```html
<meta name="cm-kind" content="reference">
<meta name="cm-id" content="reference-support-glossary">
<meta name="cm-type" content="glossary">
```

- A typed page starts from its type's template, `template-<type>.html`: the kind's template with the type's parts in place (§1 rule 1).
- File name, id and the masthead's type chip follow the kind (§7.1, §8.31): `Reference - Support Glossary.html`, chip `Reference`. The top bar's series chip names the series, or the type, such as `Glossary`, when the source names no series (§7.1).
- The checks for a type run only on pages that carry its tag; other pages skip them.

#### Recipe

Each type's section states the same fields, in this order.

| Field | What it states |
| --- | --- |
| Reader's question | The question the page answers |
| Kind | The kind the type builds on |
| Choose it | When the type fits rather than its nearest neighbour |
| Required parts | Each part's id, and where it sits among the kind's parts |
| Optional parts | Parts a page may add, with their ids and places |
| Components | The kit components the parts use |
| Evidence rules | What the parts cite, and what stays out of them |

#### Selection

The type to use is the one whose question is the reader's. The neighbour column separates the near cases. A report with no type is the plain report of §7.2.

A document answers one question. When the source material answers two, the page takes the type for the question its subject names. The rest goes in the parts that type allows for it, such as a process page's status block for a quarter's stage measures. Material no part allows is a document of its own, linked from Relationships or Related documents. The readers named in Distribution never choose the type: one process page serves every role in it.

| Type | `cm-type` | Kind | Reader's question | Nearest neighbour | Section |
| --- | --- | --- | --- | --- | --- |
| Report | none | Report | What do the numbers for a period or a question show, and what follows from them? | Process, metric: a report reviews results; a process page says how the work runs, and a metric page defines one measure and where it stands. | §7.2 |
| Guide | none | Guide | How is this task carried out? | Module: a guide's steps do the task once; a module teaches it and checks the learning. | §7.3 |
| Reference | none | Reference | What is this one thing, and what are its facts? | Topic: a reference describes one thing; a topic explains a subject of several parts and links out for each. | §7.4 |
| Topic | `topic` | Reference | What is this subject, and which documents cover each part? | Index page (§8.31): the index is a generated listing of a folder that explains nothing; a topic is written, explains each part and gives a reason for each link. | §7.7 |
| Glossary | `glossary` | Reference | What does each term mean in this set of documents? | Reference: a reference describes one thing in full; a glossary defines five or more terms, a few sentences each. Fewer terms go in a definition block (§8.5) of the document that uses them. | §7.8 |
| Module | `module` | Guide | How is this skill learnt, and how is the learning checked? | Guide: a guide is instructions a reader carries out; a module teaches a rule through lessons and checks it with exercises. | §7.9 |
| Framework | `framework` | Reference | How does this framework divide its subject, and how is it applied? | Framework component (§8.26): the component is one block on any page; a framework page is a whole reference about one framework. | §7.10 |
| Process | `process` | Reference | How does this process run, and which role does each stage? | Guide: a process page shows work passing between roles, with a workflow (§8.25) and a flow diagram; a guide is the steps one reader carries out. Work shared by several roles is a process page, even where one role's part reads as steps. | §7.11 |
| Metric | `metric` | Reference | What does this measure count, where does it stand, and how is it worked out? | Metric detail (§8.30): the component is one block on any page; a metric page is a whole reference about one measure. | §7.12 |
| Comparison | `comparison` | Reference | Which option fits, on stated criteria, and what would change the choice? | Reference: a reference describes one thing; a comparison sets two to four options side by side for a decision. | §7.13 |
| Roadmap | `roadmap` | Report | What has to happen, by whom and by when, to reach one goal? | Report: a plain report shows what past numbers say; a roadmap plans dated work toward a goal. | §7.14 |
| Case study | `case-study` | Report | What changed after one intervention, and how far does the evidence support it? | Report: a plain report reviews a period; a case study judges one change by its measures before and after. | §7.15 |

### 7.7 Topic

A topic is the written overview of a subject made of several parts, such as service levels, with the documents that cover each part. Worked example: `Reference - Service Levels.html`.

- **Reader's question:** what is this subject, and which documents cover each part of it?
- **Kind:** reference (§7.4).
- **Choose it** over the index page (§8.31) when the reader needs the subject explained, not a folder listed. Choose a plain reference when the subject is one thing whose facts fit one property sheet.
- **Required parts:** Subtopics (`subtopics`), after Definition and before Properties. A lede, then two or more groups, one per part of the subject. Each group is a `.cm-stack` under an h3 naming the part. It holds a paragraph that explains the part, then a related list (§8.24) of the documents that cover it, every link leading out of the page.
- **Optional parts:** Reading order (`reading-order`), after Subtopics and before Properties: an ordered list (`ol.cm-olist`) of documents in the order a newcomer reads them, each a link with its reason after it.
- **The kind's parts:** Definition says what the subject spans and what falls outside it. Properties holds facts the subtopics do not state, such as targets, owner and source system. Relationships names neighbouring subjects. Examples follow one case through several parts.
- **Components:** related list (§8.24), property sheet (§8.7), lists (§8.14).
- **Evidence rules:** a topic states rules and targets, never a period's results. Results stay in the report that measures them, reached by a link, or sit in a dated status block (§8.22). A subtopic says enough to choose its links and does not repeat the documents behind them.

```html
<section class="cm-section" id="subtopics" aria-labelledby="subtopics-t">
  <header class="cm-section__head">…</header>
  <div class="cm-section__body">
    <div class="cm-prose"><p>A lede, with its key phrase in bold.</p></div>
    <div class="cm-stack">
      <h3 class="cm-h3">First response time</h3>
      <div class="cm-prose"><p>What this part of the subject is and how it works.</p></div>
      <ul class="cm-related">
        <li><span class="cm-tag">Reference</span><a href="Reference%20-%20First%20Response%20Time.html#measurement">First response time</a><p>What the reader finds there.</p></li>
      </ul>
    </div>
    <!-- one .cm-stack per part, two or more -->
  </div>
</section>
```

### 7.8 Glossary

A glossary defines the terms that several documents in a set share, each in the sense the set uses. Worked example: `Reference - Support Glossary.html`.

- **Reader's question:** what does each term mean in this set of documents?
- **Kind:** reference (§7.4), with Terms (`terms`) in the place of Properties. A glossary has no Properties section. In a glossary, the facts a reader looks up are the terms themselves; a property sheet about the glossary would repeat its masthead, byline and sources.
- **Choose it** over a plain reference when the reader looks up many terms, a few sentences each. Choose a definition block (§8.5) in the document that uses the terms when there are fewer than five, or one document uses them.
- **Required parts:** Terms (`terms`), after Definition and before Relationships. A lede, then definition blocks (§8.5) holding five or more terms in all. With more than one block, each sits in a `.cm-stack` under an h3 that names what its terms describe. Terms run A to Z within a block, and each term is defined once on the page.
- **Optional parts:** none.
- **The kind's parts:** Definition says what the glossary covers, what its terms follow, and what falls outside it. Relationships links the documents that use the terms. Examples work several terms through one case with real times or values.
- **Components:** definition (§8.5), related list (§8.24).
- **Evidence rules:** each definition cites the policy, dataset or system it follows (§8.21), and changes only when that source does. A definition holds no number that will change (§13.2).

```html
<div class="cm-stack">
  <h3 class="cm-h3">Clocks and waits</h3>
  <aside class="cm-def">
    <span class="cm-def__label">Definitions</span>
    <dl>
      <div><dt>Business hours</dt><dd>What the term covers and how it counts, 15 to 60 words.<a class="cm-cite" href="#src-1" id="cite-1">S1</a></dd></div>
    </dl>
  </aside>
</div>
```

### 7.9 Module

A module teaches one skill through lessons and checks it with exercises, for a reader who must apply a rule to new cases. Worked example: `Guide - First Response Basics.html`.

- **Reader's question:** how is this skill learnt, and how is the learning checked?
- **Kind:** guide (§7.3).
- **Choose it** over a plain guide when the reader must understand a rule well enough to apply it unaided. A guide's steps do the work once; a module's lessons teach it, and its exercises check it.
- **Required parts:**
  1. Objectives (`objectives`), after Purpose and before Prerequisites: an ordered list (`ol.cm-olist`) of 2 to 5 objectives. Each says in one sentence what the reader can do afterwards, and links to the lesson that teaches it and the exercise that checks it.
  2. Lessons: the guide's Steps part (`steps`), titled `Lessons`. Each lesson is a procedure step (§8.23) with an id, `lesson-1`, `lesson-2` and on: the rule it teaches, a worked case, and an outcome.
  3. Exercises (`exercises`), after Lessons and before Exceptions and recovery: a lede, then one group per exercise. Each group is a `.cm-stack` with an id, `exercise-1` and on, an h3, the task, and the answer in a closed collapsible (§8.16) labelled `Answer`. Every exercise checks a stated objective.
- **Optional parts:** none.
- **The kind's parts:** Prerequisites names what the lessons assume. Exceptions and recovery covers the cases where the rule misleads, and how to read them. Related documents links the references the lessons summarise.
- **Components:** procedure (§8.23), lists (§8.14), collapsible (§8.16), related list (§8.24); a model (§8.27) when a lesson teaches one.
- **Evidence rules:** rules and limits in a lesson carry their source, as in any guide step (§7.3). Exercise cases are illustrative and say so; each answer shows its working. Figures that change over time stay out of lessons and exercises.
- **Static:** a module records nothing about its reader. It carries no form controls, scores, progress tracking or resume point, and no interactive check such as a multiple-choice question. An answer stays closed until the reader opens it, and print opens every answer (§12).

```html
<div class="cm-stack" id="exercise-1">
  <h3 class="cm-h3">Chat with an acknowledgement and a note</h3>
  <div class="cm-prose"><p>The task, with the inputs it needs.</p></div>
  <div class="cm-bleed">
    <details class="cm-collapse">                          <!-- never open -->
      <summary><div><span class="cm-label">Answer</span><h4>Exercise 1</h4></div></summary>
      <div class="cm-collapse__body">
        <div class="cm-prose"><p>The answer first, then its working.</p></div>
      </div>
    </details>
  </div>
</div>
```

### 7.10 Framework

A framework page answers one question: how does a framework divide its subject, and how does a reader apply it? It is a reference with `<meta name="cm-type" content="framework">` after `cm-id`, and it starts from `template-framework.html`. It keeps every part of §7.4 and adds four. Worked example: `Reference - Support Quality Pillars.html`.

Choose a framework page when the framework itself is the subject of the document. A framework that serves another document's argument stays a framework card (§8.26) inside that document. The page holds what one card cannot: why the framework exists, how to apply it and where it fails.

Required parts, each a section with a fixed id, in this order between Properties and Relationships:

| Part | Id | Content |
| --- | --- | --- |
| Rationale | `rationale` | A lede that states the problem the framework solves and cites its source, then prose on how the framework answers it. |
| Parts | `parts` | A lede, then one framework card (§8.26) named as the page is, with both scope lists, `Use when` and `Not for`. The heading names the parts, such as Pillars or Layers. |
| Application | `application` | A lede, then the steps that apply the framework: a numbered list (§8.14) of 3 to 7 steps, or a method (§8.28). |
| Limits | `limits` | A lede, then 1 to 4 cases, one h3 each, named for the condition. Each says what goes wrong and what the reader does instead. |

The scope and Limits answer different questions. The scope says which cases the framework fits; Limits says where it fails inside those cases.

Optional parts: a table after the framework card that compares the parts across shared attributes (§8.26). A framework page may add sections of its own between Rationale and Limits.

Components: property sheet (§8.7), framework (§8.26), numbered list (§8.14), method (§8.28), table (§8.11), related list (§8.24), sources and citations (§8.21).

Evidence rules:

- Properties names the document that sets the framework out, cited, and the rationale cites it again.
- A part that names a measure uses the measure's name as its metric page or report gives it.
- A limit that rests on a number cites the number's source.

### 7.11 Process

A process page answers one question: how does a process run from start to end, and which role does each stage? It is a reference with `<meta name="cm-type" content="process">` after `cm-id`, and it starts from `template-process.html`. It keeps every part of §7.4 and adds two. Worked example: `Reference - Ticket Escalation.html`.

Choose a process page over a guide (§7.3) when the reader needs the whole path of the work across its roles. A guide holds the steps one reader carries out, and the process page links to it from Relationships. Choose a process page over a roadmap (§7.14) when the work repeats rather than running once to an end state. Choose it over a plain report (§7.2) when the reader needs how the work runs. A period's measures of its stages then go in the status block; a review of the period is a report.

Properties names the process's owner and roles, the event that starts it and the state that ends it. It also cites the policies that set its rules, with the targets and due times they set. A target is a rule, so it sits in Properties; the measured result against it changes, so it sits in the status block.

Required parts, each a section with a fixed id, in this order between Properties and Relationships:

| Part | Id | Content |
| --- | --- | --- |
| Flow | `flow` | A lede, then a figure (§8.10) holding a flow diagram (§8.20) of the stages and decisions, with one lane for each role. |
| Stages | `stages` | A lede, then one workflow (§8.25) named as the page is. Each stage title is the label of a node in the flow diagram. |

The flow diagram is required because work that passes between roles is a flow diagram, not a process diagram (§8.13). A process page carries no procedure (§8.23); the steps one role carries out belong in a guide.

The diagram and the workflow match in these ways:

- A stage is a step node with the stage's title as its label. A last stage that ends the flow, such as the payment that returns a refund, may be the end terminal instead. Its title then names the outcome, `Refund paid`, and is the terminal's label.
- A decision is no stage of its own. It belongs to the stage before it, and that stage's `Hands on when` names each branch and the stage it leads to.
- The diagram draws every branch of every decision it shows. A case in the workflow's Exceptions part is not drawn: the exceptions are the text's.
- A flow past the diagram's capacity (§8.20) draws its main path, and moves the rarer branches into Exceptions or splits into an overview and details.

Optional parts: a status block (§8.22) after the Stages lede, for stage measures that change, such as waits and shares of work. A process page may add sections of its own between Flow and Relationships, such as a second diagram from §8.20.

Components: property sheet (§8.7), figure (§8.10), flow diagram (§8.20), status block (§8.22), workflow (§8.25), related list (§8.24), sources and citations (§8.21).

Evidence rules:

- The figure's caption cites the rules or policies the flow follows.
- Stage measures sit in the status block with an as-of date and a source. The workflow and the diagram hold no values that change.
- A due time or a limit inside a stage cites the policy that sets it.

### 7.12 Metric

A metric page answers one question: what does a measure count, where does it stand, and how is it worked out? It is a reference with `<meta name="cm-type" content="metric">` after `cm-id`, and it starts from `template-metric.html`. It keeps every part of §7.4, adds one and allows a second. Worked example: `Reference - First Response Time.html`.

Choose a metric page when one measure is the subject of the document. A measure that a report or another page defines in passing stays a metric detail (§8.30) inside that document. A dataset, a system or a policy is a plain reference (§7.4). Choose a metric page over a plain report (§7.2) when the reader needs one measure's definition and standing. A review of a period across measures is a report.

Properties holds the metric detail (§8.30) in place of a plain property sheet, named as the page is. Its definition gives the counting rule, while the Definition part says what the measure means to a reader. The card holds no related metrics; the page lists them under Relationships.

Required and optional parts, each a section with a fixed id, in this order between Properties and Relationships:

| Part | Id | Content |
| --- | --- | --- |
| Status | `status` | Required. A lede on where the measure stands against its target, then the status block (§8.22) with the measure's value under its name. An optional figure (§9) breaks the value down or shows its trend. |
| Measurement | `measurement` | Optional. A lede, then the rules that time or count each case, as a definition block (§8.5), and the query (§8.17) behind the reported value. |

Components: metric detail (§8.30), status block (§8.22), charts (§9), definition (§8.5), code (§8.17), related list (§8.24), sources and citations (§8.21).

Evidence rules:

- The current value, its period and its as-of date sit in the status block, never in the metric detail or the Definition part.
- A figure's caption cites the report or dataset its values come from. A target line on a chart uses the target in the metric detail.
- Thresholds appear only when the metric's owner has set them, with their source. A page never invents bands.
- Examples that apply the counting rule to invented tickets say they are illustrative. A real value in an example cites its source.

### 7.13 Comparison

A comparison page answers one question: which of several options to choose, judged on stated criteria, and what would change the choice? It is a reference with `<meta name="cm-type" content="comparison">` after `cm-id`, and it starts from `template-comparison.html`. It keeps every part of §7.4 and adds five. Worked example: `Reference - APAC Weekend Coverage.html`.

Choose a comparison page when a decision between 2 to 4 options is the subject of the document. One subject scored against criteria is an evaluation (§8.29). Actions that follow from a report's findings are the report's recommendations (§7.2). A state that followed another after a change is a case study (§7.15).

Properties names the decision, its owner, its decide-by date and the evidence behind the measures, each cited.

Required parts, each a section with a fixed id, in this order between Properties and Relationships:

| Part | Id | Content |
| --- | --- | --- |
| Options | `options` | A lede, then one h3 for each option, named as its table column, with a sentence or two on what the option does. |
| Criteria | `criteria` | A lede, then a definition block (§8.5) with one term for each criterion, named as its table row. Each says what the criterion measures and why it bears on the decision. |
| Comparison | `comparison` | A lede with the finding across the options, then one table (§8.11). It has a column for each option, a row for each criterion and a measure in every cell. |
| Recommendation | `recommendation` | A first paragraph that names the recommended option in bold, then the reasons, including what the option costs. |
| Change conditions | `conditions` | A lede, then a list (`ul.cm-list`) of 1 to 4 conditions. Each names a change in the facts and the option it would favour. |

The comparison table follows these rules:

- The recommended column carries `is-rec` on its cells and ★ in its header (§8.11). The caption's note line says what ★ marks.
- Every option has a measure for every criterion, so no cell is blank or reads `n/a` (§8.11). An estimate says so in its cell, as `140 est.`, and the note line names its source.
- Formatted cells carry `data-value`. With 5 or more criteria the table is `data-sortable`, and each option column carries `data-nosort`, since its cells mix units.
- Weighted scores follow §8.29: one scale, a weight for each criterion and totals in `<tfoot>`.

Optional parts: sections of the document's own between Options and Change conditions, such as one on cost.

Components: property sheet (§8.7), definition (§8.5), table (§8.11), list (§8.14), related list (§8.24), sources and citations (§8.21).

Evidence rules:

- The table's caption cites the source of every measured value and of every estimate.
- An option with no trial is measured by a cited model, and its cells say est.
- The recommendation states where the recommended option is weaker, as well as where it leads.

### 7.14 Roadmap

A roadmap answers one question: **what has to happen, by whom and by when, to reach one goal?** It is a report with `<meta name="cm-type" content="roadmap">` after `cm-id`, and it starts from `template-roadmap.html`. It keeps every part of §7.2 and adds three.

Choose a roadmap over a plain report when the subject is planned work toward a dated goal, not what past numbers show. Choose it over a process (§7.11) when the work runs once to an end state rather than repeating.

Required parts, each a section with a fixed id, in this order between the executive summary and Recommendations:

1. **Goal** (`goal`): one paragraph opens the section. It states the end state with its key phrase in bold, the date it is due, and the expected effect with its citation. A second paragraph may give the baseline the goal moves from.
2. **Milestones** (`milestones`): a lede, the status block (§8.22) straight after it, a timeline (§8.12) with one item per milestone, then the milestone table.
   - A timeline item names the milestone and states its exit criteria in one sentence that opens “Done when”. The next milestone due is `is-current`, and later ones are `is-planned`.
   - Each item carries one status chip from a closed set: `Done` (`cm-chip--ok`, on an `is-done` item), `On track` (plain), `At risk` (`cm-chip--warn`), `Late` (`cm-chip--crit`) or `Planned` (plain).
   - The milestone table has the columns Key, Milestone, Owner, Due and Depends on, in that order. It lists the timeline’s milestones in the same order, with the same names and dates.
   - Key is `M` and a number. Owner is one team or role. Due is an ISO date in `<time datetime>`, written with non-breaking hyphens (U+2011) so it never wraps in a narrow column.
   - Depends on is `None`, or keys such as `M2, M3`. Each milestone named there is in the table and due no later than the one that depends on it.
3. **Out of scope** (`out-of-scope`): a lede, then a `ul.cm-list` of what a reader might expect the roadmap to change and it leaves alone. Each item says what happens to that thing instead.

Optional parts: up to two risk callouts in Milestones (§7.2), each naming the dependency that could move a date. A roadmap may add sections of its own between Goal and Out of scope, such as one on cost. The kit draws no board or Gantt chart: the timeline and the milestone table carry the plan.

The KPI strip **SHOULD** show the measures the goal moves, at their baseline. Recommendations holds the decisions the plan needs from its readers, each with an owner and a decide-by date. A plan with nothing to decide leaves Recommendations out (§7.5).

Components: KPI strip (§8.2), key findings (§8.3), status block (§8.22), timeline (§8.12), table (§8.11), callouts (§8.4), recommendations card (§8.19), sources and citations (§8.21).

Evidence rules:

- The goal’s expected effect is stated as an expectation and cites the analysis it comes from.
- Figures that change as the plan runs, such as milestones done, sit in the status block. Each cites its source, unless the document counts it from its own milestones.
- The milestone table’s caption cites the record that set its owners and dates.
- A milestone whose date moves keeps its key, and the change log records the move (§8.22).

### 7.15 Case study

A case study answers one question: **what changed after one intervention, and how far does the evidence support it?** It is a report with `<meta name="cm-type" content="case-study">` after `cm-id`, and it starts from `template-case-study.html`. It keeps every part of §7.2 and adds five.

Choose a case study over a plain report when the document judges one change by comparing measures before and after it; a plain report reviews a period. Choose it over a comparison (§7.13) when one state followed the other, rather than options set side by side for a choice.

Required parts, each a section with a fixed id, in this order between the executive summary and Recommendations:

1. **Situation** (`situation`): the state before the intervention, opening with a paragraph that cites its source. It says what was wrong and how the numbers showed it.
2. **Intervention** (`intervention`): what changed, who changed it and when. A lede, then a timeline (§8.12) of the dated changes, including parts added or withdrawn during the study.
3. **Results** (`results`): a lede that counts the measures that got better, did not move and got worse. Then:
   - A property sheet (§8.7) with the keys `Before` and `After`, each a period `YYYY-MM-DD → YYYY-MM-DD`. The two periods have the same number of days, and After starts after Before ends.
   - The same sheet names the scope, the control group (or `None`) and the data source.
   - A results table with the columns Measure, Before, After, Change and Direction, one row per measure. Direction is a word from a closed set: `Better`, `No change` or `Worse`.
   - Optionally, a figure of one measure across both periods. Its before values are `$context` marks, and a marked area names the intervention period (§9).
4. **Confounds** (`confounds`): a lede, then a list or table of the other changes in or near the two periods. Each could move a measure without the intervention; each says which way, with its source.
5. **Failures** (`failures`): a lede, then a list or table of the parts of the intervention that did not work. Each says what happened and whether the part was withdrawn or kept at a cost.

Limitations are required: one or two limitation callouts, or three or more in the limitation register in A.2 (§8.22). A comparison of before and after cannot rule out every other cause, so a case study always names at least one limit.

The KPI strip **SHOULD** show measures after the intervention, with the change against before as the delta and the before value in the foot. The key findings name the measures that did not improve or got worse, as well as those that did. Optional parts: sections of the document’s own between Situation and Failures, such as one on cost.

Components: KPI strip (§8.2), key findings (§8.3), timeline (§8.12), property sheet (§8.7), table (§8.11), bar chart (§9), callouts or limitation register (§8.4, §8.22), recommendations card (§8.19), sources and citations (§8.21).

Evidence rules:

- A claim of effect cites its source: each key finding, each paragraph of Results and the results table’s caption.
- Every measure the study tracked has a row in the results table, whatever its direction. A measure that got worse is never left out.
- Each measure keeps one definition in both periods, given in A.1. A.1 also defines `No change`: the size of move below which a measure counts as unchanged.
- Without a control group, a limitation names the missing control. A difference in volume or mix between the periods is a confound.

## 8. Components

Markup below is canonical. Copy structure and classes exactly; change only text, data and the allowed custom properties.

Sections 8.25 to 8.30 are the structured components: workflow, framework, model, method, requirement, evaluation and metric detail. They are the building blocks of reference pages such as a framework, process, guide, metric or comparison page. Each is text first: it reads in order, prints whole and reflows on a phone. They share one anatomy:

- A card, `div.cm-card.cm-{kind}.cm-bleed`, opens with its kind label (`span.cm-label.cm-card__kicker`) and a T3 title (`h3.cm-card__title`) that names the thing as a noun phrase. The kind label is the component's name: Workflow, Framework, Model, Method, Requirement, Evaluation or Metric.
- Its parts follow 24px apart, in the small text size of text inside a surface. A labelled part is a `.cm-sub`: an inset hairline, then its `.cm-label` on a line of its own.
- Facts, `dl.cm-facts`: one to five short facts about one item, key over value, as the status block sets them (§8.22). Keys are 1 to 3 words; a value is a phrase of 12 words at most, a chip or a link. A property sheet (§8.7) holds the facts about the subject of a section, in groups; a facts row holds a few facts about one item inside a component.
- Parts, `ul.cm-parts`: named parts as tiles, `li.cm-tile`, each a name (`p.cm-t5`, 3 words at most) and one sentence of 25 words at most. Peers sit two or three across. `ol.cm-parts` stacks its parts top first, for layers. `ol.cm-parts.cm-parts--matrix` is a two by two grid whose cells each open with a position label.
- Scope, `div.cm-scope`: two short lists side by side, each under its label, one sentence per item and one to three items: `Use when` and `Not for`, or `Holds when` and `Breaks when`.
- A component carries no `cm-emph` and no `cm-featured`; it takes no place in the emphasis budget (§6).
- Its prose sits under its title, so it shares the 150 words allowed between headings (§13.1). Its component limits hold as well.

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
- Foot: the reference the value is read against, named with its value in a `<span>`: a target (`Target 95%`), an earlier value (`Q2 44,870`, `Before 212`) or a comparison (`Chat, Q3 96.1%`). A `<b>` after it gives where the value stands against that reference: the gap (`−3.8 pp`), `Met` or a change in percent (`−55%`). The `<b>` is left out when the delta already states it.
- The strip carries no sources. Its numbers reappear in the body with their citations (§8.21, §14 item 4).

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

Facts about one thing: a metric, dataset, system or document. Keys are 1 to 3 words. A key's sub-label in `<small>` is 1 to 3 words of its own and does not count toward the key: `Approver<small>(over $500)</small>`. Group related keys; 2 to 4 groups. Role tags in `<sup>` (one word). A reference's Properties section holds one (§7.4).

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
- A table wider than its box scrolls sideways inside it on screen. In print nothing scrolls: the gutters narrow to 12px and the heads wrap, so the table holds to the printed column.
- Numeric columns: `.num` on `th` and `td`; consistent decimals; thousands separators; `−` (U+2212) for negatives.
- A cell whose value does not apply reads `n/a`, in `.soft`. A dash never stands for a value.
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

3 to 6 steps; `--steps` equals the count; titles ≤ 3 words; ≤ 1 `cm-emph` step with a chip naming why. A process diagram shows how work flows; the steps a reader carries out go in a procedure (§8.23). A process with a branch, a loop or a hand-off between roles is a flow diagram (§8.20).

### 8.14 Lists

`ul.cm-list` (grey dots) and `ol.cm-olist` (01, 02). Add `.cm-small` inside surfaces. Items may contain inline code, links and bold, but no item opens with a bold label or phrase run into its text (§13.2). A term with its explanation goes in a definition block (§8.5), a property sheet (§8.7) or a table (§8.11).

### 8.15 Footnotes and sources

In text, after punctuation: `<a class="cm-fn" href="#fn-1" id="fnref-1">1</a>` (brackets are added by CSS). In the Notes & sources appendix (§7.1), the notes come first, then the source register (§8.21):

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

Appendices only, and the answers to a module's exercises (§7.9). In an appendix the first item is `open`; an answer is never `open`. Never hide findings or anything the summary depends on. The body spaces its own blocks, so several blocks go straight into it.

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
- Below 640px, a chip, tag or delta wider than its line wraps its words inside the outline, so it never pushes its block past the screen.

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

- Owner: `Owner · ` and the role or team that carries the action out.
- Date: `Due YYYY-MM-DD` for work to finish, or `Decide by YYYY-MM-DD` for a decision.
- Expected impact: `cm-chip--accent`, the estimated change with its unit, marked `est.` when it is an estimate. An action whose impact is not estimated carries no impact chip; no estimate is invented for it.

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
        {"id": "arrive", "type": "terminal", "label": "New ticket", "col": 1, "row": 1},
        {"id": "channel", "type": "decision", "label": "Channel?", "col": 2, "row": 1},
        {"id": "classify", "type": "step", "label": "Intent classifier", "detail": "Billing, technical or account queue", "col": 3, "row": 1},
        {"id": "shared", "type": "step", "label": "Shared queue", "detail": "One queue for every topic", "col": 3, "row": 2},
        {"id": "agent", "type": "terminal", "label": "With an agent", "col": 4, "row": 1}
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

The JSON holds these fields and nothing else: no coordinates, sizes, classes or styles. Placement is the author's; geometry is the kit's.

| Field | Holds | Values |
| --- | --- | --- |
| `nodes` | One entry for each node | `id` (unique), `type`, `label`, optional `detail`, `col` and `row` (whole numbers from 1, one node a cell), optional `emphasis`, `level` on a journey map |
| `edges` | One entry for each connection | `from` and `to` (node ids), optional `kind`, optional `label` |
| `groups` | Optional lanes, boundaries and phases | Lane: `"type": "lane"`, `label`, `row`, optional `rows`. Boundary: `"type": "boundary"`, `label`, `col`, `row`, optional `cols` and `rows`. Phase: `"type": "phase"`, `label`, `col`, optional `cols` |
| `direction` | Optional reading direction | `right` (default) or `down` |
| `experience` | Optional scale of a journey map | 3 to 5 words, lowest first |

Shape marks the node type and line style the edge kind. A key above the drawing names each type and kind in use when the diagram has a data store, an external entity, a data edge, an optional edge or an experience line.

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
- `col` counts across from the left and `row` down from the top, whichever way the flow reads. A flow that reads down places its steps in rows, so its edges move forward down the rows; a flow that reads right moves forward across the columns. More edges move forward than back; a process that returns as often as it advances is a state diagram.
- Every step and decision has an edge out. A branch that ends before the last step ends at a terminal of its own, named for the outcome. A terminal starts or ends the flow, so it has edges in or edges out, never both. A journey map, whose columns already read as time, and a system and data flow, which may end at a store or an external entity, are the exceptions.
- Every branch out of a decision carries a label of 1 to 3 words that answers its question. The label is "Yes" or "No", a value such as `Over $500`, or a role when the question asks who. No two branches of one decision share a label. A condition longer than three words goes in the text, such as the stage that holds the decision (§8.25). The label names the value that decides it.
- A decision sends each branch out of a side of its own, and its incoming edges share one side, so it has at most three branches. In the first or last row, a third branch loops round the outside of the drawing, so a decision there has at most two. In a flow that reads down, the same holds for the first or last column. A decision with more outcomes becomes two decisions in a row: the first asks one condition, such as `Within 30 days?`, and the second the next.
- A lane is a row band named on the left, one role or system each. With lanes, every row sits in exactly one lane, so each hand-off crosses a lane line.
- A boundary is a rounded frame around a block of cells, named at the left of its top line, or at the right when an edge crosses where the name would stand.
- One node at most is emphasised: a step, with a chip of one or two words naming why. It counts toward the section's one `cm-emph` (§6).

Capacity. Every ceiling below is counted from the JSON, so a document built away from the kit's repository can meet it without drawing the diagram.

| Item | At most | Reason |
| --- | --- | --- |
| Nodes | 24 | The library's panel tier holds 8 to 24 nodes |
| Width | 5, counted as below | At the print floor of 80%, where text prints at 125%, a column of steps takes 120px and the gap after it 40px: five such columns fill the 638px printed column |
| Rows | 5 | Five rows of plain steps print at full size; five with a detail line each run past a printed page at 80%, and the print check fails them |
| Lanes | 5 | The library's journey map, its widest lane diagram, has 5 lanes |
| Branches of one decision | 3, or 2 in the first or last row | Each branch leaves by a side of its own, and the incoming edges take a side |
| Boundaries | 2 | The library's panel tier allows 2 groups |
| Edge labels | 12 | The library labels edges only while a view has 12 or fewer |
| Line crossings | 3 | The library's crossing budget for one view |
| Emphasised nodes | 1 | §6 |

The width counts each part that takes about a column of steps in print:

| Part | Counts |
| --- | --- |
| Each column | 1 |
| The lane names, in a diagram with lanes | 1 |
| Each gap between columns that holds an edge label | 1 |
| A gap between columns whose longest label runs past 10 characters | 2 |

So a diagram has at most 5 columns, or 4 with lanes, less one for each labelled gap between them. In a flow that reads right, an edge's label stands in the gap beside its node in two cases:

- The edge joins two nodes of one row.
- The edge runs forward to another row, and no edge from the same node runs forward along its row. Such an edge takes the forward side; beside a branch along the row, it leaves up or down instead.

A labelled edge within one column, or back to an earlier column in another row, leaves up or down and widens no gap between columns. In a flow that reads down, every labelled edge between two columns counts the gap beside its node.

Terminal labels past 13 characters and decision labels past 12 widen their columns beyond a step's 120px, a terminal's to as much as 192px. A diagram may hold two such columns, and none when its width counts 5. Shorter labels, or a decision split in two, keep it inside.

Past a ceiling, a flow takes one of these forms:

- An overview and details: one diagram of the stages, then one for each stage that needs it.
- In a process page, the main path drawn and the rarer branches written as the workflow's Exceptions (§7.11).
- For a decision with more than three outcomes, two decisions in a row.

The checks measure the drawing in print when the document returns to the repository (§14). They fail a drawing wider than the printed column at 80%, or taller than a page. They also catch what the counts cannot see, such as an edge looping round the outside.

Diagram text is not prose (§13). It keeps its own limits:

| Text | Limit |
| --- | --- |
| Node `label` | 24 characters, the length at which the library cut node names |
| Node `detail` | 40 characters, two lines in print |
| Edge `label` | 1 to 3 words, as a chart annotation (§9) |
| `emphasis` | 1 or 2 words |
| Lane, boundary or phase `label` | 24 characters |

The kit applies the rest:

- Nodes in one column share a width and nodes in one row share a height. A decision's square grows to hold its question.
- Edges run at right angles through the gaps between columns and rows, with rounded elbows and an arrowhead, in 2px ink. Edges that leave or enter one side share a line. Decision outlines and boundaries are 1.5px.
- Branches that enter one node by one side join on their last run, so two paths to one stage meet before its arrowhead. Each keeps its label near its own source.
- A line in at a node's top and out at its bottom would read as one line through the node. So a step whose top takes in two edges or more reaches the node directly below it from the side, with a hook. The hook is the drawing working as meant. A straight line down needs those edges to enter from the side, or the next node beside the step.
- An edge label stands on its line, near where the line leaves its node. The line runs 16px from the node, breaks 8px before the label and goes on 8px past it, with the label centred on it. The placement is the same whether the line leaves sideways or up and down.
- A labelled edge leaves its node by a side no other edge uses, so no other line runs where its label stands.
- When the line leaves a boundary within that reach, it runs 8px past the boundary side before it breaks, so the label stands outside. A label stands at least 24px before a side its line goes on to cross, so the line shows before it crosses.
- Edge labels take the label style on the page colour, 8px clear of every other line, node and label.
- The drawing recomputes on resize, on a theme change and before print.
- A text version follows the caption: a `details.cm-data` disclosure, "View as text", with one numbered item for each node in reading order. Each item gives the node's name and detail, then where the flow goes next: each branch with its label and step number, and a loop as "Back to step N". The node's phase, lane and boundaries, its experience level and the emphasised node are named.
- An empty `aria-label` takes a summary from the data: the number of steps, the first and last, and the count of lanes, decisions and loops. A journey map and a system and data flow take their own summary (below). An author's `aria-label` stays; it states what the diagram shows in one sentence.
- When the screen layout is wider than its box, the diagram takes the narrower gaps and nodes of the print layout. If it is still wider, it scales to the box's width, never below 80%, with its text set larger as in print. Past that floor it scrolls sideways inside its own box. Text never draws under its own size.
- Print narrows the gaps and the nodes, then scales the drawing to fit the 638px printed column and 720px of a page, never below 80%. Text in a scaled drawing is set larger by the inverse of the scale, up to 125%, so it prints at its own size and never under 11px. The text version prints open.
- A diagram that fits the printed column never scrolls at a desktop window, 1000px and wider. The layout check fails one that scrolls at 1440px.
- A node widens to hold its emphasis chip, which never wraps.

#### Sequence

A sequence diagram shows the messages that pass between people or systems, in the order they are sent. A hand-off with branches or loops is a flow diagram with lanes.

```html
<div class="cm-diagram" data-diagram="sequence" role="img" aria-label="">
  <script type="application/json">
  {
    "nodes": [
      {"id": "customer", "label": "Customer"},
      {"id": "agent", "label": "Tier 1 agent"},
      {"id": "billing", "label": "Billing specialist"}
    ],
    "edges": [
      {"from": "customer", "to": "agent", "label": "Reports double charge"},
      {"from": "agent", "to": "billing", "label": "Escalates", "activate": true},
      {"from": "agent", "to": "customer", "kind": "reply", "label": "Gives due time"},
      {"from": "billing", "to": "billing", "label": "Checks the ledger"},
      {"from": "billing", "to": "customer", "kind": "reply", "label": "Refunds charge"}
    ]
  }
  </script>
</div>
```

The JSON holds `nodes` and `edges` only. Participants stand left to right in the order written and messages run down in the order written, so the author writes no columns or rows. A node holds `id`, `label` and an optional `detail`; an edge holds `from`, `to` and `label`, with optional `kind` and `activate`.

| Value | Drawn as | Use |
| --- | --- | --- |
| A node | Rectangle with a lifeline down from it | A person or system that sends or receives |
| `message` | Solid line, the default | A request, a report or a hand-off |
| `reply` | Dotted line | An answer to an earlier message |
| `optional` | Dashed line | A message sent only in some cases |
| `"activate": true` | Narrow bar on the receiver's lifeline | The receiver works on the message until its next reply |

- Every message carries a label of 1 to 3 words. It stands above its arrow in the gap beside the sender, so no label sits on a lifeline.
- An arrow starts on the sender's lifeline and stops 8px short of the receiver's. A message to oneself turns right and comes back to the same lifeline.
- An activation bar runs from the message that opens it to the receiver's next reply, or to the last message. A participant has one bar open at a time.
- Lifelines are 1.5px in the field colour, so they read as structure rather than as messages.
- A key above the drawing names the lines and the bar whenever the diagram has a reply, an optional message or an activation bar.
- A sequence diagram has no emphasised node.

| Item | At most | Reason |
| --- | --- | --- |
| Participants | 4 | Four participants print at full size with three-word messages of 15 characters; messages of 20 characters need less than 80%, and the print check fails them. Five participants do not fit the printed column at 80% |
| Messages | 12 | The library labels edges only while a view has 12 or fewer, and every message carries a label |

A participant `label` stops at 24 characters and a `detail` at 40, as a flow node's; a message label stops at 3 words, as an edge label.

The text version lists every message once, numbered in time order. Each item gives the sender and the receiver, "replies to" for a reply, "to itself" and "optional" where they apply, then the label. A message that opens a bar names the message that closes it. An empty `aria-label` takes a summary: the number of messages, the participants, and the number of replies.

#### State

A state diagram shows the states one thing passes through, such as a ticket, and the events that move it from one to the next. Steps that people carry out are a flow diagram.

```html
<div class="cm-diagram" data-diagram="state" role="img" aria-label="">
  <script type="application/json">
  {
    "nodes": [
      {"id": "start", "type": "initial", "col": 1, "row": 1},
      {"id": "open", "type": "state", "label": "Open", "detail": "An agent is working on it", "col": 2, "row": 1},
      {"id": "pending", "type": "state", "label": "Pending", "col": 2, "row": 2},
      {"id": "solved", "type": "state", "label": "Solved", "col": 3, "row": 1},
      {"id": "end", "type": "final", "col": 3, "row": 2}
    ],
    "edges": [
      {"from": "start", "to": "open"},
      {"from": "open", "to": "pending", "label": "Asks customer"},
      {"from": "pending", "to": "open", "label": "Customer replies"},
      {"from": "pending", "to": "pending", "label": "Reminder sent"},
      {"from": "open", "to": "solved", "label": "Agent solves"},
      {"from": "solved", "to": "end", "label": "After 4 days"}
    ]
  }
  </script>
</div>
```

The JSON holds `nodes`, `edges` and an optional `direction`, placed on the grid as in a flow diagram. A node holds `id`, `type`, `col` and `row`; a state adds `label` and may add `detail` and `emphasis`. An edge holds `from`, `to` and `label`.

| Value | Drawn as | Use |
| --- | --- | --- |
| `initial` | Filled dot, no label | Where the thing starts; exactly one |
| `state` | Rounded rectangle; `detail` adds a second line | A condition the thing stays in until an event moves it |
| `final` | Ringed dot, no label | Where the thing ends; none, one or more |

- Every transition is a solid line with an arrowhead, named by its event. Only the transition out of the start goes unnamed.
- The start has one transition out and none in; an end has none out. No two transitions out of one state share an event.
- A self-transition, with `from` and `to` the same state, is a loop on one side of the state. The kit takes the first side in reading order that no other transition uses, and sets the event beyond the loop.
- An event stands beside its line in the label style, 8px clear of every line, node and other label. It does not stand in line with its edge, as a flow's edge label does.
- A key above the drawing names the start, the state, the end and the transition whenever the diagram has a start or an end.
- One state at most is emphasised, with a chip of one or two words naming why. It counts toward the section's one `cm-emph` (§6).

| Item | At most | Reason |
| --- | --- | --- |
| Nodes | 24 | The flow ceiling, from the library's panel tier |
| Columns | 4 | Every transition carries its event, so a fifth column does not fit the printed column at 80% |
| Rows | 5 | The flow ceiling, from a printed page |
| Transitions | 12 | The library labels edges only while a view has 12 or fewer, and every transition but the first is named |
| Emphasised states | 1 | §6 |

A state `label` stops at 24 characters, a `detail` at 40, an event at 3 words and `emphasis` at 2 words, as in a flow diagram.

The text version lists every state once, numbered in reading order from the start. Each item names the state and its detail, then each event with where it leads: the state and its number, "stays in" for a self-transition, and "the end". The first state is named as the starting state. An empty `aria-label` takes a summary: the number of states, the first and the last, and the counts of transitions and self-transitions.

#### Entity relationship

An entity relationship diagram shows the records a system keeps, the keys that identify them, and how many of one record relate to each of another. Values over time are a chart.

```html
<div class="cm-diagram" data-diagram="entity-relationship" role="img" aria-label="">
  <script type="application/json">
  {
    "nodes": [
      {"id": "customer", "label": "Customer", "col": 1, "row": 1, "attributes": [
        {"name": "customer_id", "key": "primary"}, {"name": "plan"}]},
      {"id": "ticket", "label": "Ticket", "col": 2, "row": 1, "attributes": [
        {"name": "ticket_id", "key": "primary"}, {"name": "customer_id", "key": "foreign"}, {"name": "status"}]},
      {"id": "message", "label": "Message", "col": 2, "row": 2, "attributes": [
        {"name": "message_id", "key": "primary"}, {"name": "ticket_id", "key": "foreign"}]}
    ],
    "edges": [
      {"from": "customer", "to": "ticket", "fromEnd": "1", "toEnd": "0 or more", "label": "raises"},
      {"from": "ticket", "to": "message", "fromEnd": "1", "toEnd": "1 or more", "label": "holds"}
    ]
  }
  </script>
</div>
```

The JSON holds `nodes` and `edges` only, placed on the grid as in a flow diagram. An entity holds `id`, `label`, `col`, `row` and `attributes`. An attribute holds `name` and an optional `key`. A relationship holds `from`, `to`, `fromEnd` and `toEnd`, with an optional `label`.

| Value | Drawn as | Use |
| --- | --- | --- |
| An entity | Rounded rectangle: its name, a rule, then one attribute a line | A kind of record the system keeps |
| `"key": "primary"` | `PK` tag after the attribute | The attribute that identifies one record |
| `"key": "foreign"` | `FK` tag after the attribute | The attribute that points to another entity's record |
| A relationship | Solid line with no arrowhead | Records of two entities that belong together |
| `fromEnd`, `toEnd` | A count in words beside each end: `1`, `0 or 1`, `1 or more`, `0 or more` | How many records of the entity at that end relate to one record at the other end |

- Every entity names its primary key. An attribute list keeps the keys and the attributes the text discusses, not every column.
- Counts are written in words, not as crow's feet, so a reader needs no notation to read them.
- A count stands beside the entity it counts, below a line across or to the right of a line down. Two counts on one straight line stand at least 24px apart.
- The relationship's `label` names it with a verb, read from `from` to `to`. It stands beside its line, above a run across or to the left of a run down.
- The `from` entity comes first in reading order: in an earlier row, or earlier in the same row. The name then reads left to right or top to bottom.
- One relationship leaves each side of an entity, so an entity takes part in 4 at most. An entity never relates to itself.
- A line runs on to meet the entity at each end, since it carries no arrowhead.
- A key above the drawing names the `PK` and `FK` tags in use, and says that a count tells how many of the entity beside it.
- An entity relationship diagram has no emphasised node.

| Item | At most | Reason |
| --- | --- | --- |
| Entities | 6 | Two columns of three rows |
| Columns | 2 | Two counts beside each line widen every gap, so a third column does not fit the printed column at 80% |
| Rows | 3 | Four rows of six-attribute entities do not fit a printed page at 80% |
| Relationships | 7 | Every neighbouring pair on a grid of 2 columns and 3 rows |
| Attributes in an entity | 6 | Six-attribute entities in 3 rows fill a printed page |

An entity `label` and an attribute `name` stop at 24 characters; a relationship `label` stops at 3 words, as an edge label.

The text version lists every entity in reading order, with its primary keys, foreign keys and other attributes. Every relationship follows as one item: its name, then the count at each end, such as "Ticket per Customer: 0 or more". An empty `aria-label` takes a summary: the number of entities, their names, and the number of relationships.

#### Journey map

A journey map shows what one person does across the phases of an experience, and how each step feels. It is a flow diagram with an `experience` scale and a `level` on every node.

```html
<div class="cm-diagram" data-diagram="flow" role="img" aria-label="">
  <script type="application/json">
  {
    "nodes": [
      {"id": "notice", "type": "step", "label": "Sees two charges", "col": 1, "row": 1, "level": 2},
      {"id": "search", "type": "step", "label": "Searches the FAQ", "detail": "No refund article", "col": 2, "row": 1, "level": 2},
      {"id": "chat", "type": "step", "label": "Opens a chat", "col": 3, "row": 1, "level": 3},
      {"id": "wait", "type": "step", "label": "Waits for billing", "col": 4, "row": 1, "level": 1},
      {"id": "refund", "type": "step", "label": "Gets a refund", "col": 5, "row": 1, "level": 4}
    ],
    "groups": [
      {"type": "phase", "label": "Notice", "col": 1},
      {"type": "phase", "label": "Seek help", "col": 2, "cols": 2},
      {"type": "phase", "label": "Wait", "col": 4},
      {"type": "phase", "label": "Resolve", "col": 5}
    ],
    "experience": ["Frustrated", "Uneasy", "Neutral", "Content", "Pleased"]
  }
  </script>
</div>
```

- `experience` names the scale: 3 to 5 words of 12 characters at most, lowest first.
- Every node carries a `level`, its place on the scale, from 1 for the first word. Without a scale, no node has a level.
- One step stands in each column, so the line reads one step at a time.
- Phases are frames across the top, in the track colour, each over the columns it spans. Together they cover every column once.
- The experience line runs 32px under the steps in the accent colour, 2px: across each step's column at its level, turning in the gap between columns. Levels stand 24px apart.
- Each run carries its word below it in the label style, between its level and the next one down, so no word stands level with another run. The drawing shows the low point by height alone; the text version and the summary name it.
- The key names the line and its whole scale, low to high, so a level no step reaches still has its place.
- Edges are optional. The column order already reads as time.

The flow's capacity holds. Five steps of 24-character labels with phases print at 82%; six do not fit the printed column at 80%.

The text version lists the steps by column. Each item adds the step's phase and "Experience" with its word, and marks the low point. An empty `aria-label` takes a summary: the number of steps and phases, the first and last step, and where the experience is lowest and highest.

#### System and data flow

A system and data flow shows systems, where their data rests and what moves between them. It is a flow diagram that uses data stores, external entities, boundaries and data edges.

```html
<div class="cm-diagram" data-diagram="flow" role="img" aria-label="">
  <script type="application/json">
  {
    "nodes": [
      {"id": "customer", "type": "external", "label": "Customer", "col": 1, "row": 1},
      {"id": "survey", "type": "step", "label": "Survey tool", "detail": "Sends surveys", "col": 1, "row": 2},
      {"id": "responses", "type": "store", "label": "Responses", "col": 1, "row": 3},
      {"id": "load", "type": "step", "label": "Nightly load", "col": 2, "row": 3},
      {"id": "csat", "type": "store", "label": "csat_daily", "col": 3, "row": 3}
    ],
    "edges": [
      {"from": "customer", "to": "survey", "kind": "data", "label": "Answers"},
      {"from": "survey", "to": "responses", "kind": "data"},
      {"from": "responses", "to": "load", "kind": "data", "label": "Export"},
      {"from": "load", "to": "csat", "kind": "data"}
    ],
    "groups": [
      {"type": "boundary", "label": "Survey platform", "col": 1, "row": 2, "rows": 2},
      {"type": "boundary", "label": "Data warehouse", "col": 2, "row": 3, "cols": 2}
    ]
  }
  </script>
</div>
```

- A boundary frames one system around the cells of its steps and stores. Two boundaries never share a cell.
- An external entity stands outside every boundary: a person or system the flow does not own.
- A data store connects only to steps, by data edges. Data reaches a store and leaves it through a step.
- Data edges are dotted and control edges solid. An edge that crosses a boundary carries a label naming what crosses: the data, or the event that passes control.
- A data store is ruled above and below with one 2px line each, not a double line.
- The key names the solid line "Control".

The flow's capacity holds, with its 2 boundaries. Each label in line widens its gap, so a labelled crossing counts in the width as any labelled gap does. The print check fails a diagram that needs less than 80%.

Each item of the text version names the boundaries its node stands within, and marks data edges "(data)". An empty `aria-label` takes a summary: the number of steps, data stores, external entities and boundaries, and the number of data flows and control flows.

#### Layer stack

A layer stack shows the layers of a system, from the one people use at the top to its sources at the base, and what each part depends on. It has a mode of its own, `data-diagram="layer-stack"`.

```html
<div class="cm-diagram" data-diagram="layer-stack" role="img" aria-label="">
  <script type="application/json">
  {
    "layers": [
      {"label": "Reports", "nodes": [{"id": "review", "label": "Quarterly review", "col": 1}]},
      {"label": "Metrics", "nodes": [{"id": "frt", "label": "First response", "col": 1}, {"id": "sla", "label": "SLA attainment", "col": 2}]},
      {"label": "Warehouse", "nodes": [{"id": "tickets", "label": "tickets_fact", "col": 1}]}
    ],
    "edges": [
      {"from": "review", "to": "frt"},
      {"from": "review", "to": "sla"},
      {"from": "frt", "to": "tickets"},
      {"from": "sla", "to": "tickets"}
    ]
  }
  </script>
</div>
```

- The JSON holds `layers` and `edges` only. Layers run from the top down; each holds a `label` and its `nodes`.
- A component holds `id`, `label`, an optional `detail` and `col`. Ids are unique across the stack, and a column holds one component in each layer.
- An edge is a dependency, from the component that depends to the one it depends on. It carries no label.
- A dependency runs down to a lower layer: it leaves the bottom of one component and enters the top of the other.
- A dependency upward or within one layer breaks the stack. The kit leaves it undrawn and warns in the console, and the checks fail the page. The stack is redrawn so the dependency runs down, or the relation moves to a flow diagram.
- Each layer is a frame in the track colour across the drawing's full width, 16px around its components, named on the left in the label style.
- A key above the drawing names the line "Depends on", since the arrows run against the way data moves.

| Item | At most | Reason |
| --- | --- | --- |
| Layers | 5 | The flow's lane ceiling, since layers are lanes of the flow grid. Five layers of four components print at 83%; with a detail line on every component, four layers already run past a printed page at 80% |
| Components in a layer | 4 | Four components of 24-character labels print at 83%; five do not fit the printed column at 80% |

A component `label` stops at 24 characters and a `detail` at 40, as a flow node's; a layer `label` stops at 24, as a lane's. A larger stack splits into an overview of the layers and one stack for each layer that needs detail.

The text version numbers every component from the top layer down, with its layer and the components it depends on, by number. An empty `aria-label` takes a summary: the number of layers, the top and the base, and the number of components and dependencies.

#### Hierarchy

A hierarchy shows how a whole divides into parts, read left to right: an organisation, a set of categories or a breakdown of work. It has a mode of its own, `data-diagram="hierarchy"`.

```html
<div class="cm-diagram" data-diagram="hierarchy" role="img" aria-label="">
  <script type="application/json">
  {
    "nodes": [
      {"id": "all", "label": "All tickets"},
      {"id": "billing", "label": "Billing", "parent": "all"},
      {"id": "refunds", "label": "Refunds", "parent": "billing"},
      {"id": "invoices", "label": "Invoices", "parent": "billing"},
      {"id": "account", "label": "Account", "parent": "all"},
      {"id": "sign-in", "label": "Sign-in", "parent": "account"}
    ]
  }
  </script>
</div>
```

- The JSON holds `nodes` only. A node holds `id`, `label`, an optional `detail` and `parent`.
- One node, the root, has no parent. Every other node names a parent that exists, and no node is its own ancestor.
- The author writes no columns or rows. Children stand top to bottom in the order written, and the ECharts tree layout places them; the kit draws every box and line.
- Each level is a column, left to right, its boxes as wide as its widest node. Every box takes the height of the tallest.
- Siblings stand 16px apart. Groups of siblings stand further apart, as the tree layout spaces them.
- A line runs from a parent's right side along the middle of the gap to each child's left side, 8px clear of both. It meets the spine square and turns into each branch with a rounded elbow, so the branches never close into a point.
- A hierarchy line carries no arrowhead: it means "part of", not a step in a flow.
- The drawing needs ECharts. Without it, the text version stands alone and the drawing is skipped, as a chart is.

| Item | At most | Reason |
| --- | --- | --- |
| Levels | 4 | Four levels of 24-character labels print at full size; five need 82% |
| Leaves, nodes with no children | 12 | Twelve leaves in three groups print at 83%; in four groups they need less than 80% |

Print is the final test here too: twelve leaves in many small groups fail the page check, and the tree splits. A larger tree splits into an overview of the upper levels and one hierarchy for each branch that needs it. A `label` stops at 24 characters and a `detail` at 40, as a flow node's.

The text version is an indented list: every node once, under its parent. An empty `aria-label` takes a summary: the number of items, levels and leaves, and the parts the root divides into.

### 8.21 Sources and citations

The source register lists every source a document rests on, and closes the Notes & sources appendix after the notes. A citation ties a claim to its sources; an evidence date says how current a claim is.

```html
<p>Median first response fell to 2h 14m.<a class="cm-cite" href="#src-1" id="cite-1">S1</a> Card refunds reach customers in 5 to 10 business days.<a class="cm-cite" href="#src-2" id="cite-2">S2</a></p>

<ol class="cm-sources">
  <li id="src-1">
    <span class="cm-id">S1</span>
    <span><b>Helpdesk warehouse, ticket facts</b><br><span class="cm-tag">Dataset</span> Support Operations Analytics · <code>support.tickets_fact</code> <a class="cm-back" href="#cite-1" aria-label="Back to text">↩</a></span>
    <span class="cm-meta">refreshed <time datetime="2026-10-05">2026-10-05</time></span>
  </li>
  <li id="src-2">
    <span class="cm-id">S2</span>
    <span><b>Payment provider merchant guide, settlement times</b><br><span class="cm-tag">Document</span> <!-- cm-omit publisher: The source notes do not name the publisher. --><!-- cm-omit locator: The source notes do not say where the guide is held. --><a class="cm-back" href="#cite-2" aria-label="Back to text">↩</a></span>
    <span class="cm-meta">accessed <time datetime="2026-10-05">2026-10-05</time></span>
  </li>
</ol>
```

- Each entry carries a key, a title, its author or publisher, a type, a locator and a date. A publisher or locator that is not recorded is left out with its omission comment in the entry (§7.5), never guessed. The comment stands where the missing part would, and the ` · ` between publisher and locator goes with it. An entry may leave out both, as S2 above does.
- The key is `S` and a number, in `.cm-id`. The entry's id is `src-` and the same number: `S4` is `src-4`. A source keeps its key in every version, and a new source takes the next unused number. Entries run in key order.
- The type is a tag from a closed set: `Dataset`, `Report`, `Interview`, `Document`, `System export`.
- The locator says where to find the source: its URL as a link, or the system and path in `<code>`. A place named in words, such as a folder in a document library, is the system's name, then the place in `<code>`: policy library, `Refunds`. A database table is `schema.table`: `support.refund_requests`. Printing adds each URL after its link.
- The date is the one the source carries, as an ISO date in `<time datetime>`. A word before it says what it dates, from a closed set:
  - `published`, `refreshed`, `exported`, `recorded` or `accessed`, for what happened on that date;
  - `as of`, for a snapshot whose content held on that date, such as rules in force;
  - `covers`, for a source that carries only the period it covers, given as two dates as in the Period field: `covers <time datetime="2026-09-01">2026-09-01</time> → <time datetime="2026-09-30">2026-09-30</time>`.
- A citation is `a.cm-cite` after punctuation, like a footnote reference. Its text is the source's key; its id is unique, `cite-1`, `cite-2` in order of appearance. A claim with several sources carries one citation for each, side by side.
- A cited entry ends with one back link, `a.cm-back`, to its first citation. Following any citation lands on the entry, and the kit's script points the back link at that citation. An entry no claim cites is listed with no back link.
- A source count never stands in for confidence. The kit has no confidence chip or score; what several sources agree on is stated as a claim, with its citations.

A number is sourced (§1 rule 12) by a citation, or by the source line of the caption under its figure or table. A number the source material gives without its source carries a note (§8.15) saying that no source is recorded for it; no source is guessed. So does a number from a record no reader can find again, such as one person's own tally. It has no source entry; its note names where the number comes from and says that no source is recorded. A KPI strip's numbers are sourced where they reappear in the body (§14 item 4).

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
- Its head carries the date its numbers were true, as an ISO date in `<time datetime>`. For numbers that cover a period, such as a quarter, that date is the period's last day. The first row's value names the period, `6,140 in Q3 2026`, and a row that covers another period names its own.
- Steps, rules and definitions elsewhere name a quantity and leave its value to the block.
- Keys are 1 to 3 words. Values carry their unit, and a count against a total reads `14 of 16`. A result against its target reads `1.1 business days, target 2`; the target itself is a rule, stated where the rules are.
- The rows are one list with no groups, in the order of what they measure: the whole first, then each stage or part. The block is never a table, however many rows it holds.
- A citation sources its row and the rows after it, up to the next citation or note mark. So rows from one source cite it once, on the first. A row after a note mark cites its source again. A row that counts the document's own items, such as milestones done, cites nothing.

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
- A document carries a revision history from its second version. The revision history, then the change log, close the Notes & sources appendix after the sources.

The limitation register:

```html
<ul class="cm-limits">
  <li><span><b>Unstaffed APAC weekends</b><br>APAC first response counts weekend hours, so its median reads 3h 20m against 2h 31m on weekdays.</span><span class="cm-chips"><span class="cm-chip cm-chip--warn">Open</span></span></li>
</ul>
```

- Each limit has a name of a few words, its effect on what the document shows in one sentence, and a status.
- The status is a chip from a closed set: `Open` (`cm-chip--warn`), `By design` (`cm-chip--note`), `Resolved` (`cm-chip--ok`). The word carries the meaning; colour is only the chip's offset. An open limit with a planned fix adds a plain chip with its date: `Fix due 2026-12-14`.
- One or two limits are limitation callouts, where a reader would look for the missing answer (§8.4). Three or more go in the register instead, in Appendix A under A.2.

### 8.23 Procedure

```html
<ol class="cm-procedure">
  <li>
    <h3 class="cm-procedure__title">Record the account and the charge</h3>
    <p>What to do, in one to three sentences.</p>
    <div class="cm-procedure__outcome"><span class="cm-label">Outcome</span><p>The state the step leaves, in one sentence.</p></div>
  </li>
</ol>
```

The steps a reader carries out, in order: a guide's Steps section (§7.3). The CSS numbers the steps 01, 02 in the left gutter. Each step opens with its title, an imperative of 8 words at most, as a heading one level below the section's. Paragraphs and `ul.cm-list` lists say what to do. The step closes with `.cm-procedure__outcome`: the label “Outcome” on a line of its own, then one sentence on the state the step leaves. 3 to 9 steps; a longer task splits into several procedures under h3 stage headings, with the step titles at h4. A procedure never sits inside another.

### 8.24 Related list

```html
<ul class="cm-related">
  <li><span class="cm-tag">Reference</span><a href="Reference%20-%20First%20Response%20Time.html">First response time</a><p>One sentence on how it relates.</p></li>
</ul>
```

Links to other documents of the kit, or to places in them, with how each relates. The tag names what the item is, from a closed set: `Report`, `Guide`, `Reference`, `Metric`, `Dataset`, `System`. A `Dataset` or `System` item is the kit's reference page on it; a policy's page takes `Reference`. A policy, dataset or system with no page in the kit is no item: the text names it and cites it as a source (§8.21). The link text is the item's title. The sentence says what the reader finds there that bears on this document. Guides close with one in Related documents (§7.3); a reference's Relationships section holds one (§7.4). Below 640px the tag stacks above the link.

Each link is an address (§8.31): the document's file name, and a section id after `#` for a place in it. On a set's index page each item closes with a meta line, `span.cm-meta`, holding the document's status and published date. Documents leave the meta line out, since a date copied from another document goes stale.

### 8.25 Workflow

A workflow sets out how work moves between roles or stages, in order: the role that does each stage, what the stage takes in and produces, and the condition that hands the work on. A reader works through it, or looks up one stage.

```html
<div class="cm-card cm-workflow cm-bleed">
  <span class="cm-label cm-card__kicker">Workflow</span>
  <h3 class="cm-card__title">Ticket escalation</h3>
  <p>What starts the work and what ends it, in one sentence.</p>
  <ol class="cm-stages">
    <li>
      <h4 class="cm-procedure__title">Intent triage</h4>
      <p>What happens at this stage, in one sentence.</p>
      <dl class="cm-facts">
        <div><dt>Actor</dt><dd>Routing classifier</dd></div>
        <div><dt>Hands on when</dt><dd>The intent is tagged</dd></div>
      </dl>
    </li>
  </ol>
  <div class="cm-sub">                                       <!-- optional -->
    <span class="cm-label">Exceptions</span>
    <ul class="cm-list"><li>A condition, and where the work goes instead.</li></ul>
  </div>
</div>
```

- Required: the kind label, the title, a lede of one sentence saying what starts the work and what ends it, and `ol.cm-stages` with 3 to 6 stages. The stages take the procedure's numbered list and title (§8.23): the CSS numbers them 01, 02 in the left gutter, and each opens with `.cm-procedure__title`.
- Each stage holds its title, one sentence on what happens (20 words at most) and its facts. The title is a heading one level below the card title, a noun phrase of 4 words at most (§13.3). `Actor` names the role that does the stage. `Hands on when` gives the condition that passes the work on, on every stage but the last; a branch names the stage it leads to. `Takes in` and `Produces` are optional. These four keys are the whole set.
- Optional: an `Exceptions` part with 1 to 3 items, each a condition and where the work goes instead.
- A procedure (§8.23) is the steps one reader carries out in a guide; a workflow is how work moves between roles or stages. A stage closes with who acts and what hands the work on, where a step closes with its outcome.
- The process diagram (§8.13) sets three to six steps across the page, a line each, with no actors or conditions. It is the overview at a glance; a workflow is the reference a reader works from. A document can carry both, the diagram first, with the same stage names in the same order.
- The flow diagram (§8.20) is the picture of a flow, with lanes, branches and loops drawn as nodes and edges. A workflow is text: it reads in order, prints whole and reflows on a phone with no sideways scroll. Draw the flow when the branches or the hand-offs between lanes are the point; write the workflow when the reader acts on each stage. Shown together, both use the same stage names, matched node for stage as a process page sets out (§7.11).
- A method (§8.28) is one role's technique, ending in a decision; a workflow passes work between roles. A timeline (§8.12) holds dated events; a workflow has no dates.

### 8.26 Framework

A framework names the parts that together cover a subject, such as the pillars of a quality review or the layers of a platform, and says what each part covers.

```html
<div class="cm-card cm-framework cm-bleed">
  <span class="cm-label cm-card__kicker">Framework</span>
  <h3 class="cm-card__title">Support quality pillars</h3>
  <p>What the framework covers and how its parts relate, in one sentence.</p>
  <ul class="cm-parts">                                        <!-- ol.cm-parts for layers, top first -->
    <li class="cm-tile"><p class="cm-t5">Speed</p><p>What this part covers, in one sentence.</p></li>
  </ul>
  <div class="cm-scope">                                       <!-- optional -->
    <div><span class="cm-label">Use when</span><ul class="cm-list"><li>A case the framework fits.</li></ul></div>
    <div><span class="cm-label">Not for</span><ul class="cm-list"><li>A case it does not fit, and what covers it.</li></ul></div>
  </div>
</div>
```

- Required: the kind label, the title, a lede of one sentence saying what the framework covers and how its parts relate, and `cm-parts` with 3 to 6 parts. Parts with an order, such as layers, go in `ol.cm-parts`, top first, and the lede says what the order means.
- Optional: the scope, `Use when` and `Not for`.
- When every part carries the same attributes and the reader compares the parts across them, such as a goal, a signal and a metric for each, the parts are rows of a table (§8.11). The framework names the parts and what each covers; a table compares them. A page can carry both, the framework first.
- Parts that happen one after another are a process (§8.13) or a workflow (§8.25), not a framework.
- A model (§8.27) claims how its parts relate and states when the claim breaks. A framework organises a subject and claims nothing to test.

### 8.27 Model

A model is a named abstraction a reader carries away and applies: a claim about how its parts relate, the parts, and the conditions under which the claim holds and breaks. The breaking condition is what separates a model from a diagram with a name on it.

```html
<div class="cm-card cm-model cm-bleed">
  <span class="cm-label cm-card__kicker">Model</span>
  <h3 class="cm-card__title">Ticket placement model</h3>
  <p class="cm-t5">The claim, in one sentence.</p>
  <ul class="cm-parts">
    <li class="cm-tile"><p class="cm-t5">Product depth</p><p>What this part is, in one sentence.</p></li>
  </ul>
  <ol class="cm-parts cm-parts--matrix">                       <!-- optional; exactly four cells -->
    <li class="cm-tile"><span class="cm-label">Shallow · no access</span><p class="cm-t5">Tier 1</p><p>What sits here, in one sentence.</p></li>
  </ol>
  <div class="cm-scope">
    <div><span class="cm-label">Holds when</span><ul class="cm-list"><li>A condition the claim needs.</li></ul></div>
    <div><span class="cm-label">Breaks when</span><ul class="cm-list"><li>A case where the claim fails, and what to do.</li></ul></div>
  </div>
</div>
```

- Required: the kind label, the title, the claim, `ul.cm-parts` with 2 to 5 parts, and the scope with both `Holds when` and `Breaks when`. The claim is one sentence of 30 words at most, on a line of its own in `p.cm-t5`, as a key finding's claim (§8.3).
- Optional: one paragraph after the claim, of 2 sentences at most; a caption source line when the model rests on data.
- Optional schematic: a model that sorts things by two factors adds `ol.cm-parts.cm-parts--matrix`, exactly four cells in reading order (top left, top right, bottom left, bottom right). Each cell opens with a position label naming its place on both factors, so the grid reads the same stacked on a phone. The model's parts name the two factors. Any other schematic is a figure after the block (§8.10, §8.20).
- A framework (§8.26) organises a subject; a model makes a claim and says when it breaks. A definition (§8.5) explains one term; a model explains how several relate.

### 8.28 Method

A method is a repeatable technique: what it achieves, when to use it, its steps and the decision it ends in.

```html
<div class="cm-card cm-method cm-bleed">
  <span class="cm-label cm-card__kicker">Method</span>
  <h3 class="cm-card__title">SLA breach review</h3>
  <p>What the method achieves, in one sentence.</p>
  <dl class="cm-facts"><div><dt>Run by</dt><dd>Team lead</dd></div></dl>   <!-- optional -->
  <div class="cm-scope">
    <div><span class="cm-label">Use when</span><ul class="cm-list"><li>The situation that calls for it.</li></ul></div>
    <div><span class="cm-label">Not for</span><ul class="cm-list"><li>A case it does not fit.</li></ul></div>   <!-- optional -->
  </div>
  <div class="cm-sub"><span class="cm-label">Steps</span><ol class="cm-olist"><li>One instruction.</li></ol></div>
  <div class="cm-sub"><span class="cm-label">Decision</span><p>The criterion, and what follows each outcome.</p></div>
</div>
```

- Required: the kind label, the title, the objective as a lede of one sentence, the scope with `Use when`, a `Steps` part and a `Decision` part.
- Steps: 3 to 7, each one instruction in one sentence of 20 words at most, in `ol.cm-olist`.
- Decision: one paragraph of 1 or 2 sentences that states the criterion as a condition, never a question, and what follows each outcome.
- Optional: `Not for` in the scope; facts such as who runs it, what it needs and how often.
- A workflow (§8.25) passes work between roles; a method is one role's technique. A guide's steps, each with its outcome, are a procedure (§8.23). A list of steps with no decision at the end is an ordered list (§8.14). An action taken once, with an owner and a date, is a recommendation (§8.19).

### 8.29 Requirement and evaluation

Two blocks that end in a verdict: a requirement on a rule, an evaluation on a choice.

A requirement states a rule, why it exists, and how a reviewer checks it.

```html
<div class="cm-card cm-req cm-bleed" id="req-04">
  <span class="cm-label cm-card__kicker">Requirement REQ-04</span>
  <h3 class="cm-card__title">Owned macros</h3>
  <p class="cm-t5">The rule, in one sentence.</p>
  <p>Why the rule exists, in one or two sentences.</p>
  <dl class="cm-facts">
    <div><dt>Level</dt><dd><span class="cm-chip">Required</span></dd></div>
    <div><dt>Status</dt><dd><span class="cm-chip cm-chip--ok">Final</span></dd></div>
    <div><dt>Owner</dt><dd>Support Tooling</dd></div>
  </dl>
  <div class="cm-sub"><span class="cm-label">Acceptance criteria</span><ol class="cm-olist"><li>A condition a reviewer marks true or false.</li></ol></div>
</div>
```

- The kind label carries the requirement's key: capital letters, a hyphen and two or more digits (`REQ-04`). The card's `id` is the key in lower case (`req-04`), so other blocks link to it.
- Required: the title, naming the rule as a noun phrase; the statement, one sentence of 30 words at most in `p.cm-t5`; the rationale, one or two sentences; facts with `Level`, `Status` and `Owner`; and an `Acceptance criteria` part with 1 to 5 criteria, one sentence each.
- Level is a chip: `Required` plain, `Recommended` or `Optional` dashed. Status is a chip from the masthead's set: `Draft` plain, `In review` (`cm-chip--warn`), `Final` (`cm-chip--ok`).
- Optional facts: `Evidence` (a link or a citation) and `Applies to`.
- Criteria carry no met or unmet marks. Whether a criterion is met changes over time, so a result goes in the status block (§8.22) or an evaluation.
- The requirement callout (§8.4) states a rule in passing, where it applies, in one or two sentences, and may end with the key of its requirement block. The block is the rule's record, once per rule, in a reference document or an appendix.

An evaluation scores one subject against weighted criteria and ends in a verdict.

```html
<div class="cm-card cm-eval cm-bleed">
  <span class="cm-label cm-card__kicker">Evaluation</span>
  <h3 class="cm-card__title">APAC weekend coverage pilot</h3>
  <p>What was scored, against what, on what scale, in one sentence.</p>
  <ol class="cm-criteria">
    <li><span class="cm-criteria__score">5 of 5</span><span><b>Monday first response</b><br>The evidence, in one sentence.</span><span class="cm-meta">weight 3</span></li>
  </ol>
  <div class="cm-eval__result">
    <span class="cm-label">Weighted score</span>
    <span class="cm-figure-s">3.9 of 5</span>
    <span class="cm-chip cm-chip--ok">Adopt</span>
  </div>
  <p>What the verdict commits to, in one or two sentences.</p>
  <span class="cm-caption"><span class="cm-caption__line">Source: who scored it, and when.</span></span>
</div>
```

- Required: the kind label, the title naming the subject, a lede of one sentence, `ol.cm-criteria` with 2 to 6 criteria, the result, a paragraph of 1 or 2 sentences on what the verdict commits to, and a caption with a source line.
- Each criterion holds a score (`N of M`, the same scale for every criterion), a name of 4 words at most in `<b>`, one sentence of evidence and a whole-number weight (`weight 3`).
- The result is labelled `Weighted score`. Its value is the sum of each score times its weight, over the sum of the weights, to one decimal, on the criteria's scale.
- The verdict is one status chip: `Adopt` (`cm-chip--ok`), `Hold` (`cm-chip--warn`) or `Reject` (`cm-chip--crit`). The solid verdict chip stays with tables and figures (§1 rule 7).
- No confidence chip or score (§8.21).
- A comparison table (§8.11) sets several options across the same dimensions, the recommended column marked ★. An evaluation scores one subject. Several options scored on weighted criteria go in a table: a column for each option, weighted totals in `<tfoot>`, ★ on the recommended.

### 8.30 Metric detail

A metric detail is the reference entry for one measure: what it counts, its formula, unit and direction, its target and thresholds, its source and its owner.

```html
<div class="cm-card cm-metric cm-bleed" id="metric-sla">
  <span class="cm-label cm-card__kicker">Metric</span>
  <h3 class="cm-card__title">Resolved within SLA</h3>
  <p>What the metric counts and how, as a definition (§8.5).</p>
  <div class="cm-props">
    <dl>
      <dt>Formula</dt><dd><code>100 × resolved_in_sla / resolved_total</code></dd>
      <dt>Unit</dt><dd>Percent of resolved tickets</dd>
      <dt>Direction</dt><dd>Higher is better</dd>
    </dl>
    <dl>
      <dt>Source</dt><dd>Helpdesk warehouse, ticket facts<a class="cm-cite" href="#src-1" id="cite-5">S1</a></dd>
      <dt>Owner</dt><dd>Support Operations Analytics</dd>
    </dl>
  </div>
  <div class="cm-sub">                                       <!-- optional -->
    <span class="cm-label">Thresholds</span>
    <ul class="cm-bands">
      <li><span><b>95% or more</b><br>The response, in one sentence.</span><span class="cm-chips"><span class="cm-chip cm-chip--ok">On track</span></span></li>
    </ul>
  </div>
  <div class="cm-sub">                                       <!-- optional -->
    <span class="cm-label">Related metrics</span>
    <ul class="cm-related"><li><span class="cm-tag">Metric</span><a href="Reference%20-%20First%20Response%20Time.html">First response time</a><p>How it relates, in one sentence.</p></li></ul>
  </div>
</div>
```

- Required: the kind label; the title, the metric's name as KPI labels and tables give it; the definition, 15 to 60 words on what the metric counts and how; and a property sheet (§8.7) with `Formula` (in `<code>`), `Unit`, `Direction`, `Source` (cited, §8.21) and `Owner`.
- Direction reads `Higher is better`, `Lower is better` or `Nearer the target is better`. Optional keys include `Target`, `Grain`, `Cadence`, `Aliases` and `Excludes`.
- Optional `Thresholds`: `ul.cm-bands` with 2 to 4 bands, best first. Each band gives its range in `<b>`, the response in one sentence, and one status chip: `On track` (`cm-chip--ok`), `At risk` (`cm-chip--warn`) or `Breach` (`cm-chip--crit`).
- Optional `Related metrics`: a related list (§8.24) of 1 to 4 items, each tagged `Metric`, linking to where the metric is defined or reported, with one sentence on how it relates.
- It carries no current value. A value changes, and a definition holds no number that will change (§13.2). The current value goes in the KPI strip (§8.2) of a report, or the status block (§8.22) of a reference document, under the same name.
- The KPI strip (§8.2) gives the value for a period, its change and its target; the metric detail defines what that value means.
- A property sheet (§8.7) holds facts about any one thing; the metric detail holds one, with the keys a metric needs. A definition (§8.5) explains a term in a sentence or two; a metric detail is for a measure the page reports or judges against thresholds. A known limit of the metric is a limitation callout after the block (§8.4).

### 8.31 Document sets

A document set is the documents in one folder, with an index page that lists them. An area is a subject within the set, such as billing; it groups documents of every kind. Addresses, the breadcrumb and the index page tie a set together, and a check over the folder keeps its links whole.

#### Address

Every document names itself in `<head>`, straight after `cm-kind`:

```html
<meta name="cm-kind" content="guide">
<meta name="cm-id" content="guide-billing-escalation">
```

- The file name is the kind, a spaced hyphen, and a short title of two to five words in title case: `Guide - Billing Escalation.html`.
- The id is the file name without `.html`, in lowercase, with a hyphen for each run of spaces and punctuation. The index page's id is `index`.
- File name and id are set when the document is first published and never change. No two documents in a set share an id.
- The documents of a set sit side by side in one folder, so a link between them carries no path. A link to another document is its file name, with each space written `%20` and each `&` written `%26`.
- A link to a place in another document adds `#` and a section id: `Guide%20-%20Billing%20Escalation.html#steps`. Links between documents name sections only. Ids inside a section, such as those of figures, tables, notes and citations, can change between versions.
- A section id never changes once the document is published: the part ids of a guide and a reference are fixed (§7.3, §7.4), and a report's are stable (§7.1).

#### Breadcrumb

The breadcrumb runs from the set to the area to the document. Each step links to its page where one exists.

```html
<nav class="cm-crumbs" aria-label="Breadcrumb">
  <a href="index.html">Support operations</a><span class="sep" aria-hidden="true">/</span>
  <a href="index.html#billing">Billing</a><span class="sep" aria-hidden="true">/</span>
  <span aria-current="page">Billing escalation</span>
</nav>
```

- The set step names the set and links to the index page, `index.html`. Every document in a set names the same set.
- The area step names the area and links to its section on the index page: `index.html#` and the area id, the area name in lowercase with hyphens. Documents on one subject share an area.
- The last step is the document's short title, a `span` with `aria-current="page"`. No step links to the page it sits on.
- A document outside a set writes its set and area steps as `span` elements, since neither has a page to link to. The set step names the document set the source files the document in. The knowledge index as a whole is not a set, and an area is not one either. When the source names no set, the set step and the separator after it are left out with the `set` omission comment (§7.5):

```html
<nav class="cm-crumbs" aria-label="Breadcrumb">
  <!-- cm-omit set: The source names no document set. -->
  <span>Billing</span><span class="sep" aria-hidden="true">/</span>
  <span aria-current="page">Refund request handling</span>
</nav>
```
- In a set, the top bar's wordmark links to `index.html` as well, so the index is one step away from any point in a document. Outside a set, and on the index page, it links to `#top`.

#### Index page

The index page, `index.html`, lists every document in the set by area, with one index entry each. A script writes it from the documents, and it is never edited by hand:

```
npm run index -- <folder>
```

```html
<ul class="cm-related">
  <li><span class="cm-tag">Guide</span><a href="Guide%20-%20Billing%20Escalation.html">Billing ticket escalation to specialists</a><p>How a Tier 1 agent hands a billing ticket to the billing specialists and follows it to resolution.</p><span class="cm-meta">Final · published <time datetime="2026-10-19">2026-10-19</time></span></li>
</ul>
```

- The script reads each document's kind, id, title, dek, status, published date and breadcrumb. When one lacks any of these, or two documents share an id, it lists the problems and writes nothing.
- The page carries the kind `index`. Its masthead holds the set as its one breadcrumb step and its title, a dek, and three fields: Status (the type chip `Index`), Documents and Updated. Updated is the newest published date among the documents.
- The index page has no byline and no Notes & sources: its entries are the documents themselves. Its footer holds the set's name, the document count and Updated date, the publisher and the kit.
- Each area is a section, A to Z, numbered `Part 01` onwards, with the area name as its title and the area id as its id. It holds one related list (§8.24) and nothing else. The contents rail lists the areas.
- Each index entry is a related-list item: the kind as its tag, the title as its link, the dek as its sentence, and a meta line with the status and published date.
- Within an area, reports come first, newest first; then guides, then references, each A to Z by title.
- The index quotes each dek, so a set's deks keep the index page within §13.1: 150 words for an area, and 18 words a sentence on average. A dek of 18 words or fewer meets both. Past either limit, the script names the deks to shorten or the area to split.

#### Link check

```
npm run links -- <folder>
```

Run on a set's folder after the index page is rewritten. It fails when:

- a page lacks its id, or two pages share one;
- a document's breadcrumb or wordmark does not link to the index page and the document's area;
- a link points at a file that does not exist, or at an id its target lacks;
- a link to another page names an id that is not a section's;
- `index.html` differs from what the script writes from the documents as they stand.

The link rules cover every page in the folder, the gallery among them; only kit pages carry an id and a breadcrumb. Links to other sites are not followed. The page checks (§14) run on each page as before, the index page among them.

The kit has no search, faceted browse or version selector, since each needs a server. In a set, the index page and the breadcrumb lead to a document, and the change log and revision history say what changed in it (§8.22).

## 9. Charts

**Method:** ECharts 5.5.1, SVG renderer, option JSON inside `<script type="application/json">` within `.cm-chart[data-chart]`. Agents **MUST NOT** call `echarts.init` or write chart JavaScript. The JSON **MUST** be valid JSON (double quotes, no comments, no functions, no trailing commas). Chart types that ECharts cannot draw from JSON alone are declared with a `"cm"` key (**Kit declarations** below).

**Applied automatically — do not set these:** fonts, text colors, axis lines, gridlines, tick removal, legend look and placement, axis-title placement, plot top/bottom padding (worked out from the legend, axis titles, reference-line labels and a heatmap's scale bar), tooltip look, series palette, bar width (≤ 16px) and rounding, stacked-segment gaps, line width 2.5, hidden symbols, area opacity 0.18, markLine/markArea styling, label styling, spacing of end labels that would touch, heatmap ramp, animation timing, renderer, and everything a kit declaration draws.

**Anatomy (MUST, in this order):**

| Part | Where | Rule |
| --- | --- | --- |
| Kind and number | `.cm-figure__kind` | “Figure N”, sequential across the report |
| Title | `.cm-figure__title` | What is shown, ≤ 10 words |
| Description | `.cm-figure__desc` | Measure, unit, scope and period |
| Legend | automatic | Shown for 2+ series, top left, series order; one series has none. A line chart whose every line carries an end label naming it (`"formatter": "{a}"` or the series name) has no legend, and neither has a slope chart: the labels name the lines where they are. Value labels, and end labels that do not name their line, sit alongside the legend. The JSON sets no `legend` |
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
- Slope lines are ink. Lines picked out take `"color": "$c1"` (up to four, `$c1` to `$c4`). The kit then draws every other line in `$context`, so no colour is set for them. The labels at both ends carry every value.
- Bullet bands are grey steps, darkest first: `$field`, `$hairline`, `$track`. An interval band takes its line's colour at the area opacity, 0.18.

**Recipes by question.** Pick the chart by the question the reader brings to it. Each recipe gives the chart, when it fits, the data it needs, the annotation it usually wants and the mistake to avoid. Types marked `cm` are kit declarations (below).

*Comparison: how categories differ on one measure.*

| Chart | Use when | Data | Annotation | Common mistake |
| --- | --- | --- | --- | --- |
| `bar` | A few to a dozen categories on one measure | One value per category. Horizontal (`yAxis.type: "category"`) when labels are long or ranked, largest at top (data listed smallest first) | Value labels on every bar up to 12; a target as a `markLine` | A value axis that does not start at zero |
| Bullet: `bar` + `cm` | Each measure against its target, with optional bands that grade it | A value and a target per measure, all in one unit | Target mark, values and band names, all drawn by the kit | Measures in different units on one axis |
| `heatmap` | A magnitude across two categories at once, such as weekday by hour | One value per cell; `visualMap` with min/max and `text` end labels; `"yAxis": {"inverse": true}` | The scale bar's end labels | More rows than fit at about 40px each |

*Change: how a measure moves over time.*

| Chart | Use when | Data | Annotation | Common mistake |
| --- | --- | --- | --- | --- |
| `line` | A measure over many periods | One value per period; category x-axis with `"boundaryGap": false`; y may start above zero | Events as vertical `markLine`; end labels naming each line | More than four coloured lines |
| Area: `line` + `"areaStyle": {}` | One level over time, where the total matters | One series; y starts at zero | A threshold as `markLine` | Two series as areas, which hide each other |
| Slope: `line` + `cm` | Two points in time per category, where the change matters more than the path | Two values per line, as numbers; two categories on the x-axis | Labels at both ends, drawn by the kit; lines picked out in `$c1`; a target as a `markLine` whose label gives its value, since a slope has no value axis labels | Three or more periods, which a line chart shows better |

*Distribution: how values spread within each group.*

| Chart | Use when | Data | Annotation | Common mistake |
| --- | --- | --- | --- | --- |
| Strip: `scatter` + `cm` | Each value matters, up to a few hundred per category | Every value, per category | Count and median, drawn by the kit | An average alone, which hides the spread and the outliers |
| Box: `boxplot` + `cm` | Many values per category, or only their summaries | Every value per category, or five numbers and a count per category | Count, drawn by the kit | A box over a handful of values, where a strip shows each one |

*Uncertainty: how sure an estimate is.*

| Chart | Use when | Data | Annotation | Common mistake |
| --- | --- | --- | --- | --- |
| Interval band: `line` + `cm` | An estimate or forecast over time | A low and a high per point, and the interval's name | The interval's name in the legend, drawn by the kit | A band without a name, which a reader cannot weigh |
| Error bars: `bar` or `scatter` + `cm` | Estimates per category, such as survey results | A low and a high per bar or point, and the interval's name | As for the band | Error bars on stacked bars, whose segments carry no estimate of their own |

*Composition: how a whole divides into parts.*

| Chart | Use when | Data | Annotation | Common mistake |
| --- | --- | --- | --- | --- |
| Stacked `bar` | Parts of a whole over time or across categories | Up to 4 parts, `"stack": "name"`; do not set radius or width | Value axis in percent when the shares matter | More than four parts |
| Donut: `pie` with `"radius": ["44%","66%"]` | One whole in up to four parts, when the total matters | Up to 4 slices | Labels with name and value, which act as the legend | Two donuts side by side, where a stacked bar compares better |

*Relationship: how two measures move together.*

| Chart | Use when | Data | Annotation | Common mistake |
| --- | --- | --- | --- | --- |
| `scatter` | Two measures per item, such as teams or accounts | A pair of values per item; name both axes with units | The picked-out point in `$c1` with a label | Reading a correlation as a cause |

**MUST NOT:** 3D, gradient fills, dual y-axes, radar, gauge, word clouds, more than one chart per figure, bars or areas that do not start at zero, a `barWidth` above 16.

An interval band and a box mark a range, not a level, so the zero rule does not apply to them; a bullet's bar is a bar and starts at zero.

**Annotations:**
- Target or threshold: `"markLine": {"data": [{"yAxis": 95, "label": {"formatter": "Target 95%", "position": "insideStartTop"}}]}` (use `xAxis` for vertical lines and horizontal bars, `position: "end"`).
- Event: vertical markLine on the category (`{"xAxis": "Wk 7"}`) with a 1–3 word label.
- Period band: `"markArea": {"data": [[{"xAxis": "Wk 6"}, {"xAxis": "Wk 8"}]]}`.
- Direct labels: `"endLabel": {"show": true, "formatter": "{a}"}` names a line at its end (add `"grid": {"right": 64}`, more for long names); when every line carries one, the legend is left out. `"label": {"show": true, "position": "right", "formatter": "{c}%"}` on bars. The kit sets every value label, on a series or on a single point, in ink on the surface colour, and draws a series above its reference lines, so a line never runs through a number. End labels that would touch move apart.
- Value labels: the kit writes `{c}` with thousands separators and at the chart's precision, the most decimal places any value in its series carries. So `94.0` beside `96.1` reads `94.0`, and `13240` reads `13,240`. The ends of a slope and a bullet's values follow the same rule. Values stay numbers in the JSON, never strings.

**Kit declarations.** Option JSON carries no functions, so four chart types are declared with a `"cm"` key and built by the kit's script at every draw, from the current tokens: theme, print and dark mode work as for any chart. The rest of the JSON stays ordinary ECharts, with its axes, series names, axis titles and annotations, and every rule above applies to it. `chart` names the type.

| Declaration | Where | Fields | What the kit draws |
| --- | --- | --- | --- |
| `{"chart": "slope"}` | Top level of a line chart | None | Each line's two points, with a label at both ends giving its name and value; no legend, no y-axis labels or gridlines |
| `{"chart": "bullet", …}` | On a `bar` series, categories on the y-axis | `target`: one number, or one per bar. `bands` (optional): 1 to 3 `{"to": 90, "name": "Breach"}`, from the axis start; the last runs to the axis end and needs no `to` | A grey track per bar, stepped by band; the bar 8px thick on it; the target as a 2px ink mark across it; each value at the end of its row; band names above the top row; a legend naming the bar and the target |
| `{"chart": "strip", "values": […]}` | On a `scatter` series on a category axis | `values`: every value, one list per category | Each value as a hollow dot, spread across its row; the median as an ink mark; the count under each category name |
| `{"chart": "box", …}` | On a `boxplot` series | `values` as for a strip; or, from summaries, `[low, q1, median, q3, high]` per category in `data` and the counts in `n` | Quartiles by linear interpolation; whiskers to the furthest values within 1.5 times the interquartile range; values past them as hollow dots named "Outliers"; the count under each category name |
| `{"chart": "interval", …}` | On a `line`, `bar` or `scatter` series | `name`: the interval's level or kind ("90% interval", "95% confidence interval", "Interquartile range"). `low`, `high`: one number per point | Around a line, a band in its colour; on bars and points, 1.5px ink error bars with 8px caps, and each value label past its error bar; the name in the legend |

- A bullet is horizontal, and its measures share one unit and one value axis, which starts at zero. Measures in different units go in figures of their own.
- A chart holds one distribution series, so each category has one count.
- The value axis's formatter (`"{value}%"`) writes the values a declaration labels: a slope's ends, a bullet's values and its target. A bar's own `label.formatter` wins for a bullet.

Slope:

```json
{
  "cm": {"chart": "slope"},
  "xAxis": {"type": "category", "data": ["Q2 2026", "Q3 2026"]},
  "yAxis": {"type": "value", "axisLabel": {"formatter": "{value}%"}},
  "series": [
    {"name": "Chat", "type": "line", "data": [94.0, 96.1]},
    {"name": "Email", "type": "line", "data": [86.1, 88.3], "color": "$c1"},
    {"name": "Web form", "type": "line", "data": [87.5, 86.9]}
  ]
}
```

Bullet:

```json
{
  "xAxis": {"type": "value", "min": 0, "max": 100, "axisLabel": {"formatter": "{value}%"}},
  "yAxis": {"type": "category", "data": ["Billing specialists", "Tier 1 · APAC", "Tier 1 · Americas"]},
  "series": [{"name": "Within SLA", "type": "bar", "data": [82.6, 87.4, 94.6],
    "cm": {"chart": "bullet", "target": 95,
           "bands": [{"to": 85, "name": "Breach"}, {"to": 92, "name": "At risk"}, {"name": "On track"}]}}]
}
```

Strip (for a box, the same with `"type": "boxplot"` and `"chart": "box"`):

```json
{
  "xAxis": {"type": "value", "name": "First response, hours"},
  "yAxis": {"type": "category", "data": ["Chat", "Email"]},
  "series": [{"name": "Tickets", "type": "scatter",
    "cm": {"chart": "strip", "values": [[0.2, 0.4, 0.3, 0.6], [2.1, 3.5, 4.2, 2.8, 5.1]]}}]
}
```

Box from summaries:

```json
{
  "xAxis": {"type": "value", "name": "First response, hours"},
  "yAxis": {"type": "category", "data": ["Chat", "Email"]},
  "series": [{"name": "First response", "type": "boxplot",
    "data": [[0.1, 0.3, 0.5, 0.8, 1.4], [1.2, 2.6, 3.4, 4.6, 7.9]],
    "cm": {"chart": "box", "n": [4120, 6380]}}]
}
```

Interval (a band on a line; on a `bar` or `scatter` series the same fields draw error bars):

```json
{
  "xAxis": {"type": "category", "boundaryGap": false, "data": ["Oct", "Nov", "Dec"]},
  "yAxis": {"type": "value", "name": "Tickets per week", "min": 3000},
  "series": [{"name": "Forecast", "type": "line", "data": [3650, 3720, 3900],
    "cm": {"chart": "interval", "name": "80% interval", "low": [3600, 3600, 3700], "high": [3700, 3850, 4120]}}]
}
```

**Formatting:** axis label formatters as template strings only (`"{value}%"`). Category labels short (`Wk 1`, `Jul`, `Mon`). Thin crowded axes with `"axisLabel": {"interval": 2}`.

**Accessibility:** every `.cm-chart` **MUST** have `role="img"` and an `aria-label` stating the chart type and the finding with key values. The prose above the figure states the same finding.

## 10. Motion

Only charts move; diagrams draw static. Each chart draws in once when 15% of it enters the viewport (900ms, ease-out, 120ms stagger between series). Theme switches redraw without animation. `prefers-reduced-motion`, print, background tabs and headless rendering draw static. Agents **MUST NOT** add other animation.

## 11. Dark mode

Automatic from tokens; agents write nothing extra. The pre-paint script in `<head>` applies the reader's stored choice or system setting before first paint; `[data-cm-theme-toggle]` switches and persists (`localStorage["cm-theme"]`). To force a theme for a specific artifact, set `<html data-theme="light">` and remove the pre-paint script.

## 12. Print and PDF

- Browser print (the browser's own command, or the optional print button): always light; chrome hidden; 16 × 14mm margins; shadows become 1px borders; the L2 card keeps its offset; appendices and exercise answers open; charts redraw static at print width; figures, KPIs, callouts, definitions and table rows never split.
- Mark side-by-side figure grids `cm-print-stack` so they print full width.
- Diagrams redraw with narrower gaps and nodes, scaled to fit the 638px printed column and a page, never below 80%, with their text set larger so it prints at its own size; their text versions print open (§8.20).
- Tables print without scrolling: 12px gutters, heads that wrap (§8.11).
- No text prints under 11px after scaling (§4).
- Use `cm-section--break` to start a section on a new page (typically the first appendix in long reports).
- **Headless pipelines** (Puppeteer, Playwright, wkhtmltopdf): set `<html data-cm-static>` or call `CM.drawAll()` after load, then `CM.beforePrint()` before generating the PDF. Wait for `document.fonts.ready`.

## 13. Writing rules

Prose is the running text of `<main>`: paragraphs, list items, definitions, questions and answers, callout bodies, captions and process-step bodies. Code, tables, chart and diagram data and screen-reader-only text are not prose. Words are counted as in §7.1; inline code counts as one word, and a template placeholder (`{{ … }}`) as none.

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

Prose between headings is counted from one heading to the next. Headings are `h1` to `h6`, figure titles among them, and table titles (§13.3).

A section's lede is the paragraph that opens its body. In a section with a TL;DR, the TL;DR stands in for the lede. It keeps its own limit of 40 words (§8.1) and carries no bold phrase; its label marks it. A definition, a question and an answer are each measured as a paragraph.

Components set limits of their own. Where a component limit and a limit above both apply, both hold.

| Element | Limit | Section |
| --- | --- | --- |
| Title | 4 to 10 words (a reference: 1 to 10); the masthead wraps it at 22 characters a line | §7.1 |
| Dek | One sentence | §7.1 |
| Executive summary lede | 2 to 4 sentences | §7.2 |
| Guide purpose, reference definition | One paragraph, the section's lede, so 45 words at most | §7.3, §7.4 |
| TL;DR | One or two sentences, 40 words at most | §8.1 |
| Key finding | A claim line of one full sentence, then its evidence | §8.3 |
| Definition | 15 to 60 words | §8.5 |
| Answer | 1 to 3 sentences | §8.6 |
| Property key | 1 to 3 words | §8.7 |
| Process step title | 3 words at most | §8.13 |
| Procedure | 3 to 9 steps | §8.23 |
| Procedure step title | 8 words at most | §8.23 |
| Procedure outcome | One sentence | §8.23 |
| Related list item | One sentence after the link | §8.24 |
| Figure title | 10 words at most | §9 |
| Chart annotation | 1 to 3 words | §9 |
| Diagram node label | 24 characters at most | §8.20 |
| Diagram edge label | 1 to 3 words | §8.20 |
| Structured component lede | One sentence, 30 words at most | §8.25 to §8.29 |
| Fact key; fact value | 1 to 3 words; a phrase of 12 words at most | §8 |
| Part name; part description | 3 words at most; one sentence of 25 words at most | §8 |
| Scope item | One sentence | §8 |
| Workflow stage title; stage body | 4 words at most; one sentence of 20 words at most | §8.25 |
| Model claim; requirement statement | One sentence, 30 words at most | §8.27, §8.29 |
| Method step; method decision | One sentence of 20 words at most; 1 or 2 sentences | §8.28 |
| Acceptance criterion; requirement rationale | One sentence; 1 or 2 sentences | §8.29 |
| Evaluation criterion | A name of 4 words at most, then one sentence of evidence | §8.29 |
| Metric definition | 15 to 60 words | §8.30 |
| Threshold response | One sentence | §8.30 |
| Topic subtopic | An h3, a paragraph, then a related list | §7.7 |
| Glossary terms | 5 or more, each a definition of 15 to 60 words | §7.8, §8.5 |
| Module objective | One sentence; 2 to 5 per module | §7.9 |
| Framework application; framework limits | 3 to 7 steps; 1 to 4 cases, one h3 each | §7.10 |
| Comparison options; change conditions | 2 to 4 options; 1 to 4 conditions | §7.13 |
| Roadmap goal | One paragraph that opens its section | §7.14 |
| Milestone exit criteria | One sentence, opening “Done when” | §7.14 |

### 13.2 Register

- Plain, factual sentences. State the number, the comparison and the period: “rose 2.3 points to 87.4% against Q2”, not “improved significantly”.
- A sentence that uses a word of change (rose, risen, fell, fallen, grew, grown, dropped, climbed, declined, improved, worsened, increased, decreased, doubled, halved) carries a number. Where the word means something else, as a request is declined, another word takes its place: refused, turned down.
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
- Dates ISO in metadata (`2026-10-12`), readable in prose (`12 August`). Percentage-point changes as `pp`.
- Durations as a number and a letter for each unit, largest first, with no unit skipped between: `2h 14m`, `1m 50s`, `45s`. A chip sets its text in capitals, so a duration in a chip writes its unit as a word: `45 min`.

### 13.3 Headings

Headings are `h1` to `h6` and table titles.

- A heading is the plainest noun phrase that names what sits under it. No articles or framing words, no questions, no verbs unless the section is a procedure, and no adjectives that argue, such as proposed, honest, current, revised or improved.
- Sentence case for all headings and labels; CSS uppercases labels.
- Figure titles describe what is shown; the finding lives in the prose, the TL;DR and `aria-label`.
- Headings never skip a level (§4).

## 14. Pre-publish checklist

The checks this list names, `npm run check` with its type checks and `npm run links`, are tools of the kit's repository and travel in no bundle. A document composed away from the repository meets each item by reading and counting. The checks run when the document returns to the repository, and a failure there sends it back to its author.

1. Started from the template for the document's kind; no class, color, font or inline style outside §1 rule 2.
2. Top bar with the wordmark, one series chip and the theme toggle; a print button only when the document is asked to carry one. Masthead complete with labelled metadata and the type chip for the kind; title ≤ 10 words. A report's period left out of the masthead or the title carries its omission comment (§7.5); a guide or a reference has no period.
3. Report summary: lede, 2 to 4 KPIs with stated comparisons (or the KPI strip's omission comment, §7.5), 3 to 5 findings.
4. Every summary number reappears in the body with its source.
5. Every figure: kind, title, description, legend for 2+ series (or an end label naming every line), value-axis title with unit, `role="img"`, `aria-label`, caption with a source line. Figure numbers sequential.
6. Every table: kind and title, `.num` on numeric columns, `data-value` on formatted cells, source caption; row flags explained.
7. Budgets: in a report, 1 `cm-featured` (none with the Recommendations omission comment, §7.5) and 1 `cm-summary`; in a guide or a reference, neither. ≤ 1 verdict chip per table, ≤ 1 `cm-emph` per section, ≤ 4 colored chart series.
8. Mono only inside code; no colored fills behind labels or chips.
9. No bold label or opening bold phrase runs into its text. Nothing closer than 24px to the next block.
10. Chart JSON parses; colors only via `$tokens`; bars/areas start at zero.
11. Footnotes and citations link both ways; every source has a key, type, locator and date, and the sources list every dataset (§8.21).
12. Contents rail links match section ids; every section has `aria-labelledby`.
13. Opened in light, dark and print preview, and at a 390px phone width, with no console errors. Nothing scrolls sideways but a table, code or a diagram in its own box; no text is cut off or under 11px (§4, §5).
14. Writing within §13: prose inside the limits, in plain words and neutral third person, with no em or en dashes; each section leads with its finding; headings are plain noun phrases in sentence case.
15. Changing numbers sit in one dated status block; change log and revision history run newest first with dated entries; each limitation status is a word from its set (§8.22).
16. `cm-kind` names the kind, or is absent for a report; `cm-type`, when present, names a type of that kind (§7.6). A guide or a reference has its required parts in order, each with its id, or their omission comments (§7.3 to §7.5). Every procedure step closes with its outcome; every related item has a tag, a link and a sentence.
17. Every diagram: JSON within its mode's fields and capacity, a label on every decision branch and every named edge, a terminal at the end of every branch, `role="img"`, a caption with a source line, and nothing overlapping or clipped in light, dark and print (§8.20).
18. Each structured component opens with its kind label and title and holds its required parts within its counts and limits (§8.25 to §8.30).
19. `cm-id` names the document. The breadcrumb runs from set to area to document. In a set, every link names a file and a section id, the index page is rewritten, and `npm run links` passes on the folder (§8.31).
20. A roadmap or a case study has its recipe’s required parts in order, each with its id, and passes its type check (§7.14, §7.15).
21. A topic, a glossary or a module has its recipe's required parts in order, each with its id, and passes its type check (§7.7 to §7.9). A module's answers are closed, and it carries no form controls.
22. A framework, process, metric or comparison page has its recipe's required parts in order, each with its id, and passes its type check (§7.10 to §7.13).

These items are confirmed by counting, with no browser:

| Item | Count | Limit |
| --- | --- | --- |
| 2 | Words in the title; masthead fields; words in `<main>` for the reading time | 4 to 10 words, 1 to 10 for a reference; the fields of §7.1; words ÷ 220, rounded up |
| 3 | KPIs; key findings | 2 to 4; 3 to 5 |
| 7 | `cm-featured`, `cm-summary`, verdict chips, `cm-emph`, coloured chart series | The budgets in the item |
| 14 | Words and sentences in each paragraph, list item, lede and run of prose between headings | §13.1 |
| 16 | Required parts, in order, with their ids or omission comments | §7.3 to §7.5, and the type's recipe |
| 17 | Nodes, rows, lanes, boundaries, edge labels, a decision's branches, and the width count, all from the JSON | §8.20 Capacity |
| 18 | Stages, steps and items in each structured component | §8.25 to §8.30 |

The rest, such as print width, overlap and computed colour, needs the page drawn; the checks confirm it in a browser on the document's return.

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
- Distribution, a source's publisher and a source's locator take an omission comment when not recorded (§7.5).
- A source's date word comes from a closed set, with `as of` and `covers` (§8.21).
- A delta keeps the case it is written in (§4). A table cell that does not apply reads `n/a` (§8.11).
- Value labels carry thousands separators and the chart's precision (§9).
- No text is under 11px on screen or on paper: labels, chips, tags and deltas are 11px at +0.06em, and diagrams set their text larger as print scales them (§4, §8.20).
- At a 390px phone width the page never scrolls sideways; chips wrap inside their outline, and tables print without scrolling (§5, §8.11, §8.18).
- A flow's branch that ends early ends at a terminal of its own, and `col` and `row` keep their meaning in a flow that reads down (§8.20).

Added for guides and references: document kinds (§7), procedure (§8.23), related list (§8.24).

Added for reference pages: workflow, framework, model, method, requirement, evaluation and metric detail (§8.25 to §8.30).

Added for charts: recipes by question; bullet, slope, strip, box and interval charts declared with a `cm` key; end labels that name every line in place of the legend (§9).

Added for page types: the `cm-type` tag, the recipe format and the selection table (§7.6); topic (§7.7), glossary (§7.8) and module (§7.9).

Added as page types on the reference kind: framework (§7.10), process (§7.11), metric (§7.12) and comparison (§7.13).

Added for document sets: document ids and addresses, the breadcrumb from set to area to document, the generated index page and the link check (§8.31).

Added as page types on the report kind: roadmap (§7.14) and case study (§7.15).

Added for reports: ECharts chart method and theme; categorical and sequential palettes; dark token set; print rules; report masthead and contents rail; KPI strip; key findings; native tables with sorting and in-cell bars; pull quote; timeline; process diagram; definition, questions and property-sheet blocks; footnotes; collapsible appendix; chart draw-in motion; packaging modes.

Not yet covered: maps, network diagrams, interactive filters, a PDF cover page. Use a figure with `cm-slot` and flag the gap in an HTML comment until these exist.

### Migration from 1.2 to 2.0

A document built on kit 1.2 makes these changes for 2.0. The first two belong to the version itself. The rest bring an early 1.2 document in line with rules the kit already holds.

1. Add `<meta name="cm-id">` after `cm-kind`, naming the document (§8.31). In 1.2 a page without it passes with a warning; in 2.0 it fails `head-order`.
2. Set `cm-kit` in `<head>` and the kit line in the footer to 2.0.
3. Write a table cell that does not apply as `n/a`, not a dash (§8.11).
4. Give each source date a word from the closed set, and each unrecorded publisher, locator or Distribution its omission comment (§7.5, §8.21).
5. Write chart values as numbers, never strings, and drop any `"legend"` key (§9).
6. Write each key finding and recommended action as the canonical `<li>`, its claim line first, with no wrapping `<div>` (§8.3, §8.19) In 1.2 a wrapped item passes with a warning.
