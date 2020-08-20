// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.minus
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.minus,
  "function",
  "`typeof Date.prototype.minus` is `function`"
);

verifyProperty(Temporal.Date.prototype, "minus", {
  writable: true,
  enumerable: false,
  configurable: true,
});
