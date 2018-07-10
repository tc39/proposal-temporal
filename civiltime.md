# CivilTime
## CivilTime Objects
### Overview of CivilTime Objects and Definitions of Abstract Operations
A CivilTime object is an immutable Map Object that contains Number values corresponding to a particular hour, minute, second, millisecond, and nanosecond.
The following functions are abstract operations that operate on time values (defined SOMEWHERE).  Note that, in every case, if any argument to one of these functions is NaN, the result will be NaN.
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
  
#### Plus(Object)
The abstract operation Plus returns a new CivilTime object that may have 0 to 4 values copied from the CivilTime object on which the operation was performed.  The new CivilTime object will have one or more updated values that depend on terminal values of an Object passed in as the argument.  The argument Object consists of a range of 1 to 5 (inclusive) key/value pairs.  Each pair consists of a nonterminal symbol and a corresponding terminal Number.  An argument Object may have one and only one of each of the nonterminal symbols "Hour", "Minute", "Second", "Millisecond", and "Nanosecond".

#### WithDate(date)
The abstract operation WithTime returns a CivilDateTime object with the date values passed as the argument and the hour, minute, second, millisecond, and nanosecond values of the CivilTime object on which the operation was performed.

## The CivilTime Constructor
The CivilTime constructor is the %CivilTime% intrinsic object.  When called as a constructor, it creates and initializes a new CivilTime object.
The CivilTime constructor is a single function.
The CivilTime constructor is subclassable.
The length property of the CivilTime constructor function is a range of 2 to 5, inclusive.

#### CivilTime (hour, minute[[[, second], millisecond], nanosecond])
This description only applies if the CivilTime constructor is called with at least two arguments.

When the CivilTime function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs >= 2.

3.  If hour is not finite or minute is not finite or second is not finite or millisecond is not finite or nanosecond is not finite, return NaN.

4.	If NewTarget is not undefined, then
  a.	Let h be ? ToNumber(hour).
  b.	Let min be ? ToNumber(minute).
  c.	If "second" is supplied, let s be ? ToNumber(second); else let s be 0.
  d.	If "millisecond" is supplied, let ms be ? ToNumber(millisecond); else let ms be 0.
  e.	If "nanosecond" is supplied, let ns be ? ToNumber(nanosecond); else let ns be 0.
  f.  Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilTimePrototype%", <<[[HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  g. Set O.[[HourValue]] to h.
  h. Set O.[[MinuteValue]] to min.
  i. Set O.[[SecondValue]] to s.
  j. Set O.[[MillisecondValue]] to ms.
  k. Set O.[[NanosecondValue]] to ns.
  h. Return O
5. Else, do something else?  


### Properties of the CivilTime Constructor
The value of the [[Prototype]] internal slot of the CivilTime constructor is the intrinsic object %FunctionPrototype%.

The CivilTime constructor has the following properties:

#### CivilTime Prototype
The initial value of CivilTime.prototype is the intrinsic object %CivilTimePrototype%.  This property has the attributes {[[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false}.
#### CivilTime.plus (value)
The abstract operation plus takes as an argument a Map Object with a range of 1 to 5 key/value pairs, inclusive.  The keys may not be duplicated and may be any combination of "hour", "minute", "second", "millisecond", and "nanosecond".  The values must be of the Number type and may be positive or negative integers. The CivilTime operation uses Gregorian pro-leptic calendar computation.

When the plus function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 1.

3.  Assert: Type(value) is Object.

4.  Assert: value has at least one of the following keys: "hour", "minute", "second", "millisecond", and/or "nanosecond".

5.  If the value associated with any of the provided keys is not finite, return NaN.

6.	If NewTarget is not undefined, then
  a.	If "hour" is one of the keys supplied, let h be ? ToNumber(hour) + thisHourValue; else let h be thisHourValue.
  b.	If "minute" is one of the keys supplied, let min be ? ToNumber(minute) + thisMinuteValue; else let min be thisMinuteValue.
  c.	If "second" is one of the keys supplied, let s be ? ToNumber(second) + thisSecondValue; else let s be thisSecondValue.
  d.	If "millisecond" is one of the keys supplied, let ms be ? ToNumber(millisecond) + thisMillisecondValue; else let ms be thisMillisecondValue.
  e.	If "nanosecond" is one of the keys supplied, let ns be ? ToNumber(nanosecond) + thisNanosecondValue; else let ns be thisNanosecondValue.
  f.  Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilTimePrototype%", <<[[HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  g. Set O.[[HourValue]] to h.
  h. Set O.[[MinuteValue]] to min.
  i. Set O.[[SecondValue]] to s.
  j. Set O.[[MillisecondValue]] to ms.
  k. Set O.[[NanosecondValue]] to ns.
  h. Return O

7. Else, do something else?


#### CivilTime.withDate (value)
The abstract operation plus takes as an argument a CivilDate Object. It creates a new CivilDateTime object 

When the withDate function is called, the following steps are taken:
1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 1.

3.  Assert: Type(value) is CivilDate Object.

4.  If NewTarget is not undefined, then
  a. Let y be ? value.YearValue.
  b. Let min be ? value.MonthValue.
  c. Let d be ? value.DayValue.
  d. Let h be ? thisHourValue.
  e. Let min be ? thisMinuteValue.
  f. Let s be ? thisSecondValue.
  g. Let ms be ? thisMillisecondValue.
  h. Let ns be ? thisNanosecondValue.
  i. Let O be ? OrdinaryCreateFromConstructor(NewTarget, "%CivilDateTimePrototype%", <<[[YearValue, MonthValue, DayValue, HourValue, MinuteValue, SecondValue, MillisecondValue, NanosecondValue]]>>).
  j. Set O.[[YearValue]] to y.
  k. Set O.[[MonthValue]] to m.
  l. Set O.[[DayValue]] to d.
  j. Set O.[[HourValue]] to h.
  k. Set O.[[MinuteValue]] to min.
  l. Set O.[[SecondValue]] to s.
  m. Set O.[[MillisecondValue]] to ms.
  n. Set O.[[NanosecondValue]] to ns.
  o. Return O
  
5. Else, do something else?
