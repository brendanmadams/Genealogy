// "Ask a question": answers questions about the family records.
// 1. Exact answers first: relationships, family members, dates, places and
//    lists are computed straight from the data, so they cannot be wrong
//    about what the site records.
// 2. Anything else goes to the AI on the Worker (worker/, POST /ask), which
//    sees only the records for the current selection (the chart on screen)
//    plus anyone named in the question, and must answer from them alone.
import { displayName, lifespan, byBirth } from './data.js';
import { relate } from './relate.js';
import { ASK } from './config.js';
import { suggestEnabled } from './suggest.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[“”"]/g, ' ').replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set('a an and are as at be by did do does for from had has have he her his how i in is it its me my of on or our she that the their them there they this to was we were what when where which who whom whose why with you your about any tell know anything much many please'.split(' '));
const CONTEXT_CHARS = 24000;

export const askEnabled = () => Boolean(ASK.endpoint);

// ── Names ────────────────────────────────────────────────────────────────────
function nameVariants(p) {
  const out = new Set();
  const addV = s => { const n = norm(s); if (n.length >= 3) out.add(n); };
  const base = p.name.replace(/\([^)]*\)/g, ' ').replace(/["“][^"”]*["”]/g, ' ');
  addV(base);
  addV(displayName(p));
  for (const a of p.aliases || []) addV(a.replace(/\([^)]*\)/g, ' '));
  const words = norm(base).split(' ').filter(w => w.length > 1 && !/^(jr|sr|ii|iii|iv)$/.test(w));
  const first = words[0], last = words[words.length - 1];
  if (first && last && first !== last) addV(`${first} ${last}`);
  const nick = (p.name.match(/["“]([^"”]+)["”]/) || [])[1];
  const married = (p.name.match(/\(([^)]*)\)/) || [])[1]?.split(/,\s*/) || [];
  for (const g of [first, nick].filter(Boolean)) {
    if (last) addV(`${g} ${last}`);
    for (const m of married) addV(`${g} ${m}`);
  }
  if (nick) addV(nick);
  if (first) addV(first);              // single names are only used when unambiguous (see below)
  return [...out];
}

class NameIndex {
  constructor(D) {
    this.D = D;
    this.map = new Map();              // variant → Set(ids)
    for (const p of D.people.values()) for (const v of nameVariants(p)) {
      if (!this.map.has(v)) this.map.set(v, new Set());
      this.map.get(v).add(p.id);
    }
    this.maxWords = Math.max(...[...this.map.keys()].map(k => k.split(' ').length));
  }
  /** People named in `text`, longest matches first, one pick per mention. */
  find(text, scope = new Set()) {
    const words = norm(text).split(' ');
    const found = [];
    for (let i = 0; i < words.length;) {
      let hit = null;
      for (let n = Math.min(this.maxWords, words.length - i); n >= 1 && !hit; n--) {
        const phrase = words.slice(i, i + n).join(' ');
        if (n === 1 && (STOP.has(phrase) || phrase.length < 3)) continue;
        const ids = this.map.get(phrase);
        if (!ids) continue;
        const pick = this.best([...ids], scope, n === 1);
        if (pick) hit = { id: pick, n, text: phrase };
      }
      if (hit) { if (!found.some(f => f.id === hit.id)) found.push(hit); i += hit.n; } else i++;
    }
    return found;
  }
  best(ids, scope, single) {
    const D = this.D;
    const rank = id => { const p = D.person(id); return (scope.has(id) ? 8 : 0) + (p.connected ? 4 : 0) + (p.dna_match ? -6 : 0) + (p.birth?.year ? 1 : 0); };
    const sorted = ids.sort((a, b) => rank(b) - rank(a));
    if (!single) return sorted[0];
    // a bare first name counts only if it points at one person in view, or one person overall
    const inScope = sorted.filter(id => scope.has(id));
    if (inScope.length === 1) return inScope[0];
    const family = sorted.filter(id => !D.person(id).dna_match);
    return family.length === 1 ? family[0] : null;
  }
}

// ── The current selection ────────────────────────────────────────────────────
export function selection(D, focusId, view, gens) {
  const p = D.person(focusId);
  if (!p) return { label: 'the whole family tree', ids: [], focus: null };
  const ids = new Set([p.id]);
  const partners = q => D.partnerFamilies(q).map(f => D.partnerIn(f, q)).filter(Boolean);
  if (view === 'ancestors') {
    let gen = [p];
    for (let g = 1; g <= gens && gen.length; g++) { gen = gen.flatMap(q => D.parents(q)); gen.forEach(q => ids.add(q.id)); }
    return { label: `Ancestors of ${displayName(p)} (${gens >= 99 ? 'all' : gens} generations)`, ids: [...ids], focus: p.id };
  }
  if (view === 'descendants') {
    let gen = [p];
    partners(p).forEach(q => ids.add(q.id));
    for (let g = 1; g <= gens && gen.length; g++) {
      gen = gen.flatMap(q => D.children(q));
      gen.forEach(q => { ids.add(q.id); partners(q).forEach(s => ids.add(s.id)); });
    }
    return { label: `Descendants of ${displayName(p)} (${gens >= 99 ? 'all' : gens} generations)`, ids: [...ids], focus: p.id };
  }
  const sib = D.siblings(p);
  for (const q of [...D.parents(p), ...D.parents(p).flatMap(x => D.parents(x)), ...sib.full, ...sib.half, ...partners(p), ...D.children(p)]) ids.add(q.id);
  return { label: `${displayName(p)} and immediate family`, ids: [...ids], focus: p.id };
}

// ── Exact answers ────────────────────────────────────────────────────────────
const REL_WORDS = {
  parents: /\b(parents?|father|mother|mom|dad)\b/, grandparents: /\bgrand ?(parents?|father|mother)s?\b/,
  children: /\b(children|kids|sons?|daughters?|child)\b/, grandchildren: /\bgrand ?(children|kids|sons?|daughters?)\b/,
  siblings: /\b(siblings?|brothers?|sisters?)\b/, spouses: /\b(spouses?|wife|wives|husbands?|married to|marry|partner)\b/,
  cousins: /\b(first )?cousins?\b/,
};

function localAnswer(D, names, q, sel, meId) {
  const n = norm(q);
  const who = id => D.person(id);
  const named = names.map(x => x.id);
  const subject = named[0] || (/\b(his|her|their|this person|them|he|she)\b/.test(n) || !named.length ? sel.focus : null);
  const iAsk = /\b(i|me|my|am i)\b/.test(n);

  // how is A related to B / relationship between A and B / how am I related to A
  if (/\brelat(ed|ion|ionship)\b|\bconnected to\b/.test(n)) {
    let a = named[0], b = named[1];
    if (iAsk && named.length === 1) {
      if (!meId) return { html: `<p>Open your own entry and press <strong>This is me</strong> in the details panel, then ask again and I can say how anyone is related to you.</p>` };
      a = named[0]; b = meId;
    }
    if (!b && a && sel.focus && a !== sel.focus) b = sel.focus;
    if (a && b) {
      // "how is A related to B" → A is B's …
      const r = relate(D, b, a);
      const bName = b === meId ? 'your' : `${esc(displayName(who(b)))}’s`;
      const sentence = r.kind === 'none'
        ? `No relationship between <strong>${esc(displayName(who(a)))}</strong> and <strong>${b === meId ? 'you' : esc(displayName(who(b)))}</strong> is recorded yet.`
        : `<strong>${esc(displayName(who(a)))}</strong> is ${bName} <strong>${esc(r.text)}</strong>.`;
      return { html: `<p>${sentence}</p>`, people: r.path, path: r.path.length > 1, ancestors: r.ancestors };
    }
  }

  // open questions ("what do we know…", "why…", "summarize…") need reading, not lookup
  if (/\b(what do we know|what is known|tell me|how sure|how certain|how confident|why|summari[sz]e|describe|explain|stor(y|ies)|anything about|more about|compare|evidence|proof|proven)\b/.test(n)) return null;

  const p = subject && who(subject);
  if (p) {
    const nm = esc(displayName(p));
    // when did they marry
    if (/\bwhen\b/.test(n) && /\b(marry|married|marriage|wed|wedding)\b/.test(n)) {
      const fams = D.partnerFamilies(p).filter(f => D.partnerIn(f, p));
      if (!fams.length) return { html: `<p>No marriage is recorded for <strong>${nm}</strong>.</p>`, people: [p.id] };
      return { html: `<ul>${fams.map(f => `<li>${nm} and ${esc(displayName(D.partnerIn(f, p)))}: ${f.marriage ? `married <strong>${esc(f.marriage)}</strong>` : 'marriage date not recorded'}</li>`).join('')}</ul>`, people: [p.id, ...fams.map(f => D.partnerIn(f, p).id)], list: true };
    }
    // family members
    for (const [key, re] of Object.entries(REL_WORDS)) {
      if (!re.test(n)) continue;
      if (key === 'parents' && REL_WORDS.grandparents.test(n)) continue;
      if (key === 'children' && REL_WORDS.grandchildren.test(n)) continue;
      const partners = D.partnerFamilies(p).map(f => D.partnerIn(f, p)).filter(Boolean);
      const sib = D.siblings(p);
      const list = {
        parents: D.parents(p), grandparents: D.parents(p).flatMap(x => D.parents(x)),
        children: D.children(p), grandchildren: byBirth(D.children(p).flatMap(x => D.children(x))),
        siblings: [...sib.full, ...sib.half], spouses: partners,
        cousins: byBirth(D.parents(p).flatMap(par => { const s = D.siblings(par); return [...s.full, ...s.half]; }).flatMap(x => D.children(x))),
      }[key];
      const word = { parents: 'parents', grandparents: 'grandparents', children: 'children', grandchildren: 'grandchildren', siblings: 'brothers and sisters', spouses: 'spouses or partners', cousins: 'first cousins' }[key];
      if (!list.length) return { html: `<p>No ${word} of <strong>${nm}</strong> are recorded.</p>`, people: [p.id] };
      const half = key === 'siblings' && sib.half.length ? ` (${sib.half.length} half)` : '';
      return { html: `<p><strong>${nm}</strong> has ${list.length} recorded ${word}${half}:</p>`, people: list.map(x => x.id), list: true };
    }
    // when / where
    if (/\bwhen\b/.test(n) && /\b(born|birth)\b/.test(n)) return { html: `<p><strong>${nm}</strong> was born <strong>${esc(p.birth?.text || 'on a date not yet recorded')}</strong>.</p>`, people: [p.id] };
    if (/\bwhen\b/.test(n) && /\b(die|died|death|pass|passed)\b/.test(n)) {
      const t = p.death?.text ? `died <strong>${esc(p.death.text)}</strong>` : p.living_status ? 'is living, or no death is recorded' : 'has no death date recorded';
      return { html: `<p><strong>${nm}</strong> ${t}.</p>`, people: [p.id] };
    }
    if (/\bwhere\b/.test(n) && /\b(born|live|lived|die|died|buried|from)\b/.test(n)) {
      const kw = /\bborn\b/.test(n) ? /\bborn\b|\bbirth\b/i : /\b(die|died)\b/.test(n) ? /\bdied\b|\bdeath\b/i : /\bburied\b/.test(n) ? /\bburied\b|\bcemetery\b/i : null;
      const facts = kw ? (p.milestones || []).filter(m => kw.test(m)) : [];
      const places = p.locations || [];
      if (!facts.length && !places.length) return { html: `<p>No places are recorded for <strong>${nm}</strong> yet.</p>`, people: [p.id] };
      return { html: `${facts.length ? `<ul>${facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}${places.length ? `<p>Places recorded for <strong>${nm}</strong>: ${places.map(esc).join(' · ')}</p>` : ''}`, people: [p.id] };
    }
    // oldest / earliest ancestor
    if (/\b(oldest|earliest|furthest|farthest|first)\b.*\bancestors?\b/.test(n)) {
      const seen = new Set(); let gen = [p]; const all = [];
      while (gen.length) { gen = gen.flatMap(x => D.parents(x)).filter(x => !seen.has(x.id) && seen.add(x.id)); all.push(...gen); }
      const dated = all.filter(x => x.birth?.year).sort((a, b) => a.birth.year - b.birth.year);
      if (!dated.length) return { html: `<p>No dated ancestors of <strong>${nm}</strong> are recorded.</p>`, people: [p.id] };
      return { html: `<p>The earliest-born recorded ancestors of <strong>${nm}</strong> (${all.length} ancestors in all):</p>`, people: dated.slice(0, 5).map(x => x.id), list: true };
    }
    // how many ancestors / descendants
    if (/\bhow many\b/.test(n) && /\b(ancestors?|descendants?)\b/.test(n)) {
      const up = /\bancestors?\b/.test(n);
      const seen = new Set(); let gen = [p];
      while (gen.length) { gen = gen.flatMap(x => up ? D.parents(x) : D.children(x)).filter(x => !seen.has(x.id) && seen.add(x.id)); }
      return { html: `<p><strong>${seen.size}</strong> ${up ? 'ancestors' : 'descendants'} of <strong>${nm}</strong> are recorded.</p>`, people: [p.id] };
    }
  }

  // lists across the whole tree: born / died / lived in, before, after
  const m = n.match(/\b(born|died|lived|buried|from)\s+(in|before|after|near|at)\s+(.+)$/);
  if (m && !named.length) {
    const [, verb, prep, rest] = m;
    const year = (rest.match(/\b(1[5-9]\d\d|20\d\d)\b/) || [])[1];
    const place = rest.replace(/\b(1[5-9]\d\d|20\d\d)s?\b/, '').replace(/\b(county|the|state of)\b/g, ' ').trim();
    let hits = [];
    for (const x of D.people.values()) {
      if (x.dna_match) continue;
      if (year && prep !== 'in') {
        const y = verb === 'died' ? x.death?.year : x.birth?.year;
        if (y && (prep === 'before' ? y < +year : y > +year)) hits.push(x);
      } else if (year && prep === 'in') {
        if ((verb === 'died' ? x.death?.year : x.birth?.year) === +year) hits.push(x);
      } else if (place.length >= 3) {
        const re = new RegExp(`\\b${place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        const kw = verb === 'born' ? /\bborn\b|\bbirth\b/i : verb === 'died' ? /\bdied\b|\bdeath\b/i : verb === 'buried' ? /\bburied\b|\bcemetery\b/i : null;
        if (!kw) { if (re.test(norm((x.locations || []).join(' | ')))) hits.push(x); continue; }
        // a birth (death, burial) is "recorded there" only when one sentence names both the event and the place
        const sentences = [...(x.milestones || []), ...(x.notes || [])].flatMap(t => String(t).split(/(?<=[.;])\s+/));
        if (sentences.some(t => kw.test(t) && re.test(norm(t)))) hits.push(x);
        else if (re.test(norm((x.locations || []).join(' | ')))) (x._alsoLinked = true, hits.push(x));
      }
    }
    const inView = new Set(sel.ids);
    const title = s => s.replace(/\b\w/g, c => c.toUpperCase());
    const what = `${{ born: 'born', died: 'having died', buried: 'buried', lived: 'living', from: 'coming from' }[verb]} ${verb === 'from' ? '' : prep + ' '}${esc(year || title(place))}${verb === 'lived' ? ' at some point' : ''}`;
    const strong = byBirth(hits.filter(h => !h._alsoLinked)), weak = byBirth(hits.filter(h => h._alsoLinked));
    hits.forEach(h => delete h._alsoLinked);
    if (!strong.length && !weak.length) return { html: `<p>No one in the records is recorded as ${what}.</p>` };
    const shown = strong.slice(0, 40);
    const mark = strong.some(h => inView.has(h.id)) ? ' (those in your current view are highlighted)' : '';
    let html = strong.length
      ? `<p><strong>${strong.length}</strong> ${strong.length === 1 ? 'person is' : 'people are'} recorded as ${what}${strong.length > shown.length ? `; the first ${shown.length} by birth` : ''}${mark}:</p>`
      : `<p>No one has a ${verb === 'born' ? 'birth' : verb === 'died' ? 'death' : 'burial'} recorded ${prep} ${esc(title(place))}.</p>`;
    const extra = weak.length ? `<p class="muted">Also linked to ${esc(title(place))}, with no ${verb === 'born' ? 'birthplace' : verb === 'died' ? 'place of death' : 'burial place'} recorded there: ${weak.slice(0, 30).map(x => esc(displayName(x))).join(', ')}${weak.length > 30 ? ` and ${weak.length - 30} more` : ''}.</p>` : '';
    return { html, people: shown.map(x => x.id), list: true, highlight: inView, after: extra };
  }
  return null;
}

// ── Plain search over the records, for "related records" ───────────────────
function recordSearch(D, q, limit = 8) {
  const terms = norm(q).split(' ').filter(t => t.length > 2 && !STOP.has(t));
  if (!terms.length) return [];
  const out = [];
  for (const p of D.people.values()) {
    const fields = [...(p.milestones || []), ...(p.notable_stories || []), ...(p.notes || []), ...(p.career || []), ...(p.locations || [])].map(x => typeof x === 'string' ? x : JSON.stringify(x));
    const name = norm([p.name, ...(p.aliases || [])].join(' '));
    let score = 0, snippet = '';
    for (const t of terms) {
      if (name.includes(t)) score += 3;
      const f = fields.find(x => norm(x).includes(t));
      if (f) { score += 1; snippet ||= f; }
    }
    if (p.dna_match) score -= 2;
    if (score >= Math.max(2, terms.length)) out.push({ p, score, snippet });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ── What the AI sees ─────────────────────────────────────────────────────────
function buildContext(D, sel, named) {
  const order = [];
  const add = id => { if (id && D.person(id) && !order.includes(id)) order.push(id); };
  named.forEach(add);
  add(sel.focus);
  for (const id of named) { const p = D.person(id); [...D.parents(p), ...D.partnerFamilies(p).map(f => D.partnerIn(f, p)).filter(Boolean), ...D.children(p)].forEach(q => add(q.id)); }
  sel.ids.forEach(add);
  const ref = id => { const q = D.person(id); return q ? `${displayName(q)} [${q.id}]` : null; };
  const listOf = arr => arr.map(q => ref(q.id)).filter(Boolean).join(', ');
  const lines = [];
  let used = 0;
  for (const [i, id] of order.entries()) {
    const p = D.person(id);
    const living = p.living_status === 'living' || p.living_status === 'assumed';
    const partners = D.partnerFamilies(p).map(f => D.partnerIn(f, p)).filter(Boolean);
    const sib = D.siblings(p);
    const parts = [`[${p.id}] ${displayName(p)}${p.name !== displayName(p) ? ` (full name: ${p.name})` : ''}`];
    if (living) parts.push('living (only names and relationships are shared)');
    else {
      if (p.aliases?.length) parts.push(`also known as: ${p.aliases.join('; ')}`);
      parts.push(`born: ${p.birth?.text || 'not recorded'}`, `died: ${p.death?.text || 'not recorded'}`);
    }
    if (p.dna_match) parts.push('known only from a DNA match list; relationship unconfirmed');
    const fam = [['parents', D.parents(p)], ['spouses/partners', partners], ['siblings', [...sib.full, ...sib.half]], ['children', D.children(p)]]
      .filter(([, a]) => a.length).map(([k, a]) => `${k}: ${listOf(a)}`);
    parts.push(...fam);
    if (!living) {
      if (p.locations?.length) parts.push(`places: ${p.locations.join('; ')}`);
      const cap = i < Math.max(3, named.length + 1) ? 2400 : 700;
      const extra = [
        ...(p.milestones || []).map(x => `milestone: ${x}`),
        ...(p.notable_stories || []).map(x => `story: ${typeof x === 'string' ? x : JSON.stringify(x)}`),
        ...(p.career || []).map(x => `career: ${x}`),
        ...(p.notes || []).map(x => `note: ${x}`),
      ].join('\n  ');
      if (extra) parts.push('\n  ' + (extra.length > cap ? extra.slice(0, cap) + ' …' : extra));
    }
    const block = parts.join('; ').replace(/; \n/g, '\n');
    if (used + block.length > CONTEXT_CHARS && lines.length) break;
    lines.push(block); used += block.length + 2;
  }
  return { text: lines.join('\n\n'), count: lines.length, total: order.length };
}

// ── The box and the answer card ──────────────────────────────────────────────
export class Ask {
  constructor(D, { getView, getMe, onPick, onSuggest }) {
    this.D = D; this.getView = getView; this.getMe = getMe; this.onPick = onPick; this.onSuggest = onSuggest;
    this.names = new NameIndex(D);
    this.el = document.createElement('div');
    this.el.id = 'ask-card';
    this.el.hidden = true;
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-label', 'Answer');
    document.body.appendChild(this.el);
    this.el.addEventListener('click', e => {
      if (e.target.closest('.ask-close')) return this.close();
      if (e.target.closest('.ask-suggest')) { this.close(); return this.onSuggest?.(this.sel?.focus || null); }
      const ex = e.target.closest('[data-q]');
      if (ex) return this.ask(ex.dataset.q);
      const c = e.target.closest('[data-id]');
      if (c) { this.onPick(c.dataset.id); return; }
      if (e.target.closest('.ask-ai')) this.askAI();
    });
    this.el.addEventListener('submit', e => { e.preventDefault(); const v = this.el.querySelector('.ask-again input').value; if (v.trim()) this.ask(v); });
    document.addEventListener('keydown', e => { if (!this.el.hidden && e.key === 'Escape') this.close(); });
    document.addEventListener('click', e => { if (!this.el.hidden && !this.el.contains(e.target) && !e.target.closest('.ask-box, #btn-ask, .chip, .card, [data-id]')) this.close(); });
  }

  close() { this.el.hidden = true; this.pending?.abort(); }

  /** An empty card with example questions (the header button on small screens). */
  openEmpty() {
    const { focusId, view, gens } = this.getView();
    this.sel = selection(this.D, focusId, view, gens);
    const p = focusId && this.D.person(focusId);
    const nm = p ? displayName(p) : null;
    const examples = [
      nm && `What do we know about ${nm}?`,
      nm && `Who were ${nm}’s parents?`,
      'Who was born in Tennessee?',
      nm && this.getMe() && this.getMe() !== focusId && `How am I related to ${nm}?`,
    ].filter(Boolean);
    this.frame('Ask a question', `<p class="muted">Ask about anyone in the family. Exact questions (relationships, parents, dates, places) are answered straight from the records; anything else is answered by an AI that reads only what is on screen.</p><div class="ask-examples">${examples.map(q => `<button class="ask-ex" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>${suggestEnabled() && this.onSuggest ? `<p class="muted ask-suggest-row">Know something the tree is missing? <button class="link-btn ask-suggest">Suggest an addition or correction</button></p>` : ''}`);
    this.el.querySelector('.ask-again input').focus();
  }

  chip(id, cls = '') {
    const p = this.D.person(id); if (!p) return '';
    const span = lifespan(p, { short: true });
    return `<button class="chip${cls}" data-id="${p.id}" style="--branch:${this.D.color(p)}"><span class="chip-name">${esc(displayName(p))}</span>${span ? `<span class="chip-sub">${esc(span)}</span>` : ''}</button>`;
  }

  frame(q, body) {
    const s = this.sel;
    this.el.innerHTML = `
      <div class="ask-head"><div class="ask-q">${esc(q)}</div><button class="icon-btn ask-close" aria-label="Close">✕</button></div>
      <div class="ask-scope muted">Looking at: ${esc(s.label)}${s.ids.length ? ` · ${s.ids.length} people` : ''}</div>
      <div class="ask-body">${body}</div>
      <form class="ask-again"><input type="search" placeholder="Ask another question…" autocomplete="off" aria-label="Ask another question" /></form>`;
    this.el.hidden = false;
  }

  ask(q) {
    this.q = q.trim().slice(0, 500);
    const { focusId, view, gens } = this.getView();
    this.sel = selection(this.D, focusId, view, gens);
    this.named = this.names.find(this.q, new Set(this.sel.ids)).map(x => x.id);
    const local = localAnswer(this.D, this.names.find(this.q, new Set(this.sel.ids)), this.q, this.sel, this.getMe());
    if (local) {
      const chips = (local.people || []).map(id => this.chip(id, local.highlight?.has(id) ? ' rel-anc' : '')).join(local.path ? '<span class="rel-arrow">›</span>' : '');
      const shared = local.ancestors?.length ? `<p class="muted">Nearest shared ancestor${local.ancestors.length > 1 ? 's' : ''}: ${local.ancestors.map(id => esc(displayName(this.D.person(id)))).join(' and ')}</p>` : '';
      const more = askEnabled() && local.people?.length ? `<button class="link-btn ask-ai">Ask the AI for more detail</button>` : '';
      this.frame(this.q, `<div class="ask-answer exact">${local.html}</div>${chips ? `<div class="chips${local.path ? ' rel-path' : ''}">${chips}</div>` : ''}${shared}${local.after || ''}<p class="ask-foot muted"><span class="ask-badge">From the records</span> ${more}</p>`);
    } else if (askEnabled()) {
      this.askAI();
    } else {
      this.frame(this.q, this.related() || '<p class="muted">No matching records found.</p>');
    }
  }

  related() {
    const hits = recordSearch(this.D, this.q);
    if (!hits.length) return '';
    return `<div class="ask-related"><h3>Records that mention this</h3>${hits.map(h => `<div class="ask-hit">${this.chip(h.p.id)}${h.snippet ? `<div class="ask-snip muted">${esc(h.snippet.length > 180 ? h.snippet.slice(0, 180) + '…' : h.snippet)}</div>` : ''}</div>`).join('')}</div>`;
  }

  async askAI() {
    const ctx = buildContext(this.D, this.sel, this.named);
    this.frame(this.q, `<div class="ask-answer"><p class="ask-thinking">Reading ${ctx.count} ${ctx.count === 1 ? 'record' : 'records'}…</p></div>${this.related()}`);
    this.pending?.abort();
    const ctl = this.pending = new AbortController();
    try {
      const res = await fetch(ASK.endpoint, {
        method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: this.q, scope: this.sel.label, context: ctx.text }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'The AI could not answer just now.');
      const body = this.renderAnswer(out.answer);
      const trimmed = ctx.count < ctx.total ? ` (the ${ctx.count} closest of ${ctx.total})` : '';
      this.el.querySelector('.ask-answer').outerHTML = `<div class="ask-answer ai">${body}</div><p class="ask-foot muted"><span class="ask-badge ai">AI answer</span> Written by an AI from ${ctx.count} records${trimmed}. Check the linked people before relying on it.</p>`;
    } catch (err) {
      if (err.name === 'AbortError') return;
      const a = this.el.querySelector('.ask-answer');
      if (a) a.innerHTML = `<p class="bad">${esc(err.message)}</p>${this.el.querySelector('.ask-related') ? '' : '<p class="muted">No matching records found either.</p>'}`;
    }
  }

  /** The AI's text → safe HTML: paragraphs, "- " lists, **bold**, and [id] → chips. */
  renderAnswer(text) {
    // "Ellen Rogers Ball [ball_ellen_rogers]" → one link; the name before the id is dropped
    const D = this.D;
    let raw = '';
    for (const part of String(text || '').split(/(\[[a-z0-9_-]+\])/gi)) {
      const id = (part.match(/^\[([a-z0-9_-]+)\]$/i) || [])[1];
      if (!id) { raw += part; continue; }
      const p = D.person(id);
      if (!p) continue;
      const names = [displayName(p), p.name, p.name.replace(/\s*\([^)]*\)/g, ''), ...(p.aliases || []), ...nameVariants(p)]
        .filter(Boolean).sort((a, b) => b.length - a.length);
      const tail = raw.replace(/\s+$/, '');
      let cut = null, poss = '';
      for (const nm of names) {
        for (const [pre, post] of [['**', '**'], ['', '']]) {
          for (const s of ['', '’s', "'s"]) {
            const cand = (pre + nm + post + s).toLowerCase();
            if (tail.toLowerCase().endsWith(cand) && (tail.length === cand.length || !/[a-z0-9]/i.test(tail[tail.length - cand.length - 1]))) { cut = cand.length; poss = s; break; }
          }
          if (cut) break;
        }
        if (cut) break;
      }
      if (cut) raw = tail.slice(0, tail.length - cut);
      raw += `\u0000${id}\u0000${poss}`;
    }
    const inline = s => esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\u0000([a-z0-9_-]+)\u0000/gi, (m, id) => this.chip(id, ' inline'));
    const blocks = raw.trim().split(/\n\s*\n/);
    return blocks.map(b => {
      const lines = b.split('\n').filter(l => l.trim());
      if (lines.length && lines.every(l => /^\s*([-*•]|\d+\.)\s+/.test(l))) return `<ul>${lines.map(l => `<li>${inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ''))}</li>`).join('')}</ul>`;
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    }).join('') || '<p class="muted">No answer came back.</p>';
  }
}
