function makeExpandedTemporal(Temporal) {
  const MULTIPLIER = 86400n * BigInt(1e8) * BigInt(1e9);

  return {
    ...Temporal,
    Absolute: class UnlimitedAbsolute extends Temporal.Absolute {
      #extendedRange; // in units of 1e8 days
      constructor(epochNs) {
        super(epochNs % MULTIPLIER);
        this.#extendedRange = epochNs / MULTIPLIER;
      }
      static from(item) {
        // TODO
      }
      static fromEpochSeconds(epochSeconds) {
        return new this(BigInt(epochSeconds) * BigInt(1e9));
      }
      static fromEpochMilliseconds(epochMilliseconds) {
        return new this(BigInt(epochMilliseconds) * BigInt(1e6));
      }
      static fromEpochMicroseconds(epochMicroseconds) {
        return new this(BigInt(epochMicroseconds) * 1000n);
      }
      static fromEpochNanoseconds(epochNs) {
        return new this(epochNs);
      }
      static compare(one, two) {
        if (one.#extendedRange < two.#extendedRange) return -1;
        if (one.#extendedRange > two.#extendedRange) return 1;
        return super.compare(one, two);
      }
      getEpochSeconds() {
        return Number((this.#extendedRange * MULTIPLIER) / BigInt(1e9) + BigInt(super.getEpochSeconds()));
      }
      getEpochMilliseconds() {
        return Number((this.#extendedRange * MULTIPLIER) / BigInt(1e6) + BigInt(super.getEpochMilliseconds()));
      }
      getEpochMicroseconds() {
        return (this.#extendedRange * MULTIPLIER) / 1000n + super.getEpochMicroseconds();
      }
      getEpochNanoseconds() {
        return this.#extendedRange * MULTIPLIER + super.getEpochNanoseconds();
      }
      inTimeZone(timeZone) {
        // TODO
      }
      plus(duration) {
        // TODO
      }
      minus(duration) {
        // TODO
      }
      difference(other, { largestUnit = 'seconds' } = {}) {
        // TODO
      }
      toString(timeZone = 'UTC') {
        // TODO
      }
      toLocaleString(locales, options) {
        // TODO
      }
      toJSON() {
        return this.toString('UTC');
      }
    },
    Date: class UnlimitedDate extends Temporal.Date {
      #extendedISOYear; // replaces isoYear
      constructor(isoYear, isoMonth, isoDay) {
        super(1970, isoMonth, isoDay);
        this.#extendedISOYear = BigInt(isoYear);
      }
    },
    DateTime: class UnlimitedDateTime extends Temporal.DateTime {
      #extendedISOYear;
      constructor(isoYear, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond) {
        super(1970, isoMonth, isoDay, hour, minute, second, millisecond, microsecond, nanosecond);
        this.#extendedISOYear = BigInt(isoYear);
      }
    },
    YearMonth: class UnlimitedYearMonth extends Temporal.YearMonth {
      #extendedISOYear;
      constructor(isoYear, isoMonth) {
        super(1970, isoMonth, 1);
      }
    }
  };
}
