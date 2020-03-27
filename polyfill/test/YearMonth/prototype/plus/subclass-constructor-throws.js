// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.plus
---*/

function CustomError() {}

const yearmonth = Temporal.YearMonth.from({ year: 2000, month: 5 });
Object.defineProperty(yearmonth, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => yearmonth.plus({ months: 1 }));
