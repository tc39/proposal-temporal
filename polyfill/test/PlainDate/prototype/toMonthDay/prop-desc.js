// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toplainmonthday
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.toPlainMonthDay,
  "function",
  "`typeof Date.prototype.toPlainMonthDay` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "toPlainMonthDay", {
  writable: true,
  enumerable: false,
  configurable: true,
});
