// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime
features: [Temporal]
---*/

const explicit = new Temporal.PlainTime(undefined);
assert.sameValue(explicit.hour, 0, "hour default argument");

const implicit = new Temporal.PlainTime();
assert.sameValue(implicit.hour, 0, "hour default argument");
