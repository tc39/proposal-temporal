import assert from "assert";

/**
 * getSortedInstants will sort an array of strings (each of which is parseable as a Temporal.Absolute and may or may not include an IANA time zone name)
 * by the corresponding absolute time (e.g., for presenting global log events sequentially).
 *
 *
 * @param {string[]} parseableAbsoluteStrings - a group of ISO Strings
 * @param {boolean} reverse ascending or descending order
 * @returns {Temporal.Absolute[]} Temporal.Absolute instance
 */
function getSortedInstants(parseableAbsoluteStrings, reverse = false) {
    const sortedAbsoluteTimes = parseableAbsoluteStrings.sort(
        Temporal.Absolute.compare
    );

    return reverse ? sortedAbsoluteTimes.reverse() : sortedAbsoluteTimes;
}

const a = "2020-01-23T17:04:36.491865121-08:00";
const b = "2020-02-10T17:04:36.491865121-08:00";
const c = "2019-03-30T01:45:00+01:00[Europe/Berlin]";
const d = "2019-03-16T01:45:00+00:00[Europe/London]";
const e = "2019-03-25T01:45:00-06:00[America/New_York]";

const results = getSortedInstants([a, b, c, d, e]);

// results will have correct order
assert.equal(results[0], d);
assert.equal(results[1], e);
assert.equal(results[2], c);
assert.equal(results[3], a);
assert.equal(results[4], b);
