import bigInt from 'big-integer';

const MathAbs = Math.abs;
const MathSign = Math.sign;
const MathTrunc = Math.trunc;
const NumberIsInteger = Number.isInteger;
const NumberIsSafeInteger = Number.isSafeInteger;

export class TimeDuration {
  static ZERO = new TimeDuration(0, 0);

  constructor(sec, subsec) {
    if (!NumberIsSafeInteger(sec)) throw new Error('assertion failed: [[Seconds]] is a safe integer');
    if (!NumberIsSafeInteger(subsec)) throw new Error('assertion failed: [[Subseconds]] is a safe integer');
    if (MathAbs(subsec) > 999_999_999) throw new Error('assertion failed: |[[Subseconds]]| < 1e9');
    if (sec && subsec && MathSign(sec) !== MathSign(subsec)) throw new Error('assertion failed: signs equal');
    this.sec = sec ? sec : 0; // handle -0
    this.subsec = subsec ? subsec : 0;
  }

  static #validateNew(sec, subsec, operation) {
    if (!NumberIsSafeInteger(sec)) {
      throw new RangeError(`${operation} of duration time units cannot exceed 9007199254740991.999999999 s`);
    }
    return new TimeDuration(sec, subsec);
  }

  static fromEpochNsDiff(epochNs1, epochNs2) {
    const diff = bigInt(epochNs1).subtract(epochNs2);
    const { quotient, remainder } = diff.divmod(1e9);
    // No extra validate step. Should instead fail assertion if too big
    return new TimeDuration(quotient.toJSNumber(), remainder.toJSNumber());
  }

  static normalize(h, min, s, ms, µs, ns) {
    let subsec = (ns % 1e9) + (µs % 1e6) * 1e3 + (ms % 1e3) * 1e6;
    const sec =
      h * 3600 +
      min * 60 +
      s +
      MathTrunc(ms / 1e3) +
      MathTrunc(µs / 1e6) +
      MathTrunc(ns / 1e9) +
      MathTrunc(subsec / 1e9);
    subsec %= 1e9;
    return TimeDuration.#validateNew(sec, subsec, 'total');
  }

  abs() {
    return new TimeDuration(MathAbs(this.sec), MathAbs(this.subsec));
  }

  add(other) {
    let sec = this.sec + other.sec;
    let subsec = this.subsec + other.subsec;
    sec += MathTrunc(subsec / 1e9);
    subsec %= 1e9;
    if (sec && subsec && MathSign(sec) !== MathSign(subsec)) {
      const sign = MathSign(sec);
      sec -= sign;
      subsec += sign * 1e9;
    }
    return TimeDuration.#validateNew(sec, subsec, 'sum');
  }

  add24HourDays(days) {
    if (!NumberIsInteger(days)) throw new Error('assertion failed: days is an integer');
    let sec = this.sec + 86400 * days;
    let subsec = this.subsec;
    if (sec && subsec && MathSign(sec) !== MathSign(subsec)) {
      const sign = MathSign(sec);
      sec -= sign;
      subsec += sign * 1e9;
    }
    return TimeDuration.#validateNew(sec, subsec, 'sum');
  }

  addToEpochNs(epochNs) {
    return bigInt(epochNs).add(this.subsec).add(bigInt(this.sec).multiply(1e9));
  }

  cmp(other) {
    if (this.sec > other.sec) return 1;
    if (this.sec < other.sec) return -1;
    if (this.subsec > other.subsec) return 1;
    if (this.subsec < other.subsec) return -1;
    return 0;
  }

  divmod(n) {
    if (n === 0) throw new Error('division by zero');
    const subsecRemainder = this.subsec % n;
    // FIXME: 90061333666999 % 3 === 1, while 333666999 %3 === 0
    const subsecQuotient = MathTrunc(this.subsec / n);
    const secDivisor = n / 1e9;
    const secRemainder = MathTrunc(this.sec % secDivisor);
    const secQuotient = MathTrunc(this.sec / secDivisor);
    return {
      quotient: secQuotient + subsecQuotient,
      remainder: new TimeDuration(secRemainder, subsecRemainder)
    };
  }

  fdiv(n) {
    if (n === 0) throw new Error('division by zero');
    let { quotient, remainder } = this.divmod(n);

    // Perform long division to calculate the fractional part of the quotient
    // remainder / n with more accuracy than 64-bit floating point division
    const precision = 50;
    const decimalDigits = [];
    let digit;
    const sign = (this.totalNs.geq(0) ? 1 : -1) * MathSign(n);
    while (!remainder.isZero() && decimalDigits.length < precision) {
      remainder = remainder.multiply(10);
      ({ quotient: digit, remainder } = remainder.divmod(n));
      decimalDigits.push(MathAbs(digit.toJSNumber()));
    }
    return sign * Number(quotient.abs().toString() + '.' + decimalDigits.join(''));
  }

  isZero() {
    return this.sec === 0 && this.subsec === 0;
  }

  round(increment, mode) {
    if (increment === 1) return this;
    let { quotient, remainder } = this.divmod(increment);
    if (remainder.isZero()) return this;
    const sign = remainder.sign();
    const tiebreaker = remainder.add(remainder).abs();
    const tie = tiebreaker.sec === MathTrunc(increment / 1e9) && tiebreaker.subsec === increment % 1e9;
    const expandIsNearer = tiebreaker.subsec > increment || tiebreaker.sec > MathTrunc(increment / 1e9);
    switch (mode) {
      case 'ceil':
        if (sign > 0) quotient += sign;
        break;
      case 'floor':
        if (sign < 0) quotient += sign;
        break;
      case 'expand':
        // always expand if there is a remainder
        quotient += sign;
        break;
      case 'trunc':
        // no change needed, because divmod is a truncation
        break;
      case 'halfCeil':
        if (expandIsNearer || (tie && sign > 0)) quotient += sign;
        break;
      case 'halfFloor':
        if (expandIsNearer || (tie && sign < 0)) quotient += sign;
        break;
      case 'halfExpand':
        // "half up away from zero"
        if (expandIsNearer || tie) quotient += sign;
        break;
      case 'halfTrunc':
        if (expandIsNearer) quotient += sign;
        break;
      case 'halfEven': {
        if (expandIsNearer || (tie && quotient % 2 !== 0)) quotient += sign;
        break;
      }
    }
    const value = quotient * increment;
    return TimeDuration.#validateNew(MathTrunc(value / 1e9), value % 1e9, 'rounding');
  }

  sign() {
    if (this.sec === 0) return MathSign(this.subsec);
    return MathSign(this.sec);
  }

  subtract(other) {
    let sec = this.sec - other.sec;
    let subsec = this.subsec - other.subsec;
    sec += MathTrunc(subsec / 1e9);
    subsec %= 1e9;
    if (sec && subsec && MathSign(sec) !== MathSign(subsec)) {
      const sign = MathSign(sec);
      sec -= sign;
      subsec += sign * 1e9;
    }
    return TimeDuration.#validateNew(sec, subsec, 'difference');
  }
}
