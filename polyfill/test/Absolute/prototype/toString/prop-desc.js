// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const {Absolute} = Temporal;
assert.sameValue(
  typeof Absolute.prototype.toString,
  "function",
  "`typeof Absolute.prototype.toString` is `function`"
);

verifyProperty(Absolute.prototype, "toString", {
  writable: true,
  enumerable: false,
  configurable: true,
});
