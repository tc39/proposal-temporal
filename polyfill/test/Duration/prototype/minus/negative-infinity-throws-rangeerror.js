// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.prototype.minus throws a RangeError if any value in a property bag is -Infinity
esid: sec-temporal.duration.prototype.minus
---*/

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);

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

// balance

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { overflow: 'balance' }));

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

assert.throws(RangeError, () => instance.minus({ years: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { overflow: 'balance' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.minus({ years: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 21, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 22, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 23, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 24, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 25, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 26, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 27, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 28, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 29, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { overflow: 'reject' }));
assert.sameValue(calls, 30, "it fails after fetching the primitive value");
