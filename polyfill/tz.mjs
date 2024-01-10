/* eslint-disable no-console */
import * as Temporal from './lib/temporal.mjs';

class MaxShiftTimeZone extends Temporal.TimeZone {
  id = 'Custom/Max_Shift';
  #before = new Temporal.TimeZone('-23:59');
  #after = new Temporal.TimeZone('+23:59');
  #shiftInstant;

  constructor(shiftExact) {
    super('UTC');
    this.#shiftInstant = Temporal.Instant.from(shiftExact);
  }

  getOffsetNanosecondsFor(instant) {
    return instant.epochNanoseconds < this.#shiftInstant.epochNanoseconds
      ? this.#before.getOffsetNanosecondsFor(instant)
      : this.#after.getOffsetNanosecondsFor(instant);
  }

  getPossibleInstantsFor(plainDateTime) {
    const instant1 = this.#before.getInstantFor(plainDateTime, { disambiguation: 'reject' });
    const instant2 = this.#after.getInstantFor(plainDateTime, { disambiguation: 'reject' });
    const possibleInstants = [];
    if (instant1.epochNanoseconds <= this.#shiftInstant.epochNanoseconds) possibleInstants.push(instant1);
    if (instant2.epochNanoseconds >= this.#shiftInstant.epochNanoseconds) possibleInstants.push(instant2);
    return possibleInstants;
  }
}

const tz = new MaxShiftTimeZone('1970-01-02T00:00Z');

// Consistency checks
const start = Temporal.Instant.from('1970-01-01T23:59:59.999999995Z').toZonedDateTimeISO(tz);
console.log(start.toString());
const end = Temporal.Instant.from('1970-01-02T00:00:00.000000005Z').toZonedDateTimeISO(tz);
console.log(end.toString());
const before = tz.getPossibleInstantsFor('1970-01-01T00:00');
console.log(before.map((i) => `${i}`));
const mid = tz.getPossibleInstantsFor('1970-01-02T00:00');
console.log(mid.map((i) => `${i}`));
const after = tz.getPossibleInstantsFor('1970-01-03T00:00');
console.log(after.map((i) => `${i}`));

// Is there an additional bug here?
const duration = Temporal.Duration.from({ hours: 48 });
console.log(duration.total({ unit: 'days', relativeTo: start }));
