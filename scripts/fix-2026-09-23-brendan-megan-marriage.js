#!/usr/bin/env node
// 2026-09-23, from Brendan Adams: he and Megan Marie Falde married on
// 14 August 1999 at St. Michael and All Angels Church, Albuquerque, NM.
'use strict';
const { load, save } = require('./lib/records');
const WHEN = '14 Aug 1999, St. Michael and All Angels Church, Albuquerque, NM';
for (const [id, other] of [['brendan_mckeldin_adams', 'Megan Marie Falde'], ['megan_marie_adams', 'Brendan McKeldin Adams']]) {
  const p = load(id);
  const text = `Married ${other} (m. ${WHEN})`;
  const i = p.milestones.findIndex(m => typeof m === 'string' && /^married\b/i.test(m) && /megan|brendan/i.test(m));
  if (i >= 0) p.milestones[i] = text; else if (!p.milestones.includes(text)) p.milestones.push(text);
  if (!p.locations.includes('Albuquerque, NM')) p.locations.push('Albuquerque, NM');
  const src = 'Brendan Adams (personal knowledge), 2026';
  p.sources = p.sources || []; if (!p.sources.includes(src)) p.sources.push(src);
  save(p);
}
console.log('marriage recorded');
