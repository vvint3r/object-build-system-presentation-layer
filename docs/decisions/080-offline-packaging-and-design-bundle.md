# Offline packaging and the design bundle

- **Date:** 2026-10-30
- **Source:** the orchestrating session, under the owner's delegation in record 075; scope from
  record 076, `docs/subprojects/kit-features.md` and step 9 of `docs/plan.md`
- **Status:** in force

---

## Rules

Section 2 of `SPEC.md` holds a third packaging mode, Offline. One HTML file carries the kit's CSS
and JS, Nunito and JetBrains Mono as WOFF2 data, and ECharts 5.5.1. The pack tool writes it; no one
writes it by hand. The new checks are in `checks/offline.mjs`.

| Rule | Source | Check |
| --- | --- | --- |
| The head holds the font faces in place of the font links, the kit CSS pasted and ECharts inline | Spec §2 | `head-order`, failure (offline form) |
| The font faces are the only `<style>` beside the kit stylesheet | Spec §1 rule 2; §2 | `stylesheets`, failure (offline form) |
| The page makes no network request | Spec §2 | `offline-network`, failure |
| Text is set in the kit's faces, loaded from the file | Spec §1 rule 5; §2 | `offline-fonts`, failure |
| Inline `<code>` is JetBrains Mono at 0.8em and 600; a `.cm-code` block is 13px and 400, its file name 12px and 600 | Spec §4 | None; the stylesheet sets these values |

## Commands

| Command | Writes | From |
| --- | --- | --- |
| `npm run pack -- "<page>"` | `offline/<page file name>` | The page, `template.html`, the pinned `@fontsource/nunito` and `@fontsource/jetbrains-mono` packages, the installed `echarts` package |
| `npm run bundle` | `bundle/project/`, the Design System artifact files | `cm-report.css`, `cm-report.js`, the three templates, `SPEC.md`, the gallery, the example documents, the same packages |
| `npm run bundle:check` | Nothing; screenshots with `--shots <folder>` | The bundle, rendered as the Design System page renders it, with the network shut |

Both output folders are generated and git-ignored.

## Design bundle

| Path | Contents |
| --- | --- |
| `design-system.json` | The index: title Content Morphia, namespace `ContentMorphia`, ECharts as the one library, `editing: "code"` |
| `tokens.json`, `tokens.css` | Colour, shadow, radius, spacing, layout and type tokens; `tokens.css` compiled from them as the page compiles it |
| `README.md` | Sections 1 to 14 of the spec, with section 8 as an index of the components |
| `components/bundle.css` | `cm-report.css` without the declarations `tokens.css` carries |
| `components/bundle.js` | `cm-report.js`, assigning `window.ContentMorphia` |
| `components/lib/echarts.min.js` | ECharts 5.5.1 |
| `components/<Component>/` | `README.md` and `preview.html` for each gallery example of a spec section 8 component, Chart and Diagram |
| `components/Cover/preview.html` | The cover |
| `fonts/`, `licenses/` | The faces, their licences and ECharts' |
| `report-kit/` | The kit's stylesheet, script and three templates as they are |
| Example documents | The sample report, guide and reference as they are, at the bundle's root so their `report-kit/` links resolve |

## Calls

- **Offline file name.** The page's own file name in `offline/`, so links between packed pages keep
  working. The tool refuses a file that is already in `offline/`.
- **Faces.** The faces the template's Google Fonts link names, Latin subset, with that subset's
  unicode range. The kit pages also use arrows, triangles and a star. No Nunito subset has them, so
  the offline file draws them as the linked page does.
- **Recognising an offline page.** A page that carries a WOFF2 data URL is in the offline mode. The
  checks rebuild its font faces and ECharts from the template and the installed packages and compare
  them whole.
- **Agent brief.** An agent outside the repository never builds an offline file. The brief names the
  pack tool as the only way to make one.
- **Components.** One component per example in the gallery's section 5, tied to the spec section
  that defines it. Chart comes from the gallery's line chart, with spec section 9 as its rules.
  Diagram comes from the gallery's swimlane, which fits a 960px card whole, with section 8.20 whole. A spec section that
  defines several blocks gives each its own component and its own part of the section.
- **Token names.** The kit's custom properties without `--`. Spacing takes the two scales of section 5
  as `block-N` and `inset-N`; the page, reading, rail and bleed widths form a `layout` family.
- **Theme values.** A dark value only where the kit's dark block declares one; a `var()` colour is an
  alias. `cm-l2` takes the accent's value in each theme in `tokens.json` and stays in `bundle.css`
  as `var(--cm-accent)`, so print still turns it to the light accent.
- **Code type.** The stylesheet's values stand, and section 4 gives inline code and the code block a
  row each. The bundle's `Code` and `Code-block` type styles follow those rows.
- **Type styles.** Named by the rows of the type table. Each is measured on the rendered sample
  report, else on the gallery's examples, else on a probe with the row's class.
- **tokens.css.** Written by the tool, since a page with `editing: "code"` never saves one. Its first
  line ends "generated from tokens.json", which lets the page take it over.
- **Read-only page.** `editing: "code"` keeps the system's page read-only, since the repository is
  the source of truth. A change made in Claude Design comes back as a task.
- **README.** The spec's own text, without its history (section 15). En and em dashes in prose become
  words or commas; code keeps its characters.
- **Previews.** The gallery's example markup in `<main class="cm-main">`, with charts drawn without
  motion. Heights come from rendering each preview at 960px in both themes.
- **Kinds.** The bundle carries every template and every example document, one per kind. The README
  lists each with its kind, read from the page's `cm-kind` meta.
- **Cover.** An ink slab with its accent offset, as the featured card carries `cm-l2`. Chip pills
  with status offsets form the pattern. The name is set at 96px and weight 900.

## Version

The kit stays at 1.2. The version for this change is the orchestrating session's call.

## Status, 30 Oct 2026

| Item | Value |
| --- | --- |
| Offline sample report | 1,417 KB |
| Offline gallery | 1,482 KB |
| Offline guide | 1,392 KB |
| Offline reference | 1,390 KB |
| Parts of each offline file | Font faces 261 KB, ECharts 1,006 KB, kit CSS 52 KB, kit JS 57 KB |
| Checks on the four offline files, network shut | No failure, no warning; every chart and diagram drawn |
| Design bundle | 103 files, 1,731 KB: 36 components and the cover, three templates, three example documents, 41 colours in two themes, 15 type styles, 11 faces |
