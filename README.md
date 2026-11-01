# content-morphia presentation layer

Source of truth for **content-morphia**, the design system for a structured knowledge index. The
kit in force is **Report Kit 2.0**: one stylesheet, one script, a template for each document kind
(report, guide and reference) and page type, and an agent specification for publishing documents as single HTML
files, with light, dark and print built in.

Claude Design, which now lives inside Claude, consumes the system. The system is authored here, not
there.

| Start here | For |
| --- | --- |
| [`kit/report-kit/SPEC.md`](kit/report-kit/SPEC.md) | The rules in force |
| [`kit/`](kit/) | The kit, the spec-and-gallery page, and a sample report, guide and reference |
| [`kit/agent-brief.md`](kit/agent-brief.md) | Instructions for agents in other environments that build documents on the kit |
| [`docs/open-items.md`](docs/open-items.md) | Questions about the kit that need a ruling |
| [`docs/adoption.md`](docs/adoption.md) | Features from the original library still to adopt |
| [`docs/plan.md`](docs/plan.md) | Operating model and migration order |
| [`docs/decisions/`](docs/decisions/README.md) | Why each rule exists |
| [`import/`](import/README.md) | The original exports, read-only |

## Status

As of 31 Oct 2026, migration steps 1 to 8 of 9 are done, and no item is open. Steps 6 and 8 put the
diagrams, chart recipes, document kinds, page types, provenance, change and status, and document
sets into the kit ([`docs/plan.md`](docs/plan.md)).

The kit's files carry version 2.0. The 2.0 release is the one open step: an agent given only the
design bundle builds a document that passes the checks, and the release is tagged (step 9). Section
15 of the spec lists what changes from 1.2, and how a 1.2 document moves to 2.0.

## Commands

Run `npm install` once first. A command that takes a page takes its path in quotes.

| Command | Result |
| --- | --- |
| `npm run preview -- "<page>"` | Screenshots of the page in light and dark, in `.preview/` |
| `npm run check -- "<page>"` | The kit's checks on the page, in light, dark and print |
| `npm test` | The checks' own tests: a page that passes, and copies broken one way each that must fail |
| `npm run index -- "<folder>"` | The index page of a document set, written from its documents |
| `npm run links -- "<folder>"` | Every link, id and breadcrumb across a document set's folder |
| `npm run migration` | The kit pages of Report Kit 1.2 checked with this kit's checks: the measure behind the migration note |
| `npm run pack -- "<page>"` | The page's offline form in `offline/`: one file with the fonts and ECharts inside, for reading with no network |
| `npm run bundle` | The design bundle in `bundle/project/`: the kit in the Design System artifact format, for Claude Design |
| `npm run bundle:check` | The bundle checked against that format, with every preview rendered in light and dark |
