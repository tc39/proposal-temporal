// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.minus
includes: [compareArray.js]
---*/

let called = 0;

class MyYearMonth extends Temporal.YearMonth {
  constructor(year, month) {
    ++called;
    assert.compareArray([year, month], [-271821, 4]);
    super(year, month);
  }
}

const instance = MyYearMonth.from("-271821-04");
assert.sameValue(called, 1);

const result = instance.minus({ months: 1 });
assert.sameValue(result.year, -271821, "year result");
assert.sameValue(result.month, 4, "month result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.minus({ months: 1 }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
