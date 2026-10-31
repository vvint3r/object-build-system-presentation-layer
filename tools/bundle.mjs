// Write the design bundle: the kit in the Design System artifact format, generated from this
// repository, in bundle/project/ (generated, git-ignored). The orchestrating session publishes it.
//
// Usage:  npm run bundle            then  npm run bundle:check
//
// Every value comes from the kit's files: tokens from cm-report.css, type sizes from the gallery as
// rendered, rules from SPEC.md, component markup from the gallery's live examples, fonts from the
// pinned @fontsource packages and ECharts from the installed echarts package.
//
//   tokens.json · tokens.css      the kit's colour, shadow, radius and layout tokens, spacing and type
//   README.md                     usage rules for an agent that builds on the system, from SPEC.md
//   components/bundle.css         cm-report.css without the declarations tokens.css now carries
//   components/bundle.js          cm-report.js under the format's header line; it assigns window.CM
//   components/lib/echarts.min.js ECharts 5.5.1
//   components/<Comp>/            README.md and preview.html for each component of SPEC section 8,
//                                 Chart and Diagram; components/Cover/preview.html, the system's cover
//   fonts/ · licenses/            the WOFF2 faces and the licences of what the bundle carries
//   report-kit/                   cm-report.css and cm-report.js as they are
//   template*.html · <example>.html  the kit's templates and example documents, beside report-kit/,
//                                 each in the form a document takes outside a set (SPEC 7.1)
//   design-system.json            the index, written last

import { chromium } from 'playwright';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ECHARTS_VERSION, faces, kitFiles, unsafeInline } from './offline.mjs';
import { compileTokens, frameDocument } from './ds-frame.mjs';
import { load } from './load.mjs';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'bundle', 'project');
const FRAMES = path.join(ROOT, 'bundle', 'frames');
const GALLERY = path.join(ROOT, 'kit', 'Report Kit - Spec & Gallery.html');
const TITLE = 'Content Morphia';
const NS = 'CM';                               // the global cm-report.js assigns, so a document and a preview share one name
const LIB = { name: 'echarts', version: ECHARTS_VERSION, global: 'echarts', file: 'components/lib/echarts.min.js' };

const read = f => readFileSync(f, 'utf8');
const kit = kitFiles();
const spec = read(path.join(ROOT, 'kit', 'report-kit', 'SPEC.md'));
const gallery = read(GALLERY);
const KIT_VERSION = (kit.template.match(/<meta name="cm-kit" content="([^"]+)">/) || [])[1];
if (!KIT_VERSION) throw new Error('template.html has no cm-kit meta');

const files = new Map();                       // path under project/ → text or Buffer
const put = (p, data) => files.set(p, data);

// ---------- SPEC.md ----------

// "## 3. Tokens" → { '3': { title, body } }, and the same for "### 8.4 Callouts" inside a section.
function split(md, level) {
  const out = {};
  const re = new RegExp(`^${'#'.repeat(level)} (\\d+(?:\\.\\d+)?)\\.? (.+)$`, 'gm');
  const heads = [...md.matchAll(re)];
  heads.forEach((m, i) => {
    out[m[1]] = { title: m[2].trim(), body: md.slice(m.index + m[0].length, i + 1 < heads.length ? heads[i + 1].index : md.length).trim() };
  });
  return out;
}
const S = split(spec, 2);
const S8 = split(S['8'].body, 3);
const rows = md => md.split('\n').filter(l => /^\|/.test(l) && !/^\|\s*-/.test(l)).map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim())).slice(1);
const plain = s => s.replace(/`/g, '').replace(/\*\*/g, '');
const sentences = md => md.split(/\n\n+|\n(?=- |\d+\. )/).map(p => p.replace(/^(- |\d+\. )/, '').replace(/\n/g, ' '))
  .flatMap(p => p.split(/(?<=[.!?])\s+(?=[A-Z*`(])/)).map(x => x.trim()).filter(Boolean);

