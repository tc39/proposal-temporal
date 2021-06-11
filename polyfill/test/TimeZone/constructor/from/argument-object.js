// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.from
features: [Temporal]
---*/

class CustomTimeZone extends Temporal.TimeZone {}

const objects = [
  new Temporal.TimeZone("Europe/Madrid"),
  new CustomTimeZone("Africa/Accra"),
  {},
  { getPlainDateTimeFor: null },
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
  for (const object of objects) {
    const result = Temporal.TimeZone.from.call(thisValue, object);
    assert.sameValue(result, object);
  }
}
