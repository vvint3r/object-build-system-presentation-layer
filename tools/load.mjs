// Open a kit page in headless Chromium, in one of three modes, with ECharts served from
// node_modules so charts draw where the jsDelivr CDN is unreachable. The page's own CDN URL is
// answered with the local copy of the same version; nothing in the page is changed.
//
// Shared by tools/preview.mjs and checks/run.mjs.
//
//   light  the light theme
//   dark   the dark theme (data-theme="dark")
//   print  print media emulated, then CM.beforePrint(), as a headless PDF pipeline does
//   phone  the light theme in a 390px viewport, the width of a phone held upright
//
// An offline page (SPEC section 2) loads with the network shut: every request that is not to a
// file is aborted and listed in `blocked`, so the page shows what it draws with nothing but itself.
//
// Returns the open page, the script and console errors it raised, the hosts of any requests that
// failed, and, for an offline page, every request it tried to make. The caller closes the page.

import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
const ECHARTS_LOCAL = require.resolve('echarts/dist/echarts.min.js');

export const MODES = ['light', 'dark', 'print'];
// The phone pass: the checks marked `phone` run once more in this viewport (checks/run.mjs).
export const PHONE = { width: 390, height: 844 };
// The printed column of an A4 page inside the kit's 14mm side margins, and the page body height
// inside its 16mm top and bottom margins, in CSS pixels. Checks that measure the printed layout
// set the viewport to this size.
export const PRINT_PAGE = { width: 688, height: 1001 };
const VIEWPORT = { width: 1440, height: 900 };

// Answer the page's ECharts CDN request with the local copy of the same version.
export const serveCharts = page => page.route(ECHARTS_URL, r => r.fulfill({ path: ECHARTS_LOCAL, contentType: 'application/javascript' }));

export async function load(browser, file, mode, { offline = false } = {}) {
  if (!MODES.includes(mode) && mode !== 'phone') throw new Error(`unknown mode: ${mode}`);
  const page = await browser.newPage({
    viewport: mode === 'phone' ? PHONE : VIEWPORT,
    colorScheme: mode === 'dark' ? 'dark' : 'light',
  });
  const errors = [];
  const requests = [];
  const blocked = [];
  if (offline) {
    await page.route(() => true, r => {
      const url = r.request().url();
      if (/^(file|data|blob):/.test(url)) return r.continue();
      blocked.push(url.length > 120 ? url.slice(0, 120) + '…' : url);
      return r.abort('internetdisconnected');
    });
  } else {
    await serveCharts(page);
  }
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
  // Park the pointer outside the viewport so no element is measured in its hover state.
  await page.mouse.move(-1, -1);
  await page.waitForTimeout(1200);
  return { page, errors, requests, blocked };
}
