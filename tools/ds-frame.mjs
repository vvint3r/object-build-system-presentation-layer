// How a Design System artifact page reads a bundle, rebuilt here so the bundle can be built and
// checked with no network. Shared by tools/bundle.mjs and tools/bundle-check.mjs.
//
//   compileTokens(tokens, title)   tokens.json laid out as the page compiles tokens.css
//   frameDocument(opts)            the document the page renders one preview in
//   COLOR, LENGTH, NAME ...        the value grammar of tokens.json
//
// The page compiles tokens.css from tokens.json, then renders each preview.html in a frame that
// has already loaded tokens.css, the font faces, components/bundle.css, the libraries and
// components/bundle.js, in that order, with data-theme set on <html>.

export const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const NUM = '[-+]?(?:\\d+\\.?\\d*|\\.\\d+)';
export const COLOR = new RegExp(`^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\\((?:\\s*(?:${NUM}%?|[a-z-]+|/|,)\\s*)+\\))$`);
export const LENGTH = new RegExp(`^(?:${NUM}(?:px|rem|em|%)|0)$`);
export const ALIAS = /^\{([^{}]+)\}$/;
export const OTHER = /^[A-Za-z0-9 #%(),./+_-]{1,200}$/;
export const FONT_FORMATS = { woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' };

// The families the format knows by name; any other top-level { tokens: [...] } key is a further one.
export const KNOWN = ['version', 'name', 'meta', 'color', 'type', 'spacing', 'radius', 'shadow'];
export const otherFamilies = t => Object.keys(t).filter(k => !KNOWN.includes(k) && t[k] && Array.isArray(t[k].tokens));

const esc = n => { let s = n.replace(/\./g, '\\.'); if (/^[0-9]/.test(s)) s = '\\3' + s[0] + ' ' + s.slice(1); return s; };
const aliasOf = v => (typeof v === 'string' ? (ALIAS.exec(v) || [])[1] : undefined);
const note = u => (u ? ' /* ' + u.replace(/\*\//g, '* /').replace(/<\//g, '< /').replace(/[\r\n\f]+/g, ' ').trim() + ' */' : '');

// A type style with the defaults the page fills in.
export const style = (s, group) => ({
  lineHeight: '1.4', letterSpacing: '0', fontStyle: 'normal', ...s,
  family: s.family || group.family || '',
});

export function compileTokens(t, title) {
  const out = [`/* ${title}: generated from tokens.json */`];
  const themes = t.color.themes;
  const first = themes[0].id;
  const colors = t.color.tokens;
  const shadows = t.shadow ? t.shadow.tokens : [];
  const per = (tok, id) => (typeof tok.value === 'string' ? (id === first ? tok.value : undefined) : tok.value[id]);
  const colorDecl = (tok, v, withNote) => `  --${esc(tok.name)}: ${aliasOf(v) ? `var(--${esc(aliasOf(v))})` : v};${withNote ? note(tok.usage) : ''}`;
  const plainDecl = (tok, v, withNote) => `  --${esc(tok.name)}: ${v};${withNote ? note(tok.usage) : ''}`;
  if (colors.length || shadows.length) {
    out.push(`:root, [data-theme="${first}"] {`);
    for (const c of colors) out.push(colorDecl(c, per(c, first), true));
    for (const s of shadows) out.push(plainDecl(s, per(s, first), true));
    out.push('}');
    for (const th of themes.slice(1)) {
      const lines = [
        ...colors.filter(c => per(c, th.id) !== undefined || aliasOf(per(c, first))).map(c => colorDecl(c, per(c, th.id) ?? per(c, first), false)),
        ...shadows.filter(s => per(s, th.id) !== undefined).map(s => plainDecl(s, per(s, th.id), false)),
      ];
      if (lines.length) out.push(`[data-theme="${th.id}"] {`, ...lines, '}');
    }
  }
  const nonType = new Set([...colors, ...(t.spacing?.tokens || []), ...(t.radius?.tokens || []), ...shadows,
    ...otherFamilies(t).flatMap(k => t[k].tokens)].map(x => esc(x.name)));
  const root = [];
  for (const k of ['spacing', 'radius', ...otherFamilies(t)]) for (const x of t[k]?.tokens || []) root.push(plainDecl(x, x.value, true));
  for (const [k, v] of Object.entries(t.type.families)) root.push(`  --font-${esc(k)}: ${v};`);
  for (const g of t.type.groups) for (const raw of g.styles) {
    const s = style(raw, g);
    if (nonType.has(`text-${esc(s.name)}`)) continue;
    root.push(`  --text-${esc(s.name)}: ${s.fontStyle !== 'normal' ? s.fontStyle + ' ' : ''}${s.fontWeight} ${s.fontSize}/${s.lineHeight}${s.family ? ` var(--font-${esc(s.family)})` : ' inherit'};${note(s.usage)}`);
  }
  if (root.length) out.push(':root {', ...root, '}');
  for (const g of t.type.groups) for (const raw of g.styles) {
    const s = style(raw, g);
    out.push(`.${esc(s.name)} {`, ...(s.family ? [`  font-family: var(--font-${esc(s.family)});`] : []),
      `  font-size: ${s.fontSize};`, `  line-height: ${s.lineHeight};`, `  font-weight: ${s.fontWeight};`,
      `  letter-spacing: ${s.letterSpacing};`, ...(s.fontStyle !== 'normal' ? [`  font-style: ${s.fontStyle};`] : []), '}');
  }
  for (const f of t.type.fonts) {
    const ext = f.file.slice(f.file.lastIndexOf('.') + 1).toLowerCase();
    out.push('@font-face {', `  font-family: "${f.family}";`,
      `  src: url("${f.file.split('/').map(encodeURIComponent).join('/')}")${FONT_FORMATS[ext] ? ` format("${FONT_FORMATS[ext]}")` : ''};`,
      `  font-weight: ${f.weight};`, `  font-style: ${f.style};`, '  font-display: swap;', '}');
  }
  return out.join('\n') + '\n';
}

// The frame for one preview: <html data-theme>, then the system's styles and scripts in the page's
// order, then the preview's own text in the body. `base` is the path from the frame file to the
// bundle's project folder.
export function frameDocument({ base, theme, scheme, libraries, preview }) {
  return `<!doctype html><html data-theme="${theme}" data-mode="${theme}" style="color-scheme:${scheme}" class="${theme} ${theme}"><head>`
    + '<meta charset="utf-8"><meta name="referrer" content="no-referrer">'
    + '<style>html{overflow:hidden!important}</style>'
    + `<link rel="stylesheet" href="${base}/tokens.css">`
    + `<style>html{color-scheme:${scheme}}html,body{background:transparent!important}</style>`
    + `<link rel="stylesheet" href="${base}/components/bundle.css">`
    + libraries.map(l => `<script src="${base}/${l.file}"></script>`).join('')
    + `<script src="${base}/components/bundle.js"></script>`
    + `</head><body>${preview}</body></html>`;
}
