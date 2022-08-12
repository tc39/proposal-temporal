import color from 'ansi-colors';
import fs from 'node:fs';
import globSync from 'tiny-glob/sync.js';
import path from 'node:path';
import process from 'node:process';
import ProgressBar from 'progress';
import util from 'node:util';
import vm from 'node:vm';
import yaml from 'js-yaml';

// = Temporal test262 runner =

// This is a lightweight runner for Temporal's test262 tests. It exists in order
// to be fast, and it is specific to Temporal. It doesn't provide all of the
// facilities that the full test262 suite would expect. It achieves the "fast"
// goal by parsing the Temporal polyfill once into a vm.Script, instead of
// reading and parsing the whole file once for each test like the prelude option
// of test262-harness would.

// Without any arguments, all of the Temporal tests will be run. The script
// takes as arguments any number of glob patterns relative to
// test262/test/*/Temporal/, each of which specify a subset of tests to be run.
// For example:
//   "PlainDateTime/**" "*/prototype/with/*.js"
//   "**/basic.js"
// If a pattern doesn't match any test files relative to Temporal/, it will also
// try to match test files relative to the current working directory, so that
// tab completion works.

// For code coverage, run it with the environment variable NODE_V8_COVERAGE set
// to a path relative to the cwd, where coverage metrics will be output. These
// can be processed with the c8 tool.

// Note, as of Node 18.7 there is a memory leak that makes it impossible to run
// the entire suite with NODE_V8_COVERAGE, so you should run it in chunks.

// Time the whole thing from start to finish
const start = process.hrtime.bigint();

// === Utilities and constants ===

function print(str) {
  process.stdout.write(str + '\n');
}

// Fancy output only if stdout is a terminal
color.enabled = process.stdout.isTTY;

// Front matter consists of a YAML document in between /*--- and ---*/
const frontmatterMatcher = /\/\*---\n(.*)---\*\//ms;

const UTF8 = { encoding: 'utf-8' };
const GLOB_OPTS = { filesOnly: true };

// EX_NOINPUT -- An input file (not a system file) did not exist or was not readable.
const EX_NOINPUT = 66;

// === Preparation ===

// Prepare Temporal polyfill. This vm.Script gets executed once for each test,
// in a fresh VM context.

const polyfillCode = fs.readFileSync('script.js', UTF8);
const polyfill = new vm.Script(polyfillCode, { filename: path.resolve('script.js') });

// Read the expected failures file and put the paths into a Set

const expectedFailures = new Set(
  fs
    .readFileSync('test/expected-failures.txt', UTF8)
    .split(/\r?\n/g)
    .filter((line) => line && line[0] !== '#')
);

// This function reads in a test262 harness helper file, specified in 'includes'
// in the frontmatter, and caches the resulting vm.Script so it can be used in
// future tests that also include it.

const helpersCache = new Map();
function getHelperScript(includeName) {
  if (helpersCache.has(includeName)) return helpersCache.get(includeName);

  const includeFile = `test262/harness/${includeName}`;
  const includeCode = fs.readFileSync(includeFile, UTF8);
  const include = new vm.Script(includeCode);

  helpersCache.set(includeName, include);
  return include;
}

// Weed out common error case for people who have just cloned the repo
if (!fs.statSync('test262/test/').isDirectory()) {
  print(color.yellow("Missing Test262 directory. Try initializing the submodule with 'git submodule update --init'"));
  process.exit(EX_NOINPUT);
}

const testGlobs = process.argv.slice(2);
const globResults = testGlobs.flatMap((testGlob) => {
  let result = globSync(`test262/test/**/Temporal/${testGlob}`, GLOB_OPTS);

  // Fall back to globbing relative to working directory if that didn't match
  // anything, in case user is using tab completion
  if (result.length === 0) {
    result = globSync(testGlob, GLOB_OPTS);
  }

  result = result.filter((name) => name.endsWith('.js'));
  if (result.length === 0) {
    print(color.yellow(`No test files found for pattern: "${testGlob}"`));
  }
  return result;
});
if (testGlobs.length === 0) {
  [
    'test262/test/**/Temporal/**/*.js',
    // "p*" is a workaround because there is no toTemporalInstant dir at this time
    'test262/test/built-ins/Date/p*/toTemporalInstant/*.js'
  ].forEach((defaultGlob) => globResults.push(...globSync(defaultGlob, GLOB_OPTS)));
}

const testFiles = new Set(globResults);
const total = testFiles.size;
if (total === 0) {
  print('Nothing to do.');
  process.exit(EX_NOINPUT);
}

