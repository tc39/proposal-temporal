// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { DateTime } = Temporal;
assert.sameValue(
  typeof DateTime.prototype.equals,
  "function",
  "`typeof DateTime.prototype.equals` is `function`"
);

verifyProperty(DateTime.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
