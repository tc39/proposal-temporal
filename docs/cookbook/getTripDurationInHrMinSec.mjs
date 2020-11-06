const departure = Temporal.ZonedDateTime.from('2020-03-08T11:55:00+08:00[Asia/Hong_Kong]');
const arrival = Temporal.ZonedDateTime.from('2020-03-08T09:50:00-07:00[America/Los_Angeles]');

const flightTime = departure.until(arrival);

assert.equal(flightTime.toString(), 'PT12H55M');
