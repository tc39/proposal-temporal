# Draft Design of Temporal Calendar API

This doc describes a design for first-class support for non-Gregorian [calendars](https://en.wikipedia.org/wiki/Calendar) in Temporal.  Although most of this document is based on Temporal.Date, most of this applies to Temporal.DateTime and Temporal.Time as well.

## Temporal.Date internal slots

Temporal.Date currently has three internal slots: year, month, and day. (An "internal slot" refers to actual data, as opposed to "properties", which could be computed.)  In this proposal, three more internal slots would be added:

1. calendar
2. isLeapMonth
3. era

It is believed that a date in any known calendar can be described using the five-tuple (*year*, *month*, *day*, *isLeapMonth*, *era*).  Since all operations involving the slots of Temporal.Date will go through the calendar first, calendars that need more data can assign complex types to these slots.  It is possible that *isLeapMonth* can be merged into *month* by expanding the set of numbers that *month* can represent.

The *calendar* slot contains an object implementing the Temporal.Calendar interface, described below.

## Temporal.Calendar interface

The new Temporal.Calendar interface is a mechanism to allow arbitrary calendar systems to be implemented on top of Temporal.  ***Most users will not encounter the Temporal.Calendar interface directly***, unless they are building or using a non-built-in calendar system.

An open question is whether this "interface" should be a protocol or an identity.  See issue #289.  The following section assumes it is a protocol.

### Methods on the Temporal.Calendar interface

All of the following methods return new Temporal objects.  All properties of `Temporal.Calendar` are Symbols.

```javascript
class MyCalendar {

	///////////////////
	//  To/From ISO  //
	///////////////////

	/** Returns the projection of self in the ISO calendar */
	[Temporal.Calendar.toISO](
		self: Temporal.Date
	) : Temporal.Date;

	/** Returns the projection of isoDate in the custom calendar */
	[Temporal.Calendar.fromISO](
		isoDate: Temporal.Date
	) : Temporal.Date;

	/** A string identifier for this calendar */
	[Temporal.Calendar.id] : string;

	//////////////////
	//  Arithmetic  //
	//////////////////

	/** Returns self plus duration according to the calendar rules. */
	[Temporal.Calendar.plus](
		self: Temporal.Date,
		duration: Temporal.Duration,
		options: /* options bag */
	) : Temporal.Date;

	/** Returns self minus duration according to the calendar rules. */
	[Temporal.Calendar.minus](
		self: Temporal.Date,
		duration: Temporal.Duration,
		options: /* options bag */
	) : Temporal.Date;

	/** Returns self minus other, which are dates in the same calendar. */
	[Temporal.Calendar.difference](
		self: Temporal.Date,
		other: Temporal.Date,
		options: /* options bag */
	) : Temporal.Duration;

	////////////////////////////////////
	//  Accessors:                    //
	//  Semantics defined in date.md  //
	////////////////////////////////////

	[Temporal.Calendar.dayOfWeek](
		self: Temporal.Date
	) : number;

	[Temporal.Calendar.weekOfYear](
		self: Temporal.Date
	) : number;

	[Temporal.Calendar.daysInMonth](
		self: Temporal.Date
	) : number;

	[Temporal.Calendar.daysInYear](
		self: Temporal.Date
	) : number;

	[Temporal.Calendar.leapYear](
		self: Temporal.Date
	) : boolean;
}
```

It's not immediately clear how to make *calendar-specific accessors* available, such as the year type ("kesidran", "chaser", "maleh") in the Hebrew calendar.  See #291.

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

*\* See https://github.com/tc39/proposal-temporal/issues/240#issuecomment-557726669*

## Temporal.Date API changes

### New Temporal.Date instance methods

The following methods involving ISO conversion would be added:

```javascript
Temporal.Date.prototype.toISO = function(): Temporal.Date {
	const isoDate = this.calendar[Temporal.Calendar.toISO](this);
	// assert: isoDate.calendar === Temporal.Calendar.iso
	return isoDate;
}

// Temporal.Date.prototype.with does *not* modify the calendar. A new method
// is added for that:

Temporal.Date.prototype.withCalendar = function(newCalendar: Calendar) {
	const isoDate = this.toISO();  // note: call intrinsic version
	const otherDate = newCalendar[Temporal.Calendar.fromISO](isoDate);
	// assert: otherDate.calendar === newCalendar
	return otherDate;
}
```

### ISO strings with calendar hint

Serialization to/from strings will still be supported.  To convert to a string, the `Temporal.Calendar.id` field of the calendar will be appended in `[]` following the date.  For example, `2019-12-06[hebrew]` refers to 2019-12-06 projected into the Hebrew calendar.

```javascript
Temporal.Date.prototype.toString = function() {
	let calendarKeyword, isoDate;
	// For Default Calendar Option 3, check for the partial ISO calendar here
	if (/* this.calendar is the ISO calendar */) {
		calendarKeyword = null;
		isoDate = this;
	} else {
		calendarKeyword = this.calendar[Temporal.Calendar.identifier];
		isoDate = this.toISO();  // call intrinsic
	}
	// return an ISO string for isoDate with calendar in brackets:
	// "2019-12-06[hebrew]"
}
```

For objects with time components (such as Temporal.DateTime), the calendar would be appended to the end of the string.  It would be distinguisable from the timezone because it does not contain a slash.  For example: `2019-12-06T16:23+00:50[America/NewYork][hebrew]`.  @gibson042 points out that this could be probematic: "There are many aliases without / ... [including] #156. And it gets worse with author-defined time zone and calendar names."

Alternatively, we may consider changing the syntax to add `c=` for calendars and `z=` for zones.  `2019-12-06T16:23+00:50[z=America/NewYork][c=hebrew]`

### New behavior of Temporal.Date.from

`Temporal.Date.from` would take a new optional `options` argument, with a single field `idToCalendar` specifying a function to map from identifiers to Calendar objects.  If not present, the `Intl.Calendar` namespace will be searched.

Example implementation:

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

Example call site with custom calendars:

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

### Semantics of existing Temporal.Date instance methods

Temporal.Date will defer to Temporal.Calendar methods wherever necessary.  Example implementation of selected Temporal.Date methods:

```javascript
Temporal.Date.prototype.plus = function(duration) {
	return this.calendar[Temporal.Calendar.plus](this, duration);
}

Temporal.Date.prototype.difference = function(other) {
	if (other.calendar !== this.calendar) {
		// Note: call intrinsic versions of these methods
		other = other.toISO().withCalendar(this.calendar);
	}
	return this.calendar[Temporal.Calendar.difference](this, other);
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
	return calendar[Temporal.Calendar.fromISO](isoDate);
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
