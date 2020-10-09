// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.add
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.Date.prototype.add,
  "function",
  "`typeof Date.prototype.add` is `function`"
);

verifyProperty(Temporal.Date.prototype, "add", {
  writable: true,
  enumerable: false,
  configurable: true,
});
