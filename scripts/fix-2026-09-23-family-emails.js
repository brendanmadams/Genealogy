#!/usr/bin/env node
/**
 * 2026-09-23, from the family research emails (2011-2013), as approved by
 * Brendan Adams. Run after import-family-emails-2026-09-23.js. Re-runnable.
 *  1. Decisions: Richard Rotter as father of Kim Zacher's four younger
 *     children (Irma, email 23); Bill Upham as Elaine Simons's later husband
 *     (email 27); George Trumbo; Gavin Hamilton of Mauchline and Helen
 *     Kennedy; Trudy's 1918 recollection noted on George Francis Adams (#2);
 *     "Jesse P. Adams" as an alias of Jose Pierre. Brendan declined the
 *     "Edward G. Adams" alias for George Francis Adams Sr.
 *  2. Family not yet in the tree, mostly from Irma: the McPhails, Michael
 *     and Sarah Kulp's other children, and the Kenoyer, Callaway and Burk
 *     families.
 *  3. Research leads, unclear readings and the writers' open questions, as
 *     labelled notes (data/imports/family-emails-notes-2026-09-23.json).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note, rename } = require('./lib/records');
const SRC = 'Family research emails, 2011–2013 (John and Barbara Adams with Irma Kulp Zacher, George F. Adams, Bill Allen and others)';
const E = (...n) => ` [Family research emails, email ${n.join(', ')}]`;
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [SRC], notes: [], aliases: [] });
const TAG = 'CORRECTION 2026-09-23:';

/** Create or update a record; list fields are merged, scalars only fill blanks. */
function person(id, name, o = {}) {
  const p = exists(id) ? load(id) : blank(id, name);
  for (const k of ['birth', 'death']) if (o[k] && !p[k]) p[k] = o[k];
  for (const k of ['aliases', 'locations', 'milestones', 'career', 'education', 'notable_stories']) for (const v of o[k] || []) { p[k] = p[k] || []; add(p[k], v); }
  for (const v of o.notes || []) note(p, v);
  p.sources = p.sources || []; add(p.sources, SRC);
  save(p); return p;
}
function parents(childId, fatherId, motherId) {
  const c = load(childId);
  if (fatherId) { c.relationships.father = fatherId; const f = load(fatherId); add(f.relationships.children, childId); save(f); }
  if (motherId) { c.relationships.mother = motherId; const m = load(motherId); add(m.relationships.children, childId); save(m); }
  save(c);
}
function marry(aId, bId, { extra = false } = {}) {
  for (const [x, y] of [[aId, bId], [bId, aId]]) {
    const p = load(x); const r = p.relationships;
    if (r.spouse === y || (r._extra_spouses || []).includes(y)) continue;
    if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); }
    save(p);
  }
}
function siblings(aId, bId) { for (const [x, y] of [[aId, bId], [bId, aId]]) { const p = load(x); add(p.relationships.siblings, y); save(p); } }

// ── 1. Decisions ───────────────────────────────────────────────────────────
rename('rotter_spencer', 'zacher_spencer');
{
  const kids = ['zacher_andrew', 'zacher_spencer', 'zacher_amy', 'zacher_jacob'];
  const craig = load('goodman_craig'); craig.relationships.children = craig.relationships.children.filter(k => !kids.includes(k)); add(craig.relationships.children, 'goodman_amber');
  note(craig, `Kim Zacher's first husband; they were married about five years and stayed friends. Father of Amber. Irma writes that Amber's father, Kim's first husband, died in Aug 2009.${E(23)}`);
  save(craig);
  const amber = load('goodman_amber'); amber.relationships.father = 'goodman_craig'; save(amber);
  for (const k of kids) {
    parents(k, 'rotter_richard', 'zacher_kimberly_lynn');
    const p = load(k); note(p, `${TAG} Father changed from Craig Goodman to Richard Rotter. Irma (the grandmother): "Kim remarried 20 years ago Richard Rotter father of her other kids."${E(23)} Decision by Brendan Adams.`); save(p);
  }
}
person('upham_william', 'William “Bill” Upham', { aliases: ['Bill Upham'], locations: ['Gladstone, Oregon'], notes: [`Husband of Elaine Simons at her death in 2011; living in Gladstone, Oregon.${E(27)}`] });
marry('simons_elaine_deretha', 'upham_william', { extra: true });
{ const el = load('simons_elaine_deretha'); note(el, `${TAG} Added her later husband, William "Bill" Upham of Gladstone, Oregon, named in Irma's note about her services.${E(27)}`); save(el); }
for (const id of ['rhinehart_jerry', 'rhinehart_janet', 'rhinehart_les']) { const p = load(id); p.aliases = p.aliases || []; add(p.aliases, p.name.replace('Rhinehart', 'Rinehart')); note(p, `The emails spell the surname Rinehart.${E(27)}`); save(p); }
person('holter_duane', 'Duane Holter', { locations: ['Priest River, Idaho'], notes: [`Husband of Janet (Rinehart) Holter.${E(27)}`] }); marry('rhinehart_janet', 'holter_duane');
person('rinehart_linda', 'Linda Rinehart', { locations: ['Pasco, Washington'], notes: [`Wife of Jerry Rinehart.${E(27)}`] }); marry('rhinehart_jerry', 'rinehart_linda');