// Prose without en or em dashes, as the writing rules require; code and code spans keep theirs.
function undash(md) {
  return md.split(/(```[\s\S]*?```)/).map((part, i) => (i % 2 ? part : part.split(/(`[^`\n]*`)/).map((t, j) => (j % 2 ? t : t
    .replace(/\|\s*—\s*(?=\|)/g, '| none ')
    .replace(/(\d)\s*–\s*(\d)/g, '$1 to $2')
    .replace(/([A-Za-z]\d?)–([A-Za-z]?\d)/g, '$1 to $2')
    .replace(/\s+—\s+/g, ': ')
    .replace(/\s*[–—]\s*/g, ', '))).join(''))).join('');
}

// ---------- tokens from cm-report.css ----------

const blockOf = selector => {
  const i = kit.css.indexOf(`${selector}{`);
  if (i < 0) throw new Error(`cm-report.css has no ${selector} block`);
  const start = i + selector.length + 1;
  return { start, end: kit.css.indexOf('}', start), body: kit.css.slice(start, kit.css.indexOf('}', start)) };
};
// Declarations in a token block, each with the comment on the line above it, if any.
function declarations(body) {
  const out = [];
  let pending = '';
  for (const line of body.split('\n')) {
    const c = line.match(/^\s*\/\*\s*([\s\S]*?)\s*\*\/\s*$/);
    if (c) { pending = c[1]; continue; }
    for (const m of line.matchAll(/(--[\w-]+|color-scheme)\s*:\s*([^;]+);/g)) out.push({ name: m[1], value: m[2].trim(), comment: pending });
    if (line.trim()) pending = '';
  }
  return out;
}
const LIGHT = blockOf(':root');
const DARK = blockOf('[data-theme="dark"]');
const light = declarations(LIGHT.body);
const dark = new Map(declarations(DARK.body).map(d => [d.name, d.value]));
const tokenCss = (kit.css.slice(0, LIGHT.start) + kit.css.slice(DARK.end)).replace(/\/\*[\s\S]*?\*\//g, '');   // the rules, without the token blocks or comments
const usersOf = name => [...new Set([...tokenCss.matchAll(new RegExp(`([^{}]+)\\{[^}]*var\\(${name}[,)][^}]*\\}`, 'g'))]
  .flatMap(m => m[1].split(',').map(s => s.trim().replace(/^.*\*\/\s*/, '')))
  .filter(s => s && !s.startsWith('@') && !/^(html|:root)\b/.test(s)))];
const jsReads = new Set((kit.js.match(/function tokens\(\)[\s\S]*?\.forEach/) || [''])[0].match(/'[\w-]+'/g)?.map(s => `--cm-${s.slice(1, -1)}`) || []);
const usedBy = name => {
  const u = usersOf(name);
  const css = u.length ? `Used by ${u.slice(0, 5).join(', ')}${u.length > 5 ? ` and ${u.length - 5} more` : ''}.` : '';
  const js = jsReads.has(name) ? ' cm-report.js reads it into CM.tokens() for charts.' : '';
  return (css + js).trim() || 'Declared by the kit; no class or script uses it.';
};

const COLOR_VALUE = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))$/;
const kind = d => {
  if (d.name === 'color-scheme' || /^--cm-(font|mono)$/.test(d.name)) return 'keep';
  if (/^--cm-[sl]\d/.test(d.name)) return 'shadow';
  if (/^--cm-r-/.test(d.name)) return 'radius';
  if (COLOR_VALUE.test(d.value) || /^var\(--cm-[\w-]+\)$/.test(d.value)) return 'color';
  return 'layout';
};
const tokenName = n => n.replace(/^--/, '');
const lc = v => (v.startsWith('#') ? v.toLowerCase() : v.replace(/\s+/g, ''));
const asColor = v => (/^var\(--([\w-]+)\)$/.test(v) ? `{${v.match(/^var\(--([\w-]+)\)$/)[1]}}` : lc(v));

// Contrast, for the text colours' notes.
const rgb = v => {
  if (v.startsWith('#')) { let h = v.slice(1); if (h.length <= 4) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  return v.match(/[\d.]+/g).slice(0, 3).map(Number);
};
const lum = c => { const [r, g, b] = rgb(c).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const valueIn = (name, theme) => {
  const v = theme === 'dark' && dark.has(name) ? dark.get(name) : light.find(d => d.name === name)?.value;
  const ref = v && v.match(/^var\((--[\w-]+)\)$/);
  return ref ? valueIn(ref[1], theme) : v;
};
const TEXT_PAIRS = {
  '--cm-ink': ['--cm-paper', '--cm-surface', '--cm-canvas', '--cm-track'],
  '--cm-on-solid': ['--cm-accent', '--cm-ok', '--cm-warn', '--cm-crit', '--cm-info', '--cm-note'],
  '--cm-code-kw': ['--cm-surface'], '--cm-code-str': ['--cm-surface'], '--cm-code-num': ['--cm-surface'],
};
const contrastNote = name => (TEXT_PAIRS[name] ? ' Contrast: ' + TEXT_PAIRS[name].map(g =>
  `on ${tokenName(g)} ${['light', 'dark'].map(t => ratio(valueIn(name, t), valueIn(g, t)).toFixed(1)).join(' light, ')} dark`).join('; ') + ' (to 1).' : '');

const specTokens = rows(S['3'].body);
function colorUsage(d) {
  const n = tokenName(d.name);
  const short = n.replace(/^cm-/, '');
  const row = specTokens.find(r => {
    const cell = r[0];
    if (cell.includes(`\`${d.name}\``) || new RegExp(`\\$${short}\\b(?!-)`).test(cell)) return true;
    const wild = cell.match(/`--cm-\*-(\w+)`/);
    if (wild && new RegExp(`^cm-\\w+-${wild[1]}$`).test(n)) return true;
    const seq = short.match(/^(seq)-\d$/);
    return !!(seq && cell.includes(`$${seq[1]}`));
  });
  const base = row ? `${plain(row[3])}.` : d.comment ? `${d.comment.replace(/^[\w\s]+:\s*/, '').replace(/^./, c => c.toUpperCase())}.` : '';
  return `${base}${base && !row ? ' ' : ''}${row ? '' : usedBy(d.name)}${contrastNote(d.name)}`.replace(/\.\./g, '.').trim();
}

const color = light.filter(d => kind(d) === 'color').map(d => {
  const value = { light: asColor(d.value) };
  if (dark.has(d.name)) value.dark = asColor(dark.get(d.name));
  return { name: tokenName(d.name), value, usage: colorUsage(d) };
});

