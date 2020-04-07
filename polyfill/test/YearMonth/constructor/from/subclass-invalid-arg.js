// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.from
---*/

let called = false;

class MyYearMonth extends Temporal.YearMonth {
  constructor(year, month) {
    called = true;
    super(year, month);
  }
}

assert.throws(RangeError, () => MyYearMonth.from("+275760-10", { disambiguation: "reject" }));
assert.throws(RangeError, () => MyYearMonth.from("-271821-03", { disambiguation: "reject" }));
assert.sameValue(called, false);
