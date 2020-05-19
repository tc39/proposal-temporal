/**
 * Returns the local date and time for the next occurrence of a weekly occurring
 * event.
 *
 * @param {Temporal.Absolute} now - Starting point
 * @param {Temporal.TimeZone} localTimeZone - Time zone for return value
 * @param {number} weekday - Weekday event occurs on (Monday=1, Sunday=7)
 * @param {Temporal.Time} eventTime - Time event occurs at
 * @param {Temporal.TimeZone} eventTimeZone - Time zone where event is planned
 * @returns {Temporal.DateTime} Local date and time of next occurrence
 */
function nextWeeklyOccurrence(now, localTimeZone, weekday, eventTime, eventTimeZone) {
  const dateTime = now.inTimeZone(eventTimeZone);
  const nextDate = dateTime.getDate().plus({ days: (weekday + 7 - dateTime.dayOfWeek) % 7 });
  let nextOccurrence = nextDate.withTime(eventTime);

  // Handle the case where the event is today but already happened
  if (Temporal.DateTime.compare(dateTime, nextOccurrence) > 0) {
    nextOccurrence = nextOccurrence.plus({ days: 7 });
  }

  return nextOccurrence.inTimeZone(eventTimeZone).inTimeZone(localTimeZone);
}

// "Weekly on Thursdays at 08:45 California time":
const weekday = 4;
const eventTime = Temporal.Time.from('08:45');
const eventTimeZone = Temporal.TimeZone.from('America/Los_Angeles');

const rightBefore = Temporal.Absolute.from('2020-03-26T08:30-07:00[America/Los_Angeles]');
const localTimeZone = Temporal.TimeZone.from('Europe/London');
let next = nextWeeklyOccurrence(rightBefore, localTimeZone, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-03-26T15:45');

const rightAfter = Temporal.Absolute.from('2020-03-26T09:00-07:00[America/Los_Angeles]');
next = nextWeeklyOccurrence(rightAfter, localTimeZone, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-04-02T16:45');
