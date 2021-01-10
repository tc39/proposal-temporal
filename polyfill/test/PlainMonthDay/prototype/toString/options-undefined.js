// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.tostring
---*/

const calendar = {
  toString() { return "custom"; }
};
const monthday = new Temporal.PlainMonthDay(5, 2, calendar);

const explicit = monthday.toString(undefined);
assert.sameValue(explicit, "1972-05-02[c=custom]", "default show-calendar option is auto");

const implicit = monthday.toString();
assert.sameValue(implicit, "1972-05-02[c=custom]", "default show-calendar option is auto");
