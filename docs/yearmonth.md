# Temporal.YearMonth

A representation of a calendar date.

## Constructor

### **new Temporal.YearMonth**(_year_: number, _month_: number, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

## Static methods

### Temporal.YearMonth.**from**(_thing_: string | object) : Temporal.YearMonth

### Temporal.YearMonth.**compare**(_one_: Temporal.YearMonth, _two_: Temporal.YearMonth) : number

## Properties

### yearMonth.**year** : number

### yearMonth.**month** : number

### yearMonth.**daysInMonth** : number

### yearMonth.**daysInYear** : number

### yearMonth.**leapYear** : boolean

## Methods

### yearMonth.**with**(_yearMonthLike_: object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

### yearMonth.**plus**(_duration_: Temporal.Duration | object | string, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

### yearMonth.**minus**(_duration_: Temporal.Duration | object | string, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

### yearMonth.**difference**(_other_: Temporal.YearMonth) : Temporal.Duration

### yearMonth.**toString**() : string

### yearMonth.**toLocaleString**(_locale_?: string, _options_?: object) : string

### yearMonth.**withDay**(_day_: number) : Temporal.Date
