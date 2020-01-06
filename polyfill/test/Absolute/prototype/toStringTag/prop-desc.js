// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const {Absolute} = Temporal;
verifyProperty(Absolute.prototype, Symbol.toStringTag, {
  value: "Temporal.Absolute",
  writable: false,
  enumerable: false,
  configurable: true,
});
