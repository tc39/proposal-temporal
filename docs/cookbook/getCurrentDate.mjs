/**
 * Get the current date in JavaScript
 * This is a popular question on Stack Overflow for dates in JS
 * https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
 *
 */

const date = Temporal.now.date(); // Gets the current date
date.toString(); // returns the date in ISO 8601 date format

// If you additionally want the time:
Temporal.now.dateTime().toString(); // date and time in ISO 8601 format
