// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { YearMonth } = Temporal;
assert.sameValue(
  typeof YearMonth.prototype.equals,
  "function",
  "`typeof YearMonth.prototype.equals` is `function`"
);

verifyProperty(YearMonth.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
