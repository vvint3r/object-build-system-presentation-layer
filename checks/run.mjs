// Automated checks for kit pages: the hard rules and the pre-publish checklist in
// kit/report-kit/SPEC.md, asserted on the rendered page in light, dark and print.
//
// Usage:  npm run check -- <page.html> [more pages…] [--all]
//
// One line per page, mode and check:
//   ok    the check passed
//   FAIL  a rule is broken; the indented lines give where (a CSS path) and the computed value
//   warn  a check that needs judgment; it never changes the exit code
//   skip  the page is exempt from this check (checks/exempt.mjs)
// Checks on the page as written run once and report the mode as "all". Findings that share a
// value and an element kind are listed once with a count; at most 10 are listed per check, and
// --all lists every finding in full. Regions a page exempts from named checks are listed in
// checks/exempt.mjs. Exit code 1 if any check fails.

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, MODES } from '../tools/load.mjs';
import { install } from './page.mjs';
import { exemptFor, skippedFor } from './exempt.mjs';
import markup from './markup.mjs';
import colour from './colour.mjs';
import type from './type.mjs';
import radius from './radius.mjs';
import budgets from './budgets.mjs';
import decoration from './decoration.mjs';
import meaning from './meaning.mjs';
import charts from './charts.mjs';
import diagrams from './diagrams.mjs';
import figures from './figures.mjs';
import tables from './tables.mjs';
import structure from './structure.mjs';
import judgment from './judgment.mjs';
import navigation from './navigation.mjs';
import writing from './writing.mjs';

// Each module exports checks: { name, level: 'fail' | 'warn', source, once?, inPage | run }.
// inPage runs in the page with window.__cm (checks/page.mjs); run gets the Playwright page and
// what the loader collected. Both return findings: [{ where, value }].
const CHECKS = [markup, colour, type, radius, budgets, decoration, meaning, charts, diagrams, figures, tables, structure, judgment, navigation, writing].flat();

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.join(ROOT, 'kit', 'report-kit');
const read = f => readFileSync(f, 'utf8');
const css = read(path.join(KIT, 'cm-report.css'));
const js = read(path.join(KIT, 'cm-report.js'));
const template = read(path.join(KIT, 'template.html'));

// The classes cm-report.css defines: every class selector, with comments, strings and url()
// removed first so file names and numbers are not read as classes.
const classes = [...new Set([...css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""')
  .replace(/url\([^)]*\)/g, '')
  .matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m => m[1]))];

// The head the template prescribes: its theme pre-paint script and its Google Fonts URL. Comments
// go first, since the template's opening comment mentions <script> and <style>.
const head = template.slice(0, template.indexOf('</head>')).replace(/<!--[\s\S]*?-->/g, '');
const kit = {
  css,
  js,
  prepaint: (head.match(/<script>([\s\S]*?)<\/script>/) || [])[1] || '',
  fonts: (head.match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"/) || [])[1] || '',
};

const args = process.argv.slice(2);
const all = args.includes('--all');
const pages = args.filter(a => a !== '--all');
if (!pages.length) {
  console.error('Usage: npm run check -- <page.html> [more pages…] [--all]');
  process.exit(2);
}

const LIMIT = 10;
// The last step of a CSS path without positions or ids: findings with the same value on the same
// kind of element are one finding.
const kind = where => (where.split(' > ').pop() || '').replace(/:nth-of-type\(\d+\)/g, '').replace(/#[\w-]+/g, '').replace(/ text ".*"$/, ' text');

function report(name, mode, check, found) {
  const status = !found.length ? 'ok  ' : check.level === 'fail' ? 'FAIL' : 'warn';
  console.log(`${status}  ${name}  ${mode.padEnd(5)}  ${check.name}  (${check.source})`);
  if (all) {
    for (const f of found) console.log(`        ${f.where}  ${f.value}`);
  } else {
    const groups = new Map();
    for (const f of found) {
      const k = `${f.value}\u0000${kind(f.where)}`;
      if (groups.has(k)) groups.get(k).n++; else groups.set(k, { ...f, n: 1 });
    }
    const list = [...groups.values()];
    for (const g of list.slice(0, LIMIT)) console.log(`        ${g.where}  ${g.value}${g.n > 1 ? `  (and ${g.n - 1} more like it)` : ''}`);
    if (list.length > LIMIT) console.log(`        and ${list.length - LIMIT} more; --all lists every one`);
  }
  return found.length > 0 && check.level === 'fail';
}

const browser = await chromium.launch();
let failed = false;
for (const file of pages) {
  const name = path.basename(file);
  const cfg = { exempt: exemptFor(name), classes, kit, src: read(file) };
  const skipped = skippedFor(name);
  for (const [i, mode] of MODES.entries()) {
    const { page, errors, requests } = await load(browser, file, mode);
    await page.evaluate(install, cfg);
    for (const check of CHECKS) {
      if (check.once && i > 0) continue;
      if (skipped.includes(check.name)) {
        console.log(`skip  ${name}  ${(check.once ? 'all' : mode).padEnd(5)}  ${check.name}  (${check.source})`);
        continue;
      }
      let found;
      try {
        found = check.inPage
          ? await page.evaluate(check.inPage, { mode, check: check.name })
          : await check.run({ page, errors, requests, mode, file, cfg });
      } catch (e) {
        found = [{ where: '(check error)', value: String(e.message).split('\n')[0] }];
        failed = true;
      }
      if (report(name, check.once ? 'all' : mode, check, found)) failed = true;
    }
    await page.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
