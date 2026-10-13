# content-morphia presentation layer

Source of truth for **content-morphia**, the design system for a structured knowledge index: tokens,
rules, components, the diagram and chart kit, and the content schema.

Claude Design consumes the system through `/design-sync` into the project **Content Morphia View Layer**.
The system is authored here, not there.

| Start here | For |
| --- | --- |
| [`docs/spec/rules.md`](docs/spec/rules.md) | The rules in force |
| [`docs/spec/open-items.md`](docs/spec/open-items.md) | Conflicts that need a ruling |
| [`docs/plan.md`](docs/plan.md) | Operating model and migration order |
| [`docs/decisions/`](docs/decisions/README.md) | Why each rule exists |
| [`import/`](import/README.md) | The original Claude Design exports, read-only |

## Status

Migration steps 1 and 2 of 7 are done: both exports are imported, and the specification is split into
current rules, open items and dated decision records. Next is step 3: one token source that the
components consume at runtime.
