// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
---*/

function check(value, description) {
  const duration = Temporal.Duration.from({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 987, microseconds: 654, nanoseconds: 321 });
  duration.constructor = value;
  assert.throws(TypeError, () => duration.with({ nanoseconds: 1 }), description);
}

check(null, "null");
check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
