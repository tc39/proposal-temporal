# Temporal Polyfill

**Polyfill for [Proposal: Temporal](https://github.com/tc39/proposal-temporal)**

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
$ npm run cookbook

# Run a single cookbook file:
$ env TEST=dateTimeFromLegacyDate npm run cookbook-one
```
