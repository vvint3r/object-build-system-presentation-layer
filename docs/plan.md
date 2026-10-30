# Plan

How content-morphia is built from here, and the order of the work.

## Operating model

```
Repository (this one)  ──build──▶  Design bundle  ──sync──▶  Claude Design
source of truth                    generated, never          inside Claude
the kit · rules · adoption         hand-edited               compose, review, export
```

- **Report Kit 1.1 is the baseline.** `kit/report-kit/` holds the stylesheet, script, template and
  specification that every document is built from. Tokens are CSS custom properties; documents compose
  from kit classes and never carry inline styles or raw colours.
- **The original library is the reference.** Its 35 pages, diagram families and page types are adopted
  into the kit over time, one family per change. `docs/adoption.md` is the backlog.
- **The repository is the source of truth.** The kit is edited here, in Claude Code. Every change is a
  commit. Nothing about the kit is edited in Claude Design.
- **Claude Design is a consumer.** A build emits a design bundle and syncs it to Claude Design, which
  now lives inside Claude. Documents are composed there; a finding made there comes back as a task and
  is fixed here. The target project, the sync method and the bundle's form are settled when step 9
  starts.
- **Standalone Claude Design (claude.ai/design) closes by 14 Dec 2026.** The design-system project
  set up there as the sync target, **Content Morphia View Layer** (project id
  `109effa9-4b07-492a-af04-fbda145be4f9`), closes with it.
- **The kit was built in** the standalone Claude Design project "Objective (Artifact) Development
  System" (project id `82dab4fa-185a-43b6-8a2c-88a8c38ccba3`). Changes made there after 13 Oct 2026
  are re-imported before 14 Dec 2026, when standalone Claude Design closes.
- **Diagrams, charts and visualizations get a build of their own,** structured from a reference set
  the owner supplies. The library's diagram and chart pages and the visualization kit (its Obsidian
  charts and diagrams) are references for it, not sources adopted as they are. Styling comes from the
  report kit's tokens. How far the build replaces the kit's current chart method is settled when it
  starts. A later kit for complex diagram authoring, in the manner of Eraser, builds on it.
- **Content rules become data.** Writing rules (word limits, register, per-heading constraints) extend
  section 13 of the kit's spec and become checks, not prose in `CLAUDE.md`.

## Migration

After the baseline, the work runs as **four sub-projects, in order**. An orchestrating session splits
each sub-project into changes and starts each change in its own working session, on its own branch.
Each change returns as a draft pull request, which the orchestrating session reviews.

Owner-level calls stay with the owner, as `docs/decision-framework.md` sets them. The re-import of the
original Claude Design project sits outside the sub-projects and keeps its own date.

### Baseline

| Step | Work | State |
| --- | --- | --- |
| 1 | Land the library and the visualization kit unchanged under `import/` | Done |
| 2 | Split the library's history into decision records, rules and open items | Done |
| 3 | Adopt Report Kit 1.1 as the baseline; library becomes reference | Done |
| 4 | Answer the kit's open items and bring spec and code into line | Done |
| 5 | Turn the spec's hard rules and its pre-publish checklist into automated checks on rendered pages | Done |

### Sub-projects

| Step | Sub-project | Work | State |
| --- | --- | --- | --- |
| 6 | Visualization build | Build diagrams, charts and visualizations from the owner's reference set, with the library's diagram and chart pages and the visualization kit as references | Next; waits for the reference set |
| 7 | Writing rules | Extend section 13 of the spec with the writing rules (word limits, register, per-heading constraints) and turn them into checks | Waits for step 6 |
| 8 | Kit features | Adopt library features, page types among them, in the order in `docs/adoption.md`, and add a third packaging mode that bundles Nunito, JetBrains Mono and ECharts into the report, so it renders offline or behind a restrictive network | Waits for step 7 |
| 9 | Claude Design hand-off | Build the design bundle from the kit and sync it to Claude Design inside Claude | Waits for step 8; target, sync method and bundle form settled when the step starts |

Each sub-project gets a brief in `docs/subprojects/` before its first session starts, with its scope,
inputs, owner-level calls and state, so any session can resume it. Every feature or rule steps 6 to 8
add comes with the checks it needs.

## Layout

```
kit/
  report-kit/      SPEC.md · cm-report.css · cm-report.js · template.html   (the baseline)
  Report Kit - Spec & Gallery.html                                         (live examples)
  Sample Report - Q3 Support Review.html                                   (reference output)
docs/
  decision-framework.md   who decides what, and the principles to decide by
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

Planned: `docs/subprojects/`, created with the first sub-project brief; a folder for step 6's build and
`bundle/` for the generated design bundle (step 9), each created when its step starts.
