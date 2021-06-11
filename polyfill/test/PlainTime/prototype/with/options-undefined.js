// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.with
features: [Temporal]
---*/

const time = new Temporal.PlainTime(12, 34, 56, 987, 654, 321);
const fields = { minute: 60 };

const explicit = time.with(fields, undefined);
assert.sameValue(explicit.hour, 12, "default overflow is constrain");
assert.sameValue(explicit.minute, 59, "default overflow is constrain");

const implicit = time.with(fields, undefined);
assert.sameValue(implicit.hour, 12, "default overflow is constrain");
assert.sameValue(implicit.minute, 59, "default overflow is constrain");
