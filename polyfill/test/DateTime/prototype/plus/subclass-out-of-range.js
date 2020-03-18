// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.plus
includes: [compareArray.js]
---*/

let called = 0;

class MyDateTime extends Temporal.DateTime {
  constructor(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
    ++called;
    assert.compareArray([year, month, day, hour, minute, second, millisecond, microsecond, nanosecond], [275760, 9, 13, 23, 59, 59, 999, 999, 999]);
    super(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
}

const instance = MyDateTime.from("+275760-09-13T23:59:59.999999999");
assert.sameValue(called, 1);

const result = instance.plus({ nanoseconds: 1 });
assert.sameValue(result.year, 275760, "year result");
assert.sameValue(result.month, 9, "month result");
assert.sameValue(result.day, 13, "day result");
assert.sameValue(result.hour, 23, "hour result");
assert.sameValue(result.minute, 59, "minute result");
assert.sameValue(result.second, 59, "second result");
assert.sameValue(result.millisecond, 999, "millisecond result");
assert.sameValue(result.microsecond, 999, "microsecond result");
assert.sameValue(result.nanosecond, 999, "nanosecond result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.plus({ nanoseconds: 1 }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
