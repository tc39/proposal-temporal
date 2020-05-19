// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.equals,
  "function",
  "`typeof Date.prototype.equals` is `function`"
);

verifyProperty(Temporal.Date.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
