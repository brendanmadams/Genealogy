#!/usr/bin/env node
/**
 * 2026-09-24, the parents and grandparents of Mary Patricia Walker (Simons),
 * Ed Simons's mother, and the details of her 1958 marriage certificate.
 * Re-runnable.
 *  - Her mother: Marrion Roma Hinds (1920–2001), who married Sheldon Joseph
 *    Dolan in 1937 and, after his death in 1942, John W. Walker. In 1940 the
 *    Dolans had a daughter Mary in Portland; in 1950 Mary P. Walker lived in
 *    Richland with Marrion and John W. Walker. Same mother, same age, same
 *    birthplace (Oregon), so Mary Dolan and Mary P. Walker are Inferred to be
 *    the same girl.
 *  - Sheldon's parents are named on his 1937 marriage record; the generation
 *    above them comes from Find a Grave only (UNPROVEN).
 *  - Marrion's parents come from her Social Security record and her 1937
 *    marriage record; their own parents are not yet found.
 *  - May Smith Dolan's sister Bertha married John Holmes Trumbo in 1953.
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
const sibs = (ids) => { for (const a of ids) edit(a, [], p => { for (const b of ids) if (b !== a) add(p.relationships.siblings, b); }); };
const drop = (p, starts) => { p.notes = p.notes.filter(n => !starts.some(s => n.startsWith(s))); };

const CERT = 'Washington State Archives, Digital Archives, Franklin County Auditor, Marriage Records, certificate 9306 (Glen E. Simons and Mary Patricia Walker, 27 Jul 1958)';
const C1940 = 'Ancestry.com, 1940 United States Federal Census (Brentwood, Multnomah County, Oregon; ED 26-58, sheets 7B–8A)';
const C1950 = 'Ancestry.com, 1950 United States Federal Census (Richland, Benton County, Washington; ED 3-26, page 33)';
const M1937 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Robert Joseph Dolan and Marrion P. Hinds, Vancouver, Clark County, 9 Jun 1937)';
const SSA = 'Ancestry.com, U.S., Social Security Applications and Claims Index, 1936-2007 (Marrion Roma Dolan / Walker)';
const DEATH_M = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Marrion R. Walker, 2001)';
const OBIT_M = 'Ancestry.com, Web: Obituary Daily Times Index, 1995-2016 (Marrion R. (Hinds) Walker, published 21 Mar 2001)';
const FAG_MW = 'Find a Grave, memorial 143034118 (Marrion R. Walker, Sunset Memorial Gardens, Richland)';
const FAG_SD = 'Find a Grave, memorial 45057982 (Sheldon Joseph Dolan, Mount Calvary Cemetery, Portland)';
const FAG_JD = 'Find a Grave, memorial 134589927 (Joseph Martin Dolan, Mount Calvary Cemetery, Portland)';
const FAG_MD = 'Find a Grave, memorial 45057978 (May Smith Dolan, Mount Calvary Cemetery, Portland)';
const FAG_NH = 'Find a Grave, memorial 284508474 (Nellie Frances Hampton Hermann, Rose City Cemetery, Portland)';
const FAG_BT = 'Find a Grave, memorial 143890754 (Bertha Iona Smith Trumbo, Anderson Cemetery, East Stanwood)';
const FAG_JT = 'Find a Grave, memorial 85562184 (John Holmes Trumbo, Acacia Memorial Park, Lake Forest Park)';

// ── The 1958 marriage certificate ───────────────────────────────────────────
const WED = 'Married on 27 Jul 1958 at Kennewick, Benton County, Washington, by Rev. H. H. Underwood, a Methodist minister, under a license issued by the Franklin County auditor on 7 Jul 1958; witnesses Orvel K. Simons (Glen\'s brother Orval) and Jane Hudson. Glen, of Franklin County, signed "Glen Erwin Simons"; Mary Patricia Walker was of Benton County (Franklin County marriage certificate no. 9306).';
edit('simons_glen', CERT, p => {
  add(p.aliases, 'Glen Erwin Simons');
  add(p.locations, 'Kennewick, Washington');
  note(p, WED);
});
edit('simons_orval_keith', CERT, p => note(p, 'A witness, as Orvel K. Simons, at the wedding of his brother Glen and Mary Patricia Walker at Kennewick on 27 Jul 1958 (Franklin County marriage certificate no. 9306).'));

// ── Mary ────────────────────────────────────────────────────────────────────
edit('simons_mary', [CERT, C1940, C1950], p => {
  add(p.aliases, 'Mary Dolan');
  add(p.aliases, 'Mary P. Walker');
  drop(p, ['Born Mary Patricia Walker; she married Glen E. Simons on 27 Jul 1958 in Franklin County']);
  note(p, WED);
  note(p, 'Inferred: the daughter of Sheldon Joseph Dolan and Marrion Roma Hinds. In 1940 the Dolans had a daughter Mary in Portland, Oregon; Sheldon died in 1942, Marrion married John W. Walker, and in 1950 Mary P. Walker lived in Richland, Washington, with Marrion, her stepfather John W. Walker and her half-sisters Roma F. and Betty A. Walker. She married as Mary Patricia Walker, her stepfather\'s surname.');
});

// ── Her parents ─────────────────────────────────────────────────────────────
person('dolan_sheldon_joseph', 'Sheldon Joseph Dolan', 'M', [M1937, C1940, FAG_SD], p => {
  if (!p.birth) p.birth = '1 Mar 1909';
  if (!p.death) p.death = '20 Jul 1942';
  for (const a of ['Robert Joseph Dolan', 'Sheldon J. Dolan']) add(p.aliases, a);
  for (const l of ['Portland, Oregon', 'Brentwood, Multnomah County, Oregon', 'Mount Calvary Cemetery, Portland']) add(p.locations, l);
  add(p.career, 'Stevedore / longshoreman, Portland (1940).');
  note(p, 'Born 1 Mar 1909 in Portland, Oregon; died 20 Jul 1942, aged 33, and was buried at Mount Calvary Cemetery, Portland, next to his mother (Find a Grave).');
  note(p, 'As Robert Joseph Dolan, 28, of Portland, he married Marrion P. Hinds, 18, at Vancouver, Washington, on 9 Jun 1937; the record names his parents as Martine Joseph Dolan and May Dolan (Washington marriage records). In 1940, as Sheldon J. Dolan, 31, a stevedore, he lived at the rear of 6557 S.E. 67th Avenue, Brentwood, Multnomah County, with Marrion and their daughter Mary.');
});
person('hinds_marrion_roma', 'Marrion Roma Hinds (Walker)', 'F', [M1937, SSA, C1940, C1950, DEATH_M, OBIT_M, FAG_MW], p => {
  if (!p.birth) p.birth = '26 Nov 1920';
  if (!p.death) p.death = '20 Mar 2001';
  for (const a of ['Marrion R. Walker', 'Marrion Dolan', 'Marrion P. Hinds', 'Marrion Roma Dolan']) add(p.aliases, a);
  for (const l of ['St. Louis, Missouri', 'Portland, Oregon', 'Richland, Washington', 'Kennewick, Washington', 'Sunset Memorial Gardens, Richland']) add(p.locations, l);
  note(p, 'Born 26 Nov 1920 in St. Louis, Missouri, daughter of Hershel Hinds and Florence C. Goodenough (Social Security record, which lists her as Marrion Roma Dolan in 1942 and Marrion Roma Walker from 1951). She died on 20 Mar 2001 in Kennewick, aged 80, and was buried at Sunset Memorial Gardens, Richland (Washington death index; Find a Grave; an obituary indexed for 21 Mar 2001).');
  note(p, 'Married Robert (Sheldon) Joseph Dolan at Vancouver, Washington, on 9 Jun 1937, when she was 18; the record names her parents as Hershel and Florence Hinds. Their daughter was Mary. After Sheldon died in 1942 she married John W. Walker, born about 1916 in Colorado; in 1950 they lived at 316 Goethals, Richland, with Mary P., Roma F. and Betty A. Walker. She lived in Kennewick in 1993.');
});
wed('dolan_sheldon_joseph', 'hinds_marrion_roma');
child('simons_mary', 'dolan_sheldon_joseph', 'hinds_marrion_roma');

// ── The Dolan and Smith grandparents ────────────────────────────────────────
person('dolan_joseph_martin', 'Joseph Martin Dolan', 'M', [M1937, FAG_JD], p => {
  if (!p.birth) p.birth = '2 May 1882';
  if (!p.death) p.death = '6 Jul 1967';
  add(p.aliases, 'Martine Joseph Dolan');
  for (const l of ['Portland, Oregon', 'Mount Calvary Cemetery, Portland']) add(p.locations, l);
  note(p, 'Father of Sheldon Joseph Dolan, named as Martine Joseph Dolan on Sheldon\'s 1937 marriage record. Born 2 May 1882 in Portland, Oregon; died 6 Jul 1967 in Multnomah County and was buried at Mount Calvary Cemetery (Find a Grave). He married May Smith in 1906; after her death he married Annabel Fields in 1918, the mother of Martin Kenneth (1919–1997) and Arline (1921–2014) (Find a Grave).');
  note(p, 'UNPROVEN, from Find a Grave family links: son of Thomas Dolan (1829–1899) and Ellen Dowling (1845–1930).');
});
person('smith_may', 'May Smith (Dolan)', 'F', [M1937, FAG_MD], p => {
  if (!p.birth) p.birth = '3 Jan 1886';
  if (!p.death) p.death = '15 Jan 1915';
  add(p.aliases, 'May Dolan');
  for (const l of ['Hardman, Morrow County, Oregon', 'Portland, Oregon', 'Mount Calvary Cemetery, Portland']) add(p.locations, l);
  note(p, 'Mother of Sheldon Joseph Dolan, named as May Dolan on his 1937 marriage record. Born 3 Jan 1886 at Hardman, Morrow County, Oregon; married Joseph Martin Dolan in 1906; died 15 Jan 1915 in Portland, aged 29, and was buried at Mount Calvary Cemetery; her children were Sheldon (1909) and Marjorie (1911–1996) (Find a Grave).');
  note(p, 'UNPROVEN, from the Find a Grave biography: daughter of Thomas Smith and Nellie Frances Hampton, who married on 24 Dec 1877 in Linn County, Oregon. Her sisters were Bertha Iona (1878–1968), Alice Leona (Tennent, 1882–1972) and Mary Delpha (Parker, 1888–1970).');
});
wed('dolan_joseph_martin', 'smith_may');
child('dolan_sheldon_joseph', 'dolan_joseph_martin', 'smith_may');

// ── The Hinds grandparents (names only, from Marrion's records) ─────────────
person('hinds_hershel', 'Hershel Hinds', 'M', [SSA, M1937], p => note(p, 'Father of Marrion Roma Hinds, born 26 Nov 1920 in St. Louis, Missouri (her Social Security record and her 1937 marriage record). Not yet found in a census; a Merritt Hershel Hinds, born Aug 1894 in Missouri, lived in Greene County in 1900, a lead only.'));
person('goodenough_florence_c', 'Florence C. Goodenough (Hinds)', 'F', [SSA, M1937], p => {
  for (const a of ['Florence Hinds', 'Florance C. Goodenough']) add(p.aliases, a);
  note(p, 'Mother of Marrion Roma Hinds, born 26 Nov 1920 in St. Louis, Missouri: Florance C. Goodenough on Marrion\'s Social Security record and Florence Hinds on her 1937 marriage record.');
});
wed('hinds_hershel', 'goodenough_florence_c');
child('hinds_marrion_roma', 'hinds_hershel', 'goodenough_florence_c');

// ── The great-grandparents (UNPROVEN, Find a Grave) ─────────────────────────
const UNP = 'UNPROVEN, from Find a Grave family links; not yet checked against a record.';
person('dolan_thomas', 'Thomas Dolan', 'M', FAG_JD, p => { if (!p.birth) p.birth = '1829'; if (!p.death) p.death = '1899'; note(p, `${UNP} Father of Joseph Martin Dolan (born 1882 in Portland) and of Thomas J. (1880–1965), Sadie L. (Davis, 1886–1972) and Annie C. (Beberness, 1887–1945).`); });
person('dowling_ellen', 'Ellen Dowling (Dolan)', 'F', FAG_JD, p => { if (!p.birth) p.birth = '1845'; if (!p.death) p.death = '1930'; add(p.aliases, 'Ellen Dolan'); note(p, `${UNP} Mother of Joseph Martin Dolan, born 1882 in Portland.`); });
wed('dolan_thomas', 'dowling_ellen');
child('dolan_joseph_martin', 'dolan_thomas', 'dowling_ellen');

person('smith_thomas', 'Thomas Smith', 'M', FAG_MD, p => note(p, 'UNPROVEN, from the Find a Grave biography of his daughter May: married Nellie Frances Hampton on 24 Dec 1877 in Linn County, Oregon; father of Bertha Iona (1878), Alice Leona (1882), May (1886) and Mary Delpha (1888).'));
person('hampton_nellie_frances', 'Nellie Frances Hampton (Smith, Hermann)', 'F', [FAG_MD, FAG_NH], p => {
  if (!p.birth) p.birth = '4 Jul 1860';
  if (!p.death) p.death = '18 Jan 1947';
  for (const a of ['Nellie Frances Hermann', 'Nellie Smith']) add(p.aliases, a);
  for (const l of ['Albany, Linn County, Oregon', 'Portland, Oregon', 'Rose City Cemetery, Portland']) add(p.locations, l);
  note(p, `${UNP} Born 4 Jul 1860 at Albany, Linn County, Oregon; married Thomas Smith on 24 Dec 1877 in Linn County, and Charles Alexander Hermann (1853–1924) in 1896; died 18 Jan 1947 in Portland, aged 86, and was buried at Rose City Cemetery.`);
});
wed('smith_thomas', 'hampton_nellie_frances');
child('smith_may', 'smith_thomas', 'hampton_nellie_frances');

// ── Bertha Iona Smith and John Holmes Trumbo ────────────────────────────────
person('smith_bertha_iona', 'Bertha Iona Smith (Trumbo)', 'F', [FAG_BT, FAG_MD], p => {
  if (!p.birth) p.birth = '13 Mar 1878';
  if (!p.death) p.death = '16 Feb 1968';
  add(p.aliases, 'Bertha Iona Trumbo');
  for (const l of ['Oregon', 'Seattle, Washington', 'Anderson Cemetery, East Stanwood, Washington']) add(p.locations, l);
  note(p, 'Born 13 Mar 1878 in Oregon, the eldest daughter of Nellie Frances Hampton; died 16 Feb 1968 in Seattle, aged 89, and was buried at Anderson Cemetery, East Stanwood (Find a Grave). She married Charles Owen Wells in 1897, Albert Harmon in 1905 and, in 1953, John Holmes Trumbo, the brother of Serena Trumbo Adams (Find a Grave).');
  note(p, 'Her sister May Smith was the grandmother of Mary Patricia Walker (Simons), so the Simons and Trumbo branches meet here, by marriage only.');
});
child('smith_bertha_iona', 'smith_thomas', 'hampton_nellie_frances');
sibs(['smith_bertha_iona', 'smith_may']);
wed('smith_bertha_iona', 'trumbo_john_holmes');
edit('trumbo_john_holmes', FAG_JT, p => {
  if (!p.death) p.death = '1964';
  for (const l of ['Seattle, Washington', 'Acacia Memorial Park, Lake Forest Park, Washington']) add(p.locations, l);
  note(p, 'Registered for the draft in Seattle in 1942, giving his birth as 22 Oct 1881 at "Jarkee Fork" (Yankee Fork), Idaho. He died in 1964, aged 82, and his ashes are at Acacia Memorial Park, Lake Forest Park. His first wife, Jane (1870–1949), was the mother of Virginia Janet (Kidd, 1908–1999); in 1953 he married Bertha Iona Smith, whose sister May was the grandmother of Mary Patricia Walker (Simons) (Find a Grave).');
});
console.log('Walker, Dolan and Hinds applied');
