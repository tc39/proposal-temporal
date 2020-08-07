// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
---*/

let called = false;

class MyDuration extends Temporal.Duration {
  constructor(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds) {
    called = true;
    super(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

assert.throws(RangeError, () => MyDuration.from({ years: Infinity }, { disambiguation: "reject" }));
assert.throws(RangeError, () => MyDuration.from({ days: -Infinity }, { disambiguation: "reject" }));
assert.sameValue(called, false);
