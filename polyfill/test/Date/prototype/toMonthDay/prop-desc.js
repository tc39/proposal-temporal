// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toplainmonthday
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.toPlainMonthDay,
  "function",
  "`typeof Date.prototype.toPlainMonthDay` is `function`"
);

verifyProperty(Temporal.Date.prototype, "toPlainMonthDay", {
  writable: true,
  enumerable: false,
  configurable: true,
});
