/**
 * Gets the number of preceding days in the same month as `date` that fall on
 * the same day of the week as `date`.
 *
 * @param {Temporal.Date} date - Starting date
 * @returns {number} Number of days
 */
function countPrecedingWeeklyDaysInMonth(date) {
  // This doesn't actually require Temporal
  return Math.floor((date.day - 1) / 7);
}

assert.equal(countPrecedingWeeklyDaysInMonth(Temporal.Date.from('2020-02-28')), 3);
assert.equal(countPrecedingWeeklyDaysInMonth(Temporal.Date.from('2020-02-29')), 4);
