// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.with
includes: [compareArray.js]
---*/

let called = 0;

class MyMonthDay extends Temporal.MonthDay {
  constructor(month, day) {
    ++called;
    assert.compareArray([month, day], [11, 30]);
    super(month, day);
  }
}

const instance = MyMonthDay.from("11-30");
assert.sameValue(called, 1);

const result = instance.with({ day: 31 });
assert.sameValue(result.month, 11, "month result");
assert.sameValue(result.day, 30, "day result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.with({ day: 31 }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
