const date = Temporal.PlainDate.from('2020-05-31');

// Same date and time, but in February
// (and use the last day if the date doesn't exist in February):

const feb = date.with({ month: 2 });

assert.equal(feb.toString(), '2020-02-29');

// Same date and time, but in April
// (and throw an exception if the date doesn't exist in April):

assert.throws(() => {
  date.with({ month: 4 }, { overflow: 'reject' });
});
