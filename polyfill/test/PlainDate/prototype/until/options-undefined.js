// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.until
features: [Temporal]
---*/

const earlier = new Temporal.PlainDate(2000, 5, 2);
const later = new Temporal.PlainDate(2000, 6, 12);

const explicit = earlier.until(later, undefined);
assert.sameValue(explicit.years, 0, "default smallest/largest unit is days");
assert.sameValue(explicit.months, 0, "default smallest/largest unit is days");
assert.sameValue(explicit.weeks, 0, "default smallest/largest unit is days");
assert.sameValue(explicit.days, 41, "default rounding is none");

const implicit = earlier.until(later);
assert.sameValue(implicit.years, 0, "default smallest/largest unit is days");
assert.sameValue(implicit.months, 0, "default smallest/largest unit is days");
assert.sameValue(implicit.weeks, 0, "default smallest/largest unit is days");
assert.sameValue(implicit.days, 41, "default rounding is none");
