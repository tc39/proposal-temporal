// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { TimeZone } = Temporal;
assert.sameValue(
  typeof TimeZone.prototype.getPossibleInstantsFor,
  "function",
  "`typeof TimeZone.prototype.getPossibleInstantsFor` is `function`"
);

verifyProperty(TimeZone.prototype, "getPossibleInstantsFor", {
  writable: true,
  enumerable: false,
  configurable: true,
});
