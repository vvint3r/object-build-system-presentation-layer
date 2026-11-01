# content-morphia presentation layer

This repository is the source of truth for **content-morphia**, a design system for a knowledge index:
reports, documents and analyses published as single HTML files, built for reference density and
long-form reading comfort. The kit in force is **Report Kit 2.0**. Claude Design consumes the system;
it is not edited there. See `docs/plan.md`.

## Read before working

- `kit/report-kit/SPEC.md`: **the rules in force.** Follow it exactly; it wins over taste and over
  anything in `docs/reference/`.
- `docs/decision-framework.md`: which decisions a session takes alone, which it takes and reports,
  and which wait for the owner; the principles to decide by.
- `docs/open-items.md`: questions about the kit awaiting a ruling. A working session never resolves
  one; the orchestrating session decides it under the owner's delegation (record 075).
- `docs/adoption.md`: library features still to adopt into the kit, and how to adopt one.
- `docs/plan.md`: operating model, migration steps and their state.
- `docs/reference/`: the original library's rules and open items. Read only when adopting a library
  feature.
- `docs/decisions/`: one record per ruling. Read a record only when you need the reason for a rule.
- `import/`: the three original exports. **Read-only.** Never edit, move or delete anything in it.

## Where things live

| Path | Contents |
| --- | --- |
| `kit/report-kit/` | `SPEC.md`, `cm-report.css`, `cm-report.js` and a template for each document kind and page type: the kit itself. The spec's kit-files table lists every file |
| `kit/Report Kit - Spec & Gallery.html` | Live examples of every component, with copy-paste markup |
| `kit/Sample Report - Q3 Support Review.html` | Reference output: a complete report built on the kit |
| `kit/Guide - Billing Escalation.html` | Reference output: a complete guide built on the kit |
| `kit/Reference - First Response Time.html` | Reference output: a complete reference built on the kit |
| `kit/agent-brief.md` | Instructions for agents outside this repository that build documents on the kit |
| `docs/` | Plan, decision framework, open items, adoption backlog, decisions, library reference |
| `checks/` | Automated checks on rendered pages: the spec's hard rules and pre-publish checklist; `checks/test.mjs` tests them (`npm test`) |
| `tools/load.mjs` | Opens a kit page in light, dark or print; shared by the checks and the preview |
| `tools/preview.mjs` | Renders kit pages with the chart library served locally |
| `tools/pack.mjs` | Writes a page's offline form to `offline/` (`npm run pack`); `tools/offline.mjs` holds its parts |
| `tools/bundle.mjs` | Writes the design bundle to `bundle/project/` (`npm run bundle`); `tools/bundle-check.mjs` checks it |
| `tools/migration.mjs` | Checks the kit pages of a released version with this tree's checks (`npm run migration`); section 15 of the spec lists the result |
| `tools/print.mjs` | Prints kit pages to A4 PDFs in `.print/` (`npm run print`); `tools/print-measure.py` reports their page breaks when PyMuPDF is installed |
| `import/report-kit-1.1/` | The kit as imported from Claude Design on 13 Oct 2026 |
| `import/nodetrak-presentation-layer/` | The original content-morphia library |
| `import/kx-visualizations-index/` | The diagram and chart build-logic offshoot |

## How to work in this repository

- **One change per session.** One component, one adopted library feature, one open item. Commit when
  it is done; the commit is the checkpoint. Start the next change in a fresh session.
- **Keep the kit in step.** A change to the kit touches every file it affects in the same commit:
  canonical markup and rules in `SPEC.md`, classes in `cm-report.css`, behaviour in `cm-report.js`, a
  live example in the gallery page, and the sample report if it uses the component.
- **Keep the agent brief in step.** `kit/agent-brief.md` links to the kit at one commit. When a kit
  change merges, its links move to the merge commit, and its summary of the rules changes with the
  spec.
