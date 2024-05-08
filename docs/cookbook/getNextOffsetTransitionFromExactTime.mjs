/**
 * Get the nearest following exact time that the given time zone transitions
 * to another UTC offset, inclusive or exclusive.
 *
 * @param {Temporal.ZonedDateTime} zonedDateTime - Starting exact time and time
 *   zone to consider
 * @param {boolean} inclusive - Include the start time, or not
 * @returns {(Temporal.ZonedDateTime|null)} - Next UTC offset transition, or
 *   null if none known at this time
 */
function getNextOffsetTransitionFromExactTime(zonedDateTime, inclusive) {
  let nearest;
  if (inclusive) {
    // In case instant itself is the exact time of a transition:
    nearest = zonedDateTime.subtract({ nanoseconds: 1 }).getTimeZoneTransition('next');
  } else {
    nearest = zonedDateTime.getTimeZoneTransition('next');
  }
  return nearest;
}

const nycTime = Temporal.ZonedDateTime.from('2019-04-16T21:01Z[America/New_York]');

const nextTransition = getNextOffsetTransitionFromExactTime(nycTime, false);
assert.equal(nextTransition.toString(), '2019-11-03T01:00:00-05:00[America/New_York]');

// Inclusive
const sameTransition = getNextOffsetTransitionFromExactTime(nextTransition, true);
assert.equal(sameTransition.toString(), nextTransition.toString());

// No known future DST transitions in a time zone
const reginaTime = Temporal.ZonedDateTime.from('2019-04-16T21:01Z[America/Regina]');
assert.equal(getNextOffsetTransitionFromExactTime(reginaTime), null);
