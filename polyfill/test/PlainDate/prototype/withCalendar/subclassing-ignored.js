// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.withcalendar
includes: [temporalHelpers.js]
---*/

const customCalendar = {
  year() { return 1900; },
  month() { return 2; },
  day() { return 5; },
  toString() { return "custom-calendar"; },
};

TemporalHelpers.checkSubclassingIgnored(
  Temporal.PlainDate,
  [2000, 5, 2],
  "withCalendar",
  [customCalendar],
  (result) => {
    assert.sameValue(result.year, 1900, "year result");
    assert.sameValue(result.month, 2, "month result");
    assert.sameValue(result.day, 5, "day result");
    assert.sameValue(result.calendar, customCalendar, "calendar result");
  },
);
