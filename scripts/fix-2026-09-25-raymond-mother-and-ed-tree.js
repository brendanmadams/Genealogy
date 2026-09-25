#!/usr/bin/env node
/**
 * 2026-09-25, Raymond Zell Simons's mother, and the facts from Ed Simons's
 * Ancestry tree (tree 189265374) checked against records. Re-runnable.
 *  - Raymond: the state and county birth registers record Ray, born 14 Jun
 *    1897 at South Haven, to Gertrude Simonds, born in Minnesota, of Covert.
 *    Gertrude Nellie Simons is his mother; Aaron and Harriet, who raised him
 *    as their son, are his grandparents. The register names the father as
 *    "Ray Simonds", born in Chicago; he is not identified.
 *  - Proven: Harriet Michel's parents, Mathias Michel and Barbara Eby, and
 *    most of the Kulp siblings' dates.
 *  - UNPROVEN (Ed's tree only): Barbara Eby's and Sarah Vancel's parents.
 *  - John William Walker, Marrion's second husband, added.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const drop = (p, starts) => { p.notes = p.notes.filter(n => !starts.some(s => n.startsWith(s))); };
const unkept = (list, x) => list.filter(y => y !== x);
// fill a blank or year-only date; never replace a fuller one
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };

const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const MIB = 'FamilySearch, Michigan, Births, 1867-1902, Van Buren County, item 1, p. 358, no. 4556 (Ray Simonds, 14 Jun 1897, South Haven), with the register images (film 004207534, images 474 and 476)';
const MICB = 'FamilySearch, Michigan, County Births, 1867-1917 (Ray Simonds, 14 June 1897, South Haven, Van Buren County)';
const C1900 = 'Ancestry.com, 1900 United States Federal Census (Covert, Van Buren County, Michigan; ED 138, sheets 12A–12B, dwelling 259)';
const C1900M = 'Ancestry.com, 1900 United States Federal Census (South Haven, Van Buren County, Michigan; Frank C. Masters, son of Richard F. and Sarah)';
const C1870 = 'Ancestry.com, 1870 United States Federal Census (Bangor, Van Buren County, Michigan, post office South Haven; household of Mathias Michaels)';
const WADC = 'FamilySearch, Washington, Death Certificates, 1907-1960 (Hattie Davison; parents Mathias Michel and Barbara Eby)';
const WAM = 'FamilySearch, Washington, County Marriages, 1855-2008 (Hattie Michels Simons; parents Mathias Michels and Barbera Eby)';
const WADI = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017';
const CADI = 'Ancestry.com, California, U.S., Death Index, 1905-1939 (Charles F. Masters, 18 May 1928, Sacramento)';
const C1880E = 'Ancestry.com, 1880 United States Federal Census (Elk, Clarion County, Pennsylvania; Ephram Kulp, 74, stonemason)';
const FAG = 'Ancestry.com, U.S., Find a Grave Index, 1600s-Current';
const WAM40 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (John W. Walker, son of Ed and Esther Walker, and Carolyn E. Taylor; application 18 Nov 1940, Clark County)';
const C1940P = 'Ancestry.com, 1940 United States Federal Census (Portland, Multnomah County, Oregon; household of Audry R. Bishop)';
const C1950 = 'Ancestry.com, 1950 United States Federal Census (Richland, Benton County, Washington; ED 3-26, page 33)';

// ── Raymond Zell Simons's mother ────────────────────────────────────────────
edit('simons_raymond_zell', [MIB, MICB, C1900], p => {
  p.relationships.father = '';
  p.relationships.mother = 'simons_gertrude_nellie';
  drop(p, ['UNPROVEN alternative: Ed Simons']);
  note(p, 'CORRECTION: his mother was Gertrude Nellie Simons, Aaron and Harriet\'s eldest daughter, not Harriet. The Michigan state birth register and the Van Buren County register both record Ray, born 14 Jun 1897 at South Haven, to Gertrude Simonds, born in Minnesota, the family living at Covert (state register no. 4556, recorded 5 Aug 1898). Gertrude, born in Minnesota in 1879, was 18 and unmarried. Aaron and Harriet raised him as their son: the 1900 census lists him as their son, and his death certificate names them as his parents. His "sisters" Ettie, Lola and Bertha were his aunts, and Dorothy Groves was his half-sister.');
  note(p, 'His father is not identified. The birth registers name him as "Ray Simonds", born in Chicago, a farmer, which fits neither Aaron (born in Ohio) nor Charles F. Masters, whom Gertrude married in 1898 (born in Michigan). Raymond\'s 1930 census gives his father\'s birthplace as Illinois. Ed Simons\'s Ancestry tree names Masters as his father, citing only another member tree (UNPROVEN). DNA matches could settle it.');
});
edit('simons_gertrude_nellie', [MIB, MICB], p => {
  add(p.relationships.children, 'simons_raymond_zell');
  drop(p, ['UNPROVEN: Ed Simons\'s Ancestry tree makes her the mother']);
  note(p, 'Mother of Raymond Zell Simons, born 14 Jun 1897 at South Haven, when she was 18 and unmarried: the Michigan state and Van Buren County birth registers record him as Ray, son of Gertrude Simonds, born in Minnesota, of Covert. Her parents, Aaron and Harriet Simons, raised him as their son. The registers name the father as "Ray Simonds", born in Chicago; he is not identified.');
});
for (const id of ['simons_aaron', 'simons_harriet_hattie']) edit(id, [MIB, C1900], p => {
  p.relationships.children = unkept(p.relationships.children || [], 'simons_raymond_zell');
  note(p, 'Grandparents of Raymond Zell Simons (born 1897), their daughter Gertrude\'s son, whom they raised as their own; the 1900 census lists him as their son (Michigan birth registers).');
});
for (const id of ['simons_ettie', 'simons_lola', 'simons_bertha']) edit(id, MIB, p => {
  p.relationships.siblings = unkept(p.relationships.siblings || [], 'simons_raymond_zell');
  note(p, 'Aunt of Raymond Zell Simons, her sister Gertrude\'s son, who was raised in the household as a brother (Michigan birth registers; 1900 census).');
});
edit('masters_charles_f', [C1900M, CADI, ED], p => {
  refine(p, 'birth', 'Mar 1875');
  refine(p, 'death', '18 May 1928');
  add(p.locations, 'South Haven, Michigan');
  add(p.locations, 'Sacramento, California');
  note(p, 'Born Mar 1875 in Michigan, son of Richard F. and Sarah Masters, with whom he lived at South Haven in 1900; died 18 May 1928 at Sacramento, aged 53 (1900 census; California death index). Ed Simons\'s tree gives 17 Mar 1875 at Watertown, Clinton County, and names him as Raymond Zell Simons\'s father (UNPROVEN); Raymond\'s birth register names a "Ray Simonds", born in Chicago.');
});

// ── Harriet Michel's parents (proven) and Barbara Eby's (UNPROVEN) ──────────
person('michel_mathias', 'Mathias Michel', 'M', [WADC, WAM, C1870, ED], p => {
  refine(p, 'birth', 'abt 1822');
  for (const a of ['Mathias Michels', 'Mathias Michaels', 'Mather Michaels']) add(p.aliases, a);
  add(p.locations, 'Prussia'); add(p.locations, 'Bangor, Van Buren County, Michigan');
  note(p, 'Father of Harriet "Hattie" Michel (Simons, Davison), as her Washington death certificate and her Washington marriage record both state. In 1870 he was a farmer at Bangor, Van Buren County, Michigan (post office South Haven), aged 48, born in Prussia, with his wife Barbara A. and children Sebastian, Margaret (13), Harriet (11), Mathias (8) and Louisa (4) (1870 census). The 1900 census gives Harriet\'s father\'s birthplace as Germany.');
});
person('eby_barbara_ann', 'Barbara Ann Eby (Michel)', 'F', [WADC, WAM, C1870, ED], p => {
  refine(p, 'birth', 'abt 1824');
  for (const a of ['Barbara A. Michaels', 'Barbara Michel']) add(p.aliases, a);
  add(p.locations, 'Pennsylvania'); add(p.locations, 'Bangor, Van Buren County, Michigan');
  note(p, 'Mother of Harriet "Hattie" Michel (Simons, Davison), as her Washington death certificate and marriage record state. In 1870 she was 46, born in Pennsylvania, at Bangor, Van Buren County, Michigan (1870 census).');
  note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: daughter of George W. Eby (1798–1886) and Elizabeth Nafcher (1800–1881). Not found in records yet.');
});
wed('michel_mathias', 'eby_barbara_ann');
child('simons_harriet_hattie', 'michel_mathias', 'eby_barbara_ann');
edit('simons_harriet_hattie', [WADC, WAM, C1870], p => note(p, 'Daughter of Mathias Michel and Barbara Eby: her Washington death certificate (as Hattie Davison) and her Washington marriage record (as Hattie Michels Simons) name them, and in 1870 she was Harriet, 11, in their household at Bangor, Van Buren County, Michigan.'));
person('eby_george_w', 'George W. Eby', 'M', ED, p => { refine(p, 'birth', '1798'); refine(p, 'death', '1886'); note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: father of Barbara Ann Eby (Michel); born 1798, died 1886. Not found in records yet.'); });
person('nafcher_elizabeth', 'Elizabeth Nafcher (Eby)', 'F', ED, p => { refine(p, 'birth', '1800'); refine(p, 'death', '1881'); note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: mother of Barbara Ann Eby (Michel); born 1800, died 1881. Not found in records yet.'); });
wed('eby_george_w', 'nafcher_elizabeth');
child('eby_barbara_ann', 'eby_george_w', 'nafcher_elizabeth');

// ── Sarah Vancel's parents (UNPROVEN) ───────────────────────────────────────
person('vancel_valentine', 'Valentine Vancel', 'M', ED, p => { refine(p, 'birth', '1820'); refine(p, 'death', '26 Sep 1856'); note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: father of Sarah Vancel (Kulp); born 1820 in Pennsylvania, died 26 Sep 1856 at Big Muddy, Union County, Illinois. Not found in the 1850 census or other records yet.'); });
person('karnes_elizabeth_rebecca', 'Elizabeth Rebecca Karnes (Vancel)', 'F', ED, p => { refine(p, 'birth', '1829'); refine(p, 'death', '1 Mar 1885'); note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: mother of Sarah Vancel (Kulp); born 1829 in Pennsylvania, died 1 Mar 1885 at Clyde, Cloud County, Kansas. Not found in records yet.'); });
wed('vancel_valentine', 'karnes_elizabeth_rebecca');
child('vancel_sarah', 'vancel_valentine', 'karnes_elizabeth_rebecca');
edit('vancel_sarah', ED, p => note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: born Mar 1847 in Somerset County, Pennsylvania, and died 18 Dec 1874 at Holton, Jackson County, Kansas.'));

// ── Kulp line ───────────────────────────────────────────────────────────────
edit('kulp_michael_nicholas', WADI, p => {
  refine(p, 'death', '21 Feb 1911');
  note(p, 'Died 21 Feb 1911 at the State Soldiers\' Home, Orting, Pierce County, Washington; the death record gives his birth year as about 1838 (Washington death records). Ed Simons\'s tree gives 28 Feb 1842 at Oil City, Pennsylvania.');
});
edit('kulp_ephraim', C1880E, p => note(p, 'In 1880 he was 74, a stonemason at Elk, Clarion County, Pennsylvania, born in Pennsylvania, with his wife Anna M. (58) and son George W. (18) (1880 census). Ed Simons\'s tree gives his birth as 10 Apr 1809 in New York; the sources disagree on the year (1806–1811).'));
edit('confer_maria_catharina', ED, p => note(p, 'UNPROVEN, from Ed Simons\'s Ancestry tree: born 1810 in Pennsylvania; died Feb 1860 at Lower Salford, Montgomery County, Pennsylvania.'));
const KULP = [
  ['kulp_edith_sarah', '6 Jun 1899', '11 Sep 1968', 'Died 11 Sep 1968 at Spokane as Edith Smith (Washington death records). Born 6 Jun 1899 at Blaine (Ed Simons\'s tree).'],
  ['kulp_marlan_john', '13 Jun 1901', '21 Jan 1974', 'Born 13 Jun 1901; died 21 Jan 1974 at Spokane (Washington death records). Ed Simons\'s tree gives 16 Jun 1901 at Blaine.'],
  ['kulp_nardin_ira', '8 Feb 1904', '4 Oct 1960', 'Died 4 Oct 1960 in Whitman County, aged about 56 (Washington death records). Born 8 Feb 1904 at Blaine (Ed Simons\'s tree).'],
  ['kulp_reta_may', '20 May 1906', '28 Jun 1989', 'Born 20 May 1906; died 28 Jun 1989 at Spokane as Reta May Koenig (Washington death records).', 'Reta May Koenig'],
  ['kulp_dorothy_belle', '24 May 1912', '9 Oct 1991', 'Born 24 May 1912; died 9 Oct 1991 at Pasco as Dorothy Belle Hooper (Washington death records).', 'Dorothy Belle Hooper'],
  ['kulp_audrey_rebecca', '8 Dec 1918', '27 Oct 2000', 'Died 27 Oct 2000 in Stevens County as Audrey R. Hedrick (Washington death records). Born 8 Dec 1918 at Albion (Ed Simons\'s tree).'],
  ['kulp_ruth_zenith', '11 Apr 1915', '', 'UNPROVEN, from Ed Simons\'s tree: born 11 Apr 1915 at Schrag, Adams County, Washington.'],
  ['kulp_alton_roger', '11 Jun 1917', '', 'UNPROVEN, from Ed Simons\'s tree: born 11 Jun 1917 at Albion, Whitman County, Washington.'],
];
for (const [id, b, d, text, alias] of KULP) edit(id, /UNPROVEN/.test(text) ? ED : [WADI, ED], p => { if (b) refine(p, 'birth', b); if (d) refine(p, 'death', d); if (alias) add(p.aliases, alias); note(p, text); });

// ── Aaron and Harriet's daughters ───────────────────────────────────────────
edit('simons_ettie', [WADI, ED], p => { refine(p, 'death', '17 Sep 1970'); add(p.aliases, 'Etta May Dunker'); note(p, 'Etta May Simons married August Henry Dunker and died 17 Sep 1970 at Olympia, Thurston County, as Etta M. Dunker (Washington death records). Ed Simons\'s tree gives her birth as 1 Dec 1883.'); });
edit('simons_lola', [FAG, ED], p => note(p, 'Buried at Lynden, Whatcom County (Find a Grave, as Lola P. Adams, 21 Sep 1885 – 3 Dec 1918). Ed Simons\'s tree gives her birthplace as Hart, Oceana County, Michigan, and her place of death as Butte, Montana.'));
edit('simons_bertha', ED, p => note(p, 'UNPROVEN, from Ed Simons\'s tree: died 24 Sep 1940 in King County, Washington. Not found in the death index under Simons or Harrington.'));

// ── Dolan and Walker ────────────────────────────────────────────────────────
edit('dolan_thomas', FAG, p => { refine(p, 'death', '3 Aug 1899'); note(p, 'Died 3 Aug 1899; buried in Portland (Find a Grave). Ed Simons\'s tree gives his birthplace as County Dublin, Ireland.'); });
edit('dowling_ellen', FAG, p => { refine(p, 'birth', '27 Nov 1845'); refine(p, 'death', '15 Apr 1930'); note(p, 'Born 27 Nov 1845; died 15 Apr 1930; buried in Portland (Find a Grave). Ed Simons\'s tree gives her birthplace as County Cork, Ireland.'); });
edit('smith_may', ED, p => { add(p.aliases, 'Mae Idilla Smith'); note(p, 'Ed Simons\'s tree gives her full name as Mae Idilla Smith.'); });
edit('dolan_joseph_martin', ED, p => note(p, 'Ed Simons\'s tree gives his birthplace as Cedar Mill, Washington County, Oregon; Find a Grave says Portland. Not yet checked against a record.'));
person('walker_john_william', 'John William Walker', 'M', [WADI, WAM40, C1940P, C1950, ED], p => {
  refine(p, 'birth', '29 Dec 1915');
  refine(p, 'death', '22 Dec 1975');
  add(p.aliases, 'John W. Walker');
  for (const l of ['Colorado', 'Portland, Oregon', 'Richland, Washington', 'Spokane, Washington']) add(p.locations, l);
  note(p, 'Born 29 Dec 1915 in Colorado; died 22 Dec 1975 at Spokane (Washington death records). Son of William Edgar "Ed" Walker (died 1916, Pueblo, Colorado) and Ester Lydia Green (1896–1970): his 1940 Washington marriage record names his parents as Ed and Esther Walker, and in 1940 he lived in Portland as the stepson of Audry R. Bishop, whose wife was Esther (1940 census; Ed Simons\'s tree).');
  note(p, 'Married Carolyn E. Taylor (Clark County, Washington, application 18 Nov 1940), and later Marrion Roma (Hinds) Dolan, widow of Sheldon Dolan. In 1950 they lived at 316 Goethals, Richland, with her daughter Mary P. and their daughters Roma F. and Betty A. Walker (1950 census). Stepfather of Mary Patricia (Walker) Simons, who took his surname.');
});
wed('hinds_marrion_roma', 'walker_john_william');
edit('simons_glen', ED, p => note(p, 'Born at Bellingham, Whatcom County (Ed Simons\'s tree, from his son). That answers Irma\'s question: not in the Lynden area.'));

// ── Ed's family: full names (living: names only) ────────────────────────────
for (const [id, name, alias] of [['simons_ed', 'Edward John "Ed" Simons', 'Ed Simons'], ['simons_kim', 'Kimberly Kay Alberts (Simons)', 'Kim Simons'], ['simons_john', 'John Glen Simons', 'John Simons'], ['henley_kayla', 'Kayla Ann Simons (Henley)', 'Kayla Henley'], ['simons_ann', 'Ann Elizabeth Simons', 'Ann Simons']]) {
  if (!exists(id)) continue;
  edit(id, ED, p => { p.name = name; add(p.aliases, alias); });
}
console.log('Raymond relinked; Ed tree facts applied');
