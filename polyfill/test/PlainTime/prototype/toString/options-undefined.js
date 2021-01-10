// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.tostring
---*/

const time = new Temporal.PlainTime(12, 34, 56, 987, 650);

const explicit = time.toString(undefined);
assert.sameValue(explicit, "12:34:56.98765", "default precision is auto and rounding is trunc");

const implicit = time.toString();
assert.sameValue(implicit, "12:34:56.98765", "default precision is auto and rounding is trunc");