const elevation = rows(S['6'].body);
const shadow = light.filter(d => kind(d) === 'shadow').map(d => {
  const lit = theme => (theme === 'dark' && dark.has(d.name) ? dark.get(d.name) : d.value)
    .replace(/var\((--[\w-]+)\)/g, (_, v) => valueIn(v, theme));
  const value = { light: lit('light') };
  if (dark.has(d.name) || /var\(/.test(d.value)) value.dark = lit('dark');
  const level = elevation.find(r => r[0].toLowerCase() === tokenName(d.name).replace(/^cm-/, ''));
  let usage = level ? `${plain(level[1])}: ${level[2].toLowerCase()}. Budget: ${plain(level[3]).toLowerCase()}.` : usedBy(d.name);
  if (/var\(/.test(d.value)) usage += ` components/bundle.css keeps ${d.name}: ${d.value}, so it follows that token in every theme and in print.`;
  return { name: tokenName(d.name), value, usage };
});

const rule10 = (S['1'].body.match(/^10\. (.+)$/m) || [])[1];
const radius = light.filter(d => kind(d) === 'radius').map(d => ({ name: tokenName(d.name), value: d.value, usage: usedBy(d.name) }));

const layoutSentences = sentences(S['5'].body);
const bleedNarrow = kit.css.match(/@media \(max-width:(\d+px)\)\{\s*:root\{--cm-bleed:([^;}]+)\}/);
const layout = light.filter(d => kind(d) === 'layout').map(d => {
  const stem = tokenName(d.name).replace(/^cm-/, '');
  const names = s => new RegExp(`\\b${stem}\\b`, 'i').test(s.replace(/`[^`]*`/g, ''));
  const gives = s => s.includes(d.value) && !/ apart\b/.test(s);
  const said = layoutSentences.find(s => names(s) && gives(s)) || layoutSentences.find(gives) || layoutSentences.find(names);
  let usage = said ? plain(said.replace(/^- /, '')) : usedBy(d.name);
  if (d.name === '--cm-bleed' && bleedNarrow) usage += ` Below ${bleedNarrow[1]} wide it is ${bleedNarrow[2]}, set in components/bundle.css.`;
  return { name: tokenName(d.name), value: d.value, usage };
});

// Spacing: the two scales of SPEC section 5.
const scale = label => {
  const m = S['5'].body.match(new RegExp(`${label}[^:]*:\\s*([\\d ·]+)px`));
  if (!m) throw new Error(`SPEC section 5 has no "${label}" scale`);
  return m[1].split('·').map(s => s.trim()).filter(Boolean);
};
const spacingUse = (n, what) => {
  const said = layoutSentences.filter(s => new RegExp(`\\b${n}px`).test(s) && !/·/.test(s)).map(s => plain(s.replace(/^- /, '')));
  return [what, ...said].join(' ');
};
const insideLabel = (S['5'].body.match(/Inside components \(([^)]+)\)/) || [])[1];
const spacing = [
  ...scale('Between blocks').map(n => ({ name: `block-${n}`, value: `${n}px`, usage: spacingUse(n, 'Between blocks.') })),
  ...scale('Inside components').map(n => ({ name: `inset-${n}`, value: `${n}px`, usage: spacingUse(n, `Inside components${insideLabel ? ` (${insideLabel})` : ''}.`) })),
];

// ---------- type, measured on rendered kit pages ----------

// Each row of SPEC section 4 is measured on a live instance: in the sample report, a page of kit
// classes only; else in a gallery example; else on a probe element with the row's class.
const browser = await chromium.launch();
const SAMPLE = path.join(ROOT, 'kit', 'Sample Report - Q3 Support Review.html');
const TYPE_SELECTORS = {
  T1: '.cm-mast__title', Kicker: '.cm-section__num', T2: '.cm-section__title', T3: '.cm-h3:not(.cm-h3--sm)',
  'T3-sm': '.cm-figure__title--sm, .cm-h3--sm', T4: '.cm-h4', T5: '.cm-t5', Body: '.cm-prose p',
  Small: '.cm-small', Label: '.cm-label', Delta: '.cm-delta', Chip: '.cm-chip', 'Role-tag': '.cm-props sup', Meta: '.cm-meta', Code: 'code:not(pre code)',
  'Code-block': '.cm-code pre',
};
const typeRows = rows(S['4'].body);
const measureOn = async (file, scope, probe) => {
  const { page } = await load(browser, file, 'light');
  await page.evaluate(() => document.fonts.ready);
  const out = await page.evaluate(([sel, scope, probe]) => Object.fromEntries(Object.entries(sel).map(([k, q]) => {
    let el = [...document.querySelectorAll(q)].find(e => e.closest(scope) && e.textContent.trim());
    if (!el && probe) {
      const cls = (q.split(',')[0].trim().match(/^\.([\w-]+)/) || [])[1];
      if (!cls) return [k, null];
      el = document.createElement(/^cm-h(\d)$/.test(cls) ? `h${cls.slice(-1)}` : 'span');
      el.className = cls; el.textContent = 'Heading in sentence case';
      document.querySelector('main .cm-prose').append(el);
    }
    if (!el) return [k, null];
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const rel = k === 'Code' && el.parentElement ? `${+(fs / parseFloat(getComputedStyle(el.parentElement).fontSize)).toFixed(2)}em` : null;
    return [k, {
      fontSize: rel || `${fs}px`, fontWeight: Number(cs.fontWeight), fontStyle: cs.fontStyle,
      lineHeight: cs.lineHeight === 'normal' ? null : String(+(parseFloat(cs.lineHeight) / fs).toFixed(2)),
      letterSpacing: cs.letterSpacing === 'normal' ? '0' : `${+(parseFloat(cs.letterSpacing) / fs).toFixed(3)}em`,
      caps: cs.textTransform === 'uppercase', sample: el.textContent.replace(/\s+/g, ' ').trim(),
    }];
  })), [TYPE_SELECTORS, scope, probe]);
  await page.close();
  return out;
};
const measured = await measureOn(SAMPLE, 'main', false);
const fromGallery = await measureOn(GALLERY, '[data-demo]', false);
const probed = await measureOn(SAMPLE, 'main', true);
for (const k of Object.keys(TYPE_SELECTORS)) measured[k] = measured[k] || fromGallery[k] || probed[k];

const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)).replace(/[,;:]$/, ''));
const typeStyle = (key, row) => {
  const m = measured[key];
  if (!m) throw new Error(`no ${TYPE_SELECTORS[key]} to measure for type row ${key}`);
  const [, cls, size, rule] = row;
  const usage = `${plain(cls)}. ${plain(size)}.${rule && !/^(—|none)$/.test(rule) ? ` ${plain(rule)}.` : ''}${m.caps ? ' Set in capitals by the class.' : ''}`;
  return {
    name: key, fontSize: m.fontSize, ...(m.lineHeight ? { lineHeight: m.lineHeight } : {}), fontWeight: m.fontWeight,
    letterSpacing: m.letterSpacing, ...(m.fontStyle !== 'normal' ? { fontStyle: m.fontStyle } : {}),
    sample: clip(m.sample, 60), usage: undash(usage),
  };
};
const styles = typeRows.flatMap(r => {
  const key = r[0].replace(/\s+/g, '-');
  if (!(key in TYPE_SELECTORS)) throw new Error(`type row "${r[0]}" has no selector in TYPE_SELECTORS`);
  const out = [typeStyle(key, r)];
  if (key === 'T3') out.push({ ...typeStyle('T3-sm', r), usage: undash(`${plain(r[1])}, the --sm variant inside a two-column grid.`) });
  if (key === 'Code-block') out[0].usage += ` Syntax spans set their own weight: ${[...kit.css.matchAll(/\.cm-code (\.\w+)\{[^}]*font-weight:(\d+)([^}]*)\}/g)].map(m => `${m[1]} ${m[2]}${/italic/.test(m[3]) ? ' italic' : ''}`).join(', ')}.`;
  return out;
});
const fontStack = n => light.find(d => d.name === n).value;
const fontFaces = faces(kit.template);
const type = {
  fonts: fontFaces.map(f => ({ family: f.family, file: `fonts/${f.name}`, weight: f.weight, style: f.style })),
  families: { text: fontStack('--cm-font'), code: fontStack('--cm-mono') },
  groups: [
    { name: 'Text', family: 'text', note: undash(plain(S['1'].body.match(/^5\. (.+)$/m)[1])), styles: styles.filter(s => !/^Code/.test(s.name)) },
    { name: 'Code', family: 'code', note: 'JetBrains Mono, for code only.', styles: styles.filter(s => /^Code/.test(s.name)) },
  ],
};

const sha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
const dirty = execSync('git status --porcelain --untracked-files=no', { cwd: ROOT }).toString().trim() ? '-dirty' : '';
const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT }).toString().trim();
const pkgOf = name => JSON.parse(read(require.resolve(`${name}/package.json`)));

const tokens = {
  version: 1,
  meta: {
    source: 'github', repo: 'vvint3r/object-build-system-presentation-layer', ref: `${branch}@${sha}${dirty}`, kit: KIT_VERSION,
    paths: {
      tokens: ['kit/report-kit/cm-report.css'], docs: ['kit/report-kit/SPEC.md', 'kit/Report Kit - Spec & Gallery.html'],
      fonts: [...new Set(fontFaces.map(f => f.pkg))], libraries: [`echarts@${pkgOf('echarts').version}`],
    },
    synced: new Date().toISOString().slice(0, 10),
  },
  color: { themes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }], tokens: color },
  type,
  spacing: { note: undash(plain(sentences(S['5'].body).find(s => /applies all of these/.test(s)) || '')), tokens: spacing },
  radius: { note: undash(plain(rule10)), tokens: radius },
  shadow: { note: undash(plain(sentences(S['6'].body).find(s => /^Never stack/.test(s)) || '')), tokens: shadow },
  layout: { note: 'Page, reading and rail widths, and the bleed that aligns a surface\'s text with the body text.', tokens: layout },
};
put('tokens.json', JSON.stringify(tokens, null, 2) + '\n');
put('tokens.css', compileTokens(tokens, TITLE));

// ---------- components/bundle.css: the kit stylesheet less what tokens.css declares ----------

const kept = d => `  ${d.name}:${d.value};`;
const keptLight = light.filter(d => kind(d) === 'keep' || (kind(d) === 'shadow' && /var\(/.test(d.value)));
const keptDark = declarations(DARK.body).filter(d => kind(d) === 'keep');
const NOTE = '  /* colour, shadow, radius and layout tokens: tokens.css, compiled from tokens.json */';
let bundleCss = kit.css.slice(0, LIGHT.start) + `\n${NOTE}\n${keptLight.map(kept).join('\n')}\n`
  + kit.css.slice(LIGHT.end, DARK.start) + `\n${keptDark.map(kept).join('\n')}\n` + kit.css.slice(DARK.end);
if (/<\/style/i.test(bundleCss)) throw new Error('bundle.css holds </style');
put('components/bundle.css', bundleCss);

// ---------- components: from the gallery's live examples ----------

const parsePage = await browser.newPage();
const demos = await parsePage.evaluate(src => {
  const doc = new DOMParser().parseFromString(src, 'text/html');
  return [...doc.querySelectorAll('.g-comp')].map(c => {
    const h = c.querySelector(':scope > header');
    const demo = c.querySelector(':scope > [data-demo]');
    return h && demo ? {
      label: h.querySelector('.cm-label')?.textContent.trim(), title: h.querySelector('h3')?.textContent.trim(),
      desc: h.querySelector('p')?.innerHTML.trim() || '', markup: demo.innerHTML,
    } : null;
  }).filter(Boolean);
}, gallery);
await parsePage.close();

const md = html => html.replace(/<code>([\s\S]*?)<\/code>/g, '`$1`').replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, '**$2**')
  .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, '*$2*').replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const pascal = s => s.replace(/\(.*?\)/g, '').split(/[^A-Za-z0-9]+/).filter(Boolean)
  .map(w => (w === w.toUpperCase() ? w : w[0].toUpperCase() + w.slice(1))).join('');
const kitClasses = new Set([...kit.css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));

// One component per gallery example of section 5, tied to the spec section that defines it: the
// section whose title holds the example's title or is held by it, else the one that names the
// example most often.
// A section that several examples share gives each its own component, named by the example, with
// its own part of the section: from the paragraph that starts "The <example>", "A <example>" or
// "An <example>" (else the first later paragraph whose first sentence names it) up to the next
// example's part. Text before the first part is the section's opening and leads every part, unless
// the example named by the section's own title has no paragraph of its own: that text is its part.
const count = (text, phrase) => text.toLowerCase().split(phrase).length - 1;
const escapeRe = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function parts(body, siblings) {
  const fences = [...body.matchAll(/```[\s\S]*?```/g)].map(m => [m.index, m.index + m[0].length]);
  const paras = [...body.matchAll(/(?:^|\n\n)(?=[A-Z])/g)].map(m => m.index + (m.index ? 2 : 0))
    .filter(p => p > 0 && !fences.some(([a, b]) => p > a && p < b));
  // A part starts at the headings right above its first paragraph, so no part ends on a heading.
  const above = p => {
    for (;;) {
      const before = body.slice(0, p).replace(/\n+$/, '');
      const h = before.match(/(?:^|\n)(#{1,6} [^\n]*)$/);
      if (!h) return p;
      p = before.length - h[1].length;
    }
  };
  const start = t => {
    const lead = paras.find(p => new RegExp(`^(?:The|An?) ${escapeRe(t)}\\b`, 'i').test(body.slice(p)));
    const at = lead ?? paras.find(p => new RegExp(`\\b${escapeRe(t)}\\b`, 'i').test(body.slice(p).split(/(?<=\.)\s/)[0])) ?? -1;
    return at < 0 ? at : above(at);
  };
  const found = siblings.map(x => ({ ...x, at: start(x.title) }));
  const claimants = found.filter(x => x.at < 0 && x.own);
  const lost = found.filter(x => x.at < 0 && !x.own);
  if (lost.length || claimants.length > 1) throw new Error(`spec section shared by ${siblings.map(x => x.title).join(', ')}: no part found for ${[...lost, ...claimants.slice(1)].map(x => x.title).join(', ')}`);
  const starts = found.filter(x => x.at >= 0).map(x => x.at).sort((a, b) => a - b);
  const opening = body.slice(0, starts[0]).trim();
  return Object.fromEntries(found.map(x => {
    if (x.at < 0) return [x.title, opening];
    const own = body.slice(x.at, starts.find(n => n > x.at) ?? body.length).trim();
    return [x.title, claimants.length ? own : `${opening}\n\n${own}`];
  }));
}
const mapped = demos.filter(d => /^5\./.test(d.label)).map(d => {
  const title = d.title.toLowerCase();
  const own = Object.entries(S8).filter(([, s]) => { const t = s.title.replace(/\s*\(.*\)$/, '').toLowerCase(); return title.includes(t) || t.includes(title); });
  const named = Object.entries(S8).map(([num, s]) => [num, s, count(s.body, title)]).filter(x => x[2] > 0).sort((a, b) => b[2] - a[2]);
  const [num, s] = own.length === 1 ? own[0] : named.length ? named[0] : [];
  if (!s) throw new Error(`gallery ${d.label} ${d.title}: no spec section defines it`);
  return { d, num, s, own: own.length === 1 };
});
const components = mapped.map(({ d, num, s, own }) => {
  const siblings = mapped.filter(m => m.num === num).map(m => ({ title: m.d.title, own: m.own }));
  const whole = siblings.length === 1;
  const name = whole && own ? s.title.replace(/\s*\(.*\)$/, '') : d.title;
  return { name: pascal(name), num, specTitle: s.title, body: whole ? s.body : parts(s.body, siblings)[d.title], demo: d };
});
// The flow diagram's examples sit in the gallery's own part (7.x). Diagram takes the swimlane, which
// fits a 960px card whole, and its spec section whole, in spec order among the components.
const diagramDemo = demos.find(d => d.label === '7.2');
const diagramSpec = Object.entries(S8).find(([, s]) => s.title === 'Diagram');
if (!diagramDemo || !diagramSpec) throw new Error('the gallery has no 7.2 diagram example, or the spec no Diagram section');
components.push({
  name: 'Diagram', num: diagramSpec[0], specTitle: diagramSpec[1].title, body: diagramSpec[1].body, demo: diagramDemo,
  lead: `A flow diagram, written as JSON inside the figure markup of Figure (§8.10); the kit draws it. The preview is the gallery's ${diagramDemo.title.toLowerCase()}: ${md(diagramDemo.desc)}`,
});
const uncovered = Object.keys(S8).filter(n => !components.some(c => c.num === n));
if (uncovered.length) throw new Error(`spec sections with no gallery example: ${uncovered.join(', ')}`);
const shared = components.filter((c, i) => components.findIndex(o => o.name === c.name) !== i);
if (shared.length) throw new Error(`components share a name: ${shared.map(c => `${c.name} (gallery ${c.demo.label}, spec ${c.num})`).join(', ')}`);
// Chart takes the first example of the gallery's charts part (6.x) that draws a chart: the line.
const chartDemo = demos.find(d => /^6\./.test(d.label) && /class="cm-chart"/.test(d.markup));
if (!chartDemo) throw new Error('the gallery has no chart example in part 6');
components.push({
  name: 'Chart', num: '9', specTitle: S['9'].title, body: S['9'].body, demo: chartDemo,
  lead: `A chart figure: an ECharts option, as JSON, inside the figure markup of Figure (§8.10). The preview is the gallery's ${chartDemo.title.toLowerCase()} chart: ${md(chartDemo.desc)}`,
});
// Components in spec order, so a section number finds its README by position; examples that share a
// section keep the gallery's order.
const bySection = (a, b) => {
  const [x, y] = [a.num, b.num].map(n => n.split('.').map(Number));
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1);
  return 0;
};
components.sort(bySection);

