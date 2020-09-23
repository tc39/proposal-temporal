// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.toJSON,
  "function",
  "`typeof Instant.prototype.toJSON` is `function`"
);

verifyProperty(Instant.prototype, "toJSON", {
  writable: true,
  enumerable: false,
  configurable: true,
});
