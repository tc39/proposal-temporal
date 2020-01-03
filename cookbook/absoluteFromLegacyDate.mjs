import { Temporal } from "../polyfill/lib/index.mjs";

/**
 * Converts a Global Date object into an Absolute Object
 *
 * @param {Date} esDate This is a Date object
 * @returns {Temporal.Absolute} Absolute Object
 */
function getAbsoluteFromDate(esDate) {
    const date = Temporal.Absolute.fromEpochSeconds(esDate.getTime());
    return date;
}

const date = new Date();
getAbsoluteFromDate(date); // Absolute [Temporal.Absolute] {}
