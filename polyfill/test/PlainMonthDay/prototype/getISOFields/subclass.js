// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.getisofields
includes: [compareArray.js]
features: [Temporal]
---*/

let called = 0;

class MyMonthDay extends Temporal.PlainMonthDay {
  constructor(month, day) {
    ++called;
    super(month, day);
  }
}

const instance = new MyMonthDay(5, 2);
assert.sameValue(called, 1);

const result = instance.getISOFields();
assert.sameValue(result.isoMonth, 5, "month result");
assert.sameValue(result.isoDay, 2, "day result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.sameValue(result.isoYear, 1972, "ref year result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
