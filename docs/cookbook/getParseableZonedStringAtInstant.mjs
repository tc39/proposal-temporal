const instant = Temporal.Instant.from('2020-01-03T10:41:51Z');

const result = instant.toString('Europe/Paris');

assert.equal(result, '2020-01-03T11:41:51+01:00[Europe/Paris]');
assert(instant.equals(Temporal.Instant.from(result)));

const zdt = instant.toZonedDateTime('Europe/Paris', 'iso8601');
assert.equal(zdt.toString(), '2020-01-03T11:41:51+01:00[Europe/Paris]');
assert.equal(Temporal.Instant.compare(instant, zdt.toInstant()), 0);
assert.equal(zdt.toDateTime().toString(), '2020-01-03T11:41:51');

// With an offset:

const result2 = instant.toString('-07:00');
const zdt2 = instant.toZonedDateTime('-07:00', 'iso8601');

assert.equal(result2, '2020-01-03T03:41:51-07:00');
assert.equal(zdt2.toString(), '2020-01-03T03:41:51-07:00[-07:00]');

// With a Temporal.TimeZone object:

const timeZone = Temporal.TimeZone.from('Asia/Seoul');
const result3 = instant.toString(timeZone);
const zdt3 = instant.toZonedDateTime('Asia/Seoul', 'iso8601');

assert.equal(result3, '2020-01-03T19:41:51+09:00[Asia/Seoul]');
assert.equal(zdt3.toString(), '2020-01-03T19:41:51+09:00[Asia/Seoul]');
