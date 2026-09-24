#!/usr/bin/env node
/**
 * 2026-09-24, places copied from Barbara McKeldin Adams's memoir chapters onto
 * people the chapters only mention. Each chapter's place list was attached to
 * everyone in it; these are the places the chapters (and John's own memoir)
 * do not tie to the person. Re-runnable.
 *  - Ethel (Quinn) Schriefer, ch. 2: the Lincoln trips were with Barbara's
 *    father, and Barbara and Chuck moved to Nicklas Avenue after Ethel died.
 *  - John Howard Adams: ch. 2's "John" is John Joseph Quinn; the rest are
 *    Barbara's work travel (Canada, Guam), the boys' colleges and gifts, a
 *    lunch from Henry's to her school, and a Sunday stop in Tucson. Kept: the
 *    places the two shared, and Albuquerque, Europe, Mt. Hood and Philadelphia,
 *    which his own memoir names.
 *  - Chuck McKeldin: kept Baltimore and Williamsburg, where the chapters put him.
 *  - J. Michael McKeldin: ch. 3 says he stayed home during those outings.
 *  - Barbara: places she imagines (ch. 46, 47, 51), not places she has been.
 */
'use strict';
const { load, save } = require('./lib/records');
const REMOVE = {
  ethel_quinn_schriefer: ['Nicklas Avenue', 'Washington D.C.', 'Gettysburg PA', 'Ocean City MD', 'University of Virginia Charlottesville'],
  john_howard_adams: ['Nicklas Avenue', 'Washington D.C.', 'Gettysburg PA', 'Ocean City MD', 'University of Virginia Charlottesville',
    'Henry’s', 'Edmonton', 'Calgary', 'Canada', 'Guam', 'Czechoslovakia', 'Seattle Pacific University', 'UW', 'University of Washington', 'Portland State', 'Tucson AZ'],
  chuck_mckeldin: ['Ocean City MD', 'Ocean City', 'Chesapeake Bay', 'Memorial Stadium', 'Baltimore Zoo', 'Herring Run Park', 'Annapolis', 'Fort McHenry'],
  j_michael_mckeldin: ['Ocean City', 'Chesapeake Bay', 'Memorial Stadium', 'Baltimore Zoo'],
  barbara_mckeldin_adams: ['heaven', 'hell', 'purgatory', 'Bethlehem', 'Cana', 'Gethsemane', 'London'],
};
for (const [id, drop] of Object.entries(REMOVE)) {
  const p = load(id);
  const before = (p.locations || []).length;
  p.locations = (p.locations || []).filter(l => !drop.includes(l));
  save(p);
  console.log(`${id}: ${before - p.locations.length} removed`);
}
