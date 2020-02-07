# Temporal.DateTime

## Constructor

### **new Temporal.DateTime**(_year_: number, _month_: number, _day_: number, _hour_: number, _minute_: number, _second_: number = 0, _millisecond_: number = 0, _microsecond_: number = 0, _nanosecond_: number = 0, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## Static methods

### Temporal.DateTime.**from**(_thing_: string | object) : Temporal.DateTime

### Temporal.DateTime.**compare**(_one_: Temporal.DateTime, _two_: Temporal.DateTime) : number;

## Properties

### datetime.**year** : number

### datetime.**month** : number

### datetime.**day** : number

### datetime.**hour**: number

### datetime.**minute**: number

### datetime.**second**: number

### datetime.**millisecond**: number

### datetime.**microsecond**: number

### datetime.**nanosecond**: number

### datetime.**dayOfWeek** : number

### datetime.**weekOfYear** : number

### datetime.**daysInMonth** : number

### datetime.**daysInYear** : number

### datetime.**leapYear** : boolean

## Methods

### datetime.**with**({ year: number, month: number, hour: number, hour: number = this.hour, minute: number = this.minute, ...}, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.DateTime

### datetime.**plus**(_duration_: string | object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.DateTime

### datetime.**minus**(_duration_: string | object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.DateTime

### datetime.**difference**(_other_: Temporal.DateTime) : Temporal.Duration

### datetime.**toString**() : string

### datetime.**toLocaleString**(_locale_?:string, _options_?: object) : string

### datetime.**inTimeZone**(_timeZoneParam_ = 'UTC', _disambiguation_ = 'earlier') : Temporal.Absolute

### datetime.**getDate**() : Temporal.Date

### datetime.**getYearMonth**() : Temporal.YearMonth

### datetime.**getMonthDay**() : Temporal.MonthDay

### datetime.**getTime**() : Temporal.Time
