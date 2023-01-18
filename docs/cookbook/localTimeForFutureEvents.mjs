// Dates of the 2019 TC39 meetings:
const tc39meetings = [
  {
    dateTime: '2019-01-28T10:00',
    timeZone: 'America/Phoenix'
  },
  {
    dateTime: '2019-03-26T10:00',
    timeZone: 'America/New_York'
  },
  {
    dateTime: '2019-06-04T10:00',
    timeZone: 'Europe/Berlin'
  },
  {
    dateTime: '2019-07-23T10:00',
    timeZone: 'America/Los_Angeles'
  },
  {
    dateTime: '2019-10-01T10:00',
    timeZone: 'America/New_York'
  },
  {
    dateTime: '2019-12-03T10:00',
    timeZone: 'America/Los_Angeles'
  }
];

// To follow the meetings remotely from Tokyo, calculate the times you would
// need to join:
const localTimeZone = 'Asia/Tokyo';
const localTimes = tc39meetings.map(({ dateTime, timeZone }) => {
  return Temporal.PlainDateTime.from(dateTime)
    .toZonedDateTime(timeZone, { disambiguation: 'reject' })
    .withTimeZone(localTimeZone)
    .toPlainDateTime();
});

assert.deepEqual(
  localTimes.map((dt) => dt.toString()),
  [
    '2019-01-29T02:00:00',
    '2019-03-26T23:00:00',
    '2019-06-04T17:00:00',
    '2019-07-24T02:00:00',
    '2019-10-01T23:00:00',
    '2019-12-04T03:00:00'
  ]
);
