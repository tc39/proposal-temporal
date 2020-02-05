# `Temporal.Time`

A representation of wall-clock time.

## Constructor

### new Temporal.Time(hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: number = 0, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## Static methods

### Temporal.Time.from(thing: string | object) : Temporal.Time

### Temporal.Time.compare(one: Temporal.Time, two: Temporal.Time) : number;

## Properties

### time.hour: number

### time.minute: number

### time.second: number

### time.millisecond: number

### time.microsecond: number

### time.nanosecond: number

## Methods

### time.with({ hour: number = this.hour, minute: number = this.minute, second: numer = this.second ...}, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

### time.plus(duration: string | object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

### time.minus(duration: string | object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

### time.difference(other: Temporal.Time) : Temporal.Duration

### time.toString() : string

### time.toLocaleString(locale?:string, options?: object) : string

### time.withDate(date: Temporal.Date) : Temporal.DateTime

<script type="application/javascript" src="./prism.js"></script>
<link rel="stylesheet" type="text/css" href="./prism.css">
