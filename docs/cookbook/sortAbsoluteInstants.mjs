/**
 * getSortedInstants will sort an array of strings (each of which is parseable
 * as a Temporal.Absolute and may or may not include an IANA time zone name)
 * by the corresponding absolute time (e.g., for presenting global log events
 * sequentially).
 *
 * @param {string[]} parseableAbsoluteStrings - a group of ISO Strings
 * @param {boolean} reverse - ascending or descending order
 * @returns {string[]} the array from parseableAbsoluteStrings, sorted
 */
function getSortedInstants(parseableAbsoluteStrings, reverse = false) {
  const sortedAbsoluteTimes = parseableAbsoluteStrings
    .map((v) => [v, Temporal.Absolute.from(v)])
    .sort(([, abs1], [, abs2]) => Temporal.Absolute.compare(abs1, abs2))
    .map(([str]) => str);

  return reverse ? sortedAbsoluteTimes.reverse() : sortedAbsoluteTimes;
}

// simple string comparison order would not be correct here:
const a = '2020-01-23T17:04:36.491865121-08:00';
const b = '2020-02-10T17:04:36.491865121-08:00';
const c = '2020-04-01T05:01:00-05:00[America/New_York]';
const d = '2020-04-01T10:00:00+01:00[Europe/London]';
const e = '2020-04-01T11:02:00+02:00[Europe/Berlin]';

const results = getSortedInstants([a, b, c, d, e]);

// results will have correct order
assert.deepEqual(results, [
  '2020-01-23T17:04:36.491865121-08:00',
  '2020-02-10T17:04:36.491865121-08:00',
  '2020-04-01T10:00:00+01:00[Europe/London]',
  '2020-04-01T05:01:00-05:00[America/New_York]',
  '2020-04-01T11:02:00+02:00[Europe/Berlin]'
]);
