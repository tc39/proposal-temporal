#!/bin/bash

set -ex

SHA_ARG=""
if [ -n "$HEAD_SHA" ]; then
  SHA_ARG="-c $HEAD_SHA"
fi

export COVERAGE=yes
npm run test262
codecov $SHA_ARG -f coverage/test262.lcov
