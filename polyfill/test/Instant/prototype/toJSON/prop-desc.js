// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.tojson
includes: [propertyHelper.js]
features: [Temporal]
---*/

assert.sameValue(
  typeof Temporal.Instant.prototype.toJSON,
  "function",
  "`typeof Instant.prototype.toJSON` is `function`"
);

verifyProperty(Temporal.Instant.prototype, "toJSON", {
  writable: true,
  enumerable: false,
  configurable: true,
});
