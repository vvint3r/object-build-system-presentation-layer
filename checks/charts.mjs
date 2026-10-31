// Charts: the JSON as written, and what the chart library drew from it. Each in-page function is
// self-contained, so small helpers are repeated inside it.

export default [
  {
    // Every chart's JSON parses; every KPI spark has numbers.
    name: 'chart-json', level: 'fail', source: 'SPEC §14 item 10', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) if (c.error && !H.exempt(c.src, check)) out.push({ where: c.where, value: c.error });
      for (const el of H.source().querySelectorAll('[data-spark]')) {
        if (H.exempt(el, check)) continue;
        const v = (el.getAttribute('data-values') || '').split(',');
        if (v.length < 2 || v.some(x => x.trim() === '' || !Number.isFinite(Number(x)))) out.push({ where: H.path(el), value: `data-values="${el.getAttribute('data-values') || ''}"` });
      }
      return out;
    },
  },

  {
    name: 'chart-a11y', level: 'fail', source: 'SPEC §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of H.source().querySelectorAll('.cm-chart')) {
        if (H.exempt(el, check)) continue;
        if (el.getAttribute('role') !== 'img') out.push({ where: H.path(el), value: `role="${el.getAttribute('role') || ''}" (role="img")` });
        if (!(el.getAttribute('aria-label') || '').trim()) out.push({ where: H.path(el), value: 'no aria-label' });
      }
      return out;
    },
  },

  {
    // Every chart and spark was drawn in this mode, and its box holds the drawing: a chart whose
    // drawing is taller than its box is cut off or covers what follows it.
    name: 'chart-drawn', level: 'fail', source: 'SPEC §14 item 13',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-chart, [data-spark]')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const inst = window.echarts && window.echarts.getInstanceByDom(el);
        const drawn = el.querySelector('svg, canvas');
        if (!inst || !drawn) { out.push({ where: H.path(el), value: 'not drawn' }); continue; }
        const box = el.getBoundingClientRect().height, art = drawn.getBoundingClientRect().height;
        if (art - box > 1) out.push({ where: H.path(el), value: `drawing ${Math.round(art)}px tall in a box ${Math.round(box)}px tall` });
      }
      return out;
    },
  },

  {
    // Colours in chart JSON are token strings: no hex or colour function anywhere, and every value
    // under a colour key is "$" and a token name the chart script resolves (SPEC section 3). Other
    // text starting with "$" stays text, so under a colour key it is not a colour.
    name: 'chart-colours', level: 'fail', source: 'SPEC §1 rule 3; §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const names = (window.CM && window.CM.tokenNames) || [];
      const known = k => names.includes(k);
      const LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
      const KEY = /colou?r|fill|stroke|background/i;
      const NOT_COLOUR = ['transparent', 'none', 'inherit', 'auto'];
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        const walk = (v, key, at) => {
          if (Array.isArray(v)) return v.forEach((x, i) => walk(x, key, `${at}[${i}]`));
          if (v && typeof v === 'object') return Object.entries(v).forEach(([k, x]) => walk(x, k, at ? `${at}.${k}` : k));
          if (typeof v !== 'string') return;
          if (LITERAL.test(v)) out.push({ where: c.where, value: `${at}: "${v}" (colours are $token strings)` });
          else if (KEY.test(key) && !NOT_COLOUR.includes(v) && !(v[0] === '$' && known(v.slice(1)))) out.push({ where: c.where, value: `${at}: "${v}" (not a kit token)` });
        };
        walk(c.json, '', '');
      }
      return out;
    },
  },

  {
    // 3D, radar, gauge, word clouds, gradients, dual y-axes, more than one chart per figure.
    name: 'chart-forbidden', level: 'fail', source: 'SPEC §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const has = (v, key) => Array.isArray(v) ? v.some(x => has(x, key)) : v && typeof v === 'object' ? Object.entries(v).some(([k, x]) => k === key || has(x, key)) : false;
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        for (const s of H.list(c.json.series)) {
          if (s && /3D$|^(radar|gauge|wordCloud)$/.test(s.type || '')) out.push({ where: c.where, value: `series type "${s.type}"` });
        }
        if (c.json.radar) out.push({ where: c.where, value: 'radar component' });
        if (has(c.json, 'colorStops')) out.push({ where: c.where, value: 'gradient (colorStops)' });
        const perGrid = {};
        for (const a of H.list(c.json.yAxis)) { const g = (a && a.gridIndex) || 0; perGrid[g] = (perGrid[g] || 0) + 1; }
        for (const [g, n] of Object.entries(perGrid)) if (n > 1) out.push({ where: c.where, value: `${n} y-axes on grid ${g}` });
      }
      for (const f of H.source().querySelectorAll('figure')) {
        const n = f.querySelectorAll('.cm-chart').length;
        if (n > 1 && !H.exempt(f, check)) out.push({ where: H.path(f), value: `${n} charts in one figure` });
      }
      return out;
    },
  },

  {
    // A legend for two or more series; one series has none, so the JSON never needs to turn it off.
    // A line chart whose every line carries an end label naming it ("{a}" or the series name), and a
    // slope, have none: their labels name the lines. A legend turned off on 2+ other series fails.
    name: 'chart-legend', level: 'fail', source: 'SPEC §9; §14 item 5', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const named = s => s.type === 'line' && s.endLabel && s.endLabel.show && (s.endLabel.formatter === '{a}' || s.endLabel.formatter === s.name);
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        const series = H.list(c.json.series).filter(s => s && s.type !== 'pie');
        const off = c.json.legend === false || H.list(c.json.legend).some(l => l && l.show === false);
        const direct = (c.json.cm && c.json.cm.chart === 'slope') || series.every(named);
        if (series.length > 1 && off && !direct) out.push({ where: c.where, value: `${series.length} series with the legend turned off` });
      }
      return out;
    },
  },

  {
    // The value axis has a title with its unit, unless every tick shows the unit (a formatter such
    // as "{value}%"). Scatter names both axes.
    name: 'chart-axis-names', level: 'fail', source: 'SPEC §9; §14 item 5', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      const unitTicks = a => a.axisLabel && typeof a.axisLabel.formatter === 'string' && /\{value\}/.test(a.axisLabel.formatter) && /\S/.test(a.axisLabel.formatter.replace(/\{value\}/g, ''));
      const named = a => typeof a.name === 'string' && a.name.trim();
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        const series = H.list(c.json.series);
        // a strip is drawn by a scatter series on a category axis: only its value axis is named
        const scatter = series.some(s => s && s.type === 'scatter' && !(s.cm && s.cm.chart === 'strip'));
        for (const [dim, def] of [['xAxis', 'category'], ['yAxis', 'value']]) {
          H.list(c.json[dim]).forEach((a, i) => {
            if (!a || a.show === false) return;
            const type = a.type || def;
            if (scatter ? !named(a) : ((type === 'value' || type === 'log') && !named(a) && !unitTicks(a))) {
              out.push({ where: c.where, value: `${dim}[${i}] (${type}) has no name${scatter ? ' (scatter names both axes)' : ' and its ticks show no unit'}` });
            }
          });
        }
      }
      return out;
    },
  },

  {
    // Every axis title the chart library drew sits inside the chart's drawing area, on a value or a
    // category axis. Measured on the laid-out title (its box, moved by its transform) against the
    // chart's width and height in this mode, so a title cut off at an edge is reported.
    name: 'chart-axis-title-fit', level: 'fail', source: 'SPEC §9',
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-chart')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const inst = window.echarts && window.echarts.getInstanceByDom(el);
        if (!inst) continue; // chart-drawn reports it
        const W = inst.getWidth(), Ht = inst.getHeight();
        for (const dim of ['xAxis', 'yAxis']) {
          inst.getModel().eachComponent(dim, model => {
            const name = model.get('name');
            if (!name || model.get('show') === false) return;
            const view = inst.getViewOfComponentModel(model);
            let title = null;
            if (view && view.group) view.group.traverse(n => { if (n.anid === 'name' && n.style && !title) title = n; });
            if (!title) { out.push({ where: H.path(el), value: `${dim}[${model.componentIndex}] title "${name}" not drawn` }); return; }
            const r = title.getBoundingRect().clone();
            r.applyTransform(title.getComputedTransform());
            const past = [['top', -r.y], ['left', -r.x], ['bottom', r.y + r.height - Ht], ['right', r.x + r.width - W]]
              .filter(([, v]) => v > 0.5).map(([side, v]) => `${v.toFixed(1)}px past the ${side}`);
            if (past.length) out.push({ where: H.path(el), value: `${dim}[${model.componentIndex}] title "${name}" ${past.join(', ')}` });
          });
        }
      }
      return out;
    },
  },

  {
    // Plot top and bottom padding are the kit's: the chart script works them out from the legend,
    // axis titles, reference-line labels and scale bar, so chart JSON never sets them on its grid.
    name: 'chart-padding', level: 'fail', source: 'SPEC §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        const g = c.json.grid;
        if (!g || typeof g !== 'object' || Array.isArray(g)) continue;
        for (const k of ['top', 'bottom']) if (g[k] != null) out.push({ where: c.where, value: `grid.${k}: ${JSON.stringify(g[k])} (the kit sets plot padding)` });
      }
      return out;
    },
  },

  {
    // Bars and areas start at zero: in the JSON (no min above zero, no scale) and on the axis the
    // chart library actually drew.
    name: 'chart-baseline', level: 'fail', source: 'SPEC §9; §14 item 10', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || !c.live || H.exempt(c.src, check)) continue;
        const yCat = H.list(c.json.yAxis).some(a => a && a.type === 'category');
        const inst = window.echarts && window.echarts.getInstanceByDom(c.live);
        const seen = new Set();
        for (const s of H.list(c.json.series)) {
          if (!s || !(s.type === 'bar' || (s.type === 'line' && s.areaStyle))) continue;
          const dim = s.type === 'bar' && yCat ? 'xAxis' : 'yAxis';
          const i = s[dim + 'Index'] || 0;
          if (seen.has(dim + i)) continue;
          seen.add(dim + i);
          const a = H.list(c.json[dim])[i] || {};
          if (typeof a.min === 'number' && a.min > 0) out.push({ where: c.where, value: `${s.type}${s.areaStyle ? ' area' : ''} on ${dim}[${i}] with min ${a.min}` });
          else if (a.scale === true) out.push({ where: c.where, value: `${s.type}${s.areaStyle ? ' area' : ''} on ${dim}[${i}] with scale: true` });
          else if (inst) {
            try {
              const lo = inst.getModel().getComponent(dim, i).axis.scale.getExtent()[0];
              if (lo > 0) out.push({ where: c.where, value: `${s.type}${s.areaStyle ? ' area' : ''} on ${dim}[${i}] drawn from ${lo}` });
            } catch (e) { out.push({ where: c.where, value: `could not read the drawn ${dim}[${i}]: ${e.message}` }); }
          }
        }
      }
      return out;
    },
  },

  {
    name: 'bar-width', level: 'fail', source: 'SPEC §9', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        H.list(c.json.series).forEach((s, i) => {
          if (!s || s.type !== 'bar') return;
          for (const k of ['barWidth', 'barMaxWidth']) {
            const v = s[k];
            if (v == null) continue;
            if (typeof v === 'string' ? /%$/.test(v) || parseFloat(v) > 16 : v > 16) out.push({ where: c.where, value: `series[${i}].${k}: ${JSON.stringify(v)} (at most 16)` });
          }
        });
      }
      return out;
    },
  },

  {
    // At most four coloured series (series set to $context do not count); a pie has at most four
    // slices. A slope draws every line the JSON leaves uncoloured in ink, or in $context once any
    // line is picked out, so only the lines given a colour count.
    name: 'series-count', level: 'fail', source: 'SPEC §9; §14 item 7', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        const series = H.list(c.json.series).filter(Boolean);
        const colours = s => [s.color, s.itemStyle && s.itemStyle.color, s.lineStyle && s.lineStyle.color];
        const grey = s => colours(s).includes('$context');
        const slope = c.json.cm && c.json.cm.chart === 'slope';
        const coloured = series.filter(s => s.type !== 'pie' && !grey(s) && (!slope || colours(s).some(Boolean))).length;
        if (coloured > 4) out.push({ where: c.where, value: `${coloured} coloured series (at most 4)` });
        for (const s of series) if (s.type === 'pie' && H.list(s.data).length > 4) out.push({ where: c.where, value: `pie with ${H.list(s.data).length} slices (at most 4)` });
      }
      return out;
    },
  },
];
