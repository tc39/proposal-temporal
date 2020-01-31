/**
 *
 * @param ianaTimeZoneName {string} TimeZone String
 * @returns {Temporal.Timezone}
 * @example getTimeZoneObjectFromIanaName("Europe/London")
 */
function getTimeZoneObjectFromIanaName(ianaTimeZoneName) {
    return new Temporal.TimeZone(ianaTimeZoneName);
}
