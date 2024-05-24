/**
 * Returns the local date and time for the next occurrence of a weekly occurring
 * event.
 *
 * @param {Temporal.ZonedDateTime} now - Starting point
 * @param {number} weekday - Weekday event occurs on (Monday=1, Sunday=7)
 * @param {Temporal.PlainTime} eventTime - Time event occurs at
 * @param {string} eventTimeZone - Time zone where event is planned
 * @returns {Temporal.ZonedDateTime} Local date and time of next occurrence
 */
function nextWeeklyOccurrence(now, weekday, eventTime, eventTimeZone) {
  const nowInEventTimeZone = now.withTimeZone(eventTimeZone);
  const nextDate = nowInEventTimeZone.toPlainDate().add({ days: (weekday + 7 - nowInEventTimeZone.dayOfWeek) % 7 });
  let nextOccurrence = nextDate.toZonedDateTime({ plainTime: eventTime, timeZone: eventTimeZone });

  // Handle the case where the event is today but already happened
  if (Temporal.ZonedDateTime.compare(now, nextOccurrence) > 0) {
    nextOccurrence = nextOccurrence.add({ weeks: 1 });
  }

  return nextOccurrence.withTimeZone(now.timeZoneId);
}

// "Weekly on Thursdays at 08:45 California time":
const weekday = 4;
const eventTime = Temporal.PlainTime.from('08:45');
const eventTimeZone = 'America/Los_Angeles';

const rightBefore = Temporal.ZonedDateTime.from('2020-03-26T15:30+00:00[Europe/London]');
let next = nextWeeklyOccurrence(rightBefore, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-03-26T15:45:00+00:00[Europe/London]');

const rightAfter = Temporal.ZonedDateTime.from('2020-03-26T16:00+00:00[Europe/London]');
next = nextWeeklyOccurrence(rightAfter, weekday, eventTime, eventTimeZone);
assert.equal(next.toString(), '2020-04-02T16:45:00+01:00[Europe/London]');
