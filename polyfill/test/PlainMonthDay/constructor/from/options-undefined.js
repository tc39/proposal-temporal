// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.from
---*/

const fields = { month: 2, day: 31 };

const explicit = Temporal.PlainMonthDay.from(fields, undefined);
assert.sameValue(explicit.month, 2, "default overflow is constrain");
assert.sameValue(explicit.day, 29, "default overflow is constrain");

const implicit = Temporal.PlainMonthDay.from(fields);
assert.sameValue(implicit.month, 2, "default overflow is constrain");
assert.sameValue(implicit.day, 29, "default overflow is constrain");
