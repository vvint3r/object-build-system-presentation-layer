# Agent copy name

Date: 3 November 2026

## Owner instruction

> Keep the design system as the generated copy for agents; yes, that's fine, but let's rename it to "agent" so it's clear, while the user-facing one is the user-facing one.

## Ruling

The design bundle keeps its role: a generated, read-only copy of the kit in the Design System artifact
format, read by Claude Design and other agents. Its title is "Content Morphia Report Kit for Agents".
The gallery, published as "Content Morphia Report Kit", is the copy for people. The brand name on
the bundle's cover stays "Content Morphia".

## Effect

`tools/bundle.mjs` writes the title into `design-system.json` and `tokens.css`; `tools/bundle-cover.mjs`
and `tools/bundle-check.mjs` carry the same title. No kit file, token or component changes.
