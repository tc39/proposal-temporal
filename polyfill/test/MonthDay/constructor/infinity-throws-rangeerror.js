// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.MonthDay throws a RangeError if any value is Infinity
esid: sec-temporal.monthday
---*/

assert.throws(RangeError, () => new Temporal.MonthDay(Infinity, 1));
assert.throws(RangeError, () => new Temporal.MonthDay(1, Infinity));
assert.throws(RangeError, () => new Temporal.MonthDay(1, 1, Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return Infinity;
  }
};

assert.throws(RangeError, () => new Temporal.MonthDay(obj, 1));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.MonthDay(1, obj));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.MonthDay(1, 1, obj));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
