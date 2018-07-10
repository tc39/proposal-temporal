# CivilDate
## CivilDate Objects
### Overview of CivilDate Objects and Definitions of Abstract Operations
A CivilDate object is an immutable Map Object that contains Number values corresponding to a particular year, month, and day.
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

  
#### Plus(Object)
The abstract operation Plus returns a new CivilDate object that may have 0 to 2 values copied from the CivilDate object on which the operation was performed.  The new CivilDate object will have one or more updated values that depend on terminal values of an Object passed in as the argument.  The argument Object consists of a range of 1 to 3 (inclusive) key-value pairs.  Each pair consists of a nonterminal symbol and a corresponding terminal Number.  An argument Object may have one and only one of each of the nonterminal symbols “Year”, “Month”, and “Day”.

#### WithTime (time)
The abstract operation WithTime returns a CivilDateTime object that copies and may update the year, month, and day values of the CivilDate object on which the operation was performed.

## The CivilDate Constructor
The CivilDate constructor is the %CivilDate% intrinsic object.  When called as a constructor, it creates and initializes a new CivilDate object.
The CivilDate constructor is a single function.
(subclassable?)
The length property of the CivilDate constructor function is 3.
#### CivilDate (year, month, day)
When the CivilDate function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 3.

3.	If NewTarget is not undefined, then

  a.	Let y be ? ToNumber(year)

  b.	Let m be ? ToNumber(month)

  c.	Let d be ? ToNumber(Day)


### Properties of the CivilDate Constructor
The value of the [[Prototype]] internal slot of the CivilDate constructor is the intrinsic object %FunctionPrototype%.
The CivilDate constructor has the following properties:

#### CivilDate Prototype
The initial value of CivilDate.prototype is the intrinsic object %CivilDatePrototype%.  This property has the attributes {[[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false}.
#### CivilDate.plus ([Map Object])
The abstract operation plus takes as an argument a Map Object with a range of 1 to 3 key/value pairs, inclusive.  The keys may not be duplicated and may be any combination of “year”, “month”, “day”.  The values must be of the Number type and may be positive or negative integers. The CivilDate operation uses Gregorian pro-leptic calendar computation.
When the Plus function is called, the following steps are taken:

1.	Let numberOfArgs be the number of arguments passed to this function call.

2.	Assert: numberOfArgs == 1.

3.	If NewTarget is not undefined, then
  a. Let y be thisYearValue
  b. Let m be thisMonthValue
  c. Let d be thisDayValue
  d. If arguments to this function call include the key "year", then
    i. Let y += ToNumber(yearValue)
  e. If arguments to this function call include the key "month", then
    i. Let m += ToNumber(monthValue)
  f. If arguments to this function call include the key "day", then
    i. Let d += ToNumber(dayValue)
    ii. Regulate the final y, m, and d values using Gregorian calendar calculations.
  d.  Let O be ? OrdinaryCreateFromConstructor(New Target, "%CivilDatePrototype%", y, m, d)



