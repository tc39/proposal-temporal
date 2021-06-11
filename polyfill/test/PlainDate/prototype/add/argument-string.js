// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.prototype.add
includes: [temporalHelpers.js]
features: [Temporal]
---*/

const instance = Temporal.PlainDate.from({ year: 2000, month: 5, day: 2 });
const result = instance.add("P3D");
TemporalHelpers.assertPlainDate(result, 2000, 5, "M05", 5);
