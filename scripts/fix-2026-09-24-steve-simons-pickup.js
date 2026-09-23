#!/usr/bin/env node
/**
 * 2026-09-24, at Brendan Adams's request. Re-runnable.
 * Ray Simons's record said "Ray's cousin Steve" drove the pickup for the zoo.
 * In John Howard Adams's memoir "my cousin" is John's cousin: Steve Simons,
 * Ray's grandson (son of Howard and Nancy Simons).
 */
'use strict';
const { load, save } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const MEM = 'John Howard Adams, "John Howard Adams - A Memoir" (privately printed)';
const CITE = ' [John Howard Adams, A Memoir, text lines 190–193, 616–619]';
const OLD = 'Ray’s cousin Steve drove a pickup truck to Pasco at age 9-10 to collect discarded grocery food for the zoo animals.';
const OLD2 = "Ray's cousin Steve drove a pickup truck to Pasco at age 9-10 to collect discarded grocery food for the zoo animals.";
const RAY = 'His grandson Steve Simons, aged about 8 to 10, drove Ray’s pickup into Pasco with his cousin John Adams to collect discarded grocery-store food for the zoo animals, with blocks on the pedals and looking under the steering wheel.' + CITE;
const STEVE = 'As a boy of about 8 to 10, already used to driving farm equipment, he drove his grandfather Ray Simons’s pickup into Pasco with his cousin John Adams to collect discarded grocery-store food for the Chetzamoka Park Zoo animals, with blocks on the pedals and looking under the steering wheel. They were never stopped.' + CITE;

const ray = load('simons_raymond_zell');
for (const k of ['notable_stories', 'notes', 'milestones', 'childhood_experience']) if (Array.isArray(ray[k])) ray[k] = ray[k].map(t => (t === OLD || t === OLD2) ? RAY : t);
if (![...(ray.notable_stories || []), ...(ray.notes || [])].includes(RAY)) { ray.notable_stories = ray.notable_stories || []; add(ray.notable_stories, RAY); }
save(ray);

const steve = load('simons_steve');
steve.notable_stories = steve.notable_stories || [];
add(steve.notable_stories, STEVE);
steve.sources = steve.sources || []; add(steve.sources, MEM);
save(steve);
console.log('Steve Simons pickup story corrected');
