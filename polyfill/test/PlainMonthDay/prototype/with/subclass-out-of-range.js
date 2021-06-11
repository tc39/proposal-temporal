// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.with
includes: [compareArray.js, temporalHelpers.js]
features: [Temporal]
---*/

let called = 0;

class MyMonthDay extends Temporal.PlainMonthDay {
  constructor(...args) {
    ++called;
    super(...args);
  }
}

const instance = new MyMonthDay(11, 30);
assert.sameValue(called, 1);

const result = instance.with({ day: 31 });
TemporalHelpers.assertPlainMonthDay(result, "M11", 30);
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.with({ day: 31 }, { overflow: "reject" }));
assert.sameValue(called, 1);
