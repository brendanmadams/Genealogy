#!/usr/bin/env node
/**
 * Place-list clean-up, 2026-09-22, directed by Brendan Adams. Re-runnable.
 *
 * 1. A block of 14 family-wide places had been stamped onto 48 records.
 *    It is removed from those records and each place is put back only on the
 *    people it belongs to (per the April 2026 master file and Brendan).
 * 2. Barbara McKeldin Adams's memoir places had been copied into John Howard
 *    Adams's and Chuck McKeldin's records. Places John shared with Barbara
 *    during their marriage stay; places that were Barbara's alone go. Chuck
 *    keeps only their shared Baltimore childhood and his own places.
 * 3. John, his father and his brother George grew up / served at the
 *    Presidio, San Francisco.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';
const load = id => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const save = (id, p) => fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(p, null, 2) + '\n');
const note = (p, t) => { p.notes = p.notes || []; const s = `${TAG} ${t}`; if (!p.notes.includes(s)) p.notes.push(s); };
const push = (arr, v) => { if (!arr.includes(v)) arr.push(v); };
const changed = new Set();

// ── 1. The stamped block ───────────────────────────────────────────────────
const BLOCK = ['Annapolis, MD', 'Baltimore, MD', 'Meridian, MS', 'Pierce County, WA', 'Tacoma, WA', 'Milton, FL',
  'Honolulu, HI', 'Posen, Poland', 'Battle Creek, MI', 'San Francisco, CA', 'Sacramento, CA', 'Fair Oaks, CA',
  'Calaveras County', 'Roseville, CA'];
const OWNERS = {
  'Baltimore, MD': ['barbara_mckeldin_adams', 'chuck_mckeldin', 'j_michael_mckeldin', 'charles_buckey_mckeldin',
    'emily_schrieffer_mckeldin', 'margaret_peggy_mckeldin', 'emma_bell_mckeldin', 'john_howard_adams'],
  'Annapolis, MD': ['john_howard_adams', 'barbara_mckeldin_adams', 'george_francis_adams_jr'],
  'Battle Creek, MI': ['gertrude_adams_remy'],
  'San Francisco, CA': ['gertrude_adams_remy', 'michael_remy', 'john_howard_adams', 'george_francis_adams_sr', 'george_francis_adams_jr'],
  'Posen, Poland': ['michael_remy'],
  'Tacoma, WA': ['george_francis_adams_jr', 'cynthia_gail_smith'],
  'Pierce County, WA': ['george_francis_adams_jr', 'cynthia_gail_smith'],
  'Meridian, MS': ['brian_john_adams'],
  'Milton, FL': ['george_francis_adams_iv'],
  'Honolulu, HI': ['geoffrey_louis_adams'],
  'Sacramento, CA': [],                 // Hannah Louise Buckley only; her record was never stamped
  'Fair Oaks, CA': ['gertrude_adams_remy', 'michael_remy', 'camille_remy', 'christopher_jon_remy', 'beryl_simons_adams'],
  'Calaveras County': ['camille_remy', 'ivo_john_obad'],
  'Roseville, CA': [],                  // no known owner
};
const stamped = [];
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const hits = (p.locations || []).filter(l => BLOCK.includes(l)).length;
  if (hits >= 10) stamped.push(p.id);
}
for (const id of stamped) {
  const p = load(id);
  const keep = BLOCK.filter(pl => (OWNERS[pl] || []).includes(id));
  p.locations = p.locations.filter(l => !BLOCK.includes(l));
  for (const pl of keep) push(p.locations, pl);
  // No note: the block was a data-processing error, not a finding about the
  // person (Brendan Adams, 2026-09-23). fix-2026-09-23-family-wide-note.js
  // removes the notes an earlier version of this script wrote.
  save(id, p); changed.add(id);
}
// owners outside the stamped set (none expected, but be safe)
for (const [pl, ids] of Object.entries(OWNERS)) for (const id of ids) {
  if (stamped.includes(id)) continue;
  const p = load(id); p.locations = p.locations || [];
  if (!p.locations.includes(pl)) { p.locations.push(pl); save(id, p); changed.add(id); }
}

// ── 2a. John: remove places that were Barbara's alone ──────────────────────
const BARBARA_ONLY = ['St. Dominic’s School', 'Mercy High', 'Towson State College', 'Towson State', 'Stella Maris Nursing Home',
  'Hecht’s', 'Hutzler’s', 'Stewart’s', 'Hochschild Kohn', 'Kate Griffin Junior High', 'St. Rose School Longview WA',
  'St. Rose School', 'Lower Columbia College', 'Shasta Community College', 'Farmington Library', 'Ridgefield School district',
  'Crownpoint High School'];
{
  const j = load('john_howard_adams');
  const before = j.locations.length;
  j.locations = j.locations.filter(l => !BARBARA_ONLY.includes(l));
  if (j.locations.length !== before) note(j, `Removed ${before - j.locations.length} places copied from Barbara's memoir that were hers alone (her schools, workplaces, the nursing home and Baltimore department stores). Places they shared as a married couple were kept.`);
  const bad = 'Barbara identifies John as one of John Joseph Quinn’s teenage children.';
  if (j.notes.includes(bad)) { j.notes = j.notes.filter(n => n !== bad); note(j, 'Removed a note wrongly calling John one of John Joseph Quinn’s children (copied from Barbara’s record).'); }
  // ── 3. Presidio ──
  push(j.locations, 'Presidio, San Francisco, CA');
  const story = 'Grew up at the Presidio in San Francisco, where his father was a military police officer, and went to high school with O.J. Simpson.';
  push(j.notable_stories, story);
  save('john_howard_adams', j); changed.add('john_howard_adams');
}

// ── 2b. Chuck: keep shared Baltimore childhood and his own places ──────────
{
  const c = load('chuck_mckeldin');
  const KEEP = ['Baltimore', 'Baltimore, MD', 'Ocean City MD', 'Ocean City', 'Chesapeake Bay', 'Memorial Stadium', 'Baltimore Zoo',
    'Herring Run Park', 'Fort McHenry', 'Annapolis', 'Williamsburg', 'Monterey, CA'];
  const before = c.locations.length;
  c.locations = c.locations.filter(l => KEEP.includes(l));
  if (c.locations.length !== before) note(c, `Removed ${before - c.locations.length} places copied from his sister Barbara's memoir (her schools, homes and travels). Kept their shared Baltimore childhood, Annapolis (her wedding), Williamsburg (family trip) and Monterey (his postgraduate school).`);
  save('chuck_mckeldin', c); changed.add('chuck_mckeldin');
}

// ── 3. George Sr. and George Jr. at the Presidio ───────────────────────────
{
  const s = load('george_francis_adams_sr');
  push(s.locations, 'Presidio, San Francisco, CA');
  push(s.milestones, 'Military police officer at the Presidio, San Francisco, where the family lived while John and George Jr. grew up');
  save('george_francis_adams_sr', s); changed.add('george_francis_adams_sr');

  const b = load('beryl_simons_adams');
  push(b.locations, 'Presidio, San Francisco, CA');
  push(b.locations, 'San Francisco, CA');
  push(b.milestones, 'Lived at the Presidio, San Francisco, while her husband served there as a military police officer');
  save('beryl_simons_adams', b); changed.add('beryl_simons_adams');

  const g = load('george_francis_adams_jr');
  push(g.locations, 'Presidio, San Francisco, CA');
  push(g.milestones, 'Grew up at the Presidio, San Francisco, until he left for the U.S. Naval Academy');
  push(g.milestones, 'Attended the U.S. Naval Academy, Annapolis, following his brother John');
  note(g, 'Presidio childhood and Naval Academy attendance per Brendan Adams, 2026-09-22.');
  save('george_francis_adams_jr', g); changed.add('george_francis_adams_jr');
}

console.log(`stamped records cleaned: ${stamped.length}; files written: ${changed.size}`);
