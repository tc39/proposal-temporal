// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.with
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.with,
  "function",
  "`typeof Date.prototype.with` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "with", {
  writable: true,
  enumerable: false,
  configurable: true,
});
