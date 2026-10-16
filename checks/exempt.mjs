// Regions a page exempts from named checks, or from every check with '*'. A region is a selector;
// an element inside it is skipped by the checks listed, and everything outside it is checked like
// any report. No rule changes for an exemption: a report has none of these regions.
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
    checks: ['featured', 'summary', 'emph', 'section-limits', 'callouts', 'figure-numbers', 'table-numbers', 'report-anatomy'],
    why: 'Each demo shows one component on its own, out of report order. Counts and order across a '
      + 'report (one featured card, one summary, figure and table numbers in sequence, callouts per '
      + 'section, where the sources list sits) do not apply to a specimen. Every rule about how a '
      + 'component looks or is built still applies inside a demo.',
  },
];

export const exemptFor = name => EXEMPT
  .filter(x => x.page === name)
  .map(({ selector, checks }) => ({ selector, checks }));
