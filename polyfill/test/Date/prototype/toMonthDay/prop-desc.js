// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.tomonthday
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.toMonthDay,
  "function",
  "`typeof Date.prototype.toMonthDay` is `function`"
);

verifyProperty(Temporal.Date.prototype, "toMonthDay", {
  writable: true,
  enumerable: false,
  configurable: true,
});
