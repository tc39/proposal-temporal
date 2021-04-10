// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.from
description: Fast path for converting Temporal.PlainDate to Temporal.PlainDateTime by reading internal slots
info: |
    sec-temporal.plaindatetime.from step 3:
      3. Return ? ToTemporalDateTime(_item_, _options_).
    sec-temporal-totemporaldatetime step 2.b:
      b. If _item_ has an [[InitializedTemporalDate]] internal slot, then
        i. Return ? CreateTemporalDateTime(_item_.[[ISOYear]], _item_.[[ISOMonth]], _item_.[[ISODay]], 0, 0, 0, 0, 0, 0, _item_.[[Calendar]]).
includes: [compareArray.js, temporalHelpers.js]
---*/

TemporalHelpers.checkToTemporalPlainDateTimeFastPath((date, calendar) => {
  const result = Temporal.PlainDateTime.from(date);
  assert.sameValue(result.year, 2000, "year result");
  assert.sameValue(result.month, 5, "month result");
  assert.sameValue(result.day, 2, "day result");
  assert.sameValue(result.hour, 0, "midnight is assumed");
  assert.sameValue(result.minute, 0, "midnight is assumed");
  assert.sameValue(result.second, 0, "midnight is assumed");
  assert.sameValue(result.millisecond, 0, "midnight is assumed");
  assert.sameValue(result.microsecond, 0, "midnight is assumed");
  assert.sameValue(result.nanosecond, 0, "midnight is assumed");
  assert.sameValue(result.calendar, calendar, "calendar result");
});
