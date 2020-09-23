const instantTime = Temporal.Instant.from('2020-01-03T10:41:51Z');

const result = instantTime.toString('Europe/Paris');

assert.equal(result, '2020-01-03T11:41:51+01:00[Europe/Paris]');
assert.equal(Temporal.Instant.compare(instantTime, Temporal.Instant.from(result)), 0);

// With an offset:

const result2 = instantTime.toString('-07:00');

assert.equal(result2, '2020-01-03T03:41:51-07:00');

// With a Temporal.TimeZone object:

const timeZone = Temporal.TimeZone.from('Asia/Seoul');
const result3 = instantTime.toString(timeZone);

assert.equal(result3, '2020-01-03T19:41:51+09:00[Asia/Seoul]');
