# CivilDateTime
## CivilDateTime Objects
### Overview of CivilDateTime Objects and Definitions of Abstract Operations
A CivilDateTime object is an immutable Map Object that contains Number values corresponding to a particular year, month, day, hour, minute, second, millisecond, and nanosecond.
The following functions are abstract operations that operate on time values (defined SOMEWHERE).  Note that, in every case, if any argument to one of these functions is NaN, the result will be NaN.

#### Year Number
The Year Number is a positive integer corresponding to a particular year.  It is called the year value.  It must have a Number value and may not be NaN.

#### Month Number
The Month Number is a positive integer corresponding to a particular month.  It is called the month value and is identified by an integer in the range of 1 to 12, inclusive.  It must have a Number value and may not be NaN.

#### Day Number
The Day Number is a positive integer corresponding to a particular day of the month.  It is called the day value and is identified by an integer the value of which is dependent on the month and year values.  It must have a Number value and may not be NaN.  The range of possible day values can be calculated as follows:

*	For any year value with a month values of 1, 3, 5, 7, 8, 10, or 12, the day value is in the range of 1 to 31, inclusive.

*	For any year value with a month value of 4, 6, 9, or 11, the day value is in the range of 1 to 30, inclusive.

*	For the month value 2, the range of possible values for the day value depends on whether the year value corresponds to a leap year.

  *	If the year value modulo 4 != 0, the range is 1 to 28, inclusive.

  *	If the year value modulo 400 == 0, the range is 1 to 29, inclusive.

  * If the year value modulo 100 == and year value % 400 != 0, the range is 1 to 28, inclusive.

  * If the year value modulo 4 == 0 and year value % 100 != 0, the range is 1 to 29, inclusive.

#### Hour Number
The Hour Number is a positive integer corresponding to a particular hour.  It is called the hour value and is identified by an integer in the range of 0 to 23, inclusive.  It must have a Number value and may not be NaN.

#### Minute Number
The Minute Number is a positive integer corresponding to a particular minute.  It is called the minute value and is identified by an integer in the range of 0 to 59, inclusive.  It must have a Number value and may not be NaN.

#### Second Number
The Second Number is a positive integer corresponding to a particular second.  It is called the second value and is identified by an integer in the range of 0 to 59, inclusive.  It must have a Number value and may not be NaN.

#### Millisecond Number
The Millisecond Number is a positive integer corresponding to a particular millisecond.  It is called the millisecond value and is identified by an integer in the range of 0 to 999, inclusive.  It must have a Number value and may not be NaN.

#### Nanosecond Number
The Nanosecond Number is a positive integer corresponding to a particular nanosecond.  It is called the nanosecond value and is identified by an integer in the range of 0 to 999999, inclusive.  It must have a Number value and may not be NaN.

#### From(date, time)
The abstract operation From takes a CivilDate Object and a CivilTime Object returns a new CivilDateTime object with the corresponding argument values for year, month, day, hour, minute, second, millisecond, and nanosecond.
  
#### Plus(Object)
The abstract operation Plus returns a new CivilDateTime object that may have 0 to 8 values copied from the CivilDateTime object on which the operation was performed.  The new CivilDateTime object will have one or more updated values that depend on terminal values of an Object passed in as the argument.  The argument Object consists of a range of 1 to 8 (inclusive) key/value pairs.  Each pair consists of a nonterminal symbol and a corresponding terminal Number.  An argument Object may have one and only one of each of the nonterminal symbols "Year", "Month", "Day", "Hour", "Minute", "Second", "Millisecond", and "Nanosecond".

#### FromDate(date, zone)
Something?

## The CivilDateTime Constructor
The CivilDateTime constructor is the %CivilDateTime% intrinsic object.  When called as a constructor, it creates and initializes a new CivilDateTime object.
The CivilDateTime constructor is a single function.
The CivilDateTime constructor is subclassable.
The length property of the CivilDateTime constructor function is a range of 2 to 5, inclusive.

#### CivilDateTime (year, month, day, hour, minute[[[, second], millisecond], nanosecond])
This description only applies if the CivilDateTime constructor is called with at least five arguments.

When the CivilDateTime function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs >= 5.

