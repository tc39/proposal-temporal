/**
 * Returns an iterator of the exact times corresponding to a daily occurrence
 * starting on a particular date, and happening at a particular local time in a
 * particular time zone.
 *
 * @param {Temporal.PlainDate} startDate - Starting date
 * @param {Temporal.PlainTime} time - Local time that event occurs at
 * @param {Temporal.TimeZone} timeZone - Time zone in which event is defined
 */
function* calculateDailyOccurrence(startDate, time, timeZone) {
  for (let date = startDate; ; date = date.add({ days: 1 })) {
    yield date.toPlainDateTime(time).toZonedDateTime(timeZone);
  }
}

// Daily meeting at 8 AM California time
const startDate = Temporal.PlainDate.from('2017-03-10');
const time = Temporal.PlainTime.from('08:00');
const timeZone = Temporal.TimeZone.from('America/Los_Angeles');
const iter = calculateDailyOccurrence(startDate, time, timeZone);

assert(iter.next().value.toString(), '2017-03-10T16:00:00.000000000Z');
assert(iter.next().value.toString(), '2017-03-11T16:00:00.000000000Z');
// DST change:
assert(iter.next().value.toString(), '2017-03-12T15:00:00.000000000Z');
assert(iter.next().value.toString(), '2017-03-13T15:00:00.000000000Z');
