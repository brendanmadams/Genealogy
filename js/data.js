// Loads data/family.json and indexes it for the app.
// Everything the views need to know about people and families lives here.

export async function loadFamily(url = 'data/family.json') {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return indexFamily(await res.json());
}

export function indexFamily(F) {
  const people = new Map(F.people.map(p => [p.id, p]));
  const families = new Map(F.families.map(f => [f.id, f]));
  const branches = new Map(F.branches.map(b => [b.key, b]));
  const media = new Map((F.media || []).map(m => [m.id, m]));
  const other = F.branches.find(b => b.key === 'other') || { key: 'other', label: 'Other', color: '#94a3b8' };

  const D = {
    meta: F.meta, people, families, branches, other,
    list: [...people.values()].sort((a, b) => sortName(a).localeCompare(sortName(b))),

    media,
    mediaFor: p => (p.media || []).map(id => media.get(id)).filter(Boolean),
    person: id => people.get(id) || null,
    family: id => families.get(id) || null,
    branch: p => branches.get(p?.branch) || other,
    color: p => (branches.get(p?.branch) || other).color,

    /** Families in which this person is a partner, spouses first, then the solo family. */
    partnerFamilies(p) {
      return (p.families || []).map(id => families.get(id)).filter(Boolean)
        .sort((a, b) => b.partners.length - a.partners.length);
    },
    /** The other partner in a two-partner family, or null. */
    partnerIn(fam, p) { return fam.partners.length === 2 ? people.get(fam.partners.find(x => x !== p.id)) : null; },
    parentFamily(p) { return p.parent_family ? families.get(p.parent_family) : null; },
    parents(p) { return (p.parents || []).map(id => people.get(id)).filter(Boolean); },
    /** Full siblings from the same family, plus half siblings via either parent. */
    siblings(p) {
      const full = (p.siblings || []).map(id => people.get(id)).filter(Boolean);
      const seen = new Set([p.id, ...full.map(s => s.id)]);
      const half = [];
      for (const parId of p.parents || []) {
        const par = people.get(parId);
        for (const fid of par?.families || []) {
          for (const cid of families.get(fid)?.children || []) {
            if (!seen.has(cid)) { seen.add(cid); half.push(people.get(cid)); }
          }
        }
      }
      return { full: byBirth(full), half: byBirth(half.filter(Boolean)) };
    },
    children(p) { return byBirth((p.children || []).map(id => people.get(id)).filter(Boolean)); },

    search(q, limit = 12) {
      q = q.trim().toLowerCase();
      if (!q) return [];
      const terms = q.split(/\s+/);
      const scored = [];
      for (const p of people.values()) {
        const hay = searchText(p);
        if (!terms.every(t => hay.includes(t))) continue;
        let score = 0;
        if (p.name.toLowerCase().startsWith(q)) score += 3;
        if (hay.startsWith(q)) score += 2;
        if (p.connected) score += 1;
        if (p.dna_match) score -= 10;          // low priority: always after family members
        scored.push([score, p]);
      }
      return scored.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name)).slice(0, limit).map(x => x[1]);
    },
  };
  return D;
}

const searchCache = new WeakMap();
function searchText(p) {
  let s = searchCache.get(p);
  if (!s) {
    s = [p.name, ...(p.aliases || []), ...(p.locations || []), p.birth?.year, p.death?.year]
      .filter(Boolean).join(' ').toLowerCase();
    searchCache.set(p, s);
  }
  return s;
}