// The gallery numbers its examples (5.20) and parts (Part 07); the bundle carries only the spec's
// sections, so a lead's reference to an example names the section that defines it.
const PART_SECTION = { '05': '8', '06': '9', '07': diagramSpec[0] };
const sectionOfLabel = label => (/^5\./.test(label) ? mapped.find(m => m.d.label === label)?.num
  : /^6\./.test(label) ? '9' : /^7\./.test(label) ? diagramSpec[0] : undefined);
const sectionRefs = text => text.replace(/\((?:Part (\d\d)|(\d\.\d+(?:, \d\.\d+)*))\)/g, (ref, part, labels) => {
  const nums = part ? [PART_SECTION[part]] : labels.split(', ').map(sectionOfLabel);
  if (nums.some(n => !n)) throw new Error(`gallery reference ${ref} names no spec section`);
  return `(${[...new Set(nums)].map(n => `§${n}`).join(', ')})`;
});
for (const c of components) c.lead = sectionRefs(c.lead || md(c.demo.desc));

const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NS, components: components.map(c => ({ name: c.name })) })} */`;
const bundleJs = `${header}\n${kit.js.replace(/\s*$/, '\n')}`;
if (!kit.js.includes(`window.${NS} = {`)) throw new Error(`cm-report.js does not assign window.${NS}`);
if (unsafeInline(bundleJs, 'script')) throw new Error('bundle.js holds </script or <!--');
put('components/bundle.js', bundleJs);
const chartsFile = require.resolve('echarts/dist/echarts.min.js');
if (pkgOf('echarts').version !== ECHARTS_VERSION) throw new Error(`echarts ${pkgOf('echarts').version} is installed; the kit pins ${ECHARTS_VERSION}`);
put(LIB.file, readFileSync(chartsFile));

const previewOf = (c, height) => {
  const markup = c.demo.markup.replace(/\s+data-comment-anchor="[^"]*"/g, '').replace(/^\n+|\s+$/g, '');
  const stray = [...new Set([...markup.matchAll(/class="([^"]*)"/g)].flatMap(m => m[1].split(/\s+/)).filter(x => x && !kitClasses.has(x)))];
  if (stray.length) throw new Error(`${c.name}: classes outside cm-report.css: ${stray.join(', ')}`);
  return `<!-- @dsCard height=${height} -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${c.name} preview</title>
<style>body{margin:0;padding:24px 16px}</style>
</head>
<body>
<main class="cm-main">
${markup}
</main>
<script>document.documentElement.setAttribute('data-cm-static', '');</script>
</body>
</html>
`;
};

for (const c of components) put(`components/${c.name}/README.md`, `# ${c.name}\n\n${undash(c.lead)}\n\n## Markup and rules\n\n${undash(c.body)}\n`);

// ---------- fonts, licences and the kit's own files ----------

for (const f of fontFaces) put(`fonts/${f.name}`, readFileSync(f.file));
for (const pkg of ['@fontsource/nunito', '@fontsource/jetbrains-mono']) {
  put(`licenses/${pkg.split('/')[1]}-OFL.txt`, read(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'LICENSE')));
}
const chartsDir = path.dirname(require.resolve('echarts/package.json'));
put('licenses/echarts-LICENSE.txt', read(path.join(chartsDir, 'LICENSE')));
put('licenses/echarts-NOTICE.txt', read(path.join(chartsDir, 'NOTICE')));
// The templates, one per document kind and one per page type (§7.6), and the example documents,
// all at the bundle's root beside report-kit/, so a template copied whole links the kit as a document
// does (§2). A page type is named with the kind it builds on. The kit folder's index page stays out:
// the format reserves index.html, and a set's index page is written by the index script, never
// composed (§8.31). The index script and the set it serves stay in the repository, so every document
// here takes the form of one outside a set (§7.1): its set and area steps are spans, and its
// wordmark links to #top.
const kindOf = html => (html.match(/<meta name="cm-kind" content="([^"]+)">/) || [, 'report'])[1];
const typeOf = html => (html.match(/<meta name="cm-type" content="([^"]+)">/) || [])[1] || null;
const typeName = t => t.replace(/-/g, ' ');
const KIT_DIR = path.join(ROOT, 'kit', 'report-kit');
const standalone = html => html
  .replace(/(<a class="cm-wordmark") href="index\.html"/g, '$1 href="#top"')
  .replace(/(<nav class="cm-crumbs"[^>]*>)([\s\S]*?)(<\/nav>)/g, (_, open, steps, close) => open + steps.replace(/<a href="index\.html[^"]*">([\s\S]*?)<\/a>/g, '<span>$1</span>') + close);
// A template's notes name README.md, which carries the spec here, and the kit paths beside it.
const bundledTemplate = (html, file) => {
  const out = standalone(html)
    .replace(/(href|src)="cm-report\.(css|js)"/g, '$1="report-kit/cm-report.$2"')
    .replace(/Paths below assume the (\w+) sits inside report-kit\/\.[^\n]*/g, 'Paths below assume the $1 sits beside the report-kit/ folder, as the example documents do.')
    .replace(/In a set, npm run index[^\n]*?checks the links\./g, 'A set and its index page are built in the kit\'s repository, so a document made from this copy stands alone.')
    .replace(/(?:report-kit\/)?SPEC\.md/g, 'README.md');
  const left = [/(href|src)="cm-report\./, /SPEC/, /sits inside report-kit/, /npm run/, /href="index\.html/].filter(re => re.test(out));
  if (left.length) throw new Error(`${file}: the bundled copy still holds ${left.join(', ')}`);
  return out;
};
const templates = readdirSync(KIT_DIR).filter(f => /^template.*\.html$/.test(f)).sort()
  .map(f => { const html = read(path.join(KIT_DIR, f)); return { file: f, kind: kindOf(html), type: typeOf(html) }; });
const examples = readdirSync(path.join(ROOT, 'kit')).filter(f => f.endsWith('.html') && f !== path.basename(GALLERY) && f !== 'index.html').sort()
  .map(f => { const html = read(path.join(ROOT, 'kit', f)); return { file: f, kind: kindOf(html), type: typeOf(html), title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] }; });
