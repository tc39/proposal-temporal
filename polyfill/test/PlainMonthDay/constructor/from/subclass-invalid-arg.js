// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.from
features: [Temporal]
---*/

let called = false;

class MyMonthDay extends Temporal.PlainMonthDay {
  constructor(month, day) {
    called = true;
    super(month, day);
  }
}

assert.throws(RangeError, () => MyMonthDay.from("00-01", { overflow: "reject" }));
assert.throws(RangeError, () => MyMonthDay.from("02-30", { overflow: "reject" }));
assert.throws(RangeError, () => MyMonthDay.from("13-24", { overflow: "reject" }));
assert.sameValue(called, false);
