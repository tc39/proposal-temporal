// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.tolocalestring
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.toLocaleString,
  "function",
  "`typeof Date.prototype.toLocaleString` is `function`"
);

verifyProperty(Temporal.Date.prototype, "toLocaleString", {
  writable: true,
  enumerable: false,
  configurable: true,
});
