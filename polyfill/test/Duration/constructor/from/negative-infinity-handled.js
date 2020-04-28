// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.from handles a property bag if any value is -Infinity
esid: sec-temporal.duration.from
---*/

// constrain

assert.throws(RangeError, () => Temporal.Duration.from({ years: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ months: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ days: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ hours: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: -Infinity }, { disambiguation: 'constrain' }));
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: -Infinity }, { disambiguation: 'constrain' }));

// balance

assert.throws(RangeError, () => Temporal.Duration.from({ years: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ months: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ days: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ hours: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: -Infinity }, { disambiguation: 'balance' }));
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: -Infinity }, { disambiguation: 'balance' }));

// reject

assert.throws(RangeError, () => Temporal.Duration.from({ years: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ months: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ days: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ hours: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: -Infinity }, { disambiguation: 'reject' }));
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: -Infinity }, { disambiguation: 'reject' }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => Temporal.Duration.from({ years: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ months: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ days: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ hours: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: obj }, { disambiguation: 'constrain' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");

assert.throws(RangeError, () => Temporal.Duration.from({ years: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ months: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 11, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ days: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 12, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ hours: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 13, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 14, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 15, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 16, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 17, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: obj }, { disambiguation: 'balance' }));
assert.sameValue(calls, 18, "it fails after fetching the primitive value");

assert.throws(RangeError, () => Temporal.Duration.from({ years: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 19, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ months: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 20, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ days: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 21, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ hours: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 22, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ minutes: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 23, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ seconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 24, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ milliseconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 25, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ microseconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 26, "it fails after fetching the primitive value");
assert.throws(RangeError, () => Temporal.Duration.from({ nanoseconds: obj }, { disambiguation: 'reject' }));
assert.sameValue(calls, 27, "it fails after fetching the primitive value");
