/**
 * Converts a Temporal.PlainDateTime instance into a Date.
 * This is the inverse of dateTimeFrom legacy Date example
 *
 * @param {Temporal.PlainDateTime} dateTime - This is a DateTime instance
 * @returns {Date} legacy Date instance
 */
function getLegacyDateInUTCFromDateTime(dateTime) {
  dateTime = dateTime.round({ smallestUnit: 'millisecond' });
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

const dateTime = Temporal.PlainDateTime.from('2020-01-01T00:00:01.000999Z');
const result = getLegacyDateInUTCFromDateTime(dateTime);
assert.equal(result.getUTCDate(), 1); // Day of the month
assert.equal(result.getUTCFullYear(), 2020);
assert.equal(result.getUTCMonth(), 0); // the month (zero-indexed)
assert.equal(result.toISOString(), '2020-01-01T00:00:01.001Z');
