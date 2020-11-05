// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.getisofields
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [2000, 5, 2]
];

class MyDate extends Temporal.PlainDate {
  constructor(year, month, day) {
    assert.compareArray([year, month, day], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(year, month, day);
  }
}

const instance = MyDate.from("2000-05-02");
assert.sameValue(called, 1);

const result = instance.getISOFields();
assert.sameValue(result.isoYear, 2000, "year result");
assert.sameValue(result.isoMonth, 5, "month result");
assert.sameValue(result.isoDay, 2, "day result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
