#!/bin/bash

export NODE_PATH=$PWD/node_modules
npm install
npm run build-script
npm install test262-harness
if [ ! -d "test262" ]; then
  git clone --depth 1 https://github.com/tc39/test262.git
else
  cd ./test262
  git fetch origin
  git merge --ff-only origin/master
  cd ..
fi

cd test/

test262-harness \
  -r json \
  --test262Dir ../test262 \
  --prelude ../script.js \
  "./*/**/*.js" \
  > ../exec.out
./parseResults.py ../exec.out
RESULT=$?
rm ../exec.out
exit $RESULT
