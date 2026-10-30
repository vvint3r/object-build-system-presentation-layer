# Jump targets and contents strip

- **Date:** 2026-10-30
- **Source:** the owner's approval of the recommended answers, record 069
- **Status:** in force

---

## Rulings

| Item | Ruling | Changed |
| --- | --- | --- |
| Jump targets under the top bar | Every linked target clears the top bar by an offset that follows the bar's height | `cm-report.css`: the fixed offsets, 58px on sections and 80px on notes, give way to one rule: every element with an `id` stops 24px below the top bar, whose height it reads from `--cm-topbar-h`, or 54px until the script runs. `cm-report.js` measures the bar into `--cm-topbar-h` at load and whenever its size changes, and sets 0 on a page without one. `SPEC.md` §5 states it, and its table of kit files and the gallery's script tile name it. `checks/navigation.mjs`: `jump-targets` follows every in-page link at 390, 570, 820 and 1440px in light and dark, and fails a target that stops under the bar, below the window, or nearer than 24px to the bar where the page can scroll that far |
| Contents strip on narrow screens | The current link keeps its normal weight and is marked in a way that keeps its width; the wide rail keeps its bold | `cm-report.css`: at 1150px and below the current link is weight 400 with a 2px ink underline, 4px below the text, on the track fill it already had. `SPEC.md` §5 states it. `checks/navigation.mjs`: `strip-current` fails a page whose strip link changes width, or whose strip changes height, when it becomes current, at 390 and 820px in light and dark |

## Calls taken

- **One rule on every element with an `id`.** A link can only reach an element with an `id`, so `scroll-margin-top` on `[id]` covers sections, notes, footnote markers, table titles, figures, disclosures, and any wrapper or heading an author links to, with no list to keep in step. Scroll padding on the page stops targets in the same place, but also shortens each Page Down and Space scroll by the offset (from 738 to 670px in a 1440 by 844 window), which the answer does not ask for.
- **24px below the bar.** The gap is the spacing floor between distinct blocks. Under a one-row bar, sections stop 20px lower than the former 58px offset put them, and notes 2px higher than the former 80px.
- **54px until the script runs.** The fallback is the one-row bar. Without the script, targets clear a one-row bar; the extra rows of a wrapped bar still cover them.
- **Instant jumps in the check.** `jump-targets` follows each link under reduced motion, which the kit already reads as instant scrolling, so the check runs in seconds. On the sample report and the gallery, at 390, 480, 570, 820 and 1440px, 170 smooth jumps end where the instant ones do.
- **Strip before offsets.** The strip change is committed first, since a strip that changed height moved the page while a jump was under way.
- **Ink underline.** The underline is ink, 2px thick and 4px below the text, the thickness and offset of the callout label underline. On the track fill, ink measures 18.6:1 in light and 15.1:1 in dark. The accent, the colour of link underlines, measures 2.1:1 in light and would make the current link read as the one link in the strip. The track fill stays, so the strip and the wide rail share it.

## Version

The kit stays at 1.1 until the twelve answers of record 069 are in the kit and every kit page passes
the checks.
