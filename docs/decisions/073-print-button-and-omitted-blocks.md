# Print button and omitted blocks

- **Date:** 2026-10-30
- **Source:** the owner's approval of the recommended answers, record 069
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Print button | Optional: a document shows it only when it is asked to carry one. Browser printing works without it | `SPEC.md`: section 7 item 1 makes the button optional and gives its markup; section 12 names both ways to print; section 14 item 2 states the top bar. `checks/structure.mjs`: `topbar` asks for exactly one theme toggle and at most one print button. Template and sample report: no print button; the template keeps the button's markup in a comment at its place. Gallery: the anatomy table's top bar row. `kit/agent-brief.md`: the request decides whether the button appears |

## Decisions taken without a ruling

- **Gallery print button.** The gallery keeps its print button: it is the kit's one live example of
  the optional control, and the gallery is a reference that readers print. The gallery stays exempt
  from the `topbar` check, as a catalogue.
- **Template.** The template carries the print button's markup in a comment where the button goes,
  so a document asked to carry one adds it without another source.
- **Checklist.** Section 14 states the top bar in item 2, beside the masthead, rather than in a new
  item, so the item numbers the checks cite stay the same.

## Version

The kit stays at 1.1 until the twelve answers in record 069 are in the kit and every kit page passes
the checks. It then becomes 1.2.
