// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.minus
---*/

function check(value, description) {
  const yearmonth = Temporal.YearMonth.from({ year: 2000, month: 5 });
  yearmonth.constructor = value;
  assert.throws(TypeError, () => yearmonth.minus({ months: 1 }), description);
}

check(null, "null");
check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
