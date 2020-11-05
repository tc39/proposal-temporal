// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.from
includes: [compareArray.js]
---*/

let called = false;

class MyMonthDay extends Temporal.PlainMonthDay {
  constructor(month, day) {
    assert.compareArray([month, day], [5, 2]);
    called = true;
    super(month, day);
  }
}

const result = MyMonthDay.from("05-02");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyMonthDay.prototype);
