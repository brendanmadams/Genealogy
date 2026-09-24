#!/usr/bin/env node
/**
 * 2026-09-24, record images for the Trumbo and Buckley families from
 * Ancestry.com: the 1850, 1856 and 1860 censuses of the Trumbo household in
 * Van Buren County, Iowa; the 1860, 1870 and 1880 Buckley households in
 * California and Idaho; the 1900 Trumbo household at Dryad, Washington; and
 * John Holmes Trumbo's delayed Idaho birth certificate (filed 1941). Adds items
 * to data/media.json and the facts the images add; re-runnable. Then run
 * scripts/prepare-media.ps1 and scripts/build.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { load, save, note } = require('./lib/records');
const MEDIA = path.resolve(__dirname, '..', 'data', 'media.json');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const NARA = 'Original: National Archives and Records Administration.';

const items = [
  {
    id: 'census-1850-van-buren-trumbo', kind: 'document',
    file: 'ancestry_1850_census_van_buren_trumbo.jpg',
    title: '1850 census: the Trumbo household, Union Township, Van Buren County, Iowa',
    caption: 'Dwelling 6, lines 30–41, enumerated 19 Nov 1850: "Besley Trumby" (Presley Trumbo), 62, farmer, born in Pennsylvania, real estate $1,500; Susannah, 45, born in Ohio; and Matilda (23), Ames (22), Serene (20), John (17), Trovilla (15), Sarah (13), "Besley" (Presley, 10), Emalinda (6), Clarinda (2) and James (1 month), the youngest two born in Iowa and the rest in Pennsylvania.',
    source: `1850 United States Federal Census, Union Township, Van Buren County, Iowa, page 384; image from Ancestry.com. ${NARA}`,
    people: ['trumbo_presley_neville_1788', 'holmes_susannah', 'trumbo_presley_neville'],
  },
  {
    id: 'census-1856-iowa-trumbo', kind: 'document',
    file: 'ancestry_1856_iowa_census_trumbo.jpg',
    title: '1856 Iowa state census: the Trumbo household, Union Township, Van Buren County',
    caption: 'Household 295: Presley Trumbo, 68, farmer, born in Pennsylvania; Susan, 51, born in Ohio; John (23), Travilla (20), Sarah (17), Presley (15), Emalinda (11), Clarinda (8) and Theodore (6). Next door: George Emerick, 31, and his wife Serene, 25, born in Pennsylvania (Presley\'s sister), with Edward and Susan. The page is tightly bound and faint.',
    source: 'Iowa, U.S., State Census Collection, 1836-1925 (1856 state census, Van Buren County); image from Ancestry.com. Original: State Historical Society of Iowa.',
    people: ['trumbo_presley_neville_1788', 'holmes_susannah', 'trumbo_presley_neville'],
  },
  {
    id: 'census-1860-van-buren-trumbo', kind: 'document',
    file: 'ancestry_1860_census_van_buren_trumbo.jpg',
    title: '1860 census: the Trumbo household, Union Township, Van Buren County, Iowa',
    caption: 'Page 112, enumerated 20 Jun 1860, post office Utica. Dwelling 675 (lines 21–32): Presley Trumbo, 72, farmer, real estate $1,920; Susannah, 56, born in Ohio; John (27), "Faville" (25), Sarah (22), "Resley" (Presley, 20), Emalinda (15), Clarinda (12) and Theadore (10); and, as a second family in the same house, Amos Trumbo (31), Elizabeth M. (25) and Travillo (6 months). Dwelling 677: Geo. W. Emrich (30) and Sarena J. (29), Presley\'s sister.',
    source: `1860 United States Federal Census, Union Township, Van Buren County, Iowa, page 112; image from Ancestry.com. ${NARA}`,
    people: ['trumbo_presley_neville_1788', 'holmes_susannah', 'trumbo_presley_neville'],
  },
  {
    id: 'census-1860-placer-buckley', kind: 'document',
    file: 'ancestry_1860_census_placer_buckley.jpg',
    title: '1860 census: the Buckley household, Township 9, Placer County, California',
    caption: 'Page 61, enumerated 27 Jun 1860, post office Secret Ravine. Dwelling 675 (lines 13–18): David Buckley, 35, miner, born in Ireland; Margaret, 36, born in Ireland; Mary A. (8), Julia C. (5) and Hannah (3), all born in Louisiana; and a boarder, George Penny. Next door, Michael Buckley, 45, a miner born in Ireland.',
    source: `1860 United States Federal Census, Township 9, Placer County, California, page 61; image from Ancestry.com. ${NARA}`,
    people: ['buckley_david', 'buckley_margaret', 'buckley_hannah_louise'],
  },
  {
    id: 'census-1870-placerville-buckley', kind: 'document',
    file: 'ancestry_1870_census_placerville_buckley.jpg',
    title: '1870 census: Margaret Buckley and her daughters, Placerville, Boise County, Idaho Territory',
    caption: 'Page 8, enumerated 13 Jul 1870. Dwelling 102 (lines 15–18): Margaret Buckley, 55, keeping a boarding house, real estate $1,100, born in Ireland; Mary Ann (18) and Louisa (12), waiters, born in Louisiana; and Ah Hong, 25, cook, born in China.',
    source: `1870 United States Federal Census, Placerville, Boise County, Idaho Territory, page 8; image from Ancestry.com. ${NARA}`,
    people: ['buckley_margaret', 'buckley_hannah_louise'],
  },
  {
    id: 'census-1880-garden-valley-charters', kind: 'document',
    file: 'ancestry_1880_census_garden_valley_charters_buckley.jpg',
    title: '1880 census: the Charters household with Margaret and Louisa Buckley, Garden Valley, Boise County, Idaho',
    caption: 'Page 20, ED 11, enumerated 16 Jun 1880. Dwelling 392 (lines 35–40): Wm. Charters, 35, farmer, born in Scotland; his wife Mary An, 28, born in Louisiana to Irish parents; William D. (3) and Margret (2); Margret Buckley, 62, widowed, mother-in-law, born in Ireland; and Louisa, 22, sister-in-law, born in Louisiana. Louisa married Presley N. Trumbo at Garden Valley that Christmas.',
    source: `1880 United States Federal Census, Garden Valley, Boise County, Idaho, ED 11, page 20; image from Ancestry.com. ${NARA}`,
    people: ['buckley_margaret', 'buckley_hannah_louise'],
  },
  {
    id: 'census-1900-dryad-trumbo', kind: 'document',
    file: 'ancestry_1900_census_dryad_trumbo.jpg',
    title: '1900 census: the Trumbo household, Dryad Precinct, Lewis County, Washington',
    caption: 'Sheet 12B, ED 134, enumerated 28 Jun 1900. Lines 67–75: Presley Trumbo, 60, carpenter, born in Pennsylvania, father born in Pennsylvania, mother in Ohio, married 19 years; Lizzie, 41, born in Louisiana to Irish parents; John H. (18, born in Idaho, shingle weaver), Lizzie (16) and Gertrude (born in Nevada), Serena (born 24 Mar 1890 in Washington) and three younger children born in Washington.',
    source: `1900 United States Federal Census, Dryad Precinct, Lewis County, Washington, ED 134, sheet 12B; image from Ancestry.com. ${NARA}`,
    people: ['trumbo_presley_neville', 'buckley_hannah_louise', 'trumbo_john_holmes', 'trumbo_lizzie_buckley', 'trumbo_gertrude', 'trumbo_serena_marie'],
  },
  {
    id: 'birth-1881-john-holmes-trumbo', kind: 'document',
    file: 'ancestry_birth_1881_john_holmes_trumbo.jpg',
    title: 'Delayed birth certificate of John Holmes Trumbo, born 22 October 1881',
    caption: 'Idaho state file no. 318981, filed 20 Aug 1941: John Holmes Trumbo, born 22 Oct 1881 at the Yankee Fork mining camp, Custer County, Idaho; father Presley Nevil Trumbo, 41, born at Pittsburgh, Pennsylvania; mother Hannah Louise Buckley, 23, born at New Orleans, Louisiana; her first child. Sworn by J. C. Mills of Boise, a cousin, because the attendant at the birth could not be found.',
    source: 'Idaho, U.S., Birth Records, 1861-1924, certificate 318981; image from Ancestry.com. Original: Idaho Bureau of Vital Records and Health Statistics.',
    people: ['trumbo_john_holmes', 'trumbo_presley_neville', 'buckley_hannah_louise'],
  },
];
const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');

// ── Facts the images add ────────────────────────────────────────────────────
const BIRTH = 'Ancestry.com, Idaho, U.S., Birth Records, 1861-1924 (John Holmes Trumbo, certificate 318981)';
const C1900 = 'Ancestry.com, 1900 United States Federal Census (Dryad, Lewis County, Washington)';
const C1856 = 'Ancestry.com, Iowa, U.S., State Census Collection, 1836-1925 (1856, Union, Van Buren County)';
const C1860T = 'Ancestry.com, 1860 United States Federal Census (Union, Van Buren County, Iowa; post office Utica)';
const C1860B = 'Ancestry.com, 1860 United States Federal Census (Township 9, Placer County, California; post office Secret Ravine)';
const edit = (id, src, fn) => { const p = load(id); for (const k of ['notes', 'sources', 'locations']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };

edit('trumbo_presley_neville', [BIRTH, C1900], p => {
  add(p.locations, 'Pittsburgh, Pennsylvania');
  add(p.locations, 'Nevada');
  note(p, "His son John Holmes Trumbo's delayed birth certificate (filed 1941) gives his birthplace as Pittsburgh, Pennsylvania. In 1900 his daughters Lizzie and Gertrude are recorded as born in Nevada, so the family lived there in the mid-1880s, between Idaho and Washington.");
});
edit('buckley_hannah_louise', BIRTH, p => {
  add(p.locations, 'New Orleans, Louisiana');
  note(p, "Her son John Holmes Trumbo's delayed birth certificate (filed 1941) gives her birthplace as New Orleans, Louisiana, and her age as 23 at his birth in October 1881.");
});
edit('trumbo_john_holmes', [BIRTH, C1900], p => {
  if (!p.birth || p.birth === '1881') p.birth = '22 Oct 1881';
  add(p.locations, 'Yankee Fork mining camp, Custer County, Idaho');
  note(p, "Born 22 Oct 1881 at the Yankee Fork mining camp, Custer County, Idaho, the first child of Presley Nevil Trumbo and Hannah Louise Buckley (delayed Idaho birth certificate, filed 20 Aug 1941 on the sworn statement of J. C. Mills of Boise, a cousin). In 1900, aged 18, he was a shingle weaver at Dryad, Lewis County, Washington.");
});
for (const id of ['trumbo_lizzie_buckley', 'trumbo_gertrude']) edit(id, C1900, p => { add(p.locations, 'Nevada'); note(p, 'Born in Nevada (1900 census, Dryad, Lewis County, Washington).'); });
edit('trumbo_presley_neville_1788', [C1856, C1860T], p => note(p, "In 1856 and 1860 his daughter Serene (Sarena J.), born about 1830 in Pennsylvania, lived next door as the wife of George W. Emerick (Emrich), a farmer born in Illinois; his son Amos and Amos's wife Elizabeth M. shared his house in 1860."));
edit('buckley_david', C1860B, p => note(p, "Lead: next door to him in 1860 lived Michael Buckley, 45, a miner born in Ireland, perhaps a relative."));
console.log('Trumbo and Buckley record images added');
