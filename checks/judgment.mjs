// Checks that need judgment: lengths, counts and habits the spec asks for, where a page can have a
// reason to differ. They are warnings and never change the exit code. Each in-page function is
// self-contained, so small helpers are repeated inside it.

export default [
  {
    // The report title runs 4 to 10 words; a figure title at most 10.
    name: 'title-length', level: 'warn', source: 'SPEC §7; §9; §14 item 2', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const words = el => H.text(el).split(' ').filter(w => /[\p{L}\p{N}]/u.test(w)).length;
      for (const h of H.source().querySelectorAll('h1.cm-mast__title')) {
        const n = words(h);
        if (!H.exempt(h, check) && (n < 4 || n > 10)) out.push({ where: H.path(h), value: `${n} words (4 to 10)` });
      }
      for (const t of H.source().querySelectorAll('.cm-figure__title')) {
        const n = words(t);
        if (!H.exempt(t, check) && n > 10) out.push({ where: H.path(t), value: `${n} words (at most 10)` });
      }
      return out;
    },
  },

  {
    // The summary strip holds 2 to 4 KPIs. A strip of fewer than four carries cm-kpis--3 or --2,
    // and every KPI states its comparison in a delta or a foot.
    name: 'kpis', level: 'warn', source: 'SPEC §7; §8.2; §14 item 3', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const strip of H.source().querySelectorAll('.cm-kpis')) {
        if (H.exempt(strip, check)) continue;
        const kpis = [...strip.querySelectorAll(':scope > .cm-kpi')];
        if (strip.closest('section') && strip.closest('section').querySelector('.cm-summary') && (kpis.length < 2 || kpis.length > 4)) {
          out.push({ where: H.path(strip), value: `${kpis.length} KPIs in the summary strip (2 to 4)` });
        }
        const mod = [...strip.classList].find(c => /^cm-kpis--\d$/.test(c)) || '';
        const want = kpis.length < 4 ? `cm-kpis--${kpis.length}` : '';
        if (mod !== want) out.push({ where: H.path(strip), value: `${kpis.length} KPIs with ${mod || 'no count modifier'} (${want || 'none'})` });
        for (const k of kpis) {
          const said = ['.cm-kpi__delta', '.cm-kpi__foot'].some(s => k.querySelector(s) && H.text(k.querySelector(s)));
          if (!said) out.push({ where: H.path(k), value: 'no comparison (.cm-kpi__delta or .cm-kpi__foot)' });
        }
      }
      return out;
    },
  },

  {
    // 3 to 5 findings, each opening with its claim in bold.
    name: 'findings', level: 'warn', source: 'SPEC §8.3; §14 item 3', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const ol of H.source().querySelectorAll('.cm-summary ol.cm-findings')) {
        if (H.exempt(ol, check)) continue;
        const items = [...ol.children].filter(c => c.localName === 'li');
        if (items.length < 3 || items.length > 5) out.push({ where: H.path(ol), value: `${items.length} findings (3 to 5)` });
        for (const li of items) {
          const s = li.querySelector('strong, b');
          if (!s || !H.text(li).startsWith(H.text(s))) out.push({ where: H.path(li), value: 'finding does not open with its claim in <strong>' });
        }
      }
      return out;
    },
  },

  {
    // Every number in the summary (lede, KPI values, findings) appears again outside the summary
    // section: in the text, a table, a chart's data or a text alternative. Numbers are compared
    // without thousands separators, so 48,210 matches 48210 in chart data.
    name: 'summary-numbers', level: 'warn', source: 'SPEC §14 item 4', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      const sum = d.querySelector('.cm-summary');
      const section = sum && sum.closest('section');
      if (!section || H.exempt(section, check)) return out;
      const nums = s => (s.match(/\d[\d,]*(?:\.\d+)?/g) || []).map(n => String(Number(n.replace(/,/g, ''))));
      const body = new Set();
      for (const el of d.body.querySelectorAll('*')) {
        if (section.contains(el)) continue;
        for (const n of el.childNodes) if (n.nodeType === 3) nums(n.nodeValue).forEach(x => body.add(x));
        for (const a of ['aria-label', 'data-value', 'data-values']) if (el.hasAttribute(a)) nums(el.getAttribute(a)).forEach(x => body.add(x));
      }
      const parts = [...section.querySelectorAll('.cm-prose, .cm-kpi__value, .cm-findings > li')];
      const missing = new Set();
      for (const p of parts) for (const n of nums(H.text(p))) if (!body.has(n)) missing.add(`${n} (${p.matches('.cm-kpi__value') ? 'KPI' : p.matches('li') ? 'finding' : 'lede'})`);
      for (const m of missing) out.push({ where: H.path(section), value: `${m} does not reappear in the body` });
      return out;
    },
  },

  {
    // Text before a leading colon is bold: "Source: …" opens with <b>Source:</b>.
    name: 'bold-colon', level: 'warn', source: 'SPEC §14 item 9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().body.querySelectorAll('p, li, dd, td, figcaption, .cm-caption')) {
        if (el.closest('pre, code, .cm-code, script') || H.exempt(el, check)) continue;
        // A colon inside code (a JSON key, a selector) is not a leading colon.
        const prose = el.cloneNode(true);
        prose.querySelectorAll('code').forEach(c => c.replaceWith('\u2026'));
        const m = H.text(prose).match(/^([^:.!?]{1,60}):\s/);
        if (!m) continue;
        const first = [...el.childNodes].find(n => n.nodeType !== 3 || n.nodeValue.trim());
        if (first && first.nodeType === 1 && !['b', 'strong'].includes(first.localName) && !['span', 'a', 'small', 'em', 'i'].includes(first.localName)) continue;
        const lead = first && first.nodeType === 1 ? first.closest('b, strong') || first.querySelector('b, strong') : null;
        if (!lead || !m[1].startsWith(H.text(lead).replace(/:$/, '').trim())) out.push({ where: H.path(el), value: `"${m[1]}:" is not bold` });
      }
      return out;
    },
  },

  {
    // A TL;DR is one or two sentences and 40 words at most.
    name: 'tldr-length', level: 'warn', source: 'SPEC §8.1', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const p of H.source().querySelectorAll('.cm-section__tldr')) {
        if (H.exempt(p, check)) continue;
        const t = H.text(p).replace(/^TL;DR:\s*/i, '');
        const words = t.split(' ').filter(w => /[\p{L}\p{N}]/u.test(w)).length;
        const sentences = t.split(/(?<=[.!?])\s+(?=[A-Z0-9“"])/).filter(Boolean).length;
        if (words > 40) out.push({ where: H.path(p), value: `${words} words (at most 40)` });
        if (sentences > 2) out.push({ where: H.path(p), value: `${sentences} sentences (1 or 2)` });
      }
      return out;
    },
  },

  {
    // The executive summary opens with a lede of 2 to 4 sentences.
    name: 'lede-length', level: 'warn', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source();
      const sum = d.querySelector('.cm-summary');
      const lede = sum && sum.closest('section') && sum.closest('section').querySelector('.cm-prose');
      if (!lede || H.exempt(lede, check)) return [];
      const n = H.text(lede).split(/(?<=[.!?])\s+(?=[A-Z0-9“"])/).filter(Boolean).length;
      return n < 2 || n > 4 ? [{ where: H.path(lede), value: `${n} sentences (2 to 4)` }] : [];
    },
  },

  {
    // Callouts come from the closed set with the variant's name as the label.
    name: 'callout-variants', level: 'warn', source: 'SPEC §8.4', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const SET = ['note', 'tip', 'important', 'warning', 'example', 'requirement', 'limitation', 'correction'];
      for (const c of H.source().querySelectorAll('.cm-callout')) {
        if (H.exempt(c, check)) continue;
        const v = [...c.classList].map(x => x.match(/^cm-callout--(.+)$/)).filter(Boolean).map(x => x[1]);
        const label = c.querySelector('.cm-callout__label');
        if (v.length !== 1 || !SET.includes(v[0])) out.push({ where: H.path(c), value: `variant ${v.join(', ') || 'none'} (one of ${SET.join(', ')})` });
        else if (!label || H.text(label).toLowerCase() !== v[0]) out.push({ where: H.path(c), value: `label "${label ? H.text(label) : ''}" on the ${v[0]} variant` });
      }
      return out;
    },
  },

  {
    // At most two callouts per section and two in a row, and at most one "important" per section.
    name: 'callouts', level: 'warn', source: 'SPEC §7; §8.4', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source(), out = [];
      for (const s of d.querySelectorAll('section.cm-section')) {
        if (H.exempt(s, check) || s.parentElement.closest('section')) continue;
        const cs = [...s.querySelectorAll('.cm-callout')].filter(c => !H.exempt(c, check));
        if (cs.length > 2) out.push({ where: H.path(s), value: `${cs.length} callouts in the section (at most 2)` });
        const imp = cs.filter(c => c.classList.contains('cm-callout--important')).length;
        if (imp > 1) out.push({ where: H.path(s), value: `${imp} important callouts (at most 1)` });
        for (const c of cs) {
          let run = 1;
          for (let n = c.nextElementSibling; n && n.matches('.cm-callout'); n = n.nextElementSibling) run++;
          const prev = c.previousElementSibling;
          if (run > 2 && !(prev && prev.matches('.cm-callout'))) out.push({ where: H.path(c), value: `${run} callouts in a row (at most 2)` });
        }
      }
      return out;
    },
  },

  {
    // Reading time is the word count of the report body divided by 220, rounded up. Text the
    // reader does not see as prose (chart data, data fallbacks, hidden text) is not counted.
    name: 'reading-time', level: 'warn', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source();
      const main = d.querySelector('main');
      const dt = [...d.querySelectorAll('.cm-mast__meta dt')].find(x => H.text(x) === 'Reading time');
      if (!main || !dt || !dt.nextElementSibling || H.exempt(dt, check)) return [];
      const copy = main.cloneNode(true);
      copy.querySelectorAll('script, style, template, .cm-data, [aria-hidden="true"], .cm-sr').forEach(e => e.remove());
      const words = H.text(copy).split(' ').filter(w => /[\p{L}\p{N}]/u.test(w)).length;
      const want = Math.ceil(words / 220);
      const stated = H.text(dt.nextElementSibling);
      return stated === `${want} min` ? [] : [{ where: H.path(dt.nextElementSibling), value: `"${stated}" where ${words} words give ${want} min` }];
    },
  },

  {
    // Nothing sits closer than 24px to a neighbouring block: measured between the children of
    // section bodies, stacks and grids as drawn in this mode.
    name: 'block-gap', level: 'warn', source: 'SPEC §5; §14 item 9',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const box of document.querySelectorAll('.cm-section__body, .cm-stack, .cm-grid')) {
        if (H.ignored(box) || !H.shown(box) || H.exempt(box, check)) continue;
        const kids = [...box.children].filter(k => H.shown(k) && getComputedStyle(k).position !== 'absolute' && k.getBoundingClientRect().height > 0);
        for (let i = 0; i < kids.length; i++) {
          for (let j = i + 1; j < kids.length; j++) {
            const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
            const across = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const down = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            const gap = across > 0 ? Math.max(b.top - a.bottom, a.top - b.bottom) : down > 0 ? Math.max(b.left - a.right, a.left - b.right) : null;
            if (gap !== null && gap < 23.5) out.push({ where: H.path(kids[j]), value: `${Math.round(gap)}px from ${H.path(kids[i]).split(' > ').pop()}` });
          }
        }
      }
      return out;
    },
  },

  {
    // Chart height: 280 to 360px full width, 260 to 300px in a two-column grid. Heatmaps are sized
    // by row count and are left out.
    name: 'figure-height', level: 'warn', source: 'SPEC §8.10', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.live || H.exempt(c.src, check)) continue;
        if (c.json && H.list(c.json.series).some(s => s && s.type === 'heatmap')) continue;
        const grid = c.live.closest('.cm-grid');
        if (grid && !grid.classList.contains('cm-grid--2')) continue;
        const [lo, hi] = grid ? [260, 300] : [280, 360];
        const h = Math.round(c.live.getBoundingClientRect().height);
        if (h < lo || h > hi) out.push({ where: c.where, value: `${h}px (${lo} to ${hi}${grid ? ' in a two-column grid' : ''})` });
      }
      return out;
    },
  },

  {
    // The text alternative opens with the chart type, then states the finding.
    name: 'chart-label', level: 'warn', source: 'SPEC §8.10; §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const TYPE = /\b(bar|column|line|area|scatter|pie|donut|doughnut|heatmap|histogram|dot|slope|dumbbell|waterfall|funnel|box|chart|plot)\b/i;
      for (const el of H.source().querySelectorAll('.cm-chart[aria-label]')) {
        if (H.exempt(el, check)) continue;
        const label = el.getAttribute('aria-label').trim();
        const [first, ...rest] = label.split(/(?<=\.)\s+/);
        if (!TYPE.test(first)) out.push({ where: H.path(el), value: `aria-label opens "${first.slice(0, 40)}", not a chart type` });
        else if (!rest.join(' ').trim()) out.push({ where: H.path(el), value: 'aria-label names the chart type but states no finding' });
      }
      return out;
    },
  },

  {
    // A report with computed numbers (KPIs, charts or tables) carries a methodology appendix.
    name: 'methodology', level: 'warn', source: 'SPEC §7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, d = H.source();
      const numbers = [...d.querySelectorAll('.cm-kpi, .cm-chart, table.cm-table')].filter(e => !H.exempt(e, check) && !e.closest('.cm-data'));
      if (!numbers.length) return [];
      const has = [...d.querySelectorAll('section.cm-section .cm-section__title')].some(h => /methodology/i.test(H.text(h)));
      return has ? [] : [{ where: 'body', value: `${numbers.length} KPIs, charts or tables and no methodology appendix` }];
    },
  },

  {
    // A KPI spark has at least six points.
    name: 'spark-points', level: 'warn', source: 'SPEC §8.2', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('[data-spark]')) {
        if (H.exempt(el, check)) continue;
        const n = (el.getAttribute('data-values') || '').split(',').filter(x => x.trim()).length;
        if (n < 6) out.push({ where: H.path(el), value: `${n} points (at least 6)` });
      }
      return out;
    },
  },
];
