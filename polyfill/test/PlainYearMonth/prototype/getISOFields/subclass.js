// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.prototype.getisofields
includes: [compareArray.js]
features: [Temporal]
---*/

let called = 0;

class MyYearMonth extends Temporal.PlainYearMonth {
  constructor(year, month) {
    ++called;
    super(year, month);
  }
}

const instance = new MyYearMonth(2000, 5);
assert.sameValue(called, 1);

const result = instance.getISOFields();
assert.sameValue(result.isoYear, 2000, "year result");
assert.sameValue(result.isoMonth, 5, "month result");
assert.sameValue(result.calendar.id, "iso8601", "calendar result");
assert.sameValue(result.isoDay, 1, "ref day result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
