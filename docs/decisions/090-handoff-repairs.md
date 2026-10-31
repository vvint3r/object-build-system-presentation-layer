# Hand-off repairs

- **Date:** 2026-10-30
- **Source:** a report built by an agent from the design bundle alone, its 40 friction items and its
  three failed checks, through the orchestrating session's brief; choices taken by the session under
  the delegation in record 075
- **Status:** in force

---

## Rules

| Rule | Spec |
| --- | --- |
| Distribution, a source's publisher and a source's locator take an omission comment when not recorded | §7.1, §7.5, §8.21 |
| A source's date word comes from a closed set: published, refreshed, exported, recorded, accessed, `as of` for a snapshot, `covers` with two dates for a period | §8.21 |
| A number given without its source carries a note saying no source is recorded; a KPI strip's numbers are sourced where they reappear in the body | §1 rule 12, §8.2, §8.21 |
| A KPI foot names its reference with its value (a target, an earlier value or a comparison), then in `<b>` the standing against it unless the delta states it | §8.2 |
| An action carries an impact chip only when its impact is estimated; its date chip reads `Due` or `Decide by` | §8.19 |
| Recommendations holds the featured card, then at most one callout | §7.2 |
| Methodology is required with a KPI strip, a chart or a table; Terms comes first, and Data sources and Queries follow when the report has them | §7, §7.2 |
| The type chip: Report reviews a period, Analysis investigates one question, Brief is a short briefing | §7.2 |
| A report's title names its period after a comma; `<title>` gives the same words with ` · ` | §2, §7.2 |
| A document stands alone unless it sits in a folder beside its set's index page; alone, its set and area steps are spans and its wordmark links to `#top` | §7.1 |
| The title wraps at 22 characters a line, so no word in it runs longer | §7.1, §13.1 |
| Reading time counts every word a reader sees, chips, KPI values and table cells among them | §7.1 |
| Prose between headings runs from one heading to the next; figure and table titles are headings | §13.1 |
| Durations take a number and a letter for each unit, largest first; a chip writes the unit as a word | §13.2 |
| A delta keeps the case it is written in | §4 |
| A cell that does not apply reads `n/a`; a dash never stands for a value | §8.11 |
| Value labels carry thousands separators and the chart's precision; chart values are numbers | §9 |
| A chart sets no `legend`: one series, end labels that name every line and a slope chart have none | §9 |
| A slope target is a `markLine` whose label gives its value; lines not picked out are drawn in `$context` by the kit | §9 |
| Section 2's linked snippet is the whole `<head>` block after the `cm-` meta tags | §2 |

Section 15 lists the omissions, date words, delta case, `n/a` cells and value labels among the 1.2
changes, and gives the migration from 1.2 to 2.0.

## Checks

| Check | Level | Reads |
| --- | --- | --- |
| `masthead` | failure | A byline with Prepared by, and Distribution or its omission comment |
| `claim-wrapper` | warning | The claim line is the item's own first child, with no wrapper; a warning in 1.2, since the 1.2 templates wrapped it |
| `source-entries` | failure | A locator or its omission comment; a date word from the closed set; two dates after `covers`, one after any other word |
| `label-type` | failure | A delta in the case written; every other label in capitals |
| `value-labels` | failure | Each bar, line, slope and bullet value label shows its value with separators at the chart's precision |
| `chart-legend` | failure | No `legend` key in a chart's JSON |
| `table-na` | failure | No cell holds a lone dash |
| `table-values`, `table-num` | failure | `n/a` reads as a value that does not apply |

`npm run bundle:check` adds one check for each class of bundle defect.

| Check | Reads |
| --- | --- |
| `components/bundle.js` | The namespace is the global `cm-report.js` assigns, with no second name for it |
| Component index | Rows in spec order, in the order of the bundle header |
| Section numbers | Every § number names a section of the README or a component README; no gallery number remains |
| Headings | No README ends on a heading or holds one with nothing under it |
| Links | Every link in a document or README reaches a bundle file and its id; documents and templates sit beside `report-kit/` |
| Files named | Every file a README or a document's notes names is in the bundle, apart from the platform's paths, the repository's tools and placeholders |
| Documented | Every root entry, component folder and platform path has its row in the README |

## Bundle

| Path | Holds |
| --- | --- |
| `template*.html` | The templates beside `report-kit/`, linking `report-kit/cm-report.css` and `report-kit/cm-report.js`; their notes name `README.md` |
| Example documents | As in the kit, in the form a document takes outside a set |
| `report-kit/` | `cm-report.css` and `cm-report.js` |
| `components/bundle.js` | `cm-report.js` under the format's header line; the namespace is `CM` |
| `README.md` | Opens with how § numbers map to the README and the component READMEs, and with the documents standing alone; its Files table names the cover, the index and the platform's paths |
| Component READMEs | In spec order; a gallery number in a lead names its spec section; a shared section's part starts at its heading |

## Calls

| Decision | Reason |
| --- | --- |
| A missing audience, publisher or locator takes an omission comment, not a relaxed rule | One mechanism for every gap keeps the set of forms closed, and the comment records the gap instead of hiding it |
| `as of` and `covers` join the closed set of date words | A snapshot and a coverage period are real source dates; a closed list keeps the dates checkable |
| A number without a source carries a note; no source is guessed | Rule 12 stays whole and no invention slips in |
| The KPI foot holds a reference and its standing, never a source | The strip carries no sources (§14 item 4); one meaning per slot keeps like things alike |
| The impact chip is optional and only for an estimate | An invented estimate is worse than none |
| Methodology follows from the blocks that show numbers | "Computed" has no test; a KPI strip, chart or table can be checked |
| A dash in a table gives way to `n/a` | One rule for dashes everywhere; `n/a` says what the cell means |
| A delta keeps its written case | Units such as `s` and `pp` change meaning in capitals |
| Value labels follow the chart's precision, from numbers | The fix sits in the kit, so a writer never formats a label or writes a number as a string |
| The legend key leaves the JSON | `legend: false` has no effect; the kit decides when a legend shows |
| Templates sit beside `report-kit/` in the bundle | A template copied whole then links the kit as a document does |
| Bundled documents take the standalone form | The bundle has no set index, and the format reserves `index.html` for the platform's page |
| The namespace is `CM` | A document and a preview then use one global, the one the spec names |
| Components follow spec order | A section number then finds its README by position |
| A wrapped finding or action warns and does not fail | A document copied from the 1.2 templates is not at fault; `cm-id` follows the same path to 2.0 |
| The KPI foot names its reference with its value: a target, an earlier value or a comparison | The roadmap and case study read against a comparison and a before value; one form covers every reference |

Record 074's call that tables keep the em dash gives way to `n/a`. Record 080's bundle layout takes the
template placement and namespace above.

## Left

The diagram's screen-width capacity, how `col` and `row` read when a flow runs down, and how a
branch ends partway through a flow are left to a separate session.
