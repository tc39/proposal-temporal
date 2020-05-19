const date = Temporal.Date.from('2020-05-14');

const noonOnDate = date.withTime(Temporal.Time.from({ hour: 12 }));

assert(noonOnDate instanceof Temporal.DateTime);
assert.equal(noonOnDate.toString(), '2020-05-14T12:00');
