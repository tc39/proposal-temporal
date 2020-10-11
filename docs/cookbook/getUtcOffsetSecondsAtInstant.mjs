const zdt = Temporal.Instant.from('2020-01-09T00:00Z').toZonedDateTime('America/New_York', 'iso8601');

zdt.offsetNanoseconds / 1e9; // => -18000

assert.equal(zdt.offsetNanoseconds / 1e9, '-18000');