{ const g = load('adams_george_francis_2'); note(g, `Sources disagree: his granddaughter Trudy (Gertrude Adams Remy) remembered him dying in 1918, when her father was 2. The death date kept is 7 Feb 1920: he is in the 1920 census (taken 20 Jan 1920), and his NARD Journal obituary appeared 18 Mar 1920.${E(30, 31)} Decision by Brendan Adams.`); save(g); }
{ const j = load('adams_jose_pierre'); j.aliases = j.aliases || []; add(j.aliases, 'Jesse P. Adams'); note(j, `A record from about 1817 names Elizabeth's husband as "Jesse P." Adams; George F. Adams (Jr.) is sure it is Jose.${E(35)}`); save(j); }

person('trumbo_george', 'George Trumbo', { career: ['Worked in the pharmacy with his brother-in-law George F. Adams (#2), before 1920'], notes: [`Brother of Serena "Neenie" Trumbo. An article says he worked in the pharmacy with George F. Adams (#2); the emails ask whether George met Neenie through him.${E(31)}`] });
parents('trumbo_george', 'trumbo_presley_neville', 'buckley_hannah_louise'); siblings('trumbo_george', 'trumbo_serena_marie');

person('hamilton_gavin_mauchline', 'Gavin Hamilton of Mauchline', {
  birth: '1751', death: '1805', aliases: ['Gavin Hamilton', '“The Clerk”'],
  locations: ['Mauchline, Ayrshire, Scotland', 'Mossgiel, near Mauchline, Scotland'],
  career: ['Trained in his father’s law office, then practised as a writer (lawyer) in Mauchline, where he was known as "The Clerk"', 'Factor to the Earl of Loudoun, from whom he leased Mossgiel farm', 'Collector of the stent, the Kirk Session’s poor-relief levy (1775)'],
  milestones: ['Born 1751, Mauchline, Ayrshire, Scotland', 'Died 1805, Mauchline, Ayrshire, Scotland', 'Buried in Mauchline kirkyard; at his request there was no headstone, and the Partick Burns Club placed a plaque on his grave in 1919', 'Married Helen Kennedy', 'Religion: a "New Licht" liberal, pursued by the Rev. William "Daddy" Auld and the Kirk Session; the Presbytery of Ayr found in his favour (25 June 1785)', 'Freemason'],
  notable_stories: ['Friend and patron of the poet Robert Burns. From Martinmas 1784 he sublet Mossgiel farm to Robert and Gilbert Burns, urged Robert to publish his poems by subscription, and was the dedicatee of the 1786 Kilmarnock edition.', 'In March 1788 he asked Burns to stand guarantor for a large sum owed by Gilbert Burns; Burns declined, but the friendship survived.', 'His house and office beside the churchyard at Mauchline were nicknamed "the Castle".'],
  notes: [`Fifth son of John Hamilton of Kype and his first wife, Jacobina Young, per the Burns Encyclopedia text sent in the emails; so a brother of Francis Hamilton (b. 1743), not a direct ancestor. He had eight children, and half-brothers and half-sisters whom he had not seen for years when they were at Harvieston in 1787.${E(21, 22)}`, `Family stories once made him the father of Francis and Eliza Hamilton; the emails conclude he was too old, and John found no Francis born to a Gavin in Scotland between 1710 and 1800.${E(20, 29, 35, 36, 42)}`],
});
parents('hamilton_gavin_mauchline', 'hamilton_john_of_kype', 'young_jacobina');
person('kennedy_helen', 'Helen Kennedy (Hamilton)', { locations: ['Mauchline, Ayrshire, Scotland'], notes: [`Wife of Gavin Hamilton of Mauchline. Her objections led him to sublet Mossgiel farm to Robert Burns rather than use it as a summer retreat.${E(21)}`] });
marry('hamilton_gavin_mauchline', 'kennedy_helen');

