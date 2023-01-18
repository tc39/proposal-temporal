/**
 * Returns an iterator of the exact times corresponding to a daily occurrence
 * starting on a particular date, and happening at a particular local time in a
 * particular time zone.
 *
 * @param {Temporal.PlainDate} startDate - Starting date
 * @param {Temporal.PlainTime} plainTime - Local time that event occurs at
 * @param {string} timeZone - Time zone in which event is defined
 */
function* calculateDailyOccurrence(startDate, plainTime, timeZone) {
  for (let date = startDate; ; date = date.add({ days: 1 })) {
    yield date.toZonedDateTime({ plainTime, timeZone }).toInstant();
  }
}

// Daily meeting at 8 AM California time
const startDate = Temporal.PlainDate.from('2017-03-10');
const time = Temporal.PlainTime.from('08:00');
const timeZone = 'America/Los_Angeles';
const iter = calculateDailyOccurrence(startDate, time, timeZone);

assert.equal(iter.next().value.toString(), '2017-03-10T16:00:00Z');
assert.equal(iter.next().value.toString(), '2017-03-11T16:00:00Z');
// DST change:
assert.equal(iter.next().value.toString(), '2017-03-12T15:00:00Z');
assert.equal(iter.next().value.toString(), '2017-03-13T15:00:00Z');
