const test = require('tape');
const { Instant } = require('../../');

test('Instant', ({ test, end})=>{
  test('simple', ({ equal, end })=>{
    const instant = Instant.fromMilliseconds(0);

    equal('1970-01-01T00:00:00.000000000Z', instant.toString());

    const now = new Date();
    const nowi = Instant.fromMilliseconds(now);
    equal(now.toISOString().replace('Z','000000Z'), nowi.toString());
    end();
  });

  test('construct', ({ equal, end })=>{
    const instance = Instant.fromMilliseconds(217178610450);

    equal(typeof instance, 'object');
    equal(instance instanceof Instant, true);
    equal(instance.milliseconds, 217178610450);
    equal(instance.nanoseconds, 0);
    equal(instance.toString(), '1976-11-18T15:23:30.450000000Z');

    end();
  });

  test('fromString', ({ equal, throws, end })=>{
    const one = Instant.fromString('1976-11-18T15:23:30.450000100Z');
    equal(one instanceof Instant, true);
    equal(one.milliseconds, 217178610450);
    equal(one.nanoseconds, 100);

    throws(()=>{
      Instant.fromString('1976-11-18T15:23:30.450000100[Europe/Berlin]');
    });
    throws(()=>{
      Instant.fromString('1976-11-18T15:23:30.450000100+01:00');
    });
    throws(()=>{
      Instant.fromString('1976-11-18T15:23:30.450000100');
    });
    throws(()=>{
      Instant.fromString('1976-11-18T15:23:30.450000100+01:00');
    });
    throws(()=>{
      Instant.fromString('1976-11-18T15:23:30.450000100');
    });

    end();
  });

  end();
});
