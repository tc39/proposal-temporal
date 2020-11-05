// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.subtract
---*/

function CustomError() {}

const yearmonth = Temporal.PlainYearMonth.from({ year: 2000, month: 5 });
Object.defineProperty(yearmonth, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => yearmonth.subtract({ months: 1 }));
