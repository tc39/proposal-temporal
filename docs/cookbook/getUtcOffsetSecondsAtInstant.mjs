/**
 * Returns the number of seconds in the UTC offset of a time zone, at a
 * particular moment in time.
 *
 * @param {Temporal.Absolute} instant - A moment in time
 * @param {Temporal.TimeZone} timeZone - A time zone to examine
 * @returns {number} The number of seconds in the time zone's UTC offset
 */
function getUtcOffsetSecondsAtInstant(instant, timeZone) {
  const utcWallTime = instant.inTimeZone('UTC');
  const localWallTime = instant.inTimeZone(timeZone);
  const difference = utcWallTime.difference(localWallTime, { largestUnit: 'seconds' });
  const sign = Temporal.DateTime.compare(localWallTime, utcWallTime) < 0 ? -1 : 1;
  return (
    sign *
    (difference.seconds +
      difference.milliseconds * 1e-3 +
      difference.microseconds * 1e-6 +
      difference.nanoseconds * 1e-9)
  );
}

import assert from 'assert';

const instant = Temporal.Absolute.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');

assert.equal(getUtcOffsetSecondsAtInstant(instant, nyc), -18000);
