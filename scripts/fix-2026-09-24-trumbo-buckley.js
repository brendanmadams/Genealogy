#!/usr/bin/env node
/**
 * 2026-09-24, the parents of Presley Neville Trumbo (1840–1923) and Hannah
 * Louise Buckley (Trumbo), from the 1850–1900 censuses, Idaho marriage and
 * birth records, California death indexes and Find a Grave, on Ancestry.com.
 * Re-runnable.
 *  - Presley was born in Pennsylvania (not Kentucky) and grew up in Union
 *    Township, Van Buren County, Iowa, in the household of Presley Neville
 *    Trumbo (1788–1869) and Susannah Holmes (1804–1884).
 *  - Hannah Louise ("Louisa", "Lizzie") was the daughter of David and Margaret
 *    Buckley, Irish immigrants who went from Louisiana to the California and
 *    then Idaho gold fields. She died in 1939 in Oakland, not 1941.
 *  - Parents are identified from census households, so the links are Inferred;
 *    the next generation back comes only from Find a Grave and is UNPROVEN.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };

const C1850 = "Ancestry.com, 1850 United States Federal Census (Union, Van Buren County, Iowa)";
const IA1856 = "Ancestry.com, Iowa, U.S., State Census Collection, 1836-1925 (1856, Union, Van Buren County)";
const C1860T = "Ancestry.com, 1860 United States Federal Census (Union, Van Buren County, Iowa; post office Utica)";
const C1900 = "Ancestry.com, 1900 United States Federal Census (Dryad, Lewis County, Washington)";
const C1920 = "Ancestry.com, 1920 United States Federal Census (Oakland, Alameda County, California)";
const MARR = "Ancestry.com, Idaho, U.S., Marriage Records, 1863-1974, and Idaho, U.S., Select Marriages (Presley N. Trumbo and Lizzie, or Louise, Buckley, Garden Valley, 25 Dec 1880)";
const IDBIRTH = "Ancestry.com, Idaho, U.S., Birth Records, 1861-1924 (John Holmes Trumbo, certificate 318981)";
const PENSION = "Ancestry.com, U.S., Civil War Pension Index: General Index to Pension Files, 1861-1934 (Presley Trumbo, 46th Iowa Infantry, Company K)";
const CA1923 = "Ancestry.com, California, U.S., Death Index, 1905-1939 (Presley Trumbo, Alameda County, 23 Oct 1923)";
const CA1939 = "Ancestry.com, California, U.S., Death Index, 1905-1939 (Hannah L. Trumbo, Alameda County, 14 Mar 1939)";
const OBIT = "Ancestry.com, U.S., Newspapers.com Obituary Index (Hannah L. Trumbo, Oakland, 1939)";
const VOTER = "Ancestry.com, California, U.S., Voter Registrations, 1900-1968 (Mrs. Hannah Louise Trumbo, Alameda County, 1936)";
const C1860B = "Ancestry.com, 1860 United States Federal Census (Township 9, Placer County, California; post office Secret Ravine)";
const C1870B = "Ancestry.com, 1870 United States Federal Census (Placerville, Boise County, Idaho Territory)";
const C1880B = "Ancestry.com, 1880 United States Federal Census (Garden Valley, Boise County, Idaho)";
const FAG_P = "Find a Grave, memorial 63427388 (Presley Neville Trumbo, Fordyce Cemetery, Stockport, Van Buren County, Iowa)";
const FAG_S = "Find a Grave, memorial 63426582 (Susannah Holmes Trumbo, Greer Cemetery, Wayne County, Iowa)";
const FAG_MA = "Find a Grave, memorial 15925585 (Mary Ann Charters, Placerville Cemetery, Boise County, Idaho)";

// ── Presley Neville Trumbo (1840–1923) ──────────────────────────────────────
edit('trumbo_presley_neville', [C1850, IA1856, C1860T, C1900, MARR, IDBIRTH, PENSION, CA1923, C1920], p => {
  p.locations = p.locations.filter(l => l !== 'Kentucky');
  for (const l of ['Pennsylvania', 'Union Township, Van Buren County, Iowa', 'Garden Valley, Boise County, Idaho', 'Dryad, Lewis County, Washington', 'Oakland, Alameda County, California']) add(p.locations, l);
  if (!p.death || p.death === '1923') p.death = '23 Oct 1923';
  add(p.career, 'Carpenter (1900 census).');
  note(p, "CORRECTION 2026-09-24: He was born in Pennsylvania, not Kentucky: the 1850, 1856 and 1900 censuses and his son John Holmes Trumbo's Idaho birth record all give Pennsylvania. The 1900 census gives his father's birthplace as Pennsylvania and his mother's as Ohio.");
  note(p, "Grew up in Union Township, Van Buren County, Iowa: aged 10 in 1850, 15 in 1856 and about 20 in 1860, in the household of Presley and Susannah Trumbo with Matilda, Amos (\"Ames\"), Serene, John, Travilla, Sarah, Emalinda, Clarinda and Theodore. Served in Company K, 46th Iowa Infantry, in the Civil War; his pension application was filed on 28 Jul 1890.");
  note(p, "Married \"Lizzie\" (also indexed as Louise) Buckley, Hannah Louise Buckley, on 25 Dec 1880 at Garden Valley, Boise County, Idaho. In 1900 he was a carpenter at Dryad, Lewis County, Washington, married 19 years. He died on 23 Oct 1923 in Alameda County, California, aged 83; his widow was living in Oakland by 1920.");
});

// ── His parents ─────────────────────────────────────────────────────────────
person('trumbo_presley_neville_1788', 'Presley Neville Trumbo', 'M', [C1850, IA1856, C1860T, FAG_P], p => {
  if (!p.birth) p.birth = '21 May 1788';
  if (!p.death) p.death = '1869';
  add(p.aliases, 'Presley Trumbo');
  for (const l of ['Allegheny County, Pennsylvania', 'Union Township, Van Buren County, Iowa', 'Fordyce Cemetery, Stockport, Van Buren County, Iowa']) add(p.locations, l);
  add(p.career, 'Farmer (1860 census).');
  note(p, "Born 21 May 1788 in Allegheny County, Pennsylvania; died 1869 and buried at Fordyce Cemetery, Stockport, Van Buren County, Iowa, where his grave was moved from its first site (Find a Grave). A farmer in Union Township, Van Buren County, in 1850 (aged 62), 1856 (68) and 1860 (72; real estate $1,920).");
  note(p, "Inferred: the father of Presley Neville Trumbo (1840–1923), who is in his household in 1850, 1856 and 1860. The son's eldest boy was named John Holmes Trumbo, after this couple's son John Holmes Trumbo (1833–1899) and Susannah's family name.");
  note(p, "UNPROVEN lead: Find a Grave names his father as John James Trumbo Sr. (1745–1819, born in Rockingham County, Virginia, buried in the Trumbo Cemetery, Jefferson Hills, Allegheny County, Pennsylvania), and his mother as Mary Custer.");
});
person('holmes_susannah', 'Susannah Holmes (Trumbo)', 'F', [C1850, IA1856, C1860T, FAG_S, C1900], p => {
  if (!p.birth) p.birth = '10 Jun 1804';
  if (!p.death) p.death = '4 Mar 1884';
  for (const a of ['Susannah Trumbo', 'Susan Trumbo']) add(p.aliases, a);
  for (const l of ['Harrison County, Ohio', 'Union Township, Van Buren County, Iowa', 'Greer Cemetery, Wayne County, Iowa']) add(p.locations, l);
  note(p, "Born 10 Jun 1804 in Harrison County, Ohio; died 4 Mar 1884, aged 79 years, 8 months and 23 days, and buried at Greer Cemetery, Wayne County, Iowa (Find a Grave). Aged 45 in 1850 and 51 in 1856 (\"Susan\"), wife of Presley Trumbo, in Union Township, Van Buren County. Her son Presley's 1900 census entry gives his mother's birthplace as Ohio.");
  note(p, "Inferred: the mother of Presley Neville Trumbo (1840–1923), who is in her household in 1850, 1856 and 1860.");
  note(p, "UNPROVEN lead: Find a Grave names her parents as Isaac Holmes (1774–1824) and Priscilla (Weirman) Holmes (1778–1855), and her brothers as William Wireman Holmes (1802–1873) and Isaac M. Holmes (1818–1892).");
});
wed('trumbo_presley_neville_1788', 'holmes_susannah');
child('trumbo_presley_neville', 'trumbo_presley_neville_1788', 'holmes_susannah');

// ── Hannah Louise Buckley (Trumbo) ──────────────────────────────────────────
edit('buckley_hannah_louise', [C1860B, C1870B, C1880B, MARR, IDBIRTH, C1920, VOTER, CA1939, OBIT], p => {
  if (p.death === '26 December 1941' || !p.death) p.death = '14 Mar 1939';
  for (const a of ['Louisa Buckley', 'Lizzie Buckley', 'Louise Trumbo', 'Hannah L. Trumbo']) add(p.aliases, a);
  for (const l of ['Placer County, California', 'Placerville, Boise County, Idaho', 'Garden Valley, Boise County, Idaho', 'Dryad, Lewis County, Washington', 'Oakland, Alameda County, California']) add(p.locations, l);
  note(p, "CORRECTION 2026-09-24: She died on 14 Mar 1939 in Alameda County, California (California death index; newspaper obituary index, Oakland), not on 26 Dec 1941 in Sacramento. She is in Oakland city directories from 1925 to 1934 and registered to vote there in 1936 as Mrs. Hannah Louise Trumbo.");
  note(p, "As a girl she was \"Louisa\": aged 3 (\"Hannah S.\") in 1860 in Placer County, California, with her parents David and Margaret Buckley and sisters Mary A. and Julia C., all three girls born in Louisiana; aged 12 in 1870 at Placerville, Boise County, Idaho, with her widowed mother and sister Mary Ann, both girls working as waiters; and aged 22 in 1880 at Garden Valley, Boise County, in her sister Mary Ann's household. The censuses put her birth in 1857–1858, and in 1880 give both her parents' birthplaces as Ireland.");
  note(p, "Married Presley N. Trumbo at Garden Valley on 25 Dec 1880 as \"Lizzie\" (also indexed as Louise) Buckley; her son John Holmes Trumbo's Idaho birth record names her Hannah Louise Buckley. In 1920 she was \"Louise Trumbo\", born in Louisiana, in Oakland.");
});

// ── Her parents ─────────────────────────────────────────────────────────────
person('buckley_david', 'David Buckley', 'M', C1860B, p => {
  if (!p.birth) p.birth = 'abt 1825';
  for (const l of ['Ireland', 'Louisiana', 'Township 9, Placer County, California']) add(p.locations, l);
  add(p.career, 'Miner (1860 census).');
  note(p, "Born about 1825 in Ireland. In 1860 a miner in Township 9, Placer County, California (post office Secret Ravine), aged 35, with his wife Margaret and daughters Mary A. (8), Julia C. (5) and Hannah (3), all born in Louisiana. Margaret was a widow by 1870, so he died between 1860 and 1870.");
  note(p, "Inferred: the father of Hannah Louise Buckley (Trumbo), from the 1860 household and her mother's and sister's later households in Idaho.");
});
person('buckley_margaret', 'Margaret Buckley', 'F', [C1860B, C1870B, C1880B], p => {
  if (!p.birth) p.birth = 'abt 1818';
  for (const l of ['Ireland', 'Louisiana', 'Township 9, Placer County, California', 'Placerville, Boise County, Idaho', 'Garden Valley, Boise County, Idaho']) add(p.locations, l);
  add(p.career, 'Kept a boarding house at Placerville, Idaho (1870 census).');
  note(p, "Born in Ireland about 1815–1822 (aged 38 in 1860, 55 in 1870, 62 in 1880). Wife of David Buckley in Placer County, California, in 1860. By 1870 a widow keeping a boarding house at Placerville, Boise County, Idaho Territory (real estate $1,100), with her daughters Mary Ann (18) and Louisa (12). In 1880, widowed, she lived at Garden Valley, Boise County, with her son-in-law William Charters, Mary Ann and their children, and Louisa. Her maiden name is not recorded.");
  note(p, "Inferred: the mother of Hannah Louise Buckley (Trumbo). Her daughter Mary Ann (Buckley) Charters was born on 10 Jul 1850 in Louisiana and died on 9 Nov 1898 at Placerville, Idaho (Find a Grave, memorial 15925585); a third daughter, Julia C., born about 1855, is not found after 1860.");
  add(p.sources, FAG_MA);
});
wed('buckley_david', 'buckley_margaret');
child('buckley_hannah_louise', 'buckley_david', 'buckley_margaret');
console.log('Trumbo and Buckley parents applied');
