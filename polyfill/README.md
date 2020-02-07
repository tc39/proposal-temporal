# Temporal Polyfill

Node-REPL (with Temporal): `node --experimental-modules --no-warnings --icu-data-dir ./node_modules/full-icu/ -r ./lib/initialise.js`

Running cookbook files: `node --experimental-modules --no-warnings --icu-data-dir ./polyfill/node_modules/full-icu/ -r ./polyfill/index.js ./docs/cookbook/${cookbookFile}`

_The above code allows `Temporal` to exist as a global object before the cookbook file runs._

**Polyfill for [Proposal: Temporal](https://github.com/tc39/proposal-temporal)**
