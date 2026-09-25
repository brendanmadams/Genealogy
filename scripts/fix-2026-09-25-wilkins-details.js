#!/usr/bin/env node
/**
 * 2026-09-25, details for Roma (Abernathy) Wilkins's husband and sons from
 * draft cards, Find a Grave and public-records indexes on FamilySearch.
 * Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; p.aliases = p.aliases || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };

const WW1 = 'FamilySearch, United States World War I Draft Registration Cards, 1917-1918 (John Julien Wilkins, born 2 Mar 1900, St. Louis; ark 1:1:W4Y4-7D3Z)';
const WW2 = 'FamilySearch, Missouri World War II Draft Registration Cards, 1940-1945 (John Julien Wilkins, born 2 Mar 1900 Kirkwood, registered 15 Feb 1942 at Overland, ark 1:1:QLX1-BGM4; John Julien Wilkins Jr., born 21 Sep 1923 Kirkwood, registered 30 Jun 1942 at Overland, ark 1:1:QLX1-V992)';
const FAGJ = 'Find a Grave index (John Julien Wilkins, 21 Sep 1923 – 17 Dec 1994, Curlew Hills Memory Gardens, Palm Harbor, Pinellas County, Florida; via FamilySearch ark 1:1:6MLR-XH2M)';
const PUBP = 'FamilySearch, United States Public Records, 1970-2009 (Pierre R. Wilkins, born 14 Oct 1932, New York City 1993, Brooklyn 2001, Staten Island 2005–2009)';
const SSDI = 'FamilySearch, United States Social Security Death Index (Pierre Wilkins, 14 Oct 1932 – 6 Oct 1998, Brooklyn, New York)';

edit('wilkins_john_j', [WW1, WW2], p => {
  p.name = 'John Julien Wilkins Sr.';
  refine(p, 'birth', '2 Mar 1900');
  for (const l of ['Kirkwood, St. Louis County, Missouri', 'Overland, St. Louis County, Missouri']) add(p.locations, l);
  add(p.aliases, 'John J. Wilkins');
  note(p, 'Born 2 Mar 1900 at Kirkwood, Missouri; registered for the draft in St. Louis in 1917–18 and again at Overland on 15 Feb 1942 (draft registration cards).');
});
edit('wilkins_john_julien_jr', [WW2, FAGJ], p => {
  add(p.locations, 'Palm Harbor, Pinellas County, Florida');
  note(p, 'Registered for the draft at Overland, Missouri, on 30 Jun 1942; buried at Curlew Hills Memory Gardens, Palm Harbor, Florida (draft registration card; Find a Grave).');
});
edit('wilkins_pierre_robert', [PUBP, SSDI], p => {
  for (const l of ['Brooklyn, New York', 'Staten Island, New York']) add(p.locations, l);
  add(p.aliases, 'Pierre R. Wilkins');
  note(p, 'Lived in New York City from at least 1993, at Brooklyn in 2001 and Staten Island 2005–2009 (public-records index); died 6 Oct 1998 at Brooklyn (Social Security death index; the later public-record entries are stale listings).');
});
console.log('Wilkins details applied');
