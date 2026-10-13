# content-morphia presentation layer

This repository is the source of truth for **content-morphia**, a design system for a knowledge index:
reports, documents and analyses published as single HTML files, built for reference density and
long-form reading comfort. The baseline is **Report Kit 1.1**. Claude Design consumes the system; it is
not edited there. See `docs/plan.md`.

## Read before working

- `kit/report-kit/SPEC.md`: **the rules in force.** Follow it exactly; it wins over taste and over
  anything in `docs/reference/`.
- `docs/open-items.md`: questions about the kit awaiting the owner. Never resolve one on your own.
- `docs/adoption.md`: library features still to adopt into the kit, and how to adopt one.
- `docs/plan.md`: operating model, migration steps and their state.
- `docs/reference/`: the original library's rules and open items. Read only when adopting a library
  feature.
- `docs/decisions/`: one record per ruling. Read a record only when you need the reason for a rule.
- `import/`: the three original exports. **Read-only.** Never edit, move or delete anything in it.

## Where things live

| Path | Contents |
| --- | --- |
| `kit/report-kit/` | `SPEC.md`, `cm-report.css`, `cm-report.js`, `template.html`: the kit itself |
| `kit/Report Kit - Spec & Gallery.html` | Live examples of every component, with copy-paste markup |
| `kit/Sample Report - Q3 Support Review.html` | Reference output: a complete report built on the kit |
| `docs/` | Plan, open items, adoption backlog, decisions, library reference |
| `tools/preview.mjs` | Renders kit pages with the chart library served locally |
| `import/report-kit-1.1/` | The kit as imported from Claude Design on 13 Oct 2026 |
| `import/nodetrak-presentation-layer/` | The original content-morphia library |
| `import/kx-visualizations-index/` | The diagram and chart build-logic offshoot |

## How to work in this repository

- **One change per session.** One component, one adopted library feature, one open item. Commit when
  it is done; the commit is the checkpoint. Start the next change in a fresh session.
- **Keep the kit in step.** A change to the kit touches every file it affects in the same commit:
  canonical markup and rules in `SPEC.md`, classes in `cm-report.css`, behaviour in `cm-report.js`, a
  live example in the gallery page, and the sample report if it uses the component.
- **Record rulings.** A change to a rule gets a new file in `docs/decisions/`, named `NNN-short-slug.md`
  with the next number, and a row in that folder's index.
- **Decisions are the owner's.** When the spec and the code disagree, or a library feature needs a
  value the kit lacks, add an item to `docs/open-items.md` with both values and their sources. Do not
  pick one.
- **Adopt, don't copy.** A library feature is rebuilt in kit classes and tokens. The library's
  inline-style markup is never copied into the kit.
- **A check asserts the rendered result.** Verify computed styles in a real browser, not the authored
  string. Check light, dark and print.
- **Measure, don't recall.** Counts and values in docs are generated from the files, never typed from
  memory.
- Use subagents for audits and wide searches so the main session holds only the change.

## Non-negotiables

A summary of section 1 of `kit/report-kit/SPEC.md`. The spec governs; change this list in the same
commit as the spec.

1. Documents start from `template.html` and compose only from classes in `cm-report.css`.
2. No added stylesheets, `<style>` blocks, custom classes or inline styles, except the custom properties
   the spec allows (`--h`, `--v`, `--t`, `--steps`).
3. No hex, rgb or named colours in markup. Chart JSON uses `$token` strings.
4. Text is black or white. No grey text and no lowered opacity; rank with weight.
5. Nunito for all text, labels, tables, chips and charts. JetBrains Mono only for code.
6. The accent is never text.
7. One `cm-featured` per report, at most one verdict chip per table or figure, one summary per report.
8. Colour never fills a label. Status colour is a chip offset, a label underline, a row flag or a chart
   mark.
9. Meaning never rests on colour alone.
10. Radii only from the set: 4, 6, 8, 12, 14, 999.
11. No decoration: no emoji, stock imagery, gradients, coloured left borders or drop caps.
12. No filler. Every number shown is sourced.

## Preview

```
npm install
npm run preview -- "kit/Sample Report - Q3 Support Review.html" "kit/Report Kit - Spec & Gallery.html"
```

Renders each page in light and dark to `.preview/`, and fails on a script error or a chart that did not
draw. Reports load ECharts 5.5.1 from jsDelivr, which the cloud environment blocks; the preview serves
the same version from npm without changing the page. Google Fonts may be unreachable too, in which
case pages fall back to system faces. Never disable TLS verification to reach a blocked host.

## Reporting to the owner

- Lead with the outcome. Executive level: the call, the number behind it, the consequence.
- In chat, never use internal shorthand: no rule ids, round numbers, item codes or template ids.
  Say the thing in plain words. Codes belong in `docs/` only.
- Status updates: what is done, what is left, what needs a decision. No derivations.
- Do not apply generic aesthetic skills or directions. This system overrides them.
