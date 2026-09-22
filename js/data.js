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
export function nameLines(p) {
  const name = p.name.trim();
  const m = name.match(/^(.*?)\s*(\(.*\))$/);      // trailing "(Allen)" → second line suffix
  const core = m ? m[1] : name, paren = m ? m[2] : '';
  const parts = core.split(/\s+/);
  if (parts.length === 1) return [core, paren];
  const last = parts.pop();
  return [parts.join(' '), (last + (paren ? ' ' + paren : ''))];
}
