// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Absolute.prototype.plus throws a RangeError if any value in a property bag is Infinity
esid: sec-temporal.absolute.prototype.plus
---*/

const instance = Temporal.Absolute.fromEpochSeconds(10);

assert.throws(RangeError, () => instance.plus({ hours: Infinity }));
assert.throws(RangeError, () => instance.plus({ minutes: Infinity }));
assert.throws(RangeError, () => instance.plus({ seconds: Infinity }));
assert.throws(RangeError, () => instance.plus({ milliseconds: Infinity }));
assert.throws(RangeError, () => instance.plus({ microseconds: Infinity }));
assert.throws(RangeError, () => instance.plus({ nanoseconds: Infinity }));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => instance.plus({ hours: obj }));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ minutes: obj }));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ seconds: obj }));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ milliseconds: obj }));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ microseconds: obj }));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => instance.plus({ nanoseconds: obj }));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
