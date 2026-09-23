#!/usr/bin/env node
/**
 * Cite the Maryland Manual for the eleven children of James Alfred McKeldin
 * and Dorothea Grief (Brendan Adams, 2026-09-22). Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const SRC = 'Maryland Manual, 1951-52, vol. 164, p. 2 (Maryland State Archives): https://msa.maryland.gov/megafile/msa/speccol/sc2900/sc2908/000001/000164/html/am164--2.html';
const QUOTE = 'Maryland Manual, 1951-52 (official state register, published while Theodore R. McKeldin was governor): Theodore "was born November 20, 1900, in Baltimore City, one of the eleven children of the late James A. and Dora (Greif) McKeldin." The same biography appears in the 1953-54 and 1955-56 editions.';
for (const id of ['mckeldin_james_alfred', 'grief_dorothea', 'mckeldin_theodore_roosevelt']) {
  const p = load(id);
  p.sources = p.sources || [];
  if (!p.sources.includes(SRC)) p.sources.push(SRC);
  note(p, QUOTE);
  save(p);
}
console.log('Maryland Manual cited on 3 records');
