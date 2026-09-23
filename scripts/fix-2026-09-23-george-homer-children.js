#!/usr/bin/env node
/**
 * George Homer Allen's children: full names, births and marriages, from
 * "Descendants of Jose Pierre Adams" (compiled by Bill Allen). Also moves
 * Guinevere and Benjamin Alistair Allen, who are Anthony Adams Allen's
 * children (George Homer's grandchildren), to their real parents.
 * Brendan Adams, 2026-09-23. Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const DOC = 'Descendants of Jose Pierre Adams (compiled by William W. "Bill" Allen, Nov 2010)';
const TAG = 'CORRECTION 2026-09-23:';
const add = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };

function person(id, name, x = {}) {
  const p = exists(id) ? load(id) : {
    id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [],
    risk_events: [], milestones: [], education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] },
    locations: [], sources: [], notes: [], aliases: [],
  };
  for (const k of ['locations', 'aliases', 'milestones', 'notable_stories', 'career', 'education', 'roles', 'personality', 'sources', 'notes']) p[k] = p[k] || [];
  if (x.rename) p.name = name;
  if (x.birth) p.birth = x.birth;
  if (x.death) p.death = x.death;
  for (const k of ['locations', 'aliases', 'milestones', 'career', 'education']) for (const v of x[k] || []) add(p[k], v);
  for (const n of x.notes || []) note(p, n);
  if (x.dropNotes) p.notes = p.notes.filter(n => !x.dropNotes.includes(n));
  add(p.sources, DOC);
  save(p);
  return p;
}
function marry(a, b) {
  for (const [x, y] of [[a, b], [b, a]]) {
    const p = load(x), r = p.relationships;
    if (!r.spouse) r.spouse = y;
    else if (r.spouse !== y) { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); }
    save(p);
  }
}
const OLD_NOTE = 'Child of George Homer Allen and Dorothy Ann Wheeler.';

// ── Wendy Ann ──────────────────────────────────────────────────────────────
person('allen_wendy', 'Wendy Ann Allen', {
  rename: true, birth: '5 Dec 1949', locations: ['Monrovia, CA', 'Santa Barbara, CA', 'Los Angeles, CA'],
  education: ['B.A. History of Science, University of California, Los Angeles', 'Studied international law in England (recorded as "Oxford College, Cambridge")'],
  milestones: ['Born 5 December 1949, Monrovia, California',
    'Married Hallock B. Hoffman (m. 31 Dec 1973, Santa Barbara, CA); divorced about 1980',
    'Married Clark Spangler at a Buddhist temple in Los Angeles'],
});
person('hoffman_hallock_b', 'Hallock B. Hoffman', {
  birth: '1918', death: '13 Dec 2006', locations: ['Detroit, MI', 'Desert Hot Springs, CA'],
  milestones: ['Married Wendy Ann Allen (m. 31 Dec 1973, Santa Barbara, CA); divorced about 1980'],
});
person('spangler_clark', 'Clark Spangler', { notes: ['Second husband of Wendy Ann Allen; married at a Buddhist temple in Los Angeles. Birth date unknown.'] });
marry('allen_wendy', 'hoffman_hallock_b');
marry('allen_wendy', 'spangler_clark');

// ── Susan Elizabeth ────────────────────────────────────────────────────────
person('allen_susan', 'Susan Elizabeth Allen', {
  rename: true, birth: '10 May 1951', locations: ['Alhambra, CA', 'Valencia, CA', 'Santa Barbara, CA'],
  education: ['B.F.A. and M.F.A. in Music Performance (harp), California Institute of the Arts'],
  career: ['Harpist; solo performances at Carnegie Recital Hall; specialist in contemporary harp music; many ensemble and solo recordings',
    'On the faculty and staff of California Institute of the Arts from 1978; served as a dean'],
  milestones: ['Born 10 May 1951, Alhambra, California', 'Married Jeff Weinstein (m. Mar 1991, Santa Barbara, CA)'],
});
person('weinstein_jeff', 'Jeff Weinstein', { notes: ['Husband of Susan Elizabeth Allen. Birth date unknown.'], milestones: ['Married Susan Elizabeth Allen (m. Mar 1991, Santa Barbara, CA)'] });
marry('allen_susan', 'weinstein_jeff');

// ── Anthony Adams (Tony) ───────────────────────────────────────────────────
person('allen_anthony', 'Anthony Adams Allen', {
  rename: true, birth: '18 Feb 1959', aliases: ['Tony Allen'], locations: ['Santa Barbara, CA', 'Prescott, AZ', 'Moscow, ID'],
  education: ['B.S. Forestry, University of Idaho', 'J.D., University of Oregon'],
  milestones: ['Born 18 February 1959, Santa Barbara, California', 'Married Susan Bethany Fonshill (m. 1 Mar 1979, Prescott, AZ)'],
});
person('fonshill_susan_bethany', 'Susan Bethany Fonshill (Allen)', {
  birth: '27 Sep 1958',
  milestones: ['Married Anthony Adams Allen (m. 1 Mar 1979, Prescott, AZ)'],
  notes: ['Daughter of Ira W. Fonshill and Pamela Leavitt.'],
});
marry('allen_anthony', 'fonshill_susan_bethany');

// ── Brooks Beatty ──────────────────────────────────────────────────────────
person('allen_brooks', 'Brooks Beatty Allen', {
  rename: true, birth: '5 Jan 1961', locations: ['Santa Barbara, CA', 'Santa Ynez, CA'],
  milestones: ['Born 5 January 1961, Santa Barbara, California',
    'Married Nancy Ruth Lee (m. 1 Apr 1986, Santa Barbara, CA)',
    'Married Jamie Leigh Dworman (m. 1 Apr 1990, Santa Ynez, CA)'],
});
person('lee_nancy_ruth', 'Nancy Ruth Lee', { birth: 'Sep 1947', locations: ['Van Nuys, CA'], milestones: ['Married Brooks Beatty Allen (m. 1 Apr 1986, Santa Barbara, CA)'] });
person('dworman_jamie_leigh', 'Jamie Leigh Dworman', { birth: '19 Feb 1965', locations: ['New York, NY'], milestones: ['Married Brooks Beatty Allen (m. 1 Apr 1990, Santa Ynez, CA)'] });
marry('allen_brooks', 'lee_nancy_ruth');
marry('allen_brooks', 'dworman_jamie_leigh');

for (const id of ['allen_wendy', 'allen_susan', 'allen_anthony', 'allen_brooks']) {
  const p = load(id);
  p.notes = p.notes.filter(n => n !== OLD_NOTE);
  note(p, 'Child of George Homer Allen and Dorothy Ann Wheeler.');
  save(p);
}

// ── Guinevere and Benjamin belong to Anthony and Susan ─────────────────────
for (const par of ['allen_george_homer', 'wheeler_dorothy_ann']) {
  const p = load(par);
  p.relationships.children = p.relationships.children.filter(c => !['allen_guinevere', 'allen_benjamin_alistair'].includes(c));
  save(p);
}
const GB = [
  ['allen_guinevere', 'Guinevere Wheeler Allen', { birth: '19 Mar 1979', aliases: ['Guin Allen', 'Gwen Allen'], locations: ['Prescott, AZ'] }],
  ['allen_benjamin_alistair', 'Benjamin Alistair Allen', { birth: '17 Jul 1987', aliases: ['Ben Allen'], locations: ['Moscow, ID'] }],
];
for (const [id, name, x] of GB) {
  person(id, name, { ...x, rename: true, notes: [`${TAG} Parents are Anthony Adams Allen and Susan Bethany Fonshill (George Homer Allen's son and daughter-in-law), per Bill Allen's family document. Previously attached to George Homer Allen and Dorothy Ann Wheeler by mistake.`] });
  const p = load(id);
  p.relationships.father = 'allen_anthony';
  p.relationships.mother = 'fonshill_susan_bethany';
  save(p);
  for (const par of ['allen_anthony', 'fonshill_susan_bethany']) { const q = load(par); add(q.relationships.children, id); save(q); }
}
{ const h = load('allen_george_homer'); note(h, `${TAG} Guinevere and Benjamin Alistair Allen moved to their parents Anthony Adams Allen and Susan Bethany Fonshill; George Homer and Dorothy's five children are Wendy, Susan, William, Anthony and Brooks.`); save(h); }
console.log("George Homer Allen's children updated");
