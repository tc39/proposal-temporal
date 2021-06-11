// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime
features: [Temporal]
---*/

const dateTimeArgs = [2020, 12, 24, 12, 34, 56, 123, 456, 789];
const calendar = function() {};

Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    throw new Test262Error("Should not get Calendar.from");
  },
});

const dateTime = new Temporal.PlainDateTime(...dateTimeArgs, calendar);
assert.sameValue(dateTime.calendar, calendar);
