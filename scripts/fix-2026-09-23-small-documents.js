#!/usr/bin/env node
/**
 * 2026-09-23, from the ten small documents in 00_Raw_Input_Files/images that
 * had not been used, at Brendan Adams's request. Re-runnable.
 *  - Ref.pdf: George Francis Adams (#1)'s obituary, Castle Rock Journal,
 *    12 Aug 1896 (added as a document). Its clean scan reads "May 17, 1816";
 *    the tree's 11 May came from an OCR reading, so Brendan chose 17 May.
 *  - CharitonCountyPartial_1880.pdf: plat map of Township 56 N, Range 19 W.
 *  - VSL_Report_915.pdf: Virginia General Assembly list (Joseph P. Adams,
 *    House, 1824/25, Morgan).
 *  - The 1920 and 1940 census transcriptions (FamilySearch).
 *  - 2012CMDFlyer.docx: date of George #1's grave dedication.
 *  - Info on Gavin Hamilton & Robert Burns.doc: the Kilmarnock edition.
 *  - Lineage+of+Hamilton+of+Kype.doc (Russ Bralley's chart): John Hamilton of
 *    Kype's own family, and (at Brendan's request) the older Kype line back to
 *    about 1600, every record marked UNPROVEN. The Stonehouse, Raploch, Cadzow
 *    and royal lines on the chart are left out.
 *  - The Family of Francis & Susan HAMILTON.docx and George F. Adams II
 *    Obituary.docx repeat material already in the tree.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, src) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [src], notes: [], aliases: [] });
function edit(id, fn, src) { const p = load(id); for (const k of ['milestones', 'locations', 'notes', 'sources', 'aliases', 'career', 'education', 'notable_stories']) p[k] = p[k] || []; fn(p); if (src) add(p.sources, src); save(p); return p; }
function person(id, name, src, o = {}) {
  if (!exists(id)) save(blank(id, name, src));
  return edit(id, p => {
    for (const k of ['birth', 'death']) if (o[k] && !p[k]) p[k] = o[k];
    for (const k of ['aliases', 'locations', 'milestones', 'career', 'education', 'notable_stories']) for (const v of o[k] || []) add(p[k], v);
    for (const v of o.notes || []) note(p, v);
  }, src);
}
const child = (kid, father, mother) => {
  edit(kid, p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, p => add(p.relationships.children, kid));
};

// ── George Francis Adams (#1): obituary and grave ─────────────────────────
const OBIT = 'Obituary of George Francis Adams, Castle Rock Journal (Castle Rock, Douglas County, Colorado), 12 Aug 1896, p. 4';
edit('adams_george_francis_1', p => {
  add(p.milestones, 'Died 1896, before 12 Aug, at Castle Rock, Douglas County, Colorado, after six months confined to bed (obituary, Castle Rock Journal, 12 Aug 1896)');
  add(p.milestones, 'Funeral conducted by the Rev. Sisson of the Methodist church at Castle Rock; buried in the Castle Rock cemetery');
  add(p.milestones, 'Religion: member of the Presbyterian church for 55 years');
  add(p.milestones, 'Grave dedicated at the Colorado Division SCV Confederate Memorial Day observance, Cedar Hill Cemetery, Castle Rock, 21 Apr 2012');
  note(p, `His obituary, signed "A Friend", says he was born in Jefferson County, Virginia; his parents went west in 1833; he went back to Virginia in 1834 and returned to Missouri the same year; fought in the Black Hawk War (printed 1835), enlisted under General Price and Colonel Watson to drive the Mormons from Missouri (printed 1836), and later against the Mexicans to capture Santa Fe; served in the Confederate army under Generals Price, Van Dorn and Magruder; was a large landowner who lived 42 years in Chariton County, Missouri, came to Colorado in 1878 and lived there until his death; his wife died in 1863; he raised his children himself and left four sons and four daughters. [${OBIT}]`);
  p.notes = p.notes.filter(t => !/Left for Brendan to decide\.$/.test(t));
  if (p.birth === '11 May 1816') p.birth = '17 May 1816';
  note(p, `CORRECTION 2026-09-23: Birth changed from 11 May 1816 to 17 May 1816. The clean scan of his 1896 obituary (Ref.pdf) reads "May 17, 1816"; 11 May came from the OCR reading of a poorer copy of the same obituary in Bill Allen's document. Decision by Brendan Adams. [${OBIT}]`);
}, OBIT);

// ── Chariton County plat map, about 1880 ──────────────────────────────────
const PLAT = 'Plat map of Township 56 North, Range 19 West, Chariton County, Missouri (about 1880), highlighted by Bill Allen';
const LAND = { allen_george_philemon: 'Owned 182.89 and 80 acres in Township 56 North, Range 19 West, northwest Chariton County, Missouri, north of Rothville (plat map, about 1880)',
  adams_john_wesley: 'Owned 40 acres in Township 56 North, Range 19 West, northwest Chariton County, Missouri, near G. P. Allen (plat map, about 1880)',
  clark_clay_c: 'Owned 80 acres in Township 56 North, Range 19 West, northwest Chariton County, Missouri, beside G. P. Allen (plat map, about 1880)' };
for (const [id, t] of Object.entries(LAND)) edit(id, p => { add(p.milestones, t); add(p.locations, 'Chariton County, Missouri'); }, PLAT);
edit('clark_clay_c', p => note(p, `The Willett family, who raised Clay until he was 18, owned 160.58 acres (W. W. Willet) in the upper right of the same township on the plat map of about 1880. [${PLAT}]`));

// ── Virginia General Assembly list ────────────────────────────────────────
const VSL = 'Alphabetical List of Members of the General Assembly, 1776-1918, in the Thirteenth Annual Report of the Library Board of the Virginia State Library, 1915-1916 (Richmond, 1917)';
edit('adams_jose_pierre', p => note(p, `The Virginia State Library's list of General Assembly members has "Adams, Joseph P. House, 1824/25, Morgan." The record elsewhere says 1825-1826; the list dates the session 1824/25. [${VSL}]`), VSL);

// ── 1920 and 1940 censuses ────────────────────────────────────────────────
const C1920 = '1920 U.S. census, Douglas County, Oregon, household 51, sheet 9 (FamilySearch index, accessed 2 Apr 2013)';
const C1940 = '1940 U.S. census, Assembly District 22, San Francisco, California, ED 38-131, sheet 12B (FamilySearch index, accessed 2 Apr 2013)';
edit('adams_george_francis_2', p => { add(p.milestones, 'Census 1920: Douglas County, Oregon, head of household, aged 43, born Missouri, with Serena (30), Presley N. (9), Edith V. (7) and Edward G. (3 years 9 months)'); add(p.locations, 'Douglas County, Oregon'); }, C1920);
edit('trumbo_serena_marie', p => { add(p.milestones, 'Census 1920: Douglas County, Oregon, aged 30, born Washington'); add(p.milestones, 'Census 1940: San Francisco, California, as Serena M. M. Wells, aged 50, wife of Arthur T. Wells'); add(p.locations, 'San Francisco, CA'); }, C1920);
edit('trumbo_serena_marie', p => {}, C1940);
edit('adams_presley', p => { add(p.aliases, 'Presley N. Adams'); add(p.milestones, 'Census 1920: Douglas County, Oregon, aged 9, born Oregon'); }, C1920);
edit('adams_edith_v', p => add(p.milestones, 'Census 1920: Douglas County, Oregon, aged 7, born Oregon'), C1920);
edit('george_francis_adams_sr', p => {
  add(p.milestones, 'Census 1940: San Francisco, California, aged 24, single, stepson of Arthur T. Wells; living in Burlingame, San Mateo County, in 1935');
  add(p.locations, 'San Francisco, CA'); add(p.locations, 'Burlingame, San Mateo County, California');
  note(p, `The 1920 census of his parents' household in Douglas County, Oregon, lists a son "Edward G. Adams", aged 3 years 9 months (born about 1916-17, Oregon), and no other young son; George, born 10 Mar 1916, would have been 3 years 10 months. The emails say Oregon birth certificates exist under both names. Brendan Adams doubts they are the same person; left open. [${C1920}]`);
}, C1940);
edit('wells_arthur', p => { add(p.aliases, 'Arthur T. Wells'); add(p.milestones, 'Census 1940: San Francisco, California, aged 49, born New Zealand, with his wife Serena, stepson George Adams and daughter Daphne (15)'); add(p.locations, 'New Zealand'); }, C1940);
person('wells_daphne', 'Daphne Wells', C1940, { birth: 'abt 1925', locations: ['California', 'San Francisco, CA'], notes: [`Aged 15 and born in California in the 1940 census of Arthur T. Wells's San Francisco household, with Serena and George Adams. [${C1940}]`] });
child('wells_daphne', 'wells_arthur', null);

// ── Gavin Hamilton: the Kilmarnock edition ────────────────────────────────
const BURNS = 'Info on Gavin Hamilton & Robert Burns (Wikipedia extracts on Mauchline and the Kilmarnock volume), sent with the family emails';
edit('hamilton_gavin_mauchline', p => add(p.notable_stories, 'Robert Burns’s first book, Poems, Chiefly in the Scottish Dialect (the Kilmarnock volume, printed by John Wilson, 31 July 1786, 600 copies), was dedicated to him. Burns, short of money for a passage to the West Indies, published by subscription at his suggestion.'), BURNS);

// ── John Hamilton of Kype's family (Russ Bralley's chart) ─────────────────
const KYPE = 'Lineage of Hamilton of Kype, chart compiled by Russ Bralley (Word document, shared with the family)';
person('hamilton_john_of_kype', 'John Hamilton of Kype', KYPE, {
  birth: 'bap 11 Jun 1708',
  career: ['Appointed Clerk to the Regality of Mauchline, about 1730'],
  milestones: ['Baptized 11 Jun 1708', 'Married Jacobina Young (m. 1732)', 'Married Barbara Murdoch (m. 21 Sep 1761)'],
  locations: ['Mauchline, Ayrshire, Scotland'],
  notes: [`Russ Bralley's chart places him as the son of Gavin Hamilton of Kype (mentioned 1670) in a line of Hamiltons of Kype in Lanarkshire going back to about 1600; not yet added to the tree. [${KYPE}]`],
});
person('young_jacobina', 'Jacobina Young', KYPE, { death: '21 Jul 1753', milestones: ['Married John Hamilton of Kype (m. 1732)', 'Died 21 Jul 1753'] });
person('young_john', 'John Young', KYPE, { notes: [`Father of Jacobina Young; married Mary Simpson. [${KYPE}]`] });
person('simpson_mary', 'Mary Simpson (Young)', KYPE, { notes: [`Wife of John Young and mother of Jacobina Young. [${KYPE}]`] });
edit('young_john', p => { p.relationships.spouse = 'simpson_mary'; }); edit('simpson_mary', p => { p.relationships.spouse = 'young_john'; });
child('young_jacobina', 'young_john', 'simpson_mary');
person('murdoch_barbara', 'Barbara Murdoch (Hamilton)', KYPE, { birth: '1730', milestones: ['Married John Hamilton of Kype (m. 21 Sep 1761)'], notes: [`Fifth daughter of Thomas Murdoch of Cumloden and Elizabeth Cochrane; second wife of John Hamilton of Kype. Her sister Charlotte married John Tait of Harvieston. [${KYPE}]`] });
edit('hamilton_john_of_kype', p => { p.relationships.spouse = p.relationships.spouse || 'young_jacobina'; p.relationships._extra_spouses = p.relationships._extra_spouses || []; add(p.relationships._extra_spouses, 'murdoch_barbara'); });
edit('murdoch_barbara', p => { p.relationships.spouse = 'hamilton_john_of_kype'; });
edit('hamilton_alexander_uncle', p => { if (!p.birth) p.birth = 'bap 3 Nov 1741'; if (!p.death) p.death = '1799'; add(p.milestones, 'Baptized 3 Nov 1741, Mauchline, Ayrshire, Scotland'); add(p.milestones, 'Died 1799, Maryland'); add(p.milestones, 'Married Susan'); add(p.locations, 'Maryland'); }, KYPE);
edit('hamilton_gavin_mauchline', p => { add(p.milestones, 'Baptized 20 Nov 1751'); add(p.milestones, 'Died 5 Feb 1805'); note(p, `Russ Bralley's chart: baptized 20 Nov 1751; conveyed a lease of Mossgiel to Gilbert Burns and his brother Robert at Whitsunday 1788; married Helen Kennedy of Daljarrock, daughter of Robert Kennedy, parish of Colmonell, by Grizel Cathcart; died 5 Feb 1805 and buried in Mauchline churchyard. [${KYPE}]`); }, KYPE);
edit('kennedy_helen', p => note(p, `Of Daljarrock; daughter of Robert Kennedy, parish of Colmonell, and Grizel Cathcart. [${KYPE}]`), KYPE);
const KIDS = [
  ['hamilton_gavin_1732', 'Gavin Hamilton', 'young_jacobina', { birth: 'bap 16 Dec 1732', milestones: ['Baptized 16 Dec 1732', 'Died in infancy'] }],
  ['hamilton_mary_1734', 'Mary Hamilton', 'young_jacobina', { birth: '11 May 1734', milestones: ['Born 11 May 1734', 'Died young'] }],
  ['hamilton_john_1739', 'John Hamilton', 'young_jacobina', { birth: 'bap 5 Nov 1739', milestones: ['Baptized 5 Nov 1739', 'Moved to Virginia'], locations: ['Virginia'] }],
  ['hamilton_elizabeth_kype', 'Elizabeth Hamilton', 'young_jacobina', {}],
  ['hamilton_magdalena_kype', 'Magdalena Hamilton', 'young_jacobina', {}],
  ['hamilton_jacobina_1750', 'Jacobina Hamilton (Reid)', 'young_jacobina', { birth: 'bap 14 Jan 1750', milestones: ['Baptized 14 Jan 1750', 'Married Patrick Reid, a West India merchant'] }],
  ['hamilton_thomas_1762', 'Thomas Hamilton', 'murdoch_barbara', { birth: '9 Aug 1762', milestones: ['Born 9 Aug 1762', 'Died young'] }],
  ['hamilton_charlotte_kype', 'Charlotte Hamilton', 'murdoch_barbara', {}],
  ['hamilton_grace_1767', 'Grace Hamilton', 'murdoch_barbara', { birth: 'bap 5 Feb 1767', milestones: ['Baptized 5 Feb 1767'] }],
  ['hamilton_william_1769', 'William Hamilton', 'murdoch_barbara', { birth: 'bap 21 Dec 1769', career: ['Studied with John Tait of Harvieston, husband of his late aunt Charlotte Murdoch; admitted Writer to the Signet, 1793'], milestones: ['Baptized 21 Dec 1769'] }],
];
for (const [id, name, mother, o] of KIDS) {
  person(id, name, KYPE, { ...o, notes: [`Child of John Hamilton of Kype and ${mother === 'young_jacobina' ? 'his first wife, Jacobina Young' : 'his second wife, Barbara Murdoch'}. [${KYPE}]`] });
  child(id, 'hamilton_john_of_kype', mother);
}

// ── The older Hamilton of Kype line, marked unproven (Brendan, 2026-09-23) ─
// Only the Kype line back to about 1600; the Stonehouse, Raploch, Cadzow and
// royal lines on the same chart are left out.
const UNP = `UNPROVEN: from the older Hamilton of Kype line on Russ Bralley's chart. The chart does not document how this line connects to John Hamilton of Kype (bap. 1708), and the compiler himself marked one of its links "What's the connection?". [${KYPE}]`;
const K = (id, name, o = {}) => person(id, name, KYPE, { ...o, notes: [UNP, ...(o.notes || [])] });
const wed = (a, b) => { edit(a, p => { p.relationships.spouse = b; }); edit(b, p => { p.relationships.spouse = a; }); };
K('hamilton_john_kype_1611', 'John Hamilton of Kype (d. abt 1611)', { death: 'abt 1611', aliases: ['John Hamilton of Langkype', 'John Hamilton in Kypchapel'], locations: ['Kype, Lanarkshire, Scotland'],
  notes: ['Executor and legatee of John Hamilton in Glengavill, 2 Feb 1589/90. Probably the John Hamilton in Kypechappel who witnessed the will of Matthew Hamilton in Halls of Glengavill on 30 May 1603, and the John Hamilton in Kyp who owed money to Sir Robert Hamilton of Goslingtoun in 1609. Apparently died about 1611. The chart asks whether he descends from John Hamilton in Halls of Glengavill (d. 1589/90).'] });
K('hamilton_isobel_kypchapel', 'Isobel Hamilton', { death: 'bef 24 Jun 1611', notes: ['Wife of John Hamilton of Kype. Her testament, dated 23 Feb 1611, was confirmed on 24 Jun 1611 and calls her spouse to John Hamilton in Kypchapel; Mungo Hamilton, cordiner burgess of Glasgow, was cautioner.'] });
wed('hamilton_john_kype_1611', 'hamilton_isobel_kypchapel');
K('hamilton_gavin_kype_1649', 'Gavin Hamilton of Kype (d. by 1650)', { death: 'bef 1650', locations: ['Kype, Lanarkshire, Scotland'], notes: ['On 8 Nov 1648 he, his wife Abigail, their son and heir John, and John’s future wife Jean Cleland are mentioned together. Alive 6 Jul 1649; dead by the next year, when his son John succeeded him. A daughter of this family married William Auchinleck in Hessildane, a creditor for her tocher (dowry).'] });
K('hamilton_hew_kype', 'Hugh (Hew) Hamilton'); K('hamilton_grizzel_kype', 'Grizzel Hamilton');
for (const k of ['hamilton_gavin_kype_1649', 'hamilton_hew_kype', 'hamilton_grizzel_kype']) child(k, 'hamilton_john_kype_1611', 'hamilton_isobel_kypchapel');
K('hamilton_abigail', 'Abigail Hamilton', { notes: ['Wife of Gavin Hamilton of Kype; daughter of John Hamilton, Tutor of Stonehouse (born about 1533), through whom the chart continues to the Hamiltons of Stonehouse, Raploch and Cadzow. Those older lines are not in the tree.'] });
wed('hamilton_gavin_kype_1649', 'hamilton_abigail');
K('hamilton_john_west_kype', 'John Hamilton of West Kype', { milestones: ['Married Jean Cleland (m. abt 8 Nov 1648)', 'Refused the Test, 1683'], locations: ['West Kype, Lanarkshire, Scotland'], notes: ['Named with his father in 1648 and as a son of Gavin Hamilton of Kype on 6 Jul 1649; "of West Kype" on 18 Jan 1650. Refused the Test in 1683 and was apparently alive in 1688 at his daughter Elizabeth’s wedding.'] });
K('hamilton_james_rawes', 'James Hamilton in Rawes of Kype', { notes: ['Had a charter in Langkype on 23 Nov 1649, and appears in Rawes of Kype in 1650 and 1658. The chart places him beside John of West Kype, probably a brother.'] });
for (const k of ['hamilton_john_west_kype', 'hamilton_james_rawes']) child(k, 'hamilton_gavin_kype_1649', 'hamilton_abigail');
K('cleland_jean', 'Jean Cleland (Hamilton)', { death: 'bef 9 Apr 1669', milestones: ['Married John Hamilton of West Kype (m. abt 8 Nov 1648)'], notes: ['Called his "future wife" on 8 Nov 1648. Her testament was confirmed to her husband on 9 Apr 1669.'] });
wed('hamilton_john_west_kype', 'cleland_jean');
const BOND = 'One of the children who were parties to a bond registered 9 Apr 1669.';
const KK = [
  ['hamilton_gavin_kype_1670', 'Gavin Hamilton of Kype (fl. 1670)', { notes: [BOND, 'Mentioned with his father on 22 Jun 1670. The chart places John Hamilton of Kype (bap. 1708) as his son; that link is not documented.'] }],
  ['hamilton_james_1669', 'James Hamilton', { notes: [BOND] }], ['hamilton_john_1669', 'John Hamilton', { notes: [BOND] }],
  ['hamilton_helen_leiper', 'Helen Hamilton (Leiper)', { milestones: ['Married Thomas Leiper'], notes: [BOND] }],
  ['hamilton_katherine_1669', 'Katherine Hamilton', { notes: [BOND] }],
  ['hamilton_elizabeth_porteous', 'Elizabeth Hamilton (Porteous)', { milestones: ['Married James Porteous of Kirktondyke, by contract dated 26 Jul 1688'], notes: [BOND] }],
];
for (const [id, name, o] of KK) { K(id, name, o); child(id, 'hamilton_john_west_kype', 'cleland_jean'); }
child('hamilton_john_of_kype', 'hamilton_gavin_kype_1670', null);
edit('hamilton_john_of_kype', p => note(p, `UNPROVEN: father given as Gavin Hamilton of Kype (fl. 1670) only on Russ Bralley's chart; the link is not documented. Decision by Brendan Adams to show it, marked unproven. [${KYPE}]`));

// ── media ──────────────────────────────────────────────────────────────────
const MJ = path.resolve(__dirname, '..', 'data', 'media.json');
const media = JSON.parse(fs.readFileSync(MJ, 'utf8'));
const DOCS = [
  { id: 'gfa1-obituary-1896', kind: 'document', file: 'Ref.pdf', title: 'Obituary of George Francis Adams (#1), Castle Rock Journal, 12 Aug 1896', caption: 'Page 4, signed "A Friend". From the Colorado Historic Newspapers collection, printed 10 Nov 2011.', source: 'Colorado Historic Newspapers; sent by the Colorado Division SCV, 2011.', people: ['adams_george_francis_1'] },
  { id: 'chariton-county-plat-1880', kind: 'document', file: 'CharitonCountyPartial_1880.pdf', title: 'Plat map of Township 56 North, Range 19 West, Chariton County, Missouri, about 1880', caption: 'Northwest corner of the county, north of Rothville. Bill Allen highlighted the parcels of G. P. Allen, J. W. Adams, C. C. Clark and the Willett family, who raised Clay Clark.', source: 'Bill Allen, 2011.', people: ['allen_george_philemon', 'adams_john_wesley', 'clark_clay_c'] },
  { id: 'virginia-general-assembly-list', kind: 'document', file: 'VSL_Report_915.pdf', title: 'Members of the Virginia General Assembly, 1776–1918', caption: 'From the Thirteenth Annual Report of the Library Board of the Virginia State Library, 1915–1916 (Richmond, 1917). Lists "Adams, Joseph P. House, 1824/25, Morgan."', source: 'Virginia State Library, 1917 (digitized by Google).', people: ['adams_jose_pierre'] },
];
for (const d of DOCS) { const i = media.items.findIndex(m => m.id === d.id); if (i >= 0) media.items[i] = d; else media.items.push(d); }
fs.writeFileSync(MJ, JSON.stringify(media, null, 2) + '\n');
console.log('small documents applied');
