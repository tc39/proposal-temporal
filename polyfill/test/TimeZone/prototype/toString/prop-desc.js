// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.tostring
includes: [propertyHelper.js]
features: [Temporal]
---*/

assert.sameValue(
  typeof Temporal.TimeZone.prototype.toString,
  "function",
  "`typeof TimeZone.prototype.toString` is `function`"
);

verifyProperty(Temporal.TimeZone.prototype, "toString", {
  writable: true,
  enumerable: false,
  configurable: true,
});
