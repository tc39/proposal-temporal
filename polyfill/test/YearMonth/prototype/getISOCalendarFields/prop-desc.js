// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.YearMonth.prototype.getISOCalendarFields,
  "function",
  "`typeof YearMonth.prototype.getISOCalendarFields` is `function`"
);

verifyProperty(Temporal.YearMonth.prototype, "getISOCalendarFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
