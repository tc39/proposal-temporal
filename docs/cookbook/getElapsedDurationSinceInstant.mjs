/**
 * @typedef {Object} ElapsedDuration
 * @property {string} return.sign - "+" or "-"
 * @property {Temporal.Duration} return.duration - Elapsed duration
 */
/**
 * Compute the difference between two instants, suitable for use in a countdown,
 * for example.
 *
 * @param {Temporal.Absolute} then - Instant since when to measure the duration
 * @param {Temporal.Absolute} now - Instant until when to measure the duration
 * @param {string} [largestUnit=days] - Largest time unit to have in the result
 * @returns {ElapsedDuration} Time between `then` and `now`
 */
function getElapsedDurationSinceInstant(then, now, largestUnit = 'days') {
  const sign = Temporal.Absolute.compare(now, then) < 0 ? '-' : '+';
  const duration = now.difference(then, { largestUnit });
  return { sign, duration };
}

const result = getElapsedDurationSinceInstant(
  Temporal.Absolute.from('2020-01-09T00:00Z'),
  Temporal.Absolute.from('2020-01-09T04:00Z')
);
assert.equal(`${result.sign}${result.duration}`, '+PT4H');

const result2 = getElapsedDurationSinceInstant(
  Temporal.Absolute.from('2020-01-09T04:00Z'),
  Temporal.Absolute.from('2020-01-09T00:00Z'),
  'minutes'
);
assert.equal(`${result2.sign}${result2.duration}`, '-PT240M');

// Example of using it in a countdown:

const { sign, duration } = getElapsedDurationSinceInstant(
  Temporal.Absolute.from('2020-04-01T13:00-07:00[America/Los_Angeles]'),
  Temporal.now.absolute()
);
`It's ${duration.toLocaleString()} ${sign < 0 ? 'until' : 'since'} the TC39 Temporal presentation`;

// Note: This file deals with only Temporal.Absolute, so it is calendar-independent.
