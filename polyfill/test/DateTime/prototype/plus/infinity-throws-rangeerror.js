// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.DateTime.prototype.plus throws a RangeError if any value in a property bag is Infinity
esid: sec-temporal.datetime.prototype.plus
---*/

const instance = Temporal.DateTime.from({ year: 2000, month: 5, day: 2, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });

// constrain

assert.throws(RangeError, () => instance.plus({ years: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ months: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ weeks: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ days: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ hours: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ minutes: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ seconds: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ milliseconds: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ microseconds: Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.plus({ nanoseconds: Infinity }, { overflow: 'constrain' }));

// reject

assert.throws(RangeError, () => instance.plus({ years: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ months: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ weeks: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ days: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ hours: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ minutes: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ seconds: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ milliseconds: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ microseconds: Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.plus({ nanoseconds: Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => instance.plus({ years: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ months: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ weeks: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ days: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ hours: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ minutes: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ seconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ milliseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ microseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ nanoseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.plus({ years: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ months: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ weeks: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ days: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ hours: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ minutes: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ seconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ milliseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ microseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ nanoseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");
