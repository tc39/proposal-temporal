// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime
---*/

const hour = 12;

const explicit = new Temporal.PlainTime(hour, undefined);
assert.sameValue(explicit.minute, 0, "minute default argument");

const implicit = new Temporal.PlainTime(hour);
assert.sameValue(implicit.minute, 0, "minute default argument");
