# Chart padding, axis titles and emphasis

- **Date:** 2026-10-30
- **Source:** the owner's approval of the recommended answers, record 069
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Category axis titles | A named category axis title gets the same room as a value axis title | `cm-report.js`: a named y-axis title on a value or a category axis sits above the plot, with 26px reserved for it. `checks/charts.mjs`: `chart-axis-title-fit` fails an axis title whose laid-out box passes an edge of the chart, in light, dark and print. `SPEC.md` section 9, axis-titles row: the placement. No visual change on the kit pages |
| Plot padding set by hand | The chart script works out plot padding; the padding set by hand on the two kit pages is removed | `cm-report.js`: plot top and bottom follow from the legend, the axis titles, a label at the top of a vertical reference line and a scale bar under the plot. Sample: `grid.top` and `grid.bottom` removed from figures 2, 3 and 5. Gallery: removed from figures 2 and 7. `checks/charts.mjs`: `chart-padding` fails chart JSON that sets either. `SPEC.md` section 9 names what the padding follows from |
| Context marks | A grey context mark a reader needs to read carries a direct value label; the grey stays | `SPEC.md` section 9, colour by role. No check. No visual change |
| Chart text starting with a dollar sign | Only token names resolve as colours; other text starting with `$` stays text | `cm-report.js`: the resolver reads only the `$` names of section 3's token table, published as `CM.tokenNames`. `checks/charts.mjs`: `chart-colours` accepts exactly those names under a colour key. `SPEC.md` section 9, token strings. No visual change |

## Plot padding

| Space | Worked out as |
| --- | --- |
| Above the plot | 20px, plus 36 for a legend and 26 for a y-axis title; at least 28 when a vertical reference line has its label at the top end |
| Below the plot | 4px, plus 32 for an x-axis title and 48 for a horizontal scale bar (`visualMap`) at the bottom |

On the kit pages at 1440px wide: the two channel bar charts keep a 28px top; the two heatmaps' plots
start at 20px instead of 8, with the bottom unchanged at 52; the weekly CSAT line starts at 20px
instead of 28. In light, dark and print, no chart text passes the chart's edge that did not before;
in print, x-axis labels on several charts reach 1px past the bottom with their font box, as on main.

## Calls

- **An inverse y-axis takes its title at the axis start, which is its top.** At the axis end, the
  title of an inverse axis lands under the x-axis labels, and the spec's heatmap is inverse.
- **The axis-title check measures the title's laid-out box from the chart library** against the
  chart's width and height. That box follows the drawn line of text; the SVG text box adds empty
  ascent and descent space, and in print the chart container has no height of its own.
- **Every axis chart starts from the same 20px above the plot, heatmaps included.** A heatmap-only
  base would keep their 8px at the cost of a branch; one rule wins over a rule with an exception.
- **A top label on a vertical reference line sets the top to at least 28px.** The label rises about
  19px above the plot; with a 28px top its text starts 9.4px below the chart's top edge.
- **A scale bar at the bottom adds 48px below the plot:** the bar's row and the gap above it. Both
  heatmaps keep the 52px bottom they had.
- **Padding set in the JSON still applies, and the `chart-padding` check fails it.** Every automatic
  chart setting yields to the JSON, and KPI sparks set their own padding; the check enforces "do not
  set these" as the spec states it. A chart with several grids is not checked, since the script
  sets no padding for one.
- **Context marks have no check.** Which context marks a reader needs to read is a judgment. A
  warning on every unlabelled context mark would fire on the three backdrop series on the kit pages
  (gallery figures 1 and 3, sample figure 1), and resolving it on the page would add labels the
  answer rules out.
- **Token names are the `$` names in section 3's table:** ink, paper, surface, track, hairline,
  field, accent, ok, warn, crit, info, note, c1 to c4, context and seq. Washes, tints, shadows, fonts
  and other `--cm-` properties stay text, so a label such as "$s1" no longer renders a property's
  value. One list serves the script and the check.

## Focus on one mark

The answer for focus on one mark is not in the kit; the item stays in `docs/open-items.md`. The
gallery's scatter demo picks out one point in `$c1` and keeps the rest of its series in `$c2`. Under
the answer, the rest would take `$context`, a visible change to that demo, and the context-mark rule
would then ask for value labels on its other four points.

## Version

The kit stays at 1.1 until the twelve answers are in the kit and every kit page passes the checks
(record 069).
