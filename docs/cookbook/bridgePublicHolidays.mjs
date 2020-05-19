/**
 * Calculates the days that need to be taken off work in order to have a long
 * weekend around a public holiday, "bridging" the holiday if it falls on a
 * Tuesday or Thursday.
 *
 * @param {Temporal.MonthDay} holiday - Yearly date on the calendar
 * @param {number} year - Year in which to calculate the bridge days
 * @returns {Temporal.Date[]} List of dates to be taken off work
 */
function bridgePublicHolidays(holiday, year) {
  const date = holiday.withYear(year);
  switch (date.dayOfWeek) {
    case 1: // Mon
    case 3: // Wed
    case 5: // Fri
      return [date];
    case 2: // Tue; take Monday off
      return [date.minus({ days: 1 }), date];
    case 4: // Thu; take Friday off
      return [date, date.plus({ days: 1 })];
    case 6: // Sat
    case 7: // Sun
      return [];
  }
}

// Note: The logic in this file is calendar-dependent, but an ISO string is used.
const labourDay = Temporal.MonthDay.from('05-01');  // from string => ISO calendar

// No bridge day
assert.deepEqual(
  bridgePublicHolidays(labourDay, 2020).map((d) => d.toString()),
  ['2020-05-01']
);

// Bridge day
assert.deepEqual(
  bridgePublicHolidays(labourDay, 2018).map((d) => d.toString()),
  ['2018-04-30', '2018-05-01']
);

// Bad luck, the holiday is already on a weekend
assert.deepEqual(
  bridgePublicHolidays(labourDay, 2021).map((d) => d.toString()),
  []
);
