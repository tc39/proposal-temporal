# Temporal Polyfill

**Polyfill for [Proposal: Temporal](https://github.com/tc39/proposal-temporal)**

**NOTE:** We encourage you to experiment with the polyfill, but don't use it in production!
The API will change before the proposal reaches Stage 3, based on feedback that we receive during this time.
Please give us your feedback in the [issue tracker](https://github.com/tc39/proposal-temporal/issues).

Please run the polyfill with Node.js 12 or later.

## Import as a Module

You can depend on the unstable Temporal polyfill in your personal projects:

```bash
$ npm install --save tc39/proposal-temporal
```

In code:

```javascript
import { Temporal } from "proposal-temporal/polyfill/lib/index.mjs";
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
