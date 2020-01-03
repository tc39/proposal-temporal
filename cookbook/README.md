# Temporal Cookbook

## Construction

### [Absolute from legacy Date](./absoluteFromLegacyDate.mjs)

Map a legacy ECMAScript Date instance into a Temporal.Absolute instance corresponding to the same instant in absolute time.

### [Zoned instant from instant and time zone](./getParseableZonedStringAtInstant.mjs)

Map a Temporal.Absolute instance and a time zone name into a string serialization of the local time in that zone corresponding to the instant in absolute time.
