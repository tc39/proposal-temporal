// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.from handles a property bag if any value is -Infinity
esid: sec-temporal.duration.from
---*/

// constrain

let result = Temporal.Duration.from({ years: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, -Number.MAX_VALUE);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ months: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, -Number.MAX_VALUE);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ weeks: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, -Number.MAX_VALUE);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ days: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, -Number.MAX_VALUE);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ hours: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, -Number.MAX_VALUE);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ minutes: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, -Number.MAX_VALUE);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ seconds: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, -Number.MAX_VALUE);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ milliseconds: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, -Number.MAX_VALUE);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ microseconds: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, -Number.MAX_VALUE);
assert.sameValue(result.nanoseconds, 0);
result = Temporal.Duration.from({ nanoseconds: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 0);
assert.sameValue(result.months, 0);
assert.sameValue(result.weeks, 0);
assert.sameValue(result.days, 0);
assert.sameValue(result.hours, 0);
assert.sameValue(result.minutes, 0);
assert.sameValue(result.seconds, 0);
assert.sameValue(result.milliseconds, 0);
assert.sameValue(result.microseconds, 0);
assert.sameValue(result.nanoseconds, -Number.MAX_VALUE);

// balance

assert.throws(RangeError, () => Temporal.Duration.from({ years: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ months: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ weeks: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ days: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ hours: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: -Infinity }, { overflow: 'balance' }));

// reject

assert.throws(RangeError, () => Temporal.Duration.from({ years: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ months: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ weeks: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ days: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ hours: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

result = Temporal.Duration.from({ years: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = Temporal.Duration.from({ months: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = Temporal.Duration.from({ weeks: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = Temporal.Duration.from({ days: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = Temporal.Duration.from({ hours: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = Temporal.Duration.from({ minutes: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");
result = Temporal.Duration.from({ seconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 7, "it fetches the primitive value");
result = Temporal.Duration.from({ milliseconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 8, "it fetches the primitive value");
result = Temporal.Duration.from({ microseconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 9, "it fetches the primitive value");
result = Temporal.Duration.from({ nanoseconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 10, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.Duration.from({ years: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ months: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ weeks: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ days: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ hours: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");

assert.throws(RangeError, () => Temporal.Duration.from({ years: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 21, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ months: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 22, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ weeks: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 23, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ days: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 24, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ hours: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 25, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 26, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 27, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 28, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 29, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 30, "it fails after fetching the primitive value");
