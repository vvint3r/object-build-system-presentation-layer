// Charts: the JSON as written, and what the chart library drew from it. Each in-page function is
// self-contained, so small helpers are repeated inside it.

import { PRINT_PAGE } from '../tools/load.mjs';

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
    // The kit sets the legend: one for two or more series, none for one. A line chart whose every
    // line carries an end label naming it ("{a}" or the series name), and a slope, have none: their
    // labels name the lines. The JSON sets no legend, so a legend key of any value fails.
    name: 'chart-legend', level: 'fail', source: 'SPEC §9; §14 item 5', once: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const c of H.charts()) {
        if (!c.json || H.exempt(c.src, check)) continue;
        if ('legend' in c.json) out.push({ where: c.where, value: `"legend": ${JSON.stringify(c.json.legend)} in the JSON (none: the kit sets the legend)` });
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
    // Every text the chart library drew lies inside the drawing it belongs to: value labels, end
    // labels, reference-line labels, axis labels and a scale bar's end labels. The drawing is an
    // SVG, and the kit's text checks pass over chart internals, so each text the SVG renders is
    // measured against the SVG's own box, in every mode and at the phone width.
    name: 'chart-text-fit', level: 'fail', source: 'SPEC §5; §9', phone: true,
    inPage: ({ check }) => {
      const H = window.__cm, out = [];
      for (const el of document.querySelectorAll('.cm-chart')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const svg = el.querySelector('svg');
        if (!svg) continue; // chart-drawn reports a chart that did not draw
        const box = svg.getBoundingClientRect(), seen = new Set();
        for (const t of svg.querySelectorAll('text')) {
          const text = t.textContent.replace(/\s+/g, ' ').trim();
          if (!text || getComputedStyle(t).visibility === 'hidden' || t.closest('[opacity="0"]')) continue;
          const r = t.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const past = [['top', box.top - r.top], ['left', box.left - r.left], ['bottom', r.bottom - box.bottom], ['right', r.right - box.right]]
            .filter(([, v]) => v > 1).map(([side, v]) => `${Math.ceil(v)}px past the ${side}`);
          const value = `"${text.slice(0, 24)}" ${past.join(', ')} of a ${Math.round(box.width)}px by ${Math.round(box.height)}px chart`;
          if (past.length && !seen.has(value)) { seen.add(value); out.push({ where: H.path(el), value }); }
        }
      }
      return out;
    },
  },

  {
    // No chart text covers another, and no text sits on a reference line (a dashed line drawn across
    // the plot): a value label that would cross one moves off it, and a y-axis title rises above the
    // label of a vertical reference line it would meet. Measured as drawn, at every width; print at
    // the printed column's width. Two texts overlap when they share more than 1px across and more
    // than a quarter of a line's height down, so labels that only touch at a corner pass.
    name: 'chart-label-clear', level: 'fail', source: 'SPEC §9; record 096', phone: true,
    run: async ({ page, mode }) => {
      const before = page.viewportSize();
      if (mode === 'print') { await page.setViewportSize(PRINT_PAGE); await page.waitForTimeout(300); }
      const found = await page.evaluate(check => {
      const H = window.__cm, out = [];
      const cross = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1
        && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > Math.min(a.height, b.height) / 4;
      for (const el of document.querySelectorAll('.cm-chart')) {
        if (!H.shown(el) || H.exempt(el, check)) continue;
        const svg = el.querySelector('svg');
        if (!svg) continue;
        const texts = [...svg.querySelectorAll('text')].map(t => ({ s: t.textContent.replace(/\s+/g, ' ').trim(), r: t.getBoundingClientRect(), t }))
          .filter(x => x.s && x.r.width && x.r.height && getComputedStyle(x.t).visibility !== 'hidden' && !x.t.closest('[opacity="0"]'));
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          if (cross(texts[i].r, texts[j].r)) out.push({ where: H.path(el), value: `"${texts[i].s.slice(0, 24)}" overlaps "${texts[j].s.slice(0, 24)}"` });
        }
        const lines = [...svg.querySelectorAll('path[stroke-dasharray]')].map(p => p.getBoundingClientRect())
          .filter(r => (r.width < 3 && r.height > 8) || (r.height < 3 && r.width > 8));
        for (const l of lines) for (const x of texts) {
          const r = x.r, vertical = l.width < 3, mid = vertical ? (l.left + l.right) / 2 : (l.top + l.bottom) / 2;
          const on = vertical ? mid > r.left + 1 && mid < r.right - 1 && l.top < r.bottom - 1 && l.bottom > r.top + 1
            : mid > r.top + 1 && mid < r.bottom - 1 && l.left < r.right - 1 && l.right > r.left + 1;
          if (on) out.push({ where: H.path(el), value: `"${x.s.slice(0, 24)}" sits on a reference line` });
        }
      }
      return out;
      }, 'chart-label-clear');
      if (mode === 'print') { await page.setViewportSize(before); await page.waitForTimeout(300); }
      return found;
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