// ── 2. Family not yet in the tree ─────────────────────────────────────────
// McPhails (Irma, emails 48-50)
person('mcphail_john_belle', 'John Belle McPhail', {
  birth: 'abt 1850', aliases: ['John B. McPhail'],
  locations: ['Memphis, Tennessee', 'Arkansas', 'Delta Township, Whatcom County, Washington', 'Burk Road, Delta Township, Whatcom County, Washington', 'Lynden, Washington'],
  milestones: ['Moved the family from Tennessee to Arkansas, then by covered wagon from Arkansas to Whatcom County, Washington (May-Sep 1896)', 'Buried in Lynden Cemetery, Lynden, Washington'],
  notes: [`Irma's great-grandfather. In the 1910 census, aged 60, with his wife Ellen R., two farms from Aaron Simons in Delta Township. Their homestead was on the north side of Burk Road, across from the John Kulp homestead.${E(48, 50)}`],
});
person('ball_ellen_rogers', 'Ellen Rogers Ball (McPhail)', { birth: 'abt 1851', aliases: ['Ellen R. McPhail'], locations: ['Delta Township, Whatcom County, Washington', 'Lynden, Washington'], milestones: ['Buried in Lynden Cemetery, Lynden, Washington'], notes: [`Aged 59 in the 1910 census, Delta Township, Whatcom County.${E(48, 50)}`] });
marry('mcphail_john_belle', 'ball_ellen_rogers');
parents('mcphail_mary_emily', 'mcphail_john_belle', 'ball_ellen_rogers');
{ const m = load('mcphail_mary_emily'); note(m, `${TAG} Parents set to John Belle McPhail and Ellen Rogers Ball, from Irma's family notes.${E(48, 50)}`); save(m); }
const MCK = [
  ['mcphail_minnie_belle', 'Minnie Belle McPhail (Weidkamp)', { aliases: ['Minnie Weidkamp', 'Great Aunt Minnie'], locations: ['Memphis, Tennessee', 'Whatcom County, Washington'], milestones: ['Born in Memphis, Tennessee', 'Married Theodore "Ted" Weidkamp (m. 1898, Whatcom County, Washington)'], notes: [`One of the four McPhail girls born in Memphis. She and Ted witnessed her sister Mary's marriage to John Kulp. They had seven sons, among them Theodore Milton Jr. (m. Nellie), Harold (m. Cena), Willard (m. Anne), Ervin (m. Mae), Vernon (m. Lois) and Ira.${E(48)}`] }],
  ['mcphail_draden', 'Draden “Dradie” McPhail (Dunbar)', { aliases: ['Dradie McPhail', 'Draden Dunbar'], locations: ['Memphis, Tennessee', 'Arkansas, Oklahoma and Kansas area'], milestones: ['Born in Memphis, Tennessee'], notes: [`One of the four McPhail girls born in Memphis; married (surname Dunbar) and stayed in the Arkansas, Oklahoma and Kansas area when the family went west.${E(48, 49)}`] }],
  ['mcphail_sarah_rebecca_jane', 'Sarah Rebecca Jane McPhail (Cameron, Converse, Johnson)', { locations: ['Memphis, Tennessee', 'Whatcom County, Washington'], milestones: ['Born in Memphis, Tennessee'], notes: [`One of the four McPhail girls born in Memphis. Married three times, taking the surnames Cameron, Converse and Johnson; lived in Whatcom County.${E(48)}`] }],
  ['mcphail_john_tate', 'John Tate McPhail', { aliases: ['Uncle Tate', 'Tate McPhail'], locations: ['Arkansas', 'Burk Road, Delta Township, Whatcom County, Washington'], milestones: ['Born in Arkansas', 'Married Evelyn', 'Married Beulah'], notes: [`Married first Evelyn, then Beulah. Farmed on the southwest side of Burk Road, west of the Simons farm. He confirmed the births of his nephew Elmer and niece Edith Kulp when they applied for delayed birth certificates. Children included Emogene (King), Boyd and Geraldine (Miller); which wife was their mother is not stated.${E(48)}`] }],
];
for (const [id, name, o] of MCK) { person(id, name, o); parents(id, 'mcphail_john_belle', 'ball_ellen_rogers'); }
person('weidkamp_theodore', 'Theodore “Ted” Weidkamp', { aliases: ['Ted Weidkamp'], locations: ['Whatcom County, Washington'], notes: [`Witness, with Minnie McPhail, at the 1897 marriage of John Kulp and Mary McPhail.${E(48)}`] });
marry('mcphail_minnie_belle', 'weidkamp_theodore');
person('mcphail_emogene', 'Emogene McPhail (King)', { locations: ['Lynden, Washington'], notes: [`Married Truman King; their son Dale King was in Irma's first-grade class in Lynden.${E(48)}`] });
person('mcphail_boyd', 'Boyd McPhail', { locations: ['Burk Road, Delta Township, Whatcom County, Washington'], notes: [`Married Stella; their son Larry McPhail was in Irma's first-grade class and still lives near the Burk Road homesteads.${E(48)}`] });
for (const k of ['mcphail_emogene', 'mcphail_boyd']) parents(k, 'mcphail_john_tate', null);

