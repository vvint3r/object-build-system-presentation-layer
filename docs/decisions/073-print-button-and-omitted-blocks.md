# Print button and omitted blocks

- **Date:** 2026-10-30
- **Source:** the owner's approval of the recommended answers, record 069
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Print button | Optional: a document shows it only when it is asked to carry one. Browser printing works without it | `SPEC.md`: section 7 item 1 makes the button optional and gives its markup; section 12 names both ways to print; section 14 item 2 states the top bar. `checks/structure.mjs`: `topbar` asks for exactly one theme toggle and at most one print button. Template and sample report: no print button; the template keeps the button's markup in a comment at its place. Gallery: the anatomy table's top bar row. `kit/agent-brief.md`: the request decides whether the button appears |
| Documents without measured numbers | The agent brief's reading stands: a required block whose content does not exist is left out, with a comment at its place saying why. Nothing is invented to fill it | `SPEC.md`: section 7 lists the four blocks, their names and where each omission comment sits; section 1 rule 7 and the section 6 budget allow no featured card when Recommendations is left out; section 2 gives the title without a period; section 14 items 2, 3 and 7. `checks/page.mjs`: a helper that finds an omission comment. `summary-anatomy`, `masthead`, `head-order` and `featured` accept the commented omission and fail a block missing without it. Template: the rule in its opening comment. Gallery: the anatomy prose and three checklist items. `kit/agent-brief.md`: the comment form and the four blocks, with no expected failures left. `CLAUDE.md` and the brief: non-negotiable 7 |

## Decisions taken without a ruling

- **Gallery print button.** The gallery keeps its print button: it is the kit's one live example of
  the optional control, and the gallery is a reference that readers print. The gallery stays exempt
  from the `topbar` check, as a catalogue.
- **Template.** The template carries the print button's markup in a comment where the button goes,
  so a document asked to carry one adds it without another source.
- **Omission comment.** The form is `<!-- cm-omit {name}: {reason} -->`: a fixed prefix in the
  kit's `cm-` namespace, one name per block from a closed set of four (`kpi-strip`, `period`,
  `title-period`, `recommendations`), and a reason after the colon. A comment with another name, with
  no reason, or in free wording is not an omission comment, and the block's check still fails.
- **Place.** Each check looks for the comment where the block would be: the KPI strip's in the
  executive summary section, the Period field's in `dl.cm-mast__meta`, the title period's in
  `<head>`, and the Recommendations section's in `<main>`. A comment anywhere else does not count. A
  comment cannot sit inside `<title>`, so the title period's comment follows it in the head. The
  spec names the exact spot; the checks accept the comment anywhere inside the named container.
- **Two period names.** The masthead field and the title are two places with two checks, so each
  carries its own comment.
- **Featured card.** Section 1 rule 7 allows no featured card when the Recommendations section is
  left out, since the card lives in that section; the summaries of rule 7 in `CLAUDE.md` and the
  brief say the same. Two or more featured cards still fail.
- **Block present.** An omission comment beside a block that is present changes nothing: the block
  is checked as usual.
- **Checklist.** Section 14 states the top bar in item 2 and carries the omission exception inside
  items 2, 3 and 7, rather than in new items, so the item numbers the checks cite stay the same. The
  gallery's checklist follows.

## Version

The kit stays at 1.1 until the twelve answers in record 069 are in the kit and every kit page passes
the checks. It then becomes 1.2.
