const date = Temporal.PlainDate.from('2018-09-16');

const firstOfCurrentMonth = date.with({ day: 1 });
const firstOfNextMonth = firstOfCurrentMonth.add({ months: 1 });

const sinceCurrent = date.since(firstOfCurrentMonth);
const untilNext = date.until(firstOfNextMonth);

const isCloserToNextMonth = Temporal.Duration.compare(sinceCurrent, untilNext) >= 0;
const nearestMonth = isCloserToNextMonth ? firstOfNextMonth : firstOfCurrentMonth;

assert.equal(nearestMonth.toString(), '2018-10-01');
