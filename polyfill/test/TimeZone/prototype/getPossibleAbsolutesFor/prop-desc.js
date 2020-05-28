// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { TimeZone } = Temporal;
assert.sameValue(
  typeof TimeZone.prototype.getPossibleAbsolutesFor,
  "function",
  "`typeof TimeZone.prototype.getPossibleAbsolutesFor` is `function`"
);

verifyProperty(TimeZone.prototype, "getPossibleAbsolutesFor", {
  writable: true,
  enumerable: false,
  configurable: true,
});
