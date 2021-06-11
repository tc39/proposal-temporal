// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.from
features: [Temporal]
---*/

let called = false;

class MyDateTime extends Temporal.PlainDateTime {
  constructor(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
    called = true;
    super(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
}

assert.throws(RangeError, () => MyDateTime.from({ year: 2020, month: 13, day: 1 }, { overflow: "reject" }));
assert.sameValue(called, false);
