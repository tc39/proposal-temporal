const birthday = Temporal.PlainMonthDay.from('12-15');

const birthdayIn2030 = birthday.toPlainDate({ year: 2030 });
birthdayIn2030.dayOfWeek; // => 7

assert(birthdayIn2030 instanceof Temporal.PlainDate);
assert.equal(birthdayIn2030.toString(), '2030-12-15');
