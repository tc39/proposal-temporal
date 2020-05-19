if (!globalThis.navigator) {
  globalThis.navigator = {
    locales: [new Intl.Locale("en-US-u-ca-hebrew")]
  };
}

/**
 * Given a localized departure time and a flight duration, get a local arrival
 * time in the destination time zone.
 *
 * @param {string} parseableDeparture - Departure time with time zone
 * @param {Temporal.Duration} flightTime - Duration of the flight
 * @param {Temporal.TimeZone} destinationTimeZone - Time zone in which the
 *  flight's destination is located
 * @param {string} calendar - Calendar system in which to render the datetime
 * @returns {Temporal.DateTime} Local arrival time
 */
function getLocalizedArrival(parseableDeparture, flightTime, destinationTimeZone, calendar) {
  const departure = Temporal.Absolute.from(parseableDeparture);
  const arrival = departure.plus(flightTime);
  return arrival.inTimeZone(destinationTimeZone, calendar);
}

const arrival = getLocalizedArrival(
  '2020-03-08T11:55:00+08:00[Asia/Hong_Kong]',
  Temporal.Duration.from({ minutes: 775 }),
  'America/Los_Angeles',
  navigator.locales[0].getLikelyCalendar()
);
assert.equal(arrival.toString(), '2020-03-08T09:50');
