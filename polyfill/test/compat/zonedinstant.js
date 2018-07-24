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
    equal(instance.toString(), '1976-11-18T15:23:30.450000000+01:00');
    end();
  });

  test('fromString', ({ equal, throws, end })=>{
    const one = ZonedInstant.fromString('1976-11-18T15:23:30.450000100+01:00');

    equal(one instanceof ZonedInstant, true);
    equal(one.milliseconds, Date.parse('1976-11-18T15:23:30.450000100+01:00'));
    equal(one.nanoseconds, 100);
    equal(one.timeZone, '+01:00');

    throws(()=>{
      ZonedInstant.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    });
    throws(()=>{
      ZonedInstant.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    });
    throws(()=>{
      ZonedInstant.fromString('1976-11-18T15:23:30.450000100');
    });

    end();
  });

  end();
});
