const date = Temporal.PlainDate.from('2020-04-14');

// Third day of next month:

const thirdOfNextMonth = date.add({ months: 1 }).with({ day: 3 });

assert.equal(thirdOfNextMonth.toString(), '2020-05-03');

// Last day of this month:

const lastOfThisMonth = date.with({ day: date.daysInMonth });

assert.equal(lastOfThisMonth.toString(), '2020-04-30');

// On the 18th of this month at 8 PM:

const thisMonth18thAt8PM = date.with({ day: 18 }).toPlainDateTime(Temporal.PlainTime.from('20:00'));

assert.equal(thisMonth18thAt8PM.toString(), '2020-04-18T20:00:00');
