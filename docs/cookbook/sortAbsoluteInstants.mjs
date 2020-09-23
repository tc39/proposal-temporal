/**
 * getSortedInstants will sort an array of strings (each of which is parseable
 * as a Temporal.Instant and may or may not include an IANA time zone name)
 * by the corresponding instant time (e.g., for presenting global log events
 * sequentially).
 *
 * @param {string[]} parseableInstantStrings - a group of ISO Strings
 * @param {boolean} [reverse=false] - ascending or descending order
 * @returns {string[]} the array from parseableInstantStrings, sorted
 */
function getSortedInstants(parseableInstantStrings, reverse = false) {
  const sortedInstantTimes = parseableInstantStrings
    .map((v) => [v, Temporal.Instant.from(v)])
    .sort(([, abs1], [, abs2]) => Temporal.Instant.compare(abs1, abs2))
    .map(([str]) => str);

  return reverse ? sortedInstantTimes.reverse() : sortedInstantTimes;
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
