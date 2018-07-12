const test = require('tape');
const { Instant, ZonedInstant } = require('../../');

test('ZonedInstant', ({ test, end})=>{
  test('simple', ({ equal, end })=>{

    end();
  });

  test('construct', ({ equal, end })=>{
    const instant = Instant.fromMilliseconds(217175010450);
    const instance = new ZonedInstant(instant, 'Europe/Vienna');

    equal(typeof instance, 'object');
    equal(instance instanceof ZonedInstant, true);
    equal(instance.milliseconds, 217175010450);
    equal(instance.nanoseconds, 0);
    equal(instance.toString(), '1976-11-18T15:23:30.450000000+01:00[Europe/Vienna]');
    end();
  });

  test('parse', ({ equal, end })=>{
    const one = ZonedInstant.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    equal(one instanceof ZonedInstant, true);
    equal(one.milliseconds, 217175010450);
    equal(one.nanoseconds, 100);
    equal(one.timeZone, 'Europe/Vienna');

    const two = ZonedInstant.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    equal(two instanceof ZonedInstant, true);
    equal(two.milliseconds, 217175010450);
    equal(two.nanoseconds, 100);
    equal(two.timeZone, 'Europe/Vienna');

    const three = ZonedInstant.parse('1976-11-18T15:23:30.450000100+01:00');
    equal(three instanceof ZonedInstant, true);
    equal(three.milliseconds, 217175010450);
    equal(three.nanoseconds, 100);
    equal(three.timeZone, 'Europe/Andorra');

    const four = ZonedInstant.parse('1976-11-18T15:23:30.450000100');
    equal(four instanceof ZonedInstant, true);
    equal(four.milliseconds, 217178610450);
    equal(four.nanoseconds, 100);
    equal(four.timeZone, 'Europe/London');

    end();
  });

  end();
});
