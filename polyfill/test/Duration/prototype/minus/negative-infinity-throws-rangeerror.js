// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration.prototype.minus throws a RangeError if any value in a property bag is -Infinity
esid: sec-temporal.duration.prototype.minus
---*/

const instance = new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321);

// balanceConstrain

assert.throws(RangeError, () => instance.minus({ years: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ months: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ weeks: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ days: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ hours: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ minutes: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ seconds: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ milliseconds: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ microseconds: -Infinity }, { disambiguation: 'balanceConstrain' }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: -Infinity }, { disambiguation: 'balanceConstrain' }));

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

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.minus({ years: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ months: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ weeks: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ days: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ hours: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }, { disambiguation: 'balanceConstrain' }));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }, { disambiguation: 'balanceConstrain' }));
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
