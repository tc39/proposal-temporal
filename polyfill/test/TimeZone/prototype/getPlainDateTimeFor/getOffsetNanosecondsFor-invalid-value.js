// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getplaindatetimefor
features: [Temporal]
---*/

const values = [
  0.1,
  1.2,
  NaN,
  Infinity,
  -Infinity,
  86400000000001,
  -86400000000001,
];
const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");

for (const value of values) {
  const timeZone = Temporal.TimeZone.from("UTC");
  let called = false;
  timeZone.getOffsetNanosecondsFor = function(argument) {
    assert.sameValue(argument, instant);
    called = true;
    return value;
  };
  assert.throws(RangeError, () => timeZone.getPlainDateTimeFor(instant));
  assert.sameValue(called, true);
}
