const result = Temporal.Absolute.from('2020-01-09T04:00Z').difference(Temporal.Absolute.from('2020-01-09T00:00Z'), {
  largestUnit: 'hours'
});
assert.equal(`${result}`, 'PT4H');

const result2 = Temporal.Absolute.from('2020-01-09T00:00Z').difference(Temporal.Absolute.from('2020-01-09T04:00Z'), {
  largestUnit: 'minutes'
});
assert.equal(`${result2}`, '-PT240M');

// Example of using it in a countdown:

const duration = Temporal.Absolute.from('2020-04-01T13:00-07:00[America/Los_Angeles]').difference(
  Temporal.now.absolute()
);
// Note that this does not work unless you have Intl.DurationFormat, which is
// still an early-stage proposal.
`It's ${duration.toLocaleString()} ${duration.sign < 0 ? 'until' : 'since'} the TC39 Temporal presentation`;
