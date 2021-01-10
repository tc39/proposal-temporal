// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.with
---*/

const monthday = new Temporal.PlainMonthDay(2, 2);
const fields = { month: 13 };

const explicit = monthday.with(fields, undefined);
assert.sameValue(explicit.month, 12, "default overflow is constrain");

const implicit = monthday.with(fields);
assert.sameValue(implicit.month, 12, "default overflow is constrain");
