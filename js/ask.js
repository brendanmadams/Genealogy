// "Ask a question": answers questions about the family records.
// 1. Exact answers first: relationships, family members, dates, places and
//    lists are computed straight from the data, so they cannot be wrong
//    about what the site records.
// 2. Anything else goes to the AI on the Worker (worker/, POST /ask), which
//    sees only the records for the current selection (the chart on screen)
//    plus anyone named in the question, and must answer from them alone.
import { displayName, lifespan, byBirth } from './data.js';
import { relate, bloodDistance } from './relate.js';
import { ASK } from './config.js';
import { suggestEnabled } from './suggest.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[“”"]/g, ' ').replace(/[’']s\b/g, '').replace(/[’']/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set('a an and are as at be by did do does for from had has have he her his how i in is it its me my of on or our she that the their them there they this to was we were what when where which who whom whose why with you your about any tell know anything much many please'.split(' '));
const CONTEXT_CHARS = 24000;
// words too common in the records to help find the right ones
const SEARCH_STOP = new Set('family families time times people person life lived live living years year ever known records record side line spent'.split(' '));

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
  find(text, scope = new Set(), focus = null) {
    const words = norm(text).split(' ');
    const caps = new Set((String(text).match(/\b[A-Z][a-z’']+/g) || []).map(norm));
    const found = [];
    for (let i = 0; i < words.length;) {
      let hit = null;
      for (let n = Math.min(this.maxWords, words.length - i); n >= 1 && !hit; n--) {
        const phrase = words.slice(i, i + n).join(' ');
        if (n === 1 && (STOP.has(phrase) || phrase.length < 3)) continue;
        const ids = this.map.get(phrase);
        if (!ids) continue;
        const pick = this.best([...ids], scope, n === 1, caps.has(phrase), focus);
        if (pick) hit = { id: pick.id, n, text: phrase, of: pick.of };
      }
      if (hit) { if (!found.some(f => f.id === hit.id)) found.push(hit); i += hit.n; } else i++;
    }
    return found;
  }
  /** → { id, of } where `of` is how many family members share the name (0 when unambiguous). */
  best(ids, scope, single, capitalized, focus) {
    const D = this.D;
    const rank = id => { const p = D.person(id); return (scope.has(id) ? 8 : 0) + (p.connected ? 4 : 0) + (p.dna_match ? -6 : 0) + (p.birth?.year ? 1 : 0); };
    const sorted = ids.sort((a, b) => rank(b) - rank(a));
    if (!single) return { id: sorted[0], of: 0 };
    // a bare first name: one person in view, or one person overall …
    const inScope = sorted.filter(id => scope.has(id));
    if (inScope.length === 1) return { id: inScope[0], of: 0 };
    const family = sorted.filter(id => !D.person(id).dna_match);
    if (family.length === 1) return { id: family[0], of: 0 };
    // … or, when several share it and it was written as a name ("Ellen"), the closest relative of the person on screen
    if (!capitalized || !family.length) return null;
    const dist = id => { if (!focus) return 99; if (id === focus) return 0; const bd = bloodDistance(D, focus, id); return bd ? bd.a + bd.b : 99; };
    const closest = family.map(id => [id, dist(id), rank(id)]).sort((a, b) => a[1] - b[1] || b[2] - a[2])[0];
    return { id: closest[0], of: family.length };
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
const US_STATES = { alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY' };
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A test for "this text mentions the place". A US state matches "Lynden, Washington",
 *  "…, WA" or "in Washington", but not Washington County or Washington, D.C.; and
 *  Virginia does not match West Virginia. */
function placeTest(place) {
  const abbr = US_STATES[place];
  if (abbr) {
    const full = new RegExp(`(?:^|,\\s*|\\bin\\s+|\\bstate of\\s+|\\()(?<!\\b(?:west|new|north|south)\\s)${reEsc(place)}(?!\\s+(?:county|co\\b|d\\.?\\s?c\\b|city\\b))(?=\\s*$|\\s*[,;.()]|\\s+(?:state|territory|usa|us)\\b)`, 'i');
    const short = new RegExp(`,\\s*${abbr}\\b`);
    return s => full.test(String(s)) || short.test(String(s));
  }
  const re = new RegExp(`\\b${reEsc(place)}\\b`);
  return s => re.test(norm(s));
}

// relationship words → generations up from the person (a) and down to the relative (b)
const ORDN = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6 };
const REMOVED = { once: 1, twice: 2, thrice: 3, 'three times': 3, 'four times': 4 };
const KIN = { parent: 'up', parents: 'up', father: 'up', fathers: 'up', mother: 'up', mothers: 'up', child: 'down', children: 'down', kid: 'down', kids: 'down', son: 'down', sons: 'down', daughter: 'down', daughters: 'down', aunt: 'au', aunts: 'au', uncle: 'au', uncles: 'au', niece: 'nn', nieces: 'nn', nephew: 'nn', nephews: 'nn', sibling: 'sib', siblings: 'sib', brother: 'sib', brothers: 'sib', sister: 'sib', sisters: 'sib' };
const FEM = /^(mothers?|daughters?|aunts?|nieces?|sisters?)$/, MASC = /^(fathers?|sons?|uncles?|nephews?|brothers?)$/;
const KIN_RE = /\b((?:great\s*-?\s*|\d+\s*x\s*great\s*-?\s*)*)(grand\s*-?\s*)?(parents?|fathers?|mothers?|children|kids?|sons?|daughters?|aunts?|uncles?|nieces?|nephews?|siblings?|brothers?|sisters?)\b/g;

function relRequest(n) {
  const c = n.match(/\b(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th)?\s*cousins?(?:\s+(once|twice|thrice|three times|four times)\s+removed)?\b/);
  if (c) {
    const deg = ORDN[c[1]] || 1, k = REMOVED[c[2]] || 0;
    return { phrase: `${c[1] || 'first'} cousins${k ? ` ${c[2]} removed` : ''}`, pairs: k ? [[deg + 1, deg + 1 + k], [deg + 1 + k, deg + 1]] : [[deg + 1, deg + 1]], sex: null };
  }
  const all = [...n.matchAll(KIN_RE)];
  if (!all.length) return null;
  const m = all[0];
  const x = (m[1].match(/(\d+)\s*x/) || [])[1];
  const g = x ? +x : (m[1].match(/great/g) || []).length;
  const grand = m[2] || g ? 1 : 0;
  const kind = KIN[m[3]];
  const sexes = new Set(all.map(k => FEM.test(k[3]) ? 'F' : MASC.test(k[3]) ? 'M' : 'any'));
  const sex = sexes.size === 1 && !sexes.has('any') ? [...sexes][0] : null;
  const pair = { up: [1 + grand + g, 0], down: [0, 1 + grand + g], au: [2 + g + (m[2] ? 1 : 0), 1], nn: [1, 2 + g + (m[2] ? 1 : 0)], sib: [1, 1] }[kind];
  return { phrase: all.map(k => k[0].trim()).join(' and '), pairs: [pair], sex, kind };
}

/** Everyone whose closest blood relationship to p is one of the (a, b) pairs; id → half? */
function relativesOf(D, p, pairs) {
  const out = new Map();
  const anc = [[p.id]];
  for (let d = 1; d <= Math.max(...pairs.map(x => x[0])); d++) anc.push([...new Set(anc[d - 1].flatMap(id => D.person(id)?.parents || []))].filter(id => D.person(id)));
  for (const [a, b] of pairs) for (const top of anc[a] || []) {
    let level = [top];
    for (let d = 0; d < b; d++) level = [...new Set(level.flatMap(id => D.person(id)?.children || []))].filter(id => D.person(id));
    for (const id of level) {
      if (id === p.id || out.has(id)) continue;
      const bd = bloodDistance(D, p.id, id);
      if (bd && bd.a === a && bd.b === b) out.set(id, bd.half);
    }
  }
  return out;
}

function localAnswer(D, names, q, sel, meId) {
  const n = norm(q);
  const who = id => D.person(id);
  const named = names.map(x => x.id);
  const iAsk = /\b(i|me|my|am i|mine)\b/.test(n);

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

  // lists across the whole tree: born / died / lived in, before, after. A place wins over a
  // name here ("who lived in Washington" is about the state, not Washington Baker).
  const m = n.match(/\b(born|died|lived|live|living|buried|from)\s+(in|before|after|near|at)\s+(.+)$/);
  if (m) {
    const verb = m[1] === 'live' || m[1] === 'living' ? 'lived' : m[1], prep = m[2], rest = m[3];
    const year = (rest.match(/\b(1[5-9]\d\d|20\d\d)\b/) || [])[1];
    const place = rest.replace(/\b(1[5-9]\d\d|20\d\d)s?\b/, ' ').replace(/\b(the|state|state of|usa|us)\b/g, ' ').replace(/\s+/g, ' ').trim();
    const known = place.length >= 3 && (US_STATES[place] || [...D.people.values()].some(x => (x.locations || []).some(l => norm(l).includes(place))));
    if (year || known || !named.length) return placeList(D, sel, verb, prep, year, place);
  }

  // whose question is it: "my" → you; a name → them; otherwise the person on screen
  let subject = named[0] || null, youNote = '';
  if (!subject && iAsk) {
    if (meId) subject = meId;
    else if (sel.focus) { subject = sel.focus; youNote = `<p class="muted">Answering for ${esc(displayName(who(sel.focus)))}, the person on screen. To make “my” mean you, open your own entry and press <strong>This is me</strong>.</p>`; }
  }
  if (!subject) subject = sel.focus;
  const p = subject && who(subject);
  if (!p) return null;
  const you = subject === meId && iAsk;
  const nm = esc(displayName(p));
  const has = you ? 'You have' : `<strong>${nm}</strong> has`;

  // when did they marry
  if (/\bwhen\b/.test(n) && /\b(marry|married|marriage|wed|wedding)\b/.test(n)) {
    const fams = D.partnerFamilies(p).filter(f => D.partnerIn(f, p));
    if (!fams.length) return { html: `<p>No marriage is recorded for <strong>${nm}</strong>.</p>`, people: [p.id] };
    return { html: `<ul>${fams.map(f => `<li>${nm} and ${esc(displayName(D.partnerIn(f, p)))}: ${f.marriage ? `married <strong>${esc(f.marriage)}</strong>` : 'marriage date not recorded'}</li>`).join('')}</ul>`, people: [p.id, ...fams.map(f => D.partnerIn(f, p).id)], list: true };
  }
  // when / where
  if (/\bwhen\b/.test(n) && /\b(born|birth)\b/.test(n)) return { html: `<p><strong>${nm}</strong> was born <strong>${esc(p.birth?.text || 'on a date not yet recorded')}</strong>.</p>`, people: [p.id] };
  if (/\bwhen\b/.test(n) && /\b(die|died|death|pass|passed)\b/.test(n)) {
    const t = p.death?.text ? `died <strong>${esc(p.death.text)}</strong>` : p.living_status ? 'is living, or no death is recorded' : 'has no death date recorded';
    return { html: `<p><strong>${nm}</strong> ${t}.</p>`, people: [p.id] };
  }
  if (/\bwhere\b/.test(n) && /\b(born|live|lived|die|died|buried|from)\b/.test(n)) {
    const kw = /\bborn\b/.test(n) ? /\bborn\b|\bbirth\b/i : /\b(die|died)\b/.test(n) ? /\bdied\b|\bdeath\b/i : /\bburied\b/.test(n) ? /\bburied\b|\bcemetery\b/i : null;
    const facts = kw ? (p.milestones || []).filter(t => kw.test(t)) : [];
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
  // spouses
  if (/\b(spouses?|wife|wives|husbands?|married to|partners?)\b/.test(n)) {
    const partners = D.partnerFamilies(p).map(f => D.partnerIn(f, p)).filter(Boolean);
    if (!partners.length) return { html: `${youNote}<p>No spouse or partner of <strong>${nm}</strong> is recorded.</p>`, people: [p.id] };
    return { html: `${youNote}<p>${has} ${partners.length} recorded ${partners.length === 1 ? 'spouse or partner' : 'spouses or partners'}:</p>`, people: partners.map(x => x.id), list: true };
  }
  // any blood relationship: parents, great-grandparents, aunts, nieces, second cousins once removed…
  const req = relRequest(n);
  if (req) {
    const found = relativesOf(D, p, req.pairs);
    let ids = [...found.keys()].filter(id => !req.sex || who(id).sex === req.sex);
    ids = byBirth(ids.map(who)).map(x => x.id);
    if (!ids.length) return { html: `${youNote}<p>No ${esc(req.phrase)} of ${you ? 'yours' : `<strong>${nm}</strong>`} are recorded.</p>`, people: you ? [] : [p.id] };
    const halves = ids.filter(id => found.get(id)).length;
    const shown = ids.slice(0, 60);
    return { html: `${youNote}<p>${has} <strong>${ids.length}</strong> recorded ${esc(req.phrase)}${halves ? ` (${halves} of them half relations)` : ''}${ids.length > shown.length ? `; the first ${shown.length} by birth` : ''}:</p>`, people: shown, list: true };
  }
  return null;
}

function placeList(D, sel, verb, prep, year, place) {
  const test = place.length >= 3 ? placeTest(place) : null;
  const kw = verb === 'born' ? /\bborn\b/i : verb === 'died' ? /\bdied\b/i : verb === 'buried' ? /\bburied\b|\bcemetery\b/i : null;
  // "her son was born in…" or "his father's birthplace…" is about someone else
  const other = /\b(sons?|daughters?|child|children|brothers?|sisters?|father|mother|parents?|wife|husband|grand\w+)\b[^;]*\b(born|died|buried)\b/i;
  const strong = [], weak = [];
  for (const x of D.people.values()) {
    if (x.dna_match) continue;
    if (year) {
      const y = verb === 'died' ? x.death?.year : x.birth?.year;
      if (y && (prep === 'before' ? y < +year : prep === 'after' ? y > +year : y === +year)) strong.push(x);
      continue;
    }
    if (!test) continue;
    const inPlaces = (x.locations || []).some(test);
    if (!kw) { if (inPlaces) strong.push(x); continue; }
    // a birth (death, burial) is "recorded there" only when one sentence names both the event and the place
    // split into sentences, but not at initials ("Samuel G. Davis") or abbreviations ("Co.", "St.")
    const sentences = [...(x.milestones || []), ...(x.notes || [])].flatMap(t => String(t).split(/(?<!\b(?:[A-Z]|Co|St|Mt|Jr|Sr|Dr|Mr|Mrs|No|Rev|Capt|Lt|Col|Gen)\.)(?<=[.;])\s+/));
    if (sentences.some(t => kw.test(t) && !other.test(t) && test(t))) strong.push(x);
    else if (inPlaces) weak.push(x);
  }
  const inView = new Set(sel.ids);
  const title = s => s.replace(/\b\w/g, c => c.toUpperCase());
  const where = esc(year || title(place));
  const what = `${{ born: 'born', died: 'having died', buried: 'buried', lived: 'living', from: 'coming from' }[verb]} ${verb === 'from' ? '' : prep + ' '}${where}${verb === 'lived' ? ' at some point' : ''}`;
  const s = byBirth(strong), w = byBirth(weak);
  if (!s.length && !w.length) return { html: `<p>No one in the records is recorded as ${what}.</p>`, place: true };
  const shown = s.slice(0, 60);
  const mark = s.some(h => inView.has(h.id)) ? ' (those in your current view are highlighted)' : '';
  const html = s.length
    ? `<p><strong>${s.length}</strong> ${s.length === 1 ? 'person is' : 'people are'} recorded as ${what}${s.length > shown.length ? `; the first ${shown.length} by birth` : ''}${mark}:</p>`
    : `<p>No one has a ${verb === 'born' ? 'birth' : verb === 'died' ? 'death' : 'burial'} recorded ${prep} ${where}.</p>`;
  const extra = w.length ? `<p class="muted">Also linked to ${where}, with no ${verb === 'born' ? 'birthplace' : verb === 'died' ? 'place of death' : 'burial place'} recorded there: ${w.slice(0, 30).map(x => esc(displayName(x))).join(', ')}${w.length > 30 ? ` and ${w.length - 30} more` : ''}.</p>` : '';
  return { html, people: shown.map(x => x.id), list: true, highlight: inView, after: extra, place: true };
}

// ── Plain search over the records, for "related records" ───────────────────
function recordSearch(D, q, limit = 8, named = []) {
  const terms = norm(q).split(' ').filter(t => t.length > 2 && !STOP.has(t) && !SEARCH_STOP.has(t));
  if (!terms.length) return [];
  const out = [];
  for (const p of D.people.values()) {
    const fields = [...(p.milestones || []), ...(p.notable_stories || []), ...(p.notes || []), ...(p.career || []), ...(p.locations || [])].map(x => typeof x === 'string' ? x : JSON.stringify(x));
    const name = norm([p.name, ...(p.aliases || [])].join(' '));
    let score = 0, snippet = '';
    for (const t of terms) {
      // a name only counts when the question names that person ("Washington" is not Washington Baker)
      if (named.includes(p.id) && name.includes(t)) score += 3;
      const f = fields.find(x => norm(x).includes(t));
      if (f) { score += 1; snippet ||= f; }
    }
    if (p.dna_match) score -= 2;
    if (score >= Math.min(2, terms.length)) out.push({ p, score, snippet });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ── What the AI sees ─────────────────────────────────────────────────────────
function buildContext(D, sel, named, extra = []) {
  const order = [];
  const add = id => { if (id && D.person(id) && !order.includes(id)) order.push(id); };
  named.forEach(add);
  add(sel.focus);
  for (const id of named) { const p = D.person(id); [...D.parents(p), ...D.partnerFamilies(p).map(f => D.partnerIn(f, p)).filter(Boolean), ...D.children(p)].forEach(q => add(q.id)); }
  sel.ids.forEach(add);
  extra.forEach(add);              // records that mention the question's words
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
    const found = this.names.find(this.q, new Set(this.sel.ids), this.sel.focus);
    this.named = found.map(x => x.id);
    const guess = found.filter(x => x.of > 1).map(x => `Several people are called “${esc(x.text.replace(/\b\w/g, c => c.toUpperCase()))}”; this answer uses <strong>${esc(displayName(this.D.person(x.id)))}</strong>. Use a fuller name to ask about someone else.`);
    const local = localAnswer(this.D, found, this.q, this.sel, this.getMe());
    if (local && guess.length && !local.place) local.html = `<p class="muted">${guess.join(' ')}</p>` + local.html;
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
    const hits = recordSearch(this.D, this.q, 8, this.named);
    if (!hits.length) return '';
    return `<div class="ask-related"><h3>Records that mention this</h3>${hits.map(h => `<div class="ask-hit">${this.chip(h.p.id)}${h.snippet ? `<div class="ask-snip muted">${esc(h.snippet.length > 180 ? h.snippet.slice(0, 180) + '…' : h.snippet)}</div>` : ''}</div>`).join('')}</div>`;
  }

  async askAI() {
    const ctx = buildContext(this.D, this.sel, this.named, recordSearch(this.D, this.q, 25, this.named).map(h => h.p.id));
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
