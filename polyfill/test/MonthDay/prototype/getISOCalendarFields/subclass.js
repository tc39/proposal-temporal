// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.prototype.getisocalendarfields
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [5, 2]
];

class MyMonthDay extends Temporal.MonthDay {
  constructor(month, day) {
    assert.compareArray([month, day], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(month, day);
  }
}

const instance = MyMonthDay.from("05-02");
assert.sameValue(called, 1);

const result = instance.getISOCalendarFields();
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
