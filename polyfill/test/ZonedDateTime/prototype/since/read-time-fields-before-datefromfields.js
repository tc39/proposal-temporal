// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.prototype.since
description: The time fields are read from the object before being passed to dateFromFields().
info: |
    sec-temporal.zoneddatetime.prototype.since step 3:
      3. Set _other_ to ? ToTemporalZonedDateTime(_other_).
    sec-temporal-totemporalzoneddatetime step 2.j:
      j. Let _result_ be ? InterpretTemporalDateTimeFields(_calendar_, _fields_, _options_).
    sec-temporal-interprettemporaldatetimefields steps 1–2:
      1. Let _timeResult_ be ? ToTemporalTimeRecord(_fields_).
      2. Let _temporalDate_ be ? DateFromFields(_calendar_, _fields_, _options_).
includes: [temporalHelpers.js]
---*/

const calendar = TemporalHelpers.calendarMakeInfinityTime();
const datetime = new Temporal.ZonedDateTime(1_000_000_000_987_654_321n, "UTC");
const duration = datetime.since({ year: 2001, month: 9, day: 9, timeZone: "UTC", calendar });

assert.sameValue(duration.years, 0, "years value");
assert.sameValue(duration.months, 0, "months value");
assert.sameValue(duration.weeks, 0, "weeks value");
assert.sameValue(duration.days, 0, "days value");
assert.sameValue(duration.hours, 1, "hours value");
assert.sameValue(duration.minutes, 46, "minutes value");
assert.sameValue(duration.seconds, 40, "seconds value");
assert.sameValue(duration.milliseconds, 987, "milliseconds value");
assert.sameValue(duration.microseconds, 654, "microseconds value");
assert.sameValue(duration.nanoseconds, 321, "nanoseconds value");
