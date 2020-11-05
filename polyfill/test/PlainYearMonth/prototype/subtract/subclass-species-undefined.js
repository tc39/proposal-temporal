// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.subtract
includes: [compareArray.js]
features: [Symbol.species]
---*/

let called = 0;

class MyYearMonth extends Temporal.PlainYearMonth {
  constructor(year, month) {
    assert.compareArray([year, month], [2000, 5], "constructor arguments");
    ++called;
    super(year, month);
  }
}

const instance = MyYearMonth.from("2000-05");
assert.sameValue(called, 1);

MyYearMonth.prototype.constructor = {
  [Symbol.species]: undefined,
};

const result = instance.subtract({ months: 1 });
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 4, "month result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.PlainYearMonth.prototype);
