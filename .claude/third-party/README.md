# Third-party skills

Skills from outside this repository, copied in at the commit that was reviewed. They supply method
for explanatory pages: how to structure an explanation, draw a diagram, choose and review a chart,
and sequence motion. `kit/report-kit/SPEC.md` stays the authority on styling. Where a skill's own
style guide, palette, typeface or chart library differs from the specification, the specification
wins.

Cloud sessions load skills and agents committed under `.claude/`; they do not install plugins a
repository declares in its settings. So each source is a copy, not a marketplace entry.

## Sources

| Source | Commit | Licence | Installed as |
| --- | --- | --- | --- |
| [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) 0.15.0 | `9d5f880b7e8e0a9a80c890b8e1bb6918b68481ad` | MIT | `skills/visual-explainer/` |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) 2.6 | `f2496acbde9f45ccb55c24d4f75210c8a1355df8` | MIT | `skills/diagram-design/` |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd3277740755f6bfc1155c7aa645403b760` | MIT | `skills/gsap-core/`, `gsap-frameworks/`, `gsap-performance/`, `gsap-plugins/`, `gsap-react/`, `gsap-scrolltrigger/`, `gsap-timeline/`, `gsap-utils/` |
| [syntagmatic/d3-power-tools](https://github.com/syntagmatic/d3-power-tools) 3.0.0 | `922b4c1212b7e3c05580535b0e32379a3c70e565` | ISC | `skills/d3-accessibility/`, `d3-design/`, `d3-hierarchy/`, `d3-interaction/`, `d3-legibility/`, `d3-maps/`, `d3-motion/`, `d3-networks/`, `d3-patterns/`, `d3-rendering/`, `d3-review/`, `d3-time/`; `agents/encoding-auditor.md`, `interaction-tester.md`, `viz-critic.md`; `vendor/` |
| [openai/plugins](https://github.com/openai/plugins), `build-web-data-visualization` 0.1.21 | `d420d13051bffe4543ed39e30fa46b87148e47dd` | MIT, declared in the plugin manifest; the source has no licence file | `skills/visualization-strategy-and-critique/` |

Licence texts are in `licenses/`. `vendor/README.md` lists the libraries and map data the D3 examples
load, with their licences.

## Changes from the source

Every file is as the source has it, except:

- **visual-explainer.** The plugin folder without its `.claude-plugin/` manifest, so it loads as a
  skill.
- **d3-power-tools.** Each skill folder and its `name` take a `d3-` prefix: the source names
  (`design`, `motion`, `review`, `time`) are too general outside a plugin. `scripts/probe.mjs` sits in
  `skills/d3-review/scripts/`, and the review skill and the three critics name that path where the
  source says `<plugin-root>/scripts/probe.mjs`. The review skill says to run `npm install` in the
  repository root, not the plugin root. The source's `vendor/` is at `.claude/vendor/`, where the
  examples' relative paths reach it.
- **visualization-strategy-and-critique.** The plugin's shared `references/foundations/` and its
  `assets/templates/advanced-interactive-visualization-contract.md` are copied into the skill
  folder, and `SKILL.md` reads them there (`references/`, `assets/`) where the source says
  `../../references/` and `../../assets/`.

## Not installed

- The d3-power-tools hook that renders a page after every file write, its `check-snippets.mjs` and
  `hook-render-check.mjs`.
- The other 17 skills of `build-web-data-visualization`. The strategy skill and its foundation
  references link to some of them (`../gantt-chart-visualization/`,
  `../scrollytelling-and-parallax-data-visualization/`,
  `../uml-and-software-architecture-visualization/`); those links lead nowhere here. The skill's
  steps that name Codex image generation or Codex delegation do not apply.

## Updating

Review the source at the new commit, including its scripts. Copy it over the installed folders,
make the changes above again, and put the new commit in the table.
