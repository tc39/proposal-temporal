# Non-Production, Test-Only Temporal Polyfill

A non-production polyfill was built to validate this proposal.
This polyfill continues to live in this repo, but only for the purposes of running tests and powering the documentation "playground" as described below.
**DO NOT use this polyfill in your own projects! Instead, please use a polyfill listed in the table [here](../#polyfills).**

## Documentation

Reference documentation and examples can be found [here](https://tc39.es/proposal-temporal/docs/index.html).

A [cookbook](https://tc39.es/proposal-temporal/docs/index.html) of common use cases can help you get started with Temporal.

## Documentation Playground

When viewing the [reference documentation](https://tc39.es/proposal-temporal/docs/index.html), this non-production polyfill is automatically loaded in your browser.
You can experiment with Temporal by opening your browser's developer tools console.

## Running Documentation Cookbook as Tests

Documentation cookbook code samples are also runnable as tests.

```bash
# Run all cookbook tests (run from /polyfill folder)
$ npm run test-cookbook

# Test one cookbook file (run from /polyfill folder)
$ env TEST=dateTimeFromLegacyDate npm run test-cookbook-one
```
