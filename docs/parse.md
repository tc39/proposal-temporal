# `Temporal.parse`

The `Temporal.parse` function parses a full ISO string and divides it into its
respective components, which can then be used to produce the corresponding
Temporal objects.

This function can be used to parse full valid ISO strings that represent invalid
absolutes and salvage valid components from the string.

## Syntax

```javascript
const parseResult = Temporal.parse(input);
```

### Parameters

- `input` (`string`): The input string to be parsed. It should be a full valid
ISO string, but it may or may not represent a valid absolute.

### Returns

The returned value is an `object` that contains all the components of the parsed
ISO string. It has a structure described by the following TypeScript interface:

```typescript
interface parseResult {
    absolute: string;
    dateTime: string;
    date: string;
    time: string;
    yearMonth: string;
    monthDay: string;
    zone: {
        ianaName?: string;
        offset?: string;
    }
}
```

## Example Usage

```javascript
const parsed = Temporal.parse('1937-01-01T12:00:27.870+00:20');
const time = Temporal.Time.from(parsed.time); // 12:00:27.870
const date = Temporal.Date.from(parsed.date); // 1937-01-01
```
