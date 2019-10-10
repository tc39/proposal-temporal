import('./index.mjs')
  .then(({ setup }) => setup(globalThis))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
