const legacyDate = new Date('1970-01-01T00:00:01Z');
const instant = legacyDate.toTemporalInstant();

assert.equal(instant.epochMilliseconds, legacyDate.getTime());
assert.equal(instant.toString(), '1970-01-01T00:00:01Z');

// If you need a ZonedDateTime, use the toZonedDateTimeISO()
// method of the resulting Instant.
// You will need to specify a time zone, because legacy Date only
// stores an exact time, and does not store a time zone.

// When calling methods on a legacy Date instance, you must decide
// whether you want that exact time interpreted as a UTC value
// (using methods containing "UTC" in their names) or in the
// current system time zone (using other methods). This is
// confusing, so Temporal has a more explicit way to do this.

// To use the system's local time zone, which corresponds to using
// legacy Date's getFullYear(), getMonth(), etc. methods, pass
// Temporal.Now.timeZoneId() as the time zone. In a browser, this
// will be the user's time zone, but on a server the value may not
// be what you expect, so avoid doing this in a server context.

const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());

assert.equal(zoned.epochMilliseconds, legacyDate.getTime());

// Here's an example of using a particular time zone. Especially
// in a server context, you would be getting this time zone from
// elsewhere in the data that you are processing.

const zoned2 = instant.toZonedDateTimeISO('Asia/Shanghai');

assert.equal(zoned2.epochMilliseconds, legacyDate.getTime());
assert.equal(zoned2.timeZoneId, 'Asia/Shanghai');

// (And if the legacy Date instance was accessed using the
// getUTCFullYear(), getUTCMonth(), etc. methods, consider just
// using Instant. If you have to use ZonedDateTime, the specific
// time zone may need to be 'UTC'.)
