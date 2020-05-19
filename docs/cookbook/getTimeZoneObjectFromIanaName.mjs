// Construct a Temporal.TimeZone from an IANA name:
const tz = Temporal.TimeZone.from('Europe/London');

// Cast the timezone back to an IANA name, two ways:
tz.toString(); // Europe/London
tz.name; // Europe/London

// Note: This file deals with only Temporal.Absolute, so it is calendar-independent.
