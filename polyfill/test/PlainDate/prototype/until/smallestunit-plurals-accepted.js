// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.until
description: Plural units are accepted as well for the smallestUnit option
includes: [temporalHelpers.js]
---*/

const earlier = new Temporal.PlainDate(2000, 5, 2);
const later = new Temporal.PlainDate(2001, 6, 12);
const validUnits = [
  "year",
  "month",
  "week",
  "day",
];
TemporalHelpers.checkPluralUnitsAccepted((smallestUnit) => earlier.until(later, { smallestUnit }), validUnits);
