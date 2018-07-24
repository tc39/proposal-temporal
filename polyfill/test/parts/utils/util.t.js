const test = require('tape');

const { plus, pad, spad, validZone } = require('./util.js');

test('plus', ({ equal, end })=>{
  end();
});

test('pad', ({ equal, end })=>{
  equal(pad('13', 3), '013');
  equal(pad('1343', 3), '1343');
  equal(pad('012', 5), '00012');
  equal(pad(12, 3), '012');
  equal(pad(-12, 3), '012');
  end();
});
test('spad', ({ equal, end })=>{
  equal(spad('13', 3), '013');
  equal(spad('1343', 3), '1343');
  equal(spad('012', 5), '00012');
  equal(spad(12, 3), '012');
  equal(spad(-12, 3), '-012');
  end();
});

test('validZone', ({ equal, throws, end })=>{
  equal(validZone('UTC'), 'UTC');
  equal(validZone('+1'), '+01:00');
  equal(validZone('-8:00'), '-08:00');
  equal(validZone('-05:00'), '-05:00');

  equal(validZone('Europe/Berlin'), 'Europe/Berlin');
  equal(validZone('Europe/Vienna'), 'Europe/Vienna');
  equal(validZone('America/New_York'), 'America/New_York');
  equal(validZone('America/Los_Angeles'), 'America/Los_Angeles');
  equal(validZone('Australia/Melbourne'), 'Australia/Melbourne');
  equal(validZone('Asia/Beirut'), 'Asia/Beirut');
  equal(validZone('Asia/Shanghai'), 'Asia/Shanghai');

  throws(()=>validZone('Central European Time'));
  throws(()=>validZone('America/San_Francisco'));
  throws(()=>validZone('Atlantis/Fantasy'));
  throws(()=>validZone('EST'));
  throws(()=>validZone('EDT'));
  throws(()=>validZone('PST'));
  throws(()=>validZone('EDST'));
  throws(()=>validZone('CST'));
  throws(()=>validZone('CET'));
  throws(()=>validZone('CEDT'));

  end();
});
