#!/usr/bin/env node
/**
 * 2026-09-23, at Brendan Adams's request. Re-runnable.
 * Brings the remaining names into the tree's rule: birth surname first,
 * married surname(s) in parentheses ("Megan Marie Falde (Adams)"); the site
 * shows them obituary style ("Megan Marie (Falde) Adams"). The old form stays
 * as an alias so searches still find it. Women whose birth surname is unknown
 * keep their married name alone.
 */
'use strict';
const { load, save } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const RENAME = {
  barbara_mckeldin_adams: 'Barbara Jeanne McKeldin (Adams)',
  beryl_simons_adams: 'Beryl Eva Simons (Adams)',
  emily_schrieffer_mckeldin: 'Emily Schrieffer (McKeldin)',
  ethel_quinn_schriefer: 'Ethel Quinn (Schriefer)',
  gertrude_adams_remy: 'Gertrude Elaine Adams (Remy)',
  margaret_peggy_mckeldin: 'Margaret “Peggy” Quinn (McKeldin)',
  megan_marie_adams: 'Megan Marie Falde (Adams)',
  quinn_marie_ellinghaus: 'Marie Ellinghaus (Quinn)',
  michelle_ellis_adams: 'Michelle Ellis (Adams)',
  olson_bonnie: 'Bonnie Jelcick (Olson)',
  rae_mae: 'Rae Mae Adams',          // birth surname not known
};
for (const [id, name] of Object.entries(RENAME)) {
  const p = load(id);
  if (p.name === name) continue;
  p.aliases = p.aliases || [];
  if (id !== 'rae_mae') add(p.aliases, p.name);
  p.name = name;
  save(p);
  console.log(id, '->', name);
}
// hand-set card names, in the same obituary style
const CARD = { allen_margaret_jeanice: ['Peggy', '(Allen) Seavy'], margaret_peggy_mckeldin: ['Peggy', '(Quinn) McKeldin'] };
for (const [id, card] of Object.entries(CARD)) {
  const p = load(id);
  if (JSON.stringify(p.card_name) !== JSON.stringify(card)) { p.card_name = card; save(p); console.log(id, 'card ->', card.join(' / ')); }
}
