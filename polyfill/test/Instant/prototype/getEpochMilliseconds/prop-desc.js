// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.getEpochMilliseconds,
  "function",
  "`typeof Instant.prototype.getEpochMilliseconds` is `function`"
);

verifyProperty(Instant.prototype, "getEpochMilliseconds", {
  writable: true,
  enumerable: false,
  configurable: true,
});
