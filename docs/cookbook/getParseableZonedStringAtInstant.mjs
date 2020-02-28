import assert from "assert";

/**
 * Converts an absolute point in time to a readable string of a specified time zone
 *
 * @param {Temporal.Absolute} absolute An absolute point in time
 * @param {Temporal.TimeZone|string} absolute An absolute point in time
 * @returns {string} IANA Timezone
 */
function getParseableZonedStringAtInstant(absolute, ianaTimeZoneName) {
    // inTimeZone accepts either a timezone string or a Temporal.TimeZone object
    // It returns a DateTime object
    const localDateTime = absolute.inTimeZone(ianaTimeZoneName);
    return localDateTime.toString();
}

const absoluteTime = Temporal.Absolute.from("2020-01-03T10:41:51Z");
const timeZone = "Europe/Paris";
const result = getParseableZonedStringAtInstant(absoluteTime, timeZone);
assert.equal(result, '2020-01-03T11:41:51');
