// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.with
info: |
    sec-temporal.plaindatetime.prototype.with step 9:
      9. Let _fieldNames_ be ? CalendarFields(_calendar_, « *"day"*, *"hour"*, *"microsecond"*, *"millisecond"*, *"minute"*, *"month"*, *"monthCode"*, *"nanosecond"*, *"second"*, *"year"* »).
    sec-temporal-calendarfields step 4:
      4. Let _result_ be ? IterableToList(_fieldsArray_).
includes: [compareArray.js, temporalHelpers.js]
---*/

const expected = [
  "day",
  "hour",
  "microsecond",
  "millisecond",
  "minute",
  "month",
  "monthCode",
  "nanosecond",
  "second",
  "year",
];

const calendar = TemporalHelpers.calendarFieldsIterable();
const datetime = new Temporal.PlainDateTime(2000, 5, 2, 12, 34, 56, 987, 654, 321, calendar);
datetime.with({ year: 2005 });

assert.sameValue(calendar.fieldsCallCount, 1, "fields() method called once");
assert.compareArray(calendar.fieldsCalledWith[0], expected, "fields() method called with correct args");
assert(calendar.iteratorExhausted[0], "iterated through the whole iterable");
