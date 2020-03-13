// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.minus
---*/

function check(value, description) {
  const date = Temporal.Date.from({ year: 2000, month: 5, day: 2 });
  date.constructor = value;
  assert.throws(TypeError, () => date.minus({ days: 1 }), description);
}

check(null, "null");
check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
