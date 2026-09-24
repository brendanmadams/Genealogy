#!/usr/bin/env node
/**
 * 2026-09-24, record images for David and Draden (Davis) Ball and Ellen
 * (Ball) McPhail's brothers and sisters, from Ancestry.com: the 1833 Roane
 * County marriage bond, the 1850, 1880 and 1900 census pages, Thomas T.
 * Ball's 1924 death certificate and George W. Ball's 1908 will. Adds items
 * to data/media.json and the facts they give to the records; re-runnable.
 * Then run scripts/prepare-media.ps1 and scripts/build.js.
 *  - Also a Hawkins County lead for David's father (1830 census).
 *  - Also Ed Simons's daughter's family, from Sharon Simons.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const MEDIA = path.resolve(__dirname, '..', 'data', 'media.json');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };

const NARA = "Original: National Archives and Records Administration.";
const items = [
  {
    id: 'marriage-1833-ball-davis', kind: 'document',
    file: 'ancestry_ball_davis_marriage_1833.jpg',
    title: 'Marriage bond of David Ball and "Drary" Davis, Roane County, Tennessee, 21 December 1833',
    caption: "Top right, bond no. 1674: David Ball and Wm. Breeden are bound to Governor Wm. Carroll for $1,250, for a marriage to be solemnized in Roane County between David Ball and Drary Davis, 21 Dec 1833. David signed with his mark; witnessed by H. S. Rains. The page also holds the neighbouring bonds and licences of other couples.",
    source: "Tennessee, U.S., Marriage Records, 1780-2002, Roane County; image from Ancestry.com. Original: Tennessee State Library and Archives, county marriage records.",
    people: ['ball_david', 'ball_graden'],
  },
  {
    id: 'census-1850-meigs-ball', kind: 'document',
    file: 'ancestry_1850_census_meigs_ball.jpg',
    title: '1850 census: the Ball household, Subdivision 22, Meigs County, Tennessee',
    caption: 'Dwelling 666, enumerated 17 Oct 1850: David Ball, 36, farmer, and "Darden", 34, with William (17), Samuel (15), Sarah (13), Nancy (10), Thomas (8), George (6), Mary Ann (4) and Martha E. (1), all born in Tennessee. Ellen was born the next year.',
    source: `1850 United States Federal Census, Subdivision 22, Meigs County, Tennessee, page 399b (NARA M432, roll 890); image from Ancestry.com. ${NARA}`,
    people: ['ball_david', 'ball_graden', 'ball_william_henry', 'ball_samuel_g', 'ball_sarah', 'ball_nancy_rebecca', 'ball_thomas_t', 'ball_george_w', 'ball_mary_ann', 'ball_martha_e'],
  },
  {
    id: 'census-1860-mcminn-ball', kind: 'document',
    file: 'ancestry_1860_census_mcminn_ball.jpg',
    title: '1860 census: the Ball household, District 2, McMinn County, Tennessee',
    caption: 'David Ball (48) and "Graden" (Draden) Ball (46) with Nancy, George, Mary Ann, Ellen (9), Margaret and Catharine; post office Ten Mile, Meigs County.',
    source: `1860 United States Federal Census, District 2, McMinn County, Tennessee, page 213 (NARA M653, roll 1262); image from Ancestry.com. ${NARA}`,
    people: ['ball_david', 'ball_graden', 'ball_ellen_rogers', 'ball_nancy_rebecca', 'ball_george_w', 'ball_mary_ann', 'ball_margaret', 'ball_catharine'],
  },
  {
    id: 'census-1870-roane-ball', kind: 'document',
    file: 'ancestry_1870_census_roane_ball.jpg',
    title: '1870 census: the Ball household, District 8, Roane County, Tennessee',
    caption: 'David Ball (55) and "Grodon" (Draden) Ball (42) with Nancy, Mary A., Ellen (18), Margaret and Catharine; post office Erie.',
    source: `1870 United States Federal Census, District 8, Roane County, Tennessee, page 420A (NARA M593, roll 1555); image from Ancestry.com. ${NARA}`,
    people: ['ball_david', 'ball_graden', 'ball_ellen_rogers', 'ball_nancy_rebecca', 'ball_mary_ann', 'ball_margaret', 'ball_catharine'],
  },
  {
    id: 'census-1880-roane-ball', kind: 'document',
    file: 'ancestry_1880_census_roane_ball.jpg',
    title: '1880 census: the Ball household, District 8, Roane County, Tennessee',
    caption: "Lines 25–27, enumerated 8 Jun 1880: David Ball, 66, farm laborer, born in Tennessee, his father born in Virginia and his mother in Tennessee; Drady C., 64, his wife, keeping house, born in Tennessee to parents both born in Virginia; and their daughter Nancy R., 39.",
    source: `1880 United States Federal Census, District 8, Roane County, Tennessee, ED 224, page 328b (NARA T9, roll 1275); image from Ancestry.com. ${NARA}`,
    people: ['ball_david', 'ball_graden', 'ball_nancy_rebecca'],
  },
  {
    id: 'census-1900-mcminn-ball', kind: 'document',
    file: 'ancestry_1900_census_mcminn_ball.jpg',
    title: '1900 census: Drady Ball and her son George W. Ball, Civil District 2, McMinn County, Tennessee',
    caption: "Lines 84–89, enumerated 4 Jun 1900. Dwelling 54: Drady Ball, head, born Jan 1816, 84, widowed, the mother of 11 children, 9 of them living, born in Tennessee, her father in Tennessee and her mother in Virginia; and her daughter Nancy R., born Mar 1841, single. Dwelling 55: George W. Ball, born Oct 1844, widowed, farmer, with his son John F. (Oct 1872) and daughters Hattie E. (Aug 1879) and Martha (Dec 1882).",
    source: `1900 United States Federal Census, Civil District 2, McMinn County, Tennessee, ED 78, sheet 13B (NARA T623, roll 1585); image from Ancestry.com. ${NARA}`,
    people: ['ball_graden', 'ball_nancy_rebecca', 'ball_george_w'],
  },
  {
    id: 'death-1924-thomas-t-ball', kind: 'document',
    file: 'ancestry_death_1924_thomas_t_ball.jpg',
    title: 'Death certificate of Thomas T. Ball, McMinn County, Tennessee, 22 August 1924',
    caption: 'Tennessee certificate no. 195, Civil District 4, McMinn County: Thomas T. Ball, male, white, widowed, farmer, born 18 Nov 1842 in Tennessee, died 22 Aug 1924, aged 82. Father: Ball, born in Tennessee; mother\'s maiden name: Davis, born in Tennessee. Buried at Mt. Zion on 24 Aug 1924; informant and undertaker J. A. Leath of Athens.',
    source: "Tennessee, U.S., Death Records, 1908-1965, McMinn County, 1924; image from Ancestry.com. Original: Tennessee State Library and Archives.",
    people: ['ball_thomas_t'],
  },
  {
    id: 'will-1908-george-w-ball', kind: 'document',
    file: 'ancestry_will_1908_george_w_ball.jpg',
    title: 'Will of George W. Ball, McMinn County, Tennessee, 1908',
    caption: "Right-hand page (139), below the will of Phillip Cox: George W. Ball of McMinn County, dated 20 Mar 1908, leaves the farm in equal shares to his three children, Mollie Carroll, Johnnie Ball and Dasie Ball; $200 to his granddaughter Eva Brickell, with Will Carroll and his wife Mollie as her guardians; and names Johnnie Ball and Will Carroll executors. Signed with his mark; witnesses L. P. Webb and H. M. Simpson; probated 7 Apr 1908.",
    source: "Tennessee, U.S., Wills and Probate Records, 1779-2008, McMinn County, Wills vol. G–H, 1863–1925, Will Book H, p. 139; image from Ancestry.com. Original: McMinn County, Tennessee, county court.",
    people: ['ball_george_w'],
  },
];
const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');

// ── Facts from the images ────────────────────────────────────────────────────
const C1830H = "Ancestry.com, 1830 United States Federal Census (Hawkins County, Tennessee; William Ball)";
const C1880 = "Ancestry.com, 1880 United States Federal Census (District 8, Roane County, Tennessee)";
const C1900 = "Ancestry.com, 1900 United States Federal Census (Civil District 2, McMinn County, Tennessee)";
const WILL = "Ancestry.com, Tennessee, U.S., Wills and Probate Records, 1779-2008 (George W. Ball, 1908)";
const MARR = "Ancestry.com, Tennessee, U.S., Marriage Records, 1780-2002 (David Ball and Drary Davis, Roane County, 21 Dec 1833)";

edit('ball_david', [MARR, C1880, C1830H], p => {
  note(p, "His marriage bond of 21 Dec 1833 was given with Wm. Breeden as his surety, and he signed it with his mark. In 1880 his father's birthplace is given as Virginia and his mother's as Tennessee.");
  note(p, "Lead: the 1830 census of Hawkins County, Tennessee, lists a William Ball with a household of 12, including a man aged 50–59, a woman aged 30–39 and three boys aged 15–19, one of whom could be David (then about 16). It does not fit the tree's William Ball (born 1784, died 1826) and is not proved to be David's family.");
});
edit('ball_william_1784', C1830H, p => note(p, "No Hawkins County probate for a William Ball and no marriage record of a William Ball and Nancy Tate has been found on Ancestry.com. The 1880 census gives David Ball's father's birthplace as Virginia."));
edit('ball_graden', [C1880, C1900], p => note(p, "In 1880 both of her parents' birthplaces are given as Virginia; in 1900 her father's is Tennessee and her mother's Virginia. In 1900, a widow of 84 in McMinn County, she was the mother of 11 children, 9 of them living."));
const OLD_GEORGE = "Child of David Tate Ball and Draden (Davis) Ball; a brother of Ellen Rogers (Ball) McPhail. Born Oct 1844; aged 6 in 1850 and 15 in 1860. He lived with his mother and sister Nancy in McMinn County in 1900 and died in 1908 (Tennessee probate record); the tree gives 26 Mar 1908.";
edit('ball_george_w', [C1900, WILL], p => {
  p.notes = p.notes.filter(t => t !== OLD_GEORGE);
  note(p, "In 1900 his household held his son John F. (born Oct 1872) and daughters Hattie E. (Aug 1879) and Martha (Dec 1882). His will names three children, Mollie Carroll (wife of Will Carroll), Johnnie Ball and Dasie Ball, and a granddaughter, Eva Brickell.");
});

// ── Ed Simons's daughter's family (living: names and relationships only) ────
const SHARON = "Sharon Simons, via Brendan Adams, 2026-09-24";
person('henley_kayla', 'Kayla Simons (Henley)', 'F', SHARON, p => { add(p.aliases, 'Kayla Henley'); add(p.aliases, 'Kayla Simons'); });
person('henley_austin', 'Austin Henley', 'M', SHARON);
person('henley_kayliah', 'Kayliah Henley', 'F', SHARON);
person('henley_elizabeth', 'Elizabeth “Ellie” Henley', 'F', SHARON, p => add(p.aliases, 'Ellie Henley'));
edit('simons_ed', SHARON, () => {});
child('henley_kayla', 'simons_ed', '');
wed('henley_kayla', 'henley_austin');
for (const k of ['henley_kayliah', 'henley_elizabeth']) child(k, 'henley_austin', 'henley_kayla');
for (const [a, b] of [['henley_kayliah', 'henley_elizabeth'], ['henley_elizabeth', 'henley_kayliah']]) edit(a, [], p => add(p.relationships.siblings, b));
console.log('Ball record images and Henley family applied');
