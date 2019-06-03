# The naming of Civil objects

Famous quote:

    There are only two hard things in Computer Science: cache invalidation and naming things.

    -- Phil Karlton

Infamous quote:

    Cache invalidation is easy if you don't use a cache.

    -- Phil Dunkel

Which leaves us with a *hard problem in computer science*: the naming of the `Civil` family of objects.

**There are a set of objects that represents dates, times, as well as aggregations and parts thereof which do not contain enough data to tie them to a sepcific timezone or locality: what do we call them?**

Before we talk about how to name them, we should be clear on what things we are naming and the [mental model](./mentalmodel.md) they represent:

 * `CivilDate` represens a date without a time or locality
 * `CivilTime` represents a time without a date or timezone or locality
 * `CivilDateTime` represents a date and time without a timezone or locality
 * `CivilYearMonth` repreents a year and month without a day or time or timezone or locality (think: July 2019)
 * `CivilMonthDay` represents a day and month without a year or time or locality (think 25th of December);

**Options:**

 * `Gregorian*` since they are specific to the Gregorian Calendar.
 * `Local*` since they look like what we use to talk about our local time.
 * `Civil*` since they look like what we use in civil life.

## Gregorian

**Pro:** The reason `Gregorian` was suggested was in view of the fact that we are limiting ourselves to the gregorian calendar. Future implementations of these object could them be named appropriately according to the calendar they implement and be on equal footing to the current set of objects that we intend to support.

**Con:** Gregorian requires knowledge of the fact that the *proleptic gregorian calendar* is what most of the western world uses. This is not knowledge we can assume.

**Con:** `CivilTime` does not in any way depend on the gregorian calendar. In fact it is a secondary characteristic: *the midnight to midnight* day definition. Even in cultures that use the gregorian calendar, this definition may not apply (think Ethiopia). So gregorian would be factually wrong for times and misleading in combination with some calendars.

## Local

**Pro:** Local is the prefix that many languages use for this type of object. It is therefore very intuitive to many users.

**Con:** Local is actually wrong in that it names the one characteristic that these objects do **not** possess: locality.

**Con:** Local is the prefix that many languages use. However the `Civil` objects are part of a larger whole with a very specific mental model. Local violates that mental model and by suggesting analogies to other languages it exacerbates that misunderstanding of the meaning and value of these types.

## Civil

**Pro:** Civil is an usused prefix that suggests that these objects are used to represent things used by civil society.

**Con:** Because Civil is a hitherto unused prefix, it does not lend itself to easy comprehension without the entire mental model.

## Conclusion

We concluded that given the pros and cons, Civil would be the most conducive to our aims of providing a new Date/Time API with a coherent mental model that would allow for correct usage. We concluded that once the first users got hold of these and understood the mental model these objects would become as naturally understood as any of the ones previously introduced in this or other languages.
