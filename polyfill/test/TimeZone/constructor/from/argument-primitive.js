// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.from
features: [Temporal]
---*/

class CustomTimeZone extends Temporal.TimeZone {}

const primitives = [
  undefined,
  null,
  true,
  "string",
  7,
  4.2,
  12n,
];

const thisValues = [
  Temporal.TimeZone,
  CustomTimeZone,
  {},
  null,
  undefined,
  7,
];

for (const thisValue of thisValues) {
  for (const primitive of primitives) {
    assert.throws(RangeError, () => Temporal.TimeZone.from.call(thisValue, primitive));
  }

  const symbol = Symbol();
  assert.throws(TypeError, () => Temporal.TimeZone.from.call(thisValue, symbol));
}
