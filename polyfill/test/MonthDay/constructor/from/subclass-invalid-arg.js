// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.from
---*/

let called = false;

class MyMonthDay extends Temporal.MonthDay {
  constructor(month, day) {
    called = true;
    super(month, day);
  }
}

assert.throws(RangeError, () => MyMonthDay.from("00-01", { disambiguation: "reject" }));
assert.throws(RangeError, () => MyMonthDay.from("02-30", { disambiguation: "reject" }));
assert.throws(RangeError, () => MyMonthDay.from("13-24", { disambiguation: "reject" }));
assert.sameValue(called, false);