for (const t of templates) put(t.file, bundledTemplate(read(path.join(KIT_DIR, t.file)), t.file));
for (const e of examples) {
  const html = standalone(read(path.join(ROOT, 'kit', e.file)));
  if (/href="index\.html/.test(html)) throw new Error(`${e.file}: the bundled copy still links to index.html`);
  put(e.file, html);
}
put('report-kit/cm-report.css', kit.css);
put('report-kit/cm-report.js', kit.js);

// ---------- README.md: usage rules for an agent that builds on the system ----------

const NAMES = JSON.parse((kit.js.match(/var NAMES = (\[[^\]]*\])/) || [])[1].replace(/'/g, '"'));
const section = n => `## ${n}. ${S[n].title}\n\n${S[n].body}`;
const componentIndex = `## 8. Components\n\n${S['8'].body.split(/\n### /)[0].trim()}\n\n| Component | Section | Summary |\n| --- | --- | --- |\n`
  + components.map(c => `| [${c.name}](components/${c.name}/README.md) | §${c.num} ${c.specTitle} | ${c.lead.split(/(?<=\.)\s/)[0].replace(/\|/g, '\\|')} |`).join('\n');
const readme = `Content Morphia publishes reports, documents and analyses as single HTML files: one stylesheet, one script and a template, with light, dark and print built in. The kit is Report Kit ${KIT_VERSION}. This file is its specification, and every document follows it.

A § number names a section of the specification. Sections 1 to 7 and 9 to 14 are in this file. Section 8 lists the components, and each of its subsections, such as §8.21, is in the README of the component it defines.

A document built from this bundle stands alone. Document sets, their index pages (§8.31) and the commands written \`npm run\` belong to the kit's repository. So the templates and examples here write their set and area steps as plain text and link the wordmark to \`#top\` (§7.1).

The checks the rules name, such as the print check and the type checks, run when a document returns to the repository. A document made from this bundle meets them by reading and counting, as §14 sets out.

A document starts by choosing its page type. The selection table in §7.6 picks one by the question the reader brings, and names the template to copy from the table below.

## Files

| File | Use |
| --- | --- |
${templates.map(t => `| \`${t.file}\` | The start of every ${t.type ? `${typeName(t.type)}, a ${t.kind}` : `${t.kind}${templates.some(o => o.kind === t.kind && o.type) ? ' of no page type' : ''}`}. Copy it whole, beside \`report-kit/\`. |`).join('\n')}
${examples.map(e => `| \`${e.file}\` | An example ${e.type ? `${typeName(e.type)}, a ${e.kind}` : e.kind}: ${e.title}. |`).join('\n')}
| \`report-kit/cm-report.css\` | The only stylesheet: every token and class. Linked, or pasted into a \`<style>\` element (§2). |
| \`report-kit/cm-report.js\` | Theme toggle, chart drawing, sortable tables, contents scroll-spy and print preparation. Linked, or pasted as the last element in \`<body>\` (§2). |
| \`components/<Component>/README.md\` | Canonical markup and rules for one component; \`preview.html\` beside it shows it live. |
| \`components/Cover/preview.html\` | The cover the system shows above this file. It is not a component, so it has no README and no row in §8. |
| \`tokens.json\`, \`tokens.css\`, \`components/bundle.css\` | The tokens as data, and the stylesheet split the way this system's previews load it. A document uses \`report-kit/cm-report.css\`, never these. |
| \`components/bundle.js\` | \`report-kit/cm-report.js\` under the line the platform reads first. It assigns \`window.${NS}\`, the one global a document and a preview use (§12). |
| \`components/lib/echarts.min.js\` | ECharts ${ECHARTS_VERSION}, the chart library every document loads (§2, §9). |
| \`fonts/\`, \`licenses/\` | Nunito and JetBrains Mono as WOFF2, Latin subset, under the SIL Open Font License; the licences of the fonts and of ECharts. |
| \`design-system.json\` | The platform's index of the system. The platform fills its section lists from these files; this file is the map of the documentation. |
| \`SKILL.md\`, \`index.html\`, \`artifact-type/\` | Added by the platform that hosts the system. They describe how a design system is made and shown, not how a document is built. Here \`index.html\` is the platform's page, never a set's index page. |

## Tokens and classes

- A token is the kit's custom property: \`cm-ink\` in \`tokens.json\` is \`--cm-ink\` in \`report-kit/cm-report.css\`. A document never writes a token's value; it uses the class that applies it.
- Chart JSON names a colour as \`$\` and the token without \`cm-\`: ${NAMES.map(n => `\`$${n}\``).join(', ')}.
- Classes start with \`cm-\`. A block is \`cm-callout\`, a part of it \`cm-callout__label\`, a variant \`cm-callout--tip\`.
- Type styles in \`tokens.json\` name the rows of the type table (§4); a document applies them through the classes in that table.

${[section('1'), section('2'), section('3'), section('4'), section('5'), section('6'), section('7'), componentIndex,
    section('9'), section('10'), section('11'), section('12'), section('13'), section('14')].join('\n\n')}
`;
put('README.md', undash(readme));

