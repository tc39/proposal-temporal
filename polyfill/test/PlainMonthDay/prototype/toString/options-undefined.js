// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.prototype.tostring
features: [Temporal]
---*/

const calendar = {
  toString() { return "custom"; }
};
const monthday1 = new Temporal.PlainMonthDay(5, 2);
const monthday2 = new Temporal.PlainMonthDay(5, 2, calendar);

[
  [monthday1, "05-02"],
  [monthday2, "1972-05-02[u-ca=custom]"],
].forEach(([monthday, expected]) => {
  const explicit = monthday.toString(undefined);
  assert.sameValue(explicit, expected, "default calendarName option is auto");

  const implicit = monthday.toString();
  assert.sameValue(implicit, expected, "default calendarName option is auto");
});
