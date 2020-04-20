// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.YearMonth throws a RangeError if any value is -Infinity
esid: sec-temporal.yearmonth
---*/

assert.throws(RangeError, () => new Temporal.YearMonth(-Infinity, 1));
assert.throws(RangeError, () => new Temporal.YearMonth(1970, -Infinity));
assert.throws(RangeError, () => new Temporal.YearMonth(1970, 1, -Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => new Temporal.YearMonth(obj, 1));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.YearMonth(1970, obj));
assert.sameValue(calls, 2, "it fails after fetching the primitive value");
assert.throws(RangeError, () => new Temporal.YearMonth(1970, 1, obj));
assert.sameValue(calls, 3, "it fails after fetching the primitive value");
