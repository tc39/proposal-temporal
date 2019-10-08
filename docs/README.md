# Temporal

<div class="mermaid">
graph LR;
  timezone(Time-Zone);
  subgraph " ";
    absolute(Absolute);
  end;
  subgraph " ";
    datetime(DateTime);
      date(Date);
        yearmonth(YearMonth);
        monthday(MonthDay);
      time(Time);
    datetime --- date;
    datetime --- time;
    date --- yearmonth;
    date --- monthday;
  end;
  absolute === timezone;
  timezone === datetime;
</div>

---

# Temporal.DateTime

```javascript
dt = Temporal.getDateTime(); // current date & time
dt = Temporal.DateTime(2019, 10, 7, 13, 3, 30); // 2019-10-07T13:03:30
dt.year/* 2019 */; dt.month/* 10 */; dt.day/* 7 */;
dt.hour/* 13 */; dt.minute/* 3 */; dt.second/* 30 */;
dt.millisecond/* 0 */; dt.microsecond/* 0 */; dt.nanosecond/* 0 */;
dt.with({ month: 11 }); // 2019-11-07T13:03:30
dt.plus('P1D'); // 2019-10-08T13:03:30
dt.minus('P1M'); // 2019-09-07T13:03:30
dt.inZone('Europe/Vienna'); // 2019-10-07T11:03:30Z
dt.getDate()/* 2019-10-07 */; dt.getTime()/* 13:03:30 */;
```

---

# Temporal.Date

```javascript
dt = Temporal.getDate(); // current date
dt = Temporal.Date(2019, 10, 7); // 2019-10-07
dt.year/* 2019 */; dt.month/* 10 */; dt.day/* 7 */;
dt.with({ month: 11 }); // 2019-11-07
dt.plus('P1D'); // 2019-10-08
dt.minus('P1M'); // 2019-09-07
dt.withTime(Temporal.Time(13, 3, 20)); // 2019-10-07T13:03:30
dt.getYearMonth()/* 2019-10 */; dt.getMonthDay()/* 10-07 */;
```

---

# Temporal.Time

```javascript
dt = Temporal.getTime(); // current time
dt = Temporal.Time(13, 3, 30); // 13:03:30
dt.hour/* 13 */; dt.minute/* 3 */; dt.second/* 30 */;
dt.millisecond/* 0 */; dt.microsecond/* 0 */; dt.nanosecond/* 0 */;
dt.with({ hour: 11 }); // 11:03:30
dt.plus('PT1H'); // 14:03:30
dt.minus('PT1M'); // 13:02:30
dt.withDate(Temporal.Date(2019, 10, 7)); // 2019-10-07T11:03:30Z
```

---

# Temporal.Absolute

```javascript
dt = Temporal.getAbsolute(); // curent moment in time
dt = Temporal.Absolute(1570537307821560338n); // 2019-10-08T12:21:47.821560338Z
dt.getEpochNanoseconds(); // 1570537307821560338n
dt.getEpochMicroseconds(); // 1570537307821560n
dt.getEpochMilliseconds(); // 1570537307821
dt.getEpochSeconds(); // 1570537307
dt.inZone('America/New_York'); // 2019-10-08T08:21:47.821560338
dt.inZone('Europe/Berlin'); // 2019-10-08T14:21:47.821560338
dt.toString('America/New_York'); // 2019-10-08T08:21:47.821560338-04:00[America/New_York]
```

---

# Temporal.TimeZone

```javascript
dt = Temporal.TimeZone('UTC');
dt = Temporal.TimeZone('-04:00');
dt = Temporal.TimeZone('Europe/Berlin');
dt.getOffsetFor(Temporal.Absolute(1553993100000000000n)); // +01:00
dt.getDateTimeFor(Temporal.Absolute(1553993100000000000n)); // 2019-03-31T01:45
dt.getAbsoluteFor(Temporal.DateTime(2019, 3, 31, 2, 45); // 2019-03-31T01:45+01:00[Europe/Berlin] 
dt.getAbsoluteFor(Temporal.DateTime(2019, 3, 31, 2, 45), 'earlier'); // 2019-03-31T01:45+01:00[Europe/Berlin] 
dt.getAbsoluteFor(Temporal.DateTime(2019, 3, 31, 2, 45), 'later'); // 2019-03-31T03:45+02:00[Europe/Berlin]
dt.getAbsoluteFor(Temporal.DateTime(2019, 3, 31, 2, 45), 'reject'); // throws
dt.getTransitions(Temporal.getAbsolute()); // Iterator over future DST changes
for (let zone of Temporal.TimeZone) console.log(zone.name); // lists all TimeZones (iterator)
```

---

# Temporal.Duration

```javascript
dt = Temporal.Duration(0, 0, 1); // 1 Day
dt = Temporal.Duration.fromString('PT2H'); // 2 Hours
dt = Temporal.Duration(1, 2, 3, 5, 6, 7, 8, 9); // P1Y2M3DT4H5M6.007008009S

dt.years/* 1 */; dt.months/* 2 */; dt.days/* 3 */;
dt.hours/* 4 */; dt.minutes/* 5 */; dt.seconds/* 6 */;
dt.milliseconds/* 7 */; dt.microseconds/* 8 */; dt.nanoseconds/* 9 */
```

---

# Temporal

**Now open your developer tools, and try it out!**

<script type="application/javascript" src="./index.js"></script>
<script type="application/javascript" src="./mermaid.js"></script>
<script>mermaid.initialize({startOnLoad:true, flowchart:{ useMaxWidth:false } });</script>
<style>.mermaid svg { height: 13em; }</style>
