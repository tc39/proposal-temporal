// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.prototype.with
features: [Symbol.species]
---*/

function check(value, description) {
  const monthday = Temporal.PlainMonthDay.from({ month: 5, day: 2 });
  monthday.constructor = {
    [Symbol.species]: function() {
      return value;
    },
  };
  assert.throws(TypeError, () => monthday.with({ day: 20 }), description);
}

check(undefined, "undefined");
check(null, "null");
check(true, "true");
check("test", "string");
check(Symbol(), "Symbol");
check(7, "number");
check(7n, "bigint");
check({}, "plain object");
