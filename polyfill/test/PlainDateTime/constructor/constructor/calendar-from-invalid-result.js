// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime
---*/

const values = [
  [undefined, "undefined"],
  [null, "null"],
  [true, "true"],
  ["iso8601", "iso8601"],
  [Symbol(), "Symbol()"],
  [2020, "2020"],
  [2n, "2n"],
];

const dateTimeArgs = [2020, 12, 24, 12, 34, 56, 123, 456, 789];

for (const [value, description] of values) {
  let called = 0;
  Temporal.Calendar.from = function(argument) {
    ++called;
    assert.sameValue(argument, "test");
    return value;
  };

  assert.throws(TypeError, () => new Temporal.PlainDateTime(...dateTimeArgs, "test"), description);
  assert.sameValue(called, 1);
}
