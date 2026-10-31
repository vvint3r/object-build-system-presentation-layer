// Write the offline form of kit pages (SPEC section 2): one HTML file each, with the kit's CSS and
// JS, ECharts 5.5.1 and the Nunito and JetBrains Mono faces inside it, so it renders with no
// network at all. The source page is read, never changed.
//
// Usage:  npm run pack -- "kit/Sample Report - Q3 Support Review.html" [more pages…]
//
// Each page is written to offline/ under its own file name (offline/ is generated and git-ignored).
// A page that is not a kit page in linked or self-contained mode is refused with the reason.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pack } from './offline.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'offline');

const pages = process.argv.slice(2);
if (!pages.length) {
  console.error('Usage: npm run pack -- <page.html> [more pages…]');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

const kb = n => `${(n / 1024).toFixed(0)} KB`;
let failed = false;
for (const file of pages) {
  const out = path.join(OUT, path.basename(file));
  if (path.resolve(file) === out) { console.log(`FAIL ${file}: already in offline/`); failed = true; continue; }
  try {
    const { html, parts } = pack(readFileSync(file, 'utf8'));
    writeFileSync(out, html);
    console.log(`ok   ${path.relative(process.cwd(), out)}  ${kb(Buffer.byteLength(html))}`
      + `  (fonts ${kb(parts.fonts)}, ECharts ${kb(parts.echarts)}, kit CSS ${kb(parts.css)}, kit JS ${kb(parts.js)})`);
  } catch (e) {
    console.log(`FAIL ${file}: ${e.message}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
