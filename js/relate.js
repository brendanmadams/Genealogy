// "How are we related?": the relationship between two people, and the path.
// Words follow the described person's recorded sex ("aunt", "uncle"), and
// stay neutral ("aunt or uncle") when it is not recorded.

const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const ordinal = n => ORD[n] || `${n}th`;
const removed = n => n === 0 ? '' : n === 1 ? ' once removed' : n === 2 ? ' twice removed' : ` ${n} times removed`;
const greats = n => n <= 0 ? '' : n === 1 ? 'great-' : `${n}× great-`;

/** Neutral term → the word for a woman (F) or man (M); unchanged when sex is unknown. */
export function genderize(term, sex) {
  if (sex !== 'F' && sex !== 'M') return term;
  const f = sex === 'F';
  const inLaw = { parent: f ? 'mother' : 'father', child: f ? 'daughter' : 'son', sibling: f ? 'sister' : 'brother' };
  return term
    .replace(/step-parent$/, f ? 'stepmother' : 'stepfather')
    .replace(/(parent|child|sibling)-in-law$/, (m, r) => `${inLaw[r]}-in-law`)
    .replace(/aunt or uncle$/, f ? 'aunt' : 'uncle')
    .replace(/grandniece or grandnephew$/, f ? 'grandniece' : 'grandnephew')
    .replace(/niece or nephew$/, f ? 'niece' : 'nephew')
    .replace(/parent$/, f ? 'mother' : 'father')
    .replace(/child$/, f ? 'daughter' : 'son')
    .replace(/sibling$/, f ? 'sister' : 'brother')
    .replace(/spouse$/, f ? 'wife' : 'husband');
}
const sexOf = (D, id) => D.person(id)?.sex || null;
/** An unmarried couple (family.partnered) are "partners", not husband and wife. */
const partnered = (D, a, b) => !!D.partnerFamilies(D.person(a) || { families: [] }).find(f => f.partnered && f.partners.includes(b));
const spouseWord = (D, a, b) => partnered(D, a, b) ? 'partner' : genderize('spouse', sexOf(D, b));
const ANCESTOR = /^(?:\d+× )?(?:great-)?(?:grand)?parent$/;

/** Ancestors of id with their distance and the child through whom each is reached. */
function ancestors(D, id) {
  const out = new Map([[id, { dist: 0, via: null }]]);
  let frontier = [id];
  for (let d = 1; frontier.length && d < 60; d++) {
    const next = [];
    for (const x of frontier) for (const par of D.person(x)?.parents || []) {
      if (!out.has(par) && D.person(par)) { out.set(par, { dist: d, via: x }); next.push(par); }
    }
    frontier = next;
  }
  return out;
}

function partners(D, id) {
  const p = D.person(id);
  if (!p) return [];
  const ids = new Set(p.spouses || []);
  for (const f of D.partnerFamilies(p)) for (const x of f.partners) if (x !== id) ids.add(x);
  return [...ids].filter(x => D.person(x));
}

/** Words for "B is A's ___" given generations up from A (a) and from B (b) to the shared ancestor. */
function bloodWords(a, b, half) {
  const h = half ? 'half-' : '';
  if (a === 0 && b === 0) return 'same person';
  if (a === 0) return b === 1 ? 'child' : b === 2 ? 'grandchild' : `${greats(b - 2)}grandchild`;
  if (b === 0) return a === 1 ? 'parent' : a === 2 ? 'grandparent' : `${greats(a - 2)}grandparent`;
  if (a === 1 && b === 1) return `${h}sibling`;
  if (a === 1) return b === 2 ? `${h}niece or nephew` : b === 3 ? `${h}grandniece or grandnephew` : `${h}${greats(b - 3)}grandniece or grandnephew`;
  if (b === 1) return a === 2 ? `${h}aunt or uncle` : `${h}${greats(a - 2)}aunt or uncle`;
  return `${h}${ordinal(Math.min(a, b) - 1)} cousin${removed(Math.abs(a - b))}`;
}

