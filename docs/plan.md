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

After the baseline, the work runs as **four sub-projects**. Steps 7 to 9 run in that order without
waiting for step 6, which starts on the owner's direction for it. **The plan is done when step 9 is
done.**

An orchestrating session splits each sub-project into changes and starts each change in its own
working session, on its own branch. Each change returns as a pull request, which the orchestrating
session reviews and merges.

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

### Kit 1.2

The twelve items open in `docs/open-items.md` on 30 Oct 2026 take the answers in record 069. When
every one is fixed and every kit page passes the checks, the kit becomes 1.2. The fixes run
alongside step 7.

### Sub-projects

| Step | Sub-project | Work | Done when | State |
| --- | --- | --- | --- | --- |
| 6 | Visualization build | Build diagrams, charts and visualizations from the owner's reference set, with the library's diagram and chart pages and the visualization kit as references | The families the owner's direction names are in the kit, each with rules, checks and a gallery example | Waits for the owner's direction |
| 7 | Writing rules | Extend section 13 of the spec with the writing rules (word limits, register, per-heading constraints) and turn them into checks | Section 13 holds the rules, the checks enforce them, and every kit page passes | In progress |
| 8 | Kit features | Adopt provenance; change and status; wayfinding and multi-document navigation; structured components, then page types; in that order. Add a third packaging mode that bundles Nunito, JetBrains Mono and ECharts into the report, so it renders offline or behind a restrictive network | The Provenance, Change and status, Wayfinding, Multi-page navigation, Structured components and Page types rows of `docs/adoption.md` read Covered, and a report in the offline mode passes the checks | Waits for step 7 |
| 9 | Claude Design hand-off | Build the design bundle from the kit and sync it to Claude Design inside Claude | A document composed in Claude Design from the synced bundle passes the kit's checks | Waits for step 8; target, sync method and bundle form settled when the step starts |

The other rows of `docs/adoption.md`, learning, inputs and icons among them, are adopted when content
calls for them, outside this plan.

Each sub-project gets a brief in `docs/subprojects/` before its first session starts, with its scope,
inputs, owner-level calls and state, so any session can resume it. Every feature or rule steps 6 to 8
add comes with the checks it needs.

## Layout

```
kit/
  report-kit/      SPEC.md · cm-report.css · cm-report.js · template.html   (the baseline)
  Report Kit - Spec & Gallery.html                                         (live examples)
  Sample Report - Q3 Support Review.html                                   (reference output)
  agent-brief.md                                                           (for agents elsewhere)
docs/
  decision-framework.md   who decides what, and the principles to decide by
  open-items.md    questions about the kit
  adoption.md      library features still to adopt
  plan.md          this file
  decisions/       one record per ruling
  reference/       the library's rules and open items
  subprojects/     one brief per sub-project: scope, inputs, owner-level calls, state
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

Planned: a folder for step 6's build and `bundle/` for the generated design bundle (step 9), each
created when its step starts.
