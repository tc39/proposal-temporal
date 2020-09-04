// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.prototype.with throws a RangeError if any value in a property bag is -Infinity
esid: sec-temporal.duration.prototype.with
---*/

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);

// constrain

assert.throws(RangeError, () => instance.with({ years: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ months: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ weeks: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ days: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ hours: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ minutes: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ seconds: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ milliseconds: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ microseconds: -Infinity }, { overflow: 'constrain' }));
assert.throws(RangeError, () => instance.with({ nanoseconds: -Infinity }, { overflow: 'constrain' }));

// balance

assert.throws(RangeError, () => instance.with({ years: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ months: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ weeks: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ days: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ hours: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ minutes: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ seconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ milliseconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ microseconds: -Infinity }, { overflow: 'balance' }));
assert.throws(RangeError, () => instance.with({ nanoseconds: -Infinity }, { overflow: 'balance' }));

// reject

assert.throws(RangeError, () => instance.with({ years: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ months: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ weeks: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ days: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ hours: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ minutes: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ seconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ milliseconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ microseconds: -Infinity }, { overflow: 'reject' }));
assert.throws(RangeError, () => instance.with({ nanoseconds: -Infinity }, { overflow: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.with({ years: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ months: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ weeks: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ days: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ hours: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ minutes: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ seconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ milliseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ microseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.with({ nanoseconds: obj }, { overflow: 'constrain' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");

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
