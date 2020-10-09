// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.add,
  "function",
  "`typeof Instant.prototype.add` is `function`"
);

verifyProperty(Instant.prototype, "add", {
  writable: true,
  enumerable: false,
  configurable: true,
});
