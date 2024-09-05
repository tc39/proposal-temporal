# Temporal

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

## 介绍

`Date` 一直是 ECMAScript 长期以来的痛点。这是一个关于 `Temporal` 的提议，它是一个全局对象，像 `Math` 一样位于顶级命名空间中，为 ECMAScript 语言带来了现代化的日期、时间接口。
关于 `Date` 的一些问题，和 Temporal 的目的，具体参考[修复 JavaScript 日期](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)。

Temporal 通过以下方式解决了这些问题：

- 提供了易于使用的日期、时间计算接口
- 对所有时区的出色支持，包括对夏令时的计算
- 该对象明确的表示了一个特定的日期和时间
- 解析一个严格规定的字符串格式
- 支持非公历历法

Temporal 为日期、时间和其它的有限情况提供了单独的 ECMAScript 类。这提高了代码的可读性，并防止了一些因 0 或 UTC 或错误的时区而引发的 BUG。

## Cookbook

[cookbook](../cookbook.md) 可以帮助你开始了解和学习 Temporal 的工作原理。

## API 文档

Temporal 的接口遵循惯例，使用以 "Plain" 开头的类型名（如 `Temporal.PlainDate`，`Temporal.PlainTime`，和 `Temporal.PlainDateTime`）表示没有与之关联时区的对象。
由于时区和夏令时的关系，在这种类型和精确时间类型（`Temporal.Instant` 和 `Temporal.ZonedDateTime`）之间转换可能存在歧义，Temporal API 允许开发者来配置如何解决这种歧义。

几个重要的概念将在其它地方解释：[精确时间，钟表时间，时区，夏令时，处理歧义等](../timezone.md)。

### **Temporal.Now**

