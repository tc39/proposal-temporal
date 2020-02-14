import assert from "assert";

/**
 * getSortedInstants will sort an array of strings (each of which is parseable as a Temporal.Absolute and may or may not include an IANA time zone name)
 * by the corresponding absolute time (e.g., for presenting global log events sequentially).
 *
 *
 * @param {string[]} parseableAbsoluteStrings - a group of ISO Strings
 * @param {boolean} reverse ascending or descending order
 * @returns {string[]} the array from parseableAbsoluteStrings, sorted
 */
function getSortedInstants(parseableAbsoluteStrings, reverse = false) {
    const sortedAbsoluteTimes = parseableAbsoluteStrings
        .map(v => [v, Temporal.Absolute.from(v)])
        .sort(([, abs1], [, abs2]) => Temporal.Absolute.compare(abs1, abs2))
        .map(([str]) => str);

    return reverse ? sortedAbsoluteTimes.reverse() : sortedAbsoluteTimes;
}

const a = "2020-01-23T17:04:36.491865121-08:00";
const b = "2020-02-10T17:04:36.491865121-08:00";
const c = "2019-03-30T01:45:00+01:00[Europe/Berlin]";
const d = "2019-03-16T01:45:00+00:00[Europe/London]";
const e = "2019-03-25T01:45:00-06:00[America/New_York]";

const results = getSortedInstants([a, b, c, d, e]);

// results will have correct order
assert.equal(results[0], "2019-03-16T01:45:00+00:00[Europe/London]");
assert.equal(results[1], "2019-03-25T01:45:00-06:00[America/New_York]");
assert.equal(results[2], "2019-03-30T01:45:00+01:00[Europe/Berlin]");
assert.equal(results[3], "2020-01-23T17:04:36.491865121-08:00");
assert.equal(results[4], "2020-02-10T17:04:36.491865121-08:00");
