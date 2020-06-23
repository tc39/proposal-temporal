# Temporal Polyfill

**Polyfill for [Proposal: Temporal](https://github.com/tc39/proposal-temporal)**

**NOTE:** We encourage you to experiment with the polyfill, but don't use it in production!
The API will change before the proposal reaches Stage 3, based on feedback that we receive during this time.
Please give us your feedback in the [issue tracker](https://github.com/tc39/proposal-temporal/issues) and by taking the [survey](https://forms.gle/iL9iZg7Y9LvH41Nv8).
More info: https://blogs.igalia.com/compilers/2020/06/23/dates-and-times-in-javascript/

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
const { Temporal, Intl } = require('proposal-temporal');
```

Or, import the polyfill as an ES6 module:
```javascript
import { Temporal, Intl } from 'proposal-temporal/lib/index.mjs';
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
