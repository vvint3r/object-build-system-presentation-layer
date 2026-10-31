# Kit 2.0 contract and migration

- **Date:** 2026-10-31
- **Source:** the orchestrating session's brief for the kit 2.0 release candidate; choices taken by
  the session under the delegation in record 075
- **Status:** in force

---

## Rules

| Rule | Spec | Check |
| --- | --- | --- |
| Every page carries `<meta name="cm-kit" content="2.0">`, and its footer names Content Morphia Report Kit 2.0 | §2, §7.1 | `head-order`, `footer`, failure |
| Every document carries one `cm-id` tag, after `cm-kind`, or after `cm-kit` on a report without a kind tag | §2, §7, §8.31 | `head-order`, failure |
| A key finding's or a recommended action's claim line is the `<li>`'s own first child; no element wraps the item | §8.3, §8.19 | `claim-wrapper`, failure |
| A page of a type starts from its type's template | §1 rule 1, §7.6 | Checklist, §14 item 1 |

The `doc-id` warning leaves the checks: `head-order` holds the rule and names the missing tag. The
checks gain tests of their own, `checks/test.mjs` (`npm test`).

| Case | Page | Expected |
| --- | --- | --- |
| Passing page | The sample report | No check fails |
| No `cm-id` | The sample report without its `cm-id` tag | `head-order` alone fails, naming the missing tag |
| Wrapped claim | The sample report with its first key finding wrapped in a `<div>` | `claim-wrapper` alone fails |

## Migration method

`tools/migration.mjs` (`npm run migration`) writes every HTML page under `kit/` at a released commit,
22e0fb2 for kit 1.2, into a temporary folder in the same layout. The folder's `report-kit/` holds this
tree's `cm-report.css` and `cm-report.js`, where a document finds them once its kit folder is replaced.

The 2.0 checks run on those pages, and every check that fails or warns is listed with its pages,
modes and findings.

- A finding on a released template that the current template of the same name also returns, in the
  same check and with the same value once numbers are set aside, is a placeholder and is listed apart.
- The link check stays out: it reads a document set's folder, and a released page belongs to no set.
- The note in section 15 gives one repair for each check listed, in the order of the head, the
  masthead, the body and print. A repair the rehearsal showed to be incomplete is widened until the
  rehearsed page passes.

## Rehearsal

The rehearsal applies the note, and nothing else, to the 1.2 sample report beside the 2.0 kit files,
then runs every check. Each failure left is a gap in the note.

Facts the 1.2 page does not record, such as a source's date, are looked up at the source. For the
sample, the dates the current sample report carries stand in for that look-up.

## Measured, 2026-10-31

The pages at 22e0fb2 are the gallery, the sample report and the report template. Eight checks fail on
them under the 2.0 checks, and none warns. The template's other findings, a `reading-time` warning
among them, are placeholders the 2.0 template returns too.

| Check | Pages | Repair in §15 |
| --- | --- | --- |
| `head-order` | Sample report, template | 1: `cm-kit` 2.0 and a `cm-id` tag |
| `footer` | Sample report, template | 2: the kit line names 2.0 |
| `masthead` | Sample report, template | 3: three breadcrumb steps; set and area as spans outside a set |
| `claim-wrapper` | Sample report, template | 4: no `<div>` around a finding or an action |
| `source-entries` | Gallery, sample report, template | 5: the source entry form of §8.21 |
| `sources` | Gallery, sample report, template | 5: a type tag from the closed set |
| `table-na` | Gallery, sample report | 6: `n/a`, never a dash |
| `type-floor` | Gallery, print | 7: `cm-print-stack` on side-by-side figures |

The rehearsal's first pass, with repair 5 covering only the id and the type tag, left two failures.

- `source-entries` failed on each entry's key, title, locator and date.
- `text-clip` failed on the longer type tags in the 1.2 entry layout.

Repair 5 gives the whole entry form, and states that a date takes no omission comment. Repair 3 names
the three breadcrumb steps, since a document copied from the 1.2 template has two. The rehearsed
sample passes every check: 247 ok, 0 FAIL, 0 warn.

## Calls

