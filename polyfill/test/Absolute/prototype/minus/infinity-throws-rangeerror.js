// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Absolute.prototype.minus throws a RangeError if any value in a property bag is Infinity
esid: sec-temporal.absolute.prototype.minus
---*/

const instance = Temporal.Absolute.fromEpochSeconds(10);

assert.throws(RangeError, () => instance.minus({ hours: Infinity }));
assert.throws(RangeError, () => instance.minus({ minutes: Infinity }));
assert.throws(RangeError, () => instance.minus({ seconds: Infinity }));
assert.throws(RangeError, () => instance.minus({ milliseconds: Infinity }));
assert.throws(RangeError, () => instance.minus({ microseconds: Infinity }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: Infinity }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => instance.minus({ hours: obj }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ minutes: obj }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ seconds: obj }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ milliseconds: obj }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ microseconds: obj }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.minus({ nanoseconds: obj }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
