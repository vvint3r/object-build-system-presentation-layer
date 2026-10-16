// Open a kit page in headless Chromium, in one of three modes, with ECharts served from
// node_modules so charts draw where the jsDelivr CDN is unreachable. The page's own CDN URL is
// answered with the local copy of the same version; nothing in the page is changed.
//
// Shared by tools/preview.mjs and checks/run.mjs.
//
//   light  the light theme
//   dark   the dark theme (data-theme="dark")
//   print  print media emulated, then CM.beforePrint(), as a headless PDF pipeline does
//
// Returns the open page, the script and console errors it raised, and the hosts of any requests
// that failed. The caller closes the page.

import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
const ECHARTS_LOCAL = require.resolve('echarts/dist/echarts.min.js');

export const MODES = ['light', 'dark', 'print'];

export async function load(browser, file, mode) {
  if (!MODES.includes(mode)) throw new Error(`unknown mode: ${mode}`);
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: mode === 'dark' ? 'dark' : 'light',
  });
  const errors = [];
  const requests = [];
  await page.route(ECHARTS_URL, r => r.fulfill({ path: ECHARTS_LOCAL, contentType: 'application/javascript' }));
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
  page.on('requestfailed', r => requests.push(new URL(r.url()).host));
  if (mode === 'print') await page.emulateMedia({ media: 'print' });
  await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle', timeout: 60000 });
  if (mode === 'dark') await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  // Draw every chart, then redraw without animation so nothing is measured mid-transition.
  await page.evaluate(() => { if (window.CM && window.CM.drawAll) { window.CM.drawAll(); window.CM.redraw(false); } });
  if (mode === 'print') await page.evaluate(() => window.CM && window.CM.beforePrint && window.CM.beforePrint());
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.waitForTimeout(1200);
  return { page, errors, requests };
}
