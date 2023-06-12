import bigInt from 'big-integer';

const MathAbs = Math.abs;
const MathSign = Math.sign;
const NumberIsInteger = Number.isInteger;
const NumberIsSafeInteger = Number.isSafeInteger;

export class TimeDuration {
  static MAX = bigInt('9007199254740991999999999');
  static ZERO = new TimeDuration(bigInt.zero);

  constructor(totalNs) {
    if (typeof totalNs === 'number') throw new Error('assertion failed: big integer required');
    this.totalNs = bigInt(totalNs);
    if (this.totalNs.abs().greater(TimeDuration.MAX)) throw new Error('assertion failed: integer too big');

    const { quotient, remainder } = this.totalNs.divmod(1e9);
    this.sec = quotient.toJSNumber();
    this.subsec = remainder.toJSNumber();
    if (!NumberIsSafeInteger(this.sec)) throw new Error('assertion failed: seconds too big');
    if (MathAbs(this.subsec) > 999_999_999) throw new Error('assertion failed: subseconds too big');
  }

  static #validateNew(totalNs, operation) {
    if (totalNs.abs().greater(TimeDuration.MAX)) {
      throw new RangeError(`${operation} of duration time units cannot exceed ${TimeDuration.MAX} s`);
    }
    return new TimeDuration(totalNs);
  }

  static fromEpochNsDiff(epochNs1, epochNs2) {
    const diff = bigInt(epochNs1).subtract(epochNs2);
    // No extra validate step. Should instead fail assertion if too big
    return new TimeDuration(diff);
  }

  static normalize(h, min, s, ms, µs, ns) {
    const totalNs = bigInt(ns)
      .add(bigInt(µs).multiply(1e3))
      .add(bigInt(ms).multiply(1e6))
      .add(bigInt(s).multiply(1e9))
      .add(bigInt(min).multiply(60e9))
      .add(bigInt(h).multiply(3600e9));
    return TimeDuration.#validateNew(totalNs, 'total');
  }

  abs() {
    return new TimeDuration(this.totalNs.abs());
  }

  add(other) {
    return TimeDuration.#validateNew(this.totalNs.add(other.totalNs), 'sum');
  }

  add24HourDays(days) {
    if (!NumberIsInteger(days)) throw new Error('assertion failed: days is an integer');
    return TimeDuration.#validateNew(this.totalNs.add(bigInt(days).multiply(86400e9)), 'sum');
  }

  addToEpochNs(epochNs) {
    return bigInt(epochNs).add(this.totalNs);
  }

  cmp(other) {
    return this.totalNs.compare(other.totalNs);
  }

  divmod(n) {
    if (n === 0) throw new Error('division by zero');
    const { quotient, remainder } = this.totalNs.divmod(n);
    const q = quotient.toJSNumber();
    const r = new TimeDuration(remainder);
    return { quotient: q, remainder: r };
  }

  fdiv(n) {
    if (n === 0) throw new Error('division by zero');
    let { quotient, remainder } = this.totalNs.divmod(n);

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
    return this.totalNs.isZero();
  }

  round(increment, mode) {
    if (increment === 1) return this;
    let { quotient, remainder } = this.totalNs.divmod(increment);
    if (remainder.equals(bigInt.zero)) return this;
    const sign = remainder.lt(bigInt.zero) ? -1 : 1;
    const tiebreaker = remainder.multiply(2).abs();
    const tie = tiebreaker.equals(increment);
    const expandIsNearer = tiebreaker.gt(increment);
    switch (mode) {
      case 'ceil':
        if (sign > 0) quotient = quotient.add(sign);
        break;
      case 'floor':
        if (sign < 0) quotient = quotient.add(sign);
        break;
      case 'expand':
        // always expand if there is a remainder
        quotient = quotient.add(sign);
        break;
      case 'trunc':
        // no change needed, because divmod is a truncation
        break;
      case 'halfCeil':
        if (expandIsNearer || (tie && sign > 0)) quotient = quotient.add(sign);
        break;
      case 'halfFloor':
        if (expandIsNearer || (tie && sign < 0)) quotient = quotient.add(sign);
        break;
      case 'halfExpand':
        // "half up away from zero"
        if (expandIsNearer || tie) quotient = quotient.add(sign);
        break;
      case 'halfTrunc':
        if (expandIsNearer) quotient = quotient.add(sign);
        break;
      case 'halfEven': {
        if (expandIsNearer || (tie && quotient.isOdd())) quotient = quotient.add(sign);
        break;
      }
    }
    return TimeDuration.#validateNew(quotient.multiply(increment), 'rounding');
  }

  sign() {
    return this.cmp(new TimeDuration(0n));
  }

  subtract(other) {
    return TimeDuration.#validateNew(this.totalNs.subtract(other.totalNs), 'difference');
  }
}
