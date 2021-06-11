// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindatetime.prototype.tojson
includes: [propertyHelper.js]
features: [Temporal]
---*/

assert.sameValue(
  typeof Temporal.PlainDateTime.prototype.toJSON,
  "function",
  "`typeof PlainDateTime.prototype.toJSON` is `function`"
);

verifyProperty(Temporal.PlainDateTime.prototype, "toJSON", {
  writable: true,
  enumerable: false,
  configurable: true,
});
