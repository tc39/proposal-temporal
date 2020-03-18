// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.plus
includes: [compareArray.js]
---*/

let called = 0;

class MyYearMonth extends Temporal.YearMonth {
  constructor(year, month) {
    ++called;
    assert.compareArray([year, month], [275760, 9]);
    super(year, month);
  }
}

const instance = MyYearMonth.from("+275760-09");
assert.sameValue(called, 1);

const result = instance.plus({ months: 1 });
assert.sameValue(result.year, 275760, "year result");
assert.sameValue(result.month, 9, "month result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.plus({ months: 1 }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
