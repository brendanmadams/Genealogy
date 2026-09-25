#!/usr/bin/env node
/**
 * 2026-09-25, Marrion (Hinds) Walker was adopted. Ed Simons's family account
 * (relayed by Brendan Adams): her birth mother was Roma Eloise Abernathy, who
 * had her in a Salvation Army home for unwed mothers in St. Louis; the birth
 * father is unknown; the Hinds, who raised her, are presumed to have known
 * Roma. A 23andMe match between Mary (Walker) Simons and Roma's granddaughter
 * Nancy Wilkins supports it. Records for Roma, her parents and her Wilkins
 * family from FamilySearch; the Hinds become adoptive parents (new
 * relationships.adopted / birth_mother fields). Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const swapNote = (p, from, to) => { const i = p.notes.findIndex(n => n.startsWith(from)); if (i >= 0) p.notes[i] = to; else note(p, to); };

const ED = 'Ed Simons, family account of Marrion\'s adoption, relayed by Brendan Adams, 25 Sep 2026';
const DNA = '23andMe DNA match between Mary (Walker) Simons and Nancy Wilkins, at first-cousin level (reported by Ed Simons, 2026)';
const EDTREE = 'Ancestry.com, public member tree of Ed Simons (tree 189265374), Marrion Louise (Roma) Abernathy (Hinds) and Roma Eloise Abernathy';
const MODC = 'Missouri State Archives, Missouri Death Certificates, 1910–1975, certificate 33843 (Roma E. Wilkins, 21 Oct 1935, St. Louis County)';
const FAGR = 'Find a Grave index (Roma Eloise Abernathy Wilkins, 27 Jun 1902 – 21 Oct 1935, Oak Hill Cemetery, Kirkwood, St. Louis County; via FamilySearch ark 1:1:QVL9-6KR5)';
const C1910 = 'FamilySearch, United States Census, 1910 (St. Louis Ward 12; household of William H. Abernathy; ark 1:1:M21F-B3Q)';
const C1920 = 'Ancestry.com, 1920 United States Federal Census (St. Louis Ward 13, Missouri; Shenandoah Avenue; household of William Abernathy)';
const C1930 = 'FamilySearch, United States Census, 1930 (Central Township, St. Louis County, Missouri; household of John Wilkins, 30; ark 1:1:XHNB-RCC)';
const C1940 = 'FamilySearch, United States Census, 1940 (Normandy Township, St. Louis County, Missouri; household of John J. Wilkins with sons Pierre R. and John J.; ark 1:1:K7WD-SLY)';
const NUMW = 'FamilySearch, United States, Social Security Numerical Identification Files (NUMIDENT), 1936-2007 (John Julien Wilkins Jr., born 21 Sep 1923 Kirkwood, died 17 Dec 1994, ark 1:1:6KW4-SFL4; Pierre Robert Wilkins, born 14 Oct 1932 St. Louis, died 6 Oct 1998, ark 1:1:6KWW-R3B4; parents John J. Wilkins and Roma Abernathy)';
const MOM1894 = 'FamilySearch, Missouri, County Marriage, Naturalization, and Court Records, 1800-1991 (William H. Abernathy and Effie E. Cashion, Perry County, 24 May 1894; ark 1:1:WP3K-JYMM)';
const C1900 = 'FamilySearch, United States Census, 1900 (Cinque Hommes Township, Perry County, Missouri; household of William H. Abernathy; ark 1:1:M383-81P)';
const C1930A = 'FamilySearch, United States Census, 1930 (Carondelet, St. Louis, Missouri; household of William H. Abernathy; ark 1:1:XHN5-RF7)';
const FAGW = 'Find a Grave index (William Hervey Abernathy, 10 Jul 1872 – 26 Oct 1939, Oak Grove Cemetery, Levels, Hampshire County, West Virginia; via FamilySearch ark 1:1:QVGQ-6PVW)';

// ── Marrion ─────────────────────────────────────────────────────────────────
edit('hinds_marrion_roma', [ED, DNA, EDTREE], p => {
  p.relationships.adopted = true;
  p.relationships.birth_mother = 'abernathy_roma_eloise';
  add(p.aliases, 'Marrion Louise Abernathy');
  swapNote(p, 'Her mother is settled:',
    'Adopted. Her birth mother was Roma Eloise Abernathy (1902–1935) of St. Louis, who, by the family\'s account, "got into trouble" at seventeen and had Marrion in a Salvation Army home for unwed mothers; Roma was at home on Shenandoah Avenue, single, in January 1920, and Marrion was born that November. The Hinds, who raised her, are presumed to have known Roma. Roma later married John J. Wilkins and had two sons, and a 23andMe match at first-cousin level between Marrion\'s daughter Mary and Roma\'s granddaughter Nancy Wilkins confirms the blood line (Ed Simons, 2026; the tree of Ed Simons, which names her Marrion Louise (Roma) Abernathy). Her birth father is unknown.');
  swapNote(p, 'Her father is less settled',
    'Her adoptive parents were Hershel H. Hinds and Florence Clara (Goodenough) Whitney Hinds, later Bird: Marrion named them as her parents at her 1937 marriage and on her 1942 Social Security application, and Florence\'s 1970 obituary lists "Mrs John Walker" among her children. Florence was still the wife of William H. Whitney Jr. in January 1920 and married Lee Herschell Hinds at St. Louis in October 1923, so Marrion was probably taken in as an infant and formally became a Hinds after that marriage. Her adoptive siblings through Florence are Albert Earl, Elmer and Harrell Whitney and Harriet (Andrews). In 1940 the Birds lived in the same Brentwood precinct as Marrion and Sheldon Dolan.');
  note(p, 'Her middle name Roma is her birth mother\'s, and she and John Walker named their first daughter Roma Florence, for her birth mother and her adoptive mother together (family account, 2026).');
});

// ── Roma and the Wilkins family ─────────────────────────────────────────────
person('abernathy_roma_eloise', 'Roma Eloise Abernathy (Wilkins)', 'F', [MODC, FAGR, C1910, C1920, C1930, NUMW, ED, EDTREE], p => {
  refine(p, 'birth', '27 Jun 1902'); refine(p, 'death', '21 Oct 1935');
  for (const l of ['Perryville, Perry County, Missouri', 'St. Louis, Missouri', 'Shenandoah Avenue, St. Louis (1920)', 'Central Township, St. Louis County, Missouri', 'Overland, St. Louis County, Missouri', 'Oak Hill Cemetery, Kirkwood, St. Louis County, Missouri']) add(p.locations, l);
  for (const a of ['Roma E. Wilkins', 'Roma Abernathy']) add(p.aliases, a);
  note(p, 'Birth mother of Marrion Roma (Hinds) Walker. Born 27 Jun 1902 at Perryville, Missouri, daughter of William H. Abernathy and Effie E. Cashion (Missouri death certificate 33843; Find a Grave; Ed Simons\'s tree gives 1903). At home in St. Louis Ward 12 in 1910 with her sisters Mary M. and Beulah E. and brother Robert F., and on Shenandoah Avenue, aged 17 and single, in January 1920. By the family\'s account she had Marrion that November in a Salvation Army home for unwed mothers and gave her up to the Hinds, whom she is thought to have known; Marrion kept Roma as her middle name and later named a daughter for her (Ed Simons, 2026).');
  note(p, 'Married John J. Wilkins, born about 1900 in Missouri, before September 1923; in 1930 they lived in Central Township, St. Louis County, with their son John J., 6. Their sons were John Julien Wilkins Jr. (1923–1994) and Pierre Robert Wilkins (1932–1998), whose Social Security files name her as Roma Abernathy. She died at Overland, St. Louis County, on 21 Oct 1935, aged 33, and was buried at Oak Hill Cemetery, Kirkwood. The family account speaks of two daughters by Wilkins; the records show two sons, and the 1940 census has John a widower with the two boys.');
});
person('wilkins_john_j', 'John J. Wilkins', 'M', [C1930, C1940, NUMW], p => {
  refine(p, 'birth', 'abt 1900');
  for (const l of ['Central Township, St. Louis County, Missouri', 'Normandy Township, St. Louis County, Missouri']) add(p.locations, l);
  note(p, 'Husband of Roma Eloise Abernathy. Born about 1900 in Missouri to Missouri-born parents; head of the household in Central Township, St. Louis County, in 1930 with Roma, 27, and John J., 6, and in Normandy Township in 1940, widowed, with sons Pierre R. and John J. (1930 and 1940 censuses).');
});
wed('abernathy_roma_eloise', 'wilkins_john_j');
person('wilkins_john_julien_jr', 'John Julien Wilkins Jr.', 'M', [NUMW, C1930, C1940], p => {
  refine(p, 'birth', '21 Sep 1923'); refine(p, 'death', '17 Dec 1994');
  add(p.locations, 'Kirkwood, St. Louis County, Missouri');
  note(p, 'Born 21 Sep 1923 at Kirkwood, Missouri, son of John J. Wilkins and Roma Abernathy; died 17 Dec 1994 (Social Security file). Half-brother of Marrion (Hinds) Walker through Roma.');
});
person('wilkins_pierre_robert', 'Pierre Robert Wilkins', 'M', [NUMW, C1940], p => {
  refine(p, 'birth', '14 Oct 1932'); refine(p, 'death', '6 Oct 1998');
  add(p.locations, 'St. Louis, Missouri');
  note(p, 'Born 14 Oct 1932 at St. Louis, son of John J. Wilkins and Roma Abernathy; died 6 Oct 1998 (Social Security file). Half-brother of Marrion (Hinds) Walker through Roma.');
});
for (const id of ['wilkins_john_julien_jr', 'wilkins_pierre_robert']) child(id, 'wilkins_john_j', 'abernathy_roma_eloise');
person('wilkins_nancy', 'Nancy Wilkins', 'F', [ED, DNA], p => {
  add(p.locations, 'Portland, Oregon');
  note(p, 'Granddaughter of Roma Eloise (Abernathy) Wilkins, through one of Roma\'s sons, John Julien Jr. or Pierre Robert (which is not yet known), and so a half first cousin of Mary (Walker) Simons; a 23andMe match to Mary at first-cousin level. She lives in Portland and had two sisters and a brother, of whom one sister is living (Ed Simons, 2026). Not yet linked to her parents.');
});

// ── Roma's parents ──────────────────────────────────────────────────────────
person('abernathy_william_hervey', 'William Hervey Abernathy', 'M', [MOM1894, C1900, C1910, C1920, C1930A, EDTREE, FAGW], p => {
  refine(p, 'birth', 'Jul 1872'); refine(p, 'death', '1939');
  for (const l of ['Perry County, Missouri', 'Cinque Hommes Township, Perry County, Missouri', 'St. Louis, Missouri', 'Carondelet, St. Louis, Missouri']) add(p.locations, l);
  add(p.aliases, 'William H. Abernathy');
  note(p, 'Born Jul 1872 in Missouri; married Effie E. Cashion in Perry County on 24 May 1894; farming at Cinque Hommes Township, Perry County, in 1900 with Carrie R., Mary M. and Beulah E.; in St. Louis Ward 12 in 1910 with Mary M., Robert F., Roma E. and Beulah E.; on Shenandoah Avenue in 1920; at Carondelet in 1930 with Robert F. Ed Simons\'s tree gives his death as 1939. UNPROVEN: a Find a Grave entry for a William Hervey Abernathy, 10 Jul 1872 – 26 Oct 1939, buried at Levels, Hampshire County, West Virginia, may be his.');
});
person('cashion_effie_emily', 'Effie Emily Cashion (Abernathy)', 'F', [MOM1894, C1900, C1910, C1930A, EDTREE], p => {
  refine(p, 'birth', '1869'); refine(p, 'death', '1940');
  for (const l of ['Perry County, Missouri', 'St. Louis, Missouri']) add(p.locations, l);
  add(p.aliases, 'Effie E. Abernathy');
  note(p, 'Married William H. Abernathy in Perry County on 24 May 1894; mother of Carrie Ruth (1895–1906), Mary Marie (1897–1961), Beulah E., Roma Eloise (1902–1935) and Robert F. (born 1905). Dates 1869–1940 from Ed Simons\'s tree.');
});
wed('abernathy_william_hervey', 'cashion_effie_emily');
child('abernathy_roma_eloise', 'abernathy_william_hervey', 'cashion_effie_emily');

// ── the adoptive family ─────────────────────────────────────────────────────
edit('goodenough_florence_c', ED, p => note(p, 'Adoptive mother of Marrion Roma (Hinds) Walker, whose birth mother was Roma Eloise Abernathy (family account, 2026). Marrion named her a parent at her 1937 marriage and in 1942, and Florence\'s 1970 obituary counts her among her children.'));
edit('hinds_hershel', ED, p => note(p, 'Adoptive father of Marrion Roma (Hinds) Walker, whose birth mother was Roma Eloise Abernathy and whose birth father is unknown (family account, 2026).'));
edit('andrews_harriet', ED, p => swapNote(p, 'Named as Harriet Andrews, a daughter, in the Oregonian obituary',
  'Named as Harriet Andrews, a daughter, in the Oregonian obituary of Florence C. Bird, 22 Jun 1970. Her birth surname (Whitney or Hinds) and dates are not yet known; she is not in the 1920 Whitney household. An adoptive sister of Marrion, who was Roma Abernathy\'s daughter by birth.'));
edit('walker_roma_florence', ED, p => note(p, 'Named Roma Florence for her mother\'s birth mother, Roma Eloise Abernathy, and adoptive mother, Florence (Goodenough) Hinds (family account, 2026).'));
console.log('Marrion adoption applied');
