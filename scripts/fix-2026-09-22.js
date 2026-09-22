#!/usr/bin/env node
/**
 * One-off data corrections applied 2026-09-22 when the people records were
 * brought into this repository. Safe to re-run (every change is idempotent).
 *
 * Each fix is recorded in the affected person's `notes` so the reasoning
 * travels with the data.
 *
 *   node scripts/fix-2026-09-22.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';

const changed = new Set();
const cache = new Map();

function load(id) {
  if (cache.has(id)) return cache.get(id);
  const p = JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
  cache.set(id, p);
  return p;
}
function save(id) { changed.add(id); }
function note(id, text) {
  const p = load(id);
  p.notes = p.notes || [];
  const full = `${TAG} ${text}`;
  if (!p.notes.includes(full)) { p.notes.push(full); save(id); }
}
function setField(id, field, value, why) {
  const p = load(id);
  if (p.relationships[field] !== value) {
    p.relationships[field] = value;
    save(id);
    if (why) note(id, why);
  }
}
function removeFrom(id, field, value, why) {
  const p = load(id);
  const arr = p.relationships[field] || [];
  if (arr.includes(value)) {
    p.relationships[field] = arr.filter(x => x !== value);
    save(id);
    if (why) note(id, why);
  }
}
function addTo(id, field, value, why) {
  const p = load(id);
  p.relationships[field] = p.relationships[field] || [];
  if (!p.relationships[field].includes(value)) {
    p.relationships[field].push(value);
    save(id);
    if (why) note(id, why);
  }
}
function replaceIn(id, field, from, to) {
  const p = load(id);
  const arr = p.relationships[field] || [];
  if (arr.includes(from)) {
    p.relationships[field] = arr.map(x => (x === from ? to : x));
    save(id);
  }
}

// ── 1. Margaret Jeanice "Peggy" Allen (b. 1925) ────────────────────────────
// Recorded as a child of Alberta Adams (b. 1866) and George Julius Allen
// (b. 1865), and also as a child of her brother George Homer Allen (b. 1921).
// Both are impossible. George Homer names her as his sister, so she is a
// daughter of George Philip Allen. Mother left blank pending a source.
setField('allen_margaret_jeanice', 'father', 'allen_george_philip',
  'Father changed from allen_george_julius (b. 1865) to allen_george_philip. She was born 1925; her brother George Homer Allen (b. 1921) names her as sibling and is George Philip\'s son. Mother left unknown pending a source (George Philip\'s first wife Esther Jane Anthony, m. 1919, is the likely candidate).');
setField('allen_margaret_jeanice', 'mother', '');
removeFrom('adams_alberta', 'children', 'allen_margaret_jeanice',
  'Removed allen_margaret_jeanice from children: born 1925, she is a granddaughter (daughter of George Philip Allen).');
removeFrom('allen_george_julius', 'children', 'allen_margaret_jeanice',
  'Removed allen_margaret_jeanice from children: born 1925, she is a granddaughter (daughter of George Philip Allen).');
removeFrom('allen_george_homer', 'children', 'allen_margaret_jeanice',
  'Removed allen_margaret_jeanice from children: she is his sister, not his daughter.');
removeFrom('wheeler_dorothy_ann', 'children', 'allen_margaret_jeanice',
  'Removed allen_margaret_jeanice from children: she is George Homer Allen\'s sister, not his daughter.');
addTo('allen_george_philip', 'children', 'allen_margaret_jeanice',
  'Added daughter allen_margaret_jeanice (b. 1925), sister of George Homer Allen.');

// ── 2. Michael Nicholas Kulp (b. 1842) ─────────────────────────────────────
// Mother was Barbara Fretz, wife of Henry Kolb (d. 1730). His confirmed
// father Ephraim Kulp's wife is Maria Catharina Confer, who already lists him.
setField('kulp_michael_nicholas', 'mother', 'confer_maria_catharina',
  'Mother changed from fretz_barbara (wife of Henry Kolb, d. 1730) to confer_maria_catharina, wife of his confirmed father Ephraim Kulp.');
removeFrom('fretz_barbara', 'children', 'kulp_michael_nicholas',
  'Removed kulp_michael_nicholas (b. 1842) from children; he is a descendant several generations later.');

// ── 3. Peter Kolb ──────────────────────────────────────────────────────────
// Mother was Agnes Schumacher, who is his father Henry Kolb's mother.
setField('kolb_peter', 'mother', 'fretz_barbara',
  'Mother changed from schumacher_agnes (his grandmother, wife of Dielman Kolb) to fretz_barbara, wife of his father Henry Kolb.');
addTo('fretz_barbara', 'children', 'kolb_peter');

// ── 4. Glen Simons ─────────────────────────────────────────────────────────
// Listed as a child of his grandmother Harriet "Hattie" Simons.
removeFrom('simons_harriet_hattie', 'children', 'simons_glen',
  'Removed simons_glen from children; he is her grandson (son of Raymond Zell Simons).');

// ── 5. Dangling references ─────────────────────────────────────────────────
setField('simons_aaron', 'spouse', 'simons_harriet_hattie',
  'Spouse reference harriet_m_hattie pointed at no record; changed to simons_harriet_hattie.');
setField('quinn_john_joseph', 'spouse', 'quinn_marie_ellinghaus',
  'Spouse reference marie_ellinghaus_quinn pointed at no record; changed to quinn_marie_ellinghaus.');
removeFrom('mckeldin_james_alfred', 'children', 'theodore_r_mckeldin',
  'Removed duplicate child reference theodore_r_mckeldin (unresolved stub); mckeldin_theodore_roosevelt is already listed.');
replaceIn('zacher_kenneth_donald', 'siblings', 'kippy_amy_zacher', 'zacher_kippy_amy');
replaceIn('zacher_kimberly_lynn', 'siblings', 'kippy_amy_zacher', 'zacher_kippy_amy');

// ── 6. First wife of Col. Alexander William Adams ──────────────────────────
// Known only as "Ashby", died 1868 (per Mary Louisa Martin's record). Create
// a minimal record so the marriage and her son can be represented.
const ashbyPath = path.join(DIR, 'ashby_unknown.json');
if (!fs.existsSync(ashbyPath)) {
  fs.writeFileSync(ashbyPath, JSON.stringify({
    id: 'ashby_unknown',
    name: '(Unknown) Ashby',
    birth: '',
    death: '1868',
    personality: [], roles: [], childhood_experience: [], notable_stories: [],
    risk_events: [], milestones: ['Married Col. Alexander William Adams (first wife)'],
    education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: 'adams_alexander_william_col', children: ['adams_henry_a'] },
    locations: [],
    sources: ['martin_mary_louisa notes: "first wife Unknown Ashby died 1868"'],
    notes: [`${TAG} Stub record created so the first marriage of Col. Alexander William Adams can be represented. Given name unknown. Henry A. Adams (b. Jan 1868) is attributed to her by inference: born before her death in 1868 and before the Colonel's 1871 marriage to Mary Louisa Martin.`]
  }, null, 2) + '\n');
  console.log('created ashby_unknown.json');
}
setField('adams_alexander_william_col', 'spouse', 'ashby_unknown',
  'Spouse reference unknown_ashby pointed at no record; created ashby_unknown and pointed to it.');
setField('adams_henry_a', 'mother', 'ashby_unknown',
  'Mother set to ashby_unknown by inference (born Jan 1868, before her death in 1868 and before his father\'s 1871 remarriage).');

// ── 7. One-sided parent/child links ────────────────────────────────────────
addTo('martin_mary_louisa', 'children', 'adams_caleb_martin',
  'Added adams_caleb_martin, who names her as mother.');
for (const kid of ['gabriel_michael_obad', 'alina_camille_obad', 'mateo_vlaho_obad']) {
  setField(kid, 'father', 'ivo_john_obad', 'Parents filled in from ivo_john_obad and camille_remy, who both list this child.');
  setField(kid, 'mother', 'camille_remy');
}
for (const kid of ['kulp_edith_sarah', 'kulp_audrey_rebecca']) {
  setField(kid, 'father', 'kulp_john_jacob', 'Father filled in from kulp_john_jacob, who lists this child. Mother left unknown.');
}

// ── 8. Normalise nulls → empty values across all records ───────────────────
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  const id = f.slice(0, -5);
  const p = load(id);
  const r = p.relationships || (p.relationships = {});
  let touched = false;
  for (const k of ['father', 'mother', 'spouse']) {
    if (r[k] === null || r[k] === undefined) { r[k] = ''; touched = true; }
  }
  for (const k of ['siblings', 'children']) {
    if (!Array.isArray(r[k])) { r[k] = r[k] ? [r[k]] : []; touched = true; }
  }
  if (touched) save(id);
}

// ── Write ──────────────────────────────────────────────────────────────────
for (const id of changed) {
  fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(load(id), null, 2) + '\n');
}
console.log(`fixes applied; ${changed.size} file(s) written:`);
console.log('  ' + [...changed].sort().join('\n  '));
