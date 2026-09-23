#!/usr/bin/env node
/**
 * The Simons family, from Brendan Adams, 2026-09-22. Re-runnable.
 *
 * Children of Raymond Zell Simons and Dradie Ellen Kulp: Beryl, Elaine
 * Deretha, Raymond Elmer, Byron Daniel "Howard", Orval Keith and Glen.
 *   Elaine married Les.
 *   Raymond Elmer and his wife adopted two children (not named here).
 *   Orval and Irene: Les (m. Lenore), Rodney, Janine (m. Stan).
 *   Glen and Mary: Ed and Ann.
 *   Howard and Nancy: Steve (m. Penny), Lynn, Sandy, Sharon and Judy.
 * "Ralph Simons" was not a Simons: Ralph is the husband of Rosemary Wells
 * (Adams side); their daughter Louise has a son, Scott.
 * Surnames are recorded only where known; maiden names are unknown.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const SRC = 'Brendan Adams, 2026-09-22';
const TAG = 'CORRECTION 2026-09-22:';
const file = id => path.join(DIR, id + '.json');
const exists = id => fs.existsSync(file(id));
const load = id => JSON.parse(fs.readFileSync(file(id), 'utf8'));
const save = p => fs.writeFileSync(file(p.id), JSON.stringify(p, null, 2) + '\n');
const note = (p, t) => { p.notes = p.notes || []; if (!p.notes.includes(t)) p.notes.push(t); };
const addTo = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };

function person(id, name, { father = '', mother = '', spouse = '', notes = [], aliases = [] } = {}) {
  const p = exists(id) ? load(id) : {
    id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [],
    risk_events: [], milestones: [], education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] },
    locations: [], sources: [SRC], notes: [], aliases: [],
  };
  p.name = p.name || name;
  const r = p.relationships;
  if (father) r.father = father;
  if (mother) r.mother = mother;
  if (spouse && !r.spouse) r.spouse = spouse;
  for (const n of notes) note(p, n);
  for (const a of aliases) addTo(p.aliases, a);
  addTo(p.sources, SRC);
  save(p);
  return p;
}
function couple(a, b) {
  const pa = load(a), pb = load(b);
  if (!pa.relationships.spouse) pa.relationships.spouse = b; else if (pa.relationships.spouse !== b) addTo(pa.relationships._extra_spouses = pa.relationships._extra_spouses || [], b);
  if (!pb.relationships.spouse) pb.relationships.spouse = a; else if (pb.relationships.spouse !== a) addTo(pb.relationships._extra_spouses = pb.relationships._extra_spouses || [], a);
  save(pa); save(pb);
}
function kids(parents, children) {
  for (const par of parents) { const p = load(par); for (const c of children) addTo(p.relationships.children, c); save(p); }
}

const RZ = 'simons_raymond_zell', DK = 'kulp_dradie_ellen';

// ── Beryl's siblings ───────────────────────────────────────────────────────
person('simons_elaine_deretha', 'Elaine Deretha Simons', { father: RZ, mother: DK, notes: ['Sister of Beryl Simons Adams; married Les (surname not recorded).'] });
person('les_husband_of_elaine_simons', 'Les', { notes: ['Husband of Elaine Deretha Simons. Surname not recorded.'] });
couple('simons_elaine_deretha', 'les_husband_of_elaine_simons');

person('simons_raymond_elmer', 'Raymond Elmer Simons', { father: RZ, mother: DK, notes: ['Brother of Beryl Simons Adams. He and his wife (name not recorded) adopted two children (not named here).'] });

person('simons_orval_keith', 'Orval Keith Simons', { father: RZ, mother: DK, notes: ['Brother of Beryl Simons Adams.'] });
person('simons_irene', 'Irene Simons', { notes: ['Wife of Orval Keith Simons. Maiden name not recorded.'] });
couple('simons_orval_keith', 'simons_irene');
person('simons_les', 'Les Simons', { father: 'simons_orval_keith', mother: 'simons_irene' });
person('simons_lenore', 'Lenore Simons', { notes: ['Wife of Les Simons. Maiden name not recorded.'] });
couple('simons_les', 'simons_lenore');
person('simons_rodney', 'Rodney Simons', { father: 'simons_orval_keith', mother: 'simons_irene' });
person('simons_janine', 'Janine Simons', { father: 'simons_orval_keith', mother: 'simons_irene', notes: ['Married Stan (surname not recorded).'] });
person('stan_husband_of_janine_simons', 'Stan', { notes: ['Husband of Janine Simons. Surname not recorded.'] });
couple('simons_janine', 'stan_husband_of_janine_simons');
kids(['simons_orval_keith', 'simons_irene'], ['simons_les', 'simons_rodney', 'simons_janine']);

// Glen and Mary
person('simons_mary', 'Mary Simons', { notes: ['Wife of Glen Simons. Maiden name not recorded.'] });
couple('simons_glen', 'simons_mary');
person('simons_ed', 'Ed Simons', { father: 'simons_glen', mother: 'simons_mary', notes: ['Listed among the Simons family researchers in the Adams direct-line notes.'] });
person('simons_ann', 'Ann Simons', { father: 'simons_glen', mother: 'simons_mary' });
kids(['simons_glen', 'simons_mary'], ['simons_ed', 'simons_ann']);
{
  const g = load('simons_glen');
  const before = g.notes.length;
  g.notes = g.notes.filter(n => !n.startsWith('TENTATIVE (unconfirmed, 2026-09-22)'));
  if (g.notes.length !== before) note(g, `${TAG} Earlier tentative note removed: Steve and Sharon Simons are Howard's children, not Glen's (Brendan Adams). Glen and Mary's children are Ed and Ann.`);
  save(g);
}

// Howard and Nancy
person('simons_nancy', 'Nancy Simons', { notes: ['Wife of Howard (Byron Daniel) Simons. Maiden name not recorded.'] });
couple('simons_howard', 'simons_nancy');
const HN = ['simons_steve', 'simons_lynn', 'simons_sandy', 'simons_sharon', 'simons_judy'];
const HN_NAMES = { simons_steve: 'Steve Simons', simons_lynn: 'Lynn Simons', simons_sandy: 'Sandy Simons', simons_sharon: 'Sharon Simons', simons_judy: 'Judy Simons' };
for (const id of HN) person(id, HN_NAMES[id], { father: 'simons_howard', mother: 'simons_nancy' });
note(load('simons_steve'), '');   // no-op placeholder to keep structure simple
{
  const s = load('simons_steve');
  s.notes = s.notes.filter(Boolean);
  note(s, 'Cousin of John Howard Adams; his memoir recalls Steve driving a pickup at age 9 or 10. Listed among the Simons family researchers in the Adams direct-line notes.');
  save(s);
  const sh = load('simons_sharon');
  note(sh, 'Listed among the Simons family researchers in the Adams direct-line notes. Not the same person as Barbara McKeldin Adams\'s cousin Sharon.');
  save(sh);
}
person('simons_penny', 'Penny Simons', { notes: ['Wife of Steve Simons. Maiden name not recorded.'] });
couple('simons_steve', 'simons_penny');
kids(['simons_howard', 'simons_nancy'], HN);

kids([RZ, DK], ['simons_elaine_deretha', 'simons_raymond_elmer', 'simons_orval_keith']);

// ── Ralph: not a Simons ────────────────────────────────────────────────────
const RALPH = 'ralph_husband_of_rosemary_wells';
if (exists('simons_ralph')) {
  const old = load('simons_ralph');
  const ralph = person(RALPH, 'Ralph', { notes: [
    `${TAG} Previously recorded as "Ralph Simons", a brother of Beryl Simons Adams (from the Adams direct-line summary). Brendan Adams confirms Ralph was not a Simons: he was the husband of Rosemary Wells, on the Adams side. Surname not recorded.`,
  ] });
  ralph.sources = [...new Set([...(old.sources || []), ...ralph.sources])];
  save(ralph);
  fs.unlinkSync(file('simons_ralph'));
  // drop every reference to the old id
  for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
    const p = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    const r = p.relationships || {};
    let touched = false;
    for (const k of ['siblings', 'children', '_extra_spouses']) {
      if (Array.isArray(r[k]) && r[k].includes('simons_ralph')) { r[k] = r[k].filter(x => x !== 'simons_ralph'); touched = true; }
    }
    for (const k of ['father', 'mother', 'spouse']) if (r[k] === 'simons_ralph') { r[k] = ''; touched = true; }
    if (touched) save(p);
  }
}
couple('wells_rosemary', RALPH);
person('louise_daughter_of_rosemary_wells', 'Louise', { father: RALPH, mother: 'wells_rosemary', notes: ['Daughter of Rosemary Wells and Ralph. Surname not recorded. Possibly the same person as the DNA match Louise Craig; not merged until confirmed.'] });
kids([RALPH, 'wells_rosemary'], ['louise_daughter_of_rosemary_wells']);
person('scott_son_of_louise', 'Scott', { mother: 'louise_daughter_of_rosemary_wells', notes: ['Son of Louise, the daughter of Rosemary Wells. Surname not recorded.'] });
kids(['louise_daughter_of_rosemary_wells'], ['scott_son_of_louise']);

// Beryl's sibling list, now complete
{
  const b = load('beryl_simons_adams');
  b.relationships.siblings = ['simons_elaine_deretha', 'simons_raymond_elmer', 'simons_howard', 'simons_orval_keith', 'simons_glen'];
  note(b, `${TAG} Siblings completed per Brendan Adams: Elaine Deretha, Raymond Elmer, Byron Daniel "Howard", Orval Keith and Glen (six children in all). "Ralph" was Rosemary Wells's husband, not a brother.`);
  save(b);
}
for (const id of ['simons_glen', 'simons_howard']) {
  const p = load(id);
  p.relationships.siblings = (p.relationships.siblings || []).filter(x => x !== 'simons_ralph');
  save(p);
}
console.log('Simons family written');
