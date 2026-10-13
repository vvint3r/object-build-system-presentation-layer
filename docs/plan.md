# Plan

How content-morphia is built from here, and the order of the work.

## Operating model

```
Repository (this one)  ──build──▶  Design bundle  ──/design-sync──▶  Claude Design
source of truth                    generated, never                  "Content Morphia View Layer"
tokens · rules · components        hand-edited                       compose, review, export
```

- **The repository is the source of truth.** Tokens, rules, components, the visualization kit and
  the documentation pages are authored here, in Claude Code. Every change is a commit.
- **The design bundle is a build output.** A script emits the layout Claude Design's design-system
  projects use: one `styles.css`, a `readme.md`, foundation and component preview pages carrying
  `<!-- @dsCard group="…" -->` markers, and templates.
- **Claude Design is a consumer.** The bundle is pushed with `/design-sync` to the Claude Design
  project **Content Morphia View Layer** (project id `109effa9-4b07-492a-af04-fbda145be4f9`).
  Documents are composed there on the system. Nothing about the system is edited there; a finding
  made there comes back as a task and is fixed here.
- **The visualization kit is part of this repository.** It owns the build logic for diagrams and
  charts: display logic, structure, formats, layout and routing rules. It takes all styling from
  content-morphia's tokens and defines none of its own. A second kit for complex diagram authoring,
  in the manner of Eraser, builds on it.
- **Content rules become data.** The writing rules for content (word limits, register, per-heading
  constraints) go into a content schema that components read their limits from and that the checks
  assert. They are not prose in `CLAUDE.md`.

## Migration

| Step | Work | State |
| --- | --- | --- |
| 1 | Land both exports unchanged under `import/` | Done |
| 2 | Split history from current state: decision records, `rules.md`, `open-items.md`, a short `CLAUDE.md` | Done; open items await the owner |
| 3 | Make tokens the runtime: one token source, the twelve components consume it by variable | Next |
| 4 | Turn the lint and sweep scripts into tests that assert computed styles on rendered pages | |
| 5 | Port the visualization kit; implement the lane-flow router with its scraps as fixtures | |
| 6 | Restyle the kit on content-morphia tokens | |
| 7 | Build the bundle and the documentation pages from the repository; sync to Claude Design | |

Steps 5 and 6 can run in parallel with step 4 once step 3 is done.

## Target layout

```
tokens/            one source: colour, type, spacing, depth
rules/             each invariant as a test
components/        the cm-* set, consuming tokens
viz/
  diagrams/        node kit, connectors, terminators
  router/          lane-flow spline router
  authoring/       diagram as data: nodes and edges in, layout and routes out
  charts/          chart specifications
content-schema/    field names, types, limits, presentation
library/           the documentation pages, generated
bundle/            generated; what /design-sync pushes
docs/
  spec/            rules.md, open-items.md
  decisions/       one record per ruling
import/            the two exports, read-only
```
