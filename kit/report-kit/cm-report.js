/* Content Morphia · Report Kit runtime v1.2
   Requires ECharts 5 (loaded before this file). Behaviours, all opt-in by markup:
   [data-cm-theme-toggle]  light/dark switch (persists in localStorage "cm-theme")
   [data-cm-print]         opens the print dialog
   [data-chart]            ECharts option as <script type="application/json"> child; draws in when scrolled into view;
                           a "cm" key in the option declares a slope, bullet, strip, box or interval chart (SPEC section 9)
   [data-spark]            sparkline from data-values="1,2,3"
   table[data-sortable]    click-to-sort headers (th.num sorts numerically; td[data-value] overrides text)
   .cm-toc a[href^="#"]    scroll-spy sets aria-current on the visible section
   a.cm-cite[id]           following a citation points its source entry's back link (a.cm-back) at that citation
   .cm-topbar              its height, measured at load and on every change, sets --cm-topbar-h, the offset that keeps link targets clear of it
   html[data-cm-loaded]    set once the page and its fonts have loaded; turns on smooth scrolling for links within the page
   html[data-cm-static]    draws every chart at load with no animation (headless / PDF pipelines); CM.drawAll() does the same on demand */
(function () {
  'use strict';
  var doc = document.documentElement, KEY = 'cm-theme', PRINT_W = 640;
  var motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var charts = [], printing = false, prevTheme = null;

  /* ---------- theme ---------- */
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  if (!doc.dataset.theme) doc.dataset.theme = stored() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function syncToggles() {
    var dark = doc.dataset.theme === 'dark';
    document.querySelectorAll('[data-cm-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
      b.textContent = dark ? 'Light mode' : 'Dark mode';
    });
  }
  function setTheme(t) {
    doc.dataset.theme = t;
    try { localStorage.setItem(KEY, t); } catch (e) {}
    syncToggles(); redrawAll(false);
  }

  /* ---------- tokens ---------- */
  function cssVar(n) { return getComputedStyle(doc).getPropertyValue('--cm-' + n).trim(); }
  function tokens() {
    var t = {};
    ['ink', 'paper', 'surface', 'track', 'hairline', 'field', 'accent', 'accent-tint', 'accent-wash', 'ok', 'warn', 'crit', 'info', 'note',
      'ok-tint', 'warn-tint', 'crit-tint', 'info-tint', 'note-tint', 'c1', 'c2', 'c3', 'c4', 'context', 'l3'].forEach(function (k) { t[k] = cssVar(k); });
    t.seq = [1, 2, 3, 4, 5].map(function (i) { return cssVar('seq-' + i); });
    t.mono = "'JetBrains Mono', ui-monospace, monospace"; // code only; charts use t.font
    t.font = "'Nunito', system-ui, sans-serif";
    return t;
  }
  // the token names chart JSON uses as "$name" (SPEC section 3): "$accent" → current token value,
  // "$seq" → sequential ramp array. Any other text starting with "$", such as "$50", stays as written.
  var NAMES = ['ink', 'paper', 'surface', 'track', 'hairline', 'field', 'accent', 'ok', 'warn', 'crit', 'info', 'note', 'c1', 'c2', 'c3', 'c4', 'context', 'seq'];
  function resolve(v, t) {
    if (typeof v === 'string' && v.charAt(0) === '$') { var k = v.slice(1); return NAMES.indexOf(k) > -1 ? t[k] : v; }
    if (Array.isArray(v)) return v.map(function (x) { return resolve(x, t); });
    if (v && typeof v === 'object') { var o = {}; for (var p in v) o[p] = resolve(v[p], t); return o; }
    return v;
  }
  function merge(base, over) {
    var o = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (var k in over) {
      var b = o[k], v = over[k];
      o[k] = (b && v && typeof b === 'object' && typeof v === 'object' && !Array.isArray(v) && !Array.isArray(b)) ? merge(b, v) : v;
    }
    return o;
  }
  function list(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }

  /* ---------- ECharts theme ---------- */
  function theme(t) {
    var lab = { color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 600, margin: 12 };
    var axisName = { color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 800 };
    var cat = { axisLine: { show: true, lineStyle: { color: t.ink, width: 1.5 } }, axisTick: { show: false }, axisLabel: lab, splitLine: { show: false }, nameTextStyle: axisName };
    var val = { axisLine: { show: false }, axisTick: { show: false }, axisLabel: lab, splitLine: { show: true, lineStyle: { color: t.hairline, width: 1 } }, nameTextStyle: axisName };
    return {
      color: [t.c1, t.c2, t.c3, t.c4, t.context],
      backgroundColor: 'transparent',
      textStyle: { fontFamily: t.font, fontSize: 12, color: t.ink },
      legend: { left: 0, top: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 12, itemGap: 24, textStyle: { color: t.ink, fontFamily: t.font, fontSize: 13, fontWeight: 700, padding: [0, 0, 0, 2] } },
      grid: { left: 4, right: 24, top: 20, bottom: 4, containLabel: true },
      categoryAxis: cat, timeAxis: cat, valueAxis: val, logAxis: val,
      line: { symbol: 'circle', symbolSize: 7, showSymbol: false, smooth: false, lineStyle: { width: 2.5 } },
      bar: { barMaxWidth: 16, itemStyle: { borderRadius: [4, 4, 0, 0] } },
      scatter: { symbolSize: 9 },
      pie: { itemStyle: { borderColor: t.surface, borderWidth: 2 } },
      visualMap: { inRange: { color: t.seq }, textStyle: { color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 700 }, itemWidth: 12, itemHeight: 120 },
      animationDuration: 900, animationEasing: 'cubicOut', animationDurationUpdate: 300
    };
  }
  /* ---------- kit declarations ---------- */
  // Chart JSON carries no functions, so what ECharts cannot draw from JSON alone is declared under a
  // "cm" key and built here at every draw, from the current tokens (SPEC section 9, kit declarations).
  //   top level   {"cm": {"chart": "slope"}}                                 two points per line, labelled at both ends
  //   on a series {"cm": {"chart": "bullet", "target": 95, "bands": [...]}}  a horizontal bar against its target
  //               {"cm": {"chart": "strip", "values": [[...], ...]}}         every value per category, with its count
  //               {"cm": {"chart": "box", "values": [[...], ...]}}           quartiles per category ("n" with summaries)
  //               {"cm": {"chart": "interval", "name": "90% interval", "low": [...], "high": [...]}}
  //                                                                          a band round a line, error bars on bars and points
  var BAND = 20, BAR = 8, TICK = 28, JITTER = 8, GAP = 8, LINE = 18;
  var TICK_ICON = 'path://M0,0h2v12h-2z', ERROR_ICON = 'path://M0,0h8v1.5h-8z M3.25,0h1.5v12h-1.5z M0,10.5h8v1.5h-8z',
    BOX_ICON = 'path://M0,0h12v12h-12z M2,2v8h8v-8z';
  var ctx2d = null;
  function measure(s) {
    ctx2d = ctx2d || document.createElement('canvas').getContext('2d');
    ctx2d.font = "700 12px 'Nunito', system-ui, sans-serif";
    return Math.ceil(ctx2d.measureText(String(s)).width * 1.06);
  }
  function alpha(c, a) {
    ctx2d = ctx2d || document.createElement('canvas').getContext('2d');
    ctx2d.fillStyle = '#000'; ctx2d.fillStyle = c;
    var h = ctx2d.fillStyle;
    if (h.charAt(0) !== '#') return h;
    return 'rgba(' + [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }).join(',') + ',' + a + ')';
  }
  function val(d) { return d && typeof d === 'object' && !Array.isArray(d) ? d.value : d; }
  function num(v) { return typeof v === 'number' && window.echarts ? echarts.format.addCommas(v) : String(v); }
  // a value written with a template such as "{value}%" or "{c} h"
  function tpl(f, v) { return typeof f === 'string' && /\{(value|c)\}/.test(f) ? f.replace(/\{(value|c)\}/g, num(v)) : num(v); }
  function axisTpl(a) { return a && a.axisLabel && typeof a.axisLabel.formatter === 'string' ? a.axisLabel.formatter : '{value}'; }
  function quantile(s, p) { var h = (s.length - 1) * p, i = Math.floor(h); return s[i] + ((s[Math.min(i + 1, s.length - 1)] - s[i]) * (h - i)); }
  // Label centres ys (pixels) moved apart to at least gap, inside lo and hi, in their order: labels
  // that would touch form a cluster centred on their own mean.
  function dodge(ys, gap, lo, hi) {
    var cl = ys.map(function (y, i) { return i; }).sort(function (a, b) { return ys[a] - ys[b]; })
      .map(function (i) { return { items: [i], mean: ys[i] }; });
    var top = function (c) { var span = (c.items.length - 1) * gap; return Math.max(lo, Math.min(c.mean - span / 2, hi - span)); };
    for (var k = 0; k + 1 < cl.length;) {
      if (top(cl[k]) + cl[k].items.length * gap > top(cl[k + 1])) {
        var items = cl[k].items.concat(cl[k + 1].items);
        cl.splice(k, 2, { items: items, mean: items.reduce(function (s, i) { return s + ys[i]; }, 0) / items.length });
        k = Math.max(0, k - 1);
      } else k++;
    }
    var out = ys.slice();
    cl.forEach(function (c) { var y0 = top(c); c.items.forEach(function (i, n) { out[i] = y0 + n * gap; }); });
    return out;
  }
  function plotRect(inst) { var g = inst.getModel().getComponent('grid'); return g && g.coordinateSystem ? g.coordinateSystem.getRect() : { y: 0, height: inst.getHeight() }; }
  // End labels of lines that end close together move apart; the same for both ends of a slope.
  // Returns a labelLayout function: dataIndex is undefined for an end label.
  function spreadLabels(inst, ends) {
    var memo = {};
    return function (p) {
      var side = p.dataIndex == null ? 'end' : p.dataIndex;
      var make = ends[side];
      if (!make) return {};
      var key = side + ':' + inst.getWidth() + 'x' + inst.getHeight();
      if (!memo[key]) {
        var pts = make(), r = plotRect(inst);
        var ys = pts.map(function (q) { return q ? q[1] : NaN; });
        var ok = ys.filter(function (y) { return !isNaN(y); });
        var moved = dodge(ok, LINE, r.y - LINE, r.y + r.height + LINE);
        var m = {}, n = 0;
        pts.forEach(function (q, i) { if (q) m[i] = moved[n++] - q[1]; });
        memo[key] = m;
      }
      return { dy: memo[key][p.seriesIndex] || 0 };
    };
  }
  function colourOf(s) { return s.color || (s.lineStyle && s.lineStyle.color) || (s.itemStyle && s.itemStyle.color) || null; }

  function bullet(o, s, i, c, t, inst, out) {
    var data = list(s.data).map(val), n = data.length;
    var targets = Array.isArray(c.target) ? c.target : data.map(function () { return c.target; });
    var same = targets.every(function (x) { return x === targets[0]; });
    var vAxis = list(o.xAxis)[0] || {}, cAxis = list(o.yAxis)[0] || {};
    var f = s.label && typeof s.label.formatter === 'string' ? s.label.formatter : axisTpl(vAxis);
    var tname = 'Target' + (same ? ' ' + tpl(f, targets[0]) : '');
    var bands = list(c.bands);
    var shades = [[t.track], [t.track], [t.field, t.track], [t.field, t.hairline, t.track]][bands.length > 3 ? 3 : bands.length];
    var topRow = cAxis.inverse ? 0 : n - 1;
    var named = bands.some(function (b) { return b && b.name; });
    var extent = function () { return inst.getModel().getComponent('xAxis', s.xAxisIndex || 0).axis.scale.getExtent(); };
    var bandMax = bands.reduce(function (m, b, k) { return k < bands.length - 1 && b && typeof b.to === 'number' ? Math.max(m, b.to) : m; }, 0);
    out.series.push({
      type: 'custom', name: '', silent: true, z: 1, tooltip: { show: false }, clip: false,
      data: data.map(function (v, j) { return [bandMax, j]; }), encode: { x: 0, y: 1 },
      renderItem: function (p, api) {
        var j = api.value(1), ext = extent(), from = ext[0], kids = [], names = [];
        var steps = bands.length ? bands : [{}];
        steps.forEach(function (b, k) {
          var last = k === steps.length - 1;
          var to = !last && typeof b.to === 'number' ? Math.min(Math.max(b.to, from), ext[1]) : ext[1];
          var a = api.coord([from, j]), z = api.coord([to, j]);
          kids.push({ type: 'rect', shape: { x: a[0], y: a[1] - BAND / 2, width: Math.max(0, z[0] - a[0]), height: BAND, r: 4 }, style: { fill: shades[k], stroke: t.surface, lineWidth: 1.5 } });
          if (j === topRow && b.name) names.push({ text: b.name, x: a[0], w: measure(b.name), y: a[1] - BAND / 2 - GAP });
          from = to;
        });
        // band names sit above the top row, each at its band's start, moved right just clear of the
        // name before it, then left so the last stays inside the chart
        names.forEach(function (q, k) { if (k) q.x = Math.max(q.x, names[k - 1].x + names[k - 1].w + GAP); });
        for (var k = names.length - 1, edge = api.getWidth() - 2; k >= 0; k--) { names[k].x = Math.min(names[k].x, edge - names[k].w); edge = names[k].x - GAP; }
        names.forEach(function (q) { kids.push({ type: 'text', x: q.x, y: q.y, style: { text: q.text, fill: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 700, align: 'left', verticalAlign: 'bottom' } }); });
        var end = api.coord([ext[1], j]);
        kids.push({ type: 'text', x: end[0] + 12, y: end[1], style: { text: tpl(f, data[j]), fill: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 700, align: 'left', verticalAlign: 'middle' } });
        return { type: 'group', children: kids };
      }
    });
    out.series.push({
      type: 'custom', name: tname, z: 4, clip: false, itemStyle: { color: t.ink },
      data: targets.map(function (v, j) { return [v, j]; }), encode: { x: 0, y: 1, tooltip: 0 },
      renderItem: function (p, api) {
        var q = api.coord([api.value(0), api.value(1)]);
        return { type: 'rect', shape: { x: q[0] - 1, y: q[1] - TICK / 2, width: 2, height: TICK }, style: { fill: t.ink } };
      }
    });
    out.icons[tname] = TICK_ICON;
    s.barWidth = BAR; s.z = 3;
    if (s.label) s.label.show = false;
    cAxis.axisLine = merge(cAxis.axisLine || {}, { show: false });
    var w = Math.max.apply(null, data.map(function (v) { return measure(tpl(f, v)); }));
    o.grid = o.grid || {};
    o.grid.right = Math.max(o.grid.right || 0, w + 24);
    if (named) out.top = Math.max(out.top, 24);
  }

  function distribution(o, s, i, c, t, col, yCat, out) {
    var cAxis = list(yCat ? o.yAxis : o.xAxis)[0] || {};
    var groups = c.values ? list(c.values).map(function (g) {
      return list(g).filter(function (v) { return typeof v === 'number' && isFinite(v); }).sort(function (a, b) { return a - b; });
    }) : null;
    var counts = groups ? groups.map(function (g) { return g.length; }) : list(c.n);
    cAxis.axisLabel = merge(cAxis.axisLabel || {}, { lineHeight: 16, formatter: function (v, j) { return v + '\nn = ' + num(counts[j]); } });
    var at = function (v, j) { return yCat ? [v, j] : [j, v]; };
    var dot = { color: 'transparent', borderColor: col, borderWidth: 1.5 };
    if (c.chart === 'strip') {
      var pts = [], med = [];
      groups.forEach(function (g, j) {
        g.forEach(function (v, k) { var off = (((k * 0.618034) % 1) - 0.5) * 2 * JITTER; pts.push({ value: at(v, j), symbolOffset: yCat ? [0, off] : [off, 0] }); });
        if (g.length) med.push(at(quantile(g, 0.5), j));
      });
      s.data = pts; s.symbol = 'circle'; s.symbolSize = 8; s.itemStyle = merge(dot, s.itemStyle || {});
      out.icons[s.name] = 'circle';
      out.series.push({
        type: 'custom', name: 'Median', z: 4, itemStyle: { color: t.ink }, data: med,
        encode: yCat ? { x: 0, y: 1, tooltip: 0 } : { x: 0, y: 1, tooltip: 1 },
        renderItem: function (p, api) {
          var q = api.coord([api.value(0), api.value(1)]);
          return { type: 'rect', shape: yCat ? { x: q[0] - 1, y: q[1] - TICK / 2, width: 2, height: TICK } : { x: q[0] - TICK / 2, y: q[1] - 1, width: TICK, height: 2 }, style: { fill: t.ink } };
        }
      });
      out.icons.Median = TICK_ICON;
    } else {
      var outliers = [];
      if (groups) s.data = groups.map(function (g, j) {
        if (!g.length) return [];
        var q1 = quantile(g, 0.25), q3 = quantile(g, 0.75), iqr = q3 - q1;
        var inside = g.filter(function (v) { return v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr; });
        g.forEach(function (v) { if (inside.indexOf(v) < 0) outliers.push(at(v, j)); });
        return [inside[0], q1, quantile(g, 0.5), q3, inside[inside.length - 1]];
      });
      s.boxWidth = [16, 16];
      out.icons[s.name] = BOX_ICON;
      s.itemStyle = merge({ color: t.surface, borderColor: col, borderWidth: 2, borderJoin: 'round' }, s.itemStyle || {});
      if (outliers.length) {
        out.series.push({ type: 'scatter', name: 'Outliers', symbol: 'circle', symbolSize: 8, itemStyle: dot, data: outliers });
        out.icons.Outliers = 'circle';
      }
    }
    o.tooltip = merge({ trigger: 'item' }, o.tooltip || {});
  }

  function interval(o, s, i, c, t, col, yCat, inst, out) {
    var data = list(s.data), low = list(c.low), high = list(c.high);
    var base = function (j) { var d = val(data[j]); return Array.isArray(d) && d.length > 1 ? d[0] : j; };
    if (s.type === 'line') {
      var fill = alpha(col, 0.18);
      out.series.push({
        type: 'custom', name: c.name, z: 1, itemStyle: { color: fill },
        data: low.map(function (l, j) { return [base(j), l, high[j]]; }), encode: { x: 0, y: [1, 2], tooltip: [1, 2] },
        renderItem: function (p, api) {
          if (p.dataIndex !== 0) return null;
          var up = [], dn = [];
          low.forEach(function (l, j) { if (l == null || high[j] == null) return; up.push(api.coord([base(j), high[j]])); dn.unshift(api.coord([base(j), l])); });
          return { type: 'polygon', shape: { points: up.concat(dn) }, style: { fill: fill } };
        }
      });
      return;
    }
    out.series.push({
      type: 'custom', name: c.name, z: 7, clip: false, itemStyle: { color: t.ink },
      data: low.map(function (l, j) { return [base(j), l, high[j]]; }),
      encode: yCat ? { y: 0, x: [1, 2], tooltip: [1, 2] } : { x: 0, y: [1, 2], tooltip: [1, 2] },
      renderItem: function (p, api) {
        var j = p.dataIndex, b = api.value(0), a = api.coord(yCat ? [api.value(1), b] : [b, api.value(1)]), z = api.coord(yCat ? [api.value(2), b] : [b, api.value(2)]);
        // centred on the mark it belongs to: bars side by side sit off the category centre
        var lay = inst.getModel().getSeriesByIndex(i).getData().getItemLayout(j);
        if (lay) { var mid = Array.isArray(lay) ? lay : [lay.x + lay.width / 2, lay.y + lay.height / 2]; if (yCat) a[1] = z[1] = mid[1]; else a[0] = z[0] = mid[0]; }
        var st = { stroke: t.ink, lineWidth: 1.5 };
        var cap = function (q) { return { type: 'line', shape: yCat ? { x1: q[0], y1: q[1] - 4, x2: q[0], y2: q[1] + 4 } : { x1: q[0] - 4, y1: q[1], x2: q[0] + 4, y2: q[1] }, style: st }; };
        return { type: 'group', children: [{ type: 'line', shape: { x1: a[0], y1: a[1], x2: z[0], y2: z[1] }, style: st }, cap(a), cap(z)] };
      }
    });
    out.icons[c.name] = ERROR_ICON;
    // a bar's value label moves past the top of its interval
    if (s.type === 'bar' && s.label && s.label.show && !s.labelLayout) s.labelLayout = function (p) {
      if (p.dataIndex == null || high[p.dataIndex] == null) return {};
      var q = inst.convertToPixel({ seriesIndex: i }, yCat ? [high[p.dataIndex], base(p.dataIndex)] : [base(p.dataIndex), high[p.dataIndex]]);
      return yCat ? { x: q[0] + GAP, align: 'left' } : { y: q[1] - GAP, verticalAlign: 'bottom' };
    };
  }

  function slope(o, series, t, inst, out) {
    var xa = list(o.xAxis)[0] || {}, ya = list(o.yAxis)[0] || {};
    var f = axisTpl(ya);
    var picked = series.some(function (s) { return !!colourOf(s); });
    xa.boundaryGap = false;
    xa.axisLine = merge(xa.axisLine || {}, { show: false });
    ya.axisLabel = merge(ya.axisLabel || {}, { show: false });
    ya.splitLine = merge(ya.splitLine || {}, { show: false });
    xa.axisLabel = merge({ margin: 20 }, xa.axisLabel || {});
    if (ya.min == null) ya.min = 'dataMin';
    if (ya.max == null) ya.max = 'dataMax';
    var lw = 0, rw = 0;
    series.forEach(function (s) {
      var d = list(s.data).map(val);
      var L = s.name + '  ' + tpl(f, d[0]), R = tpl(f, d[1]) + '  ' + s.name;
      lw = Math.max(lw, measure(L)); rw = Math.max(rw, measure(R));
      if (!colourOf(s)) s.color = picked ? t.context : t.ink;
      s.symbol = 'circle'; s.symbolSize = 7; s.showSymbol = true;
      s.data = [{ value: d[0], label: { show: true, position: 'left', distance: GAP, formatter: L } },
        { value: d[1], label: { show: true, position: 'right', distance: GAP, formatter: R } }];
    });
    var side = function (j) {
      return function () { return series.map(function (s, k) { return inst.convertToPixel({ seriesIndex: k }, [j, s.data[j].value]); }); };
    };
    var lay = spreadLabels(inst, { 0: side(0), 1: side(1) });
    series.forEach(function (s) { s.labelLayout = lay; });
    o.grid = o.grid || {};
    o.grid.left = Math.max(o.grid.left || 0, lw + 2 * GAP + 4);
    o.grid.right = Math.max(o.grid.right || 0, rw + 2 * GAP + 4);
    out.legendOff = true;
  }

  // Expands every kit declaration in the option. Returns what the rest of prepare() needs: the series
  // added, legend icons for them, extra room above the plot, and whether the legend is left out.
  function expand(o, t, inst) {
    var out = { series: [], icons: {}, top: 0, legendOff: false };
    var series = list(o.series);
    var yCat = list(o.yAxis).some(function (a) { return a && a.type === 'category'; });
    var palette = [t.c1, t.c2, t.c3, t.c4, t.context];
    var top = o.cm;
    delete o.cm;
    if (top && top.chart === 'slope') slope(o, series, t, inst, out);
    series.forEach(function (s, i) {
      var c = s && s.cm;
      if (!c) return;
      delete s.cm;
      var col = colourOf(s) || palette[i % palette.length];
      if (c.chart === 'bullet') bullet(o, s, i, c, t, inst, out);
      else if (c.chart === 'strip' || c.chart === 'box') distribution(o, s, i, c, t, col, yCat, out);
      else if (c.chart === 'interval') interval(o, s, i, c, t, col, yCat, inst, out);
    });
    if (out.series.length) o.series = series.concat(out.series);
    return out;
  }

  function prepare(spec, t, animate, inst) {
    var o = resolve(JSON.parse(JSON.stringify(spec)), t);
    var axisChart = !!(o.xAxis || o.yAxis);
    o.animation = animate && motion && !printing;
    var cm = inst ? expand(o, t, inst) : { series: [], icons: {}, top: 0, legendOff: false };
    o.tooltip = merge({
      trigger: axisChart ? 'axis' : 'item', confine: true, backgroundColor: t.surface, borderColor: t.ink, borderWidth: 1.5, padding: [10, 14],
      textStyle: { color: t.ink, fontFamily: t.font, fontSize: 13 }, extraCssText: 'border-radius:12px;box-shadow:' + t.l3 + ';',
      axisPointer: { type: 'line', lineStyle: { color: t.ink, width: 1, type: [3, 3] }, shadowStyle: { color: t['accent-wash'] } }
    }, o.tooltip || {});
    // legend: shown automatically for 2+ series on axis charts; "legend": false opts out. A line
    // chart whose every line carries an end label naming it ("{a}" or the series name) has none, and
    // neither has a slope: the labels name the lines where they are.
    var series = list(o.series);
    var direct = series.length > 1 && series.every(function (s) {
      var e = s && s.endLabel;
      return s.type === 'line' && e && e.show && (e.formatter === '{a}' || e.formatter === s.name);
    });
    if (o.legend === false) o.legend = { show: false };
    else if (!o.legend && (cm.legendOff || direct)) o.legend = { show: false };
    else if (!o.legend && axisChart && series.length > 1) o.legend = {};
    var hasLegend = list(o.legend).some(function (l) { return l && l.show !== false; });
    // a legend lists the series it names, with the mark each declaration draws as its icon
    if (hasLegend && Object.keys(cm.icons).length) list(o.legend).forEach(function (l) {
      if (l && !l.data) l.data = series.filter(function (s) { return s && s.name; }).map(function (s) { return cm.icons[s.name] ? { name: s.name, icon: cm.icons[s.name] } : s.name; });
    });
    // end labels of lines that end close together move apart
    var ends = series.filter(function (s) { return s && s.type === 'line' && s.endLabel && s.endLabel.show && !s.labelLayout; });
    if (inst && ends.length > 1) {
      var spread = spreadLabels(inst, { end: function () {
        return series.map(function (s, k) {
          if (ends.indexOf(s) < 0) return null;
          var d = list(s.data), j = d.length - 1;
          while (j >= 0 && val(d[j]) == null) j--;
          if (j < 0) return null;
          var v = val(d[j]);
          return inst.convertToPixel({ seriesIndex: k }, Array.isArray(v) ? v : [j, v]);
        });
      } });
      ends.forEach(function (s) { s.labelLayout = spread; });
    }
    // axis titles: y name sits above the plot, left-aligned, on a value or a category axis (an inverse
    // axis starts at the top, so its name goes at the start); x name centred under the labels
    var yNamed = false, xNamed = false;
    list(o.yAxis).forEach(function (a) { if (a && a.name && !a.nameLocation) { yNamed = true; a.nameLocation = a.inverse ? 'start' : 'end'; if (a.nameGap == null) a.nameGap = 14; a.nameTextStyle = merge({ align: 'left' }, a.nameTextStyle || {}); } });
    list(o.xAxis).forEach(function (a) { if (a && a.name && !a.nameLocation) { xNamed = true; a.nameLocation = 'middle'; if (a.nameGap == null) a.nameGap = 34; } });
    // plot padding, worked out from what sits above and below the plot (sparks set their own).
    // Above: 20px, plus 36 for a legend and 26 for a y-axis title. A label at the top end of a
    // vertical reference line rises about 19px above the plot, so with one the top is at least 28.
    // Below: 4px, plus 32 for an x-axis title and 48 for a horizontal scale bar (visualMap) at the
    // bottom: its row and the gap above it.
    var markAbove = series.some(function (s) {
      var ml = s && s.markLine, base = (ml && ml.label) || {};
      return !!ml && list(ml.data).some(function (d) {
        var l = merge(base, (d && d.label) || {});
        return d && !Array.isArray(d) && d.xAxis != null && l.show !== false && (l.position || 'end') === 'end';
      });
    });
    var scaleBelow = list(o.visualMap).some(function (v) { return v && v.show !== false && v.orient === 'horizontal' && v.top == null; });
    if (axisChart && !Array.isArray(o.grid)) {
      o.grid = o.grid || {};
      if (o.grid.top == null) o.grid.top = Math.max(20 + (hasLegend ? 36 : 0) + (yNamed ? 26 : 0), markAbove ? 28 : 0) + cm.top;
      if (o.grid.bottom == null) o.grid.bottom = 4 + (xNamed ? 32 : 0) + (scaleBelow ? 48 : 0);
    }
    var yCat = list(o.yAxis).some(function (a) { return a && a.type === 'category'; });
    series.forEach(function (s, i) {
      if (s.type === 'bar' && s.stack) s.itemStyle = merge({ borderRadius: 3, borderColor: t.surface, borderWidth: 1.5 }, s.itemStyle || {});
      else if (s.type === 'bar' && yCat) s.itemStyle = merge({ borderRadius: [0, 4, 4, 0] }, s.itemStyle || {});
      if (s.type === 'line' && s.areaStyle && s.areaStyle.opacity == null) s.areaStyle.opacity = 0.18;
      if (s.type === 'pie') {
        if (s.label && s.label.show) s.label = merge({ overflow: 'none', alignTo: 'none', edgeDistance: 8 }, s.label);
        s.labelLine = merge({ length: 10, length2: 12, lineStyle: { color: t.ink, width: 1 } }, s.labelLine || {});
        if (s.avoidLabelOverlap == null) s.avoidLabelOverlap = true;
      }
      // value labels, on the series and on single points, sit on the surface colour; a series with a
      // reference line draws above it (markLine z is 5), so the line passes behind marks and numbers
      var label = { color: t.ink, opacity: 1, fontFamily: t.font, fontSize: 12, fontWeight: 700, backgroundColor: s.type === 'pie' ? 'transparent' : t.surface, padding: [3, 4], borderRadius: 2 };
      if (s.label && s.label.show) s.label = merge(label, s.label);
      list(s.data).forEach(function (d, j, all) { if (d && d.label && d.label.show) all[j] = merge(d, { label: merge(label, d.label) }); });
      if (s.endLabel && s.endLabel.show) s.endLabel = merge({ color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 800, distance: 8 }, s.endLabel);
      if (s.markLine && s.z == null) s.z = 6;
      if (s.markLine) s.markLine = merge({ symbol: 'none', silent: true, animation: false, lineStyle: { color: t.ink, width: 1.5, type: [4, 4] },
        label: { color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 700, backgroundColor: t.surface, padding: [2, 6] } }, s.markLine);
      if (s.markArea) s.markArea = merge({ silent: true, itemStyle: { color: t['accent-wash'] }, label: { color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 700 } }, s.markArea);
      if (o.animation && s.animationDelay == null) s.animationDelay = i * 120;
    });
    return o;
  }

  /* ---------- charts ---------- */
  function readSpec(el) {
    if (el._cmSpec) return el._cmSpec;
    if (el.hasAttribute('data-spark')) {
      var vals = (el.getAttribute('data-values') || '').split(',').map(Number);
      var color = '$' + (el.getAttribute('data-color') || 'accent');
      el._cmSpec = {
        grid: { left: 2, right: 6, top: 6, bottom: 6, containLabel: false }, tooltip: { show: false },
        xAxis: { type: 'category', show: false, boundaryGap: false, data: vals.map(function (v, i) { return i; }) },
        yAxis: { type: 'value', show: false, scale: true },
        series: [{ type: 'line', data: vals, silent: true, lineStyle: { width: 2, color: color }, itemStyle: { color: color },
          symbol: 'circle', symbolSize: 6, showSymbol: true, symbolKeepAspect: true,
          markPoint: undefined, emphasis: { disabled: true } }]
      };
      // only show the last point
      el._cmSpec.series[0].data = vals.map(function (v, i) { return i === vals.length - 1 ? { value: v, symbolSize: 7 } : { value: v, symbolSize: 0 }; });
      return el._cmSpec;
    }
    var s = el.querySelector('script[type="application/json"]');
    if (!s) return null;
    try { el._cmSpec = JSON.parse(s.textContent); } catch (e) { console.error('[cm] invalid chart JSON', el, e); return null; }
    s.remove();
    return el._cmSpec;
  }
  function draw(el, animate) {
    if (!window.echarts) return;
    var spec = readSpec(el); if (!spec) return;
    var old = echarts.getInstanceByDom(el); if (old) old.dispose();
    var t = tokens();
    echarts.registerTheme('cm', theme(t));
    var spark = el.hasAttribute('data-spark');
    if (!printing && el.clientWidth === 0) { el._cmPending = true; return; }
    el._cmPending = false;
    var opts = { renderer: 'svg' };
    if (printing) { opts.width = spark ? el.clientWidth : PRINT_W; opts.height = el.clientHeight || 320; }
    var inst = echarts.init(el, 'cm', opts);
    inst.setOption(prepare(spec, t, animate, inst));
    el._cmDrawn = true;
    if (printing) {
      try { inst.getZr().refreshImmediately(); } catch (e) {}
      var svg = el.querySelector('svg');
      if (svg) { svg.setAttribute('viewBox', '0 0 ' + opts.width + ' ' + opts.height); svg.setAttribute('preserveAspectRatio', 'xMinYMin meet'); }
    }
  }
  function redrawAll(animate) { charts.forEach(function (el) { if (el._cmDrawn || printing) draw(el, animate); }); }
  function drawAll() { charts.forEach(function (el) { if (!el._cmDrawn) draw(el, false); }); }
  function initCharts() {
    charts = Array.prototype.slice.call(document.querySelectorAll('[data-chart],[data-spark]'));
    charts.forEach(readSpec);
    if (!window.echarts) { console.warn('[cm] ECharts not loaded; charts skipped'); return; }
    // static paths: background tabs, headless renderers, print, explicit opt-out
    var isStatic = document.hidden || !('IntersectionObserver' in window) || matchMedia('print').matches || doc.hasAttribute('data-cm-static');
    if (isStatic) {
      drawAll();
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); draw(e.target, true); } });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      charts.forEach(function (el) { io.observe(el); });
      // a tab that becomes hidden before charts are reached would never draw them
      document.addEventListener('visibilitychange', function () { if (document.hidden) drawAll(); });
    }
    // size changes: hidden-at-load, closed <details>, tabs, layout shifts
    var fit = function (el) {
      if (printing) return;
      if (el._cmPending) { draw(el, false); return; }
      var i = el._cmDrawn && echarts.getInstanceByDom(el);
      if (i && (i.getWidth() !== el.clientWidth || i.getHeight() !== el.clientHeight)) i.resize();
    };
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function (es) { es.forEach(function (e) { fit(e.target); }); });
      charts.forEach(function (el) { ro.observe(el); });
    }
    var rt;
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { charts.forEach(fit); }, 120); });
  }

  /* ---------- sortable tables ---------- */
  function cellVal(td, num) {
    var raw = td.hasAttribute('data-value') ? td.getAttribute('data-value') : td.textContent.trim();
    if (!num) return raw.toLowerCase();
    var n = parseFloat(String(raw).replace(/\u2212/g, '-').replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? -Infinity : n;
  }
  function initTables() {
    document.querySelectorAll('table[data-sortable]').forEach(function (tbl) {
      if (!tbl.tHead || !tbl.tBodies[0]) return;
      var ths = Array.prototype.slice.call(tbl.tHead.rows[0].cells);
      ths.forEach(function (th, i) {
        if (th.hasAttribute('data-nosort')) return;
        var b = document.createElement('button'); b.type = 'button';
        while (th.firstChild) b.appendChild(th.firstChild);
        th.appendChild(b);
        if (!th.hasAttribute('aria-sort')) th.setAttribute('aria-sort', 'none');
        b.addEventListener('click', function () {
          var dir = th.getAttribute('aria-sort') === 'descending' ? 'ascending' : 'descending';
          ths.forEach(function (h) { if (h.hasAttribute('aria-sort')) h.setAttribute('aria-sort', 'none'); });
          th.setAttribute('aria-sort', dir);
          var num = th.classList.contains('num') || th.getAttribute('data-sort') === 'num';
          var body = tbl.tBodies[0], rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (a, c) {
            var x = cellVal(a.cells[i], num), y = cellVal(c.cells[i], num);
            return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'ascending' ? 1 : -1);
          });
          rows.forEach(function (r) { body.appendChild(r); });
        });
      });
    });
  }

  /* ---------- top bar offset ---------- */
  // The stylesheet stops every link target 24px below the top bar, using the height measured here.
  // The bar wraps to more rows on narrow screens and when its fonts arrive, so it is measured again
  // on every change.
  function initTopbar() {
    var bar = document.querySelector('.cm-topbar');
    var set = function () { doc.style.setProperty('--cm-topbar-h', (bar ? bar.getBoundingClientRect().height : 0) + 'px'); };
    set();
    if (bar && 'ResizeObserver' in window) new ResizeObserver(set).observe(bar);
  }

  /* ---------- smooth scrolling ---------- */
  // A page opened at an address with a fragment jumps straight to its target. Smooth scrolling waits
  // for the page and its fonts: a smooth scroll fixes its end point when it starts, and fonts that
  // arrive during it reflow the page under that end point.
  function initSmooth() {
    var loaded = new Promise(function (res) { if (document.readyState === 'complete') res(); else addEventListener('load', res); });
    loaded.then(function () { return document.fonts && document.fonts.ready; }).then(function () {
      requestAnimationFrame(function () { doc.setAttribute('data-cm-loaded', ''); });
    });
  }

  /* ---------- table of contents scroll-spy ---------- */
  function initToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.cm-toc a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = new Map();
    links.forEach(function (a) { var s = document.getElementById(decodeURIComponent(a.hash.slice(1))); if (s) map.set(s, a); });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        map.get(e.target).setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    map.forEach(function (a, s) { spy.observe(s); });
  }

  /* ---------- citations ---------- */
  // A source can be cited from several places, and its entry has one back link. As written, the link
  // returns to the first citation; following any citation points it at that citation instead, so the
  // way back leads to where the reader left the text.
  function followCite(e) {
    var a = e.target.closest && e.target.closest('a.cm-cite[id]');
    if (!a || a.hash.length < 2) return;
    var entry = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    var back = entry && entry.querySelector('a.cm-back');
    if (back) back.setAttribute('href', '#' + a.id);
  }

  /* ---------- print ---------- */
  function beforePrint() {
    if (printing) return;
    printing = true; prevTheme = doc.dataset.theme; doc.dataset.theme = 'light';
    document.querySelectorAll('details:not([open])').forEach(function (d) { d.dataset.cmClosed = '1'; d.open = true; });
    redrawAll(false);
  }
  function afterPrint() {
    if (!printing) return;
    printing = false; doc.dataset.theme = prevTheme;
    document.querySelectorAll('details[data-cm-closed]').forEach(function (d) { d.open = false; delete d.dataset.cmClosed; });
    redrawAll(false);
  }
  addEventListener('beforeprint', beforePrint);
  addEventListener('afterprint', afterPrint);
  var pm = matchMedia('print');
  var onPm = function (e) { if (e.matches) beforePrint(); else afterPrint(); };
  if (pm.addEventListener) pm.addEventListener('change', onPm); else if (pm.addListener) pm.addListener(onPm);

  /* ---------- boot ---------- */
  function boot() {
    syncToggles();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cm-theme-toggle]');
      if (t) setTheme(doc.dataset.theme === 'dark' ? 'light' : 'dark');
      if (e.target.closest('[data-cm-print]')) window.print();
      followCite(e);
    });
    initTopbar(); initSmooth(); initTables(); initToc(); initCharts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.CM = { draw: draw, drawAll: drawAll, redraw: redrawAll, setTheme: setTheme, tokens: tokens, tokenNames: NAMES.slice(), beforePrint: beforePrint, afterPrint: afterPrint };
})();
