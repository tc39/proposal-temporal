import { strict as assert } from 'assert';
import ProgressBar from 'progress';

import * as Temporal from './lib/temporal.mjs';

const base = Temporal.PlainDate.from('1970-01-01');

const progress = new ProgressBar(':bar :percent (:current/:total) | :etas', {
  total: 1461 ** 2,
  complete: '\u2588',
  incomplete: '\u2591',
  width: 20,
  stream: process.stdout,
  renderThrottle: 50,
  clear: true
});

for (let i = 0; i <= 1461; i++) {
  const a = base.add({ days: i });
  for (let j = 0; j <= 1461; j++) {
    const b = base.add({ days: j });
    for (const largestUnit of ['weeks', 'months', 'years']) {
      // Invariant: if A.until(B) is D, then A.add(D) is B, for any largestUnit.
      {
        const d = a.until(b, { largestUnit });
        const b2 = a.add({ years: d.years, months: d.months })
            .add({ weeks: d.weeks })
            .add({ days: d.days });
        if (b2.toString() !== b.toString()) {
            console.log(`invariant failed: ${a}.until(${b}, ${largestUnit}) == ${d}`);
            console.log(`added all at once: ${a}.add(${d}) == ${a.add(d)}`);
            console.log('added component by component:');
            const aym = a.add({ years: d.years, months: d.months });
            console.log(`  ${a}.add({ years: ${d.years}, months: ${d.months} }) == ${aym}`);
            const aymw = aym.add({ weeks: d.weeks });
            console.log(`  ${aym}.add({ weeks: ${d.weeks}}) == ${aymw}`);
            const aymwd = aymw.add({ days: d.days });
            console.log(`  ${aymw}.add({ days: ${d.days}}) == ${aymwd}`);
        }
      }
    }

    progress.tick();
  }
}
