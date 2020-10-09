// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.subtract
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.subtract,
  "function",
  "`typeof Date.prototype.subtract` is `function`"
);

verifyProperty(Temporal.Date.prototype, "subtract", {
  writable: true,
  enumerable: false,
  configurable: true,
});
