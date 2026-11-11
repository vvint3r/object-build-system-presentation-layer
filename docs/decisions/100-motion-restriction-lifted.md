# Motion restriction lifted

Date: 11 November 2026

## Owner instruction

> Where do you see the report kit motion rule? Where is that set? I want to remove that for now.

## Ruling

Section 10 of the specification no longer limits motion to charts and no longer prohibits other
animation. The sentences "Only charts move; diagrams draw static" and "Agents MUST NOT add other
animation" are removed. Diagrams and other figures may animate.

The removal is provisional. No replacement motion rules are set by this record; rules for animated
diagrams and stepped figures are to be written when that work is taken up.

## Effect

`kit/report-kit/SPEC.md` section 10 keeps its description of what the kit does: the chart draw-in,
the theme-switch redraw, and static drawing under `prefers-reduced-motion`, print, background tabs
and headless rendering. No stylesheet, script, template, check or agent-brief text changes; the rule
was stated in section 10 only and no check asserted it.

The design bundle's `README.md` is generated from the specification, so the Design System artifact
carries the old sentence until `npm run bundle` is run and the bundle is synced again.
