// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.todatetime
---*/

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");

const invalidValues = [
  undefined,
  null,
  true,
  "2020-01-01T12:45:36",
  Symbol(),
  2020,
  2n,
  {},
  Temporal.DateTime,
  Temporal.DateTime.prototype,
];

for (const dateTime of invalidValues) {
  const timeZone = {
    getDateTimeFor(instantArg, calendar) {
      assert.sameValue(instantArg instanceof Temporal.Instant, true, "Instant");
      assert.sameValue(instantArg, instant);
      assert.sameValue(calendar instanceof Temporal.Calendar, true, "Calendar");
      assert.sameValue(calendar.id, "iso8601");
      return dateTime;
    },
  };

  assert.throws(TypeError, () => instant.toDateTime(timeZone));
}
