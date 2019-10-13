import { Temporal } from '../lib/index.mjs';
import { strict as assert } from 'assert';

let date = new Temporal.Date(2019, 10, 1);
assert.equal(date.dayOfWeek, 2);

date = new Temporal.Date(2019, 10, 6);
assert.equal(date.dayOfWeek, 7);

let dateFromDate = Temporal.Date.from(date);
assert.equal(dateFromDate, date);
