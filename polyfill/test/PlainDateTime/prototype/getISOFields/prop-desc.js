// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDateTime.prototype.getISOFields,
  "function",
  "`typeof DateTime.prototype.getISOFields` is `function`"
);

verifyProperty(Temporal.PlainDateTime.prototype, "getISOFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
