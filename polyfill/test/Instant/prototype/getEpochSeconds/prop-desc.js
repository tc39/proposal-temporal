// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.getEpochSeconds,
  "function",
  "`typeof Instant.prototype.getEpochSeconds` is `function`"
);

verifyProperty(Instant.prototype, "getEpochSeconds", {
  writable: true,
  enumerable: false,
  configurable: true,
});
