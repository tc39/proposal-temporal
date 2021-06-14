// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime
includes: [propertyHelper.js]
features: [Temporal]
---*/

assert.sameValue(
  typeof Temporal.ZonedDateTime,
  "function",
  "`typeof ZonedDateTime` is `function`"
);

verifyProperty(Temporal, "ZonedDateTime", {
  writable: true,
  enumerable: false,
  configurable: true,
});
