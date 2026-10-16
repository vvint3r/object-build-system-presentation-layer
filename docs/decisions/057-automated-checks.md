# Automated checks

- **Date:** 2026-10-14
- **Source:** the owner's brief for migration step 5, in session
- **Status:** in force

---

## Ruling

Kit pages are checked automatically: `npm run check -- <page.html> [more…]`. The checks assert the
non-negotiable rules in section 1 of `SPEC.md` and its pre-publish checklist in section 14 on the
rendered page, in light, dark and print. A failed check exits 1. A check that needs judgment is a
warning and never changes the exit code.

When a check fails on a kit page, the failure goes to `docs/open-items.md` with both values and their
sources. The page is not fixed and the check is not loosened.

## Shape

- `checks/run.mjs` runs the checks; one module per rule group holds them. `tools/load.mjs` opens a
  page for both the checks and the preview, with ECharts served from npm and draw-in animation off
  so charts are measured fully drawn.
- Each check reads one of two things. Checks on markup (head, stylesheets, classes, inline style,
  colours in attributes, chart JSON, anatomy, numbering, links) read the file as written, parsed
  without running its scripts, and report the mode as `all`. Checks on rendering (text colour,
  typeface, weight, size, label type, fills behind labels, radius, gradients, left borders, charts
  drawn, script errors) read computed styles and run in each mode.
- Output is one line per page, mode and check: `ok`, `FAIL` or `warn`, with the CSS path and the
  computed value of each finding beneath it.

## Gallery exemptions

The gallery shows deliberate wrong examples and lists the markup of each demo. A page exempts a region
from named checks, or from every check, through a selector list kept in `checks/exempt.mjs`, with the
reason beside each entry. A rule is never weakened for a page, and a report has none of these regions.
A selector list needs no change to the page, where a marker attribute would.

| Region | Exempt from | Reason |
| --- | --- | --- |
| `.g-src` | every check | The markup listing under each demo is source code shown as text. |
| `[data-demo]` | counts and order across a report: one featured card, one summary, emphasis and section budgets, callouts per section, figure and table numbering, where the sources list sits | A demo shows one component on its own, out of report order. Every rule about how a component looks or is built still applies inside it. |

The gallery's helper layer (its `<style>` block and `g-` classes) and its anatomy, which differs from
a report's, are not exempt. Whether they should be is an open item.

## Readings

How the checks read the spec where it leaves a choice.

- **Classes:** the allowed set is the classes `cm-report.css` defines. A class the spec names but the
  CSS does not define fails.
- **Inline style:** only `--h`, `--v`, `--t` and `--steps`, and `align-items:center` or
  `align-items:start` on a grid.
- **Colours in markup:** hex, `rgb()`, `hsl()` and named colours in attributes fail. Text content
  is not read for colours, and a custom property name such as `--cm-ink` is not a colour.
- **Text colour:** the theme's ink, `#000000` or `#ffffff`, at full opacity on the element and every
  ancestor. Text the chart library draws is held to the same rule. Visually hidden text is left out.
- **Chart internals:** the chart library's own elements are not checked for radius, fills or
  gradients. Their text is checked for colour, typeface, weight and size.
- **Typeface:** Nunito everywhere; JetBrains Mono inside `code`, `.cm-code` and `.cm-code__file`.
  Labels and chips inside a code block stay Nunito, as the language tag in the kit's code bar does.
- **Weight:** 300, 400, 700, 800 or 900 for all text, code included.
- **Size:** nothing below 10px. Nunito below 13px only in the label tier, in table sort arrows (which
  section 4 names with the labels), and in the small text record 056 keeps at its own size: buttons,
  timeline dates, footnote markers and printed source URLs. Mono and chart text have the 10px floor
  only.
- **Label tier:** the label classes in `SPEC.md` section 4 and record 056 render at exactly 10px,
  weight 800, capitals, +0.08em. The sub-label inside a property-sheet key
  (`<dt>Rule<small>(per ticket)</small></dt>`) is running text, as section 8.7 and the CSS both set it.
- **Fills behind labels:** a coloured fill fails, on the label or on the nearest filled box beneath
  it. Black, white and greys are not colour.
- **Radius:** 0, 4, 6, 8, 12, 14 or 999px on every visible box and drawn pseudo-element. Square
  corners pass; any other value fails.
- **Tables:** a table inside a figure's data fallback (`.cm-data`) is that figure's text alternative
  and is left out of table checks. Totals rows in `<tfoot>` are not checked for `data-value`.
- **Figures:** a figure holds a chart, an image with alt text, or a placeholder slot.
- **Bold-colon openings:** a colon inside inline code does not make a bold-colon opening.

## Warnings

Checks that need judgment warn and never fail: title length, KPI and finding counts, summary numbers
that do not appear in the body, bold-colon openings, TL;DR and lede length, callouts per section and in
a row, reading time against word count, gaps between blocks, figure height, chart label length,
methodology size without an appendix, sparkline points, table numbering, `data-sortable` from five
rows, unreachable hosts and fonts that did not load.

## Not automated

Filler, whether every number is sourced, imagery and icons, the 8px gap between a label and its
content, component limits the checks do not count, the data fallback the spec recommends, the 22ch
title line, semantic solids only for status series, and the wording of data labels and annotations.
These stay with review.
