// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.equals
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.equals,
  "function",
  "`typeof Date.prototype.equals` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
