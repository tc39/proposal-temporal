Subclass-based Temporal Calendar API
====================================

[calendar-draft.md](calendar-draft.md) discusses a design for calendar support in Temporal based on a single shared Temporal.Date type with a Temporal.Calendar.  This document discusses an alternative approach based on subclassing of Temporal.Date types, which was eliminated due to the drawbacks discussed in this document.

In this document, the *Temporal.Calendar Approach* refers to the solution proposed in [calendar-draft.md](calendar-draft.md), and the *Temporal.Date Subclassing Approach* refers to the alternative, but eliminated, solution proposed in this document.

## Overview

`Temporal.Date` would become a base class.  For example, a class like `HebrewDate` would extend `Temporal.Date`.

## Comparison

### Built-In Calendars

**Temporal.Calendar Approach:** All built-in calendars, including 402 calendars, are all instances of Temporal.Calendar

**Temporal.Date Subclassing Approach:** Every built-in 402 calendar has a corresponding type heirarchy in the Intl namespace

### Custom Calendars

**Temporal.Calendar Approach:** Write an implementation of Temporal.Calendar.

**Temporal.Date Subclassing Approach:** Subclass Temporal.Date or one of its subclasses.

### Enumerable Properties

We tentatively decided in [#403](https://github.com/tc39/proposal-temporal/issues/403) that data properties (like year, month, and day) should be enumerable.

**Temporal.Calendar Approach:** Since the calendar object generally instantiates the Temporal.Date, it can set the correct enumerable properties on each instance when producing it in the factory.  If a Temporal.Date is constructed directly, the behavior depends on the default calendar: if Partial ISO is used, that object need not have any enumerable properties (more elegant); if Full ISO is used, the Temporal.Date constructor should ask Full ISO which fields it should make enumerable (workable but less elegant).

Note that the data fields isoYear, isoMonth, and isoDay should not be enumerable.

Example of a calendar setting enumerable properties:

```javascript
class JapaneseCalendar extends Temporal.Calendar {
    dateFromFields(fields) {
        const { era, year, month, day } = fields;
        const isoYear = // calculate from era and year

        // Temporal.Date constructor takes isoYear, isoMonth, isoDay, and calendar
        const retval = new Temporal.Date(isoYear, month, day, this);

        for (const k of ["era", "year", "month", "day"]) {
            Object.defineProperty(retval, k, {
                value: Temporal.Date.prototype[k],
                enumerable: true
            });
        }

        return retval;
    }
}
```

**Temporal.Date Subclassing Approach:** Each subclass can decide which fields to make enumerable in the constructor.

Example of a subclass setting enumerable properties:

```javascript
class JapaneseDate extends Temporal.Date {
    constructor(era, year, month, day) {
        this.era = era;
        this.year = year;
        this.month = month;
        this.day = day;
    }
}
```

@ptomato said about this:

> I'm not sure this approach would work, since you would have to call `super()` before setting the properties on `this`. By that time you'd already have the Temporal.Date.prototype getters defined, so I think you'd have to take an approach that was more similar to the calendar approach.

### Julian Change Dates

The Temporal.Calendar Approach has a more natural way to implement calendars that themselves have properties.

**Temporal.Calendar Approach:** An instance of Temporal.Calendar can be created to represent a particular change date, and that calendar can be passed around to all Temporal operations.

**Temporal.Date Subclassing Approach:** Each change date would either need its own subclass (impractical, since there are many possible change dates), or a Gregorian Temporal.Date subclass would need to add a stateful field representing the change date.

### MonthDay

MonthDay is a type more naturaly represented by the subclassing approach.

**Temporal.Calendar Approach:** There are several imperfect solutions for the Temporal.MonthDay data model, discussed in [#391](https://github.com/tc39/proposal-temporal/issues/391).  The current workable proposed solution is to make the MonthDay data model the same as the Date data model.

**Temporal.Date Subclassing Approach:** The calendar-specific type, like HebrewMonthDay, can represent data in its on form without risk of ambiguity.






