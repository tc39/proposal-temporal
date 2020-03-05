// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  Array(9).fill(0),
  [0, 0, Number.MAX_VALUE, 0, 0, 0, 0, 0, 0],
];

class MyDuration extends Temporal.Duration {
  constructor(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    ++called;
    assert.compareArray([years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], constructorArguments.shift(), "constructor arguments");
    super(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from("PT0S");
assert.sameValue(called, 1);

const result = instance.with({ days: Infinity });
assert.sameValue(result.years, 0, "years result");
assert.sameValue(result.months, 0, "months result");
assert.sameValue(result.days, Number.MAX_VALUE, "days result");
assert.sameValue(result.hours, 0, "hours result");
assert.sameValue(result.minutes, 0, "minutes result");
assert.sameValue(result.seconds, 0, "seconds result");
assert.sameValue(result.milliseconds, 0, "milliseconds result");
assert.sameValue(result.microseconds, 0, "microseconds result");
assert.sameValue(result.nanoseconds, 0, "nanoseconds result");
assert.sameValue(called, 2);

assert.throws(RangeError, () => instance.with({ days: Infinity }, { disambiguation: "balance" }));
assert.throws(RangeError, () => instance.with({ days: Infinity }, { disambiguation: "reject" }));
assert.sameValue(called, 2);
