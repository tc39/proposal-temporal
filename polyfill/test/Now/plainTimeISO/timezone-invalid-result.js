// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaintimeiso
features: [Temporal]
---*/

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
    getPlainDateTimeFor(instant, calendar) {
      assert.sameValue(instant instanceof Temporal.Instant, true, "Instant");
      assert.sameValue(calendar instanceof Temporal.Calendar, true, "Calendar");
      assert.sameValue(calendar.id, "iso8601");
      return dateTime;
    },
  };

  assert.throws(TypeError, () => Temporal.Now.plainTimeISO(timeZone));
}
