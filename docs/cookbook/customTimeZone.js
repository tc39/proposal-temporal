function formatOffsetString(sign, offset) {
  const hours = `${offset.hours}`.padStart(2, '0');
  const minutes = `${offset.minutes}`.padStart(2, '0');
  return `${sign < 0 ? '-' : '+'}${hours}:${minutes}`;
}

const nsPerDay = 86400_000_000_000n;
const nsPerMillisecond = 1_000_000n;

function Day(t) {
  return Math.floor(t / nsPerDay);
}

function MakeDate(day, time) {
  return day * nsPerDay + time;
}

function MakeDay(year, month, day) {
  const m = month - 1;
  const ym = year + Math.floor(m / 12);
  const mn = m % 12;
  const t = BigInt(Date.UTC(ym, mn, 1)) * nsPerMillisecond;
  return Day(t) + day - 1;
}

function MakeTime(h, min, s, ms, µs, ns) {
  const MinutesPerHour = 60n;
  const SecondsPerMinute = 60n;
  const nsPerSecond = 1_000_000_000n;
  const nsPerMinute = nsPerSecond * SecondsPerMinute;
  const nsPerHour = nsPerMinute * MinutesPerHour;
  return (
    BigInt(h) * nsPerHour +
    BigInt(min) * nsPerMinute +
    BigInt(s) * nsPerSecond +
    BigInt(ms) * nsPerMillisecond +
    BigInt(µs) * 1000n +
    BigInt(ns)
  );
}

class OffsetTimeZone extends Temporal.TimeZone {
  constructor(sign = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0) {
    const hourString = `${hours}`.padStart(2, '0');
    const minuteString = `${minutes}`.padStart(2, '0');
    const name = `${sign < 0 ? '-' : '+'}${hourString}:${minuteString}`;
    super(name);
    this._offsetNs = BigInt(sign) * MakeTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }

  // Implementations of TimeZone protocol //////////////////////////////////////

  getOffsetAtInstant(/* epochNs */) {
    return this._offsetNs; // offset is always the same
  }

  possibleInstants(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond) {
    const epochNs = MakeDate(
      MakeDay(isoYear, isoMonth, isoDay),
      MakeTime(hour, minute, second, millisecond, microsecond, nanosecond)
    );
    return [epochNs + this._offsetNs];
  }

  // (optional?) Implementations of public API /////////////////////////////////

  // eslint-disable-next-line require-yield
  *getTransitions() {
    return null; // no transitions ever
  }

  // Public API that should be inherited from TimeZone /////////////////////////

  getOffsetFor(absolute) {
    return formatOffsetString(this.getOffsetAtInstant(absolute));
  }

  // Make ES.GetTimeZoneDateTimeParts take an offset instead of a time zone id
  /*getDateTimeFor(absolute) {
    const ns = absolute.getEpochNanoseconds();
    const {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    } = ES.GetTimeZoneDateTimeParts(ns, this.getOffsetAtInstant(ns));
    return new Temporal.DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }*/

  getAbsoluteFor(dateTime, options = undefined) {
    options ??= { disambiguation: 'earlier' };
    const { disambiguation } = options;
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;
    const possibleInstants = this.possibleInstants(
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
    if (possibleInstants.length === 1) return new Temporal.Absolute(possibleInstants[0]);
    if (possibleInstants.length) {
      switch (disambiguation) {
        case 'earlier':
          return new Temporal.Absolute(possibleInstants[0]);
        case 'later':
          return new Temporal.Absolute(possibleInstants[1]);
        case 'reject':
          throw new RangeError('multiple absolute found');
      }
    }

    const utcns = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (utcns === null) throw new RangeError('DateTime outside of supported range');
    const dayNs = 86400n * BigInt(1e9);
    const before = this.getOffsetAtInstant(utcns - dayNs);
    const after = this.getOffsetAtInstant(utcns + dayNs);
    const diff = after.minus(before);
    switch (disambiguation) {
      case 'earlier': {
        const earlier = dateTime.minus(diff);
        return this.getAbsoluteFor(earlier, disambiguation);
      }
      case 'later': {
        const later = dateTime.plus(diff);
        return this.getAbsoluteFor(later, disambiguation);
      }
      case 'reject': {
        throw new RangeError('no such absolute found');
      }
    }
  }
}