- **Record rulings.** A change to a rule gets a new file in `docs/decisions/`, named `NNN-short-slug.md`
  with the next number, and a row in that folder's index.
- **Decide at the right level.** `docs/decision-framework.md` sets which decisions a session takes
  alone, which it takes and reports, and which wait for the owner. When the spec and the code disagree,
  or a library feature needs a value the kit lacks, add an item to `docs/open-items.md` with both
  values and their sources. Do not pick one.
- **Adopt, don't copy.** A library feature is rebuilt in kit classes and tokens. The library's
  inline-style markup is never copied into the kit.
- **A check asserts the rendered result.** Verify computed styles in a real browser, not the authored
  string. Check light, dark and print.
- **Measure, don't recall.** Counts and values in docs are generated from the files, never typed from
  memory.
- Use subagents for audits and wide searches so the main session holds only the change.

## Non-negotiables

A summary of section 1 of `kit/report-kit/SPEC.md`. The spec governs; change this list, and the one
in `kit/agent-brief.md`, in the same commit as the spec.

1. Documents start from the template for their kind (report, guide or reference), or from their page
   type's template, and compose only from classes in `cm-report.css`.
2. No added stylesheets, `<style>` blocks, custom classes or inline styles, except the custom properties
   the spec allows (`--h`, `--v`, `--t`, `--steps`).
3. No hex, rgb or named colours in markup. Chart JSON uses `$token` strings.
4. Text is black or white. No grey text and no lowered opacity; rank with weight. Exceptions: code syntax
   colours, and the verdict chip's paper-coloured text on its ink fill.
5. Nunito for all text, labels, tables, chips and charts. JetBrains Mono only for code.
6. The accent is never text.
7. One `cm-featured` per report (none when a report with no actions leaves Recommendations out), at
   most one verdict chip per table or figure, one summary per report. A guide or a reference carries
   no `cm-featured` and no summary.
8. Colour never fills a label. Status colour is a chip offset, a label underline, a row flag or a chart
   mark.
9. Meaning never rests on colour alone.
10. Radii only from the set: 2, 4, 6, 8, 12, 14, 999. Shapes are rounded; only lines, masked icons and the top bar
    are square.
11. No decoration: no emoji, stock imagery, coloured left borders or drop caps, and no gradients except where
    one carries meaning (a planned timeline item's dashed rail, a chart's colour-scale legend).
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

## Checks

```
npm run check -- "kit/Sample Report - Q3 Support Review.html" "kit/Report Kit - Spec & Gallery.html"
```

Asserts the hard rules and the pre-publish checklist of `SPEC.md` on each page, in light, dark and
print. Prints one line per page, mode and check: `ok`, `FAIL` with the selector and computed value of
each finding, `warn` for a check that needs judgment, or `skip` for a check the page is exempt from.
Exits 1 on any failure; warnings never fail the run. `--all` lists every finding instead of grouping them.

- Run the checks on every page a change touches, before committing.
- When a check fails on a kit page as it stands in `main`, add an item to `docs/open-items.md` with
  both values and their sources. Do not fix the page or loosen the check. A failure the change itself
  introduces is fixed in the change.
- A warning on a kit page is resolved on the page: the gallery and the sample carry none, so a new
  warning on either is a new finding. A check changes only where it misreads the spec, and the spec
  only by a ruling.
- A page exempts a region, or the whole page, from named checks only through `checks/exempt.mjs`,
  with the reason. A rule is never weakened to pass a page. The gallery is a catalogue: its helper
  layer and report anatomy are exempt, its demos are not.
- A new component or adopted feature comes with the checks its rules need.

## Reporting to the owner

- Lead with the outcome. Executive level: the call, the number behind it, the consequence.
- In chat, never use internal shorthand: no rule ids, round numbers, item codes or template ids.
  Say the thing in plain words. Codes belong in `docs/` only.
- Status updates: what is done, what is left, what needs a decision. No derivations.
- Do not apply generic aesthetic skills or directions. This system overrides them.
