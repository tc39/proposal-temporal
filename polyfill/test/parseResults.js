#!/usr/bin/env node

const { stdin, stdout, exit } = process;
const fs = require('fs');

const PREFIXES = [
  ['FAIL', 'PASS'],
  ['EXPECTED FAIL', 'UNEXPECTED PASS']
];

let testOutput = '';
const now = Date.now();

const expectedFailures = new Set();
const lines = fs.readFileSync('expected-failures.txt', { encoding: 'utf-8' });
for (let line of lines.split('\n')) {
  line = line.trim();
  if (!line) continue;
  if (line.startsWith('#')) continue;
  expectedFailures.add(line);
}

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
  const matches = testOutput.split('"file":').length - 1;
  // We skipped execution of non-strict tests via a preprocessor, but the test
  // is treated as passed and shows up here, so we'll divide total by 2.
  testCount = Math.trunc(matches / 2);
  if (testCount >= nextReportCount || testOutput.endsWith(']\n')) {
    reportStatus();
    nextReportCount += 100;
  }
});

stdin.on('end', function () {
  stdout.write('\n');
  // filter out the non-strict tests because they were skipped via a preprocessor
  const tests = JSON.parse(testOutput).filter((test) => test.scenario.includes('strict'));
  const failedTests = [];
  const unexpectedPasses = [];
  for (const test of tests) {
    const { result, scenario, file } = test;
    const expectedFailure = expectedFailures.has(file);
    const message = `${PREFIXES[+expectedFailure][+result.pass]} ${file} (${scenario})\n`;
    stdout.write(message);
    if (result.pass === expectedFailure) {
      (result.pass ? unexpectedPasses : failedTests).push({ ...test, message });
    }
  }

  if (failedTests.length || unexpectedPasses.length) {
    if (failedTests.length) {
      stdout.write(`\n${failedTests.length} tests failed:\n`);
      for (const test of failedTests) {
        const { message, rawResult } = test;
        stdout.write(`\n${message}\n`);
        stdout.write(`${rawResult.stderr}\n`);
        stdout.write(`${rawResult.stdout}\n`);
        stdout.write(rawResult.message ? rawResult.message + '\n' : '');
      }
    }
    if (unexpectedPasses.length) {
      stdout.write(`\n${unexpectedPasses.length} tests passed unexpectedly:\n`);
      for (const { message } of unexpectedPasses) {
        stdout.write(`${message}\n`);
      }
    }
  } else {
    stdout.write('All results as expected.\n');
  }
  reportStatus(tests.length);
  stdout.write('\n\n');
  exit(failedTests.length ? 1 : 0);
});
