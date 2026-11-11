# Third-party explainer skills

Date: 11 November 2026

## Owner instruction

> merge the PR and install the core skills

## Ruling

Five third-party skill sets are installed in this repository for building explanatory pages:
visual-explainer, diagram-design, gsap-skills, d3-power-tools and the
visualization-strategy-and-critique skill of OpenAI's build-web-data-visualization plugin. They are
copied in under `.claude/` at the commits that were reviewed, not installed from a marketplace: a
cloud session loads committed skills and agents but does not install plugins a repository declares.

The skills supply method. They do not change the kit. `kit/report-kit/SPEC.md` stays the authority
on styling, and where a skill's own style guide, palette, typeface or chart library differs from the
specification, the specification wins. Section 9's ECharts method still governs quantitative charts.

## Effect

`.claude/skills/` holds 23 skills, `.claude/agents/` the three d3-power-tools critics and
`.claude/vendor/` the libraries and map data the D3 examples load. `.claude/third-party/README.md`
lists each source, its commit, its licence, the changes made to it and what was left out, and
`.claude/third-party/licenses/` holds the licence texts. No kit file, check or tool changes.
