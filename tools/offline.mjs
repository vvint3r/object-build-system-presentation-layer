// The parts of the offline packaging mode (SPEC section 2), shared by tools/pack.mjs, which writes
// offline files, by checks/run.mjs, which recognises them, and by tools/bundle.mjs, which ships the
// same font files in the design bundle.
//
//   faces()      the faces the template's Google Fonts link loads, each with its WOFF2 file from the
//                pinned @fontsource packages (Latin subset) and that subset's unicode-range
//   fontCss()    one @font-face rule per face, the font data inline as base64
//   echarts()    the text of ECharts 5.5.1 from the installed echarts package
//   pack(html)   a page in linked or self-contained mode, as one offline file
//
// Nothing here reaches the network: every byte comes from node_modules and the kit's own files.

import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.join(ROOT, 'kit', 'report-kit');
const read = f => readFileSync(f, 'utf8');

export const ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
export const ECHARTS_VERSION = '5.5.1';

// The kit files the offline file carries.
export const kitFiles = () => ({
  css: read(path.join(KIT, 'cm-report.css')),
  js: read(path.join(KIT, 'cm-report.js')),
  template: read(path.join(KIT, 'template.html')),
});

// The Google Fonts stylesheet URL the template prescribes (SPEC section 2).
export function fontsUrl(template = kitFiles().template) {
  const head = template.slice(0, template.indexOf('</head>')).replace(/<!--[\s\S]*?-->/g, '');
  const url = (head.match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]*)"/) || [])[1];
  if (!url) throw new Error('template.html has no Google Fonts stylesheet link');
  return url.replace(/&amp;/g, '&');
}

// Faces named by a css2 URL: family=Nunito:ital,wght@0,300;1,400&family=JetBrains+Mono:wght@400.
export function parseFontsUrl(url) {
  const out = [];
  for (const [, spec] of new URL(url).search.matchAll(/[?&]family=([^&]+)/g)) {
    const [name, axes = ''] = decodeURIComponent(spec.replace(/\+/g, ' ')).split(':');
    const [keys, values] = axes.split('@');
    const cols = keys ? keys.split(',') : [];
    for (const tuple of (values || '400').split(';')) {
      const v = tuple.split(',');
      const get = k => (cols.indexOf(k) > -1 ? v[cols.indexOf(k)] : undefined);
      out.push({ family: name, weight: get('wght') || '400', style: get('ital') === '1' ? 'italic' : 'normal' });
    }
  }
  return out;
}

// The @fontsource package for a family: "JetBrains Mono" → @fontsource/jetbrains-mono.
const pkgOf = family => '@fontsource/' + family.toLowerCase().replace(/\s+/g, '-');

function pkgDir(family) {
  const pkg = pkgOf(family);
  try { return path.dirname(require.resolve(`${pkg}/package.json`)); } catch (e) {
    throw new Error(`${pkg} is not installed; run npm install (it is a pinned devDependency)`);
  }
}

// The Latin subset's unicode-range, as the package's own stylesheet for that weight states it.
function latinRange(dir, slug, weight, style) {
  const sheet = path.join(dir, `${weight}${style === 'italic' ? '-italic' : ''}.css`);
  const css = existsSync(sheet) ? read(sheet) : '';
  const block = css.split('@font-face').find(b => b.includes(`${slug}-latin-${weight}-${style}.woff2`));
  const m = block && block.match(/unicode-range:\s*([^;]+);/);
  return m ? m[1].trim() : null;
}

export function faces(template) {
  return parseFontsUrl(fontsUrl(template)).map(f => {
    const dir = pkgDir(f.family);
    const slug = path.basename(pkgOf(f.family));
    const file = path.join(dir, 'files', `${slug}-latin-${f.weight}-${f.style}.woff2`);
    if (!existsSync(file)) throw new Error(`no Latin WOFF2 for ${f.family} ${f.weight} ${f.style} in ${pkgOf(f.family)}`);
    const pkg = JSON.parse(read(path.join(dir, 'package.json')));
    const licence = read(path.join(dir, 'LICENSE')).split('\n')[0].replace(/\s+\S+\[wght\]\.ttf:.*$/, '').trim();
    return { ...f, file, name: path.basename(file), range: latinRange(dir, slug, f.weight, f.style), pkg: `${pkg.name}@${pkg.version}`, licence };
  });
}

// One @font-face rule per face, each on one line, under a comment naming the fonts' copyright and
// licence. The output depends only on the template and the installed packages, so a check can
// rebuild it and compare.
export function fontCss(template) {
  const list = faces(template);
  const notices = [...new Map(list.map(f => [f.family, f.licence])).values()];
  const lines = list.map(f => {
    const data = readFileSync(f.file).toString('base64');
    return `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;`
      + `src:url(data:font/woff2;base64,${data}) format('woff2')${f.range ? `;unicode-range:${f.range}` : ''}}`;
  });
  return `/* ${[...new Set(list.map(f => f.pkg))].join(', ')}, Latin subset. ${notices.join(' ')} SIL Open Font License 1.1. */\n${lines.join('\n')}\n`;
}

export function echarts() {
  const file = require.resolve('echarts/dist/echarts.min.js');
  const pkg = JSON.parse(read(path.join(path.dirname(file), '..', 'package.json')));
  if (pkg.version !== ECHARTS_VERSION) throw new Error(`echarts ${pkg.version} is installed; the kit pins ${ECHARTS_VERSION}`);
  return read(file);
}

