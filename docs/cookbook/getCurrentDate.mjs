/**
 * Get the current date in JavaScript
 * This is a popular question on Stack Overflow for dates in JS
 * https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
 *
 */

// Note: toString() is calendar-independent.
const dateTime = Temporal.now.dateTime(); // Gets the current date
dateTime.toString(); // returns the date in ISO 8601 date format
