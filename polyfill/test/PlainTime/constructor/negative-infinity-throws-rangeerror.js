// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDate throws a RangeError if any value is -Infinity
esid: sec-temporal.time
---*/

assert.throws(RangeError, () => new Temporal.PlainTime(-Infinity));
assert.throws(RangeError, () => new Temporal.PlainTime(0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, 0, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, 0, 0, 0, -Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => new Temporal.PlainTime(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainTime(0, obj));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, obj));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, 0, obj));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, 0, 0, obj));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainTime(0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
