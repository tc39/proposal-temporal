# `Temporal.YearMonth`

A representation of a calendar date.

## Constructor

### new Temporal.YearMonth(year: number, month: number, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

## Static methods

### Temporal.YearMonth.from(thing: string | object) : Temporal.YearMonth

### Temporal.YearMonth.compare(one: Temporal.YearMonth, two: Temporal.YearMonth) : number

## Properties

### yearMonth.year : number

### yearMonth.month : number

### yearMonth.daysInMonth : number

### yearMonth.daysInYear : number

### yearMonth.leapYear : boolean

## Methods

### yearMonth.with(yearMonthLike: object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

### yearMonth.plus(duration: Temporal.Duration | object | string, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

### yearMonth.minus(duration: Temporal.Duration | object | string, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

### yearMonth.difference(other: Temporal.YearMonth) : Temporal.Duration

### yearMonth.toString() : string

### yearMonth.toLocaleString(locale?: string, options?: object) : string

### yearMonth.withDay(day: number) : Temporal.Date

<script type="application/javascript" src="./prism.js"></script>
<link rel="stylesheet" type="text/css" href="./prism.css">
