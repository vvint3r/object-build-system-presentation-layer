/* Content Morphia · Report Kit runtime v2.0
   Requires ECharts 5 (loaded before this file). Behaviours, all opt-in by markup:
   [data-cm-theme-toggle]  light/dark switch (persists in localStorage "cm-theme")
   [data-cm-print]         opens the print dialog
   [data-chart]            ECharts option as <script type="application/json"> child; draws in when scrolled into view;
                           a "cm" key in the option declares a slope, bullet, strip, box or interval chart (SPEC section 9)
   [data-spark]            sparkline from data-values="1,2,3"
   .cm-diagram[data-diagram]  diagram JSON as <script type="application/json"> child, in a drawing mode (flow, sequence,
                           state, entity-relationship, layer-stack, hierarchy); draws nodes, edges and labels, and writes the text version after the caption
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
  // A value label carries thousands separators and the chart's precision: the most decimal places
  // any value in its series is written with, so 94.0 beside 96.1 reads "94.0" (SPEC section 9).
  // JSON keeps no trailing zero, so the places come from the chart's other values.
  function places(v) { var m = String(v).match(/\.(\d+)$/); return m ? m[1].length : 0; }
  function precision(series) {
    var dp = 0;
    list(series).forEach(function (s) {
      list(s && s.data).forEach(function (d) { var v = val(d); if (typeof v === 'number' && isFinite(v)) dp = Math.max(dp, places(v)); });
    });
    return Math.min(dp, 4);
  }
  function num(v, dp) {
    if (typeof v !== 'number' || !window.echarts) return String(v);
    return echarts.format.addCommas(dp == null ? v : v.toFixed(dp));
  }
  // a value written with a template such as "{value}%" or "{c} h"
  function tpl(f, v, dp) { return typeof f === 'string' && /\{(value|c)\}/.test(f) ? f.replace(/\{(value|c)\}/g, num(v, dp)) : num(v, dp); }
  // A label template ("{c}%", "{a}: {c}") as a function that writes {c} as tpl() does.
  function valueLabel(f, dp) {
    return function (p) {
      var v = Array.isArray(p.value) ? null : p.value;
      return f.replace(/\{a\}/g, p.seriesName).replace(/\{b\}/g, p.name).replace(/\{c\}/g, v == null ? String(p.value) : num(v, dp));
    };
  }
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
    var data = list(s.data).map(val), n = data.length, dp = precision(o.series);
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
        kids.push({ type: 'text', x: end[0] + 12, y: end[1], style: { text: tpl(f, data[j], dp), fill: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 700, align: 'left', verticalAlign: 'middle' } });
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
    var w = Math.max.apply(null, data.map(function (v) { return measure(tpl(f, v, dp)); }));
    o.grid = o.grid || {};
    o.grid.right = Math.max(o.grid.right || 0, w + 24);
    if (named) out.top = Math.max(out.top, 24);
    // the value column narrows the plot: on a narrow chart the axis takes as many ticks as fit
    if (vAxis.interval == null && vAxis.splitNumber == null) {
      var cats = list(cAxis.data).map(function (d) { return measure(val(d)); });
      var plot = inst.getWidth() - (o.grid.left || 4) - o.grid.right - Math.max.apply(null, cats.concat([0])) - GAP;
      var top = typeof vAxis.max === 'number' ? vAxis.max : Math.max.apply(null, data.concat(targets));
      vAxis.splitNumber = Math.max(2, Math.min(5, Math.floor(plot / (measure(tpl(axisTpl(vAxis), top)) + 2 * GAP))));
    }
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
    // a bar's or point's value label moves past the high end of its interval; on a horizontal
    // chart the grid keeps room for it at the right
    if (s.label && s.label.show && !s.labelLayout) {
      s.labelLayout = function (p) {
        if (p.dataIndex == null || high[p.dataIndex] == null) return {};
        var q = inst.convertToPixel({ seriesIndex: i }, yCat ? [high[p.dataIndex], base(p.dataIndex)] : [base(p.dataIndex), high[p.dataIndex]]);
        var lay = inst.getModel().getSeriesByIndex(i).getData().getItemLayout(p.dataIndex);
        if (lay) { var mid = Array.isArray(lay) ? lay : [lay.x + lay.width / 2, lay.y + lay.height / 2]; if (yCat) q[1] = mid[1]; else q[0] = mid[0]; }
        return yCat ? { x: q[0] + GAP, y: q[1], align: 'left', verticalAlign: 'middle' } : { x: q[0], y: q[1] - GAP, align: 'center', verticalAlign: 'bottom' };
      };
      if (yCat) {
        var lf = typeof s.label.formatter === 'string' ? s.label.formatter : '{c}';
        var ldp = precision(o.series);
        var lw = Math.max.apply(null, data.map(function (d) { var v = val(d); return measure(tpl(lf, Array.isArray(v) ? v[0] : v, ldp)); }).concat([0]));
        o.grid = o.grid || {};
        o.grid.right = Math.max(o.grid.right || 0, lw + GAP + 4);
      }
    }
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
    var lw = 0, rw = 0, dp = precision(series);
    series.forEach(function (s) {
      var d = list(s.data).map(val);
      var L = s.name + '  ' + tpl(f, d[0], dp), R = tpl(f, d[1], dp) + '  ' + s.name;
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
    // on a narrow chart the two period labels would meet between the points: each then ends at its
    // own point, reaching outward, so both stay
    var ends = list(xa.data).map(function (d) { return measure(val(d)); });
    if (ends.length === 2 && inst.getWidth() - o.grid.left - o.grid.right < (ends[0] + ends[1]) / 2 + 2 * GAP)
      xa.axisLabel = merge(xa.axisLabel, { interval: 0, alignMinLabel: 'right', alignMaxLabel: 'left' });
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
    var dp = precision(o.series);
    o.animation = animate && motion && !printing;
    var cm = inst ? expand(o, t, inst) : { series: [], icons: {}, top: 0, legendOff: false };
    o.tooltip = merge({
      trigger: axisChart ? 'axis' : 'item', confine: true, backgroundColor: t.surface, borderColor: t.ink, borderWidth: 1.5, padding: [10, 14],
      textStyle: { color: t.ink, fontFamily: t.font, fontSize: 13 }, extraCssText: 'border-radius:12px;box-shadow:' + t.l3 + ';',
      axisPointer: { type: 'line', lineStyle: { color: t.ink, width: 1, type: [3, 3] }, shadowStyle: { color: t['accent-wash'] } }
    }, o.tooltip || {});
    // legend: shown automatically for 2+ series on axis charts, none for one. A line chart whose every
    // line carries an end label naming it ("{a}" or the series name) has none, and neither has a
    // slope: the labels name the lines where they are. The spec has the JSON set no legend.
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
    // a horizontal scale bar shortens to fit the chart's width with its end labels beside it (the
    // bar's own padding is 5px a side, and each label sits its text gap from the bar)
    if (inst) list(o.visualMap).forEach(function (v) {
      if (!v || v.show === false || v.orient !== 'horizontal') return;
      var ends = list(v.text).reduce(function (a, s) { return a + measure(s) + (v.textGap == null ? 10 : v.textGap); }, 0);
      var room = Math.floor(inst.getWidth() - (typeof v.left === 'number' ? v.left : 0) - ends - 2 * 5 - 4);
      if (room < (v.itemHeight == null ? 120 : v.itemHeight)) v.itemHeight = Math.max(40, room);
    });
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
      // a value label at a horizontal bar's right end: the grid keeps room at the right for the
      // widest one, so a bar that reaches the axis maximum keeps its label inside the chart
      if (s.type === 'bar' && yCat && !s.stack && !s.labelLayout && axisChart && !Array.isArray(o.grid)) {
        var names = list((list(o.yAxis).filter(function (a) { return a && a.type === 'category'; })[0] || {}).data);
        var room = 0;
        list(s.data).forEach(function (d, j) {
          var l = merge(s.label || {}, (d && d.label) || {}), f = l.formatter, v = val(d);
          if (!l.show || l.position !== 'right' || typeof v !== 'number') return;
          var text = typeof f === 'string' ? f.replace(/\{a\}/g, s.name || '').replace(/\{b\}/g, String(val(names[j]) == null ? '' : val(names[j]))).replace(/\{c\}/g, num(v, dp)) : num(v, dp);
          room = Math.max(room, measure(text) + 8 + (l.distance == null ? 5 : l.distance) + 4);
        });
        if (room) o.grid.right = Math.max(o.grid.right == null ? 24 : o.grid.right, room);
      }
      if (s.type === 'pie') {
        if (s.label && s.label.show) s.label = merge({ overflow: 'none', alignTo: 'none', edgeDistance: 8 }, s.label);
        s.labelLine = merge({ length: 10, length2: 12, lineStyle: { color: t.ink, width: 1 } }, s.labelLine || {});
        if (s.avoidLabelOverlap == null) s.avoidLabelOverlap = true;
      }
      // value labels, on the series and on single points, sit on the surface colour; a series with a
      // reference line draws above it (markLine z is 5), so the line passes behind marks and numbers
      var label = { color: t.ink, opacity: 1, fontFamily: t.font, fontSize: 12, fontWeight: 700, backgroundColor: s.type === 'pie' ? 'transparent' : t.surface, padding: [3, 4], borderRadius: 2 };
      // value labels on bars and lines write {c} with separators at the chart's precision
      var numbered = s.type === 'bar' || s.type === 'line';
      // (a point's own label without a formatter takes the series' one)
      var write = function (l, inherits) {
        var f = l && l.formatter;
        if (!numbered || !l || (f == null && inherits) || (f != null && (typeof f !== 'string' || f.indexOf('{c}') < 0))) return l;
        return merge(l, { formatter: valueLabel(f == null ? '{c}' : f, dp) });
      };
      if (s.label && s.label.show) s.label = write(merge(label, s.label));
      list(s.data).forEach(function (d, j, all) {
        if (d && d.label && d.label.show) all[j] = merge(d, { label: write(merge(label, d.label), s.label && s.label.show) });
        else if (d && d.label && s.label && s.label.show) all[j] = merge(d, { label: write(d.label, true) });
      });
      if (s.endLabel && s.endLabel.show) s.endLabel = write(merge({ color: t.ink, fontFamily: t.font, fontSize: 12, fontWeight: 800, distance: 8 }, s.endLabel));
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
  function redrawAll(animate) { charts.forEach(function (el) { if (el._cmDrawn || printing) draw(el, animate); }); dgAll(); }
  function drawAll() { charts.forEach(function (el) { if (!el._cmDrawn) draw(el, false); }); diagrams.forEach(function (d) { if (d.pending) dgPlace(d); }); }
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

  /* ---------- diagrams ---------- */
  // A diagram is data (SPEC section 8.20): nodes placed on a grid of columns and rows, edges between
  // them, and optional lanes and boundaries. The script draws each node with the kit's classes and
  // measures it, sizes every column and row to its content, routes each edge at right angles
  // through the gaps between them, and sets each edge label beside its line. The geometry never
  // depends on the container: a diagram wider than its figure scrolls sideways in its own box. Print
  // narrows the gaps and the nodes, then scales the diagram to fit the printed column and a page,
  // never below 80%.
  var SVGNS = 'http://www.w3.org/2000/svg', diagrams = [];
  // stand: gap between a node and the end of its edge; head: arrowhead length; r: elbow radius;
  // clear: air around a label; track: spacing of parallel edges in one gap; outer: an outside gap
  // that carries an edge; reach: distance from a node to the first line in a gap. printW: the printed
  // column; printH: an A4 page body (1001px) less a figure's title, description and caption.
  var DG = { stand: 8, head: 8, r: 12, clear: 8, track: 16, outer: 40, reach: 20, printW: 638, printH: 720, minScale: 0.8 };
  var DG_GAP = { screen: { col: 64, row: 48, lane: 72, pad: 8 }, print: { col: 40, row: 32, lane: 64, pad: 8 } };
  var DG_TYPES = ['terminal', 'step', 'decision', 'store', 'external'], DG_KINDS = ['flow', 'data', 'optional'];
  var DG_DIR = { top: [0, -1], right: [1, 0], bottom: [0, 1], left: [-1, 0] }, DG_SIDES = ['right', 'bottom', 'left', 'top'];
  var DG_NAMES = { terminal: 'Start or end', step: 'Step', decision: 'Decision', store: 'Data store', external: 'External',
    flow: 'Flow', data: 'Data', optional: 'Optional path', experience: 'Experience' };
  // The drawing modes, by the value of data-diagram. Each mode turns its JSON into a model and writes
  // its key and text version; a mode without its own build or layout is drawn on the flow grid.
  var DG_MODES = {};

  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function int(v, d) { var n = Math.round(+v); return n >= 1 ? n : d; }
  function even(v) { return Math.ceil(v / 2) * 2; }

  function dgModel(spec) {
    var byId = {}, nodes = [], edges = [], lanes = [], bounds = [], phases = [], C = 1, R = 1;
    var scale = Array.isArray(spec.experience) ? spec.experience.map(String) : [];
    list(spec.nodes).forEach(function (n) {
      if (!n || n.id == null || byId[n.id]) return;
      var t = DG_TYPES.indexOf(n.type) > -1 ? n.type : 'step';
      var m = { id: String(n.id), type: t, label: n.label == null ? '' : String(n.label), detail: t !== 'decision' && n.detail ? String(n.detail) : '',
        col: int(n.col, 1), row: int(n.row, 1), emphasis: t === 'step' && n.emphasis ? String(n.emphasis) : '',
        level: int(n.level, 0) <= scale.length ? int(n.level, 0) : 0 };
      byId[m.id] = m; nodes.push(m); C = Math.max(C, m.col); R = Math.max(R, m.row);
    });
    list(spec.edges).forEach(function (e) {
      if (e && byId[e.from] && byId[e.to] && e.from !== e.to) {
        edges.push({ from: byId[e.from], to: byId[e.to], kind: DG_KINDS.indexOf(e.kind) > -1 ? e.kind : 'flow', label: e.label ? String(e.label) : '' });
      }
    });
    list(spec.groups).forEach(function (g) {
      if (!g) return;
      var row = int(g.row, 1), last = row + int(g.rows, 1) - 1;
      if (g.type === 'lane') { lanes.push({ label: String(g.label || ''), row: row, last: last }); R = Math.max(R, last); }
      if (g.type === 'boundary') {
        var col = int(g.col, 1), lastCol = col + int(g.cols, 1) - 1;
        bounds.push({ label: String(g.label || ''), col: col, lastCol: lastCol, row: row, last: last });
        C = Math.max(C, lastCol); R = Math.max(R, last);
      }
      if (g.type === 'phase') {
        var pc = int(g.col, 1), pl = pc + int(g.cols, 1) - 1;
        phases.push({ label: String(g.label || ''), col: pc, lastCol: pl }); C = Math.max(C, pl);
      }
    });
    lanes.sort(function (a, b) { return a.row - b.row; });
    phases.sort(function (a, b) { return a.col - b.col; });
    return { nodes: nodes, edges: edges, lanes: lanes, bounds: bounds, phases: phases, scale: scale,
      journey: scale.length > 1 && nodes.some(function (n) { return n.level; }), dir: spec.direction === 'down' ? 'down' : 'right', C: C, R: R };
  }

  // The key names the shapes and lines a reader cannot decode on sight: it appears when a diagram
  // uses a data store, an external entity, a data or optional edge, or an experience line.
  function dgKey(m) {
    var types = DG_TYPES.filter(function (t) { return m.nodes.some(function (n) { return n.type === t; }); });
    var kinds = DG_KINDS.filter(function (k) { return m.edges.some(function (e) { return e.kind === k; }); });
    if (m.journey) kinds.push('experience');
    if (!types.some(function (t) { return t === 'store' || t === 'external'; }) && !kinds.some(function (k) { return k !== 'flow'; })) return null;
    var key = mk('div', 'cm-diagram__key');
    // in a system and data flow the solid line passes control, so the key names it so
    var sys = types.some(function (t) { return t === 'store' || t === 'external'; }) || m.bounds.length || kinds.indexOf('data') > -1;
    types.concat(kinds).forEach(function (t) {
      var item = mk('span', 'cm-diagram__key-item' + (t === 'experience' ? ' cm-diagram__key-item--scale' : ''));
      item.appendChild(mk('i', 'cm-diagram__swatch cm-diagram__swatch--' + t));
      item.appendChild(document.createTextNode(t === 'flow' && sys ? 'Control' : DG_NAMES[t] + (t === 'experience' ? ', low to high: ' + m.scale.join(', ') : '')));
      key.appendChild(item);
    });
    return key;
  }

  function dgBuild(d) {
    var el = d.el, m = d.model;
    el.textContent = '';
    var key = d.mode.key(m);
    if (key) el.appendChild(key);
    var cv = d.canvas = mk('div', 'cm-diagram__canvas');
    var svg = d.svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'cm-diagram__lines');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    cv.appendChild(svg);
    m.bounds.forEach(function (b) {
      b.el = mk('div', 'cm-diagram__boundary');
      b.lab = mk('span', 'cm-diagram__boundary-label', b.label);
      cv.appendChild(b.el); cv.appendChild(b.lab);
    });
    m.lanes.forEach(function (l) { l.el = mk('span', 'cm-diagram__lane', l.label); cv.appendChild(l.el); });
    (m.phases || []).forEach(function (p) { p.el = mk('div', 'cm-diagram__phase', p.label); cv.appendChild(p.el); });
    m.nodes.forEach(function (n) {
      var e = n.el = mk('div', 'cm-diagram__node cm-diagram__node--' + n.type + (n.emphasis ? ' cm-emph' : ''));
      e.setAttribute('data-node', n.id);
      (d.mode.node || dgNode)(n, e);
      cv.appendChild(e);
    });
    m.edges.forEach(function (e) { if (e.label) { e.el = mk('span', 'cm-diagram__edge-label', e.label); cv.appendChild(e.el); } });
    if (m.journey) dgJourneyBuild(d, cv);
    el.appendChild(cv);
  }

  // A node's text: its name, the detail line, and the chip that names why it is emphasised.
  function dgNode(n, e) {
    n.nameEl = mk('span', 'cm-diagram__name', n.label);
    e.appendChild(n.nameEl);
    if (n.detail) e.appendChild(mk('span', 'cm-diagram__detail', n.detail));
    if (n.emphasis) e.appendChild(mk('span', 'cm-chip', n.emphasis));
  }

  // Sizes as drawn. Steps, stores, external entities and states in one column share its widest width
  // and in one row its tallest height, so the grid reads as a grid; entities share the width only. A decision is the smallest square
  // whose diamond holds its question: text w wide and h tall fits when w + h fits the diagonal.
  function dgPx(el, prop) { return parseFloat(getComputedStyle(el)[prop]) || 0; }
  function dgMeasure(d) {
    var m = d.model, colW = {}, rowH = {};
    var boxy = function (n) { return n.type === 'step' || n.type === 'store' || n.type === 'external' || n.type === 'state'; };
    m.nodes.forEach(function (n) {
      var e = n.el;
      e.style.left = '0px'; e.style.top = '0px'; e.style.width = ''; e.style.height = ''; e.style.maxWidth = '';
      if (n.type === 'decision') {
        var nm = n.nameEl, best = null;
        nm.style.width = '';
        var full = Math.ceil(nm.getBoundingClientRect().width) + 1;
        for (var w = full; w === full || w >= Math.max(40, full / 3); w -= 6) {
          nm.style.width = w + 'px';
          var side = Math.max(w, nm.scrollWidth) + nm.offsetHeight + 20;
          if (!best || side < best.side) best = { side: side, w: w };
        }
        nm.style.width = Math.max(best.w, (nm.style.width = best.w + 'px', nm.scrollWidth)) + 'px';
        n.w = n.h = even(Math.max(80, best.side));
      } else {
        n.w = even(e.offsetWidth); n.h = even(e.offsetHeight);
        // an emphasis chip never wraps: a node narrower than its chip widens to hold it
        var chip = e.querySelector('.cm-chip');
        if (chip) n.w = Math.max(n.w, even(chip.offsetWidth + e.offsetWidth - e.clientWidth + dgPx(e, 'paddingLeft') + dgPx(e, 'paddingRight')));
      }
      if (boxy(n) || n.type === 'entity') colW[n.col] = Math.max(colW[n.col] || 0, n.w);
      if (boxy(n)) rowH[n.row] = Math.max(rowH[n.row] || 0, n.h);
    });
    // an entity keeps its own height, the length of its attribute list
    m.nodes.forEach(function (n) { if (boxy(n) || n.type === 'entity') n.w = colW[n.col]; if (boxy(n)) n.h = rowH[n.row]; });
    m.edges.forEach(function (e) { if (e.el) { e.lw = Math.ceil(e.el.offsetWidth); e.lh = Math.ceil(e.el.offsetHeight); } });
    m.lanes.forEach(function (l) {
      var s = l.el.style, r = document.createRange();
      s.left = '0px'; s.top = '0px'; s.width = '';
      r.selectNodeContents(l.el);
      l.w = Math.ceil(Math.max.apply(null, [0].concat([].map.call(r.getClientRects(), function (x) { return x.width; }))));
      s.width = l.w + 'px'; l.h = Math.ceil(l.el.offsetHeight);
    });
    m.bounds.forEach(function (b) { b.lw = Math.ceil(b.lab.offsetWidth); b.lh = Math.ceil(b.lab.offsetHeight); });
    if (m.phases) dgJourneyMeasure(d, colW);
  }

  // The grid: column and row tracks sized to their nodes, gaps between them (gap 0 is outside the
  // first track, gap C outside the last), and the lines edges run along in each gap.
  function dgGrid(d, P, need, first) {
    var m = d.model, C = m.C, R = m.R, colW = [], rowH = [], gx = [], gy = [], i;
    for (i = 1; i <= C; i++) colW[i] = 0;
    for (i = 1; i <= R; i++) rowH[i] = 0;
    m.nodes.forEach(function (n) { colW[n.col] = Math.max(colW[n.col], n.w); rowH[n.row] = Math.max(rowH[n.row], n.h); });
    var laneGap = {};
    m.lanes.forEach(function (l, k) { if (k > 0) laneGap[l.row - 1] = true; });
    var gapX = function (i) {
      var n = even(need.x[i] || 0);
      if (i === 0 || i === C) return need.ox[i] || first ? Math.max(DG.outer, n) : n;
      return Math.max(P.col, n);
    };
    var gapY = function (j) {
      var n = even(need.y[j] || 0);
      if (j === 0 || j === R) return need.oy[j] || first ? Math.max(DG.outer, n) : n;
      return Math.max(laneGap[j] ? P.lane : P.row, n);
    };
    var rail = m.lanes.length ? Math.max.apply(null, m.lanes.map(function (l) { return l.w; })) + (m.layered ? 40 : 24) : 0;
    var inset = m.layered ? DG_LY.inset : 0;
    var x = P.pad + rail, colL = [], y = P.pad + inset + (d.spaceTop || 0), rowT = [], gw = [], gh = [];
    for (i = 0; i <= C; i++) { gx[i] = x; gw[i] = gapX(i); x += gw[i]; if (i < C) { colL[i + 1] = x; x += colW[i + 1]; } }
    for (i = 0; i <= R; i++) { gy[i] = y; gh[i] = gapY(i); y += gh[i]; if (i < R) { rowT[i + 1] = y; y += rowH[i + 1]; } }
    var foot = y, W = x + inset + P.pad, H = y + inset + (d.spaceBottom || 0) + P.pad;
    // the lines in a gap: its middle, or, where a lane divider holds the middle, a line either side
    var chV = gx.map(function (g, i) { return [Math.round(g + gw[i] / 2)]; });
    var chH = gy.map(function (g, j) { var c = Math.round(g + gh[j] / 2); return laneGap[j] && !m.layered ? [c - 14, c + 14] : [c]; });
    m.nodes.forEach(function (n) {
      n.x = Math.round(colL[n.col] + (colW[n.col] - n.w) / 2);
      n.y = Math.round(rowT[n.row] + (rowH[n.row] - n.h) / 2);
    });
    return { C: C, R: R, colL: colL, colW: colW, rowT: rowT, rowH: rowH, gx: gx, gy: gy, gw: gw, gh: gh, chV: chV, chH: chH,
      laneGap: laneGap, rail: rail, W: W, H: H, pad: P.pad, foot: foot };
  }

  // Geometry helpers. A path is a list of [x, y] points; a segment is a pair of them.
  function dgDir(a, b) { return [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])]; }
  function dgLen(a, b) { return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]); }
  function dgRect(n, inf) { return { l: n.x - inf, t: n.y - inf, r: n.x + n.w + inf, b: n.y + n.h + inf }; }
  function dgGrow(b, inf) { return { l: b.l - inf, t: b.t - inf, r: b.r + inf, b: b.b + inf }; }
  function dgHits(a, b, r) {
    var x1 = Math.min(a[0], b[0]), x2 = Math.max(a[0], b[0]), y1 = Math.min(a[1], b[1]), y2 = Math.max(a[1], b[1]);
    return x1 < r.r && x2 > r.l && y1 < r.b && y2 > r.t;
  }
  function dgSegs(p) { var s = []; for (var i = 0; i < p.length - 1; i++) s.push([p[i], p[i + 1]]); return s; }
  function dgCross(s, t) {
    var sh = s[0][1] === s[1][1], th = t[0][1] === t[1][1];
    if (sh === th) return false;
    var h = sh ? s : t, v = sh ? t : s;
    var x = v[0][0], y = h[0][1];
    return x > Math.min(h[0][0], h[1][0]) + 1 && x < Math.max(h[0][0], h[1][0]) - 1
      && y > Math.min(v[0][1], v[1][1]) + 1 && y < Math.max(v[0][1], v[1][1]) - 1;
  }
  function dgOverlap(s, t) {
    var sh = s[0][1] === s[1][1], th = t[0][1] === t[1][1];
    if (sh !== th) return 0;
    var k = sh ? 1 : 0, o = 1 - k;
    if (Math.abs(s[0][k] - t[0][k]) > 1) return 0;
    return Math.max(0, Math.min(Math.max(s[0][o], s[1][o]), Math.max(t[0][o], t[1][o])) - Math.max(Math.min(s[0][o], s[1][o]), Math.min(t[0][o], t[1][o])));
  }
  // drop repeated points and merge straight runs; a run that doubles back on itself is no path
  function dgClean(p) {
    var q = [];
    p.forEach(function (pt) { var l = q[q.length - 1]; if (!l || l[0] !== pt[0] || l[1] !== pt[1]) q.push([pt[0], pt[1]]); });
    for (var i = 1; i < q.length - 1; i++) {
      var a = q[i - 1], b = q[i], c = q[i + 1];
      if (a[0] !== b[0] && a[1] !== b[1]) return null;
      if ((a[0] === b[0] && b[0] === c[0]) || (a[1] === b[1] && b[1] === c[1])) {
        var u = dgDir(a, b), v = dgDir(b, c);
        if (u[0] !== v[0] || u[1] !== v[1]) return null;
        q.splice(i, 1); i--;
      }
    }
    if (q.length < 2) return null;
    var z = q[q.length - 2], y = q[q.length - 1];
    if (z[0] !== y[0] && z[1] !== y[1]) return null;
    return q;
  }

  // The point an edge leaves or enters a node: the middle of a side (a decision's corner), clear of
  // the node by the standoff; and the first line out from that side.
  function dgPort(n, s) {
    var v = DG_DIR[s];
    return [n.x + n.w / 2 + v[0] * (n.w / 2 + DG.stand), n.y + n.h / 2 + v[1] * (n.h / 2 + DG.stand)];
  }
  function dgStub(n, s, g, p) {
    if (s === 'right') return [g.chV[n.col][0], p[1]];
    if (s === 'left') { var l = g.chV[n.col - 1]; return [l[l.length - 1], p[1]]; }
    if (s === 'bottom') return [p[0], g.chH[n.row][0]];
    var t = g.chH[n.row - 1]; return [p[0], t[t.length - 1]];
  }
  // Turn a route plan into points on this grid: out of a side to the first line, along the gap
  // lines (directly, with one turn, or through a further line), into the target's side.
  function dgRealize(e, plan, g) {
    var A = dgPort(e.from, plan.a), B = dgPort(e.to, plan.b);
    var A1 = dgStub(e.from, plan.a, g, A), B1 = dgStub(e.to, plan.b, g, B);
    var aV = plan.a === 'left' || plan.a === 'right', bV = plan.b === 'left' || plan.b === 'right';
    var mid = [], v = plan.via;
    if (v === 'L') { if (aV === bV) return null; var p0 = dgClean([A, aV ? [B[0], A[1]] : [A[0], B[1]], B]); if (!p0) return null; A1 = B1 = null; mid = p0; }
    else if (v === 'a') mid = [aV ? [A1[0], B1[1]] : [B1[0], A1[1]]];
    else if (v === 'b') mid = [bV ? [B1[0], A1[1]] : [A1[0], B1[1]]];
    else if (v && v[0] === 'h') { var y = g.chH[v[1]][v[2]]; mid = [[A1[0], y], [B1[0], y]]; }
    else if (v && v[0] === 'v') { var x = g.chV[v[1]][v[2]]; mid = [[x, A1[1]], [x, B1[1]]]; }
    var p = dgClean(v === 'L' ? mid : [A, A1].concat(mid, [B1, B]));
    if (!p) return null;
    var u = dgDir(p[0], p[1]), w = dgDir(p[p.length - 2], p[p.length - 1]), da = DG_DIR[plan.a], db = DG_DIR[plan.b];
    if (u[0] !== da[0] || u[1] !== da[1] || w[0] !== -db[0] || w[1] !== -db[1]) return null;
    if (dgLen(p[p.length - 2], p[p.length - 1]) < DG.head + 2) return null;
    return p;
  }

  // Score every plan for an edge against the nodes and the edges already routed, and keep the
  // cheapest: anything through a node is out; then crossings, shared lines, turns, length, and
  // sides that run against the reading direction.
  function dgRoute(d, g, e, done) {
    var m = d.model, plans = [];
    var vias = [null, 'L', 'a', 'b'];
    g.chH.forEach(function (ls, j) { ls.forEach(function (y, k) { vias.push(['h', j, k]); }); });
    g.chV.forEach(function (ls, i) { ls.forEach(function (x, k) { vias.push(['v', i, k]); }); });
    // a dependency in a layer stack leaves the bottom of its component and enters the top of the next
    var outs = m.layered ? ['bottom'] : DG_SIDES, ins = m.layered ? ['top'] : DG_SIDES;
    outs.forEach(function (a) { ins.forEach(function (b) { vias.forEach(function (v) { plans.push({ a: a, b: b, via: v }); }); }); });
    var main = m.dir === 'down' ? 'bottom' : 'right', back = m.dir === 'down' ? 'top' : 'left';
    var best = null;
    plans.forEach(function (plan) {
      var p = dgRealize(e, plan, g);
      if (!p) return;
      var cost = dgCost(d, g, e, plan, p, done);
      if (e.el && dgLen(p[0], p[1]) < dgLabelAt(d, { e: e, p: p }).need) cost += 40;
      cost += plan.a === main ? 0 : plan.a === back ? 16 : 6;
      cost += plan.b === back ? 0 : plan.b === main ? 16 : 6;
      if (!best || cost < best.cost) best = { cost: cost, plan: plan, p: p };
    });
    return best;
  }
  function dgCost(d, g, e, plan, p, done) {
    var m = d.model, cost = 0, segs = dgSegs(p);
    segs.forEach(function (s) {
      m.nodes.forEach(function (n) { if (dgHits(s[0], s[1], dgRect(n, DG.clear - 0.5))) cost += 10000; });
      if (g.rail && Math.min(s[0][0], s[1][0]) < g.rail + g.pad) cost += 10000;
      // a boundary's name on its top line is passed by where another way exists
      m.bounds.forEach(function (b) { if (b.lr && dgHits(s[0], s[1], dgGrow(b.lr, DG.clear - 0.5))) cost += 2000; });
      cost += dgLen(s[0], s[1]) * 0.1;
    });
    cost += (p.length - 2) * 24;
    done.forEach(function (o) {
      var share = o.e.from === e.from && o.plan.a === plan.a ? 'out' : o.e.to === e.to && o.plan.b === plan.b ? 'in' : '';
      // a side carries edges out or edges in, never both; a decision's corner carries one branch, an
      // entity's side one relationship, and a flow edge with a label a side of its own
      [[e.from, plan.a, 'out'], [e.to, plan.b, 'in']].forEach(function (u) {
        [[o.e.from, o.plan.a, 'out'], [o.e.to, o.plan.b, 'in']].forEach(function (w) {
          if (u[0] !== w[0] || u[1] !== w[1]) return;
          if (u[2] !== w[2] || u[0].type === 'entity') cost += 1000;
          else if (u[2] === 'out') cost += u[0].type === 'decision' || (d.mode.labels === dgLabelsInline && (e.label || o.e.label)) ? 1000 : 12;
          else cost += 4;
        });
      });
      // a line into one side and another out of the opposite side, across the reading direction,
      // reads as one line through the node, as confusing as a crossing
      var across = m.dir === 'down' ? ['left', 'right'] : ['top', 'bottom'];
      var through = function (x, y) { return x !== y && across.indexOf(x) >= 0 && across.indexOf(y) >= 0; };
      if ((o.e.to === e.from && through(o.plan.b, plan.a)) || (o.e.from === e.to && through(o.plan.a, plan.b))) cost += 60;
      var os = dgSegs(o.p);
      segs.forEach(function (s, i) {
        os.forEach(function (t, k) {
          if (dgCross(s, t)) cost += 60;
          var lap = dgOverlap(s, t);
          if (!lap) return;
          // edges that share a source side may share their first run, and edges into one side their last
          if (share === 'out' && i === 0 && k === 0) return;
          if (share === 'in' && i === segs.length - 1 && k === os.length - 1) return;
          var stub = i === 0 || i === segs.length - 1 || k === 0 || k === os.length - 1;
          cost += stub ? 400 : 40;
        });
      });
    });
    return cost;
  }

  // Edges that run along one gap line side by side move apart onto tracks 16px apart. Runs that
  // leave one side of a node together, or enter one side together, stay merged.
  function dgNudge(routes) {
    var groups = {};
    routes.forEach(function (r, ri) {
      for (var i = 1; i < r.p.length - 2; i++) {
        var a = r.p[i], b = r.p[i + 1], h = a[1] === b[1];
        var key = (h ? 'h' : 'v') + Math.round(h ? a[1] : a[0]);
        (groups[key] = groups[key] || []).push({ r: r, ri: ri, i: i, h: h, lo: Math.min(h ? a[0] : a[1], h ? b[0] : b[1]), hi: Math.max(h ? a[0] : a[1], h ? b[0] : b[1]) });
      }
    });
    var tracks = {};
    Object.keys(groups).forEach(function (key) {
      var segs = groups[key];
      if (segs.length < 2) return;
      var same = function (s, t) {
        var sp = s.r.p, tp = t.r.p, k;
        if (s.r.e.from === t.r.e.from && s.r.plan.a === t.r.plan.a && s.i === t.i) {
          for (k = 0; k <= s.i; k++) if (sp[k][0] !== tp[k][0] || sp[k][1] !== tp[k][1]) return false;
          return true;
        }
        var sn = sp.length, tn = tp.length;
        if (s.r.e.to === t.r.e.to && s.r.plan.b === t.r.plan.b && sn - s.i === tn - t.i) {
          for (k = 1; k <= sn - s.i - 1; k++) if (sp[sn - k][0] !== tp[tn - k][0] || sp[sn - k][1] !== tp[tn - k][1]) return false;
          return true;
        }
        return false;
      };
      // bundles of merged runs, then one track per bundle wherever bundles overlap
      var bundles = [];
      segs.forEach(function (s) {
        var b = bundles.find(function (x) { return x.segs.some(function (t) { return same(s, t); }); });
        if (b) { b.segs.push(s); b.lo = Math.min(b.lo, s.lo); b.hi = Math.max(b.hi, s.hi); } else bundles.push({ segs: [s], lo: s.lo, hi: s.hi });
      });
      bundles.sort(function (a, b) { return a.lo - b.lo || a.hi - b.hi; });
      var ends = [];
      bundles.forEach(function (b) {
        var t = 0;
        while (ends[t] != null && ends[t] > b.lo - DG.track) t++;
        ends[t] = b.hi; b.t = t;
      });
      var k = ends.length;
      if (k < 2) return;
      tracks[key] = k;
      bundles.forEach(function (b) {
        var off = (b.t - (k - 1) / 2) * DG.track;
        b.segs.forEach(function (s) {
          var c = s.h ? 1 : 0;
          s.r.p[s.i][c] += off; s.r.p[s.i + 1][c] += off;
        });
      });
    });
    return tracks;
  }

  // An edge label stands on its line near the start of its edge, on the axis of the line's first run:
  // the line leaves its node and runs DG_LEAD, breaks 8px before the label and goes on 8px past it.
  // A label on a run across and a label on a run down keep the same place, so the branches of a
  // decision read alike, and the line on both sides marks it as the line's, not the node's. When
  // the run crosses a boundary side within that reach, the lead crosses it by 8px and the label
  // stands outside. A labelled edge leaves its node by a side of its own (dgCost), so the run it
  // opens is its own.
  var DG_LEAD = 16;
  function dgLabelAt(d, r) {
    var a = r.p[0], b = r.p[1], hz = a[1] === b[1], k = hz ? 0 : 1, u = dgDir(a, b), ext = hz ? r.e.lw : r.e.lh, off = DG_LEAD + DG.clear;
    (d.frames || []).forEach(function (f) {
      if ((f[0][k] === f[1][k]) === false) return;   // a side across the run, not along it
      var c = f[0][k], lo = Math.min(f[0][1 - k], f[1][1 - k]), hi = Math.max(f[0][1 - k], f[1][1 - k]);
      var dist = (c - a[k]) * u[k];
      if (a[1 - k] > lo && a[1 - k] < hi && dist > 0 && dist < ext + 2 * DG.clear + off) off = Math.max(off, dist + 8 + DG.clear);
    });
    return { off: off, ext: ext, need: off + ext + DG.clear + (r.p.length === 2 ? DG.head + 16 : DG.r + 8) };
  }
  // Places every label and returns the gaps that need more room for a label to fit.
  function dgLabelsInline(d, g, routes) {
    var m = d.model, placed = [], lines = [], short = [];
    routes.forEach(function (r) { dgSegs(r.p).forEach(function (s, i) { lines.push({ r: r, i: i, s: s }); }); });
    (d.dividers || []).forEach(function (s) { lines.push({ s: s }); });
    (d.frames || []).forEach(function (s) { lines.push({ s: s, frame: true }); });
    var boxes = m.nodes.map(function (n) { return dgRect(n, 0); });
    m.bounds.forEach(function (b) { if (b.lr) boxes.push(b.lr); });
    if (g.rail) boxes.push({ l: 0, t: 0, r: g.rail + g.pad - 4, b: g.H });
    var free = function (b, own, u) {
      var c = DG.clear - 0.5, x = { l: b.l - c, t: b.t - c, r: b.r + c, b: b.b + c };
      // a boundary side the line goes on to cross stands 16px further off, so the line shows before it
      var y = { l: x.l + Math.min(0, u[0]) * 16, t: x.t + Math.min(0, u[1]) * 16, r: x.r + Math.max(0, u[0]) * 16, b: x.b + Math.max(0, u[1]) * 16 };
      if (b.l < 2 || b.t < 2 || b.r > g.W - 2 || b.b > g.H - 2) return false;
      if (boxes.some(function (o) { return o.l < x.r && o.r > x.l && o.t < x.b && o.b > x.t; })) return false;
      if (placed.some(function (o) { return o.l < x.r && o.r > x.l && o.t < x.b && o.b > x.t; })) return false;
      return !lines.some(function (l) { return !(l.r === own && l.i === 0) && dgHits(l.s[0], l.s[1], l.frame ? y : x); });
    };
    routes.forEach(function (r) {
      var e = r.e;
      r.inline = 0;
      if (!e.el) return;
      var w = e.lw, h = e.lh, a = r.p[0], b = r.p[1], u = dgDir(a, b), hz = a[1] === b[1];
      var at = dgLabelAt(d, r), L = dgLen(a, b), s0 = [a[0] + u[0] * at.off, a[1] + u[1] * at.off];
      var box = hz ? { l: u[0] > 0 ? s0[0] : s0[0] - w, t: Math.round(s0[1] - h / 2) } : { l: Math.round(s0[0] - w / 2), t: u[1] > 0 ? s0[1] : s0[1] - h };
      box.r = box.l + w; box.b = box.t + h;
      r.label = box; r.inline = Math.max(0, Math.min(at.off + at.ext + DG.clear, L - 2)); r.lead = Math.min(at.off - DG.clear, L - 2);
      if (L >= at.need && free(box, r, u)) { placed.push(box); return; }
      // no room: lengthen the first run by widening the gap it crosses (twice the shortfall when the
      // run ends on a line in the middle of that gap), or widen it by two tracks when a line or a
      // side stands too close
      var gapAt = function (starts, sizes, lo, hi) {
        var best = -1, lap = 0;
        starts.forEach(function (st, k) { var o = Math.min(hi, st + sizes[k]) - Math.max(lo, st); if (o > lap) { lap = o; best = k; } });
        return best;
      };
      var lo = Math.min(a[hz ? 0 : 1], b[hz ? 0 : 1]), hi = Math.max(a[hz ? 0 : 1], b[hz ? 0 : 1]);
      var idx = gapAt(hz ? g.gx : g.gy, hz ? g.gw : g.gh, lo, hi), sizes = hz ? g.gw : g.gh;
      if (idx > -1) short.push({ axis: hz ? 'x' : 'y', i: idx, size: sizes[idx] + (L >= at.need ? 2 * DG.track : (r.p.length === 2 ? 1 : 2) * (at.need - L)) + 4 });
    });
    return short;
  }

  // Edge labels stand beside the line they name, 8px clear of every line, node and label: above a
  // run across, to the left of a run down, nearest the source first. Returns the labels that found
  // no place, with the gap that would make room. The default for a mode on the flow grid, and the
  // placement of a state's events; a flow's labels stand in line (dgLabelsInline).
  function dgLabels(d, g, routes) {
    var m = d.model, placed = [], lines = [], short = [];
    routes.forEach(function (r) { dgSegs(r.p).forEach(function (s) { lines.push(s); }); });
    (d.dividers || []).forEach(function (s) { lines.push(s); });
    var boxes = m.nodes.map(function (n) { return dgRect(n, 0); });
    m.bounds.forEach(function (b) { if (b.lr) boxes.push(b.lr); });
    if (g.rail) boxes.push({ l: 0, t: 0, r: g.rail + g.pad - 4, b: g.H });
    var free = function (b) {
      var c = DG.clear - 0.5, x = { l: b.l - c, t: b.t - c, r: b.r + c, b: b.b + c };
      if (b.l < 2 || b.t < 2 || b.r > g.W - 2 || b.b > g.H - 2) return false;
      if (boxes.some(function (o) { return o.l < x.r && o.r > x.l && o.t < x.b && o.b > x.t; })) return false;
      if (placed.some(function (o) { return o.l < x.r && o.r > x.l && o.t < x.b && o.b > x.t; })) return false;
      return !lines.some(function (s) { return dgHits(s[0], s[1], x); });
    };
    routes.forEach(function (r) {
      var e = r.e;
      if (!e.el) return;
      var w = e.lw, h = e.lh, segs = dgSegs(r.p), spot = null, own = null;
      // a loop's label stands outside its far run, centred on it
      if (r.loop) {
        var f = segs[1], fx = (f[0][0] + f[1][0]) / 2, fy = (f[0][1] + f[1][1]) / 2;
        var lt = r.loop === 'top' ? { l: fx - w / 2, t: fy - DG.clear - h } : r.loop === 'bottom' ? { l: fx - w / 2, t: fy + DG.clear }
          : r.loop === 'right' ? { l: fx + DG.clear, t: fy - h / 2 } : { l: fx - DG.clear - w, t: fy - h / 2 };
        own = { l: Math.round(lt.l), t: Math.round(lt.t), r: Math.round(lt.l) + w, b: Math.round(lt.t) + h };
        if (free(own)) spot = own;
      }
      if (!spot) segs.some(function (s, i) {
        var a = s[0], b = s[1], u = dgDir(a, b), hz = a[1] === b[1];
        var ext = hz ? w : h, L = dgLen(a, b);
        var lo = (i > 0 ? DG.r : 0) + 2, hi = L - (i === segs.length - 1 ? DG.head + 4 : i < segs.length - 1 ? DG.r + 2 : 2);
        if (hi - lo < ext) return false;
        var cands = [];
        [lo, Math.max(lo, Math.round((L - ext) / 2))].forEach(function (o) {
          if (o + ext > hi) return;
          var along = hz ? a[0] + u[0] * o - (u[0] < 0 ? ext : 0) : a[1] + u[1] * o - (u[1] < 0 ? ext : 0);
          if (hz) {
            cands.push({ l: along, t: a[1] - DG.clear - h }, { l: along, t: a[1] + DG.clear });
          } else {
            cands.push({ l: a[0] - DG.clear - w, t: along }, { l: a[0] + DG.clear, t: along });
          }
        });
        return cands.some(function (c) {
          var box = { l: c.l, t: c.t, r: c.l + w, b: c.t + h };
          if (free(box)) { spot = box; return true; }
          return false;
        });
      });
      if (spot) { placed.push(spot); r.label = spot; }
      else if (own) { placed.push(own); r.label = own; }
      else {
        // no room: lengthen the first run (or the longest, when the first is a short stub) by
        // widening the gap it crosses, and give the gap it runs along room for the label beside it
        var s = dgLen(segs[0][0], segs[0][1]) >= 2 * DG.r + 8 ? segs[0]
          : segs.reduce(function (x, y) { return dgLen(y[0], y[1]) > dgLen(x[0], x[1]) ? y : x; }, segs[0]);
        var hz = s[0][1] === s[1][1], lo = Math.min(s[0][hz ? 0 : 1], s[1][hz ? 0 : 1]), hi = Math.max(s[0][hz ? 0 : 1], s[1][hz ? 0 : 1]);
        var gapAt = function (starts, sizes, a, b) {
          var best = -1, lap = 0;
          starts.forEach(function (st, k) { var o = Math.min(b, st + sizes[k]) - Math.max(a, st); if (o > lap) { lap = o; best = k; } });
          return best;
        };
        var idx = gapAt(hz ? g.gx : g.gy, hz ? g.gw : g.gh, lo, hi);
        var want = (hz ? w : h) + 2 * DG.r + DG.head + 12;
        if (idx > -1) short.push({ axis: hz ? 'x' : 'y', i: idx, size: (hz ? g.gw : g.gh)[idx] + want - (hi - lo) });
        // a line that crosses or joins the run in that gap leaves half of it on either side: each half
        // needs the room
        var mine = dgSegs(r.p), inner = { l: Math.min(s[0][0], s[1][0]) + 1, t: Math.min(s[0][1], s[1][1]) - 0.5,
          r: Math.max(s[0][0], s[1][0]) - 1, b: Math.max(s[0][1], s[1][1]) + 0.5 };
        if (!hz) inner = { l: s[0][0] - 0.5, t: inner.t + 0.5 + 1, r: s[0][0] + 0.5, b: inner.b - 0.5 - 1 };
        var cut = lines.some(function (t) {
          return !mine.some(function (u) { return u[0] === t[0] && u[1] === t[1]; }) && !dgOverlap(s, t) && dgHits(t[0], t[1], inner);
        });
        if (idx > -1 && cut) short.push({ axis: hz ? 'x' : 'y', i: idx, size: 2 * ((hz ? w : h) + DG.clear + DG.stand + 4) });
        var c = hz ? s[0][1] : s[0][0], across = gapAt(hz ? g.gy : g.gx, hz ? g.gh : g.gw, c - 0.5, c + 0.5);
        if (across > -1) short.push({ axis: hz ? 'y' : 'x', i: across, size: 2 * ((hz ? h : w) + 2 * DG.clear) + 4 });
        var a = segs[0][0];
        r.label = { l: a[0], t: a[1], r: a[0] + w, b: a[1] + h };
      }
    });
    return short;
  }

  // A path through right-angle turns, each rounded to radius rad or less.
  function dgRound(p, rad) {
    var dd = 'M' + p[0][0] + ' ' + p[0][1], n = p.length;
    for (var i = 1; i < n - 1; i++) {
      var a = p[i - 1], b = p[i], c = p[i + 1], v = dgDir(a, b), w = dgDir(b, c);
      var r = Math.min(rad, dgLen(a, b) / 2, dgLen(b, c) / 2);
      var sweep = v[0] * w[1] - v[1] * w[0] > 0 ? 1 : 0;
      dd += 'L' + (b[0] - v[0] * r) + ' ' + (b[1] - v[1] * r) + 'A' + r + ' ' + r + ' 0 0 ' + sweep + ' ' + (b[0] + w[0] * r) + ' ' + (b[1] + w[1] * r);
    }
    return dd + 'L' + p[n - 1][0] + ' ' + p[n - 1][1];
  }
  // The path of an edge with rounded elbows, ending where its arrowhead begins (or at its end, with
  // no arrowhead).
  function dgPathD(p, bare) {
    var q = p.map(function (x) { return x.slice(); }), n = q.length, k = bare ? 0 : DG.head;
    var u = dgDir(q[n - 2], q[n - 1]);
    q[n - 1] = [q[n - 1][0] - u[0] * k, q[n - 1][1] - u[1] * k];
    return dgRound(q, DG.r);
  }
  function dgHead(p) {
    var n = p.length, t = p[n - 1], u = dgDir(p[n - 2], t), bx = t[0] - u[0] * DG.head, by = t[1] - u[1] * DG.head, hw = 3.5;
    return t[0] + ',' + t[1] + ' ' + (bx - u[1] * hw) + ',' + (by + u[0] * hw) + ' ' + (bx + u[1] * hw) + ',' + (by - u[0] * hw);
  }
  function svgEl(tag, attrs) { var e = document.createElementNS(SVGNS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  function dgLayout(d) {
    var el = d.el, m = d.model, P = (d.mode.gaps || DG_GAP)[d.narrow ? 'print' : 'screen'], cv = d.canvas;
    if (!printing && !el.clientWidth) { d.pending = true; return; }
    d.pending = false;
    el.classList.toggle('cm-diagram--narrow', !!d.narrow);
    cv.style.transform = ''; cv.style.marginRight = ''; cv.style.marginBottom = ''; cv.style.width = '4000px'; cv.style.height = '1px';
    dgMeasure(d);
    // Pass 1 routes on a grid with room outside every track; later passes keep the routes, size each
    // gap to what runs through it (tracks, labels, outside loops) and route again on the new grid.
    // a self-transition is no route: its mode draws it as a loop on one side of its node
    var need = { x: {}, y: {}, ox: {}, oy: {} }, g, routes = [], drawn = routes;
    var order = m.edges.filter(function (e) { return e.from !== e.to; });
    var along = m.dir === 'down' ? 'row' : 'col', cross = m.dir === 'down' ? 'col' : 'row';
    order.sort(function (a, b) {
      var fa = a.to[along] > a.from[along] || (a.to[along] === a.from[along] && a.to[cross] > a.from[cross]);
      var fb = b.to[along] > b.from[along] || (b.to[along] === b.from[along] && b.to[cross] > b.from[cross]);
      return (fa ? 0 : 1) - (fb ? 0 : 1);
    });
    for (var pass = 0; pass < 4; pass++) {
      g = dgGrid(d, P, need, pass === 0);
      d.dividers = m.layered ? [] : m.lanes.slice(1).map(function (l) { var y = g.gy[l.row - 1] + g.gh[l.row - 1] / 2; return [[g.pad, y], [g.W - g.pad, y]]; });
      dgBounds(d, g);
      if (pass === 0) {
        order.forEach(function (e) { var b = dgRoute(d, g, e, routes); if (b) routes.push({ e: e, plan: b.plan, p: b.p }); });
        // a second sweep routes each edge again against all the others, so early edges see later ones
        routes.forEach(function (r) {
          var b = dgRoute(d, g, r.e, routes.filter(function (o) { return o !== r; }));
          if (b) { r.plan = b.plan; r.p = b.p; }
        });
      } else {
        var kept = [];
        routes.forEach(function (r) {
          var p = dgRealize(r.e, r.plan, g);
          if (p) { r.p = p; kept.push(r); } else { var b = dgRoute(d, g, r.e, kept); if (b) { r.plan = b.plan; r.p = b.p; kept.push(r); } }
        });
        routes = kept;
      }
      var tracks = dgNudge(routes);
      drawn = d.mode.loops ? routes.concat(d.mode.loops(d, g, routes)) : routes;
      dgBoundLabels(d, routes);
      var short = (d.mode.labels || dgLabels)(d, g, drawn);
      // what each gap needs next pass
      var next = { x: {}, y: {}, ox: {}, oy: {} };
      routes.forEach(function (r) {
        r.p.forEach(function (pt, i) {
          if (i === 0 || i === r.p.length - 1) return;
          if (pt[0] < g.gx[0] + g.gw[0]) next.ox[0] = 1;
          if (pt[0] > g.gx[g.C]) next.ox[g.C] = 1;
          if (pt[1] < g.gy[0] + g.gh[0]) next.oy[0] = 1;
          if (pt[1] > g.gy[g.R]) next.oy[g.R] = 1;
        });
      });
      Object.keys(tracks).forEach(function (key) {
        var hz = key[0] === 'h', c = +key.slice(1), gs = hz ? g.gy : g.gx, ws = hz ? g.gh : g.gw, idx = -1;
        gs.forEach(function (st, k) { if (c >= st - 1 && c <= st + ws[k] + 1) idx = k; });
        if (idx < 0) return;
        var want = (tracks[key] - 1) * DG.track + 2 * DG.reach + ((hz ? g.laneGap[idx] : false) ? (m.layered ? 2 * DG_LY.inset : 28) : 0);
        var o = hz ? next.y : next.x;
        o[idx] = Math.max(o[idx] || 0, want);
      });
      short.forEach(function (s) { var o = next[s.axis]; o[s.i] = Math.max(o[s.i] || 0, s.size); });
      m.bounds.forEach(function (b) {
        next.x[b.col - 1] = Math.max(next.x[b.col - 1] || 0, b.col === 1 ? 28 : 56);
        next.x[b.lastCol] = Math.max(next.x[b.lastCol] || 0, b.lastCol === m.C ? 28 : 56);
        next.y[b.row - 1] = Math.max(next.y[b.row - 1] || 0, b.row === 1 ? 40 : 64);
        next.y[b.last] = Math.max(next.y[b.last] || 0, b.last === m.R ? 28 : 56);
      });
      if (d.mode.grow) d.mode.grow(d, g, drawn, next);
      var grew = pass === 0;
      ['x', 'y', 'ox', 'oy'].forEach(function (k) {
        Object.keys(next[k]).forEach(function (i) {
          var cur = k === 'x' || k === 'ox' ? g.gw[i] : g.gh[i];
          if (k[0] === 'o' ? !need[k][i] : next[k][i] > cur + 0.5) grew = true;
          need[k][i] = Math.max(need[k][i] || 0, next[k][i]);
        });
      });
      if (!grew && !short.length) break;
      if (pass > 0 && !grew) break;
    }
    dgDraw(d, g, drawn);
  }

  // A boundary's name sits at the left of its top line, or at the right when an edge crosses the
  // top line where the name would be.
  function dgBoundLabels(d, routes) {
    d.model.bounds.forEach(function (b) {
      var hit = function (lr) { return routes.some(function (r) { return dgSegs(r.p).some(function (s) { return dgHits(s[0], s[1], dgGrow(lr, DG.clear - 0.5)); }); }); };
      if (!hit(b.lr)) return;
      var w = b.lr.r - b.lr.l, right = { l: b.r.r - 12 - w, t: b.lr.t, r: b.r.r - 12, b: b.lr.b };
      if (!hit(right)) b.lr = right;
    });
  }
  // A boundary frames its block of cells; its four sides are lines an edge label keeps clear of.
  function dgBounds(d, g) {
    d.frames = [];
    d.model.bounds.forEach(function (b) {
      var l = g.colL[b.col] - 20, r = g.colL[b.lastCol] + g.colW[b.lastCol] + 20;
      var t = g.rowT[b.row] - 28, bt = g.rowT[b.last] + g.rowH[b.last] + 20;
      b.r = { l: l, t: t, r: r, b: bt };
      b.lr = { l: l + 12, t: t - b.lh / 2, r: l + 12 + b.lw, b: t + b.lh / 2 };
      d.frames.push([[l, t], [r, t]], [[r, t], [r, bt]], [[l, bt], [r, bt]], [[l, t], [l, bt]]);
    });
  }

  // The canvas for a drawing gW by gH: scaled in print to fit the printed column and a page, never
  // below 80%, and centred in its box unless it runs the full width from the left. Returns the scale,
  // the offset that centres it and the canvas size, with the line layer emptied; the scale and the
  // drawing's own size stay on the diagram for dgPlace.
  function dgFit(d, gW, gH, centre) {
    var el = d.el, cv = d.canvas, svg = d.svg;
    // print fits the printed column and a page; a screen drawing too wide for its box fits its width
    var boxW = printing ? DG.printW : el.clientWidth;
    var scale = printing || d.squeeze ? Math.max(DG.minScale, Math.min(1, boxW / gW, printing ? DG.printH / gH : 1)) : 1;
    d.fit = { scale: scale, gW: gW, gH: gH };
    var room = Math.floor(boxW / scale);
    var ox = centre ? Math.max(0, Math.floor((room - gW) / 2)) : 0, W = Math.max(gW, room), H = gH;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    cv.style.transform = scale < 1 ? 'scale(' + scale + ')' : '';
    cv.style.marginRight = scale < 1 ? -Math.floor(W * (1 - scale)) + 'px' : '';
    cv.style.marginBottom = scale < 1 ? -Math.floor(H * (1 - scale)) + 'px' : '';
    svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    return { scale: scale, ox: ox, W: W, H: H };
  }

  function dgDraw(d, g, routes) {
    var el = d.el, m = d.model, cv = d.canvas, svg = d.svg;
    // centred in its box on screen and in print; lanes run the full width from the left, and a layer
    // stack, its frames as wide as its grid, is centred
    var fit = dgFit(d, g.W, g.H, !m.lanes.length || m.layered), scale = fit.scale, ox = fit.ox, W = fit.W, H = fit.H;
    var X = function (x) { return Math.round(x + ox); }, Y = function (y) { return Math.round(y); };
    var geo = { scale: scale, ox: ox, W: W, H: H, nodes: [], edges: [], lines: [], lanes: [] };
    m.lanes.forEach(function (l, k) {
      var top = g.rowT[l.row], bot = g.rowT[l.last] + g.rowH[l.last];
      l.el.style.left = X(g.pad - ox) + 'px';
      l.el.style.top = Y((top + bot) / 2 - l.h / 2) + 'px';
      geo.lanes.push({ el: l.el, label: l.label });
      if (k > 0 && !m.layered) {
        var s = d.dividers[k - 1];
        svg.appendChild(svgEl('line', { 'class': 'cm-diagram__divider', x1: 0, y1: Y(s[0][1]) + 0.5, x2: W, y2: Y(s[0][1]) + 0.5 }));
        geo.lines.push({ kind: 'divider', points: [[0, s[0][1]], [W, s[0][1]]] });
      }
    });
    m.bounds.forEach(function (b) {
      var s = b.el.style;
      s.left = X(b.r.l) + 'px'; s.top = Y(b.r.t) + 'px'; s.width = (b.r.r - b.r.l) + 'px'; s.height = (b.r.b - b.r.t) + 'px';
      b.lab.style.left = X(b.lr.l) + 'px'; b.lab.style.top = Y(b.lr.t) + 'px';
      geo.lines.push({ kind: 'boundary', el: b.el, label: b.lab });
    });
    m.nodes.forEach(function (n) {
      var s = n.el.style;
      s.left = X(n.x) + 'px'; s.top = Y(n.y) + 'px'; s.width = n.w + 'px'; s.height = n.h + 'px'; s.maxWidth = 'none';
      geo.nodes.push({ id: n.id, type: n.type, el: n.el });
    });
    routes.forEach(function (r) {
      var p = r.p.map(function (pt) { return [X(pt[0]), Y(pt[1])]; }), n = p.length, lead = null;
      // a flow edge's line breaks for the label in line with it: the lead from the node, the label
      // with 8px of air on each side, then the rest of the line
      if (r.inline) {
        var u0 = dgDir(p[0], p[1]), p0 = p[0];
        if (r.lead > 0) lead = [p0, [p0[0] + u0[0] * r.lead, p0[1] + u0[1] * r.lead]];
        p[0] = [p0[0] + u0[0] * r.inline, p0[1] + u0[1] * r.inline];
      }
      // a line with no arrowhead runs on to meet the box at each end
      if (d.mode.bare) [[0, 1], [n - 1, n - 2]].forEach(function (k) {
        var u = dgDir(p[k[1]], p[k[0]]);
        p[k[0]] = [p[k[0]][0] + u[0] * DG.stand, p[k[0]][1] + u[1] * DG.stand];
      });
      var grp = svgEl('g', { 'class': 'cm-diagram__edge cm-diagram__edge--' + r.e.kind, 'data-from': r.e.from.id, 'data-to': r.e.to.id });
      if (lead) grp.appendChild(svgEl('path', { 'class': 'cm-diagram__line', d: 'M' + lead[0][0] + ' ' + lead[0][1] + 'L' + lead[1][0] + ' ' + lead[1][1] }));
      grp.appendChild(svgEl('path', { 'class': 'cm-diagram__line', d: dgPathD(p, d.mode.bare) }));
      if (!d.mode.bare) grp.appendChild(svgEl('polygon', { 'class': 'cm-diagram__head', points: dgHead(p) }));
      svg.appendChild(grp);
      if (r.e.el) { r.e.el.style.left = X(r.label.l) + 'px'; r.e.el.style.top = Y(r.label.t) + 'px'; }
      geo.edges.push({ from: r.e.from.id, to: r.e.to.id, kind: r.e.kind, label: r.e.label, labelEl: r.e.el || null, points: p, lead: lead });
      if (lead) geo.lines.push({ kind: 'line', points: lead });
      // labels a mode sets beside an edge besides its name, such as the count at each end
      (r.labels || []).forEach(function (l) {
        l.el.style.left = X(l.box.l) + 'px'; l.el.style.top = Y(l.box.t) + 'px';
        (geo.labels = geo.labels || []).push({ el: l.el, name: l.name });
      });
    });
    if (m.journey || (m.phases && m.phases.length)) dgJourneyDraw(d, g, geo, X, Y);
    if (m.layered) dgLayersDraw(d, g, geo, X, Y);
    geo.routed = routes.length;
    geo.total = m.edges.length;
    el._cmDiagram = geo;
  }

  // Counts and lists in words, for the text versions and summaries.
  function dgCount(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function dgAnd(a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a[0] || ''; }
  // The "View as text" disclosure after the figure's caption, holding the list a mode writes.
  function dgTextBox(d, list) {
    var det = mk('details', 'cm-data');
    det.setAttribute('data-cm-diagram-text', '');
    det.appendChild(mk('summary', null, 'View as text'));
    det.appendChild(list);
    var fig = d.el.closest('figure'), cap = fig && fig.querySelector('.cm-caption');
    if (cap) cap.after(det); else d.el.after(det);
    d.text = det;
  }

  // The text version, from the same data: every node once, numbered in reading order (a walk from
  // each start that follows edges in the order written; a journey map reads by column), with where
  // each edge leads. The family is read from the data: a diagram with an experience line is a
  // journey map; one with a data store, an external entity, a boundary or a data edge is a system
  // and data flow; any other is a process flow.
  function dgText(d) {
    var m = d.model, post = [], seen = {}, open = {};
    var outs = function (n) { return m.edges.filter(function (e) { return e.from === n; }); };
    var visit = function (n) {
      if (seen[n.id]) return;
      seen[n.id] = open[n.id] = true;
      outs(n).reverse().forEach(function (e) { if (open[e.to.id]) e.loop = true; else visit(e.to); });
      open[n.id] = false; post.push(n);
    };
    var starts = m.nodes.filter(function (n) { return !m.edges.some(function (e) { return e.to === n; }); });
    (starts.length ? starts : m.nodes.slice(0, 1)).reverse().forEach(visit);
    var order = post.reverse();
    post = [];
    m.nodes.slice().reverse().forEach(visit);
    order = order.concat(post.reverse());
    if (m.journey) order = m.nodes.slice().sort(function (a, b) { return a.col - b.col || a.row - b.row; });
    order.forEach(function (n, i) { n.num = i + 1; });
    var stop = function (s) { s = s.trim(); return /[.?!]$/.test(s) ? s : s + '.'; };
    var lane = function (n) { var l = m.lanes.find(function (l) { return n.row >= l.row && n.row <= l.last; }); return l ? l.label : ''; };
    var phase = function (n) { var p = m.phases.find(function (p) { return n.col >= p.col && n.col <= p.lastCol; }); return p ? p.label : ''; };
    var within = function (n) {
      return m.bounds.filter(function (b) { return n.col >= b.col && n.col <= b.lastCol && n.row >= b.row && n.row <= b.last; }).map(function (b) { return b.label; });
    };
    var levels = m.nodes.filter(function (n) { return n.level; }).map(function (n) { return n.level; });
    var low = Math.min.apply(null, levels), high = Math.max.apply(null, levels);
    var ol = mk('ol', 'cm-olist cm-small');
    order.forEach(function (n) {
      var parts = [stop(n.label + (n.type === 'store' ? ' (data store)' : n.type === 'external' ? ' (external)' : ''))];
      if (n.detail) parts.push(stop(n.detail));
      if (phase(n)) parts.push(stop('Phase: ' + phase(n)));
      if (lane(n)) parts.push(stop('Lane: ' + lane(n)));
      if (within(n).length) parts.push(stop('Within: ' + dgAnd(within(n))));
      if (n.level) parts.push(stop('Experience: ' + m.scale[n.level - 1] + (n.level === low && low < high ? ', the low point' : '')));
      if (n.emphasis) parts.push(stop('Marked: ' + n.emphasis));
      var o = outs(n);
      o.forEach(function (e) {
        var back = !!e.loop, where = (back ? 'back to step ' : 'step ') + e.to.num + ', ' + e.to.label;
        var lead = e.label ? e.label + (e.kind === 'data' ? ' (data)' : e.kind === 'optional' ? ' (optional)' : '')
          : e.kind === 'data' ? 'Data' : e.kind === 'optional' ? 'Optional' : back ? '' : 'Next';
        parts.push(stop(lead ? lead + ': ' + where : where.charAt(0).toUpperCase() + where.slice(1)));
      });
      if (!o.length && m.edges.length) parts.push('End of the flow.');
      ol.appendChild(mk('li', null, parts.join(' ')));
    });
    // the summary for assistive technology, unless the author wrote one
    if (!(d.el.getAttribute('aria-label') || '').trim()) {
      var ends = order.filter(function (n) { return !outs(n).length; }).map(function (n) { return n.label; });
      var dec = m.nodes.filter(function (n) { return n.type === 'decision'; }).length;
      var loops = m.edges.filter(function (e) { return e.loop; }).length;
      var stores = m.nodes.filter(function (n) { return n.type === 'store'; }).length, ext = m.nodes.filter(function (n) { return n.type === 'external'; }).length;
      var data = m.edges.filter(function (e) { return e.kind === 'data'; }).length;
      var s, extra = [], what = 'step';
      if (m.journey) {
        var at = function (v) { return dgAnd(order.filter(function (n) { return n.level === v; }).map(function (n) { return n.label; })) + ' (' + m.scale[v - 1] + ')'; };
        s = 'Journey map of ' + dgCount(m.nodes.length, 'step', 'steps') + (m.phases.length ? ' in ' + dgCount(m.phases.length, 'phase', 'phases') : '')
          + ' from ' + order[0].label + ' to ' + order[order.length - 1].label
          + (low < high ? '. The experience is lowest at ' + at(low) + ' and highest at ' + at(high) : '');
      } else if (stores || ext || data || m.bounds.length) {
        var parts = [dgCount(m.nodes.length - stores - ext, 'step', 'steps')];
        if (stores) parts.push(dgCount(stores, 'data store', 'data stores'));
        if (ext) parts.push(dgCount(ext, 'external entity', 'external entities'));
        s = 'System and data flow of ' + dgAnd(parts) + (m.bounds.length ? ', in ' + dgCount(m.bounds.length, 'boundary', 'boundaries') : '');
        if (data) extra.push(dgCount(data, 'data flow', 'data flows'));
        if (m.edges.length > data) extra.push(dgCount(m.edges.length - data, 'control flow', 'control flows'));
        what = 'node';
      } else {
        s = 'Flow diagram of ' + m.nodes.length + ' steps' + (order.length ? ' from ' + order[0].label : '') + (ends.length ? ' to ' + ends.join(' or ') : '');
      }
      if (m.lanes.length) extra.push(m.lanes.length + ' lanes');
      if (dec) extra.push(dec + (dec > 1 ? ' decisions' : ' decision'));
      if (loops) extra.push(loops + (loops > 1 ? ' loops back' : ' loop back'));
      if (extra.length) s += ', with ' + dgAnd(extra);
      d.el.setAttribute('aria-label', s + '. The text version under the figure lists every ' + what + '.');
    }
    dgTextBox(d, ol);
  }

  /* ---------- diagrams: journey map (flow mode) ---------- */
  // Phases are frames across the top, one over the columns each spans. The experience line runs
  // under the steps: across each step's column at that step's level on the scale, turning at right
  // angles in the gaps between columns. Each level is named under its run, between that level and
  // the next one down, so no word stands level with another run. The text version and the summary
  // name the low point; the drawing shows it by height alone.
  var DG_JY = { pitch: 24, lead: 32, below: 20 };
  function dgJourneyBuild(d, cv) {
    var m = d.model;
    m.nodes.forEach(function (n) {
      if (!n.level) return;
      n.wordEl = mk('span', 'cm-diagram__level', m.scale[n.level - 1]);
      cv.appendChild(n.wordEl);
    });
  }
  // Sizes the phase frames at the width of the columns they span (gaps at their least), and the
  // room the phases and the experience line take above and below the grid.
  function dgJourneyMeasure(d, colW) {
    var m = d.model, P = d.narrow ? DG_GAP.print : DG_GAP.screen, top = 0, word = 0;
    m.phases.forEach(function (p) {
      var w = 0;
      for (var c = p.col; c <= p.lastCol; c++) w += (colW[c] || 96) + (c > p.col ? P.col : 0);
      p.el.style.left = '0px'; p.el.style.top = '0px'; p.el.style.width = w + 'px';
      top = Math.max(top, Math.ceil(p.el.offsetHeight));
    });
    d.spaceTop = m.phases.length ? top + DG_JY.below : 0;
    m.nodes.forEach(function (n) {
      if (n.wordEl) { n.ww = Math.ceil(n.wordEl.offsetWidth); n.wh = Math.ceil(n.wordEl.offsetHeight); word = Math.max(word, n.wh); }
    });
    d.spaceBottom = m.journey ? DG_JY.lead + (m.scale.length - 1) * DG_JY.pitch + DG.clear + word : 0;
  }
  function dgJourneyDraw(d, g, geo, X, Y) {
    var m = d.model, svg = d.svg, n0 = m.scale.length;
    geo.phases = m.phases.map(function (p) {
      var l = g.colL[p.col], r = g.colL[p.lastCol] + g.colW[p.lastCol], s = p.el.style;
      s.left = X(l) + 'px'; s.top = Y(g.pad) + 'px'; s.width = (r - l) + 'px';
      return { el: p.el, label: p.label };
    });
    if (!m.journey) return;
    var steps = m.nodes.filter(function (n) { return n.level; }).sort(function (a, b) { return a.col - b.col; });
    var yAt = function (n) { return g.foot + DG_JY.lead + (n0 - n.level) * DG_JY.pitch; };
    var pts = [];
    steps.forEach(function (n, i) {
      var l = g.colL[n.col], r = l + g.colW[n.col], y = yAt(n), next = steps[i + 1];
      if (!i) pts.push([l, y]);
      else pts.push([pts[pts.length - 1][0], y]);
      if (next) { var mid = Math.round((r + g.colL[next.col]) / 2); pts.push([mid, y]); }
      else pts.push([r, y]);
    });
    var q = dgClean(pts) || pts;
    var p = q.map(function (pt) { return [X(pt[0]), Y(pt[1])]; });
    svg.appendChild(svgEl('path', { 'class': 'cm-diagram__experience', d: dgRound(p, 8) }));
    geo.experience = { points: p, labels: [] };
    steps.forEach(function (n) {
      var c = g.colL[n.col] + g.colW[n.col] / 2, y = yAt(n) + DG.clear;
      n.wordEl.style.left = X(c - n.ww / 2) + 'px'; n.wordEl.style.top = Y(y) + 'px';
      geo.experience.labels.push({ el: n.wordEl, label: n.wordEl.textContent });
    });
  }

  DG_MODES.flow = { model: dgModel, key: dgKey, text: dgText, layout: dgLayout, labels: dgLabelsInline };

  /* ---------- diagrams: state ---------- */
  // A state diagram (SPEC section 8.20, State) is drawn on the flow grid: states are rounded rectangles,
  // the start a filled dot and an end a ringed dot, each in a cell of its own, and every transition
  // a solid line named by its event. A self-transition leaves and re-enters one side of its state,
  // the first side in reading order that no other transition uses, with its event beyond the loop.
  var ST_TYPES = ['initial', 'state', 'final'], ST_LOOP = 32;
  var ST_NAMES = { initial: 'Start', state: 'State', final: 'End', flow: 'Transition' };

  function stModel(spec) {
    var byId = {}, nodes = [], edges = [], C = 1, R = 1;
    list(spec.nodes).forEach(function (n) {
      if (!n || n.id == null || byId[n.id]) return;
      var t = ST_TYPES.indexOf(n.type) > -1 ? n.type : 'state', st = t === 'state';
      var m = { id: String(n.id), type: t, label: st && n.label != null ? String(n.label) : '', detail: st && n.detail ? String(n.detail) : '',
        col: int(n.col, 1), row: int(n.row, 1), emphasis: st && n.emphasis ? String(n.emphasis) : '' };
      byId[m.id] = m; nodes.push(m); C = Math.max(C, m.col); R = Math.max(R, m.row);
    });
    list(spec.edges).forEach(function (e) {
      if (e && byId[e.from] && byId[e.to]) edges.push({ from: byId[e.from], to: byId[e.to], kind: 'flow', label: e.label ? String(e.label) : '' });
    });
    return { nodes: nodes, edges: edges, lanes: [], bounds: [], dir: spec.direction === 'down' ? 'down' : 'right', C: C, R: R };
  }

  // The key appears when the diagram has a start or an end, since a dot does not name itself.
  function stKey(m) {
    var types = ST_TYPES.filter(function (t) { return m.nodes.some(function (n) { return n.type === t; }); });
    if (!types.some(function (t) { return t !== 'state'; })) return null;
    var key = mk('div', 'cm-diagram__key');
    types.concat(m.edges.length ? ['flow'] : []).forEach(function (t) {
      var item = mk('span', 'cm-diagram__key-item');
      item.appendChild(mk('i', 'cm-diagram__swatch cm-diagram__swatch--' + t));
      item.appendChild(document.createTextNode(ST_NAMES[t]));
      key.appendChild(item);
    });
    return key;
  }
  function stNode(n, e) { if (n.type === 'state') dgNode(n, e); }

  // Each self-transition as a route: out of the side, round, and back into the same side.
  function stLoops(d, g, routes) {
    var order = d.model.dir === 'down' ? ['right', 'left', 'bottom', 'top'] : ['top', 'bottom', 'right', 'left'];
    return d.model.edges.filter(function (e) { return e.from === e.to; }).map(function (e) {
      var n = e.from, used = {};
      routes.forEach(function (r) { if (r.e.from === n) used[r.plan.a] = 1; if (r.e.to === n) used[r.plan.b] = 1; });
      var side = order.filter(function (s) { return !used[s]; })[0] || order[0];
      var cx = n.x + n.w / 2, cy = n.y + n.h / 2, k = ST_LOOP / 2, s = DG.stand, L = ST_LOOP, p;
      if (side === 'top') { var t = n.y - s; p = [[cx - k, t], [cx - k, t - L], [cx + k, t - L], [cx + k, t]]; }
      else if (side === 'bottom') { var b = n.y + n.h + s; p = [[cx + k, b], [cx + k, b + L], [cx - k, b + L], [cx - k, b]]; }
      else if (side === 'right') { var x = n.x + n.w + s; p = [[x, cy - k], [x + L, cy - k], [x + L, cy + k], [x, cy + k]]; }
      else { var l = n.x - s; p = [[l, cy + k], [l - L, cy + k], [l - L, cy - k], [l, cy - k]]; }
      return { e: e, plan: { a: side, b: side }, p: p, loop: side };
    });
  }
  // Room for each loop and its event in the gap on its side: the loop and label alone in an outside
  // gap that carries no line, and clear of the gap's middle line anywhere else.
  function stGrow(d, g, drawn, next) {
    drawn.forEach(function (r) {
      if (!r.loop) return;
      var n = r.e.from, hz = r.loop === 'top' || r.loop === 'bottom';
      var ext = DG.stand + ST_LOOP + DG.clear + (r.e.el ? (hz ? r.e.lh : r.e.lw) : 0) + 4;
      var i = r.loop === 'top' ? n.row - 1 : r.loop === 'bottom' ? n.row : r.loop === 'left' ? n.col - 1 : n.col;
      var last = hz ? g.R : g.C, o = hz ? next.y : next.x, used = (hz ? next.oy : next.ox)[i];
      var want = (i === 0 || i === last) && !used ? ext + DG.clear : 2 * ext + 3 * DG.track;
      o[i] = Math.max(o[i] || 0, want);
    });
  }

  // The text version: every state once, numbered in reading order from the start, with each
  // transition as its event and where it leads. The start and ends are named on the states they
  // join rather than listed.
  function stText(d) {
    var m = d.model, states = m.nodes.filter(function (n) { return n.type === 'state'; }), order = [], seen = {};
    var outs = function (n) { return m.edges.filter(function (e) { return e.from === n; }); };
    var visit = function (n) {
      if (seen[n.id] || n.type !== 'state') return;
      seen[n.id] = true; order.push(n);
      outs(n).forEach(function (e) { visit(e.to); });
    };
    var first = [];
    m.nodes.filter(function (n) { return n.type === 'initial'; }).forEach(function (s) { outs(s).forEach(function (e) { if (first.indexOf(e.to) < 0) first.push(e.to); }); });
    first.forEach(visit);
    states.forEach(visit);
    order.forEach(function (n, i) { n.num = i + 1; });
    var stop = function (s) { s = s.trim(); return /[.?!]$/.test(s) ? s : s + '.'; };
    var ol = mk('ol', 'cm-olist cm-small');
    order.forEach(function (n) {
      var parts = [stop(n.label)];
      if (n.detail) parts.push(stop(n.detail));
      if (first.indexOf(n) > -1) parts.push('The starting state.');
      if (n.emphasis) parts.push(stop('Marked: ' + n.emphasis));
      outs(n).forEach(function (e) {
        var to = e.to, where = to === n ? 'stays in ' + n.label : to.type === 'final' ? 'the end'
          : to.type === 'initial' ? 'back to the start' : (to.num < n.num ? 'back to state ' : 'state ') + to.num + ', ' + to.label;
        parts.push(stop(e.label ? e.label + ': ' + where : where.charAt(0).toUpperCase() + where.slice(1)));
      });
      if (!outs(n).length) parts.push('No transition leaves it.');
      ol.appendChild(mk('li', null, parts.join(' ')));
    });
    if (!(d.el.getAttribute('aria-label') || '').trim()) {
      var ends = order.filter(function (n) { return outs(n).some(function (e) { return e.to.type === 'final'; }); }).map(function (n) { return n.label; });
      var loops = m.edges.filter(function (e) { return e.from === e.to; }).length;
      var moves = m.edges.filter(function (e) { return e.from.type === 'state' && e.from !== e.to; }).length;
      var s = 'State diagram of ' + states.length + (states.length === 1 ? ' state' : ' states')
        + (first.length ? ' from ' + first.map(function (n) { return n.label; }).join(' or ') : '')
        + (ends.length ? ' to ' + ends.join(' or ') : '')
        + ', with ' + moves + (moves === 1 ? ' transition' : ' transitions')
        + (loops ? ' and ' + loops + (loops === 1 ? ' self-transition' : ' self-transitions') : '');
      d.el.setAttribute('aria-label', s + '. The text version under the figure lists every state.');
    }
    var det = mk('details', 'cm-data');
    det.setAttribute('data-cm-diagram-text', '');
    det.appendChild(mk('summary', null, 'View as text'));
    det.appendChild(ol);
    var fig = d.el.closest('figure'), cap = fig && fig.querySelector('.cm-caption');
    if (cap) cap.after(det); else d.el.after(det);
    d.text = det;
  }

  DG_MODES.state = { model: stModel, key: stKey, node: stNode, text: stText, layout: dgLayout, loops: stLoops, grow: stGrow };

  /* ---------- diagrams: sequence ---------- */
  // A sequence diagram (SPEC section 8.20, Sequence) has a geometry of its own: participants across
  // the top in the order written, a lifeline down from each, and messages as horizontal arrows in
  // the order written, so time runs down. Each label stands above its arrow in the gap beside the
  // sender, so it never sits on a lifeline; the gaps widen to hold their labels. A message marked
  // "activate" opens an activation bar on its receiver, closed by the receiver's next reply.
  // bar: half the width of an activation bar; selfW and selfH: a message to oneself turns right and
  // comes back; top: from the participants to the first label; after: from the last arrow to the
  // end of the lifelines.
  var SQ = { bar: 6, selfW: 40, selfH: 24, top: 16, after: 24 };
  var SQ_GAP = { screen: { col: 64, msg: 16, pad: 8 }, print: { col: 40, msg: 8, pad: 8 } };
  var SQ_KINDS = ['message', 'reply', 'optional'];
  var SQ_NAMES = { message: 'Message', reply: 'Reply', optional: 'Optional message', activation: 'Active' };

  function sqModel(spec) {
    var byId = {}, nodes = [], edges = [];
    list(spec.nodes).forEach(function (n) {
      if (!n || n.id == null || byId[n.id]) return;
      var m = { id: String(n.id), type: 'participant', label: n.label == null ? '' : String(n.label), detail: n.detail ? String(n.detail) : '', emphasis: '', col: nodes.length };
      byId[m.id] = m; nodes.push(m);
    });
    list(spec.edges).forEach(function (e) {
      if (!e || !byId[e.from] || !byId[e.to]) return;
      edges.push({ from: byId[e.from], to: byId[e.to], kind: SQ_KINDS.indexOf(e.kind) > -1 ? e.kind : 'message',
        label: e.label ? String(e.label) : '', activate: e.activate === true && e.from !== e.to, i: edges.length });
    });
    // activation bars: from the message that opens one to the receiver's next reply, or the end
    var open = {}, bars = [];
    edges.forEach(function (e, i) {
      var b = open[e.from.id];
      if (b && e.kind === 'reply' && e.from !== e.to) { b.last = i; delete open[e.from.id]; }
      if (e.activate && !open[e.to.id]) { open[e.to.id] = { node: e.to, first: i, last: -1 }; bars.push(open[e.to.id]); }
    });
    bars.forEach(function (b) { if (b.last < 0) b.last = edges.length - 1; });
    return { nodes: nodes, edges: edges, bars: bars };
  }

  function sqKey(m) {
    var kinds = SQ_KINDS.filter(function (k) { return m.edges.some(function (e) { return e.kind === k; }); });
    if (m.bars.length) kinds.push('activation');
    if (!kinds.some(function (k) { return k !== 'message'; })) return null;
    var key = mk('div', 'cm-diagram__key');
    kinds.forEach(function (k) {
      var item = mk('span', 'cm-diagram__key-item');
      item.appendChild(mk('i', 'cm-diagram__swatch cm-diagram__swatch--' + k));
      item.appendChild(document.createTextNode(SQ_NAMES[k]));
      key.appendChild(item);
    });
    return key;
  }

  function sqBuild(d) {
    var el = d.el, m = d.model;
    el.textContent = '';
    var key = sqKey(m);
    if (key) el.appendChild(key);
    var cv = d.canvas = mk('div', 'cm-diagram__canvas');
    var svg = d.svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'cm-diagram__lines');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    cv.appendChild(svg);
    m.nodes.forEach(function (n) {
      var e = n.el = mk('div', 'cm-diagram__node cm-diagram__node--participant');
      e.setAttribute('data-node', n.id);
      dgNode(n, e);
      cv.appendChild(e);
    });
    m.edges.forEach(function (e) { if (e.label) { e.el = mk('span', 'cm-diagram__edge-label', e.label); cv.appendChild(e.el); } });
    el.appendChild(cv);
  }

  function sqLayout(d) {
    var el = d.el, m = d.model, P = d.narrow ? SQ_GAP.print : SQ_GAP.screen, cv = d.canvas, svg = d.svg;
    if (!printing && !el.clientWidth) { d.pending = true; return; }
    d.pending = false;
    el.classList.toggle('cm-diagram--narrow', !!d.narrow);
    cv.style.transform = ''; cv.style.marginRight = ''; cv.style.marginBottom = ''; cv.style.width = '4000px'; cv.style.height = '1px';
    var N = m.nodes.length, hh = 0;
    m.nodes.forEach(function (n) {
      n.el.style.left = '0px'; n.el.style.top = '0px'; n.el.style.width = ''; n.el.style.height = '';
      n.w = even(n.el.offsetWidth); hh = Math.max(hh, even(n.el.offsetHeight));
    });
    m.nodes.forEach(function (n) { n.h = hh; });
    var lh = 0;
    m.edges.forEach(function (e) { if (e.el) { e.lw = Math.ceil(e.el.offsetWidth); e.lh = Math.ceil(e.el.offsetHeight); lh = Math.max(lh, e.lh); } });
    var active = function (n, i) { return m.bars.some(function (b) { return b.node === n && i >= b.first && i <= b.last; }); };
    // the gap right of each participant: its neighbour's half width, and every label set in it
    var gap = [], self = 0;
    for (var k = 0; k < N; k++) gap[k] = k < N - 1 ? m.nodes[k].w / 2 + m.nodes[k + 1].w / 2 + P.col : 0;
    m.edges.forEach(function (e) {
      var w = e.el ? e.lw : 0, s = e.from.col;
      if (e.from === e.to) {
        var need = SQ.bar + Math.max(SQ.selfW, DG.clear + w) + DG.clear + SQ.bar + 4;
        if (s < N - 1) gap[s] = Math.max(gap[s], need); else self = Math.max(self, need);
      } else {
        var g = e.to.col > s ? s : s - 1;
        gap[g] = Math.max(gap[g], w + 2 * DG.clear + 2 * SQ.bar + 8);
      }
    });
    var x = [], cx = P.pad + m.nodes[0].w / 2;
    for (k = 0; k < N; k++) { x[k] = cx; cx += gap[k]; }
    var W = Math.max(x[N - 1] + m.nodes[N - 1].w / 2, x[N - 1] + self) + P.pad;
    // time runs down: one row a message, a label's height and its air above each arrow
    var top = P.pad, hb = top + hh, y = hb + SQ.top - P.msg, ys = [];
    m.edges.forEach(function (e, i) {
      y += P.msg + (e.el ? e.lh : lh) + DG.clear;
      ys[i] = y;
      y += DG.clear + (e.from === e.to ? SQ.selfH : 0);
    });
    var bottom = (m.edges.length ? y - DG.clear : hb + SQ.top) + SQ.after, H = bottom + P.pad;
    var fit = dgFit(d, W, H, true), X = function (v) { return Math.round(v + fit.ox); }, Y = Math.round;
    var geo = { scale: fit.scale, ox: fit.ox, W: fit.W, H: fit.H, nodes: [], edges: [], lines: [], lanes: [] };
    m.nodes.forEach(function (n, k) {
      var s = n.el.style;
      n.x = x[k] - n.w / 2; n.y = top;
      s.left = X(n.x) + 'px'; s.top = Y(n.y) + 'px'; s.width = n.w + 'px'; s.height = n.h + 'px';
      svg.appendChild(svgEl('line', { 'class': 'cm-diagram__lifeline', x1: X(x[k]), y1: Y(hb), x2: X(x[k]), y2: Y(bottom) }));
      geo.nodes.push({ id: n.id, type: n.type, el: n.el });
      geo.lines.push({ kind: 'lifeline', points: [[X(x[k]), Y(hb)], [X(x[k]), Y(bottom)]] });
    });
    m.bars.forEach(function (b) {
      var bx = X(x[b.node.col]) - SQ.bar, bt = Y(ys[b.first] - DG.clear), bb = Y(ys[b.last] + (m.edges[b.last].from === m.edges[b.last].to ? SQ.selfH : 0) + DG.clear);
      svg.appendChild(svgEl('rect', { 'class': 'cm-diagram__activation', x: bx, y: bt, width: 2 * SQ.bar, height: bb - bt, rx: 2 }));
      geo.lines.push({ kind: 'activation bar', points: [[bx, bt], [bx, bb]] }, { kind: 'activation bar', points: [[bx + 2 * SQ.bar, bt], [bx + 2 * SQ.bar, bb]] });
    });
    m.edges.forEach(function (e, i) {
      var a = e.from.col, b = e.to.col, yy = ys[i], p, lab;
      var off = function (n, dir) { return active(n, i) ? dir * SQ.bar : 0; };
      if (a === b) {
        var x0 = x[a] + off(e.from, 1);
        p = [[x0, yy], [x0 + SQ.selfW, yy], [x0 + SQ.selfW, yy + SQ.selfH], [x0 + DG.stand, yy + SQ.selfH]];
        lab = { l: x0 + DG.clear, t: yy - DG.clear - (e.lh || 0) };
      } else {
        var dir = b > a ? 1 : -1, x1 = x[a] + off(e.from, dir), x2 = x[b] - off(e.to, dir) - dir * DG.stand;
        p = [[x1, yy], [x2, yy]];
        // centred in the gap beside the sender, between its lifeline and the next one
        var g0 = x[a] + dir * SQ.bar, g1 = x[a + dir] - dir * SQ.bar;
        lab = { l: (g0 + g1) / 2 - (e.lw || 0) / 2, t: yy - DG.clear - (e.lh || 0) };
      }
      p = p.map(function (pt) { return [X(pt[0]), Y(pt[1])]; });
      var grp = svgEl('g', { 'class': 'cm-diagram__edge cm-diagram__edge--' + e.kind, 'data-from': e.from.id, 'data-to': e.to.id });
      grp.appendChild(svgEl('path', { 'class': 'cm-diagram__line', d: dgPathD(p) }));
      grp.appendChild(svgEl('polygon', { 'class': 'cm-diagram__head', points: dgHead(p) }));
      svg.appendChild(grp);
      if (e.el) { e.el.style.left = X(lab.l) + 'px'; e.el.style.top = Y(lab.t) + 'px'; }
      geo.edges.push({ from: e.from.id, to: e.to.id, kind: e.kind, label: e.label, labelEl: e.el || null, points: p });
    });
    geo.routed = geo.edges.length;
    geo.total = m.edges.length;
    el._cmDiagram = geo;
  }

  // The text version: one numbered item for each message in time order, with its sender and
  // receiver, and the span of each activation.
  function sqText(d) {
    var m = d.model, stop = function (s) { s = s.trim(); return /[.?!]$/.test(s) ? s : s + '.'; };
    var ol = mk('ol', 'cm-olist cm-small');
    m.edges.forEach(function (e, i) {
      var who = e.from === e.to ? e.from.label + ', to itself' : e.kind === 'reply' ? e.from.label + ' replies to ' + e.to.label : e.from.label + ' to ' + e.to.label;
      if (e.kind === 'optional') who += ', optional';
      var parts = [stop(who + (e.label ? ': ' + e.label : ''))];
      m.bars.forEach(function (b) {
        if (b.first !== i) return;
        parts.push(stop(b.node.label + ' is active until ' + (b.last > i ? 'message ' + (b.last + 1) : 'the end')));
      });
      ol.appendChild(mk('li', null, parts.join(' ')));
    });
    if (!(d.el.getAttribute('aria-label') || '').trim()) {
      var names = m.nodes.map(function (n) { return n.label; }), replies = m.edges.filter(function (e) { return e.kind === 'reply'; }).length;
      var s = 'Sequence diagram of ' + m.edges.length + (m.edges.length === 1 ? ' message' : ' messages') + ' between '
        + (names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0] || 'no one')
        + (replies ? ', ' + replies + (replies === 1 ? ' of them a reply' : ' of them replies') : '');
      d.el.setAttribute('aria-label', s + '. The text version under the figure lists every message in order.');
    }
    var det = mk('details', 'cm-data');
    det.setAttribute('data-cm-diagram-text', '');
    det.appendChild(mk('summary', null, 'View as text'));
    det.appendChild(ol);
    var fig = d.el.closest('figure'), cap = fig && fig.querySelector('.cm-caption');
    if (cap) cap.after(det); else d.el.after(det);
    d.text = det;
  }

  DG_MODES.sequence = { model: sqModel, build: sqBuild, text: sqText, layout: sqLayout };

  /* ---------- diagrams: entity relationship ---------- */
  // An entity relationship diagram (SPEC section 8.20, Entity relationship) is drawn on the flow
  // grid. An entity is a small table: its name, then its key attributes, each primary or foreign key
  // tagged. A relationship is a plain line with no arrowhead, one to a side of an entity, with its
  // count written at each end beside the entity it counts: 1, 0 or 1, 1 or more, 0 or more. The
  // gaps are wider than a flow's, since every line carries a count at both ends.
  var ER_ENDS = ['1', '0 or 1', '1 or more', '0 or more'];
  var ER_GAP = { screen: { col: 96, row: 72, lane: 72, pad: 8 }, print: { col: 64, row: 56, lane: 64, pad: 8 } };
  var ER_KEYS = { primary: ['PK', 'Primary key'], foreign: ['FK', 'Foreign key'] };
  var ER_SEP = 24;

  function erModel(spec) {
    var byId = {}, nodes = [], edges = [], C = 1, R = 1;
    list(spec.nodes).forEach(function (n) {
      if (!n || n.id == null || byId[n.id]) return;
      var m = { id: String(n.id), type: 'entity', label: n.label == null ? '' : String(n.label), detail: '', emphasis: '',
        col: int(n.col, 1), row: int(n.row, 1), attrs: list(n.attributes).filter(function (a) { return a && a.name != null; }).map(function (a) {
          return { name: String(a.name), key: ER_KEYS[a.key] ? a.key : '' };
        }) };
      byId[m.id] = m; nodes.push(m); C = Math.max(C, m.col); R = Math.max(R, m.row);
    });
    list(spec.edges).forEach(function (e) {
      if (!e || !byId[e.from] || !byId[e.to] || e.from === e.to) return;
      edges.push({ from: byId[e.from], to: byId[e.to], kind: 'relation', label: e.label ? String(e.label) : '',
        fromEnd: ER_ENDS.indexOf(e.fromEnd) > -1 ? e.fromEnd : '1', toEnd: ER_ENDS.indexOf(e.toEnd) > -1 ? e.toEnd : '1' });
    });
    return { nodes: nodes, edges: edges, lanes: [], bounds: [], dir: 'right', C: C, R: R };
  }

  // The key names the key tags in use, and says which entity a count counts.
  function erKey(m) {
    var keys = Object.keys(ER_KEYS).filter(function (k) { return m.nodes.some(function (n) { return n.attrs.some(function (a) { return a.key === k; }); }); });
    if (!keys.length && !m.edges.length) return null;
    var key = mk('div', 'cm-diagram__key');
    keys.forEach(function (k) {
      var item = mk('span', 'cm-diagram__key-item');
      item.appendChild(mk('span', 'cm-tag', ER_KEYS[k][0]));
      item.appendChild(document.createTextNode(ER_KEYS[k][1]));
      key.appendChild(item);
    });
    if (m.edges.length) {
      var item = mk('span', 'cm-diagram__key-item');
      item.appendChild(mk('span', 'cm-label', '1 or more'));
      item.appendChild(document.createTextNode('How many of the entity beside it'));
      key.appendChild(item);
    }
    return key;
  }
  function erNode(n, e) {
    n.nameEl = mk('span', 'cm-diagram__name', n.label);
    e.appendChild(n.nameEl);
    var rows = mk('span', 'cm-diagram__attrs');
    n.attrs.forEach(function (a) {
      var row = mk('span', 'cm-diagram__attr');
      row.appendChild(mk('span', null, a.name));
      if (a.key) row.appendChild(mk('span', 'cm-tag', ER_KEYS[a.key][0]));
      rows.appendChild(row);
    });
    e.appendChild(rows);
  }
  function erBuild(d) {
    dgBuild(d);
    d.model.edges.forEach(function (e) {
      e.fromEl = mk('span', 'cm-diagram__edge-label', e.fromEnd);
      e.toEl = mk('span', 'cm-diagram__edge-label', e.toEnd);
      d.canvas.appendChild(e.fromEl); d.canvas.appendChild(e.toEl);
    });
  }

  // The relationship's name stands beside its line, above a run across or to the left of a run
  // down, middle first. Each end's count stands on the other side of the line, beside the
  // entity it counts, and two counts on one run stand at least ER_SEP apart, so each reads with its
  // own end. A label with no room asks for a wider gap, as a flow's edge label does.
  function erLabels(d, g, routes) {
    var m = d.model, placed = [], lines = [], short = [];
    routes.forEach(function (r) { dgSegs(r.p).forEach(function (s) { lines.push(s); }); });
    var boxes = m.nodes.map(function (n) { return dgRect(n, 0); });
    var free = function (b) {
      var c = DG.clear - 0.5, x = { l: b.l - c, t: b.t - c, r: b.r + c, b: b.b + c };
      if (b.l < 2 || b.t < 2 || b.r > g.W - 2 || b.b > g.H - 2) return false;
      var meet = function (o) { return o.l < x.r && o.r > x.l && o.t < x.b && o.b > x.t; };
      if (boxes.some(meet) || placed.some(meet)) return false;
      return !lines.some(function (s) { return dgHits(s[0], s[1], x); });
    };
    var gapAt = function (starts, sizes, a, b) {
      var best = -1, lap = 0;
      starts.forEach(function (st, k) { var o = Math.min(b, st + sizes[k]) - Math.max(a, st); if (o > lap) { lap = o; best = k; } });
      return best;
    };
    var size = function (el) { return [Math.ceil(el.offsetWidth), Math.ceil(el.offsetHeight)]; };
    routes.forEach(function (r) {
      var e = r.e, segs = dgSegs(r.p), n = segs.length, sz = { start: size(e.fromEl), end: size(e.toEl) };
      var longest = segs.reduce(function (x, s, k) { return dgLen(s[0], s[1]) > dgLen(segs[x][0], segs[x][1]) ? k : x; }, 0);
      var first = null;
      r.labels = [];
      [[e.fromEl, 'start', e.from.label], [e.toEl, 'end', e.to.label], [e.el, 'mid']].forEach(function (q) {
        var lab = q[0], at = q[1];
        if (!lab) return;
        var w = Math.ceil(lab.offsetWidth), h = Math.ceil(lab.offsetHeight), spot = null, tight = false, wish = [], preferred = at === 'mid' ? -1 : 1, side = 0;
        var i0 = at === 'start' ? 0 : at === 'end' ? n - 1 : longest;
        var tries = at === 'mid' ? [longest].concat(segs.map(function (s, i) { return i; }).filter(function (i) { return i !== longest; })) : [i0];
        tries.some(function (i) {
          var a = segs[i][0], b = segs[i][1], u = dgDir(a, b), hz = a[1] === b[1], ext = hz ? w : h, L = dgLen(a, b);
          var lo = (i > 0 ? DG.r : 0) + 2, hi = L - (i < n - 1 ? DG.r : 0) - 2;
          if (hi - lo < ext) return false;
          var os = at === 'start' ? [lo] : at === 'end' ? [hi - ext] : [Math.round((L - ext) / 2), lo, hi - ext];
          // the name above or to the left first, a count below or to the right first
          var sides = [preferred, -preferred], cands = [];
          sides.forEach(function (side) {
            os.forEach(function (o) {
              if (o < lo || o + ext > hi) return;
              var along = hz ? a[0] + u[0] * o - (u[0] < 0 ? ext : 0) : a[1] + u[1] * o - (u[1] < 0 ? ext : 0);
              if (hz) cands.push({ l: along, t: side < 0 ? a[1] - DG.clear - h : a[1] + DG.clear, side: side });
              else cands.push({ l: side < 0 ? a[0] - DG.clear - w : a[0] + DG.clear, t: along, side: side });
            });
          });
          return cands.some(function (c) {
            var box = { l: c.l, t: c.t, r: c.l + w, b: c.t + h };
            // the second count on the run the first stands on, on the same side: ER_SEP apart
            if (at === 'end' && first && first.i === i && first.side === c.side) {
              var apart = hz ? Math.max(box.l - first.box.r, first.box.l - box.r) : Math.max(box.t - first.box.b, first.box.t - box.b);
              if (apart < ER_SEP) { tight = true; return false; }
            }
            // past the canvas edge on the preferred side: the outside gap grows to hold it
            if (c.side === preferred) {
              if (box.r > g.W - 2) wish.push({ axis: 'x', i: g.C, size: g.gw[g.C] + box.r - g.W + 4 });
              if (box.l < 2) wish.push({ axis: 'x', i: 0, size: g.gw[0] + 4 - box.l });
              if (box.b > g.H - 2) wish.push({ axis: 'y', i: g.R, size: g.gh[g.R] + box.b - g.H + 4 });
              if (box.t < 2) wish.push({ axis: 'y', i: 0, size: g.gh[0] + 4 - box.t });
            }
            if (!free(box)) return false;
            spot = box; side = c.side;
            if (at === 'start') first = { i: i, side: c.side, box: box };
            return true;
          });
        });
        if (side !== preferred) wish.forEach(function (x) { short.push(x); });
        // two counts pushed to opposite sides of one run read as one diagonal: the gap grows to put
        // them on one side
        if (tight && spot) {
          var t = segs[i0], th = t[0][1] === t[1][1], k0 = th ? 0 : 1;
          var gi = gapAt(th ? g.gx : g.gy, th ? g.gw : g.gh, Math.min(t[0][k0], t[1][k0]), Math.max(t[0][k0], t[1][k0]));
          if (gi > -1) short.push({ axis: th ? 'x' : 'y', i: gi, size: sz.start[k0] + sz.end[k0] + ER_SEP + 4 + 2 * DG.stand });
        }
        if (!spot) {
          // no room: the gap the run crosses grows to hold what stands beside it
          var s = segs[i0], hz = s[0][1] === s[1][1], lo = Math.min(s[0][hz ? 0 : 1], s[1][hz ? 0 : 1]), hi = Math.max(s[0][hz ? 0 : 1], s[1][hz ? 0 : 1]);
          var idx = gapAt(hz ? g.gx : g.gy, hz ? g.gw : g.gh, lo, hi), ext = hz ? w : h, k = hz ? 0 : 1;
          var want = at === 'mid' ? (hz ? g.gw : g.gh)[idx] + Math.max(8, ext + 2 * DG.r + 8 - (hi - lo))
            : n === 1 ? sz.start[k] + sz.end[k] + ER_SEP + 4 + 2 * DG.stand
            : 2 * (ext + DG.r + 4 + DG.stand);
          if (idx > -1) short.push({ axis: hz ? 'x' : 'y', i: idx, size: want });
          var c = hz ? s[0][1] : s[0][0], across = gapAt(hz ? g.gy : g.gx, hz ? g.gh : g.gw, c - 0.5, c + 0.5);
          if (across > -1) short.push({ axis: hz ? 'y' : 'x', i: across, size: 2 * ((hz ? h : w) + 2 * DG.clear) + 4 });
          spot = { l: s[0][0], t: s[0][1], r: s[0][0] + w, b: s[0][1] + h };
        }
        placed.push(spot);
        if (at === 'mid') r.label = spot;
        else r.labels.push({ el: lab, box: spot, name: 'count "' + lab.textContent + '" beside ' + q[2] });
      });
    });
    return short;
  }

  // The text version: every entity in reading order with its keys and other attributes, then every
  // relationship with the count at each end.
  function erText(d) {
    var m = d.model, stop = function (s) { s = s.trim(); return /[.?!]$/.test(s) ? s : s + '.'; };
    var order = m.nodes.slice().sort(function (a, b) { return a.row - b.row || a.col - b.col; });
    var ol = mk('ol', 'cm-olist cm-small');
    order.forEach(function (n) {
      var parts = [stop(n.label)];
      ['primary', 'foreign'].forEach(function (k) {
        var as = n.attrs.filter(function (a) { return a.key === k; }).map(function (a) { return a.name; });
        if (as.length) parts.push(stop(ER_KEYS[k][1] + (as.length > 1 ? 's' : '') + ': ' + as.join(', ')));
      });
      var rest = n.attrs.filter(function (a) { return !a.key; }).map(function (a) { return a.name; });
      if (rest.length) parts.push(stop((n.attrs.length > rest.length ? 'Other attributes' : 'Attributes') + ': ' + rest.join(', ')));
      ol.appendChild(mk('li', null, parts.join(' ')));
    });
    m.edges.forEach(function (e) {
      var a = e.from.label, b = e.to.label;
      ol.appendChild(mk('li', null, [stop(e.label ? a + ' ' + e.label + ' ' + b : 'Relationship between ' + a + ' and ' + b),
        stop(b + ' per ' + a + ': ' + e.toEnd), stop(a + ' per ' + b + ': ' + e.fromEnd)].join(' ')));
    });
    if (!(d.el.getAttribute('aria-label') || '').trim()) {
      var names = order.map(function (n) { return n.label; });
      var s = 'Entity relationship diagram of ' + m.nodes.length + (m.nodes.length === 1 ? ' entity' : ' entities')
        + (names.length > 1 ? ', ' + names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names.length ? ', ' + names[0] : '')
        + ', with ' + m.edges.length + (m.edges.length === 1 ? ' relationship' : ' relationships');
      d.el.setAttribute('aria-label', s + '. The text version under the figure lists every entity with its keys, then every relationship with its counts.');
    }
    var det = mk('details', 'cm-data');
    det.setAttribute('data-cm-diagram-text', '');
    det.appendChild(mk('summary', null, 'View as text'));
    det.appendChild(ol);
    var fig = d.el.closest('figure'), cap = fig && fig.querySelector('.cm-caption');
    if (cap) cap.after(det); else d.el.after(det);
    d.text = det;
  }

  DG_MODES['entity-relationship'] = { model: erModel, build: erBuild, key: erKey, node: erNode, text: erText, layout: dgLayout,
    labels: erLabels, gaps: ER_GAP, bare: true };

  /* ---------- diagrams: layer stack ---------- */
  // A layer stack is drawn by the flow engine: each layer is a row framed across the full width and
  // named on the left, its components placed by column, the consumer layer at the top and the
  // source layer at the base. A dependency runs down, from the component that depends to the one it
  // depends on. An upward or sideways dependency breaks the stack: the kit leaves it undrawn, and the
  // checks fail the page.
  var DG_LY = { inset: 16 };
  function dgLayersModel(spec) {
    var nodes = [], groups = [], edges = [], row = {};
    list(spec.layers).forEach(function (l, i) {
      if (!l) return;
      groups.push({ type: 'lane', label: l.label, row: i + 1 });
      list(l.nodes).forEach(function (n) {
        if (!n || n.id == null || row[n.id]) return;
        row[n.id] = i + 1;
        nodes.push({ id: n.id, type: 'step', label: n.label, detail: n.detail, col: n.col, row: i + 1 });
      });
    });
    list(spec.edges).forEach(function (e) {
      if (!e) return;
      if (row[e.from] && row[e.to] > row[e.from]) edges.push({ from: e.from, to: e.to });
      else console.warn('[cm] a layer stack draws a dependency only from a layer to a lower one', e);
    });
    var m = dgModel({ nodes: nodes, edges: edges, groups: groups, direction: 'down' });
    m.layered = true;
    return m;
  }
  function dgLayersBuild(d) {
    dgBuild(d);
    d.model.lanes.forEach(function (l) { l.frame = mk('div', 'cm-diagram__layer'); d.canvas.insertBefore(l.frame, d.canvas.firstChild); });
  }
  function dgLayersDraw(d, g, geo, X, Y) {
    geo.layers = d.model.lanes.map(function (l) {
      var top = g.rowT[l.row] - DG_LY.inset, bot = g.rowT[l.last] + g.rowH[l.last] + DG_LY.inset, s = l.frame.style;
      s.left = X(g.pad) + 'px'; s.top = Y(top) + 'px'; s.width = (g.W - 2 * g.pad) + 'px'; s.height = (bot - top) + 'px';
      l.el.style.left = X(g.pad + DG_LY.inset) + 'px';
      return { el: l.frame, label: l.label };
    });
  }
  function dgLayersText(d) {
    var m = d.model, order = m.nodes.slice().sort(function (a, b) { return a.row - b.row || a.col - b.col; });
    var stop = function (s) { s = s.trim(); return /[.?!]$/.test(s) ? s : s + '.'; };
    order.forEach(function (n, i) { n.num = i + 1; });
    var ol = mk('ol', 'cm-olist cm-small');
    order.forEach(function (n) {
      var parts = [stop(n.label)], uses = m.edges.filter(function (e) { return e.from === n; });
      if (n.detail) parts.push(stop(n.detail));
      parts.push(stop('Layer: ' + m.lanes[n.row - 1].label));
      if (uses.length) parts.push(stop('Depends on: ' + dgAnd(uses.map(function (e) { return 'component ' + e.to.num + ', ' + e.to.label; }))));
      ol.appendChild(mk('li', null, parts.join(' ')));
    });
    if (!(d.el.getAttribute('aria-label') || '').trim()) {
      var L = m.lanes;
      d.el.setAttribute('aria-label', 'Layer stack of ' + dgCount(L.length, 'layer', 'layers') + ', from ' + L[0].label + ' at the top to ' + L[L.length - 1].label
        + ' at the base, with ' + dgCount(m.nodes.length, 'component', 'components') + ' and ' + dgCount(m.edges.length, 'dependency', 'dependencies')
        + '. The text version under the figure lists every component.');
    }
    dgTextBox(d, ol);
  }
  // The key names the one line a layer stack draws, since its arrows run against the flow of data.
  function dgLayersKey() {
    var key = mk('div', 'cm-diagram__key'), item = mk('span', 'cm-diagram__key-item');
    // the line with its arrowhead, drawn as the edges are, since the direction carries the meaning
    var sw = svgEl('svg', { 'class': 'cm-diagram__swatch cm-diagram__swatch--depends', width: 24, height: 8, viewBox: '0 0 24 8', 'aria-hidden': 'true' });
    sw.appendChild(svgEl('path', { 'class': 'cm-diagram__line', d: 'M0 4L16 4' }));
    sw.appendChild(svgEl('polygon', { 'class': 'cm-diagram__head', points: '24,4 16,0.5 16,7.5' }));
    item.appendChild(sw);
    item.appendChild(document.createTextNode('Depends on'));
    key.appendChild(item);
    return key;
  }
  DG_MODES['layer-stack'] = { model: dgLayersModel, build: dgLayersBuild, key: dgLayersKey, text: dgLayersText, layout: dgLayout };

  /* ---------- diagrams: hierarchy ---------- */
  // A hierarchy is a tree read left to right: the root in the first column, each level of children
  // in the next, and one line from a parent to each child. The author names each node's parent and
  // writes children in reading order; the ECharts tree layout places them, and the kit draws every
  // box and line. A level's boxes share its widest width and every box the tallest height. Lines
  // carry no arrowhead: a line in a hierarchy means "part of", not a step in a flow.
  var DG_HY = { gap: 16 };
  function dgTreeModel(spec) {
    var byId = {}, all = [], root = null, nodes = [], seen = {};
    list(spec.nodes).forEach(function (n) {
      if (!n || n.id == null || byId[n.id]) return;
      var m = { id: String(n.id), type: 'step', label: n.label == null ? '' : String(n.label), detail: n.detail ? String(n.detail) : '',
        up: n.parent == null ? null : String(n.parent), kids: [] };
      byId[m.id] = m; all.push(m);
    });
    all.forEach(function (n) {
      if (n.up == null) { if (!root) root = n; }
      else if (byId[n.up] && n.up !== n.id) byId[n.up].kids.push(n);
    });
    var walk = function (n, depth) {
      seen[n.id] = true; n.depth = depth; nodes.push(n);
      n.kids = n.kids.filter(function (k) { return !seen[k.id]; });
      n.kids.forEach(function (k) { k.parent = n; walk(k, depth + 1); });
    };
    if (root) walk(root, 0);
    all.forEach(function (n) { if (!seen[n.id]) console.warn('[cm] a hierarchy draws one tree from one root; this node is not in it', n.id); });
    var m = { nodes: nodes, root: root, lanes: [], bounds: [], phases: [], scale: [],
      edges: nodes.filter(function (n) { return n.parent; }).map(function (n) { return { from: n.parent, to: n, kind: 'flow', label: '' }; }),
      levels: 1 + Math.max.apply(null, [0].concat(nodes.map(function (n) { return n.depth; }))) };
    m.placed = dgTreeSlots(m);
    return m;
  }
  // The ECharts tree layout, run once off screen: each node's place across the levels (slot), and
  // the least distance between two nodes of one level (unit), which the drawing sets to a box's
  // height and the gap.
  function dgTreeSlots(m) {
    if (!m.root) return false;
    if (!window.echarts) { console.warn('[cm] ECharts not loaded; hierarchy shown as text only'); return false; }
    var data = function (n) { return { name: 'n' + m.nodes.indexOf(n), children: n.kids.map(data) }; };
    var inst = echarts.init(mk('div'), null, { renderer: 'svg', width: 1000, height: 1000 });
    try {
      inst.setOption({ animation: false, series: [{ type: 'tree', data: [data(m.root)], layout: 'orthogonal', orient: 'LR',
        left: 0, right: 0, top: 0, bottom: 0, symbolSize: 1, expandAndCollapse: false, initialTreeDepth: -1, label: { show: false } }] });
      inst.getModel().getSeriesByIndex(0).getData().tree.root.eachNode(function (t) {
        var n = /^n\d+$/.test(t.name) && m.nodes[+t.name.slice(1)], at = t.getLayout();
        if (n && at) n.slot = at.y;
      });
    } finally { inst.dispose(); }
    if (m.nodes.some(function (n) { return n.slot == null; })) return false;
    m.unit = 0;
    for (var lv = 0; lv < m.levels; lv++) {
      var ys = m.nodes.filter(function (n) { return n.depth === lv; }).map(function (n) { return n.slot; }).sort(function (a, b) { return a - b; });
      for (var i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] > 0.5 && (!m.unit || ys[i] - ys[i - 1] < m.unit)) m.unit = ys[i] - ys[i - 1];
    }
    m.unit = m.unit || 1;
    return true;
  }
  function dgTreeLayout(d) {
    var el = d.el, m = d.model, P = d.narrow ? DG_GAP.print : DG_GAP.screen, cv = d.canvas, svg = d.svg;
    if (!printing && !el.clientWidth) { d.pending = true; return; }
    d.pending = false;
    if (!m.placed) return;
    el.classList.toggle('cm-diagram--narrow', !!d.narrow);
    cv.style.transform = ''; cv.style.marginRight = ''; cv.style.marginBottom = ''; cv.style.width = '4000px'; cv.style.height = '1px';
    var colW = [], colL = [], h = 0, x = P.pad, bot = 0;
    m.nodes.forEach(function (n) {
      var s = n.el.style;
      s.left = '0px'; s.top = '0px'; s.width = ''; s.height = '';
      colW[n.depth] = Math.max(colW[n.depth] || 0, even(n.el.offsetWidth));
      h = Math.max(h, even(n.el.offsetHeight));
    });
    for (var i = 0; i < m.levels; i++) { colL[i] = x; x += colW[i] + P.col; }
    var S = (h + DG_HY.gap) / m.unit, y0 = Math.min.apply(null, m.nodes.map(function (n) { return n.slot; }));
    m.nodes.forEach(function (n) {
      n.x = colL[n.depth]; n.w = colW[n.depth]; n.h = h;
      n.y = P.pad + Math.round((n.slot - y0) * S);
      bot = Math.max(bot, n.y + h);
    });
    var fit = dgFit(d, x - P.col + P.pad, bot + P.pad, true);
    var X = function (v) { return Math.round(v + fit.ox); }, Y = function (v) { return Math.round(v); };
    var geo = { scale: fit.scale, ox: fit.ox, W: fit.W, H: fit.H, nodes: [], edges: [], lines: [], lanes: [] };
    m.nodes.forEach(function (n) {
      var s = n.el.style;
      s.left = X(n.x) + 'px'; s.top = Y(n.y) + 'px'; s.width = n.w + 'px'; s.height = n.h + 'px';
      geo.nodes.push({ id: n.id, type: n.type, el: n.el });
    });
    // parent to child: out of the parent's right side, along the middle of the gap, into the child's left
    m.edges.forEach(function (e) {
      var a = e.from, c = e.to, ay = a.y + h / 2, cy = c.y + h / 2, mid = a.x + a.w + P.col / 2;
      var q = dgClean([[a.x + a.w + DG.stand, ay], [mid, ay], [mid, cy], [c.x - DG.stand, cy]]);
      var p = q.map(function (pt) { return [X(pt[0]), Y(pt[1])]; });
      // the parent's line meets the spine square, so the branches never close into a point
      var dd = p.length < 4 ? dgRound(p, DG.r) : 'M' + p[0][0] + ' ' + p[0][1] + 'L' + p[1][0] + ' ' + p[1][1] + dgRound(p.slice(1), DG.r).replace(/^M[-\d.]+ [-\d.]+/, '');
      var grp = svgEl('g', { 'class': 'cm-diagram__edge cm-diagram__edge--flow', 'data-from': a.id, 'data-to': c.id });
      grp.appendChild(svgEl('path', { 'class': 'cm-diagram__line', d: dd }));
      svg.appendChild(grp);
      geo.edges.push({ from: a.id, to: c.id, kind: 'flow', label: '', labelEl: null, points: p });
    });
    geo.routed = geo.total = m.edges.length;
    el._cmDiagram = geo;
  }
  // The text version is the tree as an indented list, every node once under its parent.
  function dgTreeText(d) {
    var m = d.model, stop = function (s) { s = s.trim(); return /[.?!]$/.test(s) ? s : s + '.'; };
    var item = function (n) {
      var li = mk('li', null, stop(n.label) + (n.detail ? ' ' + stop(n.detail) : ''));
      if (n.kids.length) { var ul = mk('ul', 'cm-list'); n.kids.forEach(function (k) { ul.appendChild(item(k)); }); li.appendChild(ul); }
      return li;
    };
    var ul = mk('ul', 'cm-list cm-small');
    if (m.root) ul.appendChild(item(m.root));
    if (!(d.el.getAttribute('aria-label') || '').trim() && m.root) {
      var leaves = m.nodes.filter(function (n) { return !n.kids.length; }).length;
      d.el.setAttribute('aria-label', 'Hierarchy of ' + dgCount(m.nodes.length, 'item', 'items') + ' in ' + dgCount(m.levels, 'level', 'levels')
        + ', with ' + dgCount(leaves, 'item', 'items') + ' at the ends of its branches. ' + m.root.label
        + (m.root.kids.length ? ' divides into ' + dgAnd(m.root.kids.map(function (k) { return k.label; })) : ' has no parts')
        + '. The text version under the figure lists every item.');
    }
    dgTextBox(d, ul);
  }
  DG_MODES.hierarchy = { model: dgTreeModel, key: function () { return null; }, text: dgTreeText, layout: dgTreeLayout };

  // Lay a diagram out for where it is shown. On screen it takes the screen gaps and nodes; a drawing
  // wider than its box takes the narrow ones print uses, then scales to the box's width, and one
  // still wider at the 80% floor scrolls in its box. In print it is narrow and scaled to fit the
  // printed column and a page. Text that scale would take below its own size is set larger first
  // (--cm-dg-k), and the drawing laid out again, until the text is drawn at its size or more; the
  // 80% floor on the scale bounds the loop.
  function dgPlace(d) {
    var cv = d.canvas;
    d.narrow = printing; d.squeeze = false; d.fit = null;
    if (cv) cv.style.removeProperty('--cm-dg-k');
    d.mode.layout(d);
    if (d.pending || !d.fit) return;
    if (!printing) {
      if (d.fit.gW <= d.el.clientWidth) return;
      d.narrow = true; d.mode.layout(d);
      if (d.fit.gW <= d.el.clientWidth) return;
      d.squeeze = true; d.mode.layout(d);
    }
    var k = 1, ok = function () { var t = d.fit.scale * k; return t >= 0.9999 && (t <= 1.02 || k === 1); };
    for (var i = 0; i < 6 && !ok(); i++) {
      k = Math.min(1 / DG.minScale, Math.max(1, 1 / (0.995 * d.fit.scale)));
      cv.style.setProperty('--cm-dg-k', String(+k.toFixed(4)));
      d.mode.layout(d);
    }
    if (d.fit.scale * k < 0.9999) { k = 1 / DG.minScale; cv.style.setProperty('--cm-dg-k', String(k)); d.mode.layout(d); }
  }
  function dgAll() { diagrams.forEach(function (d) { if (d.model) dgPlace(d); }); }
  function initDiagrams() {
    document.querySelectorAll('.cm-diagram[data-diagram]').forEach(function (el) {
      var s = el.querySelector('script[type="application/json"]'), spec = null, mode = DG_MODES[el.getAttribute('data-diagram')];
      if (!mode) { console.warn('[cm] unknown diagram mode', el.getAttribute('data-diagram'), el); return; }
      if (s) { try { spec = JSON.parse(s.textContent); } catch (e) { console.error('[cm] invalid diagram JSON', el, e); } s.remove(); }
      if (!spec) return;
      var d = { el: el, mode: mode, model: mode.model(spec), width: 0 };
      diagrams.push(d);
      (mode.build || dgBuild)(d); mode.text(d); dgPlace(d); d.width = el.clientWidth;
    });
    if (!diagrams.length) return;
    // fonts that arrive late change every node's size; a box that changes width moves the centre
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(dgAll);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () {
        if (printing) return;
        diagrams.forEach(function (d) { var w = d.el.clientWidth; if (d.pending || w !== d.width) { d.width = w; dgPlace(d); } });
      });
      diagrams.forEach(function (d) { ro.observe(d.el); });
    }
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
    initTopbar(); initSmooth(); initTables(); initToc(); initDiagrams(); initCharts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.CM = { draw: draw, drawAll: drawAll, redraw: redrawAll, setTheme: setTheme, tokens: tokens, tokenNames: NAMES.slice(), beforePrint: beforePrint, afterPrint: afterPrint };
})();
