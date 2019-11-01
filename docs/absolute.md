# `Temporal.Absolute`

An absolute point in time.

## new Temporal.Absolute(epochNanoSeconds : bigint) : Temporal.Absolute

## absolute.getEpochSeconds() : number

## absolute.getEpochMilliseconds() : number

## absolute.getEpochMicroseconds() : bigint

## absolute.getEpochNanoseconds() : bigint

## absolute.inTimeZone(timeZone: Temporal.TimeZone | string) : Temporal.DateTime

## absolute.plus(duration: Temporal.Duration | string | object) : Temporal.Absolute

## absolute.minus(duration: Temporal.Duration | string | object) : Temporal.Absolute

## absolute.difference(other: Temporal.Absolute) : Temporal.Duration

## absolute.toString(timeZone?: Temporal.TimeZone | string) : string

## absolute.toLocaleString(locale?: string, options: object) : string

## Temporal.Absolute.fromString(spec: string) : Temporal.Absolute

## Temporal.Absolute.from(thing: string | object) : Temporal.Absolute

## Temporal.Absolute.compare(one: Temporal.Absolute, two: Temporal.Absolute) : number
