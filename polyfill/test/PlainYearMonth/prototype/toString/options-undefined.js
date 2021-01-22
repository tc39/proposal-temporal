// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainyearmonth.prototype.tostring
---*/

const calendar = {
  toString() { return "custom"; }
};
const yearmonth = new Temporal.PlainYearMonth(2000, 5, calendar);

const explicit = yearmonth.toString(undefined);
assert.sameValue(explicit, "2000-05-01[u-ca-custom]", "default show-calendar option is auto");

const implicit = yearmonth.toString();
assert.sameValue(implicit, "2000-05-01[u-ca-custom]", "default show-calendar option is auto");
