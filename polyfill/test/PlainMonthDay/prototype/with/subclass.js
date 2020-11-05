// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.prototype.with
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [5, 2],
  [5, 20],
];

class MyMonthDay extends Temporal.PlainMonthDay {
  constructor(month, day) {
    assert.compareArray([month, day], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(month, day);
  }
}

const instance = MyMonthDay.from("05-02");
assert.sameValue(called, 1);

const result = instance.with({ day: 20 });
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 20, "day result");
assert.sameValue(called, 2);
assert.sameValue(Object.getPrototypeOf(result), MyMonthDay.prototype);
