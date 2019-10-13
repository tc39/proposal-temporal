import { Temporal } from '../lib/index.mjs';
import { strict as assert } from 'assert';

let date = new Temporal.Date(2019, 10, 1);
assert.equal(date.dayOfWeek, 2);

date = new Temporal.Date(2019, 10, 6);
assert.equal(date.dayOfWeek, 7);

let dateFromDate = Temporal.Date.from(date);
assert.equal(dateFromDate, date);

let datetime = new Temporal.DateTime(2019, 10, 1, 14, 20, 36);
let dateFromDatetime = Temporal.Date.from(datetime);
assert.notEqual(dateFromDatetime, datetime);
assert.equal(dateFromDatetime instanceof Temporal.Date, true);
