// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
includes: [temporalHelpers.js]
---*/

TemporalHelpers.checkSubclassingIgnoredStatic(
  Temporal.Duration,
  "from",
  ["P1Y2M3W4DT5H6M7.987654321S"],
  (result) => {
    assert.sameValue(result.years, 1, "years result");
    assert.sameValue(result.months, 2, "months result");
    assert.sameValue(result.weeks, 3, "weeks result");
    assert.sameValue(result.days, 4, "days result");
    assert.sameValue(result.hours, 5, "hours result");
    assert.sameValue(result.minutes, 6, "minutes result");
    assert.sameValue(result.seconds, 7, "seconds result");
    assert.sameValue(result.milliseconds, 987, "milliseconds result");
    assert.sameValue(result.microseconds, 654, "microseconds result");
    assert.sameValue(result.nanoseconds, 321, "nanoseconds result");
  },
);
