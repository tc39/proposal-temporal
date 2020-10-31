// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.tozoneddatetime
---*/

const values = [
  [undefined, "undefined"],
  [null, "null"],
  [true, "true"],
  ["iso8601", "iso8601"],
  [Symbol(), "Symbol()"],
  [2020, "2020"],
  [2n, "2n"],
];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
const timeZone = Temporal.TimeZone.from("UTC");

for (const [value, description] of values) {
  let called = 0;
  Temporal.Calendar.from = function(argument) {
    ++called;
    assert.sameValue(argument, "test");
    return value;
  };

  assert.throws(TypeError, () => instant.toZonedDateTime(timeZone, "test"), description);
  assert.sameValue(called, 1);
}
