/**
 * Given a localized departure time and a flight duration, get a local arrival
 * time in the destination time zone.
 *
 * @param {string} parseableDeparture - Departure time with time zone
 * @param {Temporal.Duration} flightTime - Duration of the flight
 * @param {Temporal.TimeZone} destinationTimeZone - Time zone in which the
 *  flight's destination is located
 * @returns {Temporal.DateTime} Local arrival time
 */
function getLocalizedArrival(parseableDeparture, flightTime, destinationTimeZone) {
  const departure = Temporal.Absolute.from(parseableDeparture);
  const arrival = departure.plus(flightTime);
  return arrival.inTimeZone(destinationTimeZone);
}

const arrival = getLocalizedArrival(
  '2020-03-08T11:55:00+08:00[Asia/Hong_Kong]',
  Temporal.Duration.from({ minutes: 775 }),
  'America/Los_Angeles'
);
assert.equal(arrival.toString(), '2020-03-08T09:50');
