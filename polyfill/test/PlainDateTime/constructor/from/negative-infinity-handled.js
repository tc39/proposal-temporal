// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDateTime.from handles a property bag if any value is -Infinity
esid: sec-temporal.plaindatetime.from
includes: [temporalHelpers.js]
features: [Temporal]
---*/

// constrain

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: -Infinity, month: 1, day: 1 }, { overflow: 'constrain' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: -Infinity, day: 1 }, { overflow: 'constrain' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: -Infinity }, { overflow: 'constrain' }));
let result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 1970, 1, "M01", 1, 0, 0, 0, 0, 0, 0, "hour infinity");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 1970, 1, "M01", 1, 0, 0, 0, 0, 0, 0, "minute infinity");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 1970, 1, "M01", 1, 0, 0, 0, 0, 0, 0, "second infinity");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 1970, 1, "M01", 1, 0, 0, 0, 0, 0, 0, "millisecond infinity");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 1970, 1, "M01", 1, 0, 0, 0, 0, 0, 0, "microsecond infinity");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: -Infinity }, { overflow: 'constrain' });
TemporalHelpers.assertPlainDateTime(result, 1970, 1, "M01", 1, 0, 0, 0, 0, 0, 0, "nanosecond infinity");

// reject

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: -Infinity, month: 1, day: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: -Infinity, day: 1 }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: obj, month: 1, day: 1 }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: obj, day: 1 }, { overflow: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 4, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 5, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 6, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 7, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 8, "it fetches the primitive value");
result = Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: obj }, { overflow: 'constrain' });
assert.sameValue(calls, 9, "it fetches the primitive value");

assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: obj, month: 1, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: obj, day: 1 }, { overflow: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, minute: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, second: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, millisecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, microsecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, nanosecond: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
