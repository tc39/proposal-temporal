import('./index.mjs')
  .then(({ Temporal, Intl }) => {
    globalThis.Temporal = { ...Temporal };
    Object.assign(globalThis.Intl, Intl);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
