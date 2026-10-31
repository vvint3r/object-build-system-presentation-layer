// Chart recipes: the kit declarations ("cm" keys) in chart JSON, read as written, and what the chart
// library drew from them and from every other chart (SPEC section 9). Each in-page function is
// self-contained, so small helpers are repeated inside it.

export default [
  {
    // Each declaration names a chart the kit builds and sits where it belongs: "slope" at the top
    // level of a line chart; "bullet" on a bar, "strip" on a scatter, "box" on a boxplot series and
    // "interval" on a line, bar or scatter series. Its fields have the shape the spec gives.
    name: 'chart-declaration', level: 'fail', source: 'SPEC §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const ON = { bullet: ['bar'], strip: ['scatter'], box: ['boxplot'], interval: ['line', 'bar', 'scatter'] };
      const isNum = v => typeof v === 'number' && Number.isFinite(v);
      const numbers = a => Array.isArray(a) && a.every(isNum);
      const val = d => (d && typeof d === 'object' && !Array.isArray(d) ? d.value : d);
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        const o = c.json, series = H.list(o.series).filter(Boolean);
        const say = v => out.push({ where: c.where, value: v });
        const yCat = H.list(o.yAxis).some(a => a && a.type === 'category');
        const cats = (H.list(yCat ? o.yAxis : o.xAxis)[0] || {}).data;
        if (o.cm !== undefined) {
          if (!o.cm || o.cm.chart !== 'slope') say(`top-level cm ${JSON.stringify(o.cm)} (only {"chart": "slope"})`);
          else {
            const x = (H.list(o.xAxis)[0] || {});
            if (x.type !== 'category' || !Array.isArray(x.data) || x.data.length !== 2) say(`slope x-axis with ${Array.isArray(x.data) ? x.data.length : 'no'} categories (exactly 2)`);
            series.forEach((s, i) => {
              if (s.type !== 'line') say(`slope series[${i}] type "${s.type}" (line)`);
              const d = H.list(s.data).map(val);
              if (d.length !== 2 || !d.every(isNum)) say(`slope series[${i}] "${s.name || ''}" with data ${JSON.stringify(d)} (two numbers)`);
              if (!s.name) say(`slope series[${i}] has no name`);
            });
          }
        }
        let shown = 0;
        series.forEach((s, i) => {
          const d = s.cm;
          if (d === undefined) return;
          const at = `series[${i}].cm`;
          if (!d || !ON[d.chart]) return say(`${at}.chart ${JSON.stringify(d && d.chart)} (bullet, strip, box or interval)`);
          if (!ON[d.chart].includes(s.type)) return say(`${at} "${d.chart}" on a ${s.type} series (${ON[d.chart].join(' or ')})`);
          const n = H.list(s.data).length;
          if (d.chart === 'bullet') {
            if (!yCat) say(`${at}: a bullet is horizontal (categories on the y-axis)`);
            if (!(isNum(d.target) || (numbers(d.target) && d.target.length === n))) say(`${at}.target ${JSON.stringify(d.target)} (a number, or one per bar: ${n})`);
            if (d.bands !== undefined) {
              const b = d.bands;
              if (!Array.isArray(b) || b.length < 1 || b.length > 3) say(`${at}.bands: ${Array.isArray(b) ? b.length : 'not a list of'} bands (1 to 3)`);
              else b.forEach((x, k) => {
                if (!x || typeof x.name !== 'string' || !x.name.trim()) say(`${at}.bands[${k}] has no name`);
                if (k < b.length - 1 && !(x && isNum(x.to) && (k === 0 || x.to > b[k - 1].to))) say(`${at}.bands[${k}].to ${JSON.stringify(x && x.to)} (a number above the band before it)`);
              });
            }
          }
          if (d.chart === 'strip' || d.chart === 'box') {
            shown++;
            const k = Array.isArray(cats) ? cats.length : null;
            if (d.values !== undefined) {
              if (!Array.isArray(d.values) || !d.values.every(numbers) || (k !== null && d.values.length !== k)) say(`${at}.values: one list of numbers per category (${k})`);
            } else if (d.chart === 'box') {
              if (!numbers(d.n) || d.n.length !== n || H.list(s.data).some(r => !numbers(r) || r.length !== 5)) say(`${at}: a box from summaries has five numbers per category in data and a count per category in n`);
            } else say(`${at}.values missing`);
          }
          if (d.chart === 'interval') {
            if (!numbers(d.low) || !numbers(d.high) || d.low.length !== n || d.high.length !== n) say(`${at}: low and high hold one number per point (${n})`);
            else H.list(s.data).map(val).forEach((v, j) => {
              const y = Array.isArray(v) ? v[yCat ? 0 : 1] : v;
              if (isNum(y) && !(d.low[j] <= y && y <= d.high[j])) say(`${at}: point ${j} at ${y} outside its interval ${d.low[j]} to ${d.high[j]}`);
            });
          }
        });
        if (shown > 1) say(`${shown} distribution series (one per chart)`);
      }
      return out;
    },
  },

  {
    // A bullet has a target for every bar.
    name: 'bullet-target', level: 'fail', source: 'SPEC §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        H.list(c.json.series).forEach((s, i) => {
          if (!s || !s.cm || s.cm.chart !== 'bullet') return;
          const n = H.list(s.data).length, t = s.cm.target;
          const ok = typeof t === 'number' || (Array.isArray(t) && t.length === n && t.every(x => typeof x === 'number'));
          if (!ok) out.push({ where: c.where, value: `series[${i}] bullet with target ${JSON.stringify(t)} for ${n} bars` });
        });
      }
      return out;
    },
  },

  {
    // A slope has exactly two categories, and every line is named by a label at both ends: one left
    // of the plot and one right of it, as drawn in this mode.
    name: 'slope-ends', level: 'fail', source: 'SPEC §9',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || !c.live || !c.json.cm || c.json.cm.chart !== 'slope' || H.exempt(c.src, check)) continue;
        const x = H.list(c.json.xAxis)[0] || {};
        if (!Array.isArray(x.data) || x.data.length !== 2) out.push({ where: c.where, value: `${Array.isArray(x.data) ? x.data.length : 'no'} categories (exactly 2)` });
        const inst = window.echarts && window.echarts.getInstanceByDom(c.live);
        if (!inst) continue;
        const rect = inst.getModel().getComponent('grid').coordinateSystem.getRect();
        const box = c.live.getBoundingClientRect(), scale = box.width / inst.getWidth();
        const left = box.left + rect.x * scale, right = box.left + (rect.x + rect.width) * scale;
        const texts = [...c.live.querySelectorAll('svg text')].map(t => ({ s: t.textContent.replace(/\s+/g, ' ').trim(), r: t.getBoundingClientRect() }));
        for (const s of H.list(c.json.series)) {
          if (!s || !s.name) continue;
          const name = s.name.replace(/\s+/g, ' ').trim();
          const l = texts.some(t => t.s.startsWith(name + ' ') && t.r.right <= left + 1);
          const r = texts.some(t => t.s.endsWith(' ' + name) && t.r.left >= right - 1);
          if (!l || !r) out.push({ where: c.where, value: `"${name}" labelled ${l ? '' : 'not '}at the left and ${r ? '' : 'not '}at the right` });
        }
      }
      return out;
    },
  },

  {
    // A strip or box chart states its count: each category label, as drawn in this mode, carries
    // "n = " and the number of values in that category.
    name: 'distribution-count', level: 'fail', source: 'SPEC §9',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || !c.live || H.exempt(c.src, check)) continue;
        const s = H.list(c.json.series).find(x => x && x.cm && (x.cm.chart === 'strip' || x.cm.chart === 'box'));
        if (!s) continue;
        const counts = Array.isArray(s.cm.values) ? s.cm.values.map(g => H.list(g).filter(v => typeof v === 'number' && Number.isFinite(v)).length) : H.list(s.cm.n);
        const drawn = [...c.live.querySelectorAll('svg text')].map(t => t.textContent.replace(/\s+/g, ' ').trim());
        const fmt = n => Number(n).toLocaleString('en-US');
        const want = {};
        counts.forEach(n => { want[fmt(n)] = (want[fmt(n)] || 0) + 1; });
        for (const [n, k] of Object.entries(want)) {
          const got = drawn.filter(t => t === `n = ${n}` || t.endsWith(` n = ${n}`)).length;
          if (got < k) out.push({ where: c.where, value: `"n = ${n}" drawn ${got} times for ${k} categories` });
        }
      }
      return out;
    },
  },

  {
    // An uncertainty chart names its interval: the name states its level or kind ("90% interval",
    // "95% confidence interval", "Interquartile range") and is drawn in the chart in this mode.
    name: 'interval-name', level: 'fail', source: 'SPEC §9',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const STATES = /\d|interval|error|deviation|range|quartile|percentile/i;
      for (const c of H.charts()) {
        if (!c.json || !c.live || H.exempt(c.src, check)) continue;
        const drawn = [...c.live.querySelectorAll('svg text')].map(t => t.textContent.replace(/\s+/g, ' ').trim());
        H.list(c.json.series).forEach((s, i) => {
          if (!s || !s.cm || s.cm.chart !== 'interval') return;
          const name = typeof s.cm.name === 'string' ? s.cm.name.replace(/\s+/g, ' ').trim() : '';
          if (!name) out.push({ where: c.where, value: `series[${i}] interval has no name` });
          else if (!STATES.test(name)) out.push({ where: c.where, value: `series[${i}] interval "${name}" states no level or kind` });
          else if (!drawn.includes(name)) out.push({ where: c.where, value: `series[${i}] interval "${name}" not drawn` });
        });
      }
      return out;
    },
  },

  {
    // No two pieces of text the chart library drew overlap: labels, end labels, axis labels and
    // titles, legend entries and reference-line labels, in this mode. Boxes are the text's laid-out
    // boxes on screen. Two boxes that share 2px or less in either direction do not overlap: a box
    // holds the font's empty ascent and descent as well as the glyphs.
    name: 'chart-label-overlap', level: 'fail', source: 'SPEC §9',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-chart')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const texts = [...el.querySelectorAll('svg text')]
          .filter(t => t.textContent.trim() && H.shown(t))
          .map(t => ({ r: t.getBoundingClientRect(), s: t.textContent.trim() }))
          .filter(x => x.r.width > 0 && x.r.height > 0);
        for (let i = 0; i < texts.length; i++) {
          for (let j = i + 1; j < texts.length; j++) {
            const a = texts[i].r, b = texts[j].r;
            const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (w > 2 && h > 2) out.push({ where: H.path(el), value: `"${texts[i].s.slice(0, 24)}" and "${texts[j].s.slice(0, 24)}" overlap by ${w.toFixed(1)} × ${h.toFixed(1)}px` });
          }
        }
      }
      return out;
    },
  },
];
