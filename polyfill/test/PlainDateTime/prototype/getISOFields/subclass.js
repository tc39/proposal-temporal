// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.getisofields
includes: [compareArray.js]
features: [Temporal]
---*/

let called = 0;

class MyDateTime extends Temporal.PlainDateTime {
  constructor(...args) {
    ++called;
    super(...args);
  }
}

const instance = new MyDateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321);
assert.sameValue(called, 1);

const result = instance.getISOFields();
assert.sameValue(result.isoYear, 2000, "year result");
assert.sameValue(result.isoMonth, 5, "month result");
assert.sameValue(result.isoDay, 2, "day result");
assert.sameValue(result.isoHour, 12, "hour result");
assert.sameValue(result.isoMinute, 34, "minute result");
assert.sameValue(result.isoSecond, 56, "second result");
assert.sameValue(result.isoMillisecond, 987, "millisecond result");
assert.sameValue(result.isoMicrosecond, 654, "microsecond result");
assert.sameValue(result.isoNanosecond, 321, "nanosecond result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
