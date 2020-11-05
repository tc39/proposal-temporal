// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.prototype.with
includes: [compareArray.js]
features: [Symbol.species]
---*/

let called = 0;

class MyMonthDay extends Temporal.PlainMonthDay {
  constructor(month, day) {
    assert.compareArray([month, day], [5, 2], "constructor arguments");
    ++called;
    super(month, day);
  }
}

const instance = MyMonthDay.from("05-02");
assert.sameValue(called, 1);

MyMonthDay.prototype.constructor = {
  [Symbol.species]: undefined,
};

const result = instance.with({ day: 20 });
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 20, "day result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.PlainMonthDay.prototype);
