// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.YearMonth.prototype.toDate throws a RangeError if the argument is -Infinity
esid: sec-temporal.yearmonth.prototype.todate
---*/

const instance = new Temporal.YearMonth(2000, 5);

assert.throws(RangeError, () => instance.toDate(-Infinity));

let calls = 0;
const obj = {
  valueOf() {
    calls++;
    return -Infinity;
  }
};

assert.throws(RangeError, () => instance.toDate(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
