# Example of custom time zones with iCalendar data

The iCalendar data format allows specifying custom rules for time zone UTC offset changes.
Using the Temporal API directly, you can only make `Temporal.ZonedDateTime` instances with time zones that are available in your JS environment's version of the time zone database.
However, you can make a custom `ZonedDateTime` class that allows performing calculations with a custom time zone based on iCalendar rules.

```javascript
{{cookbook/icalendarTimeZones.mjs}}
```
