/**
 * Get a (Unix) timestamp in JavaScript
 * This is the No.1 voted question on Stack Overflow for dates in JS
 * https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
 *
 */

const timeStamp = Temporal.now.absolute();

// Timestamp in Milliseconds
timeStamp.getEpochMilliseconds();
// Timestamp in Seconds
timeStamp.getEpochSeconds();

// Note: This is all calendar-independent
