// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.with
description: The object returned from mergeFields() is copied before being passed to dateFromFields().
info: |
    sec-temporal.plaindate.prototype.with steps 13–15:
      13. Set _fields_ to ? CalendarMergeFields(_calendar_, _fields_, _partialDate_).
      14. Set _fields_ to ? PrepareTemporalFields(_fields_, _fieldNames_, «»).
      15. Return ? DateFromFields(_calendar_, _fields_, _options_).
includes: [compareArray.js, temporalHelpers.js]
---*/

const expected = [
  "get day",
  "valueOf day",
  "get month",
  "valueOf month",
  "get monthCode",
  "toString monthCode",
  "get year",
  "valueOf year",
];

const calendar = TemporalHelpers.calendarMergeFieldsGetters();
const date = new Temporal.PlainDate(2021, 3, 31, calendar);
date.with({ year: 2022 });

assert.compareArray(calendar.mergeFieldsReturnOperations, expected, "getters called on mergeFields return");
