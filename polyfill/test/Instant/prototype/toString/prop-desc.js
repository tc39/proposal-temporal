// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.toString,
  "function",
  "`typeof Instant.prototype.toString` is `function`"
);

verifyProperty(Instant.prototype, "toString", {
  writable: true,
  enumerable: false,
  configurable: true,
});