// Michael and Sarah Kulp's other children (Irma, email 23)
person('kulp_ida', 'Ida Kulp', { birth: '1867', death: 'abt 1876', notes: [`Second child of Michael and Sarah Kulp; died at about nine. Partly raised by her Vancel grandmother, who by family story made her work very hard.${E(23)}`] });
person('kulp_mary_elizabeth', 'Mary Elizabeth Kulp', { birth: '1871', notes: [`Daughter of Michael and Sarah Kulp; after her mother died she was raised by a foster family named Barker.${E(23)}`] });
person('kulp_george_jasper', 'George Jasper Kulp', { birth: 'Dec 1874', locations: ['Kansas'], notes: [`Fourth child of Michael and Sarah Kulp (Irma types the year as 1974). Married and raised a family in Kansas; who raised him after his mother died is unknown.${E(23)}`] });
for (const k of ['kulp_ida', 'kulp_mary_elizabeth', 'kulp_george_jasper']) parents(k, 'kulp_michael_nicholas', 'vancel_sarah');

// Nardin's, Reta's and Dorothy's families (emails 23, 25, 48, 49)
const ALBION = 'Buried in the Albion cemetery, Albion, Washington';
person('kulp_nellie', 'Nellie Kulp', { aliases: ['Aunt Nellie'], locations: ['Albion, Washington'], milestones: [ALBION], notes: [`Wife of Nardin Kulp; her maiden name is not given.${E(23)}`] });
marry('kulp_nardin_ira', 'kulp_nellie');
person('kulp_elvin', 'Elvin Kulp', { death: '2005', locations: ['Albion, Washington'], milestones: [ALBION], notes: [`Son of Nardin and Nellie Kulp. His wife Molly kept Nardin's copy of Dradie's family book.${E(23, 49)}`] });
parents('kulp_elvin', 'kulp_nardin_ira', 'kulp_nellie');
person('callaway_clinton', 'Clinton Callaway', { locations: ['Albion, Washington'], milestones: [ALBION], notes: [`Son of Aunt Reta (Kulp) Callaway.${E(23)}`] });
parents('callaway_clinton', null, 'kulp_reta_may');
person('kenoyer_james_fredrick', 'James Fredrick “Fred” Kenoyer', { aliases: ['Uncle Fred', 'Fred Kenoyer'], locations: ['Albion, Washington'], milestones: [ALBION], notes: [`Husband of Dorothy Kulp; brother of Wright Kenoyer.${E(23, 25)}`] });
marry('kulp_dorothy_belle', 'kenoyer_james_fredrick');
const KEN = [
  ['kenoyer_john_wesley', 'John Wesley “Wes” Kenoyer', { aliases: ['Wes Kenoyer'], locations: ['Albion, Washington'], milestones: [ALBION] }],
  ['kenoyer_dorothy_betty', 'Dorothy “Betty” Kenoyer (Mastrude)', { aliases: ['Betty Kenoyer-Mastrude'], locations: ['Albion, Washington'], milestones: [ALBION] }],
  ['kenoyer_wayne', 'Wayne Kenoyer', { aliases: ['Cousin Wayne'] }],
  ['kenoyer_charles', 'Charles Kenoyer', {}],
];
for (const [id, name, o] of KEN) { person(id, name, { ...o, notes: [`Child of Fred and Dorothy (Kulp) Kenoyer.${E(23, 25)}`] }); parents(id, 'kenoyer_james_fredrick', 'kulp_dorothy_belle'); }
person('kenoyer_patricia', 'Patricia Kenoyer', { aliases: ['Pat Kenoyer'], notes: [`Wife of Wayne Kenoyer. A hobby genealogist who compiled the Kulp lineage list Irma shared; with Rosie Callaway (wife of Kenny Callaway), one of the Kulp family genealogists.${E(23, 48)}`] });
marry('kenoyer_wayne', 'kenoyer_patricia');
person('kenoyer_wright', 'Wright Kenoyer', { notes: [`Brother of Fred Kenoyer.${E(25)}`] }); siblings('kenoyer_wright', 'kenoyer_james_fredrick');
person('hittle_alice', 'Alice Hittle (Kenoyer)', { locations: ['Albion, Washington'], education: ['Went to school in Albion with Elmer Kulp, and later attended Albion school reunions'], notes: [`Wife of Wright Kenoyer. Irma saw her death notice in about 2010 (not confirmed).${E(25)}`] });
marry('kenoyer_wright', 'hittle_alice');

