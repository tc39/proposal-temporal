// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.datetime
---*/

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

  const dateTime = Temporal.now.dateTime("UTC", input);
  assert.sameValue(called, 1);
  assert.sameValue(dateTime.calendar, calendar);
}

Temporal.Calendar.from = function() {
  throw new Test262Error("Should not call Calendar.from");
};

assert.throws(TypeError, () => Temporal.now.dateTime("UTC", Symbol()));
