const test = require('tape');
const { Instant } = require('../../');

test('Instant', ({ test, end})=>{
  test('simple', ({ equal, end })=>{
    const instant = Instant.fromDate(0);

    equal('1970-01-01T00:00:00.000000000+00:00[UTC]', instant.toString());

    const now = new Date();
    const nowi = Instant.fromDate(now);
    equal(now.toISOString().replace('Z','000000+00:00[UTC]'), nowi.toString());
    end();
  });

  test('construct', ({ equal, end })=>{
    const instance = Instant.fromDate(217178610450);

    equal(typeof instance, 'object');
    equal(instance instanceof Instant, true);
    equal(instance.milliseconds, 217178610450);
    equal(instance.nanoseconds, 0);
    equal(instance.toString(), '1976-11-18T15:23:30.450000000+00:00[UTC]');

    end();
  });

  test('parse', ({ equal, end })=>{
    const one = Instant.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    equal(one instanceof Instant, true);
    equal(one.milliseconds, 217175010450);
    equal(one.nanoseconds, 100);


    const two = Instant.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    equal(two instanceof Instant, true);
    equal(two.milliseconds, 217175010450);
    equal(two.nanoseconds, 100);

    const three = Instant.parse('1976-11-18T15:23:30.450000100+01:00');
    equal(three instanceof Instant, true);
    equal(three.milliseconds, 217175010450);
    equal(three.nanoseconds, 100);

    const four = Instant.parse('1976-11-18T15:23:30.450000100');
    equal(four instanceof Instant, true);
    equal(four.milliseconds, 217178610450);
    equal(four.nanoseconds, 100);

    end();
  });

  end();
});
