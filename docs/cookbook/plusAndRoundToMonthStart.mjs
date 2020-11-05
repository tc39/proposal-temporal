/**
 * Take a date, add a number of days' delay, and round to the start of the next
 * month.
 *
 * @param {Temporal.PlainDate} date - Original date
 * @param {number} delayDays - Number of days' delay
 * @returns {Temporal.PlainDate} - Beginning of the next month after the delay
 */
function plusAndRoundToMonthStart(date, delayDays) {
  return date
    .add({ days: delayDays })
    .add({ months: 1 }) // constrains to end of month if needed, e.g. Jan 31 -> Feb 28
    .with({ day: 1 });
}

const oldLaunchDate = Temporal.PlainDate.from('2019-06-01');

const fifteenDaysDelay = plusAndRoundToMonthStart(oldLaunchDate, 15);
assert.equal(fifteenDaysDelay.toString(), '2019-07-01');

const sixtyDaysDelay = plusAndRoundToMonthStart(oldLaunchDate, 60);
assert.equal(sixtyDaysDelay.toString(), '2019-08-01');
