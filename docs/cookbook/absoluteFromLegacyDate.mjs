import assert from 'assert';

const legacyDate = new Date('1970-01-01T00:00:01Z');

// Convert legacy Date to Temporal.Absolute
const absolute = Temporal.Absolute.fromEpochMilliseconds(legacyDate.getTime());

assert(absolute instanceof Temporal.Absolute);
