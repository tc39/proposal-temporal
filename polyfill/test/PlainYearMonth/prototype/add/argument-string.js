// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.yearmonth.prototype.add
---*/

const instance = Temporal.PlainYearMonth.from({ year: 2000, month: 5 });
const result = instance.add("P3M");
assert.sameValue(result.year, 2000, "year result");
assert.sameValue(result.month, 8, "month result");
