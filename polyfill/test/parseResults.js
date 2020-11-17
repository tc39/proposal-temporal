#!/usr/bin/env node

const { stdin, stdout, exit } = process;
let testOutput = '';
const now = Date.now();

stdin.setEncoding('utf8');

stdout.write('Starting Test262 tests.\n');

let testCount = 0;
let nextReportCount = 100;

function reportStatus(length = testCount) {
  const secs = (Date.now() - now) / 1000;
  stdout.write(`${length} tests completed in ${secs.toFixed(1)} seconds. (${Math.round(length / secs)} tests/sec)\n`);
}

stdin.on('data', function (chunk) {
  testOutput += chunk;
  testCount = testOutput.split('"file":').length - 1;
  if (testCount >= nextReportCount || testOutput.endsWith(']\n')) {
    reportStatus();
    nextReportCount += 100;
  }
});

stdin.on('end', function () {
  stdout.write('\n');
  const tests = JSON.parse(testOutput);
  const failedTests = [];
  for (const test of tests) {
    const { result, scenario, file } = test;
    const message = `${result.pass ? 'PASS' : 'FAIL'} ${file} (${scenario})\n`;
    stdout.write(message);
    if (!result.pass) failedTests.push({ ...test, message });
  }

  if (failedTests.length) {
    stdout.write(`\n${failedTests.length} tests failed:\n`);
    for (const test of failedTests) {
      const { message, rawResult } = test;
      stdout.write(`\n${message}\n`);
      stdout.write(`${rawResult.stderr}\n`);
      stdout.write(`${rawResult.stdout}\n`);
      stdout.write(rawResult.message ? rawResult.message + '\n' : '');
    }
  } else {
    stdout.write('All results as expected.\n');
  }
  reportStatus(tests.length);
  stdout.write('\n\n');
  exit(failedTests.length ? 1 : 0);
});
