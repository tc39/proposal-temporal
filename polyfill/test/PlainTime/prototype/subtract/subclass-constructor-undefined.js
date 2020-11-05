// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.subtract
includes: [compareArray.js]
---*/

let called = 0;

class MyTime extends Temporal.PlainTime {
  constructor(hour, minute, second, millisecond, microsecond, nanosecond) {
    assert.compareArray([hour, minute, second, millisecond, microsecond, nanosecond], [12, 34, 56, 987, 654, 321], "constructor arguments");
    ++called;
    super(hour, minute, second, millisecond, microsecond, nanosecond);
  }
}

const instance = MyTime.from("12:34:56.987654321");
assert.sameValue(called, 1);

MyTime.prototype.constructor = undefined;

const result = instance.subtract({ nanoseconds: 1 });
assert.sameValue(result.hour, 12, "hour result");
assert.sameValue(result.minute, 34, "minute result");
assert.sameValue(result.second, 56, "second result");
assert.sameValue(result.millisecond, 987, "millisecond result");
assert.sameValue(result.microsecond, 654, "microsecond result");
assert.sameValue(result.nanosecond, 320, "nanosecond result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.PlainTime.prototype);
