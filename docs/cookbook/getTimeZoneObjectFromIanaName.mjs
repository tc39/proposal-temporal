import assert from 'assert';

/**
 *
 * @param ianaTimeZoneName {string} TimeZone String
 * @returns {Temporal.Timezone}
 * @example getTimeZoneObjectFromIanaName("Europe/London")
 */
function getTimeZoneObjectFromIanaName(ianaTimeZoneName) {
  return new Temporal.TimeZone(ianaTimeZoneName);
}

const tz = getTimeZoneObjectFromIanaName('Europe/London');
// Need to cast the timezone back to an IANA string
assert.equal(tz.toString(), 'Europe/London');

// TimeZone Methods

// Need to get an offset for an Absolute point in time (DST)
const tzOffset = tz.getOffsetFor(Temporal.Absolute.from('2020-08-06T15:00Z'));
assert.equal(tzOffset, '+01:00');

// Same as above but during but non-DST
const tzOffset2 = tz.getOffsetFor(Temporal.Absolute.from('2020-11-06T01:00Z'));
assert.equal(tzOffset2, '+00:00');

// Get a dateTime object using the timezone as an offset
const dateTimeOffset = tz.getDateTimeFor(Temporal.Absolute.from('2020-08-06T15:00Z'));
assert.equal(dateTimeOffset.toString(), '2020-08-06T16:00');