| Decision | Reason |
| --- | --- |
| `doc-id` folds into `head-order` | One check holds the head's order and its required tags; a second check for one tag repeats it |
| The gallery carries no `cm-id`, and `doc-id` leaves its exemption list | The gallery carries no `cm-kit` either: as a catalogue it is exempt from `head-order` (record 063), and the link check reads it only as a link target |
| `claim-wrapper` is a failure | Record 090 set it on the path of `cm-id`: a warning in 1.2, a failure in 2.0 |
| The tests build their failing pages from the sample report as they run | A copy kept as a file drifts from the sample; built from it, each case is the sample with one rule broken |
| The tests include a wrapped claim | The second contract change gets the same proof as the first |
| The migration runs released pages beside the 2.0 stylesheet and script | A document moving to 2.0 replaces its kit folder first; the checks then show what its own markup must change |
| Repair 5 covers `source-entries` and `sources` together | One rewrite in the form of §8.21 clears both, and the clipped tags with them |
| A date has no omission comment in the note | §8.21 allows one for a publisher or a locator only; a date is looked up, never left out |
| The Guide chip change and the diagram print caveat follow the numbered repairs | No check on a 1.2 page shows either, so neither has a check to name |
| Changed in 1.2 holds the lines of the 1.2 release, and Changed in 2.0 everything after it | The lines record 090 added to the 1.2 list landed after 22e0fb2 |
| "Added for reports" moves next to "Kept unchanged" | It lists what the kit added to Foundations; between the 1.2 and 2.0 lists it read as part of either |
| The design bundle's README carries section 15 | A reader of the bundle moving a 1.2 document needs the note |
| The gallery's revision-history specimen names v2.0 as its newest entry | `revisions` compares the newest entry with the page's masthead Version, which reads 2.0 |
| The gallery's Last updated and footer date read 2026-10-31 | The date of the change to 2.0 |
| The acceptance reference is First response time | It is the reference acceptance document (record 078), the guide links to it, and its clock rules hold the most exclusions a reader can miss |
| A Covered row of `docs/adoption.md` names what it leaves out and the record that keeps it out | A Covered status then reads the same in every row, and a gap in scope shows as Partial |
| Charts read Covered with nothing left: the library's chart empty states stay out | A chart with no data is left out, never drawn empty (§1 rule 12) |
| Non-visual equivalents stays Partial | Every diagram mode has its text version, but the library's node register for a large canvas has no kit counterpart |

## Changed

| File | Change |
| --- | --- |
| `kit/report-kit/SPEC.md` | Version 2.0; §1 rule 1 names a type's template; §2, §7 and §8.31 require `cm-id`; §8.3 and §8.19 state the claim line's place; §15 splits into Changed in 1.2 and Changed in 2.0 and holds the measured migration note |
| `checks/markup.mjs` | `head-order` expects 2.0 and requires `cm-id`; `doc-id` removed |
| `checks/structure.mjs` | `claim-wrapper` fails; `footer` names 2.0 |
| `checks/exempt.mjs` | `doc-id` leaves the gallery's exemptions |
| `checks/test.mjs`, `package.json` | The checks' own tests, `npm test` |
| `tools/migration.mjs`, `package.json` | The migration measure, `npm run migration` |
| `tools/bundle.mjs` | The bundle's README carries section 15 |
| `tools/index.mjs`, `kit/index.html` | Version 2.0 |
| Every kit document, template, `cm-report.css` and `cm-report.js` | Version 2.0 |
| `kit/Report Kit - Spec & Gallery.html` | Version 2.0, its date, the head example and the revision specimen; the updates table gains page types and diagrams, and its limitation lists the gaps of §15 |
| `kit/agent-brief.md` | Version 2.0, rule 1 and the claim line's place; commit pins unchanged |
| `CLAUDE.md` | Version 2.0, rule 1, the template list pointing at the spec's kit-files table, the test and migration tools |
| `README.md`, `docs/plan.md`, `docs/subprojects/` | Dated status: steps 6 and 8 done, the 2.0 release the one open step |
| `docs/adoption.md` | Labels follow the spec; Covered rows name what they leave out |
| `docs/decisions/090-handoff-repairs.md` | Its Left names record 086 |
| `docs/acceptance-questions.md` | The acceptance question set |

## Version

Every kit file reads 2.0, and every kit page passes the 2.0 checks. The orchestrating session tags
the release after the final authoring test.
