// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.YearMonth.prototype.getISOFields,
  "function",
  "`typeof YearMonth.prototype.getISOFields` is `function`"
);

verifyProperty(Temporal.YearMonth.prototype, "getISOFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
