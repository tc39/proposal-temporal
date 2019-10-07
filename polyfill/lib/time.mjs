import { ES } from "./ecmascript.mjs";

import {
  SLOT_HOUR,
  SLOT_MINUTE,
  SLOT_SECOND,
  SLOT_MILLISECOND,
  SLOT_MICROSECOND,
  SLOT_NANOSECOND
} from "./slots.mjs";

import { time as RAW } from "./regex.mjs";
const TIME = new RegExp(`^${RAW.source}$`);

export function Time(
  hour,
  minute,
  second = 0,
  millisecond = 0,
  microsecond = 0,
  nanosecond = 0,
  disambiguation = "constrain"
) {
  if (!(this instanceof Time))
    return new Time(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    );
  hour = ES.ToInteger(hour);
  minute = ES.ToInteger(minute);
  second = ES.ToInteger(second);
  millisecond = ES.ToInteger(millisecond);
  microsecond = ES.ToInteger(microsecond);
  nanosecond = ES.ToInteger(nanosecond);
  switch (disambiguation) {
    case "constrain":
      ({
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      } = ES.ConstrainTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      ));
      break;
    case "balance":
      ({
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      } = ES.BalanceTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      ));
      break;
    default:
      ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  this[SLOT_HOUR] = hour;
  this[SLOT_MINUTE] = minute;
  this[SLOT_SECOND] = second;
  this[SLOT_MILLISECOND] = millisecond;
  this[SLOT_MICROSECOND] = microsecond;
  this[SLOT_NANOSECOND] = nanosecond;
}
Object.defineProperties(Time.prototype, {
  hour: {
    get: function() {
      return this[SLOT_HOUR];
    },
    enumerable: true,
    configurable: true
  },
  minute: {
    get: function() {
      return this[SLOT_MINUTE];
    },
    enumerable: true,
    configurable: true
  },
  second: {
    get: function() {
      return this[SLOT_SECOND];
    },
    enumerable: true,
    configurable: true
  },
  millisecond: {
    get: function() {
      return this[SLOT_MILLISECOND];
    },
    enumerable: true,
    configurable: true
  },
  microsecond: {
    get: function() {
      return this[SLOT_MICROSECOND];
    },
    enumerable: true,
    configurable: true
  },
  nanosecond: {
    get: function() {
      return this[SLOT_NANOSECOND];
    },
    enumerable: true,
    configurable: true
  }
});
Time.prototype.with = function(timeLike = {}, disambiguation = "constrain") {
  const {
    hour = this[SLOT_HOUR],
    minute = this[SLOT_MINUTE],
    second = this[SLOT_SECOND],
    millisecond = this[SLOT_MILLISECOND],
    microsecond = this[SLOT_MICROSECOND],
    nanosecond = this[SLOT_NANOSECOND]
  } = timeLike;
  return new Time(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    disambiguation
  );
};
Time.prototype.plus = function plus(durationLike) {
  const duration = ES.CastToDuration(durationLike);
  let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
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
  if (years || months || days) throw new RangeError("invalid duration");
  ({ hour, minute, second, minute, microsecond, nanosecond } = ES.AddTime(
    hour,
    minute,
    second,
    minute,
    microsecond,
    nanosecond,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  ));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new Time(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  );
};
Time.prototype.minus = function minus(durationLike) {
  const duration = ES.CastToDuration(durationLike);
  let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
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
  if (years || months || days) throw new RangeError("invalid duration");
  ({ hour, minute, second, minute, microsecond, nanosecond } = ES.SubtractTime(
    hour,
    minute,
    second,
    minute,
    microsecond,
    nanosecond,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  ));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new Time(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  );
};
Time.prototype.difference = function difference(other = {}) {
  const [one, two] = [
    this,
    Object.assign(
      {
        hours: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0
      },
      other
    )
  ].sort(Time.compare);
  const hours = two.hour - one.hour;
  const minutes = two.minute - one.minute;
  const seconds = two.second - one.seconds;
  const milliseconds = two.millisecond - one.millisecond;
  const microseconds = two.microsecond - one.microsecond;
  const nanoseconds = two.nanosecond - one.nanosecond;
  return new Duration(
    0,
    0,
    0,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  );
};

Time.prototype.toString = function toString() {
  let hour = ES.ISODateTimePartString(this[SLOT_HOUR]);
  let minute = ES.ISODateTimePartString(this[SLOT_MINUTE]);
  let seconds = ES.ISOSecondsString(
    this[SLOT_SECOND],
    this[SLOT_MILLISECOND],
    this[SLOT_MICROSECOND],
    this[SLOT_NANOSECOND]
  );
  let resultString = `${hour}:${minute}${seconds ? `:${seconds}` : ""}`;
  return resultString;
};
Time.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};
Time.prototype.toJSON = function toJSON() {
  return this.toString();
};

Time.prototype.withDate = function withDate(
  dateLike = {},
  disambiguation = "constrain"
) {
  let { year, month, day } = dateLike;
  let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
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

Time.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = TIME.exec(isoString);
  if (!match) throw new RangeError("invalid datetime string");
  const hour = ES.ToInteger(match[1]);
  const minute = ES.ToInteger(match[2]);
  const second = match[3] ? ES.ToInteger(match[3]) : 0;
  const millisecond = match[4] ? ES.ToInteger(match[4]) : 0;
  const microsecond = match[5] ? ES.ToInteger(match[5]) : 0;
  const nanosecond = match[6] ? ES.ToInteger(match[6]) : 0;
  return new Time(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    "reject"
  );
};
Time.compare = function compare(one, two) {
  if (one.hour !== two.hour) return one.hour - two.hour;
  if (one.minute !== two.minute) return one.minute - two.minute;
  if (one.second !== two.second) return one.second - two.second;
  if (one.millisecond !== two.millisecond)
    return one.millisecond - two.millisecond;
  if (one.microsecond !== two.microsecond)
    return one.microsecond - two.microsecond;
  if (one.nanosecond !== two.nanosecond) return one.nanosecond - two.nanosecond;
  return 0;
};
Object.defineProperty(Time.prototype, Symbol.toStringTag, {
  get: () => "Temporal.Time"
});
