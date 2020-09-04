// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const ISO8601CalendarPrototype = Object.getPrototypeOf(Temporal.Calendar.from("iso8601"));
verifyProperty(ISO8601CalendarPrototype, Symbol.toStringTag, {
  value: "Temporal.ISO8601Calendar",
  writable: false,
  enumerable: false,
  configurable: true,
});
