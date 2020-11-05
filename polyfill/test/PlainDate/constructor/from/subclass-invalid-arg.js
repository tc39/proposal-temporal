// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.from
---*/

let called = false;

class MyDate extends Temporal.PlainDate {
  constructor(year, month, day) {
    called = true;
    super(year, month, day);
  }
}

assert.throws(RangeError, () => MyDate.from({ year: 2020, month: 13, day: 1 }, { overflow: "reject" }));
assert.sameValue(called, false);
