/**
 * Calculates the days that need to be taken off work in order to have a long
 * weekend around a public holiday, "bridging" the holiday if it falls on a
 * Tuesday or Thursday.
 *
 * @param {Temporal.PlainMonthDay} holiday - Yearly date on the calendar
 * @param {number} year - Year in which to calculate the bridge days
 * @returns {Temporal.PlainDate[]} List of dates to be taken off work
 */
function bridgePublicHolidays(holiday, year) {
  const date = holiday.toPlainDate({ year });
  switch (date.dayOfWeek) {
    case 1: // Mon
    case 3: // Wed
    case 5: // Fri
      return [date];
    case 2: // Tue; take Monday off
      return [date.subtract({ days: 1 }), date];
    case 4: // Thu; take Friday off
      return [date, date.add({ days: 1 })];
    case 6: // Sat
    case 7: // Sun
      return [];
  }
}

const labourDay = Temporal.PlainMonthDay.from('05-01');

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
