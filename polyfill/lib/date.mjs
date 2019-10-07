import { ES } from "./ecmascript.mjs";
import { SLOT_YEAR, SLOT_MONTH, SLOT_DAY } from "./slots.mjs";

import { date as RAW } from "./regex.mjs";
const DATE = new RegExp(`^${RAW.source}$`);

export function Date(year, month, day, disambiguation) {
  if (!(this instanceof Date))
    return new Date(year, month, day, disambiguation);
  year = ES.ToInteger(year);
  month = ES.ToInteger(month);
  day = ES.ToInteger(day);
  switch (disambiguation) {
    case "constrain":
      ({ year, month, day } = ES.ConstrainDate(year, month, day));
      break;
    case "balance":
      ({ year, month, day } = ES.BalanceDate(year, month, day));
      break;
    default:
      ES.RejectDate(year, month, day);
  }

  this[SLOT_YEAR] = year;
  this[SLOT_MONTH] = month;
  this[SLOT_DAY] = day;
}
Object.defineProperties(Date.prototype, {
  year: {
    get: function() {
      return this[SLOT_YEAR];
    },
    enumerable: true,
    configurable: true
  },
  month: {
    get: function() {
      return this[SLOT_MONTH];
    },
    enumerable: true,
    configurable: true
  },
  day: {
    get: function() {
      return this[SLOT_DAY];
    },
    enumerable: true,
    configurable: true
  },
  dayOfWeek: {
    get: function() {
      return ES.DayOfWeek(
        this[SLOT_THIS].year,
        this[SLOT_THIS].month,
        this[SLOT_DAY]
      );
    },
    enumerable: true,
    configurable: true
  },
  dayOfYear: {
    get: function() {
      return ES.DayOfYear(
        this[SLOT_THIS].year,
        this[SLOT_THIS].month,
        this[SLOT_DAY]
      );
    },
    enumerable: true,
    configurable: true
  },
  weekOfYear: {
    get: function() {
      return ES.WeekOfYear(
        this[SLOT_THIS].year,
        this[SLOT_THIS].month,
        this[SLOT_DAY]
      );
    },
    enumerable: true,
    configurable: true
  },
  daysInYear: {
    get: function() {
      return ES.LeapYear(this[SLOT_YEAR]) ? 366 : 365;
    },
    enumerable: true,
    configurable: true
  },
  daysInMonth: {
    get: function() {
      return ES.DaysInMonth(this[SLOT_THIS].year, this[SLOT_MONTH]);
    },
    enumerable: true,
    configurable: true
  },
  leapYear: {
    get: function() {
      return ES.LeapYear(this[SLOT_YEAR]);
    },
    enumerable: true,
    configurable: true
  }
});
Date.prototype.with = function(dateLike = {}, disambiguation = "constrain") {
  const {
    year = this[SLOT_YEAR],
    month = this[SLOT_MONTH],
    day = this[SLOT_DAY]
  } = dateTimeLike;
  return new Date(year, month, day, disambiguation);
};
Date.prototype.plus = function plus(
  durationLike = {},
  disambiguation = "constrain"
) {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day } = this;
  let {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  } = duration;
  if (
    hours ||
    minutes ||
    seconds ||
    milliseconds ||
    microseconds ||
    nanoseconds
  )
    throw new RangeError("invalid duration");
  ({ year, month, day } = ES.AddDate(
    year,
    month,
    day,
    years,
    months,
    days,
    disambiguation
  ));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new Date(year, month, day);
};
Date.prototype.minus = function minus(
  durationLike = {},
  disambiguation = "constrain"
) {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day } = this;
  let {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  } = duration;
  if (
    hours ||
    minutes ||
    seconds ||
    milliseconds ||
    microseconds ||
    nanoseconds
  )
    throw new RangeError("invalid duration");
  ({ year, month, day } = ES.SubtractDate(
    year,
    month,
    day,
    years,
    months,
    days,
    disambiguation
  ));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new Date(year, month, day);
};
Date.prototype.difference = function difference(
  other,
  disambiguation = "constrain"
) {
  const [one, two] = [this, other].sort(DateTime.compare);
  let years = two.year - one.year;

  let days =
    ES.DayOfYear(two.year, two.month, two.day) -
    ES.DayOfYear(one.year, one.month, one.day);
  if (days < 0) {
    years -= 1;
    days = (ES.LeapYear(two.year) ? 366 : 365) + days;
  }
  if (
    disambiguation === "constrain" &&
    month === 2 &&
    ES.LeapYear(one.year) &&
    !ES.LeapYear(one.year + years)
  )
    days + 1;

  if (days < 0) {
    years -= 1;
    days += ES.DaysInMonth(two.year, two.month);
  }
  const Duration = ES.GetIntrinsic("%Temporal.Duration%");
  return new Duration(years, 0, days, 0, 0, 0, 0, 0, 0);
};
Date.prototype.toString = function toString() {
  let year = ES.ISOYearString(this[SLOT_YEAR]);
  let month = ES.ISODateTimePartString(this[SLOT_MONTH]);
  let day = ES.ISODateTimePartString(this[SLOT_DAY]);
  let resultString = `${year}-${month}-${day}`;
  return resultString;
};
Date.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};
Date.prototype.toJSON = function toJSON() {
  return this.toString();
};
Date.prototype.withTime = function withTime(
  timeLike,
  disambiguation = "constrain"
) {
  const year = this[SLOT_YEAR];
  const month = this[SLOT_MONTH];
  const day = this[SLOT_DAY];
  const {
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  } = timeLike;
  const DateTime = ES.GetIntrinsic("%Temporal.DateTime%");
  return new DateTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    disambiguation
  );
};
Date.prototype.getYearMonth = function getYearMonth() {
  const YearMonth = ES.GetIntrinsic("%Temporal.YearMonth%");
  return new YearMonth(this[SLOT_YEAR], this[SLOT_MONTH]);
};
Date.prototype.getMonthDay = function getMonthDay() {
  const MonthDay = ES.GetIntrinsic("%Temporal.MonthDay%");
  return new MonthDay(this[SLOT_MONTH], this[SLOT_DAY]);
};

Date.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = DATE.exec(isoString);
  if (!match) throw new RangeError("invalid date string");
  const year = ES.ToInteger(match[1]);
  const month = ES.ToInteger(match[2]);
  const day = ES.ToInteger(match[3]);
  return new Date(year, month, day, "reject");
};
Date.compare = function compare(one, two) {
  if (one.year !== two.year) return one.year - two.year;
  if (one.month !== two.month) return one.month - two.month;
  if (one.day !== two.day) return one.day - two.day;
  return 0;
};
Object.defineProperty(Date.prototype, Symbol.toStringTag, {
  get: () => "Temporal.Date"
});
