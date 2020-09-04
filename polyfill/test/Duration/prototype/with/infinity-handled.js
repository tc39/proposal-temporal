// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.prototype.with handles a property bag if any value is Infinity
esid: sec-temporal.duration.prototype.with
---*/

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);

// constrain

let result = instance.with({ years: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, Number.MAX_VALUE);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ months: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, Number.MAX_VALUE);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ weeks: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, Number.MAX_VALUE);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ days: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, Number.MAX_VALUE);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ hours: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, Number.MAX_VALUE);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ minutes: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, Number.MAX_VALUE);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ seconds: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, Number.MAX_VALUE);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ milliseconds: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, Number.MAX_VALUE);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ microseconds: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, Number.MAX_VALUE);
assert.sameValue(result.nanoseconds, 321);
result = instance.with({ nanoseconds: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.years, 1);
assert.sameValue(result.months, 2);
assert.sameValue(result.weeks, 3);
assert.sameValue(result.days, 4);
assert.sameValue(result.hours, 5);
assert.sameValue(result.minutes, 6);
assert.sameValue(result.seconds, 7);
assert.sameValue(result.milliseconds, 987);
assert.sameValue(result.microseconds, 654);
assert.sameValue(result.nanoseconds, Number.MAX_VALUE);

// balance

assert.throws(RangeError, () => instance.with({ years: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ months: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ weeks: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ days: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ hours: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ minutes: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ seconds: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ milliseconds: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ microseconds: Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ nanoseconds: Infinity }, { overflow: 'balance' }));

// reject

assert.throws(RangeError, () => instance.with({ years: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ months: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ weeks: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ days: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ hours: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ minutes: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ seconds: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ milliseconds: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ microseconds: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ nanoseconds: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

result = instance.with({ years: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = instance.with({ months: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = instance.with({ weeks: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = instance.with({ days: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = instance.with({ hours: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = instance.with({ minutes: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");
result = instance.with({ seconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 7, "it fetches the primitive value");
result = instance.with({ milliseconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 8, "it fetches the primitive value");
result = instance.with({ microseconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 9, "it fetches the primitive value");
result = instance.with({ nanoseconds: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 10, "it fetches the primitive value");

assert.throws(RangeError, () => instance.with({ years: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ months: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ weeks: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ days: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ hours: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ minutes: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ seconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ milliseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ microseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ nanoseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.with({ years: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 21, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ months: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 22, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ weeks: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 23, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ days: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 24, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ hours: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 25, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ minutes: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 26, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ seconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 27, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ milliseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 28, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ microseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 29, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ nanoseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 30, "it fails after fetching the primitive value");
