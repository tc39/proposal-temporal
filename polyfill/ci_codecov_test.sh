#!/bin/bash

set -ex

SHA_ARG=""
if [ -n "$HEAD_SHA" ]; then
  SHA_ARG="-c $HEAD_SHA"
fi

export NODE_V8_COVERAGE=coverage/tmp
npm run test
c8 report --reporter=text-lcov > coverage/tests.lcov
codecov $SHA_ARG -F tests -f coverage/tests.lcov
