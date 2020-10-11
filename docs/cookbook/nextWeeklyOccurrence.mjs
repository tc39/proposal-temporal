/**
 * Returns the local date and time for the next occurrence of a weekly occurring
 * event.
 *
 * @param {Temporal.ZonedDateTime} now - Starting point
 * @param {number} weekday - Weekday event occurs on (Monday=1, Sunday=7)
 * @param {Temporal.Time} eventTime - Time event occurs at
 * @param {Temporal.TimeZone} eventTimeZone - Time zone where event is planned
 * @returns {Temporal.ZonedDateTime} Local date and time of next occurrence
 */
function nextWeeklyOccurrence(now, weekday, eventTime, eventTimeZone) {
  const inEventTimeZone = now.with({ timeZone: eventTimeZone });
  const nextDate = inEventTimeZone.toDate().add({ days: (weekday + 7 - inEventTimeZone.dayOfWeek) % 7 });
  let nextOccurrence = inEventTimeZone.with({ ...nextDate.getFields(), ...eventTime.getFields() });

  // Handle the case where the event is today but already happened
  if (Temporal.ZonedDateTime.compare(now, nextOccurrence) > 0) {
    nextOccurrence = nextOccurrence.add({ days: 7 });
  }

  return nextOccurrence.with({ timeZone: now.timeZone });
}

// "Weekly on Thursdays at 08:45 California time":
const weekday = 4;
const eventTime = Temporal.Time.from('08:45');
const eventTimeZone = Temporal.TimeZone.from('America/Los_Angeles');

const rightBefore = Temporal.ZonedDateTime.from('2020-03-26T08:30-07:00[America/Los_Angeles]').with({
  timeZone: 'Europe/London'
});
let next = nextWeeklyOccurrence(rightBefore, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-03-26T15:45+00:00[Europe/London]');

const rightAfter = Temporal.ZonedDateTime.from('2020-03-26T09:00-07:00[America/Los_Angeles]');
next = nextWeeklyOccurrence(rightAfter, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-04-02T08:45-07:00[America/Los_Angeles]');
