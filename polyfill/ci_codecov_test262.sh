#!/bin/bash

set -ex

SHA_ARG=""
if [ -n "$HEAD_SHA" ]; then
  SHA_ARG="-c $HEAD_SHA"
fi

npm run build262

export NODE_V8_COVERAGE=coverage/tmp/
rm -rf $NODE_V8_COVERAGE

# Run the tests in chunks, by subdirectory
# Works around memory leak with vm.Script and NODE_V8_COVERAGE
subdirs=$(find test262/test/*/Temporal/* -maxdepth 0 -type d -exec basename "{}" ";" | sort -u)

failed=0
node runtest262.mjs "*.js" || failed=1
# Tolerate absence (but not failures) of test files matching the following pattern
node runtest262.mjs "test262/test/built-ins/Date/*/toTemporalInstant/*.js" || [ $? = 66 ] || failed=1
for subdir in $subdirs; do
  node runtest262.mjs "$subdir/**" || failed=1
done
node runtest262.mjs "test262/test/staging/Intl402/Temporal/**/*.js" || failed=1
node runtest262.mjs "test262/test/intl402/**/*[tT]emporal*.js" || failed=1
# TODO: remove the line above and uncomment the three lines below to run tests for all localized
# date formatting, because the Temporal polyfill replaces the entire DateTimeFormat object.
# See https://github.com/tc39/proposal-temporal/issues/2471 for more info.
# node runtest262.mjs "test262/test/intl402/DateTimeFormat/**/*.js" || failed=1
# node runtest262.mjs "test262/test/intl402/Intl/DateTimeFormat/**/*.js" || [ $? = 66 ] || failed=1
# node runtest262.mjs "test262/test/built-ins/Date/*/toLocale*String/*.js" || failed=1

c8 report --reporter=text-lcov --temp-directory=$NODE_V8_COVERAGE \
  --exclude=polyfill/runtest262.mjs \
  --exclude-after-remap > coverage/test262.lcov

codecov $SHA_ARG -f coverage/test262.lcov

rm -rf $NODE_V8_COVERAGE

if [ $failed -ne 0 ]; then
  echo Some tests failed.
  exit 1
fi
