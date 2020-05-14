const birthday = Temporal.MonthDay.from('12-15');

const birthdayIn2030 = birthday.withYear(2030);
birthdayIn2030.dayOfWeek; // => 7

assert(birthdayIn2030 instanceof Temporal.Date);
assert.equal(birthdayIn2030.toString(), '2030-12-15');
