import assert from "assert";

/**
 * Converts a Date instance into a Temporal.DateTime instance
 * DateTime accepts an ISO String in its from() method, so if you need to convert a date to a datetime
 * you're best off passing the result of that
 *
 * @param {Date} esDate This is a Date instance
 * @returns {Temporal.DateTime} Temporal.DateTime instance
 */
function getDateTimeFromDate(esDate) {
    return Temporal.DateTime.from(esDate.toISOString());
}

const date = new Date("1970-01-01T00:00:01Z");
const result = getDateTimeFromDate(date);
assert.equal(result.day, 1);
assert.equal(result.month, 1);
assert.equal(result.year, 1970);
