#!/usr/bin/env node
/**
 * Card-name overrides for people whose everyday name is embedded in their
 * record name as a middle word, which no rule can reliably tell from a real
 * middle name (Brendan Adams, 2026-09-23). The full name is unchanged.
 * Set `card_name: [given, surname]` on any record to override its tree card.
 * Re-runnable.
 */
'use strict';
const { load, save } = require('./lib/records');
const CARDS = {
  allen_margaret_jeanice: ['Peggy', 'Allen (Seavy)'],
  margaret_peggy_mckeldin: ['Peggy', 'McKeldin'],
  charles_buckey_mckeldin: ['Charles “Buckey”', 'McKeldin'],
  simons_harriet_hattie: ['Harriet “Hattie”', 'Simons'],
  mckeldin_william: ['William “Podge”', 'McKeldin'],
  adams_joseph_pierre_jose2: ['Jose P.', 'Adams (II)'],
};
for (const [id, card] of Object.entries(CARDS)) { const p = load(id); p.card_name = card; save(p); }
console.log(`card names set on ${Object.keys(CARDS).length} records`);
