/**
 * Get the current date in JavaScript
 * This is a popular question on Stack Overflow for dates in JS
 * https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
 *
 */

const date = Temporal.now.dateISO(); // Gets the current date
date.toString(); // returns the date in ISO 8601 date format

// If you additionally want the time:
Temporal.now.dateTimeISO().toString(); // date and time in ISO 8601 format
