# Colour and gradient exceptions

- **Date:** 2026-10-16
- **Source:** the owner's answers to the open items on colour and decoration, in session
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Code syntax colours | Code is an exception to black-or-white text: keywords, strings and numbers keep their syntax colours | `SPEC.md` rule 4 and section 8.17 name the exception. No code change |
| Verdict chip text in dark mode | The paper colour on the chip's ink fill is accepted as it is | `SPEC.md` rule 4 names the exception. No code change |
| Dashed timeline rail | A gradient is allowed where it carries meaning, and only there. The planned item's dashed rail qualifies; so does a chart's colour-scale legend, such as the heatmap's | `SPEC.md` rule 11 names both; section 9 forbids gradient fills in charts. No code change |

Decorative gradients still fail.

## Checks

`checks/colour.mjs`: text colour accepts each syntax token's own colour on `.cm-code .k`, `.s`
and `.n`, and the paper colour inside `.cm-chip--verdict`.
`checks/decoration.mjs`: the gradient check accepts the planned timeline item's rail.

## Version

The kit stays at 1.1.
