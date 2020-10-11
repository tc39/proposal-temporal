/**
 * Returns the number of seconds' difference between the UTC offsets of two
 * time zones, at an exact time
 *
 * @param {Temporal.ZonedDateTime} source - Am exact time in the source time zone
 * @param {Temporal.TimeZone} targetTimeZone - A second time zone to examine
 * @returns {number} The number of seconds difference between the time zones'
 *   UTC offsets at that moment.
 */
function getUtcOffsetDifferenceSecondsAtInstant(source, targetTimeZone) {
  const target = source.with({ timeZone: targetTimeZone });
  return (target.offsetNanoseconds - source.offsetNanoseconds) / 1e9;
}

const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');
const zdtNyc = instant.toLocalDateTime(nyc, 'iso8601');
const chicago = Temporal.TimeZone.from('America/Chicago');

// At this instant, Chicago's local time is 3600 seconds earlier than New York
assert.equal(getUtcOffsetDifferenceSecondsAtInstant(zdtNyc, chicago), -3600);
