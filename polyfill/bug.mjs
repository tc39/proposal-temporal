/* eslint-disable no-debugger */
/* eslint-disable no-console */
import * as Temporal from './lib/temporal.mjs';
const d = new Temporal.Duration(1, 0, 0, 0, 1);
const relativeTo = new Temporal.PlainDate(2020, 2, 29);
console.log(d.round({ smallestUnit: 'years', relativeTo }).toString());
console.log(d.total({ unit: 'years', relativeTo }));

// isoDateTime1: 2020-02-29T00:00
// isoDateTime2: 2021-02-28T01:00
// originEpochNs: 1582934400e9 (=startEpochNs)
// destEpochNs:   1614474000e9
// endDateTime: 2021-02-28T00:00
// endEpochNs: 1614470400e9

const rt2 = relativeTo.toPlainDateTime();
console.log(rt2.until(rt2.add(d), { smallestUnit: 'years' }).toString());
