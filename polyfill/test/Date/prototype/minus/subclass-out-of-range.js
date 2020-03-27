// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.minus
includes: [compareArray.js]
---*/

let called = 0;

class MyDate extends Temporal.Date {
  constructor(year, month, day) {
    ++called;
    assert.compareArray([year, month, day], [-271821, 4, 19], "constructor arguments");
    super(year, month, day);
  }
}

const instance = MyDate.from("-271821-04-19");
assert.sameValue(called, 1);

const result = instance.minus({ days: 1 });
assert.sameValue(result.year, -271821, "year result");
assert.sameValue(result.month, 4, "month result");
assert.sameValue(result.day, 19, "day result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.minus({ days: 1 }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
