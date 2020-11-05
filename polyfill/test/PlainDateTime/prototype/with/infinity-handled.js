// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDateTime.prototype.with handles a property bag if any value is Infinity
esid: sec-temporal.datetime.prototype.with
---*/

const instance = new Temporal.PlainDateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321);

// constrain

assert.throws(RangeError, () => instance.with({ year: Infinity }, { overflow: 'constrain' }));
let result = instance.with({ month: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 12);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ day: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 31);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ hour: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 23);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ minute: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 59);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ second: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 59);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ millisecond: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 999);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ microsecond: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 999);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ nanosecond: Infinity }, { overflow: 'constrain' });
assert.sameValue(result.year, 2000);
assert.sameValue(result.month, 5);
assert.sameValue(result.day, 2);
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 999);

// reject

assert.throws(RangeError, () => instance.with({ year: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ month: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ day: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ hour: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ minute: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ second: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ millisecond: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ microsecond: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ nanosecond: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => instance.with({ year: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
result = instance.with({ month: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = instance.with({ day: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = instance.with({ hour: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = instance.with({ minute: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = instance.with({ second: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");
result = instance.with({ millisecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 7, "it fetches the primitive value");
result = instance.with({ microsecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 8, "it fetches the primitive value");
result = instance.with({ nanosecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 9, "it fetches the primitive value");

assert.throws(RangeError, () => instance.with({ year: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ month: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ hour: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ minute: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ second: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ millisecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ microsecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ nanosecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
