/**
 * Converts a Date instance into a Temporal.PlainDateTime instance
 * DateTime accepts an ISO String in its from() method, so if you need to convert a date to a datetime
 * you're best off passing the result of that
 *
 * @param {Date} legacyDate - This is a Date instance
 * @returns {Temporal.PlainDateTime} Temporal.PlainDateTime instance
 */
function getDateTimeFromLegacyDate(legacyDate) {
  return Temporal.PlainDateTime.from(legacyDate.toISOString());
}

const date = new Date('1970-01-01T00:00:01Z');
const result = getDateTimeFromLegacyDate(date);
assert.equal(result.day, 1);
assert.equal(result.month, 1);
assert.equal(result.year, 1970);
assert.equal(result.toString(), '1970-01-01T00:00:01');
