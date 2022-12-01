// Convert a year/month/day `Date` to a `Temporal.PlainDate`. Uses the caller's time zone.
let date = new Date(2000, 0, 1); // => Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time)
let plainDate = date
  .toTemporalInstant()                           // => 2000-01-01T08:00:00Z
  .toZonedDateTimeISO(Temporal.Now.timeZoneId()) // => 2000-01-01T00:00:00-08:00[America/Los_Angeles]
  .toPlainDate();                                // => 2000-01-01

assert.equal(plainDate.toString(), '2000-01-01');

// Convert a year/month/day `Date` to a `Temporal.PlainDate`. Uses UTC.
date = new Date(Date.UTC(2000, 0, 1)); // => Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)
date = new Date('2000-01-01T00:00Z');  // => Fri Dec 31 1999 16:00:00 GMT-0800 (Pacific Standard Time)
plainDate = date
  .toTemporalInstant()       // => 2000-01-01T00:00:00Z
  .toZonedDateTimeISO('UTC') // => 2000-01-01T00:00:00+00:00[UTC]
  .toPlainDate();            // => 2000-01-01

assert.equal(plainDate.toString(), '2000-01-01');
