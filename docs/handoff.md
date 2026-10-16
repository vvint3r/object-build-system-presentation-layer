# Handoff

State of content-morphia at the end of the session on 13 Oct 2026, and the next piece of work. Read
`CLAUDE.md` first; this file adds only what is not already in `docs/plan.md`, `docs/open-items.md`
and `docs/adoption.md`.

## State

| Area | State |
| --- | --- |
| Baseline | Report Kit 1.1 in `kit/report-kit/`. The copy here includes every change the owner made in Claude Design up to 13 Oct 2026; nothing changed there after it was shared. No re-import is needed |
| Migration steps 1–4 | Done (`docs/plan.md`) |
| Label size | Every label is 10px (decision record 056). Pull request #2, branch `labels-10px`, draft, open, not yet merged |
| Open items | One: table head type (`docs/open-items.md`, item 1). Awaiting the owner |
| Next | Migration step 5, automated checks. Agreed with the owner |

### Pull request #2

- **Change:** 13 all-caps label rules in `cm-report.css` moved from 11px to 10px. The spec's type table
  now has one Label tier at 10 / 800 / caps / +0.08em. The gallery specimen and the decision records
  match.
- **Unchanged by ruling:** buttons (12px), timeline dates (12px), footnote markers (11px), the print
  source URL (11px), chart text.
- **Verified:** computed styles in Chromium, light, dark and print, on the gallery and the sample
  report.
- **Status at handoff:** no CI configured and no review comments. Merging is the owner's call.
- **Next session:** subscribe to its activity and handle any review comments. If it merges before
  step 5 starts, branch from `main`. If it has not merged, branch from `labels-10px`, so the checks
  run against 10px labels.

## Next: automated checks (migration step 5)

**Goal:** a check runner that renders kit pages in a real browser and fails on any breach of the
spec's hard rules (`SPEC.md` section 1) or its pre-publish checklist (section 14). Every later change
is then checked automatically.

### Build

- **`checks/`:** a new folder holding the runner and one module per rule group.
- **`npm run check -- <page.html> [more…]`:** a new script in `package.json`.
- **Reuse `tools/preview.mjs`:** it already answers the jsDelivr ECharts URL with the npm copy and
  renders light and dark. Factor the shared page loading into one module, not a copy.
- **Each page is checked in three modes:** light, dark (`data-theme="dark"`), and print
  (`emulateMedia({ media: 'print' })`).
- **Output:** one line per page, mode and check. Failures show the selector and the computed value.
  The exit code is 1 on any failure.

### Hard rules, asserted on computed styles

| Rule (SPEC 1) | Check |
| --- | --- |
| 1, 2 | No `<style>`, no `<link rel=stylesheet>` other than `cm-report.css` and Google Fonts, no class outside those defined in `cm-report.css`. Inline `style` holds only `--h`, `--v`, `--t`, `--steps`, or `align-items:center` or `align-items:start` on a grid |
| 3 | No hex, rgb or named colour in markup attributes. Chart JSON colours are `$token` strings only |
| 4 | Every text node's computed colour equals the theme's ink or white, and opacity is 1 up the ancestor chain |
| 5 | Computed font family is Nunito everywhere except `code`, `.cm-code` and file names, which are JetBrains Mono |
| 6 | No text computes to the accent colour |
| 7 | Exactly one `.cm-featured` and one `.cm-summary` per report. At most one `.cm-chip--verdict` per table or figure |
| 8 | Chips, tags and labels have a transparent background |
| 10 | Every computed `border-radius` is in {0, 4, 6, 8, 12, 14, 999} px. Confirm that 0 and the 2px row-flag radius are intended before failing on them |
| Type floor (SPEC 4) | Nunito never below 10px. Running text never below 13px |

### Checklist, as checks (SPEC 14)

- **Figures:** kind, title, `role="img"`, `aria-label`, a caption containing **Source:**, figure
  numbers in sequence, a legend when there are two or more series.
- **Tables:** kind and title, `.num` on numeric columns, `data-value` on formatted cells, a source
  caption.
- **Footnotes:** link both ways.
- **Sources:** the list exists.
- **Contents rail:** links resolve to section ids.
- **Sections:** every section has a valid `aria-labelledby`.
- **Chart JSON:** parses. Bars and areas start at zero.
- **Console:** no errors.
- **Warnings, not failures:** checks that need judgment, such as a title of 10 words or fewer and a
  summary of 2–4 KPIs and 3–5 findings.

### Rules for the work

- **Failures in the kit's own pages:** if the gallery or the sample report fails a check, log it in
  `docs/open-items.md` with both values and their sources. Do not fix the page or loosen the check.
- **The gallery:** it shows deliberate wrong examples and markup listings. Let the gallery exempt a
  region (a marker attribute or a selector list kept in `checks/`) rather than weaken a rule. Record
  that choice.
- **In the same commit:**
  - `docs/plan.md`: step 5 set to Done, and `checks/` added to the layout
  - `CLAUDE.md`: a Checks section beside Preview
  - a decision record in `docs/decisions/` (next number 057), with a row in its index
- **Then:** commit, push, open a draft pull request, subscribe to it.

## Context not held elsewhere

- **This repository is the only home for the project.** The original library is read-only in
  `import/nodetrak-presentation-layer/`.
- **Claude Design projects:**
  - "Objective (Artifact) Development System" (id `82dab4fa-185a-43b6-8a2c-88a8c38ccba3`): where
    Report Kit 1.1 was built.
  - "Content Morphia View Layer" (id `109effa9-4b07-492a-af04-fbda145be4f9`): the sync target for
    step 8. Still empty.
- **Permissions:** the owner wants permission prompts bypassed and does not want routine
  confirmation questions. Proceed without asking on routine work. Still bring the owner every
  question the project rules reserve for them: spec and code disagreeing, a value the kit lacks, open
  items.
- **Reporting to the owner:**
  - Plain words, outcome first.
  - No rule ids, item codes or round numbers in chat.
  - Structured and concise, with no filler.
