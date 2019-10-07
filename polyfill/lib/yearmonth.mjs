import { ES } from "./ecmascript.mjs";
import { SLOT_YEAR, SLOT_MONTH } from "./slots.mjs";

import { yearmonth as RAW } from "./regex.mjs";
const DATE = new RegExp(`^${RAW.source}$`);

export function YearMonth(year, month, disambiguation) {
  if (!(this instanceof YearMonth))
    return new YearMonth(year, month, disambiguation);
  year = ES.ToInteger(year);
  month = ES.ToInteger(month);
  ({ year, month } = ES.ConstrainDate(year, month, 1));
  switch (disambiguation) {
    case "constrain":
      ({ year, month } = ES.ConstrainDate(year, month, 1));
      break;
    case "balance":
      ({ year, month } = ES.BalanceYearMonth(year, month));
      break;
    default:
      ES.RejectDate(year, month, 1);
  }

  this[SLOT_YEAR] = year;
  this[SLOT_MONTH] = month;
}
Object.defineProperties(YearMonth.prototype, {
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
YearMonth.prototype.with = function(
  dateLike = {},
  disambiguation = "constrain"
) {
  const { year = this[SLOT_YEAR], month = this[SLOT_MONTH] } = dateTimeLike;
  return new YearMonth(year, month, disambiguation);
};
YearMonth.prototype.plus = function plus(
  durationLike = {},
  disambiguation = "constrain"
) {
  const duration = ES.CastToDuration(durationLike);
  let { year, month } = this;
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
    (days,
    hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
  )
    throw new RangeError("invalid duration");
  ({ year, month } = ES.AddDate(
    year,
    month,
    1,
    years,
    months,
    0,
    disambiguation
  ));
  ({ year, month } = ES.BalanceYearMonth(year, month));
  return new YearMonth(year, month);
};
YearMonth.prototype.minus = function minus(
  durationLike = {},
  disambiguation = "constrain"
) {
  const duration = ES.CastToDuration(durationLike);
  let { year, month } = this;
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
    days ||
    hours ||
    minutes ||
    seconds ||
    milliseconds ||
    microseconds ||
    nanoseconds
  )
    throw new RangeError("invalid duration");
  ({ year, month } = ES.SubtractDate(
    year,
    month,
    1,
    years,
    months,
    0,
    disambiguation
  ));
  ({ year, month } = ES.BalanceYearMonth(year, month));
  return new YearMonth(year, month);
};
YearMonth.prototype.difference = function difference(
  other,
  disambiguation = "constrain"
) {
  const [one, two] = [this, other].sort(DateTime.compare);
  let years = two.year - one.year;
  let months = two.month - one.month;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const Duration = ES.GetIntrinsic("%Temporal.Duration%");
  return new Duration(years, months);
};
YearMonth.prototype.toString = function toString() {
  let year = ES.ISOYearString(this[SLOT_YEAR]);
  let month = ES.ISODateTimePartString(this[SLOT_MONTH]);
  let resultString = `${year}-${month}`;
  return resultString;
};
YearMonth.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};
YearMonth.prototype.toJSON = function toJSON() {
  return this.toString();
};
YearMonth.prototype.withDay = function withDay(
  day,
  disambiguation = "constrain"
) {
  const year = this[SLOT_YEAR];
  const month = this[SLOT_MONTH];
  const Date = ES.GetIntrinsic("%Temporal.Date%");
  return new Date(year, month, day, disambiguation);
};

YearMonth.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = DATE.exec(isoString);
  if (!match) throw new RangeError("invalid date string");
  const year = ES.ToInteger(match[1]);
  const month = ES.ToInteger(match[2]);
  return new YearMonth(year, month, "reject");
};
YearMonth.compare = function compare(one, two) {
  if (one.year !== two.year) return one.year - two.year;
  if (one.month !== two.month) return one.month - two.month;
  return 0;
};

Object.defineProperty(YearMonth.prototype, Symbol.toStringTag, {
  get: () => "Temporal.YearMonth"
});
