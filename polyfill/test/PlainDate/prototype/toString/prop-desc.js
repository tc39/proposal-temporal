// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.tostring
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.toString,
  "function",
  "`typeof Date.prototype.toString` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "toString", {
  writable: true,
  enumerable: false,
  configurable: true,
});
