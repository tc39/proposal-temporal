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

  test('parse', ({ equal, end })=>{
    const one = CivilDate.parse('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
    equal(one instanceof CivilDate, true);
    equal(one.year, 1976);
    equal(one.month, 11);
    equal(one.day, 18);

    const two = CivilDate.parse('1976-11-18T15:23:30.450000100[Europe/Vienna]');
    equal(two instanceof CivilDate, true);
    equal(two.year, 1976);
    equal(two.month, 11);
    equal(two.day, 18);

    const three = CivilDate.parse('1976-11-18T15:23:30.450000100+01:00');
    equal(three instanceof CivilDate, true);
    equal(three.year, 1976);
    equal(three.month, 11);
    equal(three.day, 18);

    const four = CivilDate.parse('1976-11-18T15:23:30.450000100');
    equal(four instanceof CivilDate, true);
    equal(four.year, 1976);
    equal(four.month, 11);
    equal(four.day, 18);

    end();
  });

  end();
});
