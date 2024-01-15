# Supporting Calendar Systems in Temporal

[ECMAScript Temporal](https://github.com/tc39/proposal-temporal/) is the new date and time API for ECMAScript.
Because ECMAScript is designed for global audiences, high-quality internationalization is a design goal.

This document discusses why and how calendar systems are included in the Temporal API, explains problems we expect developers to encounter with calendars, and outlines how to avoid those problems.
A final section explains alternative designs for using calendar systems in Temporal, along with an explanation of why the current approach was chosen instead.

## Background and Motivation

Calendar systems provide a way to assign human-readable numbers, such as year, month, and day, to a particular period of time.

Much of the world uses the Gregorian calendar system, which uses solar years, months, and days: over time, it remains synchronized with the cycle of the seasons.
However, there are other calendar systems used throughout much of the world.
Some popular calendar systems include Hebrew, Islamic, Buddhist, Hindu, Chinese, Japanese, and Ethiopic.

Today's date is March 4, 2021 in the Gregorian calendar.
Here are several other representations of that date:

<!-- prettier-ignore-start -->

- 20 Adar 5781 (Hebrew)
- Rajab 20, 1442 AH (Islamic, Umm al-Qura)
- March 4, 2564 BE (Thai Buddhist)
- 令和3年3月4日 == March 4, 3 Reiwa (Japanese)

<!-- prettier-ignore-end -->

Non-Gregorian calendar systems are used in day-to-day life in several countries, particularly those with weaker cultural and economic ties to Gregorian-dominant Western countries, as well as in religious, cultural, and academic applications.
For example, several countries including Japan, China, Iran, Afghanistan, Saudi Arabia, and Taiwan use non-Gregorian calendars for at least some official government purposes.
Beyond those official uses, a majority of the world's population lives in countries that use non-Gregorian calendars to determine the dates of religious or cultural holidays.

### Calendars in Business Logic (Not Only String Localization)

Calendar systems play an important role in localization (l10n).
They enable a human-friendly display representation of timestamps, dates, and times.

However, calendar systems also play an important role in the business logic of an application.
Applications involving dates intended for human consumption must consider the calendar system when performing arithmetic or any other business-logic operation that uses months and years.
Examples of calendar-sensitive operations include:

- What is the date one month from today?
- What is the first day of the month?
- On what month and day do I celebrate my birthday or anniversary?
- On what day do I celebrate a religious or cultural holiday, like Ramadan, Passover, Easter, or the Chinese Lunar New Year?

In other words, units of time greater than a solar day are inherently dependent on the calendar system.
The only universal solution to date arithmetic would be to omit the concept of months and years, but a date API without months and years would be insufficient for many use cases.

### Why Are Calendars a Higher Priority for ECMAScript vs. Other Platforms?

Problems integrating calendar systems into Temporal are obvious, especially the "Unexpected Calendar Problem" ([see below](#the-unexpected-calendar-problem)), where code breaks when presented with a calendar it wasn’t designed to handle.
What's less clear are the benefits of integrating calendars in Temporal that can outweigh those problems.
One way to understand these benefits is to highlight differences between the needs of the ECMAScript ecosystem compared to other platforms like Java and .NET which have taken a different approach to handling calendars.
Some of these differences include:

- As is well described in the [notes of Java's design of its date/time API](https://github.com/ThreeTen/threeten/wiki/Multi-calendar-system), most code in enterprise apps uses the ISO calendar.
  But relative to Java/.NET, the ECMAScript ecosystem's center of gravity includes relatively more consumer and in-browser use cases.
  Those use cases are where non-ISO calendar usage is concentrated.
- Usage of non-ISO calendars is heaviest in emerging markets. Given the rapid growth of smartphone adoption among the Next Billion Users, we expect increased demand for locally-specific tech in these markets, which in turn will drive more usage of non-ISO calendars.
- The ECMAScript standard library is 1-2 orders of magnitude smaller than Java and .NET, which often leads to ECMAScript apps using 100+ OSS libraries (including transitive dependencies).
  Because i18n in ECMAScript requires both platform _and_ library support, ECMAScript API patterns often nudge library developers to write globalized code, even if it requires somewhat more work.

Choosing the current design was not easy, because it will cause more bugs in ISO-only software than other possible solutions.
But, given global trends in economic growth, population growth, and tech adoption, the consensus of this proposal's champions is that the current design is a reasonable tradeoff for long-term success in an increasingly global ECMAScript developer community.

### Intl-First Design

ECMAScript supports internationalization (i18n) as a primary feature.
The i18n subcommittee, TC39-TG2, evangelizes "Intl-first design."
Two principles of Intl-first design are (1) language- and region-dependent operations should be data-driven, and (2) user preferences should be an explicit input to APIs.
These principles help ensure that APIs work well for developers targeting a wide range of end-users around the world.

Temporal applies these design principles by abstracting calendar-specific logic and by making the calendar an explicit choice when constructing objects.
The result is an API that supports use cases like the ones listed above for regions that use only Gregorian and for those that have other calendar systems in common use.

### Using Calendars in Temporal Code

The following section shows how calendar systems are exposed in Temporal code. For a more thorough discussion, see the [documentation](https://tc39.es/proposal-temporal/docs/calendar.html).

In Temporal, every object that includes date fields also has a calendar field.
For example, both of the following lines result in a `Temporal.PlainDate` instance that represents 23 Adar I 5779 in the Hebrew calendar:

```javascript
// Create a Hebrew date from a bag of fields
Temporal.PlainDate.from({
  year: 5779,
  monthCode: 'M05L',
  day: 23,
  calendar: 'hebrew'
});

// Create an ISO date and convert it to Hebrew
Temporal.PlainDate.from('2019-02-28').withCalendar('hebrew');
```

Internally, the day is always represented in the ISO calendar, meaning that if the calendar annotation gets dropped, the day remains the same.
This is true for both the internal slots of Temporal types and the string representation.
Thus, the following two lines also result in the same 23 Adar I 5779 instance:

```javascript
// Parse from an annotated ISO string (IETF RFC pending)
Temporal.PlainDate.from('2019-02-28[u-ca=hebrew]');

// Feed the internal data model via the constructor
new Temporal.PlainDate(2019, 2, 28, 'hebrew');
```

Operations on Temporal instances interpret all month, day, and year values in context of the calendar system.
For example:

```javascript
date = Temporal.PlainDate.from('2019-02-28[u-ca=hebrew]');
date.with({ day: 1 }); // => 2019-02-06[u-ca=hebrew]
date.with({ day: 1 }).toLocaleString('en-US', { calendar: 'hebrew' }); // => '1 Adar I 5779'
date.year; // => 5779
date.monthCode; // => 'M05L'
date.month; // => 6
date.day; // => 23
date.inLeapYear; // => true
date.calendarId; // => 'hebrew'
inFourMonths = date.add({ months: 4 });
inFourMonths.toLocaleString('en-US', { calendar: 'hebrew' }); // => '23 Sivan 5779'
inFourMonths.withCalendar('iso8601'); // => 2019-06-26
date.until(inFourMonths, { largestUnit: 'month' }); // => P4M
```

By definition, creating a bag of fields with year, month, and day requires choosing a calendar system.
We elide the ISO calendar if no other calendar system is specified in this situation, and it is the only place Temporal performs calendar elision:

```javascript
Temporal.PlainDate.from({ year: 2019, month: 2, day: 28 });
```

The following Temporal types all carry a calendar: `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainYearMonth`, `Temporal.PlainMonthDay`

## The Unexpected Calendar Problem

Integrating calendar awareness into many Temporal operations is essential for a global audience, but it introduces a new problem: if code is written to assume one calendar system, bugs may result if a different calendar system is introduced instead.
Introducing unexpected calendars could also be a vector for malicious activity.

This section describes this problem, which we call the "Unexpected Calendar Problem," and how to mitigate it in userland Temporal code.

### Problem Definition

Below is a canonical example of this problem: a function which tests whether a particular date is the last day of the year.
It assumes a calendar with 12 months and whose last month is 31 days long.

```javascript
function isLastDayOfYear(date) {
  // Note: This is a BAD example!
  return date.month === 12 && date.day === 31;
}

// works for ISO calendar
isLastDayOfYear(Temporal.PlainDate.from('2019-12-31')); // => true
isLastDayOfYear(Temporal.PlainDate.from('2020-01-01')); // => false

// fails for some non-ISO calendars
hebrewNewYearsEve = Temporal.PlainDate.from({
  year: 5780,
  monthCode: 'M12',
  day: 29,
  calendar: 'hebrew'
});
isLastDayOfYear(hebrewNewYearsEve); // => false
// (desired: true)
```

### Mitigating the Unexpected Calendar Problem

There are two ways to avoid the Unexpected Calendar Problem: the preferred solution of writing calendar-safe code, or a fallback option to validate or coerce inputs to a known calendar.

#### Writing Calendar-Safe Code

The best way to mitigate the Unexpected Calendar Problem is to write "calendar-safe" code that works for all built-in calendars.
For example, the function above can easily be written to be calendar-safe by using the `monthsInYear` and `daysInMonth` properties instead of hard-coding ISO constants.
Developers who follow documented [best practices for writing calendar-safe Temporal code](https://tc39.es/proposal-temporal/docs/calendar.html#writing-cross-calendar-code) will be able to use the same code for all built-in calendars.

Beyond documentation, the Temporal API itself has been designed to make it easier to write calendar-safe code.
For example:

- All built-in calendars (including ISO) use the same set of date fields: `year`, `month`, `day`, and `monthCode`.
  These fields act the same way in all built-in calendars.
- The `month` property is a continuous (no gaps), 1-based index of the month in the current year.
  This aligns with ISO behavior and avoids unexpected behavior from lunisolar calendars where each year may have a different set of months.
  A separate `monthCode` string field is used for a year-independent month identifier.
- The `year` property is a signed value that's relative to a specific "default era" for each calendar.
  This matches ISO calendar behavior and prevents bugs from, for example, eras like B.C. where years count backwards.
  Separate `eraYear` and `era` fields are used for measuring years within the context of non-default eras.
- Differences between calendars are exposed via convenience properties available in every calendar, e.g. `monthsInYear`, `daysInMonth`, `inLeapYear`, etc.
  Userland code can completely avoid the use of calendar-specific constants (e.g. 12 months per year) by using these properties.
- There is never an implicit default calendar system.
  Developers must explicitly decide whether they're using the ISO calendar or another calendar.
  For example, shortcut methods on the `Temporal.Now` object are named with an ISO suffix to avoid ambiguity, such as `Temporal.Now.zonedDateTimeISO()`.
- Temporal never infers a calendar from the user's environment.
  Introducing a calendar system into a program requires a conscious, opt-in decision on the part of the developer of the app, library, or input source.

#### Validating or Coercing Inputs

Even though Temporal makes it straightforward to write calendar-safe code, doing so still requires work from developers.
Some developers won't do this work.
Sometimes this will be because they don't know about or don't understand non-ISO calendars.
In other cases, developers won't bother to follow best practices because they expect to only be dealing with ISO-calendar data.
Even if a developer conscientiously follows best practices in their own code, most ECMAScript apps have many library dependencies that may not do so.
Or they may have to interoperate with existing code that cannot be changed due to time constraints.

In these situations, the developer should ensure that inputs to that code are either (a) validated to ensure the input is in the expected calendar system, or (b) coerced to that system. Whether to validate or coerce depends on the use case.

To coerce:

```javascript
date = date.withCalendar('iso8601');
```

To validate:

```javascript
if (date.calendarId !== 'iso8601') throw new Error('invalid calendar');
```

Note that "inputs" are not only external data. Inputs could include values returned from library dependencies, e.g. date pickers.
Unless the library or input source guarantees a certain calendar system, defensive code should assume Temporal objects (or strings or objects that will be converted into a Temporal object) to be "external" and subject to validation or coercion to the ISO calendar if the code that will use that data is not calendar-safe.

## Alternatives Considered

Integrating calendars into Temporal was one of the most challenging parts of designing the API.
Below is a quick discussion about alternative calendar APIs we considered before adopting the current design.
Note that none of the options considered (including the current Temporal design) are ideal; they all have known flaws that require workarounds for some cases.
We believe that the current design is the best option overall, relative to the alternatives below.

### Alternative 1: No Calendar in the Data Model

An alternative approach to the current Temporal design would have been to store calendar information separately from Temporal instances.
This approach would have the advantage of avoiding the Unexpected Calendar Problem, but at significant ergonomic cost:

- Calendar-specific fields (e.g. `month`, `day`, `year`) and convenience properties (e.g. `daysInMonth`, `inLeapYear`) could not be parameterless getters anymore.
  Instead, users would have to call methods to get calendar-specific values, e.g. `date.calendarMonth('chinese')`
- Most methods (`add`, `subtract`, `round`, `until`, `since`, `with`, maybe `toPlainMonthDay`, `compare`, `equals`, and a few others too) would require a calendar option to be able to use calendar-specific months, days, or years.
  Example: `date.add({months: 2}, {calendar: 'chinese'})`
- Chaining multiple operations (e.g. `.add({months: 2}).with({day: 1})`) gets less ergonomic and more bug-prone because the same calendar value must be used in all chained calls.
- The `Temporal.PlainMonthDay` type would become challenging to reason about without a calendar attached because month/day values like birthdays and holidays are inherently calendar-specific and have no ISO counterpart.
  This is especially true in lunisolar calendars like Hebrew and Chinese where ordinal month numbers vary from year to year for the same month.
  (Current Temporal uses a string [`monthCode`](./docs/plaindate.md#monthCode) field to describe year-independent months.)
  For example, a birthday on 12 Adar I in the Hebrew calendar is currently modelled as

  ```javascript
  Temporal.PlainMonthDay.from({ monthCode: 'M05L', day: 12, calendar: 'hebrew' });
  ```

  It's not clear how we'd model holidays in these calendars if the calendar isn't stored in the instance.

- Code that wants to return a date along with its calendar can no longer return a single Temporal instance.
  Instead, it must return a compound object or serialized string.
  For example, a date picker that returned a date in the user's preferred calendar could no longer return a `Temporal.PlainDate`.
  Instead, it'd have to return a tuple or compound object like `{date, calendar}`.
  Passing around compound objects (or extra calendar parameters) would complicate all calendar-using Temporal code.

The Temporal champions believe that the ergonomic challenges of this alternative are worse than the work required to mitigate the Unexpected Calendar Problem.

### Alternative 2: Separate ISO and Calendar Properties

It would be possible to retain the calendar in Temporal objects' data model without being vulnerable to the Unexpected Calendar Problem, but doing so would involve a significant increase in Temporal surface area.
Below is one way it could be done.

- Offer two sets of fields, e.g. `.isoMonth` vs. `.calendarMonth` (or `month` vs. `calendarMonth` for brevity and to encourage developers who are unfamiliar with calendars to be nudged to use ISO fields?)
  - The number and types of `calendar*` fields are completely up to the calendar implementation.
    Built-in calendars will all offer `calendarDay`, `calendarMonth`, `calendarMonthCode`, `calendarYear`, and sometimes `calendarEra` and `calendarEraYear` too.
  - Temporal APIs that accept property bag parameters will accept either calendar fields or ISO fields, BUT NOT BOTH.
    `date.with({calendarYear: 5780, isoMonth: 12}) `should throw.
    BTW, this may be enforceable via TS and ESLint for design-time DX.
  - Trying to read `calendar*` fields would throw if the calendar is ISO because there is no human calendar defined.
  - Non-field convenience properties (e.g. `dayOfYear`, `inLeapYear`, etc.) would also be duplicated.
    The non-`calendar` variants of these fields would report the ISO values.
- `Temporal.Duration` would gain a `calendar` field.
  - Instances using the ISO calendar would only support ISO fields: `days`, `weeks`, `months`, and `years`.
  - Instances using a non-ISO calendar would only support calendar fields: `calendarDays`, `calendarWeeks`, `calendarMonths`, and `calendarYears`.
  - String parsing and serialization would use calendar annotations like other Temporal types, e.g. `'P2D[u-ca=chinese]'`.
    Strings without an annotation would assume the ISO calendar.
  - `until` and `since` are now ambiguous, so they’d need a way to indicate whether the output should be an ISO duration or a non-ISO one.
    Options include:
    - Split each method into "iso" and "calendar" variants, e.g. `isoUntil` vs. `calendarUntil` or `untilISO` vs. `untilCalendar`
    - Always return both flavors, e.g. `foo.until(bar).isoDuration` and `foo.until(bar).calendarDuration`.
    - Use an option, e.g. `{ resultFields: 'iso' | 'calendar' }`.
      FWIW, I'm not sure that this option would work well with TS in cases where options are not specified as a literal in the API call.
  - There would NOT be a `withCalendar` method on durations, because durations don't have the ability to convert between calendar and ISO data.
    Instead, they would either have ISO fields or calendar fields, but not both.

After considering this and similar options, the champions decided that the additional complexity wasn't worth it.
In particular, we were concerned that the dual-property approach would be more confusing and would result in more bugs than teaching users to validate or coerce inputs.

### Alternative 3: Subclasses

Instead of having the calendar system be a slot of the PlainDate type, we considered keeping PlainDate as an ISO-only type, with subclasses for all other calendar systems, such as PlainHebrewDate, PlainChineseDate, and so on.
Read more in the [discussion on calendar subclassing](https://github.com/tc39/proposal-temporal/blob/main/docs/calendar-subclass.md).

We decided against the calendar subclassing approach because:

- If each subclass has its own unique set of methods, trans-calendar code becomes difficult to write, and benefits of polymorphism and subclassing are lost.
  On the other hand, if each subclass has the same set of methods as PlainDate, the external behavior is the same as if the calendar were a pluggable slot.
- The space of possible calendar systems is large (and, theoretically, unbounded), resulting in a large number of PlainDate subclasses.
- Each individual subclass would need to define its own data model, increasing the surface of the specification.

In the end, the champions decided that the subclassing approach brought a high cost with no clear benefit over the other approaches, and that keeping all calendar-sensitive operations neatly organized into the Temporal.Calendar object resulted in a cleaner model.

### Alternative 4: Separate Types for Calendared Dates

This approach would mean introducing a new type that carries a date without a calendar system, to supplement the type with the calendar system. Most documentation would recommend the calendar-agnostic type except when calendar-aware logic is necessary. We discuss this approach in more detail as [Option 5 in calendar-draft.md](https://github.com/tc39/proposal-temporal/blob/main/docs/calendar-draft.md#new-non-calendar-types-option-5).

We decided against the dual classes approach because:

1. If the new type were truly calendar-agnostic, it could not support month and year arithmetic, because doing so would introduce an ISO bias.
2. If the new type had ISO-like behavior for months and years, then it is no different from PlainDate with an ISO calendar.

Note that (2) is true for ECMAScript because it is dynamically typed. Statically typed languages could enforce compile-time type checking for (2) that is not possible in ECMAScript. Note also that clients such as TypeScript can treat PlainDate as having a type parameter corresponding to the calendar system in order to enforce more compile-time type checking of calendar systems. Separate data types are not necessary for that validation.
