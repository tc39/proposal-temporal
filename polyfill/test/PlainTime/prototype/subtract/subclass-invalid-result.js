// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.prototype.subtract
features: [Symbol.species]
---*/

function check(value, description) {
  const time = Temporal.PlainTime.from({ hour: 12, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
  time.constructor = {
    [Symbol.species]: function() {
      return value;
    },
  };
  assert.throws(TypeError, () => time.subtract({ nanoseconds: 1 }), description);
}

check(undefined, "undefined");
check(null, "null");
check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
check({}, "plain object");
