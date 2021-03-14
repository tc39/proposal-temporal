# Temporal Polyfill

**Polyfill for [Proposal: Temporal](https://github.com/tc39/proposal-temporal)**

**NOTE: We encourage you to experiment with the polyfill, but don't use it in production!**
**The API may change based on feedback from implementers, and the current non-production polyfill is very slow for some operations.**
Please report bugs in the [issue tracker](https://github.com/tc39/proposal-temporal/issues).

Please run the polyfill with Node.js 12 or later.

## Documentation

Reference documentation and examples can be found [here](https://tc39.es/proposal-temporal/docs/index.html).

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](https://tc39.es/proposal-temporal/docs/index.html)

## Import as a Module

You can depend on the unstable Temporal polyfill in your personal projects:

```bash
$ npm install --save proposal-temporal
```

In code:

```javascript
const { Temporal } = require('proposal-temporal');
```

Or, import the polyfill as an ES6 module:

```javascript
import { Temporal } from 'proposal-temporal/lib/index.mjs';
```

## Node REPL with Temporal

From this directory:

```bash
$ npm run playground
```

## Running Cookbook Files

From this directory:

```bash
# Run all cookbook files:
$ npm run test-cookbook

# Run a single cookbook file:
$ env TEST=dateTimeFromLegacyDate npm run test-cookbook-one
```
