/**
 * sortInstantStrings will sort an array of strings (each of which is
 * parseable as a Temporal.Instant and may or may not include an IANA time
 * zone name) by the corresponding exact time (e.g., for presenting global
 * log events sequentially).
 *
 * @param {string[]} strings - an array of ISO strings
 * @param {boolean} [reverse=false] - ascending or descending order
 * @returns {string[]} the array from strings, sorted
 */
function sortInstantStrings(strings, reverse = false) {
  const sortedInstants = strings
    .map((v) => [v, Temporal.Instant.from(v)])
    .sort(([, i1], [, i2]) => Temporal.Instant.compare(i1, i2))
    .map(([str]) => str);

  return reverse ? sortedInstants.reverse() : sortedInstants;
}

// simple string comparison order would not be correct here:
const a = '2020-01-23T17:04:36.491865121-08:00';
const b = '2020-02-10T17:04:36.491865121-08:00';
const c = '2020-04-01T05:01:00-04:00[America/New_York]';
const d = '2020-04-01T10:00:00+01:00[Europe/London]';
const e = '2020-04-01T11:02:00+02:00[Europe/Berlin]';

const results = sortInstantStrings([a, b, c, d, e]);

// results will have correct order
assert.deepEqual(results, [
  '2020-01-23T17:04:36.491865121-08:00',
  '2020-02-10T17:04:36.491865121-08:00',
  '2020-04-01T10:00:00+01:00[Europe/London]',
  '2020-04-01T05:01:00-04:00[America/New_York]',
  '2020-04-01T11:02:00+02:00[Europe/Berlin]'
]);
