// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.difference,
  "function",
  "`typeof Instant.prototype.difference` is `function`"
);

verifyProperty(Instant.prototype, "difference", {
  writable: true,
  enumerable: false,
  configurable: true,
});
