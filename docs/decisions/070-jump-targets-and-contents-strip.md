# Jump targets and contents strip

- **Date:** 2026-10-30
- **Source:** the owner's approval of the recommended answers, record 069
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Contents strip on narrow screens | The current link keeps its normal weight and is marked in a way that keeps its width; the wide rail keeps its bold | `cm-report.css`: at 1150px and below the current link is weight 400 with a 2px ink underline, 4px below the text, on the track fill it already had. `SPEC.md` §5 states it. `checks/navigation.mjs`: `strip-current` fails a page whose strip link changes width, or whose strip changes height, when it becomes current, at 390 and 820px in light and dark |

## Calls taken

- **Ink underline.** The underline is ink, 2px thick and 4px below the text, the thickness and offset of the callout label underline. On the track fill, ink measures 18.6:1 in light and 15.1:1 in dark. The accent, the colour of link underlines, measures 2.1:1 in light and would make the current link read as the one link in the strip. The track fill stays, so the strip and the wide rail share it.

## Version

The kit stays at 1.1 until the twelve answers of record 069 are in the kit and every kit page passes
the checks.
