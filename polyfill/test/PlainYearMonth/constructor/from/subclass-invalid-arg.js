// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.from
features: [Temporal]
---*/

let called = false;

class MyYearMonth extends Temporal.PlainYearMonth {
  constructor(year, month) {
    called = true;
    super(year, month);
  }
}

assert.throws(RangeError, () => MyYearMonth.from({ year: 2020, month: 13 }, { overflow: "reject" }));
assert.sameValue(called, false);
