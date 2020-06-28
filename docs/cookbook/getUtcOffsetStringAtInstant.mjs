const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');
const ldt = instant.toLocalDateTime(nyc, 'iso8601');

ldt.timeZoneOffsetString; // => '-05:00'

assert.equal(ldt.timeZoneOffsetString, '-05:00');
