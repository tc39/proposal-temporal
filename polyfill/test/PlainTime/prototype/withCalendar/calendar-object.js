// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.withcalendar
---*/

Temporal.Calendar.from = function() {
  throw new Test262Error("Should not call Calendar.from");
};
const calendar = {};
const instance = Temporal.PlainTime.from("12:34:56.987654321");
const result = instance.withCalendar(calendar);
assert.sameValue(result.calendar, calendar, "calendar result");
