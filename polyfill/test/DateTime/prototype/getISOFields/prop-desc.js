// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.DateTime.prototype.getISOFields,
  "function",
  "`typeof DateTime.prototype.getISOFields` is `function`"
);

verifyProperty(Temporal.DateTime.prototype, "getISOFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
