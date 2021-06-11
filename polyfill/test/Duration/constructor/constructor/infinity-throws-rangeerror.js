// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.Duration throws a RangeError if any value is Infinity
esid: sec-temporal.duration
features: [Temporal]
---*/

assert.throws(RangeError, () => new Temporal.Duration(Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, 0, Infinity));
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => new Temporal.Duration(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, obj));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, obj));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, obj));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, obj));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 10, "it fails after fetching the primitive value");
