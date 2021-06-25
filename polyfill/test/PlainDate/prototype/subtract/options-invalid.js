// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.subtract
features: [Temporal]
---*/

const plainDate = new Temporal.PlainDate(2000, 3, 31);
const duration = { months: 1 };

const values = [null, true, "hello", Symbol("foo"), 1, 1n];
for (const badOptions of values) {
  assert.throws(TypeError, () => plainDate.subtract(duration, badOptions));
}
