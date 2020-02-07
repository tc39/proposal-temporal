# `Temporal.Time`

A representation of wall-clock time.

## Constructor

### **new Temporal.Time**(_hour_: number, _minute_: number, _second_: number = 0, _millisecond_: number = 0, _microsecond_: number = 0, _nanosecond_: number = 0, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## Static methods

### Temporal.Time.**from**(_thing_: string | object) : Temporal.Time

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

### time.**plus**(_duration_: string | object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

### time.**minus**(_duration_: string | object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

### time.**difference**(_other_: Temporal.Time) : Temporal.Duration

### time.**toString**() : string

### time.**toLocaleString**(_locale_?: string, _options_?: object) : string

### time.**withDate**(_date_: Temporal.Date) : Temporal.DateTime
