// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { ZonedDateTime } = Temporal;
assert.sameValue(
  typeof ZonedDateTime.prototype.toDateTime,
  "function",
  "`typeof ZonedDateTime.prototype.toDateTime` is `function`"
);

verifyProperty(ZonedDateTime.prototype, "toDateTime", {
  writable: true,
  enumerable: false,
  configurable: true,
});
