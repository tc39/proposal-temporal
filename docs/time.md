# `Temporal.Time`

A representation of wall-clock time.


## new Temporal.Time(hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: number = 0, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## time.hour: number

## time.minute: number

## time.second: number

## time.millisecond: number

## time.microsecond: number

## time.nanosecond: number

## time.with({ hour: number = this.hour, minute: number = this.minute, second: numer = this.second ...}, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## time.plus(duration: string | object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## time.minus(duration: string | object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## time.difference(other: Temporal.Time | object) : Temporal.Duration

## time.toString() : string

## time.toLocaleString(locale?:string, options?: object) : string

## time.withDate(date: Temporal.Date | object) : Temporal.DateTime

## Temporal.Time.fromString(iso: string) : Temporal.Time

## Temporal.Time.from(thing: string | object) : Temporal.Time

## Temporal.Time.compare(one: Temporal.Time | object, two: Temporal.Time | object) : number;
