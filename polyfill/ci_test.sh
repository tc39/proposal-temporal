#!/bin/bash

TESTS=${@:-"./*/**/*.js"}

export NODE_PATH=$PWD/node_modules
npm run build262
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
  TRANSFORMER_ARG="--transformer ./transform.test262.js"
fi

cd test/

if [ "$(uname)" = 'Darwin' ]; then
  threads=$(sysctl -n hw.logicalcpu)
else
  threads=$(nproc --ignore 1)
fi
if [ $threads -gt 8 ]; then threads=8; fi

cp ./helpers/* ../test262/harness/

test262-harness \
  -t $threads \
  -r json \
  --reporter-keys file,rawResult,result,scenario \
  --test262Dir ../test262 \
  --prelude "../$PRELUDE" \
  --preprocessor ./preprocessor.test262.js \
  $TRANSFORMER_ARG \
  "$TESTS" \
  | ./parseResults.js
RESULT=$?

cd ..

if [ "x$COVERAGE" = xyes ]; then
  nyc report -t coverage/tmp/transformer --reporter=text-lcov > coverage/test262.lcov
fi

rm -f script-instrumented.js
rm -rf coverage/tmp/transformer

exit $RESULT