/** Closest blood relationship, or null. Path runs from A up to the ancestor and down to B. */
function blood(D, aId, bId) {
  const A = ancestors(D, aId), B = ancestors(D, bId);
  let best = null;
  for (const [id, x] of A) {
    const y = B.get(id);
    if (!y) continue;
    const score = x.dist + y.dist;
    if (!best || score < best.score || (score === best.score && Math.max(x.dist, y.dist) < Math.max(best.a, best.b))) best = { id, a: x.dist, b: y.dist, score };
  }
  if (!best) return null;
  const chain = (M, from) => { const out = []; for (let x = from; x; x = M.get(x)?.via) out.push(x); return out; };
  // chain(A, ancestor) runs ancestor → … → A; reverse it so the path starts at A
  const up = chain(A, best.id).reverse(), down = chain(B, best.id).slice(1);
  // half relationship: the two lines come down from the ancestor through different partners
  let half = false, couple = [best.id];
  if (best.a >= 1 && best.b >= 1) {
    const other = partners(D, best.id).find(p => A.get(p)?.dist === best.a && B.get(p)?.dist === best.b);
    if (other) couple.push(other);
    else {
      const ca = up[up.length - 2], cb = down[0];                 // the ancestor's children on each line
      const op = c => (D.person(c)?.parents || []).find(x => x !== best.id);
      if (ca && cb && ca !== cb && op(ca) && op(cb) && op(ca) !== op(cb)) half = true;
    }
  }
  const neutral = bloodWords(best.a, best.b, half);
  return { neutral, words: genderize(neutral, sexOf(D, bId)), a: best.a, b: best.b, score: best.score, path: [...up, ...down], ancestors: couple };
}

/** Generations from A (a) and from B (b) up to their closest shared ancestor, or null (used by "Ask"). */
export function bloodDistance(D, aId, bId) {
  const r = blood(D, aId, bId);
  return r ? { a: r.a, b: r.b, half: /^half-/.test(r.neutral) } : null;
}

/**
 * relate(D, aId, bId) → { text, path, ancestors, kind } describing B relative to A:
 * "B is A's <text>". kind is 'self', 'blood', 'marriage' or 'none'.
 */
export function relate(D, aId, bId) {
  if (aId === bId) return { kind: 'self', text: 'the same person', path: [aId], ancestors: [] };
  const direct = blood(D, aId, bId);
  if (direct) return { kind: 'blood', text: direct.words, path: direct.path, ancestors: direct.ancestors };

  const aP = partners(D, aId), bP = partners(D, bId), sB = sexOf(D, bId);
  if (aP.includes(bId)) return { kind: 'marriage', text: spouseWord(D, aId, bId), path: [aId, bId], ancestors: [] };
  const options = [];
  // B is married to (or the partner of) one of A's blood relatives; in-law and
  // step words are for marriages, so an unmarried partner is "sister's partner"
  for (const s of bP) {
    const r = blood(D, aId, s);
    if (!r) continue;
    const wed = !partnered(D, s, bId);
    const t = wed && r.a === 0 && r.b === 1 ? genderize('child-in-law', sB)
      : wed && r.a === 1 && r.b === 1 ? genderize('sibling-in-law', sB)
      : wed && ANCESTOR.test(r.neutral) ? genderize(`step-${r.neutral}`, sB)
      : `${r.words}’s ${spouseWord(D, s, bId)}`;
    options.push({ score: r.score, text: t, path: [...r.path, bId], ancestors: r.ancestors });
  }
  // B is a blood relative of A's spouse or partner
  for (const s of aP) {
    const r = blood(D, s, bId);
    if (!r) continue;
    const wed = !partnered(D, aId, s);
    const t = wed && r.a === 0 && r.b === 1 ? genderize('stepchild', sB)
      : wed && r.a === 1 && r.b === 0 ? genderize('parent-in-law', sB)
      : wed && r.a === 1 && r.b === 1 ? genderize('sibling-in-law', sB)
      : `${spouseWord(D, aId, s)}’s ${r.words}`;
    options.push({ score: r.score, text: t, path: [aId, ...r.path], ancestors: r.ancestors });
  }
  // B is married to a blood relative of A's spouse (e.g. a spouse's sibling's spouse)
  if (!options.length) for (const s of aP) for (const t of bP) {
    const r = blood(D, s, t);
    if (r) options.push({ score: r.score + 1, text: `${spouseWord(D, aId, s)}’s ${r.words}’s ${spouseWord(D, t, bId)}`, path: [aId, ...r.path, bId], ancestors: r.ancestors });
  }
  if (options.length) {
    const o = options.sort((x, y) => x.score - y.score)[0];
    return { kind: 'marriage', text: o.text, path: o.path, ancestors: o.ancestors };
  }
  // anything else: shortest path over parent, child and spouse links, told step by step
  // ("step-grandparent’s niece or nephew")
  const path = linkPath(D, aId, bId);
  if (!path) return { kind: 'none', text: 'no recorded relationship', path: [], ancestors: [] };
  return { kind: 'marriage', text: describePath(D, path), path, ancestors: [] };
}

