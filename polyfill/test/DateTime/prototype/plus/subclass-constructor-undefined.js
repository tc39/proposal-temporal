// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.plus
includes: [compareArray.js]
---*/

let called = 0;

class MyDateTime extends Temporal.DateTime {
  constructor(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
    assert.compareArray([year, month, day, hour, minute, second, millisecond, microsecond, nanosecond], [2000, 5, 2, 12, 34, 56, 987, 654, 321], "constructor arguments");
    ++called;
    super(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
}

const instance = MyDateTime.from("2000-05-02T12:34:56.987654321");
assert.sameValue(called, 1);

MyDateTime.prototype.constructor = undefined;

const result = instance.plus({ nanoseconds: 1 });
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 5, "month result");
assert.sameValue(result.day, 2, "day result");
assert.sameValue(result.hour, 12, "hour result");
assert.sameValue(result.minute, 34, "minute result");
assert.sameValue(result.second, 56, "second result");
assert.sameValue(result.millisecond, 987, "millisecond result");
assert.sameValue(result.microsecond, 654, "microsecond result");
assert.sameValue(result.nanosecond, 322, "nanosecond result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.DateTime.prototype);
