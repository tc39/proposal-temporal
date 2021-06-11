// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { ZonedDateTime } = Temporal;
assert.sameValue(
  typeof ZonedDateTime.prototype.toPlainDateTime,
  "function",
  "`typeof ZonedDateTime.prototype.toPlainDateTime` is `function`"
);

verifyProperty(ZonedDateTime.prototype, "toPlainDateTime", {
  writable: true,
  enumerable: false,
  configurable: true,
});
