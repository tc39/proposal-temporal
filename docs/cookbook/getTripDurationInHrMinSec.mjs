/**
 * Given localized departure and arrival times, get a trip duration suitable
 * for display in an airline ticket website, for example.
 *
 * @param {string} parseableDeparture - Departure time with time zone
 * @param {string} parseableArrival - Arrival time with time zone
 * @returns {Temporal.Duration} A duration with units no larger than hours
 */
function getTripDurationInHrMinSec(parseableDeparture, parseableArrival) {
  const departure = Temporal.Absolute.from(parseableDeparture);
  const arrival = Temporal.Absolute.from(parseableArrival);
  return departure.difference(arrival, { largestUnit: 'hours' });
}

const flightTime = getTripDurationInHrMinSec(
  '2020-03-08T11:55:00+08:00[Asia/Hong_Kong]',
  '2020-03-08T09:50:00-07:00[America/Los_Angeles]'
);
assert.equal(flightTime.toString(), 'PT12H55M');
