#!/usr/bin/env node
/**
 * 2026-09-24, record images for George Francis Adams Sr. and his brother and
 * sister (Oregon birth certificates, the 1920–1940 censuses and Presley's
 * WWII draft card), saved from Ancestry.com with Brendan Adams's approval,
 * and the Trumbo family photograph at Chehalis (about 1891) with John Holmes
 * Trumbo's 1957 key, shared in the Turner / Harvey Family Tree. Adds items to
 * data/media.json; re-runnable. Then run scripts/prepare-media.ps1 and
 * scripts/build.js.
 * Also records facts from the Turner / Harvey Family Tree (67006345): Edith's
 * 1933 wedding, Frances Korecki, Kathleen Nancy Adams, George F. Adams (#2)'s
 * burial, and Serena's brothers and sisters from the 1957 key.
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

const NARA = 'National Archives and Records Administration';
const OSA = 'Oregon State Archives, Salem';
const KIDS = ['george_francis_adams_sr', 'adams_presley', 'adams_edith_v'];
const items = [
  {
    id: 'birth-1910-pressley-alfred-adams', kind: 'document',
    file: 'ancestry_birth_1910_pressley_alfred_adams.jpg',
    title: 'Birth certificate of Pressley Alfred Adams, 22 June 1910',
    caption: 'Roseburg, Douglas County, Oregon, registered no. 2498: Pressley Alfred Adams, male, born 22 Jun 1910 at 7 p.m., the first child of Geo. F. Adams, 33, druggist, born in Missouri, and Serena Trumbo, 20, born in Washington, of Roseburg. Attended by E. V. Hoover, M.D.; filed July 1910. As an adult he used Presley Mark Adams.',
    source: `Oregon, U.S., State Births, 1842-1924, Douglas County, 1910; image from Ancestry.com. Original: ${OSA}.`,
    people: ['adams_presley', 'adams_george_francis_2', 'trumbo_serena_marie'],
  },
  {
    id: 'birth-1912-edith-van-tyne-adams', kind: 'document',
    file: 'ancestry_birth_1912_edith_van_tyne_adams.jpg',
    title: 'Birth certificate of Edith Van Tyne Adams, 29 April 1912',
    caption: 'Sutherlin, Douglas County, Oregon, registered no. 1847, stamped "ALTERED": a girl born 29 Apr 1912, the second child of Geo. F. Adams, 35, pharmacist, born in Missouri, and Serena Trumbo, born in Washington, housewife. The given names "Edith Van Tyne" were added in red later, by affidavit.',
    source: `Oregon, U.S., State Births, 1842-1924, Douglas County, 1912; image from Ancestry.com. Original: ${OSA}.`,
    people: ['adams_edith_v', 'adams_george_francis_2', 'trumbo_serena_marie'],
  },
  {
    id: 'birth-1916-george-francis-adams', kind: 'document',
    file: 'ancestry_birth_1916_george_francis_adams.jpg',
    title: 'Birth certificate of George Francis Adams, 10 March 1916',
    caption: 'Oregon State Board of Health certificate no. 25: George Francis Adams, male, born 10 Mar 1916 at Mercy Hospital, Roseburg, the third child of George Francis Adams, 38, druggist, born in Missouri, and Serena Trumbo, 26, born at Chehalis, Washington, housewife, of Sutherlin. The given name was added from a supplemental report dated 25 Mar 1916.',
    source: `Oregon, U.S., State Births, 1842-1924, Douglas County, March 1916; image from Ancestry.com. Original: ${OSA}.`,
    people: ['george_francis_adams_sr', 'adams_george_francis_2', 'trumbo_serena_marie'],
  },
  {
    id: 'census-1920-sutherlin-adams', kind: 'document',
    file: 'ancestry_1920_census_sutherlin_adams.jpg',
    title: '1920 census: the Adams household, Sutherlin, Douglas County, Oregon',
    caption: 'George F. Adams (43), a druggist, born in Missouri, with his wife Serena M. N. (30) and their children Presley (9), Edith V. (7) and "Edward G." (3). Taken in January 1920, a few weeks before George\'s death on 7 February.',
    source: `1920 United States Federal Census, Sutherlin, Douglas County, Oregon, ED 146, page 9B (NARA T625, roll 1494); image from Ancestry.com. Original: ${NARA}.`,
    people: ['adams_george_francis_2', 'trumbo_serena_marie', ...KIDS],
  },
  {
    id: 'census-1930-burlingame-wells', kind: 'document',
    file: 'ancestry_1930_census_burlingame_wells.jpg',
    title: '1930 census: the Wells household, 1315 Drake Avenue, Burlingame, California',
    caption: 'Arthur T. Wells (39), his wife Serena M. (40), his stepchildren Presley M. Adams (20), Edith V. Adams (17) and "George F. Wells" (14), and his daughters Rosemary (12) and Daphne L. (5).',
    source: `1930 United States Federal Census, Burlingame, San Mateo County, California, ED 2, page 10B (FHL microfilm 2339951); image from Ancestry.com. Original: ${NARA}.`,
    people: ['wells_arthur', 'trumbo_serena_marie', ...KIDS, 'wells_rosemary', 'wells_daphne'],
  },
  {
    id: 'census-1940-richmond-presley-adams', kind: 'document',
    file: 'ancestry_1940_census_richmond_presley_adams.jpg',
    title: '1940 census: Presley and Frances Adams, 140 Santa Fe Avenue, Richmond, California',
    caption: 'Presley Adams (29), a laboratory technician, born in Oregon, with four years of college; his wife Frances (24); and their son, 8 months old.',
    source: `1940 United States Federal Census, Richmond, Contra Costa County, California, ED 7-62, sheet 13B (NARA T627, roll 198); image from Ancestry.com. Original: ${NARA}.`,
    people: ['adams_presley', 'adams_fran', 'adams_frederick_s'],
  },
  {
    id: 'census-1940-portland-childs', kind: 'document',
    file: 'ancestry_1940_census_portland_childs.jpg',
    title: '1940 census: Thomas and Edith Childs, NE 46th Avenue, Portland, Oregon',
    caption: 'Thomas W. Childs (31), his wife Edith (27), born in Oregon, and their son George C. (2). In 1935 they were living in Philadelphia.',
    source: `1940 United States Federal Census, Portland, Multnomah County, Oregon, ED 37-263, sheet 1B (NARA T627, roll 3389); image from Ancestry.com. Original: ${NARA}.`,
    people: ['childs_thomas', 'adams_edith_v', 'childs_george_c'],
  },
  {
    id: 'draft-ww2-presley-mark-adams', kind: 'album',
    title: 'WWII draft registration card of Presley Mark Adams, 16 October 1940',
    caption: 'Serial no. 875: Presley Mark Adams, 140 Santa Fe Avenue, Richmond, California, aged 30, born 21 Jun 1910 at Roseburg, Oregon; his wife Mrs. Frances Adams; employed by the Standard Oil Company of California. Page 2: 6 ft, 200 lb, blue eyes, brown hair, light complexion, a scar on the left wrist.',
    source: `U.S., World War II Draft Registration Cards, California, 1940-1947 (Records of the Selective Service System, RG 147); images from Ancestry.com. Original: ${NARA}, St. Louis.`,
    people: ['adams_presley', 'adams_fran'],
    pages: ['ancestry_ww2_draft_presley_mark_adams_p1.jpg', 'ancestry_ww2_draft_presley_mark_adams_p2.jpg'],
  },
  {
    id: 'trumbo-house-chehalis', kind: 'album',
    title: 'The Trumbo family at their house in Chehalis, Washington, about 1891',
    caption: 'Page 1: the house Presley N. Trumbo built at Chehalis in 1890, with the family numbered: his father Presley at the door (1), his mother holding the baby Serena (2 and 7), and the other children on the porch and by the fence. Page 2: the key written by John Holmes Trumbo in 1957: "The old home in Chehalis built by my father in 1890. The house is still occupied and has had very few alterations." He lists his father Presley Nevil Trumbo, born 1840; his mother Hannah Lois Trumbo; himself, John Holmes Trumbo, 1881; his sisters Lizzie Buckley Trumbo, 1883, and Gertrude Trumbo, 1885; his brother Presley Nevil Trumbo, 1887; and his sister Serena Maria Nevada Trumbo.',
    source: 'Shared on Ancestry.com by Therese Roberson, 21 Jan 2018; from the public member tree "Turner / Harvey Family Tree".',
    people: ['trumbo_presley_neville', 'buckley_hannah_louise', 'trumbo_serena_marie', 'trumbo_john_holmes', 'trumbo_lizzie_buckley', 'trumbo_gertrude', 'trumbo_presley_nevil_jr'],
    pages: ['ancestry_trumbo_house_chehalis.jpg', 'ancestry_trumbo_house_chehalis_key.jpg'],
  },
];
const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');

// ── facts from the Turner / Harvey Family Tree ───────────────────────────────
const TREE = 'Ancestry.com, public member tree "Turner / Harvey Family Tree" (tree 67006345)';
const KEY = 'John Holmes Trumbo, handwritten key to the Chehalis house photograph, 1957 (Turner / Harvey Family Tree on Ancestry.com)';

edit('adams_edith_v', TREE, p => {
  p.milestones = p.milestones.map(t => t === 'Married Thomas White Childs (m. abt 1934)' ? 'Married Thomas White Childs (m. 11 Sep 1933, Burlingame, California)' : t);
  add(p.locations, 'Burlingame, San Mateo County, California');
  note(p, 'She married Thomas White Childs on Monday, 11 Sep 1933, at St. Paul\'s Episcopal Church, Burlingame (Turner / Harvey Family Tree, citing the newspaper notice "Childs Marriage To Take Place Monday"). Another clipping in the tree, headed "Arrive From Eastern Seaboard", reports the couple moving from Philadelphia to Portland.');
});
edit('childs_thomas', TREE, p => { p.milestones = p.milestones.map(t => t === 'Married Edith Van Tyne Adams (m. abt 1934)' ? 'Married Edith Van Tyne Adams (m. 11 Sep 1933, Burlingame, California)' : t); });
edit('adams_fran', TREE, p => {
  if (p.name === 'Frances “Fran” Adams') { add(p.aliases, p.name); p.name = 'Frances “Fran” Korecki (Adams)'; }
  p.birth = p.birth || '9 Mar 1916'; p.death = p.death || '7 Dec 2002';
  for (const l of ['Toledo, Ohio', 'Richmond, California']) add(p.locations, l);
  note(p, 'Born Frances Korecki on 9 Mar 1916 at Toledo, Ohio; Woodward High School, Toledo, 1932; died 7 Dec 2002 at Richmond, California (Turner / Harvey Family Tree).');
});
edit('adams_casey', TREE, p => {
  p.birth = p.birth || '15 Jan 1944';
  if (!p.death || p.death === 'deceased') p.death = '16 Dec 1997';
  add(p.aliases, 'Kathleen Nancy Adams');
  note(p, 'The Turner / Harvey Family Tree gives Presley\'s daughter as Kathleen Nancy Adams, 15 Jan 1944 – 16 Dec 1997.');
});
edit('adams_george_francis_2', TREE, p => {
  if (!p.birth || p.birth === 'Aug 1876') p.birth = '24 Aug 1876';
  add(p.locations, 'Chariton County, Missouri');
  add(p.milestones, 'Buried at Valley View Cemetery, Sutherlin, Oregon');
  p.notes = p.notes.filter(t => !t.startsWith('Unconfirmed: He may be buried in Sutherlin'));
  note(p, 'Born 24 Aug 1876 in Chariton County, Missouri; registered for the WWI draft in 1917 at Sutherlin as a druggist in his own business; died 7 Feb 1920 at Oakland, Douglas County, and buried at Valley View Cemetery, Sutherlin (Turner / Harvey Family Tree, citing Find a Grave memorial 83796381, with photographs of his headstone, "George F. Adams 1876–1920").');
});
edit('george_francis_adams_sr', TREE, p => note(p, 'The Turner / Harvey Family Tree lists him as "Edward George Adams", born 12 Mar 1916, following the 1920 census; his birth certificate gives George Francis Adams, born 10 Mar 1916.'));
edit('trumbo_serena_marie', [TREE, KEY], p => {
  for (const a of ['Serena Maria Nevada Trumbo']) add(p.aliases, a);
  for (const l of ['Dryad, Lewis County, Washington', 'Burlingame, California', 'San Francisco, California', 'Fort Lewis, Washington']) add(p.locations, l);
  note(p, 'Born 24 Mar 1890 at Chehalis, Washington, the youngest of the children in her brother John Holmes Trumbo\'s 1957 key to the family photograph. She lived at Dryad, Lewis County, in 1900, married George F. Adams at Chehalis on 7 Jan 1909, lived at 1315 Drake Avenue, Burlingame, from about 1922, and at 1156 Filbert Street, San Francisco, in 1940; she died at Fort Lewis, Washington, on 28 Sep 1967 (Turner / Harvey Family Tree).');
});
edit('trumbo_presley_neville', KEY, p => { add(p.aliases, 'Presley Nevil Trumbo'); add(p.locations, 'Chehalis, Washington'); note(p, 'He built the family house at Chehalis in 1890; his son John Holmes Trumbo wrote in 1957 that it was still occupied with very few alterations.'); });
edit('buckley_hannah_louise', KEY, p => { add(p.aliases, 'Hannah Lois Trumbo'); note(p, 'Her son John Holmes Trumbo\'s 1957 key calls her Hannah Lois Trumbo.'); });
const SIBS = [
  ['trumbo_john_holmes', 'John Holmes Trumbo', 'M', '1881'],
  ['trumbo_lizzie_buckley', 'Lizzie Buckley Trumbo', 'F', '1883'],
  ['trumbo_gertrude', 'Gertrude Trumbo', 'F', '1885'],
  ['trumbo_presley_nevil_jr', 'Presley Nevil Trumbo Jr.', 'M', '1887'],
];
for (const [id, name, sex, b] of SIBS) {
  person(id, name, sex, KEY, p => { p.birth = p.birth || b; note(p, `Child of Presley Nevil and Hannah (Buckley) Trumbo; an older ${sex === 'M' ? 'brother' : 'sister'} of Serena Trumbo Adams. Named, with his or her birth year, in John Holmes Trumbo's 1957 key to the family photograph at their Chehalis house.`.replace('with his or her', sex === 'M' ? 'with his' : 'with her')); });
  child(id, 'trumbo_presley_neville', 'buckley_hannah_louise');
}
const ALL = ['trumbo_serena_marie', 'trumbo_george', ...SIBS.map(s => s[0])];
for (const id of ALL) edit(id, [], p => { for (const o of ALL) if (o !== id) add(p.relationships.siblings, o); });
console.log('Adams record images and Trumbo photograph added');
