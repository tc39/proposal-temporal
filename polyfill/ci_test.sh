#!/bin/bash

export NODE_PATH=$PWD/node_modules
npm install
npm run build-script
#npm install test262-harness codecov c8
if [ ! -d "test262" ]; then
  git clone --depth 1 https://github.com/tc39/test262.git
else
  cd ./test262
  git fetch origin
  git merge --ff-only origin/master
  cd ..
fi

cd test/

export NODE_V8_COVERAGE=../coverage/tmp

rm -r ../coverage/

test262-harness \
  -r json \
  --test262Dir ../test262 \
  --prelude ../script.js \
  --prelude ./prelude.js \
  
  "./*/**/*.js" \
  > ../exec.out
./parseResults.py ../exec.out
RESULT=$?

if [ $RESULT -eq 0 ]; then
  rm ../exec.out
  c8 report --reporter=html --reports-dir ../coverage
  c8 report --reporter=text-lcov > ../coverage/tests.lcov
  cd ..
  codecov --disable=gcov
else
  rm ../exec.out
fi
exit $RESULT
