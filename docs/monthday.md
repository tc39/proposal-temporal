# `Temporal.MonthDay`

## Constructor

### **new Temporal.MonthDay**(_month_: number, _day_: number, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.MonthDay

## Static methods

### Temporal.MonthDay.**from**(_thing_: string | object) : Temporal.MonthDay

### Temporal.MonthDay.**compare**(_one_: Temporal.MonthDay, _two_: Temporal.MonthDay) : number

## Properties

### monthDay.**month** : number

### monthDay.**day** : number

### monthDay.**daysInMonth** : number

## Methods

### monthDay.**with**(_monthDayLike_: object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.MonthDay

### monthDay.**plus**(_duration_: Temporal.Duration | object | string, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.MonthDay

### monthDay.**minus**(_duration_: Temporal.Duration | object | string, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.MonthDay

### monthDay.**difference**(_other_: Temporal.MonthDay) : Temporal.Duration

### monthDay.**toString**() : string

### monthDay.**toLocaleString**(_locale_?: string, _options_?: object) : string

### monthDay.**withYear**(_year_: number, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date
