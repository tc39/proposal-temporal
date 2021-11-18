// To convert Instant to legacy Date, use the epochMilliseconds property.

const instant = Temporal.Instant.from('2020-01-01T00:00:01.000999Z');
const result = new Date(instant.epochMilliseconds);

assert.equal(result.getTime(), 1577836801000); // ms since Unix epoch
assert.equal(result.toISOString(), '2020-01-01T00:00:01.000Z');

// Same thing for ZonedDateTime.
// Note that legacy Date will not preserve the ZonedDateTime's time zone.

const zoned = Temporal.ZonedDateTime.from('2020-01-01T00:00:01.001[Asia/Tokyo]');
const result2 = new Date(zoned.epochMilliseconds);

assert.equal(result2.getTime(), 1577804401001); // note, different time
assert.equal(result2.toISOString(), '2019-12-31T15:00:01.001Z');

// For most use cases, new Date(x.epochMilliseconds) is fine.
// You may need to add an extra round() step if you want other
// rounding behaviour than truncation. For example, here the 999
// microseconds is rounded to 1 millisecond.

const result3 = new Date(instant.round({ smallestUnit: 'millisecond' }).epochMilliseconds);

assert.equal(result3.getTime(), 1577836801001);
assert.equal(result3.toISOString(), '2020-01-01T00:00:01.001Z');
