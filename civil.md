# The naming of objects not tied to a specific time-zone

Famous quote:

    There are only two hard things in Computer Science: cache invalidation and naming things.

    -- Phil Karlton

Infamous quote:

    Cache invalidation is easy if you don't use a cache.

    -- Phil Dunkel

Which leaves us with a *hard problem in computer science*: the naming of the `Civil` family of objects.

**There are a set of objects that represents dates, times, as well as aggregations and parts thereof which do not contain enough data to tie them to a specific timezone or locality: what do we call them?**

Before we talk about how to name them, we should be clear on what things we are naming and the [mental model](./mentalmodel.md) they represent:

 * `XxxDate` represens a date without a time that is not tied to a specific time-zone (eg: date of birth 1st January 1980)
 * `XxxTime` represents a time without a date that is not tied to a specific time-zone (eg: shop opens at 8am, unchanged by daylight saving)
 * `XxxDateTime` represents a date and time that is not tied to a specific time-zone
 * `XxxYearMonth` repreents a year and month without a day or time that is not tied to a specific time-zone (eg: credit card expiry of July 2019)
 * `XxxMonthDay` represents a day and month without a year or time that is not tied to a specific time-zone (eg: date the repeats each year, 25th of December);

The key aspect is that they are not fixed points in time on the globally unique time-line. Instead, the values are useful in daily life where the time-zone is fixed and essentially ignored. This provides flexibility - for example three people might celebrate their birthday on the 1st January, one in London, one in New York and one in Sydney. But the exact period of 24 hours that is celebrated by each person  is different thanks to time-zones.

**Options:**

 * `Gregorian*` since they are specific to the Gregorian Calendar.
 * `Local*` since they look like what we use to talk about our local time.
 * `Civil*` since they look like what we use in civil life.

## Gregorian

**Pro:** The reason `Gregorian` was suggested was in view of the fact that we are limiting ourselves to the gregorian calendar. Future implementations of these objects could then be named appropriately according to the calendar they implement and be on equal footing to the current set of objects that we intend to support.

**Con:** Despite appearances, the date class conceptually represents a date irrespective of any calendar system. You only need one representation of a date in the domain model, with calendar system output a localization issue. The date class exposes year/month/day because it is convenient for the vast majority of use cases to do so.

**Con:** Gregorian requires knowledge of the fact that the *proleptic gregorian calendar* is what most of the western world uses. This is not knowledge we can assume.

**Con:** `CivilTime` does not in any way depend on the gregorian calendar. In fact it is a secondary characteristic: *the midnight to midnight* day definition. Even in cultures that use the gregorian calendar, this definition may not apply (think Ethiopia). So gregorian would be factually wrong for times and misleading in combination with some calendars.

## Local

**Pro:** Local is the prefix that many programming languages use for exactly these types of object for around 20 years. It is therefore very intuitive to many users and widely defined in internet searches and help forums.

**Pro:** ISO-8601 used "local time" over 20 years ago for the concept:

> 2.1.16 local time: locally applicable time of day such as standard time of day, or a non-UTC based time of day"

The key is that it is "locally applicable", not that it implies a location.

**Pro:** The term "local time" is in widespread use, both in scholarly articles and common parlance. For example, airline pilots will typically say "when we land the local time will be 7pm".

**Con:** Local names a characteristic that these objects do not possess: locality. But surely this misunderstands how "local" is used in English - as with the airline case, the phrase "local time" doesn't refer to knowledge of the locality, but the absence of needing to worry about it on your watch/phone once it is set correctly. As a related example, talking about your "local shop" doesn't require identifying a specific shop in a specific locality. Instead it is a phrase used to discuss whatever the shop nearest to you is, something that varies depending on where you are.

## Civil

**Pro:** Civil is an usused prefix that suggests that these objects are used to represent things used by civil society.

**Con:** Because Civil is a hitherto unused prefix, it does not lend itself to easy comprehension without the entire mental model.

**Con:** Some will consider "civil" to be naming the calendar system, effectively bringing all the cons listed in that section above.

**Con:** Relatively few non-English speakers will know what Civil means.

## Conclusion

We concluded that given the pros and cons, Civil would be the most conducive to our aims of providing a new Date/Time API with a coherent mental model that would allow for correct usage. We concluded that once the first users got hold of these and understood the mental model these objects would become as naturally understood as any of the ones previously introduced in this or other languages.
