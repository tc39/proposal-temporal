# `Temporal.TimeZone`

A representation of a time-zone giving access to information about offsets & dst-changes as well as allowing for conversions.


## new Temporal.TimeZone(timeZone: string) : Temporal.TimeZone

## timeZone.name : string

## timeZone.getOffsetFor(absolute: Temporal.Absolute) : string

## timeZone.getDateTimeFor(absolute: Temporal.Absolute) : Temporal.DateTime

## timeZone.getAbsoluteFor(dateTime: Temporal.DateTime, disambiguation: 'earlier' | 'later' | 'reject' = 'earlier') : Temporal.Absolute

## timeZone.getTransitions(startingPoint: Temporal.Absolute) : iterator<Temporal.Absolute>

## timeZone.toString() : string

## Temporal.TimeZone.fromString(spec: string) : Temporal.TimeZone

## Temporal.TimeZone: iterator<Temporal.TimeZone>
