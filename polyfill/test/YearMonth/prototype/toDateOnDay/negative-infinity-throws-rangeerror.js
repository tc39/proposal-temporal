// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.YearMonth.prototype.toDateOnDay throws a RangeError if the argument is -Infinity
esid: sec-temporal.yearmonth.prototype.todateonday
---*/

const instance = new Temporal.YearMonth(2000, 5);

assert.throws(RangeError, () => instance.toDateOnDay(-Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.toDateOnDay(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
