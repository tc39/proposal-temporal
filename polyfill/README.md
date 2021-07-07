# Non-Production, Test-Only Temporal Polyfill

A non-production polyfill was built to validate this proposal, and continues in this repo for the sole purpose of running tests.

**DO NOT use this polyfill in your own projects! Instead, please use one of the polyfills listed in the table [here](../#polyfills).**

When viewing the reference documentation, this non-production polyfill is automatically loaded in your browser.
You can experiment with Temporal by opening your browser's developer tools console.

Please report polyfill bugs in the [issue tracker](https://github.com/tc39/proposal-temporal/issues).

The polyfill requires Node.js 12 or later.

## Documentation

Reference documentation and examples can be found [here](https://tc39.es/proposal-temporal/docs/index.html).

A [cookbook](https://tc39.es/proposal-temporal/docs/index.html) of common use cases can help you get started with Temporal.

## Node REPL with Temporal

There are two easy ways to interactively run and test Temporal code using this polyfill.
The first, as noted above, is to open the browser devtools console from any page in the [Temporal documentation](https://tc39.es/proposal-temporal/docs/index.html).
The other is to use the built-in Node REPL.

```bash
# run from the /polyfill folder
$ npm run playground
```

## Running Documentation Cookbook as Tests

Documentation cookbook code samples are also runnable as tests.

```bash
# Run all cookbook tests (run from /polyfill folder)
$ npm run test-cookbook

# Test one cookbook file (run from /polyfill folder)
$ env TEST=dateTimeFromLegacyDate npm run test-cookbook-one
```
