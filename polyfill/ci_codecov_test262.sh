#!/bin/bash

set -ex

npm run build262

export NODE_V8_COVERAGE=coverage/tmp/
rm -rf $NODE_V8_COVERAGE

# Run the tests in chunks, by subdirectory
# Works around memory leak with vm.Script and NODE_V8_COVERAGE
# https://github.com/nodejs/node/issues/44364
subdirs=$(find test262/test/*/Temporal/* -maxdepth 0 -type d -exec basename "{}" ";" | sort -u)

failed=0
node runtest262.mjs "*.js" || failed=1
# Tolerate absence (but not failures) of test files matching the following pattern
node runtest262.mjs "test262/test/built-ins/Date/*/toTemporalInstant/*.js" || [ $? = 66 ] || failed=1
for subdir in $subdirs; do
  node runtest262.mjs "$subdir/**" || failed=1
done
node runtest262.mjs "test262/test/staging/Intl402/Temporal/**/*.js" || failed=1
node runtest262.mjs "test262/test/intl402/DateTimeFormat/**/*.js" || failed=1
node runtest262.mjs "test262/test/intl402/Intl/DateTimeFormat/**/*.js" || failed=1
node runtest262.mjs "test262/test/built-ins/Date/*/toLocale*String/*.js" || failed=1

c8 report --reporter=text-lcov --temp-directory=$NODE_V8_COVERAGE \
  --include=lib/* --exclude=lib/assert.mjs \
  --exclude-after-remap > coverage/test262.lcov

rm -rf $NODE_V8_COVERAGE

if [ $failed -ne 0 ]; then
  echo Some tests failed.
  exit 1
fi
