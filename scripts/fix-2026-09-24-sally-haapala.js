#!/usr/bin/env node
/**
 * 2026-09-24, from Brendan Adams. Re-runnable. Sally Adams (Presley's
 * daughter) married a Haapala, possibly named John, who has died.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const BA = 'Brendan Adams (personal knowledge), 2026';
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name) => ({ id, name, sex: 'M', birth: '', death: 'deceased', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [BA], notes: [], aliases: [] });

const s = load('adams_sally');
if (s.name === 'Sally Adams') { s.name = 'Sally Adams (Haapala)'; }
s.aliases = s.aliases || []; add(s.aliases, 'Sally Haapala');
s.relationships.spouse = 'haapala_john';
s.milestones = s.milestones || []; add(s.milestones, 'Married John(?) Haapala');
s.sources = s.sources || []; add(s.sources, BA);
save(s);

if (!exists('haapala_john')) save(blank('haapala_john', 'John Haapala'));
const h = load('haapala_john');
h.relationships.spouse = 'adams_sally';
add(h.milestones, 'Married Sally Adams');
note(h, 'Husband of Sally Adams, daughter of Presley and Fran Adams; deceased. His first name may be John (Brendan Adams is not certain).');
save(h);
console.log('Sally Adams (Haapala) and her husband added');
