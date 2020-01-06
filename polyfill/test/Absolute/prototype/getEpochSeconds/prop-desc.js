// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const {Absolute} = Temporal;
assert.sameValue(
  typeof Absolute.prototype.getEpochSeconds,
  "function",
  "`typeof Absolute.prototype.getEpochSeconds` is `function`"
);

verifyProperty(Absolute.prototype, "getEpochSeconds", {
  writable: true,
  enumerable: false,
  configurable: true,
});
