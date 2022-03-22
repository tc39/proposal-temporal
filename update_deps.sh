# root folder dependencies
npx npm-check-updates -u
npm install

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
