// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.toLocaleString,
  "function",
  "`typeof Instant.prototype.toLocaleString` is `function`"
);

verifyProperty(Instant.prototype, "toLocaleString", {
  writable: true,
  enumerable: false,
  configurable: true,
});
