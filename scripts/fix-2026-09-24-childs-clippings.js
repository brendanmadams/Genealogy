#!/usr/bin/env node
/**
 * 2026-09-24, facts from two Salem, Oregon, newspaper notices about Edith
 * (Adams) and Thomas W. Childs, and their niche marker at Willamette
 * National Cemetery, all shared in the Turner / Harvey Family Tree on
 * Ancestry.com. Re-runnable. The images themselves are not published.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }

const WED = '"Childs Marriage To Take Place Monday", Statesman Journal, Salem, Oregon, 9 Sep 1933, p. 5';
const ARR = '"Arrive From Eastern Seaboard", Daily Capital Journal, Salem, Oregon, 23 Jun 1936, p. 5';
const STONE = 'Niche marker, Willamette National Cemetery ("Childs, Thomas W, Capt USA, WWII, 1908–1998; Edith Adams, 1912–2000"), photograph in the Turner / Harvey Family Tree on Ancestry.com';

edit('adams_edith_v', [WED, ARR, STONE], p => {
  p.notes = p.notes.map(t => t.startsWith('She married Thomas White Childs on Monday, 11 Sep 1933') ? 'She married Thomas White Childs on Monday, 11 Sep 1933, at St. Paul\'s Episcopal Church, Burlingame. The Salem Statesman Journal (9 Sep 1933) called her "Miss Edith Adams, daughter of Mr. and Mrs. A. T. Wells of Burlingame, Calif., and niece of Mr. and Mrs. E. Hanzlick of Portland", well known in Portland; the couple left at once for Philadelphia.' : t);
  note(p, 'She and Thomas returned from Philadelphia to Portland in June 1936 (Daily Capital Journal, 23 Jun 1936). Their niche marker at Willamette National Cemetery reads "Edith Adams, 1912–2000".');
});
edit('childs_thomas', [WED, ARR, STONE], p => {
  for (const c of ['Graduated from Salem High School and Oregon State College; worked for the federal forest pathology office in Portland (1933).', 'Graduate work in botany at the University of Pennsylvania on a scholarship, 1933–1936 (styled Dr. Childs by 1936); then assistant in the Forest Pathology office, Portland.', 'Captain, U.S. Army, World War II.']) add(p.career, c);
  p.career = p.career.filter(t => t !== 'Captain, U.S. Army.');
  add(p.locations, 'Salem, Oregon');
  note(p, 'Son of Mr. and Mrs. C. D. Childs of Salem, Oregon (Statesman Journal, 9 Sep 1933). He left Salem for San Francisco and married Edith Adams at Burlingame on 11 Sep 1933; the couple went straight to Philadelphia, where he did graduate work in botany at the University of Pennsylvania, returning to Portland in June 1936 as assistant in the Forest Pathology office. His niche marker reads "Capt USA, WWII, 1908–1998".');
});
edit('trumbo_serena_marie', WED, p => note(p, 'Lead: her daughter Edith\'s 1933 wedding notice calls Edith a niece of Mr. and Mrs. E. Hanzlick of Portland, so Mrs. Hanzlick may be one of Serena\'s sisters (Lizzie or Gertrude Trumbo) or a Wells relation.'));
console.log('Childs clippings applied');
