#!/usr/bin/env node
/**
 * Lola, a sister of Charles "Buckey" McKeldin, takes her birth surname
 * (Brendan Adams, 2026-09-22). A married surname, if any, is not recorded.
 * Re-runnable.
 */
'use strict';
const { load, save, note, rename } = require('./lib/records');
rename('lola', 'mckeldin_lola');
const p = load('mckeldin_lola');
p.name = 'Lola McKeldin';
p.aliases = [...new Set([...(p.aliases || []), 'Lola'])];
note(p, 'Recorded under her birth surname McKeldin (daughter of Charles E. McKeldin I and Emma Bell McKeldin). She likely took a husband\'s surname, which is not recorded.');
save(p);
console.log('Lola McKeldin written');
