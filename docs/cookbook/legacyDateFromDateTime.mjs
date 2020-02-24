import assert from 'assert';

/**
 * Converts a Temporal.DateTime instance into a Date.
 * This is the inverse of dateTimeFrom legacy Date example
 *
 * @param {Temporal.DateTime} dateTime This is a DateTime instance
 * @returns {Date} legacy Date instance
 */
function getLegacyDateInUTCFromDateTime(dateTime) {
  return new Date(
    Date.UTC(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
      dateTime.millisecond
    )
  );
}

const dateTime = Temporal.DateTime.from('2020-01-01T00:00:01Z');
const result = getLegacyDateInUTCFromDateTime(dateTime);
assert.equal(result.getDate(), 1); // Day of the month
assert.equal(result.getFullYear(), 2020);
assert.equal(result.getMonth(), 0); // the month (zero-indexed)
assert.equal(result.toISOString(), '2020-01-01T00:00:01.000Z');
