// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.since
description: The time fields are read from the object before being passed to dateFromFields().
info: |
    sec-temporal.plaindatetime.prototype.since step 3:
      3. Set _other_ to ? ToTemporalDateTime(_other_).
    sec-temporal-totemporaldatetime step 2.e:
      e. Let _result_ be ? InterpretTemporalDateTimeFields(_calendar_, _fields_, _options_).
    sec-temporal-interprettemporaldatetimefields steps 1–2:
      1. Let _timeResult_ be ? ToTemporalTimeRecord(_fields_).
      2. Let _temporalDate_ be ? DateFromFields(_calendar_, _fields_, _options_).
includes: [temporalHelpers.js]
---*/

const calendar = TemporalHelpers.calendarMakeInfinityTime();
const datetime = new Temporal.PlainDateTime(2021, 3, 31, 12, 34, 56, 987, 654, 321);
const duration = datetime.since({ year: 2021, month: 3, day: 31, calendar });

assert.sameValue(duration.years, 0, "years value");
assert.sameValue(duration.months, 0, "months value");
assert.sameValue(duration.weeks, 0, "weeks value");
assert.sameValue(duration.days, 0, "days value");
assert.sameValue(duration.hours, 12, "hours value");
assert.sameValue(duration.minutes, 34, "minutes value");
assert.sameValue(duration.seconds, 56, "seconds value");
assert.sameValue(duration.milliseconds, 987, "milliseconds value");
assert.sameValue(duration.microseconds, 654, "microseconds value");
assert.sameValue(duration.nanoseconds, 321, "nanoseconds value");
