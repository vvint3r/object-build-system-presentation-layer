// Print kit pages to A4 PDFs as a browser prints them (printed backgrounds, the kit's own @page
// margins), and measure how the pages break. Page loading is shared with the checks (tools/load.mjs).
//
// Usage:  npm run print -- "kit/Sample Report - Q3 Support Review.html" [more pages…]
//         npm run print            (every page in kit/)
//
// For each page it writes <name>.pdf to .print/ and, beside it, the label texts to look for. When
// Python 3 with PyMuPDF (fitz) is installed, tools/print-measure.py then reports for each PDF: the
// page count; pages less than half used, other than the last; a last page that is nearly empty;
// headings, kickers and labels in the bottom tenth of a page; headings, labels and section ledes
// that end a page while what they introduce starts the next; and whether the pages are numbered.
// Without PyMuPDF it writes the PDFs and says the measure was skipped. It is a reading aid for
// authors, not a check: the numbers depend on fonts and the Chromium build.

import { chromium } from 'playwright';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from './load.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.print');
const args = process.argv.slice(2);
const pages = args.length ? args : readdirSync(path.join(ROOT, 'kit')).filter(f => f.endsWith('.html')).map(f => path.join('kit', f));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const file of pages) {
  const slug = path.basename(file, '.html').replace(/[^\w]+/g, '-').toLowerCase();
  const { page, errors } = await load(browser, file, 'print');
  // the texts that must not end a page: headings, part kickers, labels, and each section's lede
  const marks = await page.evaluate(() => {
    const text = e => e.innerText.replace(/\s+/g, ' ').trim();
    const shown = e => e.getClientRects().length > 0;
    const pick = (sel, kind) => [...document.querySelectorAll(sel)].filter(shown).map(e => ({ kind, text: text(e) })).filter(m => m.text);
    const ledes = [...document.querySelectorAll('.cm-section__body')].map(b => {
      const first = b.firstElementChild;
      const p = first && first.matches('.cm-prose') && first.nextElementSibling ? first.querySelector('p:last-child') : null;
      return p && shown(p) ? { kind: 'lede', text: text(p) } : null;
    }).filter(Boolean);
    return [
      ...pick('h1, h2, h3, h4, .cm-table-title', 'heading'),
      ...pick('.cm-section__num', 'kicker'),
      ...pick('.cm-figure__kind, .cm-table-title__kind, .cm-card__kicker, .cm-def__label, .cm-callout__label, .cm-label', 'label'),
      ...ledes,
    ];
  });
  const pdf = path.join(OUT, slug + '.pdf');
  await page.pdf({ path: pdf, format: 'A4', printBackground: true });
  writeFileSync(path.join(OUT, slug + '.json'), JSON.stringify({ file, marks }, null, 1));
  console.log(`${errors.length ? 'FAIL' : 'ok  '} ${path.relative(ROOT, pdf)}`);
  for (const e of errors) console.log(`     error: ${e}`);
  await page.close();
}
await browser.close();

const py = spawnSync('python3', [path.join(ROOT, 'tools', 'print-measure.py'), OUT, ...pages.map(f => path.basename(f, '.html').replace(/[^\w]+/g, '-').toLowerCase())], { encoding: 'utf8' });
if (py.error || py.status === 3) console.log('Measure skipped: it needs Python 3 with PyMuPDF (pip install pymupdf).');
else process.stdout.write(py.stdout + (py.stderr || ''));
