// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toplainyearmonth
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.toPlainYearMonth,
  "function",
  "`typeof Date.prototype.toPlainYearMonth` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "toPlainYearMonth", {
  writable: true,
  enumerable: false,
  configurable: true,
});
