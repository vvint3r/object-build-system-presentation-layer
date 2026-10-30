// Navigation: the contents strip on narrow screens, and where in-page links and fragment addresses
// stop. Measured in a real viewport at several widths; print hides the top bar and the rail, so print
// has nothing to measure. The strip and jump checks run in light and dark, then set the viewport back
// to the loader's size, scroll to the top and park the pointer, so they leave the page as they found
// it. The fragment check opens pages of its own.

import path from 'node:path';
import { serveCharts } from '../tools/load.mjs';

const LOADER = { width: 1440, height: 900 };

async function restore(page) {
  await page.setViewportSize(LOADER);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.mouse.move(-1, -1);
  await page.waitForTimeout(100);
}

export default [
  {
    // At 1150px and below the rail is a wrapping strip. Whichever link is current, every link keeps
    // its width, so the strip keeps its height and the page below it does not move.
    name: 'strip-current', level: 'fail', source: 'SPEC §5',
    run: async ({ page, mode }) => {
      if (mode === 'print') return [];
      const out = [];
      for (const width of [390, 820]) {
        await page.setViewportSize({ width, height: LOADER.height });
        await page.waitForTimeout(100);
        out.push(...await page.evaluate(({ width, check }) => {
          const H = window.__cm, found = [];
          const links = [...document.querySelectorAll('.cm-toc a')].filter(a => H.shown(a) && !H.exempt(a, check));
          if (!links.length) return found;
          const strip = links[0].closest('.cm-rail') || links[0].closest('.cm-toc');
          const kept = links.map(a => a.getAttribute('aria-current'));
          const clear = () => links.forEach(a => a.removeAttribute('aria-current'));
          clear();
          const widths = links.map(a => a.getBoundingClientRect().width);
          const height = strip.getBoundingClientRect().height;
          links.forEach((a, i) => {
            clear();
            a.setAttribute('aria-current', 'true');
            const w = a.getBoundingClientRect().width, h = strip.getBoundingClientRect().height;
            if (Math.abs(w - widths[i]) > 0.5) found.push({ where: H.path(a), value: `at ${width}px the current link is ${w.toFixed(1)}px wide, ${widths[i].toFixed(1)}px otherwise` });
            if (Math.abs(h - height) > 0.5) found.push({ where: H.path(strip), value: `at ${width}px the strip is ${Math.round(h)}px tall with "${H.text(a)}" current, ${Math.round(height)}px otherwise` });
          });
          clear();
          links.forEach((a, i) => { if (kept[i] !== null) a.setAttribute('aria-current', kept[i]); });
          return found;
        }, { width, check: 'strip-current' }));
      }
      await restore(page);
      return out;
    },
  },

  {
    // Every in-page link stops its target 24px below the sticky top bar, whatever height the bar
    // wraps to. At each width, every link target is first scrolled behind the bar, then its link
    // is followed: the target's top edge must end inside the window and 24px or more below the bar,
    // or, where the page cannot scroll that far up, anywhere below the bar. Reduced motion turns the
    // kit's smooth scrolling off, so each jump ends at once, where a smooth jump would end.
    name: 'jump-targets', level: 'fail', source: 'SPEC §5',
    run: async ({ page, mode }) => {
      if (mode === 'print') return [];
      const out = [];
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const width of [390, 570, 820, 1440]) {
        await page.setViewportSize({ width, height: LOADER.height });
        await page.waitForTimeout(150);
        out.push(...await page.evaluate(({ width, check }) => {
          const H = window.__cm, found = [], seen = new Set();
          const bar = document.querySelector('.cm-topbar');
          for (const a of document.querySelectorAll('a[href^="#"]')) {
            const id = decodeURIComponent(a.hash.slice(1));
            const target = id && document.getElementById(id);
            if (!target || seen.has(id) || H.ignored(a) || H.exempt(a, check) || H.exempt(target, check) || !H.shown(target)) continue;
            seen.add(id);
            window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top, behavior: 'instant' });
            a.click();
            const top = target.getBoundingClientRect().top;
            const under = bar && H.shown(bar) ? bar.getBoundingClientRect().bottom : 0;
            const where = `${H.path(target)} via ${H.path(a).split(' > ').pop()} at ${width}px`;
            if (top < under - 0.5) found.push({ where, value: `stops ${(under - top).toFixed(1)}px under the top bar` });
            else if (top >= window.innerHeight) found.push({ where, value: 'stops below the window' });
            else if (window.scrollY > 0 && top < under + 23) found.push({ where, value: `stops ${(top - under).toFixed(1)}px below the top bar (24px)` });
          }
          location.hash = '';
          return found;
        }, { width, check: 'jump-targets' }));
      }
      await page.emulateMedia({ reducedMotion: null });
      await restore(page);
      return out;
    },
  },

  {
    // A page opened at an address with a fragment stops its target 24px below the top bar too, with
    // Nunito arriving late, as it does over a slow connection: the font files are held back 300ms.
    // Two targets, at 390 and 820px: the first footnote marker and the contents rail's middle
    // section. Each opening is a fresh page, given 2.5s after its fonts load to settle.
    name: 'fragment-open', level: 'fail', source: 'SPEC §5', once: true,
    run: async ({ page, file }) => {
      const ids = await page.evaluate(() => {
        const H = window.__cm;
        const toc = [...H.source().querySelectorAll('.cm-toc a[href^="#"]')].map(a => a.getAttribute('href').slice(1));
        const fn = H.source().querySelector('a.cm-fn[id]');
        return [...new Set([fn && fn.id, toc[Math.floor(toc.length / 2)]].filter(id => id && document.getElementById(id)))];
      });
      const url = 'file://' + path.resolve(file);
      const browser = page.context().browser();
      const jobs = [390, 820].flatMap(width => ids.map(id => ({ width, id })));
      const out = await Promise.all(jobs.map(async ({ width, id }) => {
        const p = await browser.newPage({ viewport: { width, height: LOADER.height }, colorScheme: 'light' });
        try {
          await serveCharts(p);
          await p.route('https://fonts.gstatic.com/**', async r => { await new Promise(res => setTimeout(res, 300)); await r.continue().catch(() => {}); });
          await p.goto(url + '#' + encodeURIComponent(id), { waitUntil: 'load', timeout: 60000 });
          await p.evaluate(() => document.fonts.ready.then(() => true));
          await p.waitForTimeout(2500);
          return await p.evaluate(({ id, width }) => {
            const target = document.getElementById(id), bar = document.querySelector('.cm-topbar');
            const top = target.getBoundingClientRect().top;
            const under = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().bottom : 0;
            const where = `#${id} opened at ${width}px`;
            if (top < under - 0.5) return { where, value: `stops ${(under - top).toFixed(1)}px under the top bar` };
            if (top >= window.innerHeight) return { where, value: 'stops below the window' };
            if (window.scrollY > 0 && top < under + 23) return { where, value: `stops ${(top - under).toFixed(1)}px below the top bar (24px)` };
            return null;
          }, { id, width });
        } finally {
          await p.close();
        }
      }));
      return out.filter(Boolean);
    },
  },
];
