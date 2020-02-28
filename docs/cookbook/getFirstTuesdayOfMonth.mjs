import assert from "assert";

/**
 * Gets the first tuesday of the month and returns its date
 *
 * @param {Temporal.YearMonth} queriedMonth YearMonth instance to query
 * @returns {Temporal.DateTime} DateTime Instance which gives first tuesday
 */
function getFirstTuesday(queriedDate) {
    // We first need to convert to a date
    let date = Temporal.DateTime.from({
        year: queriedDate.year,
        month: queriedDate.month,
        day: 1
    });

    // Start at the beginning of the month then stop at the first tuesday
    while (date.dayOfWeek !== 2) {
        date = date.plus({ days: 1 });
    }

    return date;
}

const myMonth = Temporal.YearMonth.from("2020-02");
const firstTuesdayOfMonth = getFirstTuesday(myMonth);
assert.equal(
    firstTuesdayOfMonth.toLocaleString("en-UK", { weekday: "long" }),
    "Tuesday, 2/4/2020, 12:00:00 AM"
);
