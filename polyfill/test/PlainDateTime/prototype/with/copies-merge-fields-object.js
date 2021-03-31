// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.with
description: The object returned from mergeFields() is copied before being passed to dateFromFields().
info: |
    sec-temporal.plaindatetime.prototype.with steps 13–15:
      13. Set _fields_ to ? CalendarMergeFields(_calendar_, _fields_, _partialDate_).
      14. Set _fields_ to ? PrepareTemporalFields(_fields_, _fieldNames_, «»).
      15. Let _result_ be ? InterpretTemporalDateTimeFields(_calendar_, _fields_, _options_).
    sec-temporal-interprettemporaldatetimefields step 2:
      2. Let _temporalDate_ be ? DateFromFields(_calendar_, _fields_, _options_).
includes: [compareArray.js, temporalHelpers.js]
---*/

const expected = [
  "get day",
  "valueOf day",
  "get hour",
  "valueOf hour",
  "get microsecond",
  "valueOf microsecond",
  "get millisecond",
  "valueOf millisecond",
  "get minute",
  "valueOf minute",
  "get month",
  "valueOf month",
  "get monthCode",
  "toString monthCode",
  "get nanosecond",
  "valueOf nanosecond",
  "get second",
  "valueOf second",
  "get year",
  "valueOf year",
];

const calendar = TemporalHelpers.calendarMergeFieldsGetters();
const datetime = new Temporal.PlainDateTime(2021, 3, 31, 12, 34, 56, 987, 654, 321, calendar);
datetime.with({ year: 2022 });

assert.compareArray(calendar.mergeFieldsReturnOperations, expected, "getters called on mergeFields return");
