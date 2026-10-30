// Report structure: the required blocks in order, the links that hold the page together, and a
// clean load. Read on the page as written, except the load checks, which use what the loader
// collected in each mode. Each in-page function is self-contained, so helpers are repeated inside
// it.

export default [
  {
    // Each reference in the text points at a note and carries an id; each note carries an id and a
    // back link to a reference that exists.
    name: 'footnotes', level: 'fail', source: 'SPEC §8.15; §14 item 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const target = a => { const h = a.getAttribute('href') || ''; return h[0] === '#' ? d.getElementById(h.slice(1)) : null; };
      const pointed = new Set();
      for (const a of d.querySelectorAll('a.cm-fn')) {
        if (H.exempt(a, check)) continue;
        const note = target(a);
        if (!note || !note.matches('.cm-notes > li')) out.push({ where: H.path(a), value: `href="${a.getAttribute('href') || ''}" does not point at a note` });
        else pointed.add(note);
        if (!a.id) out.push({ where: H.path(a), value: `reference ${H.text(a)} has no id, so its note cannot link back` });
      }
      for (const li of d.querySelectorAll('.cm-notes > li')) {
        if (H.exempt(li, check)) continue;
        if (!li.id) { out.push({ where: H.path(li), value: 'note has no id' }); continue; }
        const back = li.querySelector('a.cm-back');
        const ref = back && target(back);
        if (!back) out.push({ where: H.path(li), value: 'note has no back link (a.cm-back)' });
        else if (!ref || !ref.matches('a.cm-fn')) out.push({ where: H.path(back), value: `href="${back.getAttribute('href') || ''}" does not point at a reference` });
        if (!pointed.has(li)) out.push({ where: H.path(li), value: 'no reference in the text points at this note' });
      }
      return out;
    },
  },

  {
    // A sources list with entries; each entry is tagged Int, Ext, PDF, Web or API, and external
    // sources link their URL.
    name: 'sources', level: 'fail', source: 'SPEC §8.15; §14 item 11', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const lists = [...H.source().querySelectorAll('.cm-sources')].filter(l => !H.exempt(l, check));
      if (!lists.length) return [{ where: 'body', value: 'no sources list (.cm-sources)' }];
      for (const l of lists) {
        const items = [...l.children].filter(c => c.localName === 'li');
        if (!items.length) out.push({ where: H.path(l), value: 'sources list is empty' });
        for (const li of items) {
          const tag = li.querySelector('.cm-tag');
          const t = tag ? H.text(tag) : '';
          if (!['Int', 'Ext', 'PDF', 'Web', 'API'].includes(t)) out.push({ where: H.path(li), value: `source tag "${t}" (Int, Ext, PDF, Web or API)` });
          if (['Ext', 'Web'].includes(t) && !li.querySelector('a[href^="http"]')) out.push({ where: H.path(li), value: `${t} source without a link to its URL` });
        }
      }
      return out;
    },
  },

  {
    // The contents rail links every section and nothing else; four or more sections need a rail,
    // and a page without a rail uses the no-rail shell.
    name: 'rail', level: 'fail', source: 'SPEC §5; §7; §14 item 12', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const sections = [...d.querySelectorAll('main section.cm-section')].filter(s => !H.exempt(s, check) && !s.parentElement.closest('section'));
      const rail = d.querySelector('.cm-rail');
      const shell = d.querySelector('.cm-shell');
      if (!rail) {
        if (sections.length >= 4) out.push({ where: 'body', value: `${sections.length} sections and no contents rail` });
        if (shell && !shell.classList.contains('cm-shell--norail')) out.push({ where: H.path(shell), value: 'no contents rail, and the shell is not .cm-shell--norail' });
        return out;
      }
      const linked = new Set();
      for (const a of rail.querySelectorAll('.cm-toc a')) {
        const h = a.getAttribute('href') || '';
        const s = h[0] === '#' && d.getElementById(h.slice(1));
        if (!s || !sections.includes(s)) out.push({ where: H.path(a), value: `href="${h}" is not a section id` });
        else linked.add(s);
      }
      for (const s of sections) if (!linked.has(s)) out.push({ where: H.path(s), value: 'section has no link in the contents rail' });
      return out;
    },
  },

  {
    // Every section names its h2 in aria-labelledby; section ids are lowercase.
    name: 'sections', level: 'fail', source: 'SPEC §7; §14 item 12', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      for (const s of d.querySelectorAll('section')) {
        if (H.exempt(s, check)) continue;
        const id = s.getAttribute('aria-labelledby');
        const h = id && d.getElementById(id);
        if (!h) out.push({ where: H.path(s), value: id ? `aria-labelledby="${id}" points at nothing` : 'no aria-labelledby' });
        else if (h.localName !== 'h2' || !s.contains(h)) out.push({ where: H.path(s), value: `aria-labelledby points at ${h.localName}#${id}, not an h2 in the section` });
        if (s.id && !/^[a-z][a-z0-9-]*$/.test(s.id)) out.push({ where: H.path(s), value: `id "${s.id}" is not lowercase` });
      }
      return out;
    },
  },

  {
    // Two-digit part numbers in order (Part 01, Part 02), then appendices by letter.
    name: 'section-numbers', level: 'fail', source: 'SPEC §7; §8.1', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      let part = 1, appendix = 0;
      for (const n of H.source().querySelectorAll('section.cm-section > .cm-section__head > .cm-section__num')) {
        if (H.exempt(n, check)) continue;
        const t = H.text(n);
        const p = t.match(/^Part (\d+)$/), a = t.match(/^Appendix ([A-Z])$/);
        const want = appendix ? `Appendix ${String.fromCharCode(65 + appendix)}` : `Part ${String(part).padStart(2, '0')}`;
        if (p && !appendix && t === want) part++;
        else if (a && a[1] === String.fromCharCode(65 + appendix)) appendix++;
        else out.push({ where: H.path(n), value: `"${t}" where "${want}"${appendix ? '' : ` or "Appendix A"`} comes next` });
      }
      return out;
    },
  },

  {
    // One h1, and headings never skip a level.
    name: 'headings', level: 'fail', source: 'SPEC §4', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const hs = [...H.source().body.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(h => !H.exempt(h, check));
      const h1 = hs.filter(h => h.localName === 'h1').length;
      if (h1 !== 1) out.push({ where: 'body', value: `${h1} h1 elements (exactly 1)` });
      let prev = 0;
      for (const h of hs) {
        const lvl = Number(h.localName[1]);
        if (lvl > prev + 1) out.push({ where: H.path(h), value: `${h.localName} after ${prev ? 'h' + prev : 'no heading'}` });
        prev = lvl;
      }
      return out;
    },
  },

  {
    name: 'ids', level: 'fail', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, seen = new Map(), out = [];
      for (const el of H.source().querySelectorAll('[id]')) {
        if (H.exempt(el, check)) continue;
        if (seen.has(el.id)) out.push({ where: H.path(el), value: `id "${el.id}" is used twice` });
        else seen.set(el.id, el);
      }
      return out;
    },
  },

  {
    // Top bar: the publisher wordmark (lowercase, hyphenated), one series chip, the theme toggle,
    // at most one print button (optional, SPEC §7), and nothing else.
    name: 'topbar', level: 'fail', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const bars = d.querySelectorAll('.cm-topbar');
      if (bars.length !== 1) return [{ where: 'body', value: `${bars.length} top bars (exactly 1)` }];
      const bar = bars[0];
      if (H.exempt(bar, check)) return [];
      const mark = bar.querySelectorAll('.cm-wordmark');
      if (mark.length !== 1) out.push({ where: H.path(bar), value: `${mark.length} wordmarks (exactly 1)` });
      else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(H.text(mark[0]))) out.push({ where: H.path(mark[0]), value: `wordmark "${H.text(mark[0])}" (lowercase, hyphenated)` });
      const chips = bar.querySelectorAll('.cm-chip').length;
      if (chips !== 1) out.push({ where: H.path(bar), value: `${chips} series chips (exactly 1)` });
      const toggles = bar.querySelectorAll('[data-cm-theme-toggle]').length;
      if (toggles !== 1) out.push({ where: H.path(bar), value: `${toggles} theme toggles (exactly 1)` });
      const prints = bar.querySelectorAll('[data-cm-print]').length;
      if (prints > 1) out.push({ where: H.path(bar), value: `${prints} print buttons (at most 1)` });
      for (const el of bar.querySelectorAll('a, button')) {
        if (el.matches('.cm-wordmark, [data-cm-theme-toggle], [data-cm-print]')) continue;
        out.push({ where: H.path(el), value: `extra control "${H.text(el)}"` });
      }
      return out;
    },
  },

  {
    // Breadcrumb, bar, title, dek, the five labelled metadata fields in their formats, and the
    // byline with Prepared by and Distribution. A Period field left out carries its omission
    // comment in the metadata list (SPEC §7).
    name: 'masthead', level: 'fail', source: 'SPEC §7; §14 item 2', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const m = d.querySelector('.cm-mast');
      if (!m) return [{ where: 'body', value: 'no masthead (.cm-mast)' }];
      if (H.exempt(m, check)) return [];
      const at = H.path(m);
      for (const [sel, what] of [['.cm-crumbs', 'breadcrumb'], ['.cm-bar', 'bar'], ['h1.cm-mast__title', 'title'], ['.cm-mast__dek', 'dek'], ['dl.cm-mast__meta', 'metadata list'], ['dl.cm-byline', 'byline']]) {
        if (!m.querySelector(sel)) out.push({ where: at, value: `no ${what} (${sel})` });
      }
      const fields = dl => {
        const f = new Map();
        if (!dl) return f;
        for (const div of dl.children) {
          const dt = div.querySelector(':scope > dt'), dd = div.querySelector(':scope > dd');
          if (div.localName !== 'div' || !dt || !dd) { out.push({ where: H.path(div), value: 'metadata entry is not <div><dt>…</dt><dd>…</dd></div>' }); continue; }
          if (!H.text(dt)) out.push({ where: H.path(div), value: 'value without a label' });
          f.set(H.text(dt), dd);
        }
        return f;
      };
      const metaList = m.querySelector('dl.cm-mast__meta');
      const meta = fields(metaList);
      const noPeriod = H.omitted(metaList, 'period');
      const FORMAT = {
        Period: [/^\d{4}-\d{2}-\d{2} → \d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD → YYYY-MM-DD'],
        Published: [/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'],
        'Reading time': [/^\d+ min$/, 'N min'],
        Version: [/^\d+\.\d+$/, 'X.Y'],
      };
      if (!meta.has('Status')) out.push({ where: at, value: 'no Status field' });
      for (const [k, [re, form]] of Object.entries(FORMAT)) {
        if (!meta.has(k)) {
          if (k !== 'Period') out.push({ where: at, value: `no ${k} field` });
          else if (!noPeriod) out.push({ where: at, value: 'no Period field, and no omission comment (cm-omit period)' });
        }
        else if (!re.test(H.text(meta.get(k)))) out.push({ where: H.path(meta.get(k)), value: `${k} "${H.text(meta.get(k))}" (${form})` });
      }
      const status = meta.get('Status');
      if (status) {
        const chips = [...status.querySelectorAll('.cm-chip')];
        const TYPES = ['Analysis', 'Report', 'Brief', 'Guide'];
        const STATES = { Draft: [], 'In review': ['cm-chip--warn'], Final: ['cm-chip--ok'] };
        if (!chips.some(c => TYPES.includes(H.text(c)))) out.push({ where: H.path(status), value: 'no type chip (Analysis, Report, Brief or Guide)' });
        const state = chips.find(c => H.text(c) in STATES);
        if (!state) out.push({ where: H.path(status), value: 'no status chip (Draft, In review or Final)' });
        else {
          const want = STATES[H.text(state)];
          const mods = [...state.classList].filter(c => c.startsWith('cm-chip--'));
          if (mods.join(' ') !== want.join(' ')) out.push({ where: H.path(state), value: `status "${H.text(state)}" with ${mods.join(' ') || 'no modifier'} (${want.join(' ') || 'plain cm-chip'})` });
        }
      }
      const by = fields(m.querySelector('dl.cm-byline'));
      for (const k of ['Prepared by', 'Distribution']) if (m.querySelector('dl.cm-byline') && !by.has(k)) out.push({ where: at, value: `byline has no ${k}` });
      return out;
    },
  },

  {
    // The first section is the executive summary: a lede, a KPI strip and the summary card with its
    // numbered findings. A KPI strip left out carries its omission comment in the section (SPEC §7).
    name: 'summary-anatomy', level: 'fail', source: 'SPEC §7; §14 item 3', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const sum = [...d.querySelectorAll('.cm-summary')].find(s => !H.exempt(s, check));
      if (!sum) return [{ where: 'body', value: 'no executive summary (.cm-summary)' }];
      const section = sum.closest('section.cm-section');
      const first = [...d.querySelectorAll('main section.cm-section')].find(s => !H.exempt(s, check));
      if (!section) return [{ where: H.path(sum), value: 'summary is not inside a section' }];
      if (section !== first) out.push({ where: H.path(section), value: 'the summary section is not the first section' });
      if (!section.querySelector('.cm-prose')) out.push({ where: H.path(section), value: 'no lede (.cm-prose)' });
      if (!section.querySelector('.cm-kpis .cm-kpi') && !H.omitted(section, 'kpi-strip')) out.push({ where: H.path(section), value: 'no KPI strip (.cm-kpis with .cm-kpi), and no omission comment (cm-omit kpi-strip)' });
      if (!sum.querySelector('ol.cm-findings > li')) out.push({ where: H.path(sum), value: 'no findings (ol.cm-findings)' });
      return out;
    },
  },

  {
    // Every key finding and every recommended action opens with exactly one claim line: the claim
    // sentence on a line of its own (.cm-findings__claim), with the evidence or reason after it.
    name: 'claim-lines', level: 'fail', source: 'SPEC §8.3; §8.19', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const li of H.source().querySelectorAll('ol.cm-findings > li')) {
        if (H.exempt(li, check)) continue;
        const claims = li.querySelectorAll('.cm-findings__claim');
        if (claims.length !== 1) out.push({ where: H.path(li), value: `${claims.length} claim lines (exactly 1)` });
        else if (!H.text(claims[0])) out.push({ where: H.path(claims[0]), value: 'empty claim line' });
        else if (!H.text(li).startsWith(H.text(claims[0]))) out.push({ where: H.path(claims[0]), value: 'the claim line does not open the item' });
      }
      return out;
    },
  },

  {
    // Notes and sources close the report, notes first, and the footer follows.
    name: 'report-anatomy', level: 'fail', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const sections = [...d.querySelectorAll('main section.cm-section')].filter(s => !H.exempt(s, check) && !s.parentElement.closest('section'));
      const last = sections[sections.length - 1];
      const first = sel => [...d.querySelectorAll(sel)].find(el => !H.exempt(el, check));
      const notes = first('.cm-notes'), sources = first('.cm-sources');
      if (!sources) out.push({ where: 'body', value: 'no notes and sources appendix (.cm-sources)' });
      else {
        if (last && !last.contains(sources)) out.push({ where: H.path(sources), value: 'the sources list is not in the last section' });
        if (notes && (notes.compareDocumentPosition(sources) & Node.DOCUMENT_POSITION_FOLLOWING) === 0) out.push({ where: H.path(notes), value: 'notes come after sources' });
      }
      const footer = d.querySelector('.cm-footer');
      if (!footer) out.push({ where: 'body', value: 'no footer (.cm-footer)' });
      else if (last && (last.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING) === 0) out.push({ where: H.path(footer), value: 'the footer is not after the last section' });
      return out;
    },
  },

  {
    // The footer names the kit, and repeats the masthead's version and published date.
    name: 'footer', level: 'fail', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const f = d.querySelector('.cm-footer');
      if (!f || H.exempt(f, check)) return [];
      const t = H.text(f);
      if (!t.includes('Content Morphia Report Kit 1.2')) out.push({ where: H.path(f), value: 'does not name "Content Morphia Report Kit 1.2"' });
      const field = k => { const dt = [...d.querySelectorAll('.cm-mast__meta dt')].find(x => H.text(x) === k); return dt && dt.nextElementSibling ? H.text(dt.nextElementSibling) : ''; };
      const v = field('Version'), p = field('Published');
      if (v && !t.includes('v' + v)) out.push({ where: H.path(f), value: `no version "v${v}" (masthead Version ${v})` });
      if (p && !t.includes(p)) out.push({ where: H.path(f), value: `no published date "${p}" (masthead Published ${p})` });
      return out;
    },
  },

  {
    // Script errors and console errors while the page loads and draws in this mode.
    name: 'script-errors', level: 'fail', source: 'SPEC §14 item 13',
    run: ({ errors }) => errors.map(e => ({ where: 'console', value: e.split('\n')[0].slice(0, 160) })),
  },

  {
    // Requests that failed (a CDN or the font service out of reach). The page still loads, but
    // fonts or charts may fall back, so the other results for this mode deserve a second look.
    name: 'unreachable', level: 'warn', source: 'SPEC §2',
    run: ({ requests }) => [...new Set(requests)].map(h => ({ where: 'network', value: `request to ${h} failed` })),
  },
];
