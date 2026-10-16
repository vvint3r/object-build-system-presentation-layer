# Named classes, sort values and footnote 3

- **Date:** 2026-10-16
- **Source:** the owner's answers to the open items on classes, formatted cells and footnote 3, in
  session. The owner left the class question to implementation, asking for a lean system with nothing
  unused
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| `cm-callout--note`, `is-done` | The stylesheet defines every class the spec names, so it stays the one list of allowed classes. Each rule restates the default look, the way the other variants state theirs | `cm-report.css`: `.cm-callout--note{--c:var(--cm-info)}` and `.is-done>.cm-timeline__mark{border-color:var(--cm-ink)}`. No visual change |
| Formatted percentages | Sortable percentage cells stay sortable and carry `data-value`, so the rule stays one line: formatted text gets a raw number | Sample, Table 1: 10 cells. Gallery, data table demo: 3 cells. Data fallback tables inside figures and totals rows are unchanged |
| Footnote 3 | Every footnote links both ways | Sample: the reference in the Table 1 caption gains `id="fnref-3"`; note 3 gains its back link |

## Alternative not taken

Accepting spec-named classes in the class check would have needed a second list of classes, read from
the spec, kept in step with the CSS.

## Version

The kit stays at 1.1.
