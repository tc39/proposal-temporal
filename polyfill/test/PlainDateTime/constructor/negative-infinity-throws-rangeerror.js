// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainDateTime throws a RangeError if any value is -Infinity
esid: sec-temporal.datetime
---*/

assert.throws(RangeError, () => new Temporal.PlainDateTime(-Infinity, 1, 1));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, -Infinity, 1));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, 0, 0, -Infinity));
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, 0, 0, 0, -Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => new Temporal.PlainDateTime(obj, 1, 1));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, obj, 1));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, obj));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, obj));
assert.sameValue(calls, 4, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, obj));
assert.sameValue(calls, 5, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, obj));
assert.sameValue(calls, 6, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, 0, obj));
assert.sameValue(calls, 7, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, 0, 0, obj));
assert.sameValue(calls, 8, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.PlainDateTime(1970, 1, 1, 0, 0, 0, 0, 0, obj));
assert.sameValue(calls, 9, "it fails after fetching the primitive value");