- `Temporal.Now.instant()` - 获取自[Unix 时间](https://en.wikipedia.org/wiki/Unix_time)以来的精确时间
- `Temporal.Now.timeZone()` - 获取当前系统时区
- `Temporal.Now.zonedDateTime(calendar)` - 以系统时区和给定的日期格式获取当前的日期时间
- `Temporal.Now.zonedDateTimeISO()` - 以系统时区和 ISO-8601 格式获取当前的日期时间
- `Temporal.Now.plainDate(calendar)` - 以系统时区和给定的日期格式获取当前的日期
- `Temporal.Now.plainDateISO()` - 以系统时区和 ISO-8601 格式获取当前的日期
- `Temporal.Now.plainTimeISO()` - 以系统时区和 ISO-8601 格式获取当前的时间
- `Temporal.Now.plainDateTime(calendar)` - 返回当前系统时区的日期/时间，返回对象不包含时区信息，因此不应该将其用于夏令时的时间推导上。
- `Temporal.Now.plainDateTimeISO()` - 与上面相同，但是返回 ISO-8601 格式的日期时间

```js
console.log('Initialization complete', Temporal.Now.instant());
// 示例输出：
// Initialization complete 2021-01-13T20:57:01.500944804Z
```

更多详细内容参见 [Temporal.Now 文档](../now.md)。

### **Temporal.Instant**

`Temporal.Instant` 代表一个固定的时间点（称为 **"精确时间"**），不考虑历法和地点，例如：UTC 时间 1969 年 7 月 20 日 20 时 17 分。

为了获得人类可读的时间表示，可以使用 `Temporal.TimeZone` 或 `Temporal.Calendar` 与 `Temporal.ZonedDateTime` 或 `Temporal.PlainDateTime` 相结合。

```js
const instant = Temporal.Instant.from('1969-07-20T20:17Z');
instant.toString(); // => '1969-07-20T20:17:00Z'
instant.epochMilliseconds; // => -14182980000
```

更多详细内容参见 [Temporal.Instant 文档](../instant.md)。

### **Temporal.ZonedDateTime**

`Temporal.ZonedDateTime` 是一个时区完备、历法完备的日期/时间对象，从地球某一特定区域的角度看，它代表了一个已经发生（或将要发生）的真实事件，例如：太平洋时间 1995 年 12 月 7 日凌晨 3:24（公历）。
该类型为需要时区的用例进行了优化，包括夏令时运算和与 RFC 5545（iCalendar）的互操作性。

```js
const zonedDateTime = Temporal.ZonedDateTime.from({
  timeZone: 'America/Los_Angeles',
  year: 1995,
  month: 12,
  day: 7,
  hour: 3,
  minute: 24,
  second: 30,
  millisecond: 0,
  microsecond: 3,
  nanosecond: 500
}); // => 1995-12-07T03:24:30.0000035-08:00[America/Los_Angeles]
```

作为最广泛的 `Temporal` 类型，`Temporal.ZonedDateTime` 可以被认为是 `Temporal.TimeZone`，`Temporal.Instant`，和 `Temporal.PlainDateTime`（包括 `Temporal.Calendar`）的组合。

更多详细内容参见 [Temporal.ZonedDateTime 文档](../zoneddatetime.md)。

### **Temporal.PlainDate**

`Temporal.PlainDate` 对象代表了一个不与特定时间或时区相关的日历日期，例如：2006 年 8 月 24 日。

```js
const date = Temporal.PlainDate.from({ year: 2006, month: 8, day: 24 }); // => 2006-08-24
date.year; // => 2006
date.inLeapYear; // => false
date.toString(); // => '2006-08-24'
```

也可以转换为部分日期，如 `Temporal.PlainYearMonth` 和 `Temporal.PlainMonthDay`。

更多详细内容参见 [Temporal.PlainDate 文档](../plaindate.md)。

### **Temporal.PlainTime**

`Temporal.PlainTime` 对象代表了一个不与特定时间或时区相关的钟表时间，例如：下午 7:39。

```js
const time = Temporal.PlainTime.from({
  hour: 19,
  minute: 39,
  second: 9,
  millisecond: 68,
  microsecond: 346,
  nanosecond: 205
}); // => 19:39:09.068346205

time.second; // => 9
time.toString(); // => '19:39:09.068346205'
```

更多详细内容参见 [Temporal.PlainTime 文档](../plaintime.md)。

### **Temporal.PlainDateTime**

`Temporal.PlainDateTime` 代表一个不包含时区信息的日历日期和钟表时间，例如，1995 年 12 月 7 日 下午 3 点（公历）。

它可以使用 `Temporal.TimeZone` 转换为 `Temporal.ZonedDateTime`。
对于需要时区的用例，特别是你想用其它值进行计算，考虑使用 `Temporal.ZonedDateTime` 代替，因为该类型会自动调整夏令时。

```js
const dateTime = Temporal.PlainDateTime.from({
  year: 1995,
  month: 12,
  day: 7,
  hour: 15
}); // => 1995-12-07T15:00:00
const dateTime1 = dateTime.with({
  minute: 17,
  second: 19
}); // => 1995-12-07T15:17:19
```

更多详细内容参见 [Temporal.PlainDateTime 文档](../plaindatetime.md)。

### **Temporal.PlainYearMonth**

一个不包括天的日期。这对于表达“2020 年 10 月的会议”这种事很有用。

```js
const yearMonth = Temporal.PlainYearMonth.from({ year: 2020, month: 10 }); // => 2020-10
yearMonth.daysInMonth; // => 31
yearMonth.daysInYear; // => 366
```

更多详细内容参见 [Temporal.PlainYearMonth 文档](../plainyearmonth.md)。

### **Temporal.PlainMonthDay**

一个不包括年的日期。这对于表达“巴士底日在 7 月 14 日”这种事很有用。

```js
const monthDay = Temporal.PlainMonthDay.from({ month: 7, day: 14 }); // => 07-14
const date = monthDay.toPlainDate({ year: 2030 }); // => 2030-07-14
date.dayOfWeek; // => 7
```

更多详细内容参见 [Temporal.PlainMonthDay 文档](../plainmonthday.md)。

### **Temporal.Duration**

`Temporal.Duration` 表达了一个时间长度，如 5 分钟 30 秒。它被用于日期/时间运算和测量 `Temporal` 对象之间的差异。

```js
const duration = Temporal.Duration.from({
  hours: 130,
  minutes: 20
});

duration.total({ unit: 'second' }); // => 469200
```

更多详细内容参见 [Temporal.Duration 文档](../duration.md)。

#### 时间平衡

与 `Temporal` 的其它的类型不同，`Temporal.Duration` 并不会自然转换：你可能想要一个“90 分钟”的时长，而不希望它意外的变成“1 小时 30 分钟”。

更多详细内容参见 [时间平衡](../balancing.md)。

### **Temporal.TimeZone**

`Temporal.TimeZone` 代表一个 IANA 时区，一个特定的 UTC 偏移，或 UTC 本身。TimeZone 将 UTC 日期/时间转换为本地日期/时间。
因此，`Temporal.TimeZone` 可以用来在 `Temporal.Instant` 和 `Temporal.PlainDateTime` 之间进行转换，以及找出特定 `Temporal.Instant` 的偏移。

也可以实现你自己的时区。

```js
const timeZone = Temporal.TimeZone.from('Africa/Cairo');
timeZone.getInstantFor('2000-01-01T00:00'); // => 1999-12-31T22:00:00Z
timeZone.getPlainDateTimeFor('2000-01-01T00:00Z'); // => 2000-01-01T02:00:00
timeZone.getPreviousTransition(Temporal.Now.instant()); // => 2014-09-25T21:00:00Z
timeZone.getNextTransition(Temporal.Now.instant()); // => null
```

更多详细内容参见 [Temporal.TimeZone 文档](../timezone.md)。

有关时区，夏令时，解决歧义的概念解释，见[此文档](../timezone.md)。

### **Temporal.Calendar**

`Temporal.Calendar` 代表一个日历系统。大多数代码使用 ISO 8601 格式，但其它的日历系统同样支持。

日期与用于执行日历系统相关操作的 `Temporal.Calendar` 对象相关联。在内部，这些日期操作是由这个日历对象上的方法来完成的。

也可以实现你自己的日历系统。

```js
const cal = Temporal.Calendar.from('iso8601');
const date = cal.dateFromFields({ year: 1999, month: 12, day: 31 }, {});
date.monthsInYear; // => 12
date.daysInYear; // => 365
```

更多详细内容参见 [Temporal.Calendar 文档](../calendar.md)。

## 对象关系

<img src="../object-model.svg">

## 字符串持久化

为了持久性和互操作性，所有的 `Temporal` 类型都有一个字符串表示。类型和字符串之间的对应关系如下所示。
关于 Temporal 中使用的 ISO 8601 和 RFC 3339 的更多信息和标准化工作，请参考 [ISO 字符串扩展](../strings.md)。

<img src="../persistence-model.svg">

## 其它文档

### **主要概念**

- [Time Zones and Resolving Ambiguity](../timezone.md) &mdash; 解释由于夏令时和时区变化造成的时间缺失和时间重复。
- [Balancing](../balancing.md) &mdash; 解释什么时候 `Temporal.Duration` 的单位会自然转换，什么时候不会。
- [Why do Temporal instances have a Calendar?](../calendar-review.md) &mdash; 关于为什么像 `Temporal.PlainDate` 或 `Temporal.ZonedDateTime` 类型包含日历系统。这些扩展正在与 IETF 积极合作以使其进入标准化流程。
