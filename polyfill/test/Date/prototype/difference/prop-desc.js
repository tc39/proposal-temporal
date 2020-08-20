// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.difference
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.difference,
  "function",
  "`typeof Date.prototype.difference` is `function`"
);

verifyProperty(Temporal.Date.prototype, "difference", {
  writable: true,
  enumerable: false,
  configurable: true,
});
