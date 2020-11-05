const time = Temporal.PlainTime.from('12:38:28.138818731');

const wholeHour = time.round({ smallestUnit: 'hour', roundingMode: 'floor' });

assert.equal(wholeHour.toString(), '12:00:00');
