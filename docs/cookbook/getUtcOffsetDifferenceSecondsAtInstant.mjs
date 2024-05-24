/**
 * Returns the number of seconds' difference between the UTC offsets of two
 * time zones, at an exact time
 *
 * @param {Temporal.Instant} instant - An exact time
 * @param {string} sourceTimeZone - IANA ID of a time zone to examine
 * @param {string} targetTimeZone - IANA ID of a second time zone to examine
 * @returns {number} The number of seconds difference between the time zones'
 *   UTC offsets
 */
function getUtcOffsetDifferenceSecondsAtInstant(instant, sourceTimeZone, targetTimeZone) {
  const sourceOffsetNs = instant.toZonedDateTimeISO(sourceTimeZone).offsetNanoseconds;
  const targetOffsetNs = instant.toZonedDateTimeISO(targetTimeZone).offsetNanoseconds;
  return (targetOffsetNs - sourceOffsetNs) / 1e9;
}

const instant = Temporal.Instant.from('2020-01-09T00:00Z');

// At this exact time, Chicago is 3600 seconds earlier than New York
assert.equal(getUtcOffsetDifferenceSecondsAtInstant(instant, 'America/New_York', 'America/Chicago'), -3600);
