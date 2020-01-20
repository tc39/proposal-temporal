import { Temporal } from "../polyfill/lib/index.mjs";

/**
 * Converts a Date instance into a Temporal.Absolute instance
 *
 * @param {Date} esDate This is a Date instance
 * @returns {Temporal.Absolute} Temporal.Absolute instance
 */
function getAbsoluteFromDate(esDate) {
    const date = Temporal.Absolute.fromEpochSeconds(esDate.getTime());
    return date;
}

const date = new Date();
getAbsoluteFromDate(date); // Absolute [Temporal.Absolute] {}
