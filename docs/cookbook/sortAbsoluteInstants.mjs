/**
 * getSortedInstants will sort an array of strings (each of which is parseable as a Temporal.Absolute and may or may not include an IANA time zone name)
 * by the corresponding absolute time (e.g., for presenting global log events sequentially).
 *
 *
 * @param {string[]} parseableAbsoluteStrings This is a Date instance
 * @param {boolean} reverse accending or descending order
 * @returns {Temporal.Absolute[]} Temporal.Absolute instance
 */
function getSortedInstants(parseableAbsoluteStrings, reverse = false) {
    const absoluteTimes = parseableAbsoluteStrings.map(v => {
        return Temporal.Absolute.from(v);
    });

    const sortedAbsoluteTimes = absoluteTimes.sort((a, b) => {
        return a.compare(b);
    });

    return reverse ? sortedAbsoluteTimes.reverse() : sortedAbsoluteTimes;
}

let a = "2020-01-23T17:04:36.491865121-08:00";
let b = "2020-02-10T17:04:36.491865121-08:00";
let c = "2019-03-30T01:45:00+01:00[Europe/Berlin]";
let d = "2019-03-30T01:45:00+00:00[Europe/London]";
let e = "2019-03-30T01:45:00-06:00[America/New_York]";

getSortedInstants([a, b, c, d, e]);
