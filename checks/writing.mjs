// Writing rules: SPEC.md section 13 (13.1 limits, 13.2 register, 13.3 headings). Lengths of paragraphs, list items, sentences, ledes and
// captions; prose between headings; bold; person, dashes and plain words; the form of headings.
//
// Read once from the live page after fonts are ready (the loader waits for them). Three scopes:
//   text      the words of <main> a reader reads. Out: code blocks, tables, chart internals and
//             their data fallbacks, diagrams and their text versions (diagram labels have their own
//             limits, checks/diagrams.mjs), screen-reader-only and aria-hidden text, and template
//             placeholders ({{ … }}), which count as no words. Inline code inside a sentence counts
//             as one word. Text in a closed <details> counts: it is part of the document.
//   prose     paragraphs, list items, definitions, questions and their answers, callout bodies,
//             captions, process-step bodies, quotes, and any other block whose own text ends a
//             sentence. Labels, chips, tags, footnote and citation markers, metadata and property
//             sheets are text, not prose.
//   headings  h1 to h6, and table titles without their kind label.
// A word is a run of characters between spaces that holds a letter or digit (SPEC section 7.1). A
// sentence ends at . ! or ? followed by a space and a capital, a digit or an opening quote.
//
// Measured limits are failures; rules that need a reader's judgment are warnings. Pull quotes are
// verbatim (SPEC section 8.9), so the register checks skip them; their length still counts.

