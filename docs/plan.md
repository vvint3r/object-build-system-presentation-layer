# Plan

How content-morphia is built from here, and the order of the work.

## Operating model

```
Repository (this one)  ──build──▶  Design bundle  ──/design-sync──▶  Claude Design
source of truth                    generated, never                  "Content Morphia View Layer"
the kit · rules · adoption         hand-edited                       compose, review, export
```

- **Report Kit 1.1 is the baseline.** `kit/report-kit/` holds the stylesheet, script, template and
  specification that every document is built from. Tokens are CSS custom properties; documents compose
  from kit classes and never carry inline styles or raw colours.
- **The original library is the reference.** Its 35 pages, diagram families and page types are adopted
  into the kit over time, one family per change. `docs/adoption.md` is the backlog.
- **The repository is the source of truth.** The kit is edited here, in Claude Code. Every change is a
  commit. Nothing about the kit is edited in Claude Design.
- **Claude Design is a consumer.** A build emits the layout Claude Design's design-system projects use
  and pushes it with `/design-sync` to **Content Morphia View Layer** (project id
  `109effa9-4b07-492a-af04-fbda145be4f9`). Documents are composed there; a finding made there comes back
  as a task and is fixed here.
- **The kit was built in** the Claude Design project "Objective (Artifact) Development System"
  (project id `82dab4fa-185a-43b6-8a2c-88a8c38ccba3`). Changes made there after 13 Oct 2026 must be
  re-imported before they are lost.
- **The visualization kit is adopted into the report kit.** It brings the build logic for diagrams:
  layout, routing and label placement. Styling comes from the report kit's tokens. A later kit for
  complex diagram authoring, in the manner of Eraser, builds on it.
- **Content rules become data.** Writing rules (word limits, register, per-heading constraints) extend
  section 13 of the kit's spec and become checks, not prose in `CLAUDE.md`.

## Migration

| Step | Work | State |
| --- | --- | --- |
| 1 | Land the library and the visualization kit unchanged under `import/` | Done |
| 2 | Split the library's history into decision records, rules and open items | Done |
| 3 | Adopt Report Kit 1.1 as the baseline; library becomes reference | Done |
| 4 | Answer the kit's open items and bring spec and code into line | Done |
| 5 | Turn the spec's hard rules and its pre-publish checklist into automated checks on rendered pages | Done |
| 6 | Adopt library features into the kit in the order in `docs/adoption.md` | |
| 7 | Adopt the visualization kit: node kit, connectors, the lane-flow router with its fixtures | |
| 8 | Build the design bundle from the kit and sync it to Claude Design | |

Steps 6 and 7 run in parallel once step 5 exists, so every adopted feature is checked.

## Kit to-do

Work the owner has asked for, not yet scheduled into a step.

- **Offline mode.** A packaging mode with Nunito, JetBrains Mono and ECharts bundled into the report, so
  a report opened offline or behind a restrictive network renders fully. Today both packaging modes
  load fonts from Google Fonts and ECharts from jsDelivr. Until then, `tools/preview.mjs` serves
  ECharts locally for previews.

## Layout

```
kit/
  report-kit/      SPEC.md · cm-report.css · cm-report.js · template.html   (the baseline)
  Report Kit - Spec & Gallery.html                                         (live examples)
  Sample Report - Q3 Support Review.html                                   (reference output)
docs/
  open-items.md    questions about the kit
  adoption.md      library features still to adopt
  plan.md          this file
  decisions/       one record per ruling
  reference/       the library's rules and open items
checks/
  run.mjs          run the automated checks (npm run check -- <page>)
  exempt.mjs       regions a page exempts from named checks, each with its reason
  *.mjs            one module per rule group: markup, colour, type, radius, budgets, decoration,
                   meaning, charts, figures, tables, structure, judgment; page.mjs holds shared helpers
tools/
  load.mjs         open a kit page in light, dark or print with ECharts served from npm
  preview.mjs      render kit pages with ECharts served from npm (npm run preview -- <page>)
import/            the three original exports, read-only
```

Planned: `viz/` for the visualization build logic (step 7), `bundle/` for the generated design bundle
(step 8). Each is created when its step starts.
