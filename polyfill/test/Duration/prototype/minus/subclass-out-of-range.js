// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.minus
includes: [compareArray.js]
---*/

let called = 0;

class MyDuration extends Temporal.Duration {
  constructor(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    ++called;
    assert.compareArray([years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds], Array(9).fill(0));
    super(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

const instance = MyDuration.from("PT0S");
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.minus({ nanoseconds: 1 }, { disambiguation: "balanceConstrain" }));
assert.throws(RangeError, () => instance.minus({ nanoseconds: 1 }, { disambiguation: "balance" }));
assert.sameValue(called, 1);
