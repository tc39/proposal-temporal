const time = Temporal.Time.from('12:38:28.138818731');

// explicitly:
let wholeHour = time.with({ minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
assert.equal(wholeHour.toString(), '12:00');

// or, taking advantage of 0 being the default for time fields:
wholeHour = Temporal.Time.from({ hour: time.hour });
assert.equal(wholeHour.toString(), '12:00');

// Note: This file is calendar-independent.
