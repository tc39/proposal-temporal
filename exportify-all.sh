#!/bin/bash

# Convert ecmascript.mjs to use exported functions instead of a big exported object wih function properties

function exportify() {

  cd polyfill/lib

  # Exports from ES2022
  sed -i '' 's/^const ES2022 =/export/' ecmascript.mjs

  # Beginning and ending of ES object
  sed -i '' 's/^export const ES = ObjectAssign({}, ES2022, {//' ecmascript.mjs
  sed -i '' 's/^});//' ecmascript.mjs

  # If nothing else is using ObjectAssign, delete its declaration
  if [[ $(grep -c 'ObjectAssign' ecmascript.mjs) -eq 1 ]]
  then
    sed -i '' '/ObjectAssign/d' ecmascript.mjs
  fi

  # SystemUTCEpochNanoSeconds is an IIFE that returns a function
  sed -i '' 's/  SystemUTCEpochNanoSeconds: (() => {/  export const SystemUTCEpochNanoSeconds = (() => {/' ecmascript.mjs
  sed -i '' 's/  })(),/  })();/' ecmascript.mjs

  # Remove commas after each function
  sed -i '' 's/^  },$/  }/' ecmascript.mjs

  # Non-arrow functions first line with one line of params
  sed -E -i '' 's/^  ([a-zA-Z0-9_]+): \((.*)\) => {/  export function \1(\2) {/' ecmascript.mjs

  # One-line arrow functions first line
  sed -E -i '' 's/^  ([a-zA-Z0-9_]+): \((.*)\) => (.*),$/  export function \1(\2) { return \3; }/' ecmascript.mjs

  # Multi-line arrow functions: IsTemporalDuration, IsTemporalTime, IsTemporalDateTime:
  sed -E -i '' 's/^  ([a-zA-Z0-9_]+): \((.*)\) =>$/  export function \1(\2) { return (/' ecmascript.mjs
  # Special cases for the end of those three functions
  sed -E -i '' 's/^    ),$/    )); }/' ecmascript.mjs
  sed -E -i '' 's/^    !HasSlot\(item, ISO_YEAR, ISO_MONTH, ISO_DAY\),$/    !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY)); }/' ecmascript.mjs
  sed -E -i '' 's/^    HasSlot\(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS\),$/    HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS)); }/' ecmascript.mjs

  # Exported functions defined locally
  sed -E -i '' 's/^  (ToPositiveIntegerWithTruncation|ToIntegerWithTruncation|ToIntegerIfIntegral),$//' ecmascript.mjs
  sed -E -i '' 's/^const (.*) = \((.*)\) => {$/  export function \1(\2) {/' ecmascript.mjs

  # Special case the REQUIRED symbol
  sed -i '' "s/  REQUIRED: Symbol('~required~'),/  export const REQUIRED = Symbol('~required~');/" ecmascript.mjs

  # Multi-line parameter lists
  sed -E -i '' 's/^  \) => {$/  ) {/' ecmascript.mjs

  # Non-arrow functions first line with multiple lines of params
  sed -E -i '' 's/^  (.*): \(/  export function \1(/' ecmascript.mjs

  # Special case for one function defined without an arrow but also without the function keyword
  sed -E -i '' 's/^  DifferenceInstant\(/  export function DifferenceInstant(/' ecmascript.mjs

  # Remove "ES."
  sed -E -i '' 's/ES\.//g' ecmascript.mjs

  # Add a blank line before each export (doubled blanks will be removed by prettier)
  sed -E -i '' $'s/^  export/\\\n  export/' ecmascript.mjs

  # Fix imports in other polyfill files
  for i in *.mjs; do sed -i '' 's/import { ES } from/import * as ES from/g' $i; done

  # Fix imports in test code
  cd ../test
  for i in *.mjs; do sed -i '' 's/import { ES } from/import * as ES from/g' $i; done

  cd ../..

  # Fix up spacing in ecmascript.mjs
  npm run pretty

}

### Real script starts here ####

# Create a branch where all commits are converted to use exported functions.
# This will make rebasing much easier for porting commits over to temporal-polyfill.


# commit where we switched to exported functions in ecmascript.mjs
EXPORT_REFACTOR=43c6be13

# last commit ported to proposal-temporal
LAST_PORTED=9bd27a20ef157c69d4d4954e64724eb332b32723

# Create a new branch whose initial HEAD is the last ported commit
git checkout main && git branch -D porting
git checkout -b porting $LAST_PORTED

# Start with a commit that won't actually be ported. It contains:
# 1. Exportified version of the last ported commit.
# 2. Fix to `npm run pretty` to work around prettier+eslint conflict
set -ex

exportify
sed -i '' 's#eslint . --ext js,mjs,.d.ts --fix#prettier --write polyfill/lib \&\& eslint . --ext js,mjs,.d.ts --fix#' package.json
git add .
git commit -m "Exportifying HEAD before porting commits. Ignore this commit."

# exec 3<&0 # for waiting for keypress (uncomment if "read" below is uncommented)

git --no-pager log $LAST_PORTED..$EXPORT_REFACTOR~1 --reverse --format="%H" polyfill/lib/*.mjs polyfill/test/ecmascript.mjs polyfill/test/datemath.mjs |
while read in; do
  echo "Processing commit $in"
  fmt="%B%n%nUPSTREAM_COMMIT=$in"
  msg="$(git log $in~1..$in --format=$fmt)"
  author="$(git log $in~1..$in --format='%an <%ae>')"
  author_date="$(git log $in~1..$in --format='%ad')"

  # get and stage the files that may need to be converted to use exports
  git checkout $in polyfill/lib/*.mjs polyfill/test/ecmascript.mjs polyfill/test/datemath.mjs

  # unstage those files
  git reset HEAD -- .

  # convert them to exports (which will match previous commits which were also exportified)
  exportify

  # validate that the new code still builds (which it shouldn't if exportify.sh messed up)
  npm run lint
  npm run build:polyfill

  # read -p 'press any key' keypress <&3

  # stage the exportified files, including any actual code changes in the proposal repo's commit
  git add -u

  # finally, commit!
  git commit --author="$author" --date="$author_date" -m "$msg"

  # exit 0
done

