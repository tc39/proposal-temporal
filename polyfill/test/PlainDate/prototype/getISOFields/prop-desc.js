// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.getisofields
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.getISOFields,
  "function",
  "`typeof Date.prototype.getISOFields` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "getISOFields", {
  writable: true,
  enumerable: false,
  configurable: true,
});
