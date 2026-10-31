// Regions a page exempts from named checks, or from every check with '*'. A region is a selector;
// an element inside it is skipped by the checks listed, and everything outside it is checked like
// any report. `outside` narrows a region to what is not inside that selector. An entry with `page`
// instead of a selector skips the checks it lists for the whole page; the run prints them as skip.
// No rule changes for an exemption: a report has none of these regions.
//
// The gallery is a catalogue (record 063): its demos ([data-demo]) are components and are checked
// like a report's; the scaffolding around them is the gallery's own helper layer.
//
// Each entry names the page (its file name), the region, the checks and the reason.

const GALLERY = 'Report Kit - Spec & Gallery.html';

export const EXEMPT = [
  {
    page: GALLERY,
    selector: '.g-src',
    checks: ['*'],
    why: 'The markup listing the gallery script writes under each demo: source code shown as text, '
      + 'with the gallery\'s own copy button. It is not part of the page being judged.',
  },
  {
    page: GALLERY,
    selector: '[data-demo]',
    checks: ['featured', 'summary', 'emph', 'section-limits', 'callouts', 'figure-numbers', 'report-anatomy'],
    why: 'Each demo shows one component on its own, out of report order. Counts and order across a '
      + 'report (one featured card, one summary, figure numbers in sequence, callouts per '
      + 'section, where the sources list sits) do not apply to a specimen. Every rule about how a '
      + 'component looks or is built still applies inside a demo.',
  },
  {
    page: GALLERY,
    selector: 'head > style',
    checks: ['stylesheets'],
    why: 'The gallery\'s helper stylesheet: layout for the catalogue (component blocks, swatches, '
      + 'listings). Reports never carry one.',
  },
  {
    page: GALLERY,
    selector: '.g-sw',
    outside: '[data-demo]',
    checks: ['*'],
    why: 'Colour swatches: token values drawn as tiles, with their names. Specimens of tokens, not '
      + 'components. A swatch class inside a demo is still checked.',
  },
  {
    page: GALLERY,
    selector: 'body',
    outside: '[data-demo]',
    checks: ['classes', 'inline-styles', 'block-gap'],
    why: 'The scaffolding around the demos lays the catalogue out with helper classes and inline '
      + 'spacing. Inside a demo, markup is held to every rule, since readers copy it.',
  },
  {
    page: GALLERY,
    whole: true,
    checks: ['head-order', 'doc-id', 'topbar', 'masthead', 'summary-anatomy', 'report-anatomy', 'footer', 'methodology', 'table-numbers'],
    why: 'Report anatomy: the gallery is not a report, so it carries no kit meta, report masthead, '
      + 'summary with KPIs and findings, sources appendix, methodology or report footer, its top '
      + 'bar links to the sample report, and it numbers its tables by section (Table 2.1).',
  },
];

export const exemptFor = name => EXEMPT
  .filter(x => x.page === name && !x.whole)
  .map(({ selector, outside, checks }) => ({ selector, outside, checks }));

// Checks a page skips entirely.
export const skippedFor = name => EXEMPT
  .filter(x => x.page === name && x.whole)
  .flatMap(x => x.checks);