// Set up progress bar; don't print one if stdout isn't a terminal, instead use
// a mock object. (You can force that case by piping the output to cat)
let progress;
if (process.stdout.isTTY) {
  progress = new ProgressBar(':bar :percent (:current/:total) | :etas | :test', {
    total,
    complete: '\u2588',
    incomplete: '\u2591',
    width: 20,
    stream: process.stdout,
    renderThrottle: 50,
    clear: true
  });
} else {
  progress = new (class FakeProgressBar {
    #done = 0;

    tick(delta = 1) {
      this.#done += delta;
      // Do print _something_ every 100 tests, so that there is something to
      // look at in the CI while it is in progress.
      if (delta && this.#done % 100 === 0) {
        const elapsed = Number(process.hrtime.bigint() - start) / 1_000_000_000;
        print(`${this.#done} tests completed in ${elapsed.toFixed(1)} seconds.`);
      }
    }

    interrupt() {}
  })();
}

const failures = [];
const unexpectedPasses = [];
const longTests = [];
let passCount = 0;
let expectedFailCount = 0;

// === The test loop ===

for (const testFile of testFiles) {
  // Set up the VM context with the polyfill first, as if it were built-in
  const testContext = {};
  vm.createContext(testContext);
  polyfill.runInContext(testContext);

  // To proceed, we will now need to read the frontmatter
  const testCode = fs.readFileSync(testFile, UTF8);

  const frontmatterString = frontmatterMatcher.exec(testCode)?.[1] ?? '';
  const frontmatter = yaml.load(frontmatterString);

  const { flags = [], includes = [] } = frontmatter ?? {};

  // Load whatever helpers the test specifies. As per the test262 execution
  // instructions, assert.js and sta.js are always executed even if not
  // specified, unless the raw flag is given.
  if (!flags.includes('raw')) includes.unshift('assert.js', 'sta.js');
  includes.forEach((includeName) => {
    getHelperScript(includeName).runInContext(testContext);
  });

  // Various forms of the test's path and filename. testRelPath matches what
  // is given in the expected failures file. testDisplayName is a slightly
  // abbreviated form that we use in logging during the run to make it more
  // likely to fit on one line. progressDisplayName is what's displayed beside
  // the progress bar: testDisplayName with the actual test filename cut off,
  // since the individual tests go by too fast to read anyway.
  const testRelPath = path.relative('test262/test', testFile);
  const testDisplayName = testRelPath
    .replace('built-ins/Temporal/', '')
    .replace('intl402/Temporal/', '(intl) ')
    .replace('staging/Temporal/', '(staging) ')
    .replace('/prototype/', '/p/');
  const progressDisplayName = path.dirname(testDisplayName);
  progress.tick(0, { test: progressDisplayName });

  // Time each test individually in order to report if they take longer than
  // 100 ms
  const testStart = process.hrtime.bigint();

  // Run the test and log a message above the progress bar if the result is not
  // what it's supposed to be. This is so that you don't have to wait until the
  // end to see if your test failed.
  try {
    vm.runInContext(testCode, testContext);
    passCount++;

    if (expectedFailures.has(testRelPath)) {
      unexpectedPasses.push(testRelPath);
      progress.interrupt(`UNEXPECTED PASS: ${testDisplayName}`);
    }
  } catch (e) {
    if (expectedFailures.has(testRelPath)) {
      expectedFailCount++;
    } else {
      failures.push({ file: testRelPath, error: e });
      progress.interrupt(`FAIL: ${testDisplayName}`);
    }
  }

  const testFinish = process.hrtime.bigint();
  const testTime = testFinish - testStart;
  if (testTime > 100_000_000n) {
    longTests.push({ file: testRelPath, ns: testTime });
  }

  progress.tick(1, { test: progressDisplayName });
}

// === Print results ===

const finish = process.hrtime.bigint();
const elapsed = Number(finish - start) / 1_000_000_000;

print(color.underline('\nSummary of results:'));

if (failures.length > 0) {
  failures.forEach(({ file, error }) => {
    print(color.yellow(`\n${color.bold('FAIL')}: ${file}`));
    if (error.constructor.name === 'Test262Error') {
      print(` \u2022 ${error.message}`);
    } else {
      print(util.inspect(error, { colors: color.enabled }));
    }
  });
}

if (unexpectedPasses.length > 0) {
  print(`\n${color.yellow.bold('WARNING:')} Tests passed unexpectedly; remove them from expected-failures.txt?`);
  unexpectedPasses.forEach((file) => print(` \u2022  ${file}`));
}

if (longTests.length > 0) {
  print('\nThe following tests took a long time:');
  longTests.forEach(({ file, ns }) => {
    print(`  ${color.yellow(Math.round(Number(ns) / 1_000_000))} ms: ${file}`);
  });
}

print(`\n${total} tests finished in ${color.bold(elapsed.toFixed(1))} s`);
print(color.green(`  ${passCount} passed`));
print(color.red(`  ${failures.length} failed`));
if (expectedFailCount > 0) {
  print(color.cyan(`  ${expectedFailCount} expected failures`));
}

process.exit(failures.length > 0 ? 1 : 0);
