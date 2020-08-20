// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toyearmonth
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.toYearMonth,
  "function",
  "`typeof Date.prototype.toYearMonth` is `function`"
);

verifyProperty(Temporal.Date.prototype, "toYearMonth", {
  writable: true,
  enumerable: false,
  configurable: true,
});
