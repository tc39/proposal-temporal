const instant = Temporal.Instant.from('2020-01-09T00:00Z');

const source = instant.toZonedDateTimeISO('America/New_York');
source.offset; // => '-05:00'
