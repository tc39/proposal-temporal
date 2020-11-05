// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.from
includes: [compareArray.js]
---*/

let called = false;

class MyYearMonth extends Temporal.PlainYearMonth {
  constructor(year, month) {
    assert.compareArray([year, month], [2000, 5]);
    called = true;
    super(year, month);
  }
}

const result = MyYearMonth.from("2000-05");
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyYearMonth.prototype);
