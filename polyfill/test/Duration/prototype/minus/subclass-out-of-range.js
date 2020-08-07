// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.minus
includes: [compareArray.js]
---*/

let called = 0;

class MyDuration extends Temporal.Duration {
  constructor(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    ++called;
    assert.compareArray([years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], [0, 0, 0, 0, 0, 0, 0, 0, 0, -Number.MAX_VALUE]);
    super(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from({ nanoseconds: -Number.MAX_VALUE });
assert.sameValue(called, 1);

const result = instance.minus({ nanoseconds: Number.MAX_VALUE });
assert.sameValue(result.years, 0, "years result");
assert.sameValue(result.months, 0, "months result");
assert.sameValue(result.weeks, 0, "weekss result");
assert.sameValue(result.days, 0, "days result");
assert.sameValue(result.hours, 0, "hours result");
assert.sameValue(result.minutes, 0, "minutes result");
assert.sameValue(result.seconds, 0, "seconds result");
assert.sameValue(result.milliseconds, 0, "milliseconds result");
assert.sameValue(result.microseconds, 0, "microseconds result");
assert.sameValue(result.nanoseconds, -Number.MAX_VALUE, "nanoseconds result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.minus({ nanoseconds: Number.MAX_VALUE }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
