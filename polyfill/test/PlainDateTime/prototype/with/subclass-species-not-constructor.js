// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-Temporal.PlainDateTime.prototype.with
features: [Symbol.species]
---*/

function check(value, description) {
  const datetime = Temporal.PlainDateTime.from({ year: 2000, month: 5, day: 2, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
  datetime.constructor = {
    [Symbol.species]: value,
  };
  assert.throws(TypeError, () => datetime.with({ nanosecond: 1 }), description);
}

check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
check({}, "plain object");
