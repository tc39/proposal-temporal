// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.add
includes: [compareArray.js]
---*/

let called = 0;

class MyDuration extends Temporal.Duration {
  constructor(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    ++called;
    assert.compareArray([years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], [0, 0, 0, 0, 0, 0, 0, 0, 0, Number.MAX_VALUE]);
    super(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from({ nanoseconds: Number.MAX_VALUE });
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.add({ nanoseconds: Number.MAX_VALUE }));
assert.sameValue(called, 1);
