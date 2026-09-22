#!/usr/bin/env node
/**
 * Build the site data from the person records in data/people/.
 *
 *   node scripts/build.js            # build + report
 *   node scripts/build.js --check    # validate only, write nothing
 *
 * Outputs
 *   data/family.json   – people, family units, branches (the new data model)
 *   family-graph.js    – nodes/edges for the current page (deduplicated)
 *   family-canon.js    – the person records for the current page
 *
 * Model
 *   A *family* is one set of partners (one or two people) plus their children.
 *   Families are derived from the records: a child's father/mother pair, plus
 *   anyone who lists the child under `children`, forms the partner set; every
 *   spouse pair also gets a family even when childless. This needs no
 *   sex/gender field and copes with multiple marriages.
 *
 *   No person is "primary". Branches come from data/branches.json.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PEOPLE_DIR = path.join(ROOT, 'data', 'people');
const BRANCH_CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'branches.json'), 'utf8'));
const CHECK_ONLY = process.argv.includes('--check');

const errors = [];
const warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);

// ── Load ───────────────────────────────────────────────────────────────────
const people = new Map();
for (const f of fs.readdirSync(PEOPLE_DIR).filter(f => f.endsWith('.json')).sort()) {
  let p;
  try { p = JSON.parse(fs.readFileSync(path.join(PEOPLE_DIR, f), 'utf8')); }
  catch (e) { err(`${f}: invalid JSON (${e.message})`); continue; }
  if (!p.id) { err(`${f}: missing id`); continue; }
  if (p.id + '.json' !== f) warn(`${f}: file name does not match id "${p.id}"`);
  if (people.has(p.id)) err(`${f}: duplicate id "${p.id}"`);
  if (!p.name) warn(`${p.id}: missing name`);
  people.set(p.id, p);
}

// ── Normalise relationships ────────────────────────────────────────────────
const str = v => (typeof v === 'string' ? v.trim() : '');
const list = v => Array.isArray(v)
  ? [...new Set(v.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()))]
  : (str(v) ? [str(v)] : []);

const rel = new Map();
for (const p of people.values()) {
  const r = p.relationships || {};
  const spouses = [...new Set([...list(r.spouse), ...list(r._extra_spouses)])];
  rel.set(p.id, {
    father: str(r.father), mother: str(r.mother),
    spouses, children: list(r.children), siblings: list(r.siblings),
  });
}

// Drop references to people who do not exist (and report them).
for (const [id, r] of rel) {
  for (const k of ['father', 'mother']) {
    if (r[k] && !people.has(r[k])) { err(`${id}.${k} -> "${r[k]}" does not exist`); r[k] = ''; }
    if (r[k] === id) { err(`${id}.${k} refers to self`); r[k] = ''; }
  }
  for (const k of ['spouses', 'children', 'siblings']) {
    r[k] = r[k].filter(x => {
      if (!people.has(x)) { err(`${id}.${k} -> "${x}" does not exist`); return false; }
      if (x === id) { err(`${id}.${k} refers to self`); return false; }
      return true;
    });
  }
}

// Spouse symmetry.
for (const [id, r] of rel) for (const s of r.spouses) {
  const o = rel.get(s);
  if (!o.spouses.includes(id)) o.spouses.push(id);
}

// ── Parents of each child (father + mother + anyone listing them) ──────────
const parentsOf = new Map([...people.keys()].map(id => [id, new Set()]));
for (const [id, r] of rel) {
  if (r.father) parentsOf.get(id).add(r.father);
  if (r.mother) parentsOf.get(id).add(r.mother);
  for (const c of r.children) parentsOf.get(c).add(id);
}
for (const [id, ps] of parentsOf) {
  if (ps.size > 2) err(`${id} has ${ps.size} parents: ${[...ps].join(', ')}`);
  const r = rel.get(id);
  for (const p of ps) {
    if (p !== r.father && p !== r.mother && ps.size <= 2) {
      // The parent lists this child, but the child does not name the parent.
      // Legitimate (we may not know which slot), so note it as a warning only.
      warn(`${p} lists ${id} as child, but ${id} does not name ${p} as father or mother`);
    }
  }
}

// ── Dates ──────────────────────────────────────────────────────────────────
function parseDate(s) {
  s = str(s);
  if (!s) return { text: '', year: null, qualifier: null };
  const m = s.match(/\b(\d{4})\b/);
  const year = m ? Number(m[1]) : null;
  let qualifier = null;
  if (/\b(abt|about|circa|c\.)\b|~/i.test(s)) qualifier = 'about';
  else if (/\bbefore\b/i.test(s)) qualifier = 'before';
  else if (/\bafter\b/i.test(s)) qualifier = 'after';
  else if (/\bbetween\b|\d{4}\s*[-\/]\s*\d{2,4}/.test(s)) qualifier = 'range';
  if (!year && !/unknown/i.test(s)) warn(`unparseable date "${s}"`);
  return { text: s, year, qualifier };
}
const dates = new Map();
for (const p of people.values()) dates.set(p.id, { birth: parseDate(p.birth), death: parseDate(p.death) });

// Plausibility: parent must be 12–70 years older, and alive (or within a year) at the birth.
for (const [id, ps] of parentsOf) {
  const cb = dates.get(id).birth.year;
  if (!cb) continue;
  for (const p of ps) {
    const pb = dates.get(p).birth.year, pd = dates.get(p).death.year;
    if (pb && cb - pb < 12) warn(`${p} (b. ${pb}) is only ${cb - pb} years older than child ${id} (b. ${cb})`);
    if (pb && cb - pb > 70) warn(`${p} (b. ${pb}) is ${cb - pb} years older than child ${id} (b. ${cb})`);
    if (pd && cb > pd + 1) warn(`${p} (d. ${pd}) died before child ${id} was born (${cb})`);
  }
}

// ── Families ───────────────────────────────────────────────────────────────
const families = new Map();          // key -> family
const familiesOf = new Map([...people.keys()].map(id => [id, []]));
const famKey = ids => [...ids].sort().join('+');
function family(ids) {
  const key = famKey(ids);
  if (!families.has(key)) {
    const f = { id: 'F_' + key, partners: [...ids].sort(), children: [], marriage: null };
    families.set(key, f);
    for (const p of f.partners) familiesOf.get(p).push(f.id);
  }
  return families.get(key);
}
for (const [id, r] of rel) for (const s of r.spouses) if (id < s) family([id, s]);
for (const [id, ps] of parentsOf) if (ps.size && ps.size <= 2) family(ps).children.push(id);

// Marriage dates from milestones like "Married Jane Doe (m. 5 Sep 1888)".
const givenName = id => (str(people.get(id).name).replace(/^(col\.|dr\.|rev\.)\s+/i, '').split(/\s+/)[0] || '').toLowerCase();
for (const f of families.values()) {
  if (f.partners.length !== 2) continue;
  const [a, b] = f.partners;
  for (const [self, other] of [[a, b], [b, a]]) {
    for (const m of people.get(self).milestones || []) {
      const t = typeof m === 'string' ? m : (m.event || m.description || '');
      const mm = t.match(/married\s+(.+?)\s*\(m\.\s*([^)]+)\)/i);
      if (!mm) continue;
      const nameMatches = mm[1].toLowerCase().includes(givenName(other));
      const onlySpouse = rel.get(self).spouses.length === 1;
      if (nameMatches || onlySpouse) { f.marriage = f.marriage || mm[2].trim(); }
    }
  }
}

// Sort children by birth year (unknown last, then record order).
for (const f of families.values()) {
  f.children.sort((x, y) => (dates.get(x).birth.year ?? 9999) - (dates.get(y).birth.year ?? 9999));
}

// ── Branches ───────────────────────────────────────────────────────────────
const branches = BRANCH_CFG.branches;
const OTHER = BRANCH_CFG.other || { key: 'other', label: 'Other', color: '#94a3b8' };
const rootBranch = new Map();
for (const b of branches) for (const r of b.roots) {
  if (!people.has(r)) { err(`branches.json: root "${r}" of ${b.key} does not exist`); continue; }
  rootBranch.set(r, b.key);
}

// lineages: every line a person descends from (through families).
const lineages = new Map([...people.keys()].map(id => [id, new Set()]));
for (const [root, key] of rootBranch) {
  const seen = new Set();
  const stack = [root];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    lineages.get(id).add(key);
    for (const fid of familiesOf.get(id)) {
      const f = families.get(fid.slice(2));
      for (const c of f.children) stack.push(c);
    }
  }
}

// primary branch: father's line, else mother's, else any parent's, else spouse's (by marriage).
const primary = new Map();
function primaryBranch(id, trail = new Set()) {
  if (primary.has(id)) return primary.get(id);
  if (trail.has(id)) return null;
  trail.add(id);
  let result = null;
  if (rootBranch.has(id)) result = { key: rootBranch.get(id), byMarriage: false };
  const r = rel.get(id);
  for (const p of [r.father, r.mother, ...parentsOf.get(id)]) {
    if (result) break;
    if (!p) continue;
    const pb = primaryBranch(p, trail);
    if (pb && !pb.byMarriage) result = { key: pb.key, byMarriage: false };
  }
  if (!result) {
    // Fall back to any lineage we descend from, then to a partner's branch.
    const lin = [...lineages.get(id)];
    if (lin.length) result = { key: lin[0], byMarriage: false };
  }
  if (!result) {
    for (const s of r.spouses) {
      const sb = primaryBranch(s, trail);
      if (sb && !sb.byMarriage) { result = { key: sb.key, byMarriage: true }; break; }
    }
  }
  primary.set(id, result);
  return result;
}
for (const id of people.keys()) primaryBranch(id);

// ── Assemble output ────────────────────────────────────────────────────────
const connectedIds = new Set();
for (const f of families.values()) for (const id of [...f.partners, ...f.children]) connectedIds.add(id);

const outPeople = [...people.values()].sort((a, b) => a.id.localeCompare(b.id)).map(p => {
  const r = rel.get(p.id), d = dates.get(p.id), pb = primary.get(p.id);
  const fams = familiesOf.get(p.id);
  const children = [...new Set(fams.flatMap(fid => families.get(fid.slice(2)).children))];
  const parentFam = parentsOf.get(p.id).size ? 'F_' + famKey(parentsOf.get(p.id)) : null;
  const siblings = parentFam && families.has(parentFam.slice(2))
    ? families.get(parentFam.slice(2)).children.filter(c => c !== p.id) : [];
  return {
    id: p.id,
    name: p.name,
    aliases: p.aliases || [],
    birth: d.birth, death: d.death,
    living: !d.death.text && (d.birth.year ? d.birth.year > new Date().getFullYear() - 100 : false),
    branch: pb ? pb.key : OTHER.key,
    branch_by_marriage: pb ? pb.byMarriage : false,
    lineages: [...lineages.get(p.id)].sort(),
    father: r.father || null,
    mother: r.mother || null,
    parents: [...parentsOf.get(p.id)].sort(),
    spouses: r.spouses,
    children,
    siblings,                      // full siblings (same parent set)
    families: fams,                // families where this person is a partner
    parent_family: parentFam,
    connected: connectedIds.has(p.id),
    locations: p.locations || [],
    personality: p.personality || [],
    roles: p.roles || [],
    childhood_experience: p.childhood_experience || [],
    notable_stories: p.notable_stories || [],
    risk_events: p.risk_events || [],
    milestones: p.milestones || [],
    education: p.education || [],
    career: p.career || [],
    sources: p.sources || [],
    notes: p.notes || [],
  };
});

const outFamilies = [...families.values()].sort((a, b) => a.id.localeCompare(b.id));

const familyJson = {
  meta: {
    generated: new Date().toISOString(),
    people: outPeople.length,
    connected_people: connectedIds.size,
    families: outFamilies.length,
    branches: branches.map(b => b.key),
  },
  branches: [...branches.map(b => ({ key: b.key, label: b.label, color: b.color, roots: b.roots })), OTHER],
  people: outPeople,
  families: outFamilies,
};

// Legacy files for the current page.
const graphNodes = outPeople.filter(p => p.connected).map(p => ({ id: p.id, label: p.name, type: 'person' }));
const graphEdges = [];
for (const f of outFamilies) {
  if (f.partners.length === 2) graphEdges.push({ from: f.partners[0], to: f.partners[1], type: 'spouse' });
  for (const par of f.partners) for (const c of f.children) graphEdges.push({ from: par, to: c, type: 'parent' });
}
const canon = [...people.values()].sort((a, b) => a.id.localeCompare(b.id)).filter(p => connectedIds.has(p.id));

// ── Report ─────────────────────────────────────────────────────────────────
const byBranch = {};
for (const p of outPeople) byBranch[p.branch] = (byBranch[p.branch] || 0) + 1;
const roots = outPeople.filter(p => p.connected && !p.parents.length && p.children.length && p.lineages.length === 0 && !p.branch_by_marriage);

console.log(`people: ${outPeople.length} (${connectedIds.size} connected, ${outPeople.length - connectedIds.size} unconnected)`);
console.log(`families: ${outFamilies.length} (${outFamilies.filter(f => f.partners.length === 1).length} with one known parent, ${outFamilies.filter(f => f.marriage).length} with a marriage date)`);
console.log(`graph edges: ${graphEdges.filter(e => e.type === 'parent').length} parent, ${graphEdges.filter(e => e.type === 'spouse').length} spouse`);
console.log('people per branch:', JSON.stringify(byBranch));
console.log(`multi-lineage people: ${outPeople.filter(p => p.lineages.length > 1).length}`);
if (roots.length) {
  console.log(`\nancestors with descendants but no branch (add to data/branches.json if wanted):`);
  for (const r of roots) console.log(`  ${r.id.padEnd(30)} ${r.name}`);
}
if (warnings.length) { console.log(`\n${warnings.length} warning(s):`); for (const w of warnings) console.log('  ' + w); }
if (errors.length) { console.log(`\n${errors.length} ERROR(s):`); for (const e of errors) console.log('  ' + e); }

if (errors.length) { console.log('\nbuild aborted'); process.exit(1); }
if (CHECK_ONLY) { console.log('\ncheck only; nothing written'); process.exit(0); }

// ── Write ──────────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(ROOT, 'data', 'family.json'), JSON.stringify(familyJson, null, 1) + '\n');
fs.writeFileSync(path.join(ROOT, 'family-graph.js'),
  'window.FAMILY_GRAPH = {\n  "nodes": ' + JSON.stringify(graphNodes) + ',\n  "edges": ' + JSON.stringify(graphEdges) + '\n};');
fs.writeFileSync(path.join(ROOT, 'family-canon.js'), 'window.FAMILY_CANON = ' + JSON.stringify(canon) + ';');
console.log('\nwritten: data/family.json, family-graph.js, family-canon.js');
