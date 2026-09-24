#!/usr/bin/env node
/**
 * 2026-09-24, record images saved from Ancestry.com with Brendan Adams's
 * approval (US federal census and WWI draft records, originals held by the
 * National Archives). Adds them to data/media.json; re-runnable. Then run
 * scripts/prepare-media.ps1 and scripts/build.js.
 * Also corrects Ray Simons's WWI registration date from the card itself.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { load, save, note } = require('./lib/records');
const MEDIA = path.resolve(__dirname, '..', 'data', 'media.json');

const NARA = 'National Archives and Records Administration';
const items = [
  {
    id: 'census-1920-baltimore-mckeldin-bell', kind: 'document',
    file: 'ancestry_1920_census_baltimore_mckeldin_bell.jpg',
    title: '1920 census: the McKeldin household at 1143 Carroll Street, Baltimore',
    caption: 'Charles E. McKeldin (32), a sheet metal worker, his wife Emma (27), their children Lola, Lillian, Helen and Charles (2, "Buckey"), and Emma\'s parents William H. Bell (66) and Ella Bell (62), listed as father-in-law and mother-in-law. The household is at the bottom of the sheet.',
    source: `1920 United States Federal Census, Baltimore Ward 21, Maryland, ED 364, sheet 4A (NARA T625, roll 666); image from Ancestry.com. Original: ${NARA}.`,
    people: ['mckeldin_charles_i', 'emma_bell_mckeldin', 'mckeldin_lola', 'mckeldin_lillian_buckey', 'mckeldin_helen_buckey', 'charles_buckey_mckeldin', 'bell_william_h', 'bell_elmira'],
  },
  {
    id: 'census-1900-baltimore-bell', kind: 'document',
    file: 'ancestry_1900_census_baltimore_bell.jpg',
    title: '1900 census: the Bell household at 1118 Cleveland Street, Baltimore',
    caption: 'William Bell (46) and Elmira Bell (42) with their children, among them Emma, 8, born August 1891, and William\'s mother-in-law Margaret Clayhardy (73).',
    source: `1900 United States Federal Census, Baltimore Ward 22, Maryland, ED 283, sheet 7 (NARA T623, roll 618); image from Ancestry.com. Original: ${NARA}.`,
    people: ['bell_william_h', 'bell_elmira', 'emma_bell_mckeldin'],
  },
  {
    id: 'census-1900-baltimore-schriefer', kind: 'document',
    file: 'ancestry_1900_census_baltimore_schriefer.jpg',
    title: '1900 census: the Schriefer household at 2531 E. Oliver Street, Baltimore',
    caption: 'Bartholomew Schriefer (60) and Margaret (35), both born in Germany, with Jennie, Annie, Maggie and George, 11 months, born June 1899. Indexed as "Schrofer".',
    source: `1900 United States Federal Census, Baltimore Ward 9, Maryland, ED 122, sheet 2 (NARA T623, roll 611); image from Ancestry.com. Original: ${NARA}.`,
    people: ['schriefer_bartholomew', 'denzlein_margaret', 'schriefer_george_goode'],
  },
  {
    id: 'census-1910-harford-quinn', kind: 'document',
    file: 'ancestry_1910_census_harford_quinn.jpg',
    title: '1910 census: the Quinn household, District 3, Harford County, Maryland',
    caption: 'Barnie (Bernard) Quin (58) and Emily M. (39), both born in Ireland, with Agnes E. (14), John J. (12), Ethel E. (9) and Margaret A. (4).',
    source: `1910 United States Federal Census, District 3, Harford County, Maryland, ED 102, sheet 17B (NARA T624, roll 565); image from Ancestry.com. Original: ${NARA}.`,
    people: ['quinn_bernard', 'lynn_emily_mariam', 'quinn_agnes_emily', 'quinn_john_joseph', 'ethel_quinn_schriefer', 'quinn_margaret_agatha'],
  },
  {
    id: 'census-1910-delta-simons-mcphail', kind: 'album',
    title: '1910 census: the Simons and McPhail households, Delta, Whatcom County, Washington',
    caption: 'Sheet 4A: John B. McPhail (60) and Ellen R. (59) two households above Aron Simons (58), Hattie (57) and Raymond (12), on Road 18. Sheet 4B, line 51: the Simons household continues with their grandson Zell Busey (4), born in Washington, his father born in Iowa and his mother in Michigan.',
    source: `1910 United States Federal Census, Delta, Whatcom County, Washington, ED 342, sheets 4A–4B (NARA T624, roll 1674); images from Ancestry.com. Original: ${NARA}.`,
    people: ['simons_aaron', 'simons_harriet_hattie', 'simons_raymond_zell', 'busey_zell', 'mcphail_john_belle', 'ball_ellen_rogers'],
    pages: ['ancestry_1910_census_delta_simons_mcphail_p1.jpg', 'ancestry_1910_census_delta_simons_p2.jpg'],
  },
  {
    id: 'draft-ww1-raymond-zell-simons', kind: 'document',
    file: 'ancestry_ww1_draft_raymond_zell_simons.jpg',
    title: 'WWI draft registration card of Raymond Zell Simons, 26 August 1918',
    caption: 'Born 14 June 1897 at South Haven, Michigan; living at Blaine, Whatcom County; employed by Will Steen at Milton, Oregon; nearest relative his mother, Mrs. Hattie Simons, RFD 2, Blaine. Father\'s birthplace Indiana. Tall, medium build, blue eyes, dark brown hair. Registered by Ernest O. Draper.',
    source: `U.S., World War I Selective Service System Draft Registration Cards, 1917–1918, Whatcom County, Washington (NARA M1509); image from Ancestry.com. Original: ${NARA}.`,
    people: ['simons_raymond_zell', 'simons_harriet_hattie'],
  },
];

const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');

// the card's own registration date
const rz = load('simons_raymond_zell');
const OLD = 'Military: Raymond Zell Simons registered for the WWI draft on 11 Sep 1918 at Blaine, giving birth 14 June 1897 at South Haven, Michigan and father\'s birthplace Indiana.';
const NEW = 'Military: Raymond Zell Simons registered for the WWI draft on 26 Aug 1918 at Blaine, Whatcom County, giving birth 14 June 1897 at South Haven, Michigan and father\'s birthplace Indiana.';
rz.milestones = rz.milestones.map(t => (t === OLD ? NEW : t));
note(rz, 'CORRECTION: his WWI draft card is dated 26 Aug 1918 (the registration of men who had turned 21 since June 1918; Ray turned 21 on 14 Jun 1918), not 11 Sep 1918.');
save(rz);
const zb = load('busey_zell');
note(zb, 'The 1910 census gives his birthplace as Washington, his father\'s as Iowa and his mother\'s as Michigan, which fits Lola Simons, born in Michigan.');
save(zb);
const mb = load('busey_matt');
note(mb, 'Born in Iowa, per his son Zell\'s 1910 census entry.');
save(mb);
console.log('Ancestry record images added to media.json');
