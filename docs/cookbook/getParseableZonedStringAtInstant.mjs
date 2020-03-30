import assert from 'assert';

/**
 * Converts an absolute point in time to a string with the time in the specified
 * time zone and a time zone designation.
 *
 * @param {Temporal.Absolute} absolute An absolute point in time
 * @param {string} ianaTimeZoneName IANA name of a time zone
 * @returns {string} String indicating the time with time zone designation
 */
function getParseableIanaZonedStringAtInstant(absolute, ianaTimeZoneName) {
  const timeZoneObject = Temporal.TimeZone.from(ianaTimeZoneName);
  return getParseableZonedStringAtInstant(absolute, timeZoneObject);
}

/**
 * Converts an absolute point in time to a string with the time in the specified
 * time zone and a time zone designation.
 *
 * @param {Temporal.Absolute} absolute An absolute point in time
 * @param {Temporal.TimeZone} timeZone The target time zone
 * @returns {string} String indicating the time with time zone designation
 */
function getParseableZonedStringAtInstant(absolute, timeZone) {
  const dateTimeInZone = absolute.inTimeZone(timeZone);
  const offset = timeZone.getOffsetFor(absolute);
  // If the time zone has only an offset and not an IANA name, then the .name
  // property will be identical to the offset. In that case, don't append it
  // in square brackets.
  const name = timeZone.name === offset ? '' : `[${timeZone.name}]`;
  return `${dateTimeInZone}${offset}${name}`;
}

const absoluteTime = Temporal.Absolute.from('2020-01-03T10:41:51Z');
const result = getParseableIanaZonedStringAtInstant(absoluteTime, 'Europe/Paris');
assert.equal(result, '2020-01-03T11:41:51+01:00[Europe/Paris]');
assert.equal(Temporal.Absolute.compare(absoluteTime, Temporal.Absolute.from(result)), 0);

const offsetTimeZone = Temporal.TimeZone.from('-07:00');
const result2 = getParseableZonedStringAtInstant(absoluteTime, offsetTimeZone);
assert.equal(result2, '2020-01-03T03:41:51-07:00');
assert.equal(Temporal.Absolute.compare(absoluteTime, Temporal.Absolute.from(result2)), 0);
