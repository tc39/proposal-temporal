// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Time.prototype.getFields,
  "function",
  "`typeof Time.prototype.getFields` is `function`"
);

verifyProperty(Temporal.Time.prototype, "getFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
