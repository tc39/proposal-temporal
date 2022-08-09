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
# does not set failed=1 because that directory currently doesn't exist:
node runtest262.mjs "test262/test/built-ins/Date/*/toTemporalInstant/*.js" || true
for subdir in $subdirs; do
  node runtest262.mjs "$subdir/**" || failed=1
done
node runtest262.mjs "test262/test/staging/Intl402/Temporal/**/*.js" || failed=1

c8 report --reporter=text-lcov --temp-directory=$NODE_V8_COVERAGE \
  --exclude=polyfill/runtest262.mjs \
  --exclude-after-remap > coverage/test262.lcov

codecov $SHA_ARG -f coverage/test262.lcov

rm -rf $NODE_V8_COVERAGE

if [ $failed -ne 0 ]; then
  echo Some tests failed.
  exit 1
fi
