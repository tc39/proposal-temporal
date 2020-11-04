// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.toplaindatetime
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.toPlainDateTime,
  "function",
  "`typeof Date.prototype.toPlainDateTime` is `function`"
);

verifyProperty(Temporal.Date.prototype, "toPlainDateTime", {
  writable: true,
  enumerable: false,
  configurable: true,
});