/** A chain of parent, child and spouse links, told step by step: "brother’s wife’s grandniece". */
function describePath(D, path) {
  const parts = [];                  // [neutral word, the person it describes]
  let start = 0;
  for (let i = 1; i <= path.length; i++) {
    const hop = i < path.length && partners(D, path[i - 1]).includes(path[i]) && !(D.person(path[i]).parents || []).includes(path[i - 1]) && !(D.person(path[i - 1]).parents || []).includes(path[i]);
    if (i === path.length || hop) {
      if (i - 1 > start) parts.push([blood(D, path[start], path[i - 1])?.neutral || 'relative', path[i - 1]]);
      if (hop) parts.push([partnered(D, path[i - 1], path[i]) ? 'partner' : 'spouse', path[i]]);
      start = i;
    }
  }
  // an ancestor's spouse at the start is a step-relation: "step-grandmother"
  if (parts.length > 1 && ANCESTOR.test(parts[0][0]) && parts[1][0] === 'spouse') parts.splice(0, 2, [`step-${parts[0][0]}`, parts[1][1]]);
  // and a step-relation's child is a stepsibling or step-aunt: "step-great-aunt"
  if (parts.length > 1 && /^step-/.test(parts[0][0]) && parts[1][0] === 'child') {
    const t = parts[0][0] === 'step-parent' ? 'stepsibling' : parts[0][0].replace(/grandparent$/, 'aunt or uncle');
    parts.splice(0, 2, [t, parts[1][1]]);
  }
  return parts.map(([w, id]) => genderize(w, sexOf(D, id))).join('’s ');
}

const linked = (D, x) => { const p = D.person(x); return [...(p.parents || []), ...(p.children || []), ...partners(D, x)]; };

/** Shortest chain from A to B, never through a person in `avoid` or a link in `cut` ("x|y"). */
function linkPath(D, aId, bId, avoid = null, cut = null) {
  const prev = new Map([[aId, null]]);
  let q = [aId];
  while (q.length) {
    const next = [];
    for (const x of q) {
      for (const y of linked(D, x)) {
        if (prev.has(y) || !D.person(y) || avoid?.has(y) || cut?.has(`${x}|${y}`)) continue;
        prev.set(y, x);
        if (y === bId) { const out = []; for (let z = y; z; z = prev.get(z)) out.unshift(z); return out; }
        next.push(y);
      }
    }
    q = next;
  }
  return null;
}

/** The marriages a chain crosses, as a key: two chains that cross the same ones are the same route. */
function marriagesOn(D, path) {
  const hops = [];
  for (let i = 1; i < path.length; i++) {
    const [x, y] = [path[i - 1], path[i]];
    if (partners(D, x).includes(y) && !(D.person(y).parents || []).includes(x) && !(D.person(x).parents || []).includes(y)) hops.push([x, y].sort().join('~'));
  }
  return hops.sort().join(',');
}

/**
 * Other routes between A and B besides the closest one (relate's), e.g. a
 * second family marriage: [{ text, path }], B described relative to A, at most
 * `max`, shortest first. Each skips one person on the closest route (with the
 * other half of a couple when the route turns at them), and must cross a
 * different set of marriages.
 */
export function otherRoutes(D, aId, bId, max = 2, primary = relate(D, aId, bId)) {
  if (primary.kind === 'self' || primary.kind === 'none' || primary.path.length < 3) return [];
  // a direct line (grandparent, great-grandchild) needs no side routes
  if (primary.kind === 'blood' && (primary.ancestors.includes(aId) || primary.ancestors.includes(bId))) return [];
  const main = primary.path, seen = new Set([marriagesOn(D, main)]), out = [];
  for (let i = 1; i < main.length - 1; i++) {
    const v = main[i], avoid = new Set([v]);
    const kids = D.person(v)?.children || [];
    if (kids.includes(main[i - 1]) && kids.includes(main[i + 1])) partners(D, v).forEach(x => avoid.add(x));
    const path = linkPath(D, aId, bId, avoid);
    if (!path || path.length > 16) continue;
    const key = marriagesOn(D, path);
    if (!key || seen.has(key)) continue;           // blood-only, or the same marriages again
    seen.add(key);
    out.push({ text: describePath(D, path), path });
  }
  return out.sort((x, y) => x.path.length - y.path.length).slice(0, max);
}

/** "a first cousin" / "an aunt or uncle" / "the spouse" — for sentences. */
export function article(text) {
  if (/^(spouse|wife|husband|same person)/.test(text)) return `the ${text}`;
  return /^[aeiou]/i.test(text) ? `an ${text}` : `a ${text}`;
}
