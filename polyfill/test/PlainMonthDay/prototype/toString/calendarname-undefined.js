// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plainmonthday.protoype.tostring
description: Fallback value for calendarName option
info: |
    sec-getoption step 3:
      3. If _value_ is *undefined*, return _fallback_.
    sec-temporal-toshowcalendaroption step 1:
      1. Return ? GetOption(_normalizedOptions_, *"calendarName"*, « String », « *"auto"*, *"always"*, *"never"* », *"auto"*).
    sec-temporal.plainmonthday.protoype.tostring step 4:
      4. Let _showCalendar_ be ? ToShowCalendarOption(_options_).
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
  const explicit = monthday.toString({ calendarName: undefined });
  assert.sameValue(explicit, expected, "default calendarName option is auto");

  const implicit = monthday.toString({});
  assert.sameValue(implicit, expected, "default calendarName option is auto");
});
