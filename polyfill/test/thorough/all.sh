#!/bin/sh

# ./all.sh to test the polyfill with Node.js in your path
#
# Other interpreters:
# Boa:            ./all.sh "$HOME/.esvu/bin/boa -m"
# Graal: ./all.sh "$HOME/.esvu/bin/graaljs --experimental-options --js.temporal"
# JavaScriptCore: ./all.sh "$HOME/.esvu/bin/jsc --useTemporal=1"
# Kiesel:         ./all.sh "$HOME/.esvu/bin/kiesel -m"
# LadybirdJS:     ./all.sh "$HOME/.esvu/bin/ladybird-js -m"
# SpiderMonkey:   ./all.sh "$HOME/.esvu/bin/sm -m"
# V8:             ./all.sh "$HOME/.esvu/bin/v8 --harmony-temporal"

cd $(dirname $0)
interpreter=${1-node}
there_were_errors=0
for test in \
  calendardaymath \
  calendarisolike \
  dateaddition \
  datedifference \
  datemodify \
  dateroundtrip \
  datetimeaddition \
  datetimedifference \
  datetimemodify \
  datetimerounding \
  datetimeroundtrip \
  durationaddition \
  durationmodify \
  durationroundtrip \
  durationtotal \
  instantaddition \
  instantdifference \
  instantrounding \
  instantroundtrip \
  monthdayrefyear \
  monthdaymodify \
  monthdayroundtrip \
  startofday \
  timeaddition \
  timedifference \
  timemodify \
  timerounding \
  timeroundtrip \
  yearcycle \
  yearmonthaddition \
  yearmonthdifference \
  yearmonthmodify \
  yearmonthroundtrip \
  zonedaddition \
  zoneddifference \
  zonedmodify \
  zonedrounding \
  zonedroundtrip
do
  echo "== Running $test.mjs =="
  $interpreter "$test.mjs" || there_were_errors=1
done
exit $there_were_errors
