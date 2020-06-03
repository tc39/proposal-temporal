// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
includes: [compareArray.js]
---*/

let called = 0;

class MyDuration extends Temporal.Duration {
  constructor(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    assert.compareArray([years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], [1, 2, 3, 4, 5, 6, 7, 987, 654, 321], "constructor arguments");
    ++called;
    super(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from("P1Y2M3W4DT5H6M7.987654321S");
assert.sameValue(called, 1);

MyDuration.prototype.constructor = undefined;

const result = instance.with({ nanoseconds: 1 });
assert.sameValue(result.years, 1, "years result");
assert.sameValue(result.months, 2, "months result");
assert.sameValue(result.weeks, 3, "months result");
assert.sameValue(result.days, 4, "days result");
assert.sameValue(result.hours, 5, "hours result");
assert.sameValue(result.minutes, 6, "minutes result");
assert.sameValue(result.seconds, 7, "seconds result");
assert.sameValue(result.milliseconds, 987, "milliseconds result");
assert.sameValue(result.microseconds, 654, "microseconds result");
assert.sameValue(result.nanoseconds, 1, "nanoseconds result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.Duration.prototype);
