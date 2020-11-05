/**
 * Given a localized departure time and a flight duration, get a local arrival
 * time in the destination time zone.
 *
 * FIXME: This becomes a one-liner when Temporal.ZonedDateTime.add() is
 * implemented.
 *
 * @param {string} departure - Departure time with time zone
 * @param {Temporal.Duration} flightTime - Duration of the flight
 * @param {Temporal.TimeZone} destinationTimeZone - Time zone in which the
 *  flight's destination is located
 * @param {Temporal.Calendar|string} calendar - Calendar system used for output
 * @returns {Temporal.PlainDateTime} Local arrival time
 */
function getLocalizedArrival(departure, flightTime, destinationTimeZone, calendar) {
  const instant = departure.toInstant();
  const arrival = instant.add(flightTime);
  return destinationTimeZone.getDateTimeFor(arrival, calendar);
}

const arrival = getLocalizedArrival(
  Temporal.ZonedDateTime.from('2020-03-08T11:55:00+08:00[Asia/Hong_Kong]'),
  Temporal.Duration.from({ minutes: 775 }),
  Temporal.TimeZone.from('America/Los_Angeles'),
  'iso8601'
);
assert.equal(arrival.toString(), '2020-03-08T09:50:00');
