/**
 * Takes a local date and time in one time zone, and serializes it to a string
 * expressing the local date and time in another time zone at the same exact
 * time.
 *
 * @param {Temporal.ZonedDateTime} source - The local date and time
 * @param {Temporal.TimeZone} targetTimeZone - The time zone for the
 *  return value
 * @returns {string} String indicating the time with time zone designation
 */
function getParseableZonedStringWithLocalTimeInOtherZone(source, targetTimeZone) {
  return source.with({ timeZone: targetTimeZone }).toString();
}

const result = getParseableZonedStringWithLocalTimeInOtherZone(
  Temporal.ZonedDateTime.from('2020-01-09T00:00-06:00[America/Chicago]'),
  Temporal.TimeZone.from('America/Los_Angeles')
);
// On this date, when it's midnight in Chicago, it's 10 PM the previous night in LA
assert.equal(result, '2020-01-08T22:00-08:00[America/Los_Angeles]');
