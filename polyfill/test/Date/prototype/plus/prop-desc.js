// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.plus
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.plus,
  "function",
  "`typeof Date.prototype.plus` is `function`"
);

verifyProperty(Temporal.Date.prototype, "plus", {
  writable: true,
  enumerable: false,
  configurable: true,
});
