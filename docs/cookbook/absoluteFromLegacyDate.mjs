/**
 * Converts a Date instance into a Temporal.Absolute instance
 *
 * @param {Date} esDate This is a Date instance
 * @returns {Temporal.Absolute} Temporal.Absolute instance
 */
function getAbsoluteFromDate(esDate) {
    const date = Temporal.Absolute.fromEpochMilliseconds(esDate.getTime());
    return date;
}

const date = new Date("1970-01-01T00:00:01Z");
getAbsoluteFromDate(date); // Absolute [Temporal.Absolute] {}
