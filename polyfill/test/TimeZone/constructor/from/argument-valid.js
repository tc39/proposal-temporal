// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.timezone.from
---*/

class CustomTimeZone extends Temporal.TimeZone {}

const valids = [
  ["Africa/Bissau"],
  ["America/Belem"],
  ["UTC"],
  ["etc/gmt", "UTC"],
];

const thisValues = [
  [Temporal.TimeZone],
  [CustomTimeZone],
  [function(id) { return new Temporal.TimeZone(id); }, Temporal.TimeZone],
];

for (const [thisValue, constructor = thisValue] of thisValues) {
  for (const [valid, canonical = valid] of valids) {
    const result = Temporal.TimeZone.from.call(thisValue, valid);
    assert.sameValue(result.constructor, constructor);
    assert.sameValue(result.name, canonical);
    assert.sameValue(result.toString(), canonical);
  }
}
