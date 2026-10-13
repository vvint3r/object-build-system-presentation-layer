# Open items

Questions for the owner about Report Kit 1.1, the baseline. Each item names what the kit's
specification says, what its code does, and the question to answer. Until an item is answered, the
kit's code is what renders, and nothing in it is changed.

When an item is answered: change the kit (`kit/report-kit/`), keep `SPEC.md`, `cm-report.css`,
`cm-report.js` and the gallery page in step, add a decision record in `docs/decisions/`, and delete the
item from this file.

Inconsistencies inside the original library are tracked separately in
`docs/reference/library-open-items.md`. They matter only when the feature they touch is adopted.

Measured from `kit/report-kit/` as imported on 13 Oct 2026.

---

## K1 · Chart colours three and four

| Source | Light | Dark |
| --- | --- | --- |
| `SPEC.md` section 3 | `#2d6fdc`, `#8a4fd6` | `#5b9af2`, `#a982f0` |
| `cm-report.css` (`--cm-c3`, `--cm-c4`) | `#ff7a45`, `#5b6cff` | `#ff8f61`, `#8592ff` |

`cm-report.js` reads the chart palette from the CSS variables, so charts render the CSS values.
`SPEC.md` section 15 says these two colours were made "deeper" in 1.1, which matches the spec's values,
not the CSS.

**Question.** Which pair is current?

## K2 · Smallest type size

`SPEC.md` section 4: "Nunito never below 11px (chips)". In `cm-report.css`:

| Element | Size |
| --- | --- |
| Chips, tags and deltas (`.cm-chip`, `.cm-tag`, `.cm-delta`) | 10px |
| Property-sheet role tags (`.cm-props sup`) | 10px |
| Table sort arrows | 9px |

**Question.** Raise chips and tags to 11px, or set the floor at 10px for chips? Are the sort arrows,
which are glyphs rather than text, exempt?

## K3 · Label letter-spacing

`SPEC.md` section 4 gives labels "+0.08em". `cm-report.css` sets `.06em` on all 17 label rules: labels,
breadcrumbs, metadata keys, chips, KPI labels, callout labels, figure and table kinds, timeline dates,
step numbers and the collapsible control.

**Question.** `.06em` or `.08em`?

## K4 · Spacing scale

`SPEC.md` section 5 sets the scale at 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96 · 128, plus
160 before the first appendix. `cm-report.css` also uses values that are off the scale:

| Value | Declarations | Examples |
| --- | --- | --- |
| 28 | 9 | KPI padding, section TL;DR margin, byline padding |
| 36 | 5 | Card, summary and figure top padding |
| 44 | 2 | Findings indent, timeline row spacing |
| 56 | 3 | Section header margin, H3 margin in prose |
| 80, 120 | 2, 1 | Notes scroll offset, shell bottom padding |
| 6, 10, 14, 18, 22 | 11, 7, 5, 4, 1 | Interior chrome: chips, rails, list gaps |

**Question.** Extend the scale to the values the kit uses, or move the CSS onto the scale? Does the
scale govern interior chrome, or only spacing between blocks?

## K5 · External dependencies

Every report loads Nunito and JetBrains Mono from Google Fonts and ECharts 5.5.1 from jsDelivr. The
self-contained packaging mode inlines the kit's CSS and JavaScript but keeps both links. A report opened
offline or behind a restrictive network renders in fallback fonts with blank charts. That is what
happened in this repository's cloud environment until ECharts was served locally.

**Question.** Should the kit ship a fully offline mode, with fonts and ECharts bundled, for email and
archived reports?
