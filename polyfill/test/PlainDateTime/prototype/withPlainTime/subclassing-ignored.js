// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.withplaintime
includes: [temporalHelpers.js]
---*/

TemporalHelpers.checkSubclassingIgnored(
  Temporal.PlainDateTime,
  [2000, 5, 2, 12, 34, 56, 987, 654, 321],
  "withPlainTime",
  ["05:43:21.123456789"],
  (result) => {
    assert.sameValue(result.year, 2000, "year result");
    assert.sameValue(result.month, 5, "month result");
    assert.sameValue(result.day, 2, "day result");
    assert.sameValue(result.hour, 5, "hour result");
    assert.sameValue(result.minute, 43, "minute result");
    assert.sameValue(result.second, 21, "second result");
    assert.sameValue(result.millisecond, 123, "millisecond result");
    assert.sameValue(result.microsecond, 456, "microsecond result");
    assert.sameValue(result.nanosecond, 789, "nanosecond result");
  },
);
