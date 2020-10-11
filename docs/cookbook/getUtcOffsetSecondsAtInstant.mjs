const ldt = Temporal.Instant.from('2020-01-09T00:00Z').toLocalDateTime('America/New_York', 'iso8601');

ldt.offsetNanoseconds / 1e9; // => -18000

assert.equal(ldt.offsetNanoseconds / 1e9, '-18000');
