const instant = Temporal.Absolute.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');

nyc.getOffsetNanosecondsFor(instant) / 1e9; // => -18000

// Note: This file deals with only Temporal.Absolute, so it is calendar-independent.
