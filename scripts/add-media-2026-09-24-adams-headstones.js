#!/usr/bin/env node
/**
 * 2026-09-24, headstone photographs of George Francis Adams (#2) at Valley
 * View Cemetery, Sutherlin, and of Thomas W. and Edith (Adams) Childs at
 * Willamette National Cemetery, shared on Ancestry.com and published with
 * the photographers' agreement (arranged by Brendan Adams). Adds items to
 * data/media.json; re-runnable. Then run scripts/prepare-media.ps1 and
 * scripts/build.js.
 * Also the 1933 and 1936 Salem newspaper notices about the Childses, hosted
 * at Brendan Adams's request.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { load, save, note } = require('./lib/records');
const MEDIA = path.resolve(__dirname, '..', 'data', 'media.json');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };

const items = [
  {
    id: 'grave-gfa2-valley-view', kind: 'album',
    title: 'Grave of George Francis Adams (#2), Valley View Cemetery, Sutherlin, Oregon',
    caption: 'Photographed 10 Mar 2011. Page 1: his marker, "George F. Adams, 1876–1920". Page 2: the upright ADAMS stone, with an iron veteran\'s marker in front. Page 3: the marker, "U.S.W.V. 1898", the emblem of the United Spanish War Veterans, for his 1898 enlistment.',
    source: 'Photographs shared on Ancestry.com by ry4832020, 21 May 2013 (Find a Grave memorial 83796381); published with the photographer\'s permission.',
    people: ['adams_george_francis_2'],
    pages: ['ancestry_gfa2_stone_3.jpg', 'ancestry_gfa2_stone_2.jpg', 'ancestry_gfa2_stone_1.jpg'],
  },
  {
    id: 'grave-childs-willamette', kind: 'photo',
    file: 'ancestry_childs_stone.jpg',
    title: 'Niche marker of Thomas W. and Edith (Adams) Childs, Willamette National Cemetery',
    caption: '"Childs, Thomas W, Capt USA, WWII, 1908–1998" and "Edith Adams, 1912–2000", in the columbarium at Willamette National Cemetery, Portland, Oregon (Col-2, row 198, site C).',
    source: 'Photograph shared on Ancestry.com by PatSmithPetty, 6 Oct 2018; published with the photographer\'s permission.',
    people: ['childs_thomas', 'adams_edith_v'],
  },
  {
    id: 'clipping-1933-childs-adams-wedding', kind: 'document',
    file: 'ancestry_childs_clip_wed.jpg',
    title: '"Childs Marriage To Take Place Monday", Statesman Journal, Salem, 9 September 1933',
    caption: 'Thomas W. Childs, son of Mr. and Mrs. C. D. Childs of Salem, is to marry Miss Edith Adams, daughter of Mr. and Mrs. A. T. Wells of Burlingame and niece of Mr. and Mrs. E. Hanzlick of Portland, at St. Paul\'s Episcopal Church, Burlingame; the couple will leave for Philadelphia, where he will study botany at the University of Pennsylvania.',
    source: 'Statesman Journal, Salem, Oregon, 9 Sep 1933, p. 5 (Newspapers.com clipping shared on Ancestry.com by PatSmithPetty, 6 Oct 2018).',
    people: ['childs_thomas', 'adams_edith_v', 'wells_arthur', 'trumbo_serena_marie'],
  },
  {
    id: 'clipping-1936-childs-arrive', kind: 'document',
    file: 'ancestry_childs_clip_arrive.jpg',
    title: '"Arrive From Eastern Seaboard", Daily Capital Journal, Salem, 23 June 1936',
    caption: 'Dr. and Mrs. Thomas W. Childs have arrived from Philadelphia, after his three years of graduate work at the University of Pennsylvania, and will live in Portland, where he will be assistant in the Forest Pathology office.',
    source: 'Daily Capital Journal, Salem, Oregon, 23 Jun 1936, p. 5 (Newspapers.com clipping shared on Ancestry.com by PatSmithPetty, 6 Oct 2018).',
    people: ['childs_thomas', 'adams_edith_v'],
  },
];
const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');

const p = load('adams_george_francis_2');
note(p, 'His grave at Valley View Cemetery, Sutherlin, has a flat marker, "George F. Adams, 1876–1920", beside an upright ADAMS stone, and an iron United Spanish War Veterans marker, "U.S.W.V. 1898".');
save(p);
console.log('Headstone photographs added');
