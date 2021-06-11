// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration
features: [Temporal]
---*/

const years = 1;

const explicit = new Temporal.Duration(years, undefined);
assert.sameValue(explicit.months, 0, "months default argument");

const implicit = new Temporal.Duration(years);
assert.sameValue(implicit.months, 0, "months default argument");
