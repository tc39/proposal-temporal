const source = Temporal.ZonedDateTime.from('2020-01-09T00:00[America/Chicago]');

const result = source.withTimeZone('America/Los_Angeles');

// On this date, when it's midnight in Chicago, it's 10 PM the previous night in LA
assert.equal(result.toString(), '2020-01-08T22:00:00-08:00[America/Los_Angeles]');
