#!/usr/bin/env node
/**
 * More Simons and Wells family, from Brendan Adams, 2026-09-22. Re-runnable.
 *  - Scott's surname is Morgan.
 *  - Raymond Elmer ("Elmer") Simons and his wife Betty adopted Carl Ray and
 *    Debra Sue.
 *  - Elaine Deretha Simons married Les Rhinehart; their children are Jerry and
 *    Janet.
 * Records whose surname is now known move to surname_given ids.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const SRC = 'Brendan Adams, 2026-09-22';
const file = id => path.join(DIR, id + '.json');
const exists = id => fs.existsSync(file(id));
const load = id => JSON.parse(fs.readFileSync(file(id), 'utf8'));
const save = p => fs.writeFileSync(file(p.id), JSON.stringify(p, null, 2) + '\n');
const note = (p, t) => { p.notes = p.notes || []; if (!p.notes.includes(t)) p.notes.push(t); };
const addTo = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };

/** Move a record to a new id and rewrite every reference to it. */
function rename(oldId, newId) {
  if (!exists(oldId)) return;
  if (exists(newId)) fs.unlinkSync(file(oldId));        // re-run after an earlier script recreated the old id
  else { const p = load(oldId); p.id = newId; save(p); fs.unlinkSync(file(oldId)); }
  for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
    const q = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); const r = q.relationships || {};
    let t = false;
    for (const k of ['father', 'mother', 'spouse']) if (r[k] === oldId) { r[k] = newId; t = true; }
    for (const k of ['children', 'siblings', '_extra_spouses']) if (Array.isArray(r[k]) && r[k].includes(oldId)) { r[k] = r[k].map(x => (x === oldId ? newId : x)); t = true; }
    // tidy: no duplicate entries, no "extra" spouse that is already the spouse
    for (const k of ['children', 'siblings', '_extra_spouses']) if (Array.isArray(r[k])) { const u = [...new Set(r[k])].filter(x => k !== '_extra_spouses' || x !== r.spouse); if (u.length !== r[k].length) { r[k] = u; t = true; } }
    if (Array.isArray(r._extra_spouses) && !r._extra_spouses.length) { delete r._extra_spouses; t = true; }
    if (t) save(q);
  }
}
function person(id, name, { father = '', mother = '', notes = [], aliases = [] } = {}) {
  const p = exists(id) ? load(id) : {
    id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [],
    risk_events: [], milestones: [], education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] },
    locations: [], sources: [SRC], notes: [], aliases: [],
  };
  if (father) p.relationships.father = father;
  if (mother) p.relationships.mother = mother;
  for (const n of notes) note(p, n);
  for (const a of aliases) addTo(p.aliases, a);
  addTo(p.sources, SRC);
  save(p);
  return p;
}
const couple = (a, b) => { const pa = load(a), pb = load(b); pa.relationships.spouse ||= b; pb.relationships.spouse ||= a; save(pa); save(pb); };
const kids = (parents, children) => { for (const par of parents) { const p = load(par); for (const c of children) addTo(p.relationships.children, c); save(p); } };

// ── Morgan ─────────────────────────────────────────────────────────────────
rename('louise_daughter_of_rosemary_wells', 'morgan_louise');
rename('scott_son_of_louise', 'morgan_scott');
{
  const s = load('morgan_scott');
  s.name = 'Scott Morgan';
  s.notes = s.notes.filter(n => !n.startsWith('Son of Louise'));
  note(s, 'Son of Louise Morgan, the daughter of Rosemary Wells.');
  save(s);
}

// ── Elmer and Betty ────────────────────────────────────────────────────────
person('simons_raymond_elmer', 'Raymond Elmer Simons', { aliases: ['Elmer'] });
{
  const e = load('simons_raymond_elmer');
  e.notes = e.notes.filter(n => !n.includes('adopted two children (not named here)'));
  note(e, 'Brother of Beryl Simons Adams. Known as Elmer. He and his wife Betty adopted two children, Carl Ray and Debra Sue.');
  save(e);
}
person('simons_betty', 'Betty Simons', { notes: ['Wife of Raymond Elmer ("Elmer") Simons. Maiden name not recorded.'] });
couple('simons_raymond_elmer', 'simons_betty');
const ADOPTED = 'Adopted by Elmer and Betty Simons.';
person('simons_carl_ray', 'Carl Ray Simons', { father: 'simons_raymond_elmer', mother: 'simons_betty', notes: [ADOPTED] });
person('simons_debra_sue', 'Debra Sue Simons', { father: 'simons_raymond_elmer', mother: 'simons_betty', notes: [ADOPTED] });
for (const id of ['simons_carl_ray', 'simons_debra_sue']) { const p = load(id); p.relationships.adopted = true; save(p); }
kids(['simons_raymond_elmer', 'simons_betty'], ['simons_carl_ray', 'simons_debra_sue']);

// ── Rhinehart ──────────────────────────────────────────────────────────────
rename('les_husband_of_elaine_simons', 'rhinehart_les');
{
  const l = load('rhinehart_les');
  if (!/Rinehart/.test(l.name)) l.name = 'Les Rhinehart';
  l.notes = l.notes.filter(n => !n.startsWith('Husband of Elaine Deretha Simons. Surname not recorded.'));
  note(l, 'Husband of Elaine Deretha Simons.');
  save(l);
  const e = load('simons_elaine_deretha');
  if (!/Rinehart/.test(e.name)) e.name = 'Elaine Deretha Simons (Rhinehart)';
  e.notes = e.notes.filter(n => !n.startsWith('Sister of Beryl Simons Adams; married Les (surname not recorded).'));
  note(e, 'Sister of Beryl Simons Adams; married Les Rhinehart.');
  save(e);
}
person('rhinehart_jerry', 'Jerry Rhinehart', { father: 'rhinehart_les', mother: 'simons_elaine_deretha' });
person('rhinehart_janet', 'Janet Rhinehart', { father: 'rhinehart_les', mother: 'simons_elaine_deretha' });
kids(['rhinehart_les', 'simons_elaine_deretha'], ['rhinehart_jerry', 'rhinehart_janet']);
console.log('done');
