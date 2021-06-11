// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.prototype.subtract
includes: [temporalHelpers.js]
features: [Temporal]
---*/

const instance = Temporal.PlainYearMonth.from({ year: 2000, month: 5 });
const result = instance.subtract("P3M");
TemporalHelpers.assertPlainYearMonth(result, 2000, 2, "M02");
