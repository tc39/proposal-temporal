const date = Temporal.PlainDate.from('2018-09-16');

let { year, month } = date;
if ((date.day - 1) / date.daysInMonth >= 0.5) month++;
if (month > 12) {
  month %= 12;
  year++;
}
const nearestMonth = Temporal.PlainDate.from({ year, month, day: 1 });

assert.equal(nearestMonth.toString(), '2018-10-01');
