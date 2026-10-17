# Chart value labels

- **Date:** 2026-10-16
- **Source:** the owner's review of the sample's SLA attainment chart, in session; the label on a
  single point follows from rule 4 and closes the open item on the gallery's Figure 5
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Numbers crossed by a reference line | A line never runs through a value label; the label sits on the chart's surface colour | `cm-report.js`: a series with a `markLine` draws at z 6, above the line (ECharts draws markLines at z 5), so bars and their labels cover it. Label padding 1px → 3px top and bottom, so the line stops clear of the digits |
| Label on a single point | Styled like every other value label: ink, full opacity, Nunito 12 / 700 on the surface colour | `cm-report.js` themes `label` on data items as well as on series. The gallery's "Billing" point was #333333 at 0.8 opacity |

`SPEC.md` section 9 states both under direct labels.

## Effect

Where a bar crosses its target, the bar now covers the line, as it covers the grid lines. Only the
labels and bars of the series that owns the line move above it; other series in the same chart do not.

## Version

The kit stays at 1.1.
