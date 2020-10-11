// ZonedDateTime POC notes
// - Existing code is fine-- no DST issues.
// - This function will break around DST transitions if the caller passes a
//   date/time duration instead of the expected instant duration.
// - The result will be easier to work with because it has its time zone already
//   baked in.

/**
 * Given a localized departure time and a flight duration, get a local arrival
 * time in the destination time zone.
 *
 * @param {string} parseableDeparture - Departure time with time zone
 * @param {Temporal.Duration} flightTime - Instant duration of the flight
 * @param {Temporal.TimeZone} destinationTimeZone - Time zone in which the
 *  flight's destination is located
 * @param {Temporal.Calendar|string} calendar - Calendar system used for output
 * @returns {Temporal.ZonedDateTime} Local arrival time
 */
function getLocalizedArrival(parseableDeparture, flightTime, destinationTimeZone, calendar) {
  const departure = Temporal.ZonedDateTime.from(parseableDeparture);
  return departure.toInstant().add(flightTime).toZonedDateTime(destinationTimeZone, calendar);
}

const arrival = getLocalizedArrival(
  '2020-03-08T11:55:00+08:00[Asia/Hong_Kong]',
  Temporal.Duration.from({ minutes: 775 }),
  'America/Los_Angeles',
  'iso8601'
);
assert.equal(arrival.toString(), '2020-03-08T09:50-07:00[America/Los_Angeles]');
