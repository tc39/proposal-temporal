# Hijri Days Adjustments

This example demonstrates an approach to customize the display of Hijri dates in Temporal by implementing an `AdjustableHijriTemporal` class. This class allows for shifting Hijri dates forward or backward by a specified number of days.

The code below showcases how to:

1. Synchronize displayed Hijri dates with local Hijri calendars
2. Facilitate the use of alternative Hijri calendar epochs

Key features of this implementation:

- Adjusts the display of Hijri dates without modifying the underlying calendar system
- Applies a simple day shift without altering month lengths or other calendar rules
- Provides visual alignment for different Hijri calendar variants

> **NOTE**: This example is intended for basic Hijri date adjustments and visual alignment. It does not implement comprehensive calendar customization or detailed Hijri calendar variants. For more complex Hijri calendar adjustments or variants, a more sophisticated implementation would be necessary.

```javascript
{{cookbook/hijriDaysAdjustments.mjs}}
```
