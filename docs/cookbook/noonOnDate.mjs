const date = Temporal.PlainDate.from('2020-05-14');

const noonOnDate = date.toPlainDateTime(Temporal.PlainTime.from({ hour: 12 }));

assert(noonOnDate instanceof Temporal.PlainDateTime);
assert.equal(noonOnDate.toString(), '2020-05-14T12:00:00');
