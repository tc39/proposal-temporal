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
        const b2 = a.add(d);
        assert.equal(b2.toString(), b.toString(), `${a}.until(${b}, ${largestUnit}) == ${d}, ${a}.add(${d}) == ${b2}`);
      }

      // Invariant: if A.since(B) is D, then A.subtract(D) is B, for any largestUnit.
      {
        const d = a.since(b, { largestUnit });
        const b2 = a.subtract(d);
        assert.equal(
          b2.toString(),
          b.toString(),
          `${a}.since(${b}, ${largestUnit}) == ${d}, ${a}.subtract(${d}) == ${b2}`
        );
      }
    }

    {
      const d = a.until(b);
      const b2 = a.add(d);
      assert.equal(b2.toString(), b.toString(), `${a}.until(${b}) == ${d}, ${a}.add(${d}) == ${b2}`);

      // Invariant: if A.until(B) is D, then B.subtract(D) is A, for any non-calendar largestUnit.
      const a2 = b.subtract(d);
      assert.equal(a2.toString(), a.toString(), `${a}.until(${b}) == ${d}, ${b}.subtract(${d}) == ${a2}`);
    }

    {
      const d = a.since(b);
      const b2 = a.subtract(d);
      assert.equal(b2.toString(), b.toString(), `${a}.since(${b}) == ${d}, ${a}.subtract(${d}) == ${b2}`);

      // Invariant: if A.since(B) is D, then B.add(D) is A, for any non-calendar largestUnit.
      const a2 = b.add(d);
      assert.equal(a2.toString(), a.toString(), `${a}.since(${b}) == ${d}, ${b}.add(${d}) == ${a2}`);
    }

    progress.tick();
  }
}