// ---------- previews, sized by rendering them as the page does ----------

const writeAll = () => {
  rmSync(OUT, { recursive: true, force: true });
  for (const [p, data] of files) { mkdirSync(path.dirname(path.join(OUT, p)), { recursive: true }); writeFileSync(path.join(OUT, p), data); }
};
async function measure(name, preview) {
  let height = 0;
  for (const theme of ['light', 'dark']) {
    const frame = path.join(FRAMES, `${name}-${theme}.html`);
    writeFileSync(frame, frameDocument({ base: '../project', theme, scheme: theme, libraries: [LIB], preview }));
    const { page: p } = await load(browser, frame, 'light', { offline: true });
    await p.setViewportSize({ width: 960, height: 900 });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    height = Math.max(height, await p.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height)));
    await p.close();
  }
  return Math.min(4000, Math.max(40, Math.ceil(height / 8) * 8));
}

for (const c of components) put(`components/${c.name}/preview.html`, previewOf(c, 120));
put('components/Cover/preview.html', '<!-- @dsCard height=288 -->\n');
writeAll();
mkdirSync(FRAMES, { recursive: true });
for (const c of components) {
  const h = await measure(c.name, previewOf(c, 120));
  put(`components/${c.name}/preview.html`, previewOf(c, h));
}
const { cover } = await import('./bundle-cover.mjs');
put('components/Cover/preview.html', cover({ tokens, readme: files.get('README.md') }));
await browser.close();

// ---------- the index, last ----------

const now = new Date().toISOString();
put('design-system.json', JSON.stringify({
  v: 3, layout: 'files', createdOnFiles: { v: 1, at: now }, title: TITLE, namespace: NS, libraries: [LIB],
  sections: {}, groups: [], assetGroups: {}, blobs: {}, docs: { sections: [] }, editing: 'code',
  lastChange: { by: 'Claude', via: `Claude Code · object-build-system-presentation-layer@${sha}${dirty}`, at: now, note: `Built from Report Kit ${KIT_VERSION} by npm run bundle.` },
}, null, 2) + '\n');
writeAll();

const bytes = [...files.values()].reduce((n, d) => n + Buffer.byteLength(d), 0);
console.log(`ok   bundle/project  ${files.size} files  ${(bytes / 1024).toFixed(0)} KB  (${components.length} components and the cover, Report Kit ${KIT_VERSION} at ${sha}${dirty})`);
