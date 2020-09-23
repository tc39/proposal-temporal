// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.minus,
  "function",
  "`typeof Instant.prototype.minus` is `function`"
);

verifyProperty(Instant.prototype, "minus", {
  writable: true,
  enumerable: false,
  configurable: true,
});
