// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.prototype.toplaindatetime
features: [Temporal]
---*/

const calendar = Temporal.Calendar.from("iso8601");

const invalidValues = [
  undefined,
  null,
  true,
  "2020-01-01T12:45:36",
  Symbol(),
  2020,
  2n,
  {},
  Temporal.PlainDateTime,
  Temporal.PlainDateTime.prototype,
];

for (const dateTime of invalidValues) {
  const timeZone = {
    getPlainDateTimeFor(instantArg, calendarArg) {
      assert.sameValue(instantArg instanceof Temporal.Instant, true, "Instant");
      assert.sameValue(calendarArg instanceof Temporal.Calendar, true, "Calendar");
      assert.sameValue(calendarArg, calendar);
      return dateTime;
    },
  };

  const zdt = new Temporal.ZonedDateTime(160583136123456789n, timeZone, calendar);
  assert.throws(TypeError, () => zdt.toPlainDateTime(timeZone, calendar));
}
