const test = require('tape');
const { CivilDate } = require('../../');

test('CivilDate', ({ test, end })=>{
  test('construct', ({ equal, end })=>{
    const instance = new CivilDate(1976, 11, 18);

    equal(typeof instance, 'object');
    equal(instance instanceof CivilDate, true);
    equal(instance.year, 1976);
    equal(instance.month, 11);
    equal(instance.day, 18);
    equal(instance.hour, undefined);
    equal(instance.minute, undefined);
    equal(instance.second, undefined);
    equal(instance.millisecond, undefined);
    equal(instance.nanosecond, undefined);
    equal(instance.toString(), '1976-11-18');

    end();
  });

  test('fromString', ({ equal, throws, end })=>{
    const one = CivilDate.fromString('1976-11-18');
    equal(one instanceof CivilDate, true);
    equal(one.year, 1976);
    equal(one.month, 11);
    equal(one.day, 18);

    throws(()=>{
      CivilDate.fromString('1976-11-18T15:23:30.450000100');
    });
    throws(()=>{
      CivilDate.fromString('1976-11-18T15:23:30');
    });
    throws(()=>{
      CivilDate.fromString('1976-11-18 15:23:30');
    });
    throws(()=>{
      CivilDate.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    });
    throws(()=>{
      CivilDate.fromString('1976-11-18T15:23:30.450000100+01:00');
    });

    end();
  });

  end();
});
