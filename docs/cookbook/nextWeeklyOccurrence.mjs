/**
 * Returns the local date and time for the next occurrence of a weekly occurring
 * event.
 *
 * FIXME: This should use ZonedDateTime arithmetic once ZonedDateTime.add() and
 * subtract() are implemented.
 *
 * @param {Temporal.ZonedDateTime} now - Starting point
 * @param {number} weekday - Weekday event occurs on (Monday=1, Sunday=7)
 * @param {Temporal.PlainTime} eventTime - Time event occurs at
 * @param {Temporal.TimeZone} eventTimeZone - Time zone where event is planned
 * @returns {Temporal.PlainDateTime} Local date and time of next occurrence
 */
function nextWeeklyOccurrence(now, weekday, eventTime, eventTimeZone) {
  const dateTime = now.withTimeZone(eventTimeZone).toPlainDateTime();
  const nextDate = dateTime.toPlainDate().add({ days: (weekday + 7 - dateTime.dayOfWeek) % 7 });
  let nextOccurrence = nextDate.toPlainDateTime(eventTime);

  // Handle the case where the event is today but already happened
  if (Temporal.PlainDateTime.compare(dateTime, nextOccurrence) > 0) {
    nextOccurrence = nextOccurrence.add({ days: 7 });
  }

  return eventTimeZone.getInstantFor(nextOccurrence).toZonedDateTime(now).toPlainDateTime();
}

// "Weekly on Thursdays at 08:45 California time":
const weekday = 4;
const eventTime = Temporal.PlainTime.from('08:45');
const eventTimeZone = Temporal.TimeZone.from('America/Los_Angeles');

const rightBefore = Temporal.ZonedDateTime.from('2020-03-26T15:30+00:00[Europe/London]');
let next = nextWeeklyOccurrence(rightBefore, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-03-26T15:45:00');

const rightAfter = Temporal.ZonedDateTime.from('2020-03-26T16:00+00:00[Europe/London]');
next = nextWeeklyOccurrence(rightAfter, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-04-02T16:45:00');
