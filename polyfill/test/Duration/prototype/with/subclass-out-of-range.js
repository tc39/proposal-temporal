// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
includes: [compareArray.js]
---*/

let called = 0;

const constructorArguments = [
  Array(10).fill(0),
];

class MyDuration extends Temporal.Duration {
  constructor(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    ++called;
    assert.compareArray([years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], constructorArguments.shift(), "constructor arguments");
    super(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from("PT0S");
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.with({ days: Infinity }));
assert.sameValue(called, 1);
