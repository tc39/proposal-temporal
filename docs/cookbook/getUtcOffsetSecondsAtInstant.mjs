const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');

nyc.getOffsetNanosecondsFor(instant) / 1e9; // => -18000
