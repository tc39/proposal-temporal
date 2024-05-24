const instant = Temporal.Instant.from('2020-01-09T00:00Z');

instant.toZonedDateTimeISO('America/New_York').offsetNanoseconds / 1e9; // => -18000
