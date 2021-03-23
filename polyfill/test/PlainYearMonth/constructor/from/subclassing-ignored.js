// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.from
includes: [temporalHelpers.js]
---*/

TemporalHelpers.checkSubclassingIgnoredStatic(
  Temporal.PlainYearMonth,
  "from",
  ["2000-05"],
  (result) => {
    assert.sameValue(result.year, 2000, "year result");
    assert.sameValue(result.month, 5, "month result");
  },
);
