// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime
features: [Temporal]
---*/

const args = [2000, 5, 2, 12, 34];

const explicit = new Temporal.PlainDateTime(...args, undefined);
assert.sameValue(explicit.second, 0, "second default argument");

const implicit = new Temporal.PlainDateTime(...args);
assert.sameValue(implicit.second, 0, "second default argument");
