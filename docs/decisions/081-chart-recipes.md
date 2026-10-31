# Chart recipes

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075; scope and values
  from record 076 and `docs/subprojects/visualization-build.md`
- **Status:** in force

---

## Rules

Section 9 of `SPEC.md` holds the rules. Recipes by question take the place of the chart-choice table,
and kit declarations add four chart types: bullet, slope, distribution (strip or box) and uncertainty
(interval band or error bars). Section 14 item 5 accepts end labels in place of a legend. The new
checks are failures, in `checks/recipes.mjs`; `checks/charts.mjs` reads the new forms.

| Rule | Source | Check |
| --- | --- | --- |
| A chart is chosen by the reader's question: comparison, change, distribution, uncertainty, composition or relationship | Record 076 | Checklist |
| A `cm` declaration names a kit chart, sits on the series type it belongs to, and has the fields §9 gives | §9, kit declarations | `chart-declaration` |
| A bullet has a target: one number, or one per bar | Visualization brief | `bullet-target` |
| A slope has exactly two categories, and every line a label at both ends, outside the plot | Visualization brief | `slope-ends` |
| A strip or box states its count, "n = N" under each category, as drawn | Visualization brief | `distribution-count` |
| An interval names its level or kind ("90% interval"), drawn in the legend | Visualization brief | `interval-name` |
| No two pieces of text a chart draws overlap, in light, dark and print | Visualization brief | `chart-label-overlap` |
| A chart's drawing fits its box | §12; §14 item 13 | `chart-drawn`, extended |
| A legend for two or more series, except a slope and a line chart whose every line carries an end label naming it | §9 anatomy; §14 item 5 | `chart-legend`, extended |
| The forbidden forms stand; the zero rule does not apply to an interval band or a box | §9 | `chart-forbidden`, `chart-baseline` (existing) |

## Calls

- **Native first.** The author writes ordinary ECharts axes, series names and axis titles, so every
  existing chart check reads a declared chart as it reads any other. The `cm` key holds only what
  JSON cannot express: the target, the bands, the raw values, the interval.
- **Legend and direct labels.** End labels that name every line (`"{a}"` or the series name) replace
  the legend, so the name appears once, where the line is. A slope never has a legend. End labels that
  give values, or name only some lines, sit alongside it.
- **End-label spacing.** End labels that would touch move apart, centred on their lines, at every
  draw. The sample's Figure 1 had "Q2" and "Q3" overlapping in every mode without it.
- **Bullet.** Horizontal only, with one unit and one value axis from zero. The target is a 2px ink
  mark, the meter's target treatment. Bands are 1 to 3 grey steps from existing tokens, darkest first
  (`$field`, `$hairline`, `$track`), each segment with a 1.5px surface gap so neighbouring greys
  separate. Band names sit above the top row. Values sit in a column at the row's end.
- **Slope.** Lines are ink; picked-out lines keep their colour and the rest take `$context`. The
  y-axis labels and gridlines are dropped, since the end labels carry every value. The axis spans the
  data. Labels on each side move apart when they would touch.
- **Distribution.** One distribution series per chart, so each category has one count. A strip shows
  each value as a hollow dot with a fixed spread, so a page draws the same chart every time, and the
  median as an ink mark. A box computes quartiles by linear interpolation and whiskers to 1.5 times
  the interquartile range, the common convention. Boxes are outlines in the series colour, so the
  median line reads against the fill.
- **Count.** "n = N" sits under each category name, where the reader looks for the group, not in a
  caption a reader may skip.
- **Uncertainty.** A band on a line takes the line's colour at the area opacity, 0.18. Error bars on
  bars and points are ink, so they read against any series colour. The interval's name goes in the
  legend with an icon of its mark.
- **Print.** Charts in print sat outside their box, which had no height, so printed PDFs showed none.
  The print rule draws the chart in the flow of its box, and `chart-drawn` checks that the drawing
  fits it.
- **Overlap tolerance.** Two text boxes that share 2px or less in either direction do not overlap: a
  box holds the font's empty ascent and descent as well as the glyphs.
- **Sample report.** Figure 3, SLA attainment by channel, becomes a bullet against the 95% target,
  with the same data, data table and source. Figure 1's end labels name their lines, so its legend
  drops.
- **Gallery.** Part 06 opens with the recipes as six tables, then one demo per new chart type with
  its JSON. Part 07's figures follow Part 06's numbering.
- **Not covered.** Vertical bullets, and more than one distribution series per chart.

## Values

All within record 076 (strokes 1.5px and 2px, labels 8px clear) except these:

| Value | Use | Reason |
| --- | --- | --- |
| 20px | Bullet track height | Holds the 8px bar with room for the target to read across it |
| 8px | Bullet bar thickness | Thin enough that the track and bands read around it |
| 28px | Bullet target and strip median mark length | Crosses the 20px track by 4px on each side |
| ±8px | Strip spread | Separates near-equal values inside a 20px row |
| 8px | Strip and outlier dot size | One size smaller than the theme's 9px scatter point, as the dots are hollow |
| 7px | Slope point size | The theme's line symbol size |
| 16px | Box width | The kit's largest bar width |
| 18px | Spacing between moved labels | One label line at 12px type |
| 8px | Error-bar cap width | Visible at print width without merging into a neighbour |

## Owner questions

None. The orchestrating session reviews the values above under record 075.

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.
