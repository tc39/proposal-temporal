# Temporal.Time

A representation of wall-clock time.

## Constructor

### **new Temporal.Time**(_hour_: number = 0, _minute_: number = 0, _second_: number = 0, _millisecond_: number = 0, _microsecond_: number = 0, _nanosecond_: number = 0) : Temporal.Time

## Static methods

### Temporal.Time.**from**(_thing_: string | object, _options_?: object) : Temporal.Time

### Temporal.Time.**compare**(_one_: Temporal.Time, _two_: Temporal.Time) : number;

## Properties

### time.**hour**: number

### time.**minute**: number

### time.**second**: number

### time.**millisecond**: number

### time.**microsecond**: number

### time.**nanosecond**: number

## Methods

### time.**with**({ hour: number = this.hour, minute: number = this.minute, second: numer = this.second ...}, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

### time.**plus**(_duration_: string | object, _disambiguation_: 'constrain' | 'reject' = 'constrain') : Temporal.Time

### time.**minus**(_duration_: string | object, _disambiguation_: 'constrain' | 'reject' = 'constrain') : Temporal.Time

### time.**difference**(_other_: Temporal.Time, _largestUnit_: string = 'hours') : Temporal.Duration

**Parameters:**
- `other` (`Temporal.Time`): Another time with which to compute the difference.
- `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
  Valid values are `'years'`, `'months'`, `'days'`, `'hours'`, `'minutes'`, and `'seconds'`.
  The default is `days`.

**TODO:** Rest of the documentation in another pull request, this to be rebased

The `largestUnit` parameter controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.

The default largest unit in the result is hours.
Since this method never returns any duration longer than 12 hours, largest units of years, months, or days, are by definition ignored and treated as hours.

### time.**toString**() : string

### time.**toLocaleString**(_locale_?: string, _options_?: object) : string

### time.**withDate**(_date_: Temporal.Date) : Temporal.DateTime
