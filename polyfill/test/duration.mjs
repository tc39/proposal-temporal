import { Temporal } from '../lib/index.mjs';
import { strict as assert } from 'assert';

let duration;

assert.throws(() => {
  duration = new Temporal.Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'reject');
}, RangeError);

duration = new Temporal.Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'constrain');
assert.equal(duration.years, 1);

duration = new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, 0, 1000, 'balance');
assert.equal(duration.microseconds, 1);

assert.throws(() => {
  duration = new Temporal.Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'xyz');
}, TypeError);