function prepare() {
  if (window.__cmw) return;
  const H = window.__cm;
  const main = document.querySelector('main') || document.body;
  const OUT = 'script, style, template, noscript, svg, pre, .cm-code, table, .cm-table-wrap, .cm-data, '
    + '.cm-chart, .cm-diagram, [data-spark], .cm-sr, [aria-hidden="true"], [hidden]';
  const NOT_PROSE = 'a.cm-fn, a.cm-cite, a.cm-back, .cm-chip, .cm-chips, .cm-tag, .cm-id, .cm-label, .cm-delta, .cm-meta, '
    + 'sup, .cm-table-title__kind, .cm-figure__kind, .cm-criteria__score';
  const BLOCK = 'address, article, aside, blockquote, br, dd, details, div, dl, dt, figcaption, figure, footer, '
    + 'header, li, ol, p, section, summary, ul, .cm-findings__claim, .cm-caption__line';
  const PLACEHOLDER = /\{\{[\s\S]*?\}\}/g;
  const isOut = el => !!el.closest(OUT);

  // The words of an element as a reader reads them.
  const read = (el, drop) => {
    const c = el.cloneNode(true);
    c.querySelectorAll(OUT).forEach(n => n.remove());
    if (drop) c.querySelectorAll(drop).forEach(n => n.remove());
    c.querySelectorAll('code').forEach(n => n.replaceWith('X'));
    c.querySelectorAll(BLOCK).forEach(n => n.after(' '));
    return c.textContent.replace(PLACEHOLDER, ' ').replace(/\s+/g, ' ').trim();
  };
  const words = s => s.split(' ').filter(w => /[\p{L}\p{N}]/u.test(w)).length;
  // Abbreviations whose full stop does not end a sentence.
  const ABBR = /\b(e\.g|i\.e|vs|etc|est|approx|cf|Fig|No)\.(?=\s)/g;
  const sentences = s => s.replace(ABBR, (m, a) => a + '․')
    .split(/(?<=[.!?…]["”’)]?)\s+(?=[\p{Lu}\p{N}"“‘(])/u)
    .map(x => x.replace(/․/g, '.').trim()).filter(x => words(x));

  // Prose units: the innermost block that holds running text.
  const NOT_UNIT = '.cm-props, .cm-mast__meta, .cm-byline, .cm-sources, .cm-toc, .cm-crumbs, .cm-footer, .cm-kpi';
  const named = [...main.querySelectorAll('p, li, dd, .cm-qa dt, .cm-callout__body, .cm-caption, .cm-step__body')]
    .filter(el => !isOut(el) && !el.closest(NOT_UNIT)
      && !el.matches('.cm-timeline > li, .cm-process > li')
      && !(el.matches('dd') && !el.closest('.cm-def, .cm-qa')));
  const others = [...main.querySelectorAll('div')].filter(el => {
    if (isOut(el) || el.closest(NOT_UNIT) || el.closest(NOT_PROSE) || named.some(u => u.contains(el))) return false;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && /[\p{L}\p{N}]/u.test(n.nodeValue));
    return own && /[.!?]["”’)]?$/.test(read(el, NOT_PROSE));
  });
  const cands = named.concat(others);
  const unitEls = cands.filter(el => !cands.some(o => o !== el && el.contains(o)));

  const bolds = el => [...el.querySelectorAll('strong, b')]
    .filter(b => !isOut(b) && !b.closest(NOT_PROSE))
    .map(b => ({ el: b, text: read(b, NOT_PROSE) }))
    .filter(b => words(b.text));
  const units = unitEls.map(el => {
    const text = read(el, NOT_PROSE);
    return {
      el, text, words: words(text), sentences: sentences(text),
      kind: el.matches('.cm-caption') ? 'caption' : el.matches('li') ? 'item' : 'paragraph',
      bolds: bolds(el),
      quote: !!el.closest('.cm-quote'),
      question: el.matches('.cm-qa dt'),
    };
  }).filter(u => u.words);

  // The lede: the first paragraph of a section body, when nothing else comes before it. A section
  // whose header carries a TL;DR has the TL;DR in that place (SPEC section 8.1), under its own limit.
  const ledes = new Set();
  for (const s of main.querySelectorAll('section.cm-section')) {
    if (s.parentElement.closest('section') || s.querySelector(':scope > .cm-section__head > .cm-section__tldr')) continue;
    const body = s.querySelector(':scope > .cm-section__body');
    const first = body && body.querySelector('p, h1, h2, h3, h4, h5, h6, figure, table, ul, ol, dl, details, blockquote, '
      + '.cm-table-title, .cm-kpis, .cm-card, .cm-summary, .cm-callout, .cm-def, .cm-qa, .cm-props, .cm-code, .cm-slot');
    const u = first && units.find(x => x.el === first);
    if (u) ledes.add(u);
  }

  const headings = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6, .cm-table-title')]
    .filter(h => !isOut(h))
    .map(h => ({ el: h, text: read(h, '.cm-table-title__kind, a.cm-fn, a.cm-cite, .cm-chip') }))
    .filter(h => /[\p{L}\p{N}]/u.test(h.text));

  // Every text node a reader reads, with placeholders removed: for rules on single words and short
  // phrases anywhere in the body.
  const nodes = [];
  const walk = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const el = n.parentElement;
    if (!el || isOut(el) || el.closest('code')) continue;
    const text = n.nodeValue.replace(PLACEHOLDER, ' ').replace(/\s+/g, ' ');
    if (/[\p{L}\p{N}]/u.test(text)) nodes.push({ el, text, quote: !!el.closest('.cm-quote') });
  }

  const snip = s => `"${s.length > 48 ? s.slice(0, 48) + '…' : s}"`;
  window.__cmw = { H, main, units, ledes, headings, nodes, words, sentences, read, snip, isOut, NOT_PROSE };
}

// A check that runs in the page with the shared reading above.
const inWriting = (name, level, source, fn) => ({
  name, level, source: `SPEC ${source}`, once: true,
  run: async ({ page }) => {
    await page.evaluate(prepare);
    return page.evaluate(fn, { check: name });
  },
});