3.  If year is not finite or month is not finite or day is not finite or hour is not finite or minute is not finite or second is not finite or millisecond is not finite or nanosecond is not finite, return NaN.

4.	If NewTarget is not undefined, then
  a.  Let y be ? ToNumber(year).
  b.  Let m be ? ToNumber(month).
  c.  Let d be ? ToNumber(day).
  d.	Let h be ? ToNumber(hour).
  e.	Let min be ? ToNumber(minute).
  f.	If "second" is supplied, let s be ? ToNumber(second); else let s be 0.
  g.	If "millisecond" is supplied, let ms be ? ToNumber(millisecond); else let ms be 0.
  h.	If "nanosecond" is supplied, let ns be ? ToNumber(nanosecond); else let ns be 0.
  i.  Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilDateTimePrototype%", <<[[YearValue, MonthValue, DayValue, HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  j.  Set O.[[YearValue]] to y.
  k.  Set O.[[MonthValue]] to m.
  l.  Set O.[[DayValue]] to d .
  m.  Set O.[[HourValue]] to h.
  n.  Set O.[[MinuteValue]] to min.
  o.  Set O.[[SecondValue]] to s.
  p.  Set O.[[MillisecondValue]] to ms.
  q.  Set O.[[NanosecondValue]] to ns.
  r.  Return O
5. Else, do something else?  


### Properties of the CivilDateTime Constructor
The value of the [[Prototype]] internal slot of the CivilDateTime constructor is the intrinsic object %FunctionPrototype%.

The CivilDateTime constructor has the following properties:

