# Temporal Cookbook

## Running the cookbook files

Running cookbook files:

```sh
node --experimental-modules --no-warnings \
	--icu-data-dir ./polyfill/node_modules/full-icu/ \
	-r ./polyfill/index.js ./docs/cookbook/${cookbookFile}
```

_The above code allows `Temporal` to exist as a global object before the cookbook file runs._

## Construction

### [Absolute from legacy Date](./cookbook/absoluteFromLegacyDate.mjs)

Map a legacy ECMAScript Date instance into a Temporal.Absolute instance corresponding to the same instant in absolute time.

```javascript
{{cookbook/absoluteFromLegacyDate.mjs}}
```

### [Zoned instant from instant and time zone](./cookbook/getParseableZonedStringAtInstant.mjs)

Map a Temporal.Absolute instance and a time zone name into a string serialization of the local time in that zone corresponding to the instant in absolute time.

```javascript
{{cookbook/getParseableZonedStringAtInstant.mjs}}
```
