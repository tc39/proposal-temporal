// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.from
---*/

let called = false;

class MyDate extends Temporal.Date {
  constructor(year, month, day) {
    called = true;
    super(year, month, day);
  }
}

assert.throws(RangeError, () => MyDate.from("+275760-09-14", { disambiguation: "reject" }));
assert.throws(RangeError, () => MyDate.from("-271821-04-18", { disambiguation: "reject" }));
assert.sameValue(called, false);
