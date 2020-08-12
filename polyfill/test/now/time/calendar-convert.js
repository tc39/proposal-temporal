// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.time
---*/

const values = [
  null,
  true,
  "iso8601",
  Symbol(),
  2020,
  2n,
  {},
];

const dateTime = Temporal.DateTime.from("1963-07-02T12:34:56.987654321");

const timeZone = {
  getDateTimeFor(absolute, calendarArg) {
    assert.sameValue(absolute instanceof Temporal.Absolute, true, "Absolute");
    assert.sameValue(calendarArg instanceof Temporal.Calendar, true, "Calendar");
    assert.sameValue(calendarArg.toString(), "iso8601");
    return dateTime;
  },
};

for (const input of values) {
  Temporal.Calendar.from = function() {
    throw new Test262Error("Should not call Calendar.from");
  };

  Temporal.now.time(timeZone, input);
}
