// Render kit pages in headless Chromium with ECharts served from node_modules, so charts draw
// where the jsDelivr CDN is unreachable. Page loading is shared with the checks (tools/load.mjs).
//
// Usage:  npm install
//         npm run preview -- "kit/Sample Report - Q3 Support Review.html" [more pages…]
//
// For each page and theme (light, dark) it writes a full-page screenshot to .preview/ and prints
// console errors, failed requests and how many charts drew. Exit code 1 if any page has a script
// error or an undrawn chart. Google Fonts are left to load normally; if they are unreachable the
// page falls back to system faces and says so in the output.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { load } from './load.mjs';

const OUT = '.preview';

const pages = process.argv.slice(2);
if (!pages.length) {
  console.error('Usage: npm run preview -- <page.html> [more pages…]');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
let failed = false;
for (const file of pages) {
  for (const theme of ['light', 'dark']) {
    const { page, errors, requests } = await load(browser, file, theme);
    const charts = await page.evaluate(() => ({
      total: document.querySelectorAll('.cm-chart').length,
      drawn: document.querySelectorAll('.cm-chart svg').length,
    }));
    const shot = path.join(OUT, `${path.basename(file, '.html').replace(/[^\w-]+/g, '-')}-${theme}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    const ok = !errors.length && charts.drawn === charts.total;
    if (!ok) failed = true;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${theme.padEnd(5)} charts ${charts.drawn}/${charts.total}  ${shot}`);
    for (const e of errors) console.log(`     error: ${e}`);
    const unreachable = [...new Set(requests)];
    if (unreachable.length) console.log(`     unreachable: ${unreachable.join(', ')}${unreachable.some(h => h.includes('fonts.g')) ? ' (fonts fell back to system faces)' : ''}`);
    await page.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
