// Render kit pages in headless Chromium with ECharts served from node_modules, so charts draw
// where the jsDelivr CDN is unreachable. The page's own CDN URL is answered with the local copy
// of the same version; nothing in the page is changed.
//
// Usage:  npm install
//         npm run preview -- "kit/Sample Report - Q3 Support Review.html" [more pages…]
//
// For each page and theme (light, dark) it writes a full-page screenshot to .preview/ and prints
// console errors, failed requests and how many charts drew. Exit code 1 if any page has a script
// error or an undrawn chart. Google Fonts are left to load normally; if they are unreachable the
// page falls back to system faces and says so in the output.

import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
const ECHARTS_LOCAL = require.resolve('echarts/dist/echarts.min.js');
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
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
    const errors = [];
    const requests = [];
    await page.route(ECHARTS_URL, r => r.fulfill({ path: ECHARTS_LOCAL, contentType: 'application/javascript' }));
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
    page.on('requestfailed', r => requests.push(new URL(r.url()).host));
    await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle', timeout: 60000 });
    if (theme === 'dark') await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.evaluate(() => window.CM && window.CM.drawAll && window.CM.drawAll());
    await page.waitForTimeout(1200);
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
