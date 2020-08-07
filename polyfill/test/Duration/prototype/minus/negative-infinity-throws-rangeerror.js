// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.prototype.minus throws a RangeError if any value in a property bag is -Infinity
esid: sec-temporal.duration.prototype.minus
---*/

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);

// constrain

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { disambiguation: 'constrain' }));

// balance

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { disambiguation: 'balance' }));

// reject

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.minus({ years: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.minus({ years: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");

assert.throws(RangeError, () => instance.minus({ years: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 21, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 22, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 23, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 24, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 25, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 26, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 27, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 28, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 29, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 30, "it fails after fetching the primitive value");
