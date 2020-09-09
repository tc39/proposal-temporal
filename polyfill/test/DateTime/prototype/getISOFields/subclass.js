// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.prototype.getisofields
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [2000, 5, 2, 12, 34, 56, 987, 654, 321]
];

class MyDateTime extends Temporal.DateTime {
  constructor(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
    assert.compareArray([year, month, day, hour, minute, second, millisecond, microsecond, nanosecond], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
}

const instance = MyDateTime.from("2000-05-02T12:34:56.987654321");
assert.sameValue(called, 1);

const result = instance.getISOFields();
assert.sameValue(result.isoYear, 2000, "year result");
assert.sameValue(result.isoMonth, 5, "month result");
assert.sameValue(result.isoDay, 2, "day result");
assert.sameValue(result.hour, 12, "hour result");
assert.sameValue(result.minute, 34, "minute result");
assert.sameValue(result.second, 56, "second result");
assert.sameValue(result.millisecond, 987, "millisecond result");
assert.sameValue(result.microsecond, 654, "microsecond result");
assert.sameValue(result.nanosecond, 321, "nanosecond result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
