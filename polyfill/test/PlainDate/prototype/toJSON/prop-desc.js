// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.tojson
includes: [propertyHelper.js]
---*/

assert.sameValue(
  typeof Temporal.PlainDate.prototype.toJSON,
  "function",
  "`typeof Date.prototype.toJSON` is `function`"
);

verifyProperty(Temporal.PlainDate.prototype, "toJSON", {
  writable: true,
  enumerable: false,
  configurable: true,
});
