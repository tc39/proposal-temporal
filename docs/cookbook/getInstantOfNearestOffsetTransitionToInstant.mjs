/**
 * Get the nearest following exact time that the given time zone transitions
 * to another UTC offset, inclusive or exclusive.
 *
 * @param {Temporal.Instant} instant - Starting exact time to consider
 * @param {Temporal.TimeZone} timeZone - Time zone to consider
 * @param {boolean} inclusive - Include the start time, or not
 * @returns {(Temporal.Instant|null)} - Next UTC offset transition, or null if
 *   none known at this time
 */
function getInstantOfNearestOffsetTransitionToInstant(instant, timeZone, inclusive) {
  let nearest;
  if (inclusive) {
    // In case instant itself is the exact time of a transition:
    nearest = timeZone.getNextTransition(instant.subtract({ nanoseconds: 1 }));
  } else {
    nearest = timeZone.getNextTransition(instant);
  }
  return nearest;
}

const instant = Temporal.Instant.from('2019-04-16T21:01Z');

const nyc = Temporal.TimeZone.from('America/New_York');
const nextTransition = getInstantOfNearestOffsetTransitionToInstant(instant, nyc, false);
assert.equal(nextTransition.toString(), '2019-11-03T06:00:00Z');

// Inclusive
const sameTransition = getInstantOfNearestOffsetTransitionToInstant(nextTransition, nyc, true);
assert.equal(sameTransition.toString(), nextTransition.toString());

// No known future DST transitions in a time zone
const regina = Temporal.TimeZone.from('America/Regina');
assert.equal(getInstantOfNearestOffsetTransitionToInstant(instant, regina), null);
