#!/usr/bin/env node
/**
 * Add the close family found in Bill Allen's family document (approved by
 * Brendan Adams, 2026-09-23). Relationships come only from the FAMILY list
 * below, curated from the document's register; each person's dates, places,
 * careers and notes come from their merged readings in
 * data/imports/bill-allen-family-2026-09-23.json. Re-runnable.
 *
 * Left out on purpose: wedding guests and other names in clippings, the
 * in-laws' own parents (except ancestors of people already in the tree),
 * the Hamilton / Robert Burns / John Quincy Adams lore in the letters, and
 * the extended 2012 research (a later batch).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const IMP = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'imports', 'bill-allen-family-2026-09-23.json'), 'utf8'));
const SRC = 'Descendants of Jose Pierre Adams, compiled by William W. "Bill" Allen (2 April 2011 edition)';
const add = (arr, v) => { if (v && !arr.includes(v)) { arr.push(v); return true; } return false; };
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const yearOf = s => { const m = String(s || '').match(/\b(1[5-9]\d\d|20\d\d)\b/); return m ? +m[1] : null; };
const precision = s => { s = String(s || ''); if (/\b\d{1,2}\s+[A-Za-z]{3}/.test(s)) return 3; if (/[A-Za-z]{3,}\s+\d{4}/.test(s)) return 2; if (yearOf(s)) return 1; return 0; };
const mentions = (arr, v) => { const n = norm(v); return !!n && (arr || []).some(x => norm(x).includes(n)); };

// [id, name, {father, mother, aliases, spouses: [[id, date]], note}]
// Keys into the import file are the same ids.
const FAMILY = [
  // George Francis Adams (#1) and Cynthia Lane
  ['adams_mary_1845', 'Mary Adams', { father: 'adams_george_francis_1', mother: 'lane_cynthia' }],
  ['adams_virginia_m', 'Virginia M. Adams (Lewis)', { father: 'adams_george_francis_1', mother: 'lane_cynthia', spouses: [['lewis_john', null]] }],
  ['lewis_john', 'John Lewis', { note: 'Husband of Virginia M. Adams. Bill Allen gives only the surname Lewis; the Adams brothers photograph names a brother-in-law John Lewis, and a Virginia Lewis (1858–1934) is buried in the Adams family plot at Castle Rock.' }],
  ['adams_nancy_e', 'Nancy E. Adams', { father: 'adams_george_francis_1', mother: 'lane_cynthia' }],
  ['palmer_lemon_b', 'Lemon B. Palmer', { spouses: [['adams_harriett_e', null]], aliases: ['L. B. Palmer'] }],
  // John Wesley Adams and Mary Frances Vantine
  ['adams_myrtle_anna', 'Myrtle Anna Adams (Urbach)', { father: 'adams_john_wesley', mother: 'vantine_mary_frances', spouses: [['green_william_l', '6 Mar 1889'], ['urbach_phillip_l', '2 Jan 1898']] }],
  ['green_william_l', 'William L. Green', {}],
  ['green_lester_d', 'Lester D. Green', { father: 'green_william_l', mother: 'adams_myrtle_anna' }],
  ['urbach_phillip_l', 'Phillip L. Urbach', {}],
  ['urbach_robert_henry', 'Robert Henry Urbach', { father: 'urbach_phillip_l', mother: 'adams_myrtle_anna' }],
  ['urbach_charles_phillip', 'Charles Phillip Urbach', { father: 'urbach_phillip_l', mother: 'adams_myrtle_anna', aliases: ['Charlie Urbach'], spouses: [['owens_ruth_eva', '16 May 1921']] }],
  ['urbach_howard_c', 'Howard C. Urbach', { father: 'urbach_phillip_l', mother: 'adams_myrtle_anna' }],
  ['owens_ruth_eva', 'Ruth Eva Owens (Urbach)', {}],
  ['urbach_lester_charles', 'Lester Charles Urbach', { father: 'urbach_charles_phillip', mother: 'owens_ruth_eva' }],
  ['urbach_phillip_owen', 'Phillip Owen Urbach', { father: 'urbach_charles_phillip', mother: 'owens_ruth_eva', spouses: [['urbach_betty_j', null]] }],
  ['urbach_betty_j', 'Betty J. Urbach', { note: 'Wife of Phillip Owen Urbach; maiden name not recorded.' }],
  ['adams_charles_w', 'Charles W. Adams', { father: 'adams_john_wesley', mother: 'vantine_mary_frances' }],
  ['adams_mary_susan', 'Mary Susan Adams (Jones)', { father: 'adams_john_wesley', mother: 'vantine_mary_frances', aliases: ['Susie Adams'], spouses: [['jones_reeves_h', '24 May 1899']] }],
  ['jones_reeves_h', 'Reeves H. Jones', {}],
  ['jones_virginia_ruth', 'Virginia Ruth Jones', { father: 'jones_reeves_h', mother: 'adams_mary_susan' }],
  ['adams_gertrude_1881', 'Gertrude Adams (Clark)', { father: 'adams_john_wesley', mother: 'vantine_mary_frances', spouses: [['clark_wallace_bowlingreen', '15 Sep 1898']] }],
  ['clark_wallace_bowlingreen', 'Wallace Bowlingreen Clark', { aliases: ['Wallace B. Clark'] }],
  ['clark_frances', 'Frances Clark (Eubank)', { father: 'clark_wallace_bowlingreen', mother: 'adams_gertrude_1881', aliases: ['Frances W. Clark'], spouses: [['eubank_myron_lee', 'abt 1919']] }],
  ['eubank_myron_lee', 'Myron Lee Eubank', {}],
  ['adams_william_w_1885', 'William W. Adams', { father: 'adams_john_wesley', mother: 'vantine_mary_frances', note: 'Son of John Wesley Adams, born 1885. Not the family historian William W. "Bill" Allen.' }],
  // Col. Alexander William Adams and Mary Louisa Martin (his obituary names these children)
  ['adams_loula', 'Loula Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa' }],
  ['adams_willie_may', 'Willie May Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa' }],
  ['adams_homer_clarence', 'Homer Clarence Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa' }],
  ['adams_frank_1879', 'Frank Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa', spouses: [['brannan_katherine_a', '9 Aug 1900']] }],
  ['adams_fred_j', 'Fred J. Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa' }],
  ['adams_olie', 'Olie Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa', aliases: ['Ollie Adams'] }],
  ['adams_george_f_1887', 'George F. Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa', note: 'Son of Col. Alexander William Adams, born 1887. Not one of the George Francis Adams line.' }],
  ['adams_grace', 'Grace Adams', { father: 'adams_alexander_william_col', mother: 'martin_mary_louisa' }],
  ['brannan_katherine_a', 'Katherine A. Brannan (Adams)', {}],
  ['adams_caleb_francis', 'Caleb Francis Adams', { father: 'adams_frank_1879', mother: 'brannan_katherine_a', spouses: [['reece_hallie_ione', '12 Oct 1935']] }],
  ['adams_frances_m_1905', 'Frances M. Adams', { father: 'adams_frank_1879', mother: 'brannan_katherine_a' }],
  ['adams_frank_jr_1905', 'Frank Adams Jr.', { father: 'adams_frank_1879', mother: 'brannan_katherine_a', spouses: [['bridges_beula', '20 Aug 1928']] }],
  ['adams_cecelia_m', 'Cecelia M. Adams', { father: 'adams_frank_1879', mother: 'brannan_katherine_a' }],
  ['adams_john_j_1916', 'John J. Adams', { father: 'adams_frank_1879', mother: 'brannan_katherine_a' }],
  ['reece_hallie_ione', 'Hallie Ione Reece (Adams)', {}],
  ['bridges_beula', 'Beula Bridges (Adams)', {}],
  ['locke_mary_c', 'Mary C. Locke (Adams)', { spouses: [['adams_henry_a', '15 May 1890']] }],
  ['adams_ralph_l', 'Ralph L. Adams', { father: 'adams_henry_a', spouses: [['brandt_pauline', '15 Apr 1913']] }],
  ['brandt_pauline', 'Pauline Brandt (Adams)', {}],
  ['adams_mary_e_1916', 'Mary E. Adams', { father: 'adams_ralph_l', mother: 'brandt_pauline' }],
  ['adams_frances_j_1922', 'Frances J. Adams', { father: 'adams_ralph_l' }],
  ['gosnell_louise_a', 'Louise A. Gosnell (Adams)', { spouses: [['adams_caleb_martin', '4 Oct 1899']] }],
  ['adams_cornelia', 'Cornelia Adams', { father: 'adams_caleb_martin', mother: 'gosnell_louise_a' }],
  ['hall_emily', 'Emily Hall (Adams)', { spouses: [['adams_caleb_martin', '2 Sep 1937']] }],
  ['martin_kaleb', 'Kaleb Martin', { spouses: [['devaw_louisa_woods', null]] }],
  ['devaw_louisa_woods', 'Louisa Woods Devaw (Martin)', {}],
  // James Casper Adams and Adela Kaempfer
  ['adams_minnie_f', 'Minnie F. Adams (Seeley)', { father: 'adams_james_casper', mother: 'kaempfer_adela', spouses: [['seeley_frank_pierce', 'abt 1909']] }],
  ['seeley_frank_pierce', 'Frank Pierce Seeley', {}],
  ['seeley_donald_d', 'Donald D. Seeley', { father: 'seeley_frank_pierce', mother: 'adams_minnie_f' }],
  ['seeley_frances_maxine', 'Frances Maxine Seeley', { father: 'seeley_frank_pierce', mother: 'adams_minnie_f' }],
  ['seeley_alice_n', 'Alice N. Seeley', { father: 'seeley_frank_pierce', mother: 'adams_minnie_f' }],
  ['adams_ethel_e', 'Ethel E. Adams (Mead)', { father: 'adams_james_casper', mother: 'kaempfer_adela' }],
  ['adams_reda_florence', 'Reda Florence Adams (Olsen)', { father: 'adams_james_casper', mother: 'kaempfer_adela' }],
  ['adams_frank_melbourne', 'Frank Melbourne Adams', { father: 'adams_james_casper', mother: 'kaempfer_adela', spouses: [['kendall_estella_l', '12 Apr 1914']] }],
  ['kendall_estella_l', 'Estella L. Kendall (Adams)', {}],
  ['adams_frances_l_1915', 'Frances L. Adams', { father: 'adams_frank_melbourne', mother: 'kendall_estella_l', aliases: ['Frankie Adams'] }],
  ['adams_maxine_a', 'Maxine A. Adams', { father: 'adams_frank_melbourne', mother: 'kendall_estella_l' }],
  ['kaempfer_anton', 'Anton Kaempfer', { spouses: [['pieritz_wilhelmina', null]] }],
  ['pieritz_wilhelmina', 'Wilhelmina Pieritz (Kaempfer)', {}],
  // George Julius Allen and Alberta Adams
  ['allen_henry_eisley', 'Henry Eisley Allen', { father: 'allen_george_julius', mother: 'adams_alberta' }],
  ['allen_william_laurence', 'William Laurence Allen', { father: 'allen_george_julius', mother: 'adams_alberta' }],
  ['allen_marion_lafayette', 'Marion Lafayette Allen', { father: 'allen_george_julius', mother: 'adams_alberta', aliases: ['Fay Allen', 'Marion L. Allen'], spouses: [['muriel_wife_of_fay_allen', 'bef 1930'], ['jiskra_florence_rose', '21 Jul 1938']] }],
  ['allen_helen_loraine', 'Helen Loraine Allen', { father: 'allen_george_julius', mother: 'adams_alberta' }],
  ['muriel_wife_of_fay_allen', 'Muriel', { note: 'First wife of Marion Lafayette "Fay" Allen (married before 1930); surname not recorded.' }],
  ['jiskra_florence_rose', 'Florence Rose Jiskra (Allen)', {}],
  ['allen_dorothy_ann_1943', 'Dorothy Ann Allen (Larkin)', { father: 'allen_marion_lafayette', mother: 'jiskra_florence_rose', spouses: [['larkin_stephen_max', '30 Apr 1965']] }],
  ['larkin_stephen_max', 'Stephen Max Larkin', {}],
  ['billingslea_harold_emerson', 'Harold Emerson Billingslea', { spouses: [['allen_bernice', '11 Jun 1913']] }],
  ['billingslea_frances_fern', 'Frances Fern Billingslea (Scott)', { father: 'billingslea_harold_emerson', mother: 'allen_bernice', spouses: [['scott_howard_e', null]] }],
  ['scott_howard_e', 'Rev. Howard E. Scott', {}],
  ['scott_bernice_elizabeth', 'Bernice Elizabeth Scott', { father: 'scott_howard_e', mother: 'billingslea_frances_fern' }],
  ['billingslea_doris_alberta', 'Doris Alberta Billingslea', { father: 'billingslea_harold_emerson', mother: 'allen_bernice' }],
  ['billingslea_ruth_virginia', 'Ruth Virginia Billingslea (Wagner)', { father: 'billingslea_harold_emerson', mother: 'allen_bernice', spouses: [['wagner_fred_clark', null]] }],
  ['wagner_fred_clark', 'Fred Clark Wagner', {}],
  ['billingslea_harold_emerson_jr', 'Harold Emerson Billingslea Jr.', { father: 'billingslea_harold_emerson', mother: 'allen_bernice' }],
  ['allen_barbara_1934', 'Barbara Allen', { father: 'allen_ralph_kenneth', mother: 'whitman_zella_campbell' }],
  ['allen_judith', 'Judith Allen', { father: 'allen_ralph_kenneth', mother: 'smith_irene_louisa' }],
  ['allen_ralph_kenneth_jr', 'Ralph Kenneth Allen Jr.', { father: 'allen_ralph_kenneth', mother: 'smith_irene_louisa' }],
  ['allen_edward_george', 'Edward George Allen', { father: 'allen_ralph_kenneth', mother: 'smith_irene_louisa' }],
  ['allen_gerald_franklin', 'Gerald Franklin Allen', { father: 'allen_leroy_gaylord', mother: 'eberhart_gladys', spouses: [['peterson_lois_june', '8 Jun 1960']] }],
  ['peterson_lois_june', 'Lois June Peterson (Allen)', {}],
  ['allen_william_rolland', 'William Rolland Allen', { father: 'allen_leroy_gaylord', mother: 'eberhart_gladys' }],
  ['charters_william_allen', 'William Allen Charters', { father: 'charters_john_dixon', mother: 'allen_frances_rosetta' }],
  // Ancestors and siblings of people already in the tree
  ['lane_john_s', 'John S. Lane', { note: 'Father of Cynthia Lane. His 1851 land warrant in Chariton County, Missouri, included the parcel later patented by George Francis Adams (#1).' }],
  ['hamilton_thomas', 'Thomas Hamilton', { father: 'hamilton_francis', note: 'Brother of Elizabeth (Eliza) Hamilton; Jose Pierre Adams, his brother-in-law, administered his estate (final account May 1836).' }],
  ['wheeler_melvin', 'Melvin Wheeler', { note: 'Father of Dorothy Ann Wheeler; walked her down the aisle at her 1944 wedding (wedding notice in Bill Allen\'s document).' }],
];
const CHILD_OF = { lane_cynthia: { father: 'lane_john_s' }, martin_mary_louisa: { father: 'martin_kaleb', mother: 'devaw_louisa_woods' }, kaempfer_adela: { father: 'kaempfer_anton', mother: 'pieritz_wilhelmina' }, wheeler_dorothy_ann: { father: 'wheeler_melvin' } };

const blank = (id, name) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [SRC], notes: [], aliases: [] });
const ensure = p => { for (const k of ['locations', 'milestones', 'notable_stories', 'career', 'education', 'notes', 'sources', 'aliases']) p[k] = p[k] || []; };
const cite = f => ` [Bill Allen, Descendants of Jose Pierre Adams, line ${f.lines.join(', ')}]`;
let created = 0, updated = 0;

// 1. people and their own facts
for (const [id, name, x] of FAMILY) {
  const isNew = !exists(id);
  const p = isNew ? blank(id, name) : load(id); ensure(p);
  if (isNew) created++;
  p.name = name;
  for (const a of x.aliases || []) add(p.aliases, a);
  if (x.note) note(p, x.note);
  add(p.sources, SRC);
  for (const f of (IMP.people[id] || {}).facts || []) {
    const where = String(f.place || '').trim();
    if (f.kind === 'birth' || f.kind === 'death') {
      if (f.date && (!p[f.kind] || precision(f.date) > precision(p[f.kind]))) p[f.kind] = f.date;
      add(p.locations, where);
      if (f.date || where) { const ms = `${f.kind === 'birth' ? 'Born' : 'Died'} ${[f.date, where].filter(Boolean).join(', ')}`; if (!mentions(p.milestones, ms)) add(p.milestones, ms); }
    } else if (['parent', 'child', 'spouse', 'marriage'].includes(f.kind)) {
      // relationships come from FAMILY; marriage places are picked up below
    } else if (['burial', 'military', 'religion', 'divorce'].includes(f.kind)) {
      if (!mentions(p.milestones, f.value)) add(p.milestones, f.value + (f.date && !String(f.value).includes(String(yearOf(f.date))) ? ` (${f.date})` : ''));
      add(p.locations, where);
    } else if (f.kind === 'career') { if (!mentions(p.career, f.value)) add(p.career, f.value); }
    else if (f.kind === 'education') { if (!mentions(p.education, f.value)) add(p.education, f.value); }
    else if (f.kind === 'story') { if (!mentions(p.notable_stories, f.value)) add(p.notable_stories, f.value); }
    else if (f.kind === 'residence') { if (where) add(p.locations, where); else if (!mentions(p.notes, f.value)) add(p.notes, f.value + cite(f)); }
    else if (!mentions(p.notes, f.value)) add(p.notes, f.value + cite(f));
  }
  save(p);
}

// 2. parents and children
const setParent = (kidId, field, parId) => {
  if (!parId) return;
  const k = load(kidId);
  if (k.relationships[field] && k.relationships[field] !== parId) { console.warn(`${kidId}.${field} already ${k.relationships[field]}; not changing to ${parId}`); return; }
  if (k.relationships[field] !== parId) { k.relationships[field] = parId; save(k); updated++; }
  const par = load(parId); par.relationships.children = par.relationships.children || [];
  if (add(par.relationships.children, kidId)) save(par);
};
for (const [id, , x] of FAMILY) { setParent(id, 'father', x.father); setParent(id, 'mother', x.mother); }
for (const [kid, par] of Object.entries(CHILD_OF)) { setParent(kid, 'father', par.father); setParent(kid, 'mother', par.mother); }

// 3. marriages (with the place from either partner's readings, when given)
const marriagePlace = (a, b, date) => {
  for (const id of [a, b]) for (const f of (IMP.people[id] || {}).facts || []) if (f.kind === 'marriage' && f.date && date && yearOf(f.date) === yearOf(date) && f.place) return String(f.place).trim();
  return null;
};
for (const [id, , x] of FAMILY) for (const [sp, date] of x.spouses || []) {
  for (const [a, b] of [[id, sp], [sp, id]]) {
    const pa = load(a), r = pa.relationships; ensure(pa);
    if (!r.spouse) r.spouse = b;
    else if (r.spouse !== b) { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, b); }
    const other = load(b);
    const first = norm(other.name).split(' ')[0];
    const where = marriagePlace(a, b, date);
    const text = `Married ${other.name}` + (date ? ` (m. ${[date, where].filter(Boolean).join(', ')})` : '');
    const i = pa.milestones.findIndex(m => /^married\b/i.test(m) && norm(m).includes(first));
    if (i < 0) pa.milestones.push(text); else if (date && !/\(m\./.test(pa.milestones[i])) pa.milestones[i] = text;
    add(pa.sources, SRC);
    save(pa);
  }
}
console.log(JSON.stringify({ people_in_list: FAMILY.length, created, parent_links_set: updated }));
