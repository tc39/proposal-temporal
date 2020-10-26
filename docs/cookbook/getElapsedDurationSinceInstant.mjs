const result = Temporal.Instant.from('2020-01-09T04:00Z').since(Temporal.Instant.from('2020-01-09T00:00Z'), {
  largestUnit: 'hours'
});
assert.equal(`${result}`, 'PT4H');

const result2 = Temporal.Instant.from('2020-01-09T00:00Z').until(Temporal.Instant.from('2020-01-09T04:00Z'), {
  largestUnit: 'minutes'
});
assert.equal(`${result2}`, 'PT240M');

// Example of using it in a countdown:

const duration = Temporal.now.instant().until(Temporal.Instant.from('2020-04-01T13:00-07:00[America/Los_Angeles]'));
// Note that this does not work unless you have Intl.DurationFormat, which is
// still an early-stage proposal.
`It's ${duration.toLocaleString()} ${duration.sign < 0 ? 'until' : 'since'} the TC39 Temporal presentation`;
