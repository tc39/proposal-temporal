// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { MonthDay } = Temporal;
assert.sameValue(
  typeof MonthDay.prototype.equals,
  "function",
  "`typeof MonthDay.prototype.equals` is `function`"
);

verifyProperty(MonthDay.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
