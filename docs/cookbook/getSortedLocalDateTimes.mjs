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

let a = Temporal.DateTime.from({ day: 4, month: 2 });
let b = Temporal.DateTime.from({ day: 5, month: 2 });
let c = Temporal.DateTime.from({ day: 6, month: 3 });
getSortedLocalDateTimes([a, b, c]);
