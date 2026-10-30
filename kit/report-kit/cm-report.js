/* Content Morphia · Report Kit runtime v1.1
   Requires ECharts 5 (loaded before this file). Behaviours, all opt-in by markup:
   [data-cm-theme-toggle]  light/dark switch (persists in localStorage "cm-theme")
   [data-cm-print]         opens the print dialog
   [data-chart]            ECharts option as <script type="application/json"> child; draws in when scrolled into view
   [data-spark]            sparkline from data-values="1,2,3"
   table[data-sortable]    click-to-sort headers (th.num sorts numerically; td[data-value] overrides text)
   .cm-toc a[href^="#"]    scroll-spy sets aria-current on the visible section
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
  // "$accent" → current token value; "$seq" → sequential ramp array
  function resolve(v, t) {
    if (typeof v === 'string' && v.charAt(0) === '$') { var k = v.slice(1); return k in t ? t[k] : (cssVar(k) || v); }
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
  function prepare(spec, t, animate) {
    var o = resolve(JSON.parse(JSON.stringify(spec)), t);
    var axisChart = !!(o.xAxis || o.yAxis);
    o.animation = animate && motion && !printing;
    o.tooltip = merge({
      trigger: axisChart ? 'axis' : 'item', confine: true, backgroundColor: t.surface, borderColor: t.ink, borderWidth: 1.5, padding: [10, 14],
      textStyle: { color: t.ink, fontFamily: t.font, fontSize: 13 }, extraCssText: 'border-radius:12px;box-shadow:' + t.l3 + ';',
      axisPointer: { type: 'line', lineStyle: { color: t.ink, width: 1, type: [3, 3] }, shadowStyle: { color: t['accent-wash'] } }
    }, o.tooltip || {});
    // legend: shown automatically for 2+ series on axis charts; "legend": false opts out
    var series = list(o.series);
    if (o.legend === false) o.legend = { show: false };
    else if (!o.legend && axisChart && series.length > 1) o.legend = {};
    var hasLegend = list(o.legend).some(function (l) { return l && l.show !== false; });
    // axis titles: y name sits above the plot, left-aligned, on a value or a category axis (an inverse
    // axis starts at the top, so its name goes at the start); x name centred under the labels
    var yNamed = false, xNamed = false;
    list(o.yAxis).forEach(function (a) { if (a && a.name && !a.nameLocation) { yNamed = true; a.nameLocation = a.inverse ? 'start' : 'end'; if (a.nameGap == null) a.nameGap = 14; a.nameTextStyle = merge({ align: 'left' }, a.nameTextStyle || {}); } });
    list(o.xAxis).forEach(function (a) { if (a && a.name && !a.nameLocation) { xNamed = true; a.nameLocation = 'middle'; if (a.nameGap == null) a.nameGap = 34; } });
    if (axisChart && !Array.isArray(o.grid)) {
      o.grid = o.grid || {};
      if (o.grid.top == null) o.grid.top = 20 + (hasLegend ? 36 : 0) + (yNamed ? 26 : 0);
      if (o.grid.bottom == null && xNamed) o.grid.bottom = 36;
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
    inst.setOption(prepare(spec, t, animate));
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
    });
    initTables(); initToc(); initCharts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.CM = { draw: draw, drawAll: drawAll, redraw: redrawAll, setTheme: setTheme, tokens: tokens, beforePrint: beforePrint, afterPrint: afterPrint };
})();
