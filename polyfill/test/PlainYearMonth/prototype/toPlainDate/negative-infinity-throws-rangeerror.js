// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Temporal.PlainYearMonth.prototype.toPlainDate throws a RangeError if the argument is -Infinity
esid: sec-temporal.plainyearmonth.prototype.toplaindate
features: [Temporal]
---*/

const instance = new Temporal.PlainYearMonth(2000, 5);

assert.throws(RangeError, () => instance.toPlainDate({ day: -Infinity }));

let calls = 0;
const obj = {
  day: {
    valueOf() {
      calls++;
      return Infinity;
    }
  }
};

assert.throws(RangeError, () => instance.toPlainDate(obj));
assert.sameValue(calls, 1, "it fails after fetching the primitive value");
