const legacyDate = new Date('1970-01-01T00:00:01Z');

// Convert legacy Date to Temporal.Instant
const instant = Temporal.Instant.fromEpochMilliseconds(legacyDate.getTime());

assert(instant instanceof Temporal.Instant);
