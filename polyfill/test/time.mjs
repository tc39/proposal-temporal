import { Temporal } from '../lib/index.mjs';
import { strict as assert } from 'assert';

let datetime = new Temporal.DateTime(2019, 10, 1, 14, 20, 36);
let time = Temporal.Time.from(datetime);
assert.notEqual(time, datetime);
