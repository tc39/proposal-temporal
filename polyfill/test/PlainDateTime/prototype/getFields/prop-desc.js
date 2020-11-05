// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDateTime.prototype.getFields,
  "function",
  "`typeof DateTime.prototype.getFields` is `function`"
);

verifyProperty(Temporal.PlainDateTime.prototype, "getFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
