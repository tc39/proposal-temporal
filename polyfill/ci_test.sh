#!/bin/bash

virtualenv -p python3 venv
source venv/bin/activate
pip install ijson

export NODE_PATH=$PWD/node_modules
npm run build
if [ ! -d "test262" ]; then
  git clone --depth 1 https://github.com/tc39/test262.git
else
  cd ./test262
  git fetch origin
  git merge --ff-only origin/master
  cd ..
fi

PRELUDE=script.js
if [ "x$COVERAGE" = xyes ]; then
    nyc instrument script.js > script-instrumented.js
    PRELUDE=script-instrumented.js
fi

cd test/

if [ "$(uname)" = 'Darwin' ]; then
  threads=$(sysctl -n hw.logicalcpu)
else
  threads=$(nproc --ignore 1)
fi
if [ $threads -gt 2 ]; then threads=2; fi

test262-harness \
  -t $threads \
  -r json \
  --test262Dir ../test262 \
  --prelude "../$PRELUDE" \
  --transformer ./transform.test262.js \
  "./*/**/*.js" \
  | ./parseResults.py
RESULT=$?

cd ..

if [ "x$COVERAGE" = xyes ]; then
    nyc report -t coverage/tmp/transformer --reporter=text-lcov > coverage/test262.lcov
fi

rm -f script-instrumented.js
rm -rf coverage/tmp/transformer

exit $RESULT