// Text that would end or escape the inline element holding it.
export const unsafeInline = (text, tag) => new RegExp(`</${tag}|<!--`, 'i').test(text);

const same = (a, b) => a.replace(/\r\n/g, '\n').trim() === b.replace(/\r\n/g, '\n').trim();

// A kit page in linked or self-contained mode, as one offline file. Throws on anything it cannot
// place, rather than writing a file that would still reach the network.
export function pack(html, kit = kitFiles()) {
  const fonts = fontCss(kit.template);
  const charts = echarts();
  const url = fontsUrl(kit.template);
  for (const [text, tag, what] of [[kit.css, 'style', 'cm-report.css'], [kit.js, 'script', 'cm-report.js'], [charts, 'script', 'ECharts']]) {
    if (unsafeInline(text, tag)) throw new Error(`${what} holds </${tag} or <!--, so it cannot sit inline`);
  }
  const headEnd = html.search(/<\/head>/i);
  if (headEnd < 0) throw new Error('no </head>');
  let head = html.slice(0, headEnd);
  let body = html.slice(headEnd);
  const tags = re => [...head.matchAll(re)].map(m => m[0]);
  // A tag with the indentation before it and the line break after it, so removing it leaves no gap.
  const lineOf = t => new RegExp(`[ \\t]*${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ \\t]*\\r?\\n?`);
  const attr = (tag, a) => ((tag.match(new RegExp(`\\s${a}\\s*=\\s*"([^"]*)"`, 'i')) || [])[1] || '').replace(/&amp;/g, '&');

  // Fonts: the preconnects go, and the Google Fonts link becomes the inline faces.
  const fontLinks = tags(/<link\b[^>]*>/gi).filter(t => /fonts\.(googleapis|gstatic)\.com/.test(attr(t, 'href')));
  const sheet = fontLinks.filter(t => /stylesheet/i.test(attr(t, 'rel')));
  if (sheet.length !== 1) throw new Error(`expected one Google Fonts stylesheet link, found ${sheet.length}`);
  if (attr(sheet[0], 'href') !== url) throw new Error(`the Google Fonts link differs from template.html's:\n  page:     ${attr(sheet[0], 'href')}\n  template: ${url}`);
  for (const t of fontLinks) {
    head = t === sheet[0] ? head.replace(t, () => `<style>\n${fonts}</style>`) : head.replace(lineOf(t), '');
  }

  // Kit CSS: the link becomes the stylesheet; a page already self-contained keeps its copy.
  const cssLink = tags(/<link\b[^>]*>/gi).find(t => /stylesheet/i.test(attr(t, 'rel')) && /(^|\/)cm-report\.css$/.test(attr(t, 'href')));
  if (cssLink) head = head.replace(cssLink, () => `<style>\n${kit.css}</style>`);
  else if (![...head.matchAll(/<style>([\s\S]*?)<\/style>/gi)].some(m => same(m[1], kit.css))) throw new Error('no kit stylesheet: neither a cm-report.css link nor the pasted copy');

  // ECharts: the CDN script becomes the library itself.
  const chartTag = tags(/<script\b[^>]*><\/script>/gi).find(t => attr(t, 'src') === ECHARTS_URL);
  if (!chartTag) throw new Error(`no ECharts ${ECHARTS_VERSION} script from ${ECHARTS_URL}`);
  head = head.replace(chartTag, () => `<script>${charts}</script>`);

  // Kit JS: the linked script moves to the end of the body, as in the self-contained mode.
  const jsTag = tags(/<script\b[^>]*><\/script>/gi).find(t => /(^|\/)cm-report\.js$/.test(attr(t, 'src')));
  if (jsTag) {
    head = head.replace(lineOf(jsTag), '');
    const close = body.search(/<\/body>/i);
    if (close < 0) throw new Error('no </body>');
    body = body.slice(0, close) + `<script>\n${kit.js}</script>\n` + body.slice(close);
  } else {
    const pasted = [...body.matchAll(/<script>([\s\S]*?)<\/script>/gi)].some(m => same(m[1], kit.js));
    if (!pasted) throw new Error('no kit script: neither a cm-report.js link nor the pasted copy');
  }

  const out = head + body;
  // Nothing may still point outside the file. Script and style contents are the kit's, ECharts and
  // the fonts, checked above; what remains is the page's own markup and any helper stylesheet of
  // its own. Links to other pages are navigation, not resources.
  const skeleton = out.replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2');
  const ownStyles = [...skeleton.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).filter(t => t !== `\n${fonts}` && !same(t, kit.css)).join('\n');
  const markup = skeleton.replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2');
  const left = [
    ...[...markup.matchAll(/<(?:script|img|iframe|audio|video|source|embed|track|input)\b[^>]*\ssrcset?\s*=\s*"([^"]+)"/gi)].map(m => m[1]),
    ...[...markup.matchAll(/<link\b[^>]*>/gi)].map(m => attr(m[0], 'href')),
    ...[...(markup + ownStyles).matchAll(/url\(\s*["']?([^"')\s]+)/gi)].map(m => m[1]),
    ...[...ownStyles.matchAll(/@import\s+(?:url\()?["']?([^"')\s;]+)/gi)].map(m => m[1]),
  ].filter(u => u && !u.startsWith('data:') && !u.startsWith('#'));
  if (left.length) throw new Error(`references outside the file remain: ${[...new Set(left)].join(', ')}`);
  return { html: out, parts: { fonts: fonts.length, css: kit.css.length, js: kit.js.length, echarts: charts.length } };
}
