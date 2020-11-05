// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { PlainYearMonth } = Temporal;
assert.sameValue(
  typeof PlainYearMonth.prototype.equals,
  "function",
  "`typeof YearMonth.prototype.equals` is `function`"
);

verifyProperty(PlainYearMonth.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
