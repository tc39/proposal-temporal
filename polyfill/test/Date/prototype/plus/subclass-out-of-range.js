// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.plus
includes: [compareArray.js]
---*/

let called = 0;

class MyDate extends Temporal.Date {
  constructor(year, month, day) {
    ++called;
    assert.compareArray([year, month, day], [275760, 9, 13]);
    super(year, month, day);
  }
}

const instance = MyDate.from("+275760-09-13");
assert.sameValue(called, 1);

const result = instance.plus({ days: 1 });
assert.sameValue(result.year, 275760, "year result");
assert.sameValue(result.month, 9, "month result");
assert.sameValue(result.day, 13, "day result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.plus({ days: 1 }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
