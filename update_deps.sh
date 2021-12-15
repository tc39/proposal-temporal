# root folder dependencies
# remove "-x ecmarkup" when https://github.com/tc39/ecmarkup/issues/394 is resolved
npx npm-check-updates -u

# polyfill dependencies
# NOTE: we don't update demitasse because our tests aren't compatible with its latest version
cd polyfill
npx npm-check-updates -u -x @pipobscure/demitasse,@pipobscure/demitasse-pretty,@pipobscure/demitasse-run
npm install
cd ..

# docs dependencies
cd docs
npx npm-check-updates -u
npm install
cd ..

# verify that builds still work
npm run build
