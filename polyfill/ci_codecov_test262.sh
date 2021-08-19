#!/bin/bash

set -ex

SHA_ARG=""
if [ -n "$HEAD_SHA" ]; then
  SHA_ARG="-c $HEAD_SHA"
fi

export COVERAGE=yes
npm run test262
codecov $SHA_ARG -F test262 -f coverage/test262.lcov
