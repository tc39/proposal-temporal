// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.subtract
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.subtract,
  "function",
  "`typeof Date.prototype.subtract` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "subtract", {
  writable: true,
  enumerable: false,
  configurable: true,
});
