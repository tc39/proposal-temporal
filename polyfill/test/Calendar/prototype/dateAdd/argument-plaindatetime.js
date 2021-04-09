// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.calendar.prototype.dateadd
description: Fast path for converting Temporal.PlainDateTime to Temporal.PlainDate by reading internal slots
info: |
    sec-temporal.calendar.prototype.dateadd step 4:
      4. Set _date_ to ? ToTemporalDate(_date_).
    sec-temporal-totemporaldate step 2.b:
      b. If _item_ has an [[InitializedTemporalDateTime]] internal slot, then
        i. Return ! CreateTemporalDate(_item_.[[ISOYear]], _item_.[[ISOMonth]], _item_.[[ISODay]], _item_.[[Calendar]]).
includes: [compareArray.js, temporalHelpers.js]
---*/

TemporalHelpers.checkPlainDateTimeConversionFastPath((datetime) => {
  const calendar = new Temporal.Calendar("iso8601");
  const duration = new Temporal.Duration(0, 1);
  const result = calendar.dateAdd(datetime, duration);
  assert.sameValue(result.year, 2000, "year result");
  assert.sameValue(result.month, 6, "month result");
  assert.sameValue(result.day, 2, "day result");
  assert.sameValue(result.hour, undefined, "instance of PlainDate returned, not PlainDateTime");
});
