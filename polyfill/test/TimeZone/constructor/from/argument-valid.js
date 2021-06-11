// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.from
features: [Temporal]
---*/

const valids = [
  ["Africa/Bissau"],
  ["America/Belem"],
  ["UTC"],
  ["etc/gmt", "UTC"],
];

for (const [valid, canonical = valid] of valids) {
  const result = Temporal.TimeZone.from(valid);
  assert.sameValue(Object.getPrototypeOf(result), Temporal.TimeZone.prototype);
  assert.sameValue(result.id, canonical);
  assert.sameValue(result.toString(), canonical);
}
