// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainTime.prototype.with handles a property bag if any value is -Infinity
esid: sec-temporal.time.prototype.with
---*/

const instance = new Temporal.PlainTime(12, 34, 56, 987, 654, 321);

// constrain

let result = instance.with({ hour: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.hour, 0);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ minute: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 0);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ second: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 0);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ millisecond: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 0);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ microsecond: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 0);
assert.sameValue(result.nanosecond, 321);
result = instance.with({ nanosecond: -Infinity }, { overflow: 'constrain' });
assert.sameValue(result.hour, 12);
assert.sameValue(result.minute, 34);
assert.sameValue(result.second, 56);
assert.sameValue(result.millisecond, 987);
assert.sameValue(result.microsecond, 654);
assert.sameValue(result.nanosecond, 0);

// reject

assert.throws(RangeError, () => instance.with({ hour: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ minute: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ second: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ millisecond: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ microsecond: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ nanosecond: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

result = instance.with({ hour: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 1, "it fetches the primitive value");
result = instance.with({ minute: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 2, "it fetches the primitive value");
result = instance.with({ second: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 3, "it fetches the primitive value");
result = instance.with({ millisecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = instance.with({ microsecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = instance.with({ nanosecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");

assert.throws(RangeError, () => instance.with({ hour: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ minute: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ second: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ millisecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ microsecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ nanosecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
