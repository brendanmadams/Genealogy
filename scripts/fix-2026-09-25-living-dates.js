#!/usr/bin/env node
/**
 * 2026-09-25, birth dates and places for living members of Ed Simons's
 * family, from his Ancestry tree (tree 189265374). Brendan withdrew the
 * earlier rule that living people get names and relationships only.
 * Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const WAM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Glen E. Simons and Mary Patricia Walker, 1958)';
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; p.locations = p.locations || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };

const ROWS = [
  ['simons_ed', '30 Apr 1960', 'Kennewick, Benton County, Washington'],
  ['simons_ann', '5 Feb 1964', 'Kennewick, Benton County, Washington'],
  ['simons_kim', '11 Dec 1959', 'Seattle, King County, Washington'],
  ['henley_kayla', '1 Dec 1984', 'Tacoma, Pierce County, Washington'],
  ['simons_john', '16 Jun 1987', 'Tacoma, Pierce County, Washington'],
];
for (const [id, b, place] of ROWS) edit(id, ED, p => { refine(p, 'birth', b); add(p.locations, place); note(p, `Born ${b} at ${place.split(',')[0]} (Ed Simons's tree).`); });

edit('simons_mary', [ED, WAM], p => {
  refine(p, 'birth', '27 Feb 1939');
  for (const l of ['Portland, Oregon', 'Brentwood, Multnomah County, Oregon', 'Richland, Washington', 'Kennewick, Washington']) add(p.locations, l);
  note(p, "Born 27 Feb 1939 at Portland, Oregon (Ed Simons's tree); she was 19 at her marriage in July 1958 (Washington marriage records), a year old in the 1940 census at Brentwood, and 11 in the 1950 census at Richland.");
});
console.log('Living dates applied');
