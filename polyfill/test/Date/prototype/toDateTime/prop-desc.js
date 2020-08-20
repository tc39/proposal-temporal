// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.todatetime
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.toDateTime,
  "function",
  "`typeof Date.prototype.toDateTime` is `function`"
);

verifyProperty(Temporal.Date.prototype, "toDateTime", {
  writable: true,
  enumerable: false,
  configurable: true,
});
