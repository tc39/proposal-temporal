// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.MonthDay.prototype.getISOCalendarFields,
  "function",
  "`typeof MonthDay.prototype.getISOCalendarFields` is `function`"
);

verifyProperty(Temporal.MonthDay.prototype, "getISOCalendarFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
