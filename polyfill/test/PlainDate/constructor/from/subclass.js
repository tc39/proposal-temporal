// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.from
includes: [compareArray.js]
---*/

let called = false;

class MyDate extends Temporal.PlainDate {
  constructor(year, month, day) {
    assert.compareArray([year, month, day], [2000, 5, 2]);
    called = true;
    super(year, month, day);
  }
}

const result = MyDate.from("2000-05-02");
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyDate.prototype);