#### CivilDateTime Prototype
The initial value of CivilDateTime.prototype is the intrinsic object %CivilDateTimePrototype%.  This property has the attributes {[[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false}.

#### CivilDateTime.plus (data)
The abstract operation plus takes as an argument a Map Object with a range of 1 to 8 key/value pairs, inclusive.  The keys may not be duplicated and may be any combination of "year", "month", "day", "hour", "minute", "second", "millisecond", and "nanosecond".  The values must be of the Number type and may be positive or negative integers. The CivilDateTime operation uses Gregorian pro-leptic calendar computation.

When the plus function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 1.

3.  Assert: Type(data) is Object.

4.  Assert: data has at least one of the following keys: "hour", "minute", "second", "millisecond", and/or "nanosecond".

5.  If the data associated with any of the provided keys is not finite, return NaN.

6.	If NewTarget is not undefined, then
  a.	If "year" is one of the keys supplied, let y be ? ToNumber(year) + thisYearValue; else let y be thisYearValue.
  b.	If "month" is one of the keys supplied, let m be ? ToNumber(month) + thisMonthValue; else let m be thisMonthValue.
  c.	If "day" is one of the keys supplied, let d be ? ToNumber(day) + thisDayValue; else let d be thisDayValue.
  d.	If "hour" is one of the keys supplied, let h be ? ToNumber(hour) + thisHourValue; else let h be thisHourValue.
  e.	If "minute" is one of the keys supplied, let min be ? ToNumber(minute) + thisMinuteValue; else let min be thisMinuteValue.
  f.	If "second" is one of the keys supplied, let s be ? ToNumber(second) + thisSecondValue; else let s be thisSecondValue.
  g.	If "millisecond" is one of the keys supplied, let ms be ? ToNumber(millisecond) + thisMillisecondValue; else let ms be thisMillisecondValue.
  h.	If "nanosecond" is one of the keys supplied, let ns be ? ToNumber(nanosecond) + thisNanosecondValue; else let ns be thisNanosecondValue.
  i.  Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilDateTimePrototype%", <<[[YearValue, MonthValue, DayValue, HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  j.  Set O.[[YearValue]] to y.
  k.  Set O.[[MonthValue]] to m.
  l.  Set O.[[DayValue]] to d.
  m.  Set O.[[HourValue]] to h.
  n.  Set O.[[MinuteValue]] to min.
  o.  Set O.[[SecondValue]] to s.
  p.  Set O.[[MillisecondValue]] to ms.
  q.  Set O.[[NanosecondValue]] to ns.
  r.  Return O.

7. Else, do something else?


#### CivilDateTime.from (date, time)
The abstract operation plus takes as an argument a CivilDate Object and a CivilTime Object. It creates a new CivilDateTime object 

When the from function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 2.

3.  Assert: Type(date) is CivilDate Object.

4.  Assert: Type(time) is CivilTime Object.

5.  If NewTarget is not undefined, then
  a. Let y be date.YearValue.
  b. Let min be date.MonthValue.
  c. Let d be date.DayValue.
  d. Let h be time.HourValue.
  e. Let min be time.MinuteValue.
  f. Let s be time.SecondValue.
  g. Let ms be time.MillisecondValue.
  h. Let ns be time.NanosecondValue.
  i. Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilDateTimePrototype%", <<[[YearValue, MonthValue, DayValue, HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  j. Set O.[[YearValue]] to y.
  k. Set O.[[MonthValue]] to m.
  l. Set O.[[DayValue]] to d.
  j. Set O.[[HourValue]] to h.
  k. Set O.[[MinuteValue]] to min.
  l. Set O.[[SecondValue]] to s.
  m. Set O.[[MillisecondValue]] to ms.
  n. Set O.[[NanosecondValue]] to ns.
  o. Return O.
  
6. Else, do something else?

#### CivilDateTime.fromDate (date, zone)
The abstract operation plus takes as an argument a CivilDate Object and a ZonedInstant Object. It creates a new CivilDateTime Object.

When the fromDate function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 2.

3.  Something?

#### CivilDateTime.toCivilDate
It creates a new CivilDate Object populated with the relevant values of the CivilDateTime Object on which the operation is performed.

When the toCivilDate function is called, the following steps are taken:

1.  If NewTarget is not undefined, then
  a. Let y be thisYearValue.
  b. Let min be thisMonthValue.
  c. Let d be thisDayValue.
  i. Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilDatePrototype%", <<[[YearValue, MonthValue, DayValue]]>>).
  j. Set O.[[YearValue]] to y.
  k. Set O.[[MonthValue]] to m.
  l. Set O.[[DayValue]] to d.
  o. Return O.
  
2. Else, do something else?

#### CivilDateTime.toCivilTime
It creates a new CivilTime Object populated with the relevant values of the CivilDateTime Object on which the operation is performed.

When the toCivilTime function is called, the following steps are taken:

1.  If NewTarget is not undefined, then
  a. Let h be time.HourValue.
  b. Let min be time.MinuteValue.
  c. Let s be time.SecondValue.
  d. Let ms be time.MillisecondValue.
  e. Let ns be time.NanosecondValue.
  f. Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilTimePrototype%", <<[[HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  g. Set O.[[HourValue]] to h.
  h. Set O.[[MinuteValue]] to min.
  i. Set O.[[SecondValue]] to s.
  j. Set O.[[MillisecondValue]] to ms.
  k. Set O.[[NanosecondValue]] to ns.
  l. Return O.
  
2. Else, do something else?

#### CivilDateTime.withZone (timeZone[, options])
The abstract operation plus takes as an argument a String and an optional Object. It creates a new ZonedInstant object.

When the withZone function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs > 1.

3.  Assert: Type(timeZone) is String.

4.  If options is supplied, assert: Type(options) Object.

5.  If NewTarget is not undefined, then
  a. Let y be date.YearValue.
  b. Let min be date.MonthValue.
  c. Let d be date.DayValue.
  d. Let h be time.HourValue.
  e. Let min be time.MinuteValue.
  f. Let s be time.SecondValue.
  g. Let ms be time.MillisecondValue.
  h. Let ns be time.NanosecondValue.
  i. Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilDateTimePrototype%", <<[[YearValue, MonthValue, DayValue, HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  j. Set O.[[YearValue]] to y.
  k. Set O.[[MonthValue]] to m.
  l. Set O.[[DayValue]] to d.
  j. Set O.[[HourValue]] to h.
  k. Set O.[[MinuteValue]] to min.
  l. Set O.[[SecondValue]] to s.
  m. Set O.[[MillisecondValue]] to ms.
  n. Set O.[[NanosecondValue]] to ns.
  o. Return O.
  
6. Else, do something else?