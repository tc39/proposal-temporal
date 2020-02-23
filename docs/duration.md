# Temporal.Duration

A representations of a duration of time which can be used in date/time arithmetic.

## Constructor

### **new Temporal.Duration**(_years_?: number, _months_?: number, _days_?: number, _hours_?: number, _minutes_?: number, _seconds_?: number, _milliseconds_?: number, _microseconds_?: number, _nanoseconds_?: number, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Duration

Creates a new `Duration` object that represents a duration of time.

## Static methods

### Temporal.Duration.**from**(_thing_: string | object) : Temporal.Duration

## Properties

### duration.**years** : number

### duration.**months** : number

### duration.**days** : number

### duration.**hours** : number

### duration.**minutes** : number

### duration.**seconds** : number

### duration.**milliseconds** : number

### duration.**microseconds** : number

### duration.**nanoseconds** : number

### duration.**years** : number

## Methods

### duration.**toString**() : string

**FIXME**: Rest of documentation in a different pull request, combine when rebasing.

> **NOTE**: If any of the `milliseconds`, `microseconds`, or `nanoseconds` properties are greater than 999, then `Temporal.Duration.from(duration.toString())` will not yield an identical `Temporal.Duration` object.
> The returned object will represent an identical duration, but the sub-second fields will be balanced with the `seconds` field so that they become 999 or less.
> For example, 1000 nanoseconds will become 1 microsecond.
>
> This is because the ISO 8601 string format for durations does not allow for specifying sub-second units separately, only as a decimal fraction of seconds.
> If you need to serialize a `Temporal.Duration` in a way that will preserve unbalanced sub-second fields, you will need to use a custom serialization format.

### duration.**toLocaleString**(_locale_?: string, _options_?: object) : string
