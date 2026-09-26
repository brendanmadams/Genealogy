#!/usr/bin/env node
/**
 * 2026-09-26, the Pasco streets Ray Simons named for his family, checked on the
 * current map (OpenStreetMap): Dradie Street, Dradie Place and Glen Acres are
 * there; no street named for Beryl is. Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const OSM = 'OpenStreetMap, Pasco, Franklin County, Washington (West Dradie Street and Dradie Place, about 46.254 N 119.159 W; Ter-Ray Court; Glen Acres subdivision, about 46.238 N 119.182 W), checked 26 Sep 2026';

const ray = load('simons_raymond_zell');
note(ray, 'On the present map of west Pasco, north of the Columbia and the Interstate 182 bridge, West Dradie Street and Dradie Place still carry his wife\'s name, a Ter-Ray Court sits among them, and Glen Acres, the subdivision named for his youngest son, lies a mile to the south-west; no street named for Beryl was found (OpenStreetMap, 2026).');
add(ray.sources, OSM);
save(ray);

const b = load('beryl_simons_adams');
note(b, 'No street named Beryl appears on the present map of Pasco or the Tri-Cities, though her mother\'s name survives in West Dradie Street and Dradie Place and her brother\'s in Glen Acres; the street John remembers may have been renamed or absorbed when the land was redeveloped (OpenStreetMap, 2026).');
add(b.sources, OSM);
save(b);
console.log('Pasco streets applied');
