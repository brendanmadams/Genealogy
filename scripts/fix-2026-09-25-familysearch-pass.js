#!/usr/bin/env node
/**
 * 2026-09-25, FamilySearch pass over open items:
 *  - Marrion (Hinds) Walker's mother: Florence Clara Goodenough, with her
 *    Whitney, Hinds and Bird marriages, her Goodenough/Hazzard parents and her
 *    Whitney children (Marrion's half-siblings). The 1970 Oregonian obituary of
 *    Florence C. Bird names "Mrs John Walker" as a daughter.
 *  - Dorothy Douthit Pfander's dates and parents (Iowa county births, 1900
 *    census, NUMIDENT).
 *  - Bertha Simons's first marriage, to Forest Noyes, Skagit County, 1902.
 *  - Emily Lynn's Irish civil registration (still unlinked to ours).
 * Re-runnable.
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

// ── sources ─────────────────────────────────────────────────────────────────
const NUMIDENT = 'FamilySearch, United States, Social Security Numerical Identification Files (NUMIDENT), 1936-2007 (Marrion R. Walker, born 26 Nov 1920 St. Louis, parents Hershel H. Hinds and Florence C. Goodenough; ark 1:1:6KW5-TWBR)';
const OBIT70 = 'The Oregonian (Portland), 22 Jun 1970, obituary of Florence C. Bird (via FamilySearch / GenealogyBank, ark 1:1:Q5Q4-GBJ3)';
const ORDI = 'FamilySearch, Oregon, Death Index, 1903-1998 (Florence C. Bird, 20 Jun 1970, Multnomah County, certificate 9457)';
const FAGF = 'Find a Grave index (Florence C. Bird, 1892–1970, Portland, Multnomah County)';
const MOM1910 = 'FamilySearch, Missouri, Marriages, 1750-1920 (Florence C. Goodenough and Wm. Whitney Jr., St. Louis, 31 Mar 1910; ark 1:1:HQGT-TH6Z; licence 29 Mar 1910 in Missouri, County Marriage, Naturalization, and Court Records)';
const MOM1923 = 'FamilySearch, Missouri, County Marriage, Naturalization, and Court Records, 1800-1991 (Lee Herschell Hinds and Florence C. Whitney, St. Louis, 23 Oct 1923, page 272185; ark 1:1:6DL7-M8GP)';
const C1920 = 'FamilySearch, United States Census, 1920 (St. Louis Ward 27, Missouri; household of William H. Whitney)';
const C1940 = 'FamilySearch, United States Census, 1940 (Election Precinct 437 Brentwood, Multnomah County, Oregon; ED 26-58, sheet 8A, line 7; household of Andrew F. Bird; ark 1:1:VRTC-B3T)';
const C1950 = 'FamilySearch, United States Census, 1950 (Multnomah County, Oregon; household of Andrew F. Bird)';
const C1900G = 'FamilySearch, United States Census, 1900 (St. Louis city Ward 27, precinct 12, Missouri; household of William J. Goodenough)';
const FSTREE = 'FamilySearch Family Tree, Florence Clara Goodenough (LHDT-6PY), William Johnston Goodenough (L4WY-DPS), Eliza E. Hazzard (L4WY-D5S) and Lee Herschel Hinds (G9YG-XHN); a shared tree, used as a guide only';
const SSDI = 'FamilySearch, United States Social Security Death Index (Marrion R. Walker, 26 Nov 1920 – 20 Mar 2001, Benton County, Washington)';
const WAM1902 = 'FamilySearch, Washington, County Marriages, 1855-2008 (Forest Noyes and Bertha Simons, Burlington, Skagit County, 2 Nov 1902; licence 22 Oct 1902; arks 1:1:QPMN-B457, QPMR-C8GR)';
const IAB = 'FamilySearch, Iowa, County Births, 1880-1935 (Dorothy D. Pfander, 14 Nov 1899, Lincoln Township, Page County; arks 1:1:V461-KS9, XV6F-P52)';
const C1900P = 'FamilySearch, United States Census, 1900 (Lincoln Township, Page County, Iowa; household of Joseph V. Pfander; ark 1:1:M9LQ-SX1)';
const NUMP = 'FamilySearch, United States, Social Security Numerical Identification Files (NUMIDENT), 1936-2007 (Dorothy Douthit Pfander, born 14 Nov 1899 Coin, Page County, Iowa, died 1 May 1993; parents Joseph V. Pfander and Mary C. Douthit; ark 1:1:6K44-3612)';
const IECR = 'FamilySearch, Ireland Civil Registration, 1845-1913 (Emily Lynn, born 9 Jan 1868, Ballywatermoy, Ahoghill, Ballymena registration district, County Antrim; parents John Lynn and Charlotte Montgomery; ark 1:1:QL34-9G74)';

// ── Marrion ─────────────────────────────────────────────────────────────────
edit('hinds_marrion_roma', [NUMIDENT, OBIT70, SSDI, C1940], p => {
  for (const l of ['Brentwood, Multnomah County, Oregon', 'Vancouver, Clark County, Washington']) add(p.locations, l);
  add(p.aliases, 'Marrion Roma Hinds');
  swapNote(p, 'UNPROVEN alternative: Ed Simons\'s Ancestry tree names her mother as Roma Eloise Abernathy',
    'Her mother is settled: her own Social Security application of July 1942, indexed in the NUMIDENT files, gives her birth as 26 Nov 1920 at St. Louis to Hershel H. Hinds and Florence C. Goodenough, and the Oregonian obituary of Florence C. Bird (22 Jun 1970) lists "Mrs John Walker" among Florence\'s children, beside Elmer Whitney, Harrell Whitney and Harriet Andrews. In 1940 the Birds lived in the same Brentwood election precinct (437) as Marrion and Sheldon Dolan. Ed Simons\'s tree names her mother as Roma Eloise Abernathy from a community tree; Roma was real (born 27 Jun 1902 at Perryville, Missouri, daughter of William H. Abernathy and Effie Cashion; at home on Shenandoah Avenue, St. Louis, in January 1920; married John J. Wilkins; died at Overland, St. Louis County, 21 Oct 1935; Missouri death certificate 33843), but nothing now connects her to Marrion beyond the shared name. Her birth certificate (St. Louis, 1920, not online) would confirm which surname she was born under.');
  note(p, 'Her father is less settled than her mother. Florence was the wife of William H. Whitney Jr. from March 1910 and still in his household in January 1920, ten months before Marrion\'s birth, and did not marry a Hinds until 23 Oct 1923 (Lee Herschell Hinds, St. Louis). Either Hershel Hinds was her birth father, or she was born a Whitney and took the Hinds name after 1923; her 1937 marriage record and 1942 Social Security application both name Hinds. Her half-siblings through Florence are Albert Earl, Elmer and Harrell Whitney and Harriet (Andrews).');
});

// ── Florence and her husbands ───────────────────────────────────────────────
edit('goodenough_florence_c', [NUMIDENT, OBIT70, ORDI, FAGF, MOM1910, MOM1923, C1920, C1940, C1950, C1900G, FSTREE], p => {
  p.name = 'Florence Clara Goodenough (Whitney, Hinds, Bird)';
  refine(p, 'birth', 'Feb 1892');
  refine(p, 'death', '20 Jun 1970');
  for (const l of ['St. Louis, Missouri', 'Vancouver, Clark County, Washington', 'Brentwood, Multnomah County, Oregon', 'Portland, Multnomah County, Oregon']) add(p.locations, l);
  for (const a of ['Florence C. Whitney', 'Florence C. Bird', 'Florence Clara Goodenough']) add(p.aliases, a);
  note(p, 'Born Feb 1892 in Missouri, daughter of William J. Goodenough, an Englishman from the Isle of Wight, and Eliza E. Hazzard; at home in St. Louis Ward 27 in 1900 with Edgar, Irwin, Myrtle, George and Jessie (1900 census; the FamilySearch tree of the family). Inferred: the census household is the link between her and the Goodenough parents.');
  note(p, 'Married three times: William Henry Whitney Jr. at St. Louis on 31 Mar 1910 (licence 29 Mar), with whom she had Albert Earl (about 1910), Elmer (about 1911) and Harrell (about 1915), and was living in St. Louis Ward 27 in 1920; Lee Herschell Hinds at St. Louis on 23 Oct 1923, as Florence C. Whitney; and Andrew Francis Bird, born in New York about 1876–1879, at Vancouver, Washington, on 8 Jun 1933 (the FamilySearch tree; the 1933 marriage not yet seen in the index). In 1940 she and Andrew, 64, lived in Election Precinct 437 Brentwood, Multnomah County, Oregon, the same precinct as her daughter Marrion and Sheldon Dolan; in 1950 still in Multnomah County with her son Elmer M. Whitney.');
  note(p, 'Died 20 Jun 1970 in Multnomah County (Oregon death index, certificate 9457, which gives her age as 92, an indexing slip for 78). Her obituary in the Oregonian of 22 Jun 1970 names her children Elmer Whitney, Harriet Andrews, Harrell and Mrs John Walker, that is Marrion. Buried at Portland (Find a Grave, 1892–1970).');
});
edit('hinds_hershel', [NUMIDENT, MOM1923, FSTREE], p => {
  add(p.aliases, 'Hershel H. Hinds');
  swapNote(p, 'Father of Marrion Roma Hinds, born 26 Nov 1920',
    'Named as Hershel H. Hinds, father of Marrion Roma Hinds, on Marrion\'s own Social Security application of 1942 and as Hershel Hinds on her 1937 marriage record. The only Hinds marriage found for Florence is that of Lee Herschell Hinds and Florence C. Whitney at St. Louis on 23 Oct 1923, three years after Marrion\'s birth; see Marrion\'s record for what that leaves open. Not yet found in a census with Florence; a Merritt Hershel Hinds, born Aug 1894 in Missouri, lived in Greene County in 1900, a lead only.');
  note(p, 'UNPROVEN: the FamilySearch tree attaches the 1923 marriage to a Lee Herschel Hinds born 20 Apr 1888 at Clinton, Indiana, who died 26 Jun 1957 at Indianapolis, with other wives Mary Ennis (1907), Florence Martha Fuller (1928) and Flossie Lanham (1953), and who was at Frankfort, Indiana, in 1930. If that is the right man, the marriage to Florence ended by 1928.');
});
person('whitney_william_henry_jr', 'William Henry Whitney Jr.', 'M', [MOM1910, C1920, FSTREE], p => {
  refine(p, 'birth', '1890'); refine(p, 'death', '1970');
  add(p.locations, 'St. Louis, Missouri');
  add(p.aliases, 'Wm. Whitney Jr.');
  note(p, 'Married Florence C. Goodenough at St. Louis on 31 Mar 1910; head of the household in St. Louis Ward 27 in 1920 with Florence and sons Albert, Elmer and Harrel. Dates 1890–1970 from the FamilySearch tree only.');
});
person('bird_andrew_francis', 'Andrew Francis Bird', 'M', [C1940, C1950, FSTREE], p => {
  refine(p, 'birth', 'abt 1879'); refine(p, 'death', '1956');
  for (const l of ['New York', 'Brentwood, Multnomah County, Oregon']) add(p.locations, l);
  add(p.aliases, 'Andrew F. Bird');
  note(p, 'Born in New York (1940 census, aged 64, so about 1876; the FamilySearch tree gives 1879 and a death in 1956). Married Florence C. (Goodenough) Hinds at Vancouver, Washington, on 8 Jun 1933 (the tree); head of the household in Election Precinct 437 Brentwood, Multnomah County, in 1940, and in Multnomah County in 1950.');
});
wed('goodenough_florence_c', 'whitney_william_henry_jr');
wed('goodenough_florence_c', 'bird_andrew_francis');

// Whitney half-siblings of Marrion
const WHITNEY = [
  ['whitney_albert_earl', 'Albert Earl Whitney', 'abt 1910', 'Son of William H. Whitney Jr. and Florence C. Goodenough; aged 9 in St. Louis Ward 27 in 1920. A San Francisco County record names his parents as William Whitney and Florence Clara Goodenough.'],
  ['whitney_elmer_m', 'Elmer M. Whitney', 'abt 1911', 'Son of William H. Whitney Jr. and Florence C. Goodenough; aged 8 in St. Louis Ward 27 in 1920, with his mother and stepfather Andrew F. Bird in Multnomah County in 1950, and named first among her children in her 1970 obituary.'],
  ['whitney_harrell', 'Harrell Whitney', 'abt 1915', 'Son of William H. Whitney Jr. and Florence C. Goodenough; Harrel, aged 4, in St. Louis Ward 27 in 1920; "Harrell" in his mother\'s 1970 obituary.'],
];
for (const [id, name, b, text] of WHITNEY) person(id, name, 'M', [C1920, OBIT70], p => { refine(p, 'birth', b); add(p.locations, 'St. Louis, Missouri'); note(p, text); });
for (const [id] of WHITNEY) child(id, 'whitney_william_henry_jr', 'goodenough_florence_c');
person('andrews_harriet', 'Harriet (Andrews)', 'F', [OBIT70], p => {
  note(p, 'Named as Harriet Andrews, a daughter, in the Oregonian obituary of Florence C. Bird, 22 Jun 1970. Her birth surname (Whitney or Hinds) and dates are not yet known; she is not in the 1920 Whitney household, so she was born after January 1920 and could be a full sister of Marrion.');
});
child('andrews_harriet', '', 'goodenough_florence_c');

// Goodenough parents
person('goodenough_william_johnston', 'William Johnston Goodenough', 'M', [C1900G, FSTREE], p => {
  refine(p, 'birth', '14 Jun 1866'); refine(p, 'death', 'Jan 1937');
  for (const l of ['West Cowes, Isle of Wight, England', 'St. Louis, Missouri', 'Saint Peters Cemetery, Normandy, St. Louis County, Missouri']) add(p.locations, l);
  add(p.aliases, 'William J. Goodenough');
  note(p, 'Born 14 Jun 1866 at West Cowes, Isle of Wight (the FamilySearch tree, which cites six sources); came to the United States in 1882; married Eliza E. Hazzard at St. Louis on 5 Jan 1887; in St. Louis Ward 27 in 1900 with Eliza and children including Florence. Died Jan 1937 at St. Louis and buried at Saint Peters Cemetery, Normandy (the tree). Nine children are attached to the couple on the tree.');
});
person('hazzard_eliza_e', 'Eliza E. Hazzard (Goodenough)', 'F', [C1900G, FSTREE], p => {
  refine(p, 'birth', 'Feb 1870'); refine(p, 'death', '1961');
  for (const l of ['St. Louis, Missouri', 'Oregon']) add(p.locations, l);
  add(p.aliases, 'Eliza Goodenough');
  note(p, 'Born Feb 1870 in Missouri; married William J. Goodenough at St. Louis on 5 Jan 1887; died in Oregon in 1961, having presumably followed her daughter Florence west (the FamilySearch tree). UNPROVEN, from the tree only: daughter of Daniel Hazzard (1833–1885) and Frances Caroline Rust (1833–1910).');
});
wed('goodenough_william_johnston', 'hazzard_eliza_e');
child('goodenough_florence_c', 'goodenough_william_johnston', 'hazzard_eliza_e');

// ── Dorothy Douthit Pfander ────────────────────────────────────────────────
edit('pfander_dorothy_douthit', [IAB, C1900P, NUMP], p => {
  refine(p, 'birth', '14 Nov 1899'); refine(p, 'death', '1 May 1993');
  for (const l of ['Lincoln Township (Coin), Page County, Iowa', 'Duarte, Los Angeles County, California']) add(p.locations, l);
  add(p.aliases, 'Dorothy D. Pfander');
  note(p, 'Born 14 Nov 1899 in Lincoln Township (Coin), Page County, Iowa, daughter of Joseph V. Pfander and Mary C. Douthit (Iowa county birth register; 1900 census, in which she is five months old with sisters Eva, Bessie and Nellie B. and brother Allen V.). Her Social Security file gives the same parents and her death on 1 May 1993; the FamilySearch tree places the death at Duarte, California.');
});
person('pfander_joseph_v', 'Joseph V. Pfander', 'M', [C1900P, IAB, NUMP], p => {
  refine(p, 'birth', 'Jul 1855');
  add(p.locations, 'Lincoln Township, Page County, Iowa');
  note(p, 'Born Jul 1855 in Iowa; farmer at Lincoln Township, Page County, in 1900 with wife Mary C., married about 1880, and children Eva, Bessie, Allen V., Nellie B. and Dorothy D. (1900 census). UNPROVEN, from the FamilySearch tree: son of Abraham and Elizabeth Pfander.');
});
person('douthit_mary_c', 'Mary C. Douthit (Pfander)', 'F', [C1900P, IAB, NUMP], p => {
  add(p.locations, 'Lincoln Township, Page County, Iowa');
  add(p.aliases, 'Mary C. Pfander');
  note(p, 'Wife of Joseph V. Pfander and mother of Dorothy Douthit Pfander; her maiden name Douthit is on Dorothy\'s Social Security file and became Dorothy\'s middle name (1900 census; Iowa county birth register).');
});
wed('pfander_joseph_v', 'douthit_mary_c');
child('pfander_dorothy_douthit', 'pfander_joseph_v', 'douthit_mary_c');

// ── Bertha Simons ───────────────────────────────────────────────────────────
edit('simons_bertha', [WAM1902], p => {
  p.name = 'Bertha Simons (Noyes, Harrington)';
  add(p.locations, 'Burlington, Skagit County, Washington');
  add(p.aliases, 'Bertha Noyes');
  note(p, 'Married first Forest Noyes at Burlington, Skagit County, Washington, on 2 Nov 1902 (licence 22 Oct), aged 16, born 1886; the record names her parents Aaron Simons and Hattie Mickles and his parents George Noyes and Lottie Smith (Washington county marriages). This is the earliest record of the family in Washington. Her later husband was Harry H. Harrington.');
});
person('noyes_forest', 'Forest Noyes', 'M', [WAM1902], p => {
  add(p.locations, 'Burlington, Skagit County, Washington');
  note(p, 'Married Bertha Simons at Burlington, Skagit County, on 2 Nov 1902; son of George Noyes and Lottie Smith (Washington county marriages).');
});
wed('simons_bertha', 'noyes_forest');
edit('simons_aaron', [WAM1902], p => { add(p.locations, 'Skagit County, Washington'); note(p, 'The family had reached Washington by the autumn of 1902, when daughter Bertha married Forest Noyes at Burlington, Skagit County, naming her parents as Aaron Simons and Hattie Mickles (Washington county marriages).'); });
edit('simons_harriet_hattie', [WAM1902], p => { note(p, 'Named as Hattie Mickles, mother of the bride, at Bertha\'s marriage to Forest Noyes at Burlington, Skagit County, on 2 Nov 1902 (Washington county marriages).'); });

// ── Emily Lynn ──────────────────────────────────────────────────────────────
edit('lynn_emily_mariam', [IECR], p => {
  note(p, 'The Galgorm baptism has a matching civil registration: Emily Lynn, born 9 Jan 1868 at Ballywatermoy, Ahoghill, in the Ballymena district, County Antrim, to John Lynn and Charlotte Montgomery (Ireland civil registration). It remains UNPROVEN that this is our Emily; her 1937 Maryland death certificate is still the record to find.');
});
console.log('FamilySearch pass applied');
