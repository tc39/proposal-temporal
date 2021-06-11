// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDateTime.prototype.with handles a property bag if any value is -Infinity
esid: sec-temporal.plaindatetime.prototype.with
includes: [temporalHelpers.js]
features: [Temporal]
---*/

const instance = new Temporal.PlainDateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321);

// constrain

assert.throws(RangeError, () => instance.with({ year: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ month: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ day: -Infinity }, { overflow: 'constrain' }));
let result = instance.with({ hour: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 2000, 5, "M05", 2, 0, 34, 56, 987, 654, 321, "hour -infinity");
result = instance.with({ minute: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 2000, 5, "M05", 2, 12, 0, 56, 987, 654, 321, "minute -infinity");
result = instance.with({ second: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 2000, 5, "M05", 2, 12, 34, 0, 987, 654, 321, "second -infinity");
result = instance.with({ millisecond: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 2000, 5, "M05", 2, 12, 34, 56, 0, 654, 321, "millisecond -infinity");
result = instance.with({ microsecond: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 2000, 5, "M05", 2, 12, 34, 56, 987, 0, 321, "microsecond -infinity");
result = instance.with({ nanosecond: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 2000, 5, "M05", 2, 12, 34, 56, 987, 654, 0, "nanosecond -infinity");

// reject

assert.throws(RangeError, () => instance.with({ year: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ month: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ day: -Infinity }, { overflow: 'reject' }));
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

assert.throws(RangeError, () => instance.with({ year: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ month: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ day: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
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
