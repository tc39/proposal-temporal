// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.toZonedDateTime,
  "function",
  "`typeof Instant.prototype.toZonedDateTime` is `function`"
);

verifyProperty(Instant.prototype, "toZonedDateTime", {
  writable: true,
  enumerable: false,
  configurable: true,
});
