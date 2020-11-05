/**
 * Gets an array of Temporal.PlainDates of every day in the given month, that falls
 * on the given day of the week.
 *
 * @param {Temporal.PlainYearMonth} yearMonth - Year and month to query
 * @param {number} dayNumberOfTheWeek - Day of the week, Monday=1, Sunday=7
 * @returns {Temporal.PlainDate[]} Array of dates
 */
function getWeeklyDaysInMonth(yearMonth, dayNumberOfTheWeek) {
  const firstOfMonth = yearMonth.toPlainDate({ day: 1 });
  let nextWeekday = firstOfMonth.add({ days: (7 + dayNumberOfTheWeek - firstOfMonth.dayOfWeek) % 7 });
  const result = [];
  while (nextWeekday.month === yearMonth.month) {
    result.push(nextWeekday);
    nextWeekday = nextWeekday.add({ days: 7 });
  }
  return result;
}

assert.equal(
  getWeeklyDaysInMonth(Temporal.PlainYearMonth.from('2020-02'), 1).join(' '),
  '2020-02-03 2020-02-10 2020-02-17 2020-02-24'
);
assert.equal(
  getWeeklyDaysInMonth(Temporal.PlainYearMonth.from('2020-02'), 6).join(' '),
  '2020-02-01 2020-02-08 2020-02-15 2020-02-22 2020-02-29'
);
