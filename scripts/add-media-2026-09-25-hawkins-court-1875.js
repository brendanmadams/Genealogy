#!/usr/bin/env node
/**
 * 2026-09-25, the Hawkins County Court minutes of 6 Sep 1875 (pp. 248–251)
 * naming David Ball among the heirs of William Ball Sr.: two page images from
 * FamilySearch (public county records), published at Brendan Adams's request.
 * Adds items to data/media.json; re-runnable. Then run
 * scripts/prepare-media.ps1 and scripts/build.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const MEDIA = path.resolve(__dirname, '..', 'data', 'media.json');

const SRC = 'Hawkins County, Tennessee, County Court Minutes, April 1874–December 1877 (FamilySearch film 008658851, images 462–463; arks 3:1:3QHV-63CD-V8LW and 3:1:3QHV-63CD-VZH7). A public county record.';
const PEOPLE = ['ball_david', 'ball_william_1784', 'ball_harden', 'ball_edward_tate', 'ball_mary_barnard', 'ball_sarah_barnard', 'ball_nancy_bailey', 'ball_sabilla_bradley', 'ball_moses_1820', 'ball_lewis_b', 'ball_clinton_c', 'ball_milton_edward', 'ball_george_w_1827', 'ball_william_jr'];
const items = [
  {
    id: 'court-1875-hawkins-ball-heirs', kind: 'album',
    title: 'Heirs of William Ball Sr.: Hawkins County Court minutes, 6 September 1875',
    caption: 'Pages 248–251 of the County Court minute book. Page 1: the heirs\' agreement of 23 Aug 1875 settling Hardin Ball\'s administration of his father\'s estate, signed by Moses, M. E., Hardin, Nancy Bailey, Zadock and Mary Barnard, G. W. F. and C. C. Ball, Sarah Barnard, John K. and Sibby Bradley, and "David Ball by S. H. Ball, Agent". Page 2: the court\'s decree naming the heirs at law of Wm Ball Sr., deceased, including David Ball, and ordering the Buck Creek land partitioned.',
    source: SRC,
    people: PEOPLE,
    pages: ['fs_hawkins_court_1875_p248.jpg', 'fs_hawkins_court_1875_p250.jpg'],
  },
];
const cfg = JSON.parse(fs.readFileSync(MEDIA, 'utf8'));
for (const it of items) {
  const i = cfg.items.findIndex(x => x.id === it.id);
  if (i >= 0) cfg.items[i] = it; else cfg.items.push(it);
}
fs.writeFileSync(MEDIA, JSON.stringify(cfg, null, 2) + '\n');
console.log('Hawkins court minutes added');
