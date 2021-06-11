// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime
features: [Temporal]
---*/

const args = [12, 34, 56, 123];

const explicit = new Temporal.PlainTime(...args, undefined);
assert.sameValue(explicit.microsecond, 0, "microsecond default argument");

const implicit = new Temporal.PlainTime(...args);
assert.sameValue(implicit.microsecond, 0, "microsecond default argument");
