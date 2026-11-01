# Kit features

Step 8 of `docs/plan.md`: the features a knowledge index needs beyond a single report, adopted from
the library into the kit. Record 076 sets their scope.

| Date | State |
| --- | --- |
| 2026-10-30 | Direction set (record 076); round 2 starts provenance, change and status, document kinds and offline packaging |
| 2026-10-30 | Offline packaging in the kit (record 080): `npm run pack` writes the offline form, and the sample report, guide, reference and gallery in that form pass the checks with the network shut |
| 2026-10-31 | Done: the Provenance, Change and status, Wayfinding, Multi-page navigation, Structured components and Page types rows of `docs/adoption.md` read Covered (records 078, 079, 082, 083 and 087 to 090) |

## Scope

| Feature | Adds | Round |
| --- | --- | --- |
| Document kinds | Report, guide and reference, each with its own required parts, set by `<meta name="cm-kind">` | 2 |
| Offline packaging | A third packaging mode with Nunito, JetBrains Mono and ECharts inside the file | 2 |
| Provenance | Source register, citations that tie a claim to its sources, evidence dates, disagreement between sources | 2 |
| Change and status | Dated status block, change log, revision history, limitation register | 2 |
| Navigation | Stable document addresses, breadcrumbs, related documents, a generated index | 3 |
| Structured components | Workflow, framework, model, method, requirement and evaluation, metric detail | 3 |
| Page types | Topic, framework, process, guide, module, metric, comparison, roadmap, reference, glossary and case study, as templates on the three kinds | 4 |

The step is done when the Provenance, Change and status, Wayfinding, Multi-page navigation,
Structured components and Page types rows of `docs/adoption.md` read Covered, and a document in the
offline mode passes the checks.

## Document kinds

- **Report:** the anatomy in section 7 of the spec, unchanged.
- **Guide:** purpose, prerequisites, steps, exceptions and recovery, related documents. No executive
  summary or KPI strip.
- **Reference:** definition, properties, relationships, examples, sources. Built for lookup.
- Each kind has its own anatomy check. The `cm-omit` comment stays for a required block a document
  of that kind cannot fill.
- Acceptance documents: the sample report, a process guide and a reference page. The guide and the
  reference page are written in round 2 on real subject matter and grow as features land.

## Provenance

- A source has a stable id, title, publisher or author, date, locator and type.
- A claim cites one or more sources by id; the citation opens the source entry and returns to the
  claim.
- An evidence date says how current a figure or claim is.
- Disagreement between sources is stated with both values and their sources. Source count never
  implies confidence.
- The library's aggregation header, agreement and spread, and confidence qualifier are adopted only
  where an acceptance document uses them.

## Change and status

- The dated status block holds the numbers that change, with their date, as section 13 of the spec
  requires.
- A change log lists dated changes to the document; a revision history lists its versions.
- A limitation register lists known limits with their effect and status.

## Navigation

Stable document addresses, breadcrumbs, a related-documents block and a generated index page.
Search, faceted browse and a version selector with diff need a server and stay out of the kit.

## Rules for each session

- Rebuild in kit terms, per `docs/adoption.md`: classes, behaviour, spec, gallery example, checks.
- New spec text goes under section 8 as a new subsection; the gallery gains the example under its
  components part.
- No bold label runs into the text that follows it; labels are their own line, a heading or a table
  row.
