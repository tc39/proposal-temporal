// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.YearMonth.prototype.minus throws a RangeError if any value in a property bag is -Infinity
esid: sec-temporal.yearmonth.prototype.minus
---*/

const instance = Temporal.YearMonth.from({ year: 2000, month: 5 });

// constrain

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { overflow: 'constrain' }));

// reject

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.minus({ years: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.minus({ years: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");
