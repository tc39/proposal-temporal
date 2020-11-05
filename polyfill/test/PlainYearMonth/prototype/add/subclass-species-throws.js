// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.add
features: [Symbol.species]
---*/

function CustomError() {}

const yearmonth = Temporal.PlainYearMonth.from({ year: 2000, month: 5 });
yearmonth.constructor = {
  get [Symbol.species]() {
    throw new CustomError();
  },
};

assert.throws(CustomError, () => yearmonth.add({ months: 1 }));
