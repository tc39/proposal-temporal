// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.todatetime
---*/

const absolute = Temporal.Absolute.from("1975-02-02T14:25:36.123456789Z");

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
    getDateTimeFor(absoluteArg) {
      assert.sameValue(absoluteArg instanceof Temporal.Absolute, true, "Absolute");
      assert.sameValue(absoluteArg, absolute);
      return dateTime;
    },
  };

  assert.throws(TypeError, () => absolute.toDateTime(timeZone));
}
