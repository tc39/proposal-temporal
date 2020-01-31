/**
 * getSortedLocalDateTimes will sort an array of zoneless Temporal.DateTime instances by the
 * corresponding local date and time of day (e.g., for building a conference schedule).
 *
 *
 * @param {Temporal.DateTime[]} dateTimes This is a Date instance
 * @param {boolean} direction accending or descending order
 * @returns {Temporal.Absolute} Temporal.Absolute instance
 */
function getSortedLocalDateTimes(dateTimes, reverse = false) {
    let newDateTimes = dateTimes.sort((a, b) => {
        return a.compare(b);
    });

    return reverse ? newDateTimes.reverse() : newDateTimes;
}

let a = new Temporal.DateTime({ day: 4, month: 2 });
let b = new Temporal.DateTime({ day: 5, month: 2 });
let c = new Temporal.DateTime({ day: 6, month: 3 });
getSortedLocalDateTimes([a, b, c]);
