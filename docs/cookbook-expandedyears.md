## Expanded years example

This is an example of an approach to extend Temporal to support arbitrarily-large years (e.g., **+635427810-02-02**) for astronomical purposes.

The code below is just an example to show how this could be approached.
To do this completely would require adding support to Temporal.Instant and Temporal.ZonedDateTime, and overriding more methods.

For example, arithmetic will not work correctly in this example.

> **NOTE**: This is a very specialized use of Temporal and is not something you would normally need to do.
> A dedicated third-party library might be a better solution to this problem.

```javascript
{{cookbook/makeExpandedTemporal.mjs}}
```
