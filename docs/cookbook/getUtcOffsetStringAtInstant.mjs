const instant = Temporal.Instant.from('2020-01-09T00:00Z');
const nyc = Temporal.TimeZone.from('America/New_York');

nyc.getOffsetStringFor(instant); // => '-05:00'

// Can also be done with ZonedDateTime.offset:
const source = instant.toZonedDateTimeISO(nyc);
source.offset; // => '-05:00'
