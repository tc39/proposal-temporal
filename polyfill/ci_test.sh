#!/bin/bash

TESTS=${@:-"**/*.js"}
TIMEOUT=${TIMEOUT:-10000}
PRELUDE=${PRELUDE:-script.js}

export NODE_PATH=$PWD/node_modules
npm run build262

if [ "x$COVERAGE" = xyes ]; then
  nyc instrument "$PRELUDE" > script-instrumented.js
  PRELUDE=script-instrumented.js
  TRANSFORMER_ARG="--transformer ../../test/transform.test262.js"
fi

pushd test262/test/

if [ "$(uname)" = 'Darwin' ]; then
  threads=$(sysctl -n hw.logicalcpu)
else
  threads=$(nproc --ignore 1)
fi
if [ $threads -gt 8 ]; then threads=8; fi

test262-harness \
  -t $threads \
  -r json \
  --reporter-keys file,rawResult,result,scenario \
  --test262Dir .. \
  --prelude "../../$PRELUDE" \
  --timeout "$TIMEOUT" \
  --preprocessor ../../test/preprocessor.test262.js \
  $TRANSFORMER_ARG \
  "*/Temporal/$TESTS" \
  | ../../test/parseResults.js
RESULT=$?

popd

if [ "x$COVERAGE" = xyes ]; then
  nyc report -t coverage/tmp/transformer --reporter=text-lcov > coverage/test262.lcov
fi

rm -f script-instrumented.js
rm -rf coverage/tmp/transformer

exit $RESULT
