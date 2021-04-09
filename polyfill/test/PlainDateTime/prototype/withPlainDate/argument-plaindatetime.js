// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.withplaindate
description: Fast path for converting Temporal.PlainDateTime to Temporal.PlainDate by reading internal slots
info: |
    sec-temporal.plaindatetime.prototype.withplaindate step 3:
      3. Let _plainDate_ be ? ToTemporalDate(_plainDateLike_).
    sec-temporal-totemporaldate step 2.b:
      b. If _item_ has an [[InitializedTemporalDateTime]] internal slot, then
        i. Return ! CreateTemporalDate(_item_.[[ISOYear]], _item_.[[ISOMonth]], _item_.[[ISODay]], _item_.[[Calendar]]).
includes: [compareArray.js, temporalHelpers.js]
---*/

TemporalHelpers.checkPlainDateTimeConversionFastPath((datetime) => {
  const receiver = new Temporal.PlainDateTime(2001, 9, 9, 6, 54, 32, 123, 456, 789);
  const result = receiver.withPlainDate(datetime);
  assert.sameValue(result.year, 2000, "year result");
  assert.sameValue(result.month, 5, "month result");
  assert.sameValue(result.day, 2, "day result");
  assert.sameValue(result.hour, 6, "hour result");
  assert.sameValue(result.minute, 54, "minute result");
  assert.sameValue(result.second, 32, "second result");
  assert.sameValue(result.millisecond, 123, "millisecond result");
  assert.sameValue(result.microsecond, 456, "microsecond result");
  assert.sameValue(result.nanosecond, 789, "nanosecond result");
});
