// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.getfields
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  [1, 2, 3, 4, 5, 6, 987, 654, 321]
];

class MyDuration extends Temporal.Duration {
  constructor(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    assert.compareArray([years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], constructorArguments.shift(), "constructor arguments");
    ++called;
    super(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from("P1Y2M3DT4H5M6.987654321S");
assert.sameValue(called, 1);

const result = instance.getFields();
assert.sameValue(result.years, 1, "years result");
assert.sameValue(result.months, 2, "months result");
assert.sameValue(result.days, 3, "days result");
assert.sameValue(result.hours, 4, "hours result");
assert.sameValue(result.minutes, 5, "minutes result");
assert.sameValue(result.seconds, 6, "seconds result");
assert.sameValue(result.milliseconds, 987, "milliseconds result");
assert.sameValue(result.microseconds, 654, "microseconds result");
assert.sameValue(result.nanoseconds, 321, "nanoseconds result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Object.prototype);
