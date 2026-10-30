# content-morphia presentation layer

Source of truth for **content-morphia**, the design system for a structured knowledge index. The
kit in force is **Report Kit 1.2**: one stylesheet, one script, a template and an agent specification
for publishing reports, documents and analyses as single HTML files, with light, dark and print built
in.

Claude Design, which now lives inside Claude, consumes the system. The system is authored here, not
there.

| Start here | For |
| --- | --- |
| [`kit/report-kit/SPEC.md`](kit/report-kit/SPEC.md) | The rules in force |
| [`kit/`](kit/) | The kit, the spec-and-gallery page, and a sample report |
| [`kit/agent-brief.md`](kit/agent-brief.md) | Instructions for agents in other environments that build documents on the kit |
| [`docs/open-items.md`](docs/open-items.md) | Questions about the kit that need a ruling |
| [`docs/adoption.md`](docs/adoption.md) | Features from the original library still to adopt |
| [`docs/plan.md`](docs/plan.md) | Operating model and migration order |
| [`docs/decisions/`](docs/decisions/README.md) | Why each rule exists |
| [`import/`](import/README.md) | The original exports, read-only |

## Status

As of 30 Oct 2026, migration steps 1 to 5 and 7 of 9 are done, and Report Kit 1.2 is released. The
three exports are imported, and the original library's specification is split into dated decisions
and reference rules. The kit's specification and code agree, and automated checks assert its rules on
rendered pages.

Report Kit 1.2 carries the writing rules (step 7) and the answers to every open item; no item is
open. Steps 6 and 8 are next ([`docs/plan.md`](docs/plan.md)).

To preview the kit: `npm install`, then `npm run preview -- "kit/Sample Report - Q3 Support Review.html"`.
