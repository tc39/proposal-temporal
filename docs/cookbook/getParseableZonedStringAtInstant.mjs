const instant = Temporal.Instant.from('2020-01-03T10:41:51Z');

const result = instant.toString();

assert.equal(result, '2020-01-03T10:41:51Z');
assert(instant.equals(Temporal.Instant.from(result)));

// Include the UTC offset of a particular time zone:

const result2 = instant.toString({ timeZone: 'America/Yellowknife' });

assert.equal(result2, '2020-01-03T03:41:51-07:00');
assert(instant.equals(Temporal.Instant.from(result2)));

// Include the UTC offset as well as preserving the time zone name:

const zoned = instant.toZonedDateTimeISO('Asia/Seoul');
const result3 = zoned.toString();

assert.equal(result3, '2020-01-03T19:41:51+09:00[Asia/Seoul]');
assert(instant.equals(Temporal.Instant.from(result3)));
assert(zoned.equals(Temporal.ZonedDateTime.from(result3)));
