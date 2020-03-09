#!/bin/bash

export NODE_PATH=$PWD/node_modules
npm run build-script
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

test262-harness \
  -r json \
  --test262Dir ../test262 \
  --prelude "../$PRELUDE" \
  --transformer ./transform.test262.js \
  "./*/**/*.js" \
  > ../exec.out
./parseResults.py ../exec.out
RESULT=$?

cd ..

if [ "x$COVERAGE" = xyes ]; then
    nyc report -t coverage/tmp/transformer --reporter=text-lcov > coverage/test262.lcov
fi

rm exec.out
rm -f script-instrumented.js
rm -rf coverage/tmp/transformer

exit $RESULT
