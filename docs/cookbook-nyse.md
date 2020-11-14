## New York Stock Exchange time zone

This is an example of using `Temporal.TimeZone` for a custom purpose that is not a standard time zone in use somewhere in the world.

`NYSETimeZone` is a time zone where there are no valid `Temporal.PlainDateTime` values except when the market is open.
When the market is closed, instants are disambiguated to the opening bell of the next market day.

> **NOTE**: This is a very specialized use of Temporal and is not something you would normally need to do.

```javascript
{{cookbook/stockExchangeTimeZone.mjs}}
```
