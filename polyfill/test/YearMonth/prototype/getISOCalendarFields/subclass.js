// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.getisocalendarfields
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [2000, 5]
];

class MyYearMonth extends Temporal.YearMonth {
  constructor(year, month) {
    assert.compareArray([year, month], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(year, month);
  }
}

const instance = MyYearMonth.from("2000-05");
assert.sameValue(called, 1);

const result = instance.getISOCalendarFields();
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