export default [
  inWriting('paragraph-length', 'fail', '§13.1', ({ check }) => {
    // A paragraph: 3 sentences and 60 words at most.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (u.kind !== 'paragraph' || W.H.exempt(u.el, check)) continue;
      if (u.sentences.length > 3 || u.words > 60) out.push({ where: W.H.path(u.el), value: `${u.sentences.length} sentences, ${u.words} words (at most 3 and 60): ${W.snip(u.text)}` });
    }
    return out;
  }),

  inWriting('list-item-length', 'fail', '§13.1', ({ check }) => {
    // A list item: 2 sentences and 40 words at most.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (u.kind !== 'item' || W.H.exempt(u.el, check)) continue;
      if (u.sentences.length > 2 || u.words > 40) out.push({ where: W.H.path(u.el), value: `${u.sentences.length} sentences, ${u.words} words (at most 2 and 40): ${W.snip(u.text)}` });
    }
    return out;
  }),

  inWriting('sentence-length', 'fail', '§13.1', ({ check }) => {
    // No sentence over 30 words.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (W.H.exempt(u.el, check)) continue;
      for (const s of u.sentences) {
        const n = W.words(s);
        if (n > 30) out.push({ where: W.H.path(u.el), value: `${n} words (at most 30): ${W.snip(s)}` });
      }
    }
    return out;
  }),

  inWriting('sentence-target', 'warn', '§13.1', ({ check }) => {
    // Sentences aim at 25 words or fewer.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (W.H.exempt(u.el, check)) continue;
      for (const s of u.sentences) {
        const n = W.words(s);
        if (n > 25 && n <= 30) out.push({ where: W.H.path(u.el), value: `${n} words (target 25): ${W.snip(s)}` });
      }
    }
    return out;
  }),

  inWriting('sentence-average', 'fail', '§13.1', ({ check }) => {
    // Across the page's prose, sentences average 18 words or fewer.
    const W = window.__cmw;
    const lens = W.units.filter(u => !W.H.exempt(u.el, check)).flatMap(u => u.sentences.map(W.words));
    if (!lens.length) return [];
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
    return avg > 18 ? [{ where: 'main', value: `${avg.toFixed(1)} words per sentence over ${lens.length} sentences (at most 18)` }] : [];
  }),

  inWriting('prose-between-headings', 'fail', '§13.1', ({ check }) => {
    // At most 150 words of prose between one heading and the next. Headings are h1 to h6 and table
    // titles, placeholders included.
    const W = window.__cmw, out = [];
    const marks = new Map(W.units.filter(u => !W.H.exempt(u.el, check)).map(u => [u.el, u.words]));
    let from = null, n = 0;
    const close = () => { if (n > 150) out.push({ where: from ? W.H.path(from) : 'main', value: `${n} words of prose before the next heading (at most 150)` }); };
    for (const el of W.main.querySelectorAll('*')) {
      if ((/^h[1-6]$/.test(el.localName) || el.matches('.cm-table-title')) && !W.isOut(el)) { close(); from = el; n = 0; }
      else if (marks.has(el)) n += marks.get(el);
    }
    close();
    return out;
  }),

  inWriting('section-lede', 'fail', '§13.1', ({ check }) => {
    // A section's lede: 45 words at most, with its key phrase in bold. A TL;DR stands in for the
    // lede under its own limit (tldr-length), so a section with one has no lede here.
    const W = window.__cmw, out = [];
    for (const u of W.ledes) {
      if (W.H.exempt(u.el, check)) continue;
      if (u.words > 45) out.push({ where: W.H.path(u.el), value: `${u.words} words (at most 45): ${W.snip(u.text)}` });
      if (!u.bolds.length) out.push({ where: W.H.path(u.el), value: `no key phrase in bold: ${W.snip(u.text)}` });
    }
    return out;
  }),

  inWriting('caption-length', 'fail', '§13.1', ({ check }) => {
    // A caption: 30 words at most.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (u.kind !== 'caption' || W.H.exempt(u.el, check)) continue;
      if (u.words > 30) out.push({ where: W.H.path(u.el), value: `${u.words} words (at most 30): ${W.snip(u.text)}` });
    }
    return out;
  }),

  inWriting('bold-phrases', 'fail', '§13.2', ({ check }) => {
    // Bold marks the phrase that carries a sentence: at most two per paragraph or item, never a whole
    // sentence. The claim of a finding or a recommended action is a line of its own, not bold (SPEC
    // sections 8.3, 8.19), so no sentence in bold is excepted.
    const W = window.__cmw, out = [];
    const norm = s => s.replace(/\s+/g, ' ').trim();
    for (const u of W.units) {
      if (W.H.exempt(u.el, check)) continue;
      const phrases = u.bolds;
      if (phrases.length > 2) out.push({ where: W.H.path(u.el), value: `${phrases.length} bold phrases (at most 2): ${W.snip(u.text)}` });
      for (const b of phrases) {
        const i = u.sentences.findIndex(s => norm(s) === norm(b.text));
        if (i < 0) continue;
        out.push({ where: W.H.path(b.el), value: `a whole sentence in bold: ${W.snip(b.text)}` });
      }
    }
    return out;
  }),

  inWriting('bold-labels', 'fail', '§13.2; §14 item 9', ({ check }) => {
    // No bold label runs into the text that follows it. A run-in label is bold text ending in a
    // colon, anywhere in <main> (tables included), or a bold phrase that opens a unit of prose: a
    // paragraph, list item, definition, answer, callout body or caption. Either fails only when more
    // text follows it on the same line. A label on a line of its own passes, and a claim line is not
    // bold (SPEC sections 8.3, 8.19).
    const W = window.__cmw, out = [];
    // Text a reader sees: tables and data fallbacks count here, unlike in the prose scope.
    const HIDDEN = 'script, style, template, noscript, svg, pre, code, .cm-code, .cm-chart, [data-spark], .cm-sr, '
      + '[aria-hidden="true"], [hidden]';
    const hidden = el => !el || !!el.closest(HIDDEN);
    const later = (a, n) => !!(a.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING);
    const inline = el => getComputedStyle(el).display.startsWith('inline');
    // The box that lays a node out: its nearest ancestor that is not inline.
    const block = n => { let p = n.parentElement; while (p && p !== W.main && inline(p)) p = p.parentElement; return p || W.main; };
    // Prose text in root before el: labels, chips and markers are not prose.
    const opens = (root, el) => {
      const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (el.contains(n) || later(el, n)) return true;
        const p = n.parentElement;
        if (hidden(p) || p.closest(W.NOT_PROSE)) continue;
        if (/[\p{L}\p{N}]/u.test(n.nodeValue)) return false;
      }
      return true;
    };
    // The first visible character after el inside root, as a range.
    const next = (root, el) => {
      const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (el.contains(n) || !later(el, n) || hidden(n.parentElement)) continue;
        const i = n.nodeValue.search(/\S/);
        if (i < 0) continue;
        const r = document.createRange();
        r.setStart(n, i);
        r.setEnd(n, i + 1);
        return r;
      }
      return null;
    };
    // Same line: the boxes share a row as drawn, or the text flows on from b in the same block with
    // no line break between, whatever the wrap.
    const sameLine = (el, r) => {
      const a = [...el.getClientRects()].pop(), c = r.getClientRects()[0];
      if (a && c && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > Math.min(a.height, c.height) / 2) return true;
      if (!inline(el) || block(r.startContainer) !== block(el)) return false;
      const gap = document.createRange();
      gap.setStartAfter(el);
      gap.setEnd(r.startContainer, r.startOffset);
      return !gap.cloneContents().querySelector('br');
    };
    for (const b of W.main.querySelectorAll('strong, b')) {
      if (hidden(b) || W.H.exempt(b, check)) continue;
      const text = W.read(b);
      if (!W.words(text)) continue;
      const unit = W.units.find(u => u.el.contains(b));
      const colon = /:$/.test(text);
      if (!colon && !(unit && opens(unit.el, b))) continue;
      const r = next(block(b), b);
      if (r && sameLine(b, r)) {
        out.push({ where: W.H.path(b), value: `${colon ? 'bold label' : 'bold phrase opening the text'} "${text}" runs into the text after it` });
      }
    }
    return out;
  }),

  inWriting('person', 'fail', '§13.2', ({ check }) => {
    // Neutral third person: no first or second person in the body. Verbatim quotes are someone
    // else's words.
    const W = window.__cmw, out = [];
    // Contractions (you're, we've) match on their first part. "US" in capitals is the country.
    const PERSON = /\b(you|your|yours|yourself|yourselves|we|us|our|ours|ourselves|me|my|mine|myself)\b/i;
    const SELF = /(?<![\p{L}\p{N}.\-])I(?![\p{L}\p{N}.\-])/u;
    for (const n of W.nodes) {
      if (n.quote || W.H.exempt(n.el, check)) continue;
      const t = n.text.replace(/\bUS\b/g, '');
      const m = t.match(PERSON) || t.match(SELF);
      if (m) out.push({ where: W.H.path(n.el), value: `"${m[1] || m[0]}" in ${W.snip(n.text.trim())}` });
    }
    return out;
  }),

  inWriting('dashes', 'fail', '§13.2', ({ check }) => {
    // No em dash or en dash in prose. A minus sign (U+2212) and an arrow are not dashes.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (u.quote || W.H.exempt(u.el, check)) continue;
      const m = u.text.match(/[–—]/);
      if (m) out.push({ where: W.H.path(u.el), value: `${m[0] === '—' ? 'em' : 'en'} dash in ${W.snip(u.text.slice(Math.max(0, u.text.indexOf(m[0]) - 24)))}` });
    }
    return out;
  }),

  inWriting('plain-words', 'fail', '§13.2', ({ check }) => {
    // Plain words: "use", not "utilize"; "so", not "in order to".
    const W = window.__cmw, out = [];
    const PAIRS = [[/\butili[sz](e|es|ed|ing|ation)\b/i, 'use'], [/\bin order to\b/i, 'so, or to']];
    for (const n of W.nodes) {
      if (n.quote || W.H.exempt(n.el, check)) continue;
      for (const [re, plain] of PAIRS) {
        const m = n.text.match(re);
        if (m) out.push({ where: W.H.path(n.el), value: `"${m[0]}" (${plain})` });
      }
    }
    return out;
  }),

  inWriting('chat-labels', 'fail', '§13.2', ({ check }) => {
    // No chat-style labels in a document.
    const W = window.__cmw, out = [];
    const LABELS = /\b(done so far|your part|next up)\b/i;
    for (const n of W.nodes) {
      if (n.quote || W.H.exempt(n.el, check)) continue;
      const m = n.text.match(LABELS);
      if (m) out.push({ where: W.H.path(n.el), value: `chat-style label "${m[0]}"` });
    }
    return out;
  }),

  inWriting('heading-form', 'fail', '§13.3', ({ check }) => {
    // A heading is a plain noun phrase: no leading article, no question, no adjective that argues.
    const W = window.__cmw, out = [];
    const ARGUE = /\b(proposed|honest|current|revised|improved)\b/i;
    for (const h of W.headings) {
      if (W.H.exempt(h.el, check)) continue;
      const at = W.H.path(h.el);
      if (/^(a|an|the)\s/i.test(h.text)) out.push({ where: at, value: `opens with an article: ${W.snip(h.text)}` });
      if (/\?\s*$/.test(h.text)) out.push({ where: at, value: `a question: ${W.snip(h.text)}` });
      const m = h.text.match(ARGUE);
      if (m) out.push({ where: at, value: `"${m[0]}" argues: ${W.snip(h.text)}` });
    }
    return out;
  }),

  inWriting('heading-words', 'warn', '§13.3', ({ check }) => {
    // No framing words and no verbs unless the section is a procedure: a heading built on what,
    // where, how and the like is a clause, and one that opens "Using the …" is a verb phrase.
    const W = window.__cmw, out = [];
    const CLAUSE = /\b(what|where|when|why|how|who|whom|whose|which)\b/i;
    const VERB = /^\p{L}+ing\s+(the|a|an|this|that|these|those|its|their|each|every)\b/iu;
    for (const h of W.headings) {
      if (W.H.exempt(h.el, check)) continue;
      const c = h.text.match(CLAUSE);
      if (c) out.push({ where: W.H.path(h.el), value: `a clause ("${c[0]}"), not a noun phrase: ${W.snip(h.text)}` });
      else if (VERB.test(h.text)) out.push({ where: W.H.path(h.el), value: `a verb phrase, not a noun phrase: ${W.snip(h.text)}` });
    }
    return out;
  }),

  inWriting('sentence-case', 'warn', '§13.3', ({ check }) => {
    // Headings in sentence case. Proper nouns cannot be told apart, so a heading is flagged only when
    // two or more of its later words of four letters or more are capitalised, and they are most of them.
    const W = window.__cmw, out = [];
    for (const h of W.headings) {
      if (W.H.exempt(h.el, check)) continue;
      const later = h.text.split(/\s+/).slice(1).map(w => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')).filter(w => /^\p{L}{4,}$/u.test(w));
      const caps = later.filter(w => /^\p{Lu}\p{Ll}/u.test(w));
      if (caps.length >= 2 && caps.length * 2 > later.length) out.push({ where: W.H.path(h.el), value: `title case (${caps.join(', ')}): ${W.snip(h.text)}` });
    }
    return out;
  }),

  inWriting('signposting', 'warn', '§13.2', ({ check }) => {
    // No signposting, such as "this section describes", "note that" or "as shown below".
    const W = window.__cmw, out = [];
    const SIGN = /\b(this|the following) (section|page|document|part|table|figure|chart|list) (describes|covers|shows|explains|lists|presents)\b|\bnote that\b|\bas (shown|seen|described|noted|listed) (below|above|earlier|later)\b/i;
    for (const u of W.units) {
      if (u.quote || W.H.exempt(u.el, check)) continue;
      const m = u.text.match(SIGN);
      if (m) out.push({ where: W.H.path(u.el), value: `signposting "${m[0]}"` });
    }
    return out;
  }),

  inWriting('questions', 'warn', '§13.2', ({ check }) => {
    // No rhetorical questions. A questions block (SPEC section 8.6) asks the reader's questions on
    // purpose.
    const W = window.__cmw, out = [];
    for (const u of W.units) {
      if (u.quote || u.question || W.H.exempt(u.el, check)) continue;
      for (const s of u.sentences) if (/\?["”’)]?$/.test(s)) out.push({ where: W.H.path(u.el), value: `a question in prose: ${W.snip(s)}` });
    }
    return out;
  }),

  inWriting('not-x-but-y', 'warn', '§13.2', ({ check }) => {
    // No "this isn't X, it's Y".
    const W = window.__cmw, out = [];
    const FRAME = /\b(is not|isn't|are not|aren't|was not|wasn't)\b[^.?!]{1,60}?[,;:]\s*(it|this|they|that)('s|'re| is| are| was)\b/i;
    for (const u of W.units) {
      if (u.quote || W.H.exempt(u.el, check)) continue;
      const m = u.text.replace(/’/g, "'").match(FRAME);
      if (m) out.push({ where: W.H.path(u.el), value: `"not X, it's Y": ${W.snip(m[0])}` });
    }
    return out;
  }),

  inWriting('unquantified', 'warn', '§13.2', ({ check }) => {
    // State the number, not the adjective: a sentence that reports a change carries a number.
    const W = window.__cmw, out = [];
    const CHANGE = /\b(rose|risen|fell|fallen|grew|grown|dropped|climbed|declined|improved|worsened|increased|decreased|doubled|halved)\b/i;
    for (const u of W.units) {
      if (u.quote || W.H.exempt(u.el, check)) continue;
      for (const s of u.sentences) {
        const m = s.match(CHANGE);
        if (m && !/\d/.test(s)) out.push({ where: W.H.path(u.el), value: `"${m[0]}" with no number: ${W.snip(s)}` });
      }
    }
    return out;
  }),
];
