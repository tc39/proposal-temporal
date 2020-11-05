// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.add
features: [Symbol.species]
---*/

function check(value, description) {
  const yearmonth = Temporal.PlainYearMonth.from({ year: 2000, month: 5 });
  yearmonth.constructor = {
    [Symbol.species]: value,
  };
  assert.throws(TypeError, () => yearmonth.add({ months: 1 }), description);
}

check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
check({}, "plain object");
