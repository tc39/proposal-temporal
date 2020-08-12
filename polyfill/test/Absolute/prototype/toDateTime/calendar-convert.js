// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.todatetime
---*/

const values = [
  [null, "null"],
  [true, "true"],
  ["iso8601", "iso8601"],
  [2020, "2020"],
  [2n, "2"],
];

const absolute = Temporal.Absolute.from("1975-02-02T14:25:36.123456789Z");

const calendar = Temporal.Calendar.from("iso8601");
for (const [input, output] of values) {
  Temporal.Calendar.from = function(argument) {
    assert.sameValue(argument, output);
    return calendar;
  };

  absolute.toDateTime("UTC", input);
}

Temporal.Calendar.from = function() {
  throw new Test262Error("Should not call Calendar.from");
};

assert.throws(TypeError, () => absolute.toDateTime("UTC", Symbol()));
