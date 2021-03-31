// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.prototype.with
description: The object returned from mergeFields() is copied before being passed to monthDayFromFields().
info: |
    sec-temporal.plainyearmonth.prototype.with steps 13–15:
      13. Set _fields_ to ? CalendarMergeFields(_calendar_, _fields_, _partialYearMonth_).
      14. Set _fields_ to ? PrepareTemporalFields(_fields_, _fieldNames_, «»).
      15. Return ? YearMonthFromFields(_calendar_, _fields_, _options_).
includes: [compareArray.js, temporalHelpers.js]
---*/

const expected = [
  "get month",
  "valueOf month",
  "get monthCode",
  "toString monthCode",
  "get year",
  "valueOf year",
];

const calendar = TemporalHelpers.calendarMergeFieldsGetters();
const yearmonth = new Temporal.PlainYearMonth(2000, 5, calendar);
yearmonth.with({ year: 2004 });

assert.compareArray(calendar.mergeFieldsReturnOperations, expected, "getters called on mergeFields return");
