# content-morphia presentation layer

Source of truth for **content-morphia**, the design system for a structured knowledge index. The
baseline is **Report Kit 1.1**: one stylesheet, one script, a template and an agent specification for
publishing reports, documents and analyses as single HTML files, with light, dark and print built in.

Claude Design, which now lives inside Claude, consumes the system. The system is authored here, not
there.

| Start here | For |
| --- | --- |
| [`kit/report-kit/SPEC.md`](kit/report-kit/SPEC.md) | The rules in force |
| [`kit/`](kit/) | The kit, the spec-and-gallery page, and a sample report |
| [`docs/open-items.md`](docs/open-items.md) | Questions about the kit that need a ruling |
| [`docs/adoption.md`](docs/adoption.md) | Features from the original library still to adopt |
| [`docs/plan.md`](docs/plan.md) | Operating model and migration order |
| [`docs/decisions/`](docs/decisions/README.md) | Why each rule exists |
| [`import/`](import/README.md) | The original exports, read-only |

## Status

As of 26 Oct 2026, migration steps 1 to 5 of 8 are done. The three exports are imported, the original
library's specification is split into dated decisions and reference rules, Report Kit 1.1 is the
baseline, its specification and code agree, and automated checks assert its rules on rendered pages.
Next is step 7: diagrams, charts and visualizations, built from the owner's reference set.

To preview the kit: `npm install`, then `npm run preview -- "kit/Sample Report - Q3 Support Review.html"`.