/** Surname-first key: "Alberta Adams (Allen)" → "adams alberta". */
export function sortName(p) {
  const base = p.name.replace(/\s*\(.*?\)\s*/g, ' ').replace(/,?\s+(Jr\.?|Sr\.?|I|II|III|IV|#\d+)(?=\s|$)/g, '').trim();
  const parts = base.split(/\s+/).filter(w => !/^(col|dr|rev|mrs|mr)\.?$/i.test(w));
  if (parts.length < 2) return base.toLowerCase();
  return (parts[parts.length - 1] + ' ' + parts.slice(0, -1).join(' ')).toLowerCase();
}

export function byBirth(arr) {
  return arr.slice().sort((a, b) => (a.birth?.year ?? 9999) - (b.birth?.year ?? 9999));
}

/** "1866 – 1938", "b. 1925", "abt 1818 – 1903", "d. 1868", or "". */
export function lifespan(p, { short = false } = {}) {
  const b = fmtYear(p.birth, short), d = fmtYear(p.death, short);
  if (b && d) return `${b} – ${d}`;
  if (b) return `b. ${b}`;
  if (d) return `d. ${d}`;
  return '';
}
function fmtYear(dt, short) {
  if (!dt || !dt.year) return '';
  if (short) return String(dt.year);
  switch (dt.qualifier) {
    case 'about': return `abt ${dt.year}`;
    case 'before': return `bef ${dt.year}`;
    case 'after': return `aft ${dt.year}`;
    case 'range': return `c. ${dt.year}`;
    default: return String(dt.year);
  }
}

export function initials(p) {
  const parts = p.name.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(w => !/^(col|dr|rev)\.?$/i.test(w));
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** Two display lines for a card: given names / surname(s). */
export function nameLines(p) { return cardNameOptions(p)[0]; }

/**
 * Card-name candidates, best first. The renderer uses the first that fits:
 *   1. given / middle names + surname      ("Barbara" / "McKeldin Adams")
 *   2. given + middle initials / surname   ("Elaine D." / "Simons (Rhinehart)")
 * A record's card_name override is the only candidate.
 */
export function cardNameOptions(p) {
  if (Array.isArray(p.card_name) && p.card_name.length) return [[p.card_name[0] || '', p.card_name[1] || '']];
  const short = cardName(p);
  const long = cardName(p, { middlesWithSurname: true });
  return long[0] === short[0] && long[1] === short[1] ? [short] : [long, short];
}

/**
 * Short name for tree cards: [given, surname].
 *   given   = the name they went by (a middle name that is also an alias, or
 *             a quoted nickname), else the first name; other middle names
 *             become initials; a leading title (Col., Dr.) is kept
 *   surname = surname + suffix (Jr., Sr., IV, #1) + most recent married name
 * The full name stays in the details panel and the card's tooltip.
 */
const SUFFIX = /^(Jr\.?|Sr\.?|I|II|III|IV|V)$/;
const TITLE = /^(Col\.?|Dr\.?|Rev\.?|Capt\.?|Gen\.?|Lt\.?)$/i;
const PARTICLE = /^(van|von|de|del|della|der|du|la|le|st\.?|mc|o')$/i;
export function cardName(p, { middlesWithSurname = false } = {}) {
  let name = p.name.trim();
  // trailing "(…)": married name(s) or a label like #1; keep the last married name only
  let trail = '';
  const tm = name.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  if (tm) { name = tm[1]; trail = tm[2].trim(); }
  if (trail && !/^#\d+$/.test(trail)) trail = trail.split(/\s*[,/]\s*/).pop();
  // quoted nickname, and parenthetical alternates inside the name, e.g. "Magdalena (Margaret)"
  const nick = (name.match(/["“]([^"”]+)["”]/) || [])[1];
  name = name.replace(/["“][^"”]*["”]/g, ' ').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  const t = name.split(' ');
  const title = TITLE.test(t[0]) && t.length > 2 ? t.shift() : '';
  const suffix = t.length > 2 && SUFFIX.test(t[t.length - 1]) ? t.pop() : '';
  if (t.length === 1) return [[title, t[0]].filter(Boolean).join(' '), trail ? `(${trail})` : ''];
  // surname: last token, plus a lowercase particle before it ("van Fossen", "Della Selva")
  let si = t.length - 1;
  if (si > 1 && PARTICLE.test(t[si - 1])) si--;
  const surname = t.slice(si).join(' ');
  const givens = t.slice(0, si);
  const aliases = (p.aliases || []).map(a => a.toLowerCase());
  const wentBy = nick || givens.slice(1).find(g => aliases.some(a => a === g.toLowerCase() || a.startsWith(g.toLowerCase() + ' ')));
  let given, middles = '';
  if (wentBy) given = wentBy;
  else if (middlesWithSurname) { given = givens[0]; middles = givens.slice(1).join(' '); }
  else given = [givens[0], ...givens.slice(1).map(g => (g.length <= 2 && g.endsWith('.')) ? g : g[0].toUpperCase() + '.')].join(' ');
  const line2 = [middles, surname, suffix, trail ? `(${trail})` : ''].filter(Boolean).join(' ');
  return [[title, given].filter(Boolean).join(' '), line2];
}
