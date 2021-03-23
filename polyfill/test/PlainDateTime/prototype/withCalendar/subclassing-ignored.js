// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.withcalendar
includes: [temporalHelpers.js]
---*/

const customCalendar = {
  year() { return 1900; },
  month() { return 2; },
  day() { return 5; },
  toString() { return "custom-calendar"; },
};

TemporalHelpers.checkSubclassingIgnored(
  Temporal.PlainDateTime,
  [2000, 5, 2, 12, 34, 56, 987, 654, 321],
  "withCalendar",
  [customCalendar],
  (result) => {
    assert.sameValue(result.year, 1900, "year result");
    assert.sameValue(result.month, 2, "month result");
    assert.sameValue(result.day, 5, "day result");
    assert.sameValue(result.hour, 12, "hour result");
    assert.sameValue(result.minute, 34, "minute result");
    assert.sameValue(result.second, 56, "second result");
    assert.sameValue(result.millisecond, 987, "millisecond result");
    assert.sameValue(result.microsecond, 654, "microsecond result");
    assert.sameValue(result.nanosecond, 321, "nanosecond result");
    assert.sameValue(result.calendar, customCalendar, "calendar result");
  },
);
