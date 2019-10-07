import { ES } from "./ecmascript.mjs";
import {
  SLOT_YEARS,
  SLOT_MONTHS,
  SLOT_DAYS,
  SLOT_HOURS,
  SLOT_MINUTES,
  SLOT_SECONDS,
  SLOT_MILLISECONDS,
  SLOT_MICROSECONDS,
  SLOT_NANOSECONDS
} from "./slots.mjs";

export function Duration(
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
  microseconds = 0,
  nanoseconds = 0
) {
  if (
    years &&
    !months &&
    !days &&
    !hours &&
    !minutes &&
    !seconds &&
    !milliseconds &&
    !microseconds &&
    !nanoseconds
  ) {
    if ("string" === typeof years) {
      return Duration.fromString(years);
    }
    if ("object" === typeof years) {
      ({
        years = 0,
        months = 0,
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        milliseconds = 0,
        microseconds = 0,
        nanoseconds = 0
      } = years);
    }
  }
  if (!(this instanceof Duration))
    return new Duration(
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
  let tdays;
  ({
    days: tdays,
    hour: hours,
    minute: minutes,
    second: seconds,
    millisecond: milliseconds,
    microsecond: microseconds,
    nanosecond: nanoseconds
  } = ES.BalanceTime(
    ES.ToPositiveInteger(hours),
    ES.ToPositiveInteger(minutes),
    ES.ToPositiveInteger(seconds),
    ES.ToPositiveInteger(milliseconds),
    ES.ToPositiveInteger(microseconds),
    ES.ToPositiveInteger(nanoseconds)
  ));
  days += tdays;

  this[SLOT_YEARS] = ES.ToPositiveInteger(years);
  this[SLOT_MONTHS] = ES.ToPositiveInteger(months);
  this[SLOT_DAYS] = ES.ToPositiveInteger(days);
  this[SLOT_HOURS] = hours + days * 24;
  this[SLOT_MINUTES] = minutes;
  this[SLOT_SECONDS] = seconds;
  this[SLOT_MILLISECONDS] = milliseconds;
  this[SLOT_MICROSECONDS] = microseconds;
  this[SLOT_NANOSECONDS] = nanoseconds;
}
Object.defineProperties(Duration.prototype, {
  years: {
    get: function() {
      return this[SLOT_YEARS];
    },
    enumerable: true,
    configurable: true
  },
  months: {
    get: function() {
      return this[SLOT_MONTHS];
    },
    enumerable: true,
    configurable: true
  },
  days: {
    get: function() {
      return this[SLOT_DAYS];
    },
    enumerable: true,
    configurable: true
  },
  hours: {
    get: function() {
      return this[SLOT_HOURS];
    },
    enumerable: true,
    configurable: true
  },
  minutes: {
    get: function() {
      return this[SLOT_MINUTES];
    },
    enumerable: true,
    configurable: true
  },
  seconds: {
    get: function() {
      return this[SLOT_SECONDS];
    },
    enumerable: true,
    configurable: true
  },
  milliseconds: {
    get: function() {
      return this[SLOT_MILLISECONDS];
    },
    enumerable: true,
    configurable: true
  },
  microseconds: {
    get: function() {
      return this[SLOT_MICROSECONDS];
    },
    enumerable: true,
    configurable: true
  },
  nanoseconds: {
    get: function() {
      return this[SLOT_NANOSECONDS];
    },
    enumerable: true,
    configurable: true
  }
});
Duration.prototype.toString = function toString() {
  const dateParts = [];
  if (this[SLOT_YEARS]) dateParts.push(`${this[SLOT_YEARS]}Y`);
  if (this[SLOT_MONTHS]) dateParts.push(`${this[SLOT_MONTHS]}M`);
  if (this[SLOT_DAYS]) dateParts.push(`${this[SLOT_DAYS]}D`);

  const timeParts = [];
  if (this[SLOT_HOURS]) timeParts.push(`${this[SLOT_HOURS]}H`);
  if (this[SLOT_MINUTES]) timeParts.push(`${this[SLOT_MINUTES]}H`);

  const secondParts = [];
  if (this[SLOT_NANOSECONDS])
    secondParts.unshift(`000${this[SLOT_NANOSECONDS]}`.slice(-3));
  if (this[SLOT_MICROSECONDS] || secondParts.length)
    secondParts.unshift(`000${this[SLOT_MICROSECONDS]}`.slice(-3));
  if (this[SLOT_MILLISECONDS] || secondParts.length)
    secondParts.unshift(`000${this[SLOT_MILLISECONDS]}`.slice(-3));
  if (secondParts.length) secondParts.unshift(".");
  if (this[SLOT_SECONDS] || secondParts.length)
    secondParts.unshift(`${this.seconds}`);
  if (secondParts.length) timeParts.push(`${secondParts.join("")}S`);
  if (timeParts.length) timeParts.unshift("T");
  if (!dateParts.length && !timeParts.length) return "PT0S";
  return `P${dateParts.join("")}${timeParts.join("")}`;
};
Object.defineProperty(Duration.prototype, Symbol.toStringTag, {
  get: () => "Temporal.Duration"
});
