// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.with
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [2000, 5],
  [2000, 11],
];

class MyYearMonth extends Temporal.PlainYearMonth {
  constructor(year, month) {
    assert.compareArray([year, month], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(year, month);
  }
}

const instance = MyYearMonth.from("2000-05");
assert.sameValue(called, 1);

const result = instance.with({ month: 11 });
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 11, "month result");
assert.sameValue(called, 2);
assert.sameValue(Object.getPrototypeOf(result), MyYearMonth.prototype);
