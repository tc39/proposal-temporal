/**
 * Take a date, add a number of days' delay, and round to the start of the next
 * month.
 *
 * @param {Temporal.Date} date - Original date
 * @param {number} delayDays - Number of days' delay
 * @returns {Temporal.Date} - Beginning of the next month after the delay
 */
function plusAndRoundToMonthStart(date, delayDays) {
  const delayedDate = date.plus({ days: delayDays });
  const month = delayedDate.month + 1;
  return delayedDate.with({ month, day: 1 }, { disambiguation: 'balance' });
}

const oldLaunchDate = Temporal.Date.from('2019-06-01');

const fifteenDaysDelay = plusAndRoundToMonthStart(oldLaunchDate, 15);
assert.equal(fifteenDaysDelay.toString(), '2019-07-01');

const sixtyDaysDelay = plusAndRoundToMonthStart(oldLaunchDate, 60);
assert.equal(sixtyDaysDelay.toString(), '2019-08-01');
