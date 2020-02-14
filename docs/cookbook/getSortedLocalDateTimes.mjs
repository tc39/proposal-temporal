import assert from "assert";
/**
 * getSortedLocalDateTimes will sort an array of zoneless Temporal.DateTime instances by the
 * corresponding local date and time of day (e.g., for building a conference schedule).
 *
 *
 * @param {Temporal.DateTime[]} dateTimes This is a Date instance
 * @param {boolean} direction ascending or descending order
 * @returns {Temporal.DateTime[]} Temporal.Absolute instance
 */
function getSortedLocalDateTimes(dateTimes, reverse = false) {
    let newDateTimes = dateTimes.sort(Temporal.DateTime.compare);

    return reverse ? newDateTimes.reverse() : newDateTimes;
}

// Sorting some conferences without timezones
let a = Temporal.DateTime.from({ year: 2020, day: 15, month: 2, hour: 9 }); // FontFest
let b = Temporal.DateTime.from({ year: 2020, day: 26, month: 5 }); // React Finland
let c = Temporal.DateTime.from({ year: 2020, day: 23, month: 2, hour: 9 }); // ReactConf AU
const results = getSortedLocalDateTimes([a, b, c]);
assert.equal(results[0], a);
assert.equal(results[1], c);
assert.equal(results[2], b);
