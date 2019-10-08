import { ES } from './ecmascript.mjs';
import {
  YEARS,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';
import { duration as RAW } from './regex.mjs';
const DRE = new RegExp(`^${RAW.source}$`);

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
  if (!(this instanceof Duration))
    return new Duration(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

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
    ES.AssertPositiveInteger(ES.ToInteger(hours)),
    ES.AssertPositiveInteger(ES.ToInteger(minutes)),
    ES.AssertPositiveInteger(ES.ToInteger(seconds)),
    ES.AssertPositiveInteger(ES.ToInteger(milliseconds)),
    ES.AssertPositiveInteger(ES.ToInteger(microseconds)),
    ES.AssertPositiveInteger(ES.ToInteger(nanoseconds))
  ));
  days += tdays;

  CreateSlots(this);
  SetSlot(this, YEARS, ES.AssertPositiveInteger(ES.ToInteger(years)));
  SetSlot(this, MONTHS, ES.AssertPositiveInteger(ES.ToInteger(months)));
  SetSlot(this, DAYS, ES.AssertPositiveInteger(ES.ToInteger(days)));
  SetSlot(this, HOURS, hours);
  SetSlot(this, MINUTES, minutes);
  SetSlot(this, SECONDS, seconds);
  SetSlot(this, MILLISECONDS, milliseconds);
  SetSlot(this, MICROSECONDS, microseconds);
  SetSlot(this, NANOSECONDS, nanoseconds);
}
Object.defineProperties(Duration.prototype, {
  years: {
    get: function() {
      return GetSlot(this, YEARS);
    },
    enumerable: true,
    configurable: true
  },
  months: {
    get: function() {
      return GetSlot(this, MONTHS);
    },
    enumerable: true,
    configurable: true
  },
  days: {
    get: function() {
      return GetSlot(this, DAYS);
    },
    enumerable: true,
    configurable: true
  },
  hours: {
    get: function() {
      return GetSlot(this, HOURS);
    },
    enumerable: true,
    configurable: true
  },
  minutes: {
    get: function() {
      return GetSlot(this, MINUTES);
    },
    enumerable: true,
    configurable: true
  },
  seconds: {
    get: function() {
      return GetSlot(this, SECONDS);
    },
    enumerable: true,
    configurable: true
  },
  milliseconds: {
    get: function() {
      return GetSlot(this, MILLISECONDS);
    },
    enumerable: true,
    configurable: true
  },
  microseconds: {
    get: function() {
      return GetSlot(this, MICROSECONDS);
    },
    enumerable: true,
    configurable: true
  },
  nanoseconds: {
    get: function() {
      return GetSlot(this, NANOSECONDS);
    },
    enumerable: true,
    configurable: true
  }
});
Duration.prototype.toString = Duration.prototype.toJSON = function toString() {
  const dateParts = [];
  if (GetSlot(this, YEARS)) dateParts.push(`${GetSlot(this, YEARS)}Y`);
  if (GetSlot(this, MONTHS)) dateParts.push(`${GetSlot(this, MONTHS)}M`);
  if (GetSlot(this, DAYS)) dateParts.push(`${GetSlot(this, DAYS)}D`);

  const timeParts = [];
  if (GetSlot(this, HOURS)) timeParts.push(`${GetSlot(this, HOURS)}H`);
  if (GetSlot(this, MINUTES)) timeParts.push(`${GetSlot(this, MINUTES)}H`);

  const secondParts = [];
  if (GetSlot(this, NANOSECONDS)) secondParts.unshift(`000${GetSlot(this, NANOSECONDS)}`.slice(-3));
  if (GetSlot(this, MICROSECONDS) || secondParts.length)
    secondParts.unshift(`000${GetSlot(this, MICROSECONDS)}`.slice(-3));
  if (GetSlot(this, MILLISECONDS) || secondParts.length)
    secondParts.unshift(`000${GetSlot(this, MILLISECONDS)}`.slice(-3));
  if (secondParts.length) secondParts.unshift('.');
  if (GetSlot(this, SECONDS) || secondParts.length) secondParts.unshift(`${this.seconds}`);
  if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
  if (timeParts.length) timeParts.unshift('T');
  if (!dateParts.length && !timeParts.length) return 'PT0S';
  return `P${dateParts.join('')}${timeParts.join('')}`;
};
Object.defineProperty(Duration.prototype, Symbol.toStringTag, {
  value: 'Temporal.Duration'
});
Duration.fromString = function fromString(isoString) {
  isoString = ES.ToString(isoString);
  const match = DRE.exec(isoString);
  if (!match) throw new RangeError(`invalid duration ${isoString}`);
  const years = +(match[1] || 0);
  const months = +(match[2] || 0);
  const days = +(match[3] || 0);
  const hours = +(match[4] || 0);
  const minutes = +(match[5] || 0);
  let seconds = +(match[6] || 0);
  let nanoseconds = Math.floor(seconds * 1000000000);
  const microseconds = Math.floor(nanoseconds / 1000) % 1000;
  const milliseconds = Math.floor(nanoseconds / 1000000) % 1000;
  seconds = Math.floor(nanoseconds / 1000000000);
  nanoseconds = nanoseconds % 1000;
  return new Duration(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
};
