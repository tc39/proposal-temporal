// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.prototype.subtract
includes: [temporalHelpers.js]
features: [Temporal]
---*/

TemporalHelpers.checkSubclassingIgnored(
  Temporal.PlainYearMonth,
  [2000, 5],
  "subtract",
  [{ months: 1 }],
  (result) => TemporalHelpers.assertPlainYearMonth(result, 2000, 4, "M04"),
);
