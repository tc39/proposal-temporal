// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime
---*/

const dateTimeArgs = [2020, 12, 24, 12, 34, 56, 123, 456, 789];
const values = [
  [null, "null"],
  [true, "true"],
  ["iso8601", "iso8601"],
  [2020, "2020"],
  [2n, "2"],
];

const calendar = Temporal.Calendar.from("iso8601");
for (const [input, output] of values) {
  let called = 0;
  Temporal.Calendar.from = function(argument) {
    ++called;
    assert.sameValue(argument, output);
    return calendar;
  };

  const dateTime = new Temporal.PlainDateTime(...dateTimeArgs, input);
  assert.sameValue(called, 1);
  assert.sameValue(dateTime.calendar, calendar);
}

Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    throw new Test262Error("Should not get Calendar.from");
  },
});

assert.throws(TypeError, () => new Temporal.PlainDateTime(...dateTimeArgs, Symbol()));
