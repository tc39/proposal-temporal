# Draft Design of Temporal Calendar API

This doc describes a design for first-class support for non-Gregorian [calendars](https://en.wikipedia.org/wiki/Calendar) in Temporal.  Although most of this document is based on Temporal.Date, most of this applies to Temporal.DateTime and Temporal.Time as well.

## Temporal.Date internal slots

Temporal.Date currently has three internal slots: year, month, and day. (An "internal slot" refers to actual data, as opposed to "properties", which could be computed.)  In this proposal, those slots are renamed to `[[IsoYear]]`, `[[IsoMonth]]`, and `[[IsoDay]]`, and an additional `[[Calendar]]` slot is added.  The calendar slot contains an object implementing the Temporal.Calendar interface, described below.

## Temporal.Calendar interface

The new Temporal.Calendar interface is a mechanism to allow arbitrary calendar systems to be implemented on top of Temporal.  ***Most users will not encounter the Temporal.Calendar interface directly***, unless they are building or using a non-built-in calendar system.

An open question is whether this "interface" should be a protocol or an identity.
See [issue #289](https://github.com/tc39/proposal-temporal/issues/289).
The following section assumes it is a protocol.

### Methods on the Temporal.Calendar interface

All of the following methods return new Temporal objects.

```javascript
class MyCalendar {

	///////////////////
	//  To/From ISO  //
	///////////////////

	/** Returns the projection of self in the ISO calendar */
	toISO(
		self: Temporal.Date
	) : Temporal.Date;

	/** Returns the projection of isoDate in the custom calendar */
	fromISO(
		isoDate: Temporal.Date
	) : Temporal.Date;

	/** Constructs a Temporal.Date from a free-form option bag */
	fromFields(
		fields: object
	) : Temporal.Date;

	/** A string identifier for this calendar */
	id : string;

	//////////////////
	//  Arithmetic  //
	//////////////////

	/** Returns self plus duration according to the calendar rules. */
	plus(
		self: Temporal.Date,
		duration: Temporal.Duration,
		options: /* options bag */
	) : Temporal.Date;

	/** Returns self minus duration according to the calendar rules. */
	minus(
		self: Temporal.Date,
		duration: Temporal.Duration,
		options: /* options bag */
	) : Temporal.Date;

	/** Returns self minus other, which are dates in the same calendar. */
	difference(
		self: Temporal.Date,
		other: Temporal.Date,
		options: /* options bag */
	) : Temporal.Duration;

	////////////////////////////////////
	//  Accessors:                    //
	//  Semantics defined in date.md  //
	////////////////////////////////////

	year(
		self: Temporal.Date
	) : number;

	month(
		self: Temporal.Date
	) : number;

	day(
		self: Temporal.Date
	) : number;

	dayOfWeek(
		self: Temporal.Date
	) : number;

	weekOfYear(
		self: Temporal.Date
	) : number;

	daysInMonth(
		self: Temporal.Date
	) : number;

	daysInYear(
		self: Temporal.Date
	) : number;

	leapYear(
		self: Temporal.Date
	) : boolean;
}
```

The corresponding fields on Temporal.Date.prototype should forward requests to the calendar as discussed in [#291](https://github.com/tc39/proposal-temporal/issues/291):

```javascript
get foo(...args) {
  return this.calendar.foo?.(this, ...args);
}
```


Calendars can add additional *calendar-specific accessors*, such as the year type ("kesidran", "chaser", "maleh") in the Hebrew calendar, and may add conforming accessor methods to Temporal.Date.prototype.

An instance of `MyCalendar` is *expected* to have stateless behavior; i.e., calling a method with the same arguments should return the same result each time.  There would be no mechanism for enforcing that user-land calendars are stateless; the calendar author should test this expectation on their own in order to prevent unexpected behavior such as the lack of round-tripping.

## Default Calendar

An open question is what the behavior should be if the programmer does not specify a calendar, or if we should require the programmer to always specify a calendar.  Four choices are on the table:

1. Default to full ISO (Gregorian) calendar.
2. Require the user to explicitly specify the calendar.
3. Default to a partial ISO calendar (explained below).
4. Default to `Intl.defaultCalendar` (a new symbol), or ISO if that field doesn't exist.

### Partial ISO Calendar (Option 3)

A partial ISO calendar would be one implemented as follows:

```javascript
const PartialIsoCalendar = {
	[Temporal.Calendar.toISO] = (self) => {
		return self;
	},

	[Temporal.Calendar.fromISO] = (isoDate) => {
		return isoDate;
	},

	[Temporal.Calendar.id] = "iso",

	// ALL OTHER METHODS:
	[Temporal.Calendar.plus] = () => {
		throw new TypeError("Unsupported operation: full calendar required");
	}
	// Same for [Temporal.Calendar.minus], etc.
}
```

It would in effect render default Temporal.Date (and Temporal.DateTime) with fewer operations until you specify a calendar.  The following methods/getters would throw:

- .dayOfWeek
- .weekOfYear
- .daysInMonth
- .daysInYear
- .leapYear
- .plus() -- *might* be OK if the programmer requests only time units
- .minus() -- *might* be OK if the programmer requests only time units
- .difference() -- *might* be OK if the programmer requests only time units
- .getYearMonth()
- .getMonthDay()

The following methods/getters would still work:

- .with()
- .withTime()
- .toString()
- .toLocaleString()
- .compare()

Although small, this set of operations still covers many of the recipes in the proposed Temporal Cookbook.

To enable the extended set of operations, the user would just use `.withCalendar()`:

```javascript
// Force the Gregorian calendar:
Temporal.Date.from("2019-12-06").withCalendar("gregory").weekOfYear;

// Use a calendar from another source:
Temporal.Date.from("2019-12-06").withCalendar(Intl.defaultCalendar).weekOfYear;
Temporal.Date.from("2019-12-06").withCalendar(request.calendar).weekOfYear;
```

The calendar IDs are less clear.  If the partial ISO calendar used ID `"iso"`, then what would the full ISO calendar use?  ID "gregory" ([why not "gregorian"?](https://github.com/tc39/ecma402/issues/212)) is misleading because there are Gregorian calendars that do not all agree on the same rules for things like weeks of the year.  One solution could be to use a nullish ID like `null` or `""` for the partial ISO calendar and `"iso"` for the full ISO calendar.  Alternatively, "iso8601", the identifier defined by CLDR as "Gregorian calendar using the ISO 8601 calendar week rules", could be the identifier for the full ISO calendar.

### Default Calendar Options: Pros and Cons

| Description | Full ISO (option 1) | No Default (option 2) | Partial ISO (option 3) | User Preference (option 4) |
|-------------|---------------------|-----------------------|------------------------|----------------------------|
| API consistency & predictability | 😃 Consistent and predictable | 😃 Consistent and predictable | 😐 Predictable behavior, but call sites may or may not require an explicit calendar | ☹️ Consistent API, but unpredictable behavior based on user's or server's location |
| Impact on Temporal call sites | 😃 No changes | ☹️ All call sites require extra boilerplate | 🙂 Most* operations work; some require extra boilerplate | 😃 No changes |
| Impact on i18n correctness | ☹️ Programmer needs to know to "opt in" to use the user's calendar preference | 😃 All operations require an explicit choice | 😃 Calendar-sensitive operations require an explicit choice | 🙂 Correct on front end, but programmer needs to know to "opt in" on back end |
| Impact on interoperability | 😃 ISO is the industry standard format | 😃 Explicit choice | 😃 I/O operations operate in the ISO calendar space | ☹️ Temporal objects may not interop with the ISO calendar |

\**See https://github.com/tc39/proposal-temporal/issues/240#issuecomment-557726669*

## Temporal.Date API changes

### New Temporal.Date instance methods

The following methods involving ISO conversion would be added:

```javascript
Temporal.Date.prototype.toISO = function(): Temporal.Date {
	const isoDate = this.calendar.toISO(this);
	// assert: isoDate.calendar === Temporal.Calendar.iso
	return isoDate;
}

// Temporal.Date.prototype.with does *not* modify the calendar. A new method
// is added for that:

Temporal.Date.prototype.withCalendar = function(newCalendar: Calendar) {
	const isoDate = this.toISO();  // note: call intrinsic version
	const otherDate = newCalendar.fromISO(isoDate);
	// assert: otherDate.calendar === newCalendar
	return otherDate;
}
```

### ISO strings with calendar hint

This is an open question being discussed in [#293](https://github.com/tc39/proposal-temporal/issues/293).  The issue is that we do not want `toString()` to be lossy by losing the `calendar` field.  One proposal is to append the `Temporal.Calendar.id` field in `[c=ID]` following the date.  For example, `2019-12-06[c=hebrew]` refers to 2019-12-06 projected into the Hebrew calendar.

```javascript
Temporal.Date.prototype.toString = function() {
	let calendarKeyword, isoDate;
	// For Default Calendar Option 3, check for the partial ISO calendar here
	if (/* this.calendar is the ISO calendar */) {
		calendarKeyword = null;
		isoDate = this;
	} else {
		calendarKeyword = this.calendar.id;
		isoDate = this.toISO();  // call intrinsic
	}
	// return an ISO string for isoDate with calendar in brackets:
	// "2019-12-06[c=hebrew]"
}
```

In this scenario, `Temporal.Date.from` would take a new optional `options` argument, with a single field `idToCalendar` specifying a function to map from identifiers to Calendar objects.  If not present, the `Intl.Calendar` namespace will be searched.  Example call site with custom calendars:

```javascript
const fooCalendar = new FooCalendar();

Temporal.Date.from("2019-12-03[foo]", {
	idToCalendar: function(id) {
		if (id === "foo") {
			return fooCalendar;
		}
		return null;
	}
});
```

### New behavior of Temporal.Date.from

The exact behavior of this method depends on a few open discussions, but some logic will be passed to the Calendar object in order to project the date into the correct calendar system.

Potential example implementation:

```javascript
Temporal.Date.from = function(thing: string | object, options: object) {
	if (typeof thing === "string") {
		object = // components of string
	}

	const isoDate = // a date in the ISO calendar with fields from object

	if (typeof object.calendar === "string") {
		// Note: Do we want this implicit escape hatch? If a lookup function is provided,
		// maybe it should be treated as 100% authoritative.
		const calendar = options?.idToCalendar?.(object.calendar)
			?? Temporal.Calendar.idToCalendar(id);  // call intrinsic
		if (!calendar) {
			throw new RangeError("Unknown calendar");
		}
		if (calendar[Temporal.Calendar.id] !== object.calendar) {
			throw new RangeError("Calendar IDs do not match")
		}
		return isoDate.withCalendar(calendar);  // call intrinsic
	} else if (object.calendar) {
		return isoDate.withCalendar(object.calendar);  // call intrinsic
	} else {
		return isoDate;
	}
}
```

### Semantics of existing Temporal.Date instance methods

As discussed earlier, Temporal.Date will defer to Temporal.Calendar methods wherever necessary.  Example implementation of selected Temporal.Date methods:

```javascript
Temporal.Date.prototype.plus = function(duration) {
	return this.calendar.plus(this, duration);
}

Temporal.Date.prototype.difference = function(other) {
	if (other.calendar !== this.calendar) {
		// Note: call intrinsic versions of these methods
		other = other.toISO().withCalendar(this.calendar);
	}
	return this.calendar.difference(this, other);
}

```

## Other Temporal.Date constructors

### Temporal.Absolute.prototype.inTimeZone

The third way to get a Temporal.Date (besides from a string and an object) is to convert it from a Temporal.Absolute.

The API here would depend on the decision for whether to require an explicit default calendar.  If we decide to use a default calendar (options 1, 3, and 4), no API change would be required for this method.  If we decide to require an explicit calendar, then the API would likely be changed as follows:

```javascript
// Default calendar option 2 only
Temporal.Absolute.prototype.inTimeZone = function(timeZone, calendar) {
	const isoDate = // compute the ISO date from the time zone
	return calendar.fromISO(isoDate);
}
```

### Temporal.now

The fourth way to get a Temporal.Date is to get the current time according to the environment (or mocked for SES).

As above, this API depends on whether we decide to use a default calendar.  If we require an explicit calendar, it would be similar to above:

```javascript
Temporal.now.date = function(calendar) {
	const absolute = Temporal.now.absolute();  // use intrinsic
	const timeZone = Temporal.now.timeZone();  // use intrinsic
	return absolute.inTimeZone(timeZone, calendar);  // use intrinsic
}
```

## Changes to other Temporal APIs

All of the following APIs would gain an internal slot for the calendar.

- Temporal.DateTime
- Temporal.Time
- Temporal.YearMonth
- Temporal.MonthDay

In addition, Temporal.DateTime would gain the two other slots from Temporal.Date (*era* and *isLeapMonth*).