// Ritchey and Burk (emails 48, 50)
person('ritchey_alice', 'Alice Ritchey (Burk)', { aliases: ['Alice Burk', 'Aunt Alice'], death: '2000', locations: ['Burk Road, Delta Township, Whatcom County, Washington'], career: ['Elementary school teacher in Whatcom County'], milestones: ['Married Valentine "Val" Burk (m. abt 1927)'], notes: [`Sister of Amy Ritchey (Kulp).${E(48, 50)}`] });
siblings('ritchey_alice', 'ritchey_amy');
person('burk_valentine', 'Valentine “Val” Burk', { aliases: ['Val Burk'], locations: ['Burk Road, Delta Township, Whatcom County, Washington'], career: ['Farmed the Burk family homestead on Burk Road'], milestones: ['Married Alice Ritchey (m. abt 1927)'], notes: [`In 1930 his and Alice's farm was next to, and part of, the Martin Burk farm; Irma's cousins still owned part of it in 2011. Martin Burk's family lived three farms from the Kulp farm in 1910; the emails imply but do not state that Martin was Val's father.${E(48, 50)}`] });
marry('ritchey_alice', 'burk_valentine');

// Kolb (email 23)
for (const [id, name] of [['kolb_dorthea', 'Dorthea Kolb'], ['kolb_elizabeth', 'Elizabeth Kolb']]) { person(id, name, { notes: [`Child of Peter Kolb and Elizabeth Oberholtzer, from the Kulp lineage list.${E(23)}`] }); parents(id, 'kolb_peter', 'oberholtzer_elizabeth'); }
{ const i = load('kulp_irmagene'); note(i, `Attended the 2009 Kulp McPhail Weidkamp Family Reunion, where Arvella Kulp Layson and other cousins toured the old homestead roads.${E(48)}`); save(i); }

// ── 3. Leads, unclear readings and open questions ─────────────────────────
const N = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'imports', 'family-emails-notes-2026-09-23.json'), 'utf8'));
let n = 0;
for (const { id, text } of N.notes) {
  if (!exists(id)) { console.warn('missing', id); continue; }
  const p = load(id); const before = (p.notes || []).length; note(p, text); p.sources = p.sources || []; add(p.sources, SRC); save(p); n += p.notes.length - before;
}
// ── 4. Tidy places on the records this source touched ─────────────────────
// "Whatcom Co, Washington" and "Whatcom County, Washington" are the same place.
const { DIR } = require('./lib/records');
let tidied = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = load(f.replace(/\.json$/, ''));
  if (!(p.sources || []).includes(SRC) || !Array.isArray(p.locations)) continue;
  const seen = new Set(); const locs = [];
  for (const l of p.locations) {
    const t = String(l).replace(/\b([A-Z][a-z]+) Co\.?(?=,|$)/g, '$1 County');
    const k = t.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(k)) { seen.add(k); locs.push(t); }
  }
  if (JSON.stringify(locs) !== JSON.stringify(p.locations)) { p.locations = locs; save(p); tidied++; }
}
console.log(`decisions applied, new family added, ${n} notes added, places tidied on ${tidied} records`);
