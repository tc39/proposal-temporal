// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getplaindatetimefor
description: Fast path for converting Temporal.ZonedDateTime to Temporal.Instant
info: |
    sec-temporal.timezone.prototype.getplaindatetimefor step 2:
      2. Set _instant_ to ? ToTemporalInstant(_instant_).
    sec-temporal-totemporalinstant step 1.b:
      b. If _item_ has an [[InitializedTemporalZonedDateTime]] internal slot, then
        i. Return ! CreateTemporalInstant(_item_.[[Nanoseconds]]).
includes: [compareArray.js, temporalHelpers.js]
---*/

TemporalHelpers.checkToTemporalInstantFastPath((datetime) => {
  const timeZone = Temporal.TimeZone.from("UTC");
  const result = timeZone.getPlainDateTimeFor(datetime);
  assert.sameValue(result.year, 2001, "year result");
  assert.sameValue(result.month, 9, "month result");
  assert.sameValue(result.day, 9, "day result");
  assert.sameValue(result.hour, 1, "hour result");
  assert.sameValue(result.minute, 46, "minute result");
  assert.sameValue(result.second, 40, "second result");
  assert.sameValue(result.millisecond, 987, "millisecond result");
  assert.sameValue(result.microsecond, 654, "microsecond result");
  assert.sameValue(result.nanosecond, 321, "nanosecond result");
});
