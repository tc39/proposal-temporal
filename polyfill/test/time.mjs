import { Temporal } from '../lib/index.mjs';
import { strict as assert } from 'assert';

let datetime = new Temporal.DateTime(2019, 10, 1, 14, 20, 36);
let time = Temporal.Time.from(datetime);
assert.notEqual(time, datetime);

time = Temporal.Time.fromString("20:18:32");
assert.equal(time.hour, 20);
assert.equal(time.minute, 18);
assert.equal(time.second, 32);
