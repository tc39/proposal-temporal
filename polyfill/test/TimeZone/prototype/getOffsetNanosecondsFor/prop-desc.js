// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { TimeZone } = Temporal;
assert.sameValue(
  typeof TimeZone.prototype.getOffsetNanosecondsFor,
  "function",
  "`typeof TimeZone.prototype.getOffsetNanosecondsFor` is `function`"
);

verifyProperty(TimeZone.prototype, "getOffsetNanosecondsFor", {
  writable: true,
  enumerable: false,
  configurable: true,
});
