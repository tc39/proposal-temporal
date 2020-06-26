if (module.parent && module.parent.id === 'internal/preload') {
  // Running unbundled as 'npm run playground'
  globalThis.__debug__ = true;
}

import('./index.mjs')
  .then(({ Temporal, Intl }) => {
    globalThis.Temporal = { ...Temporal };
    Object.assign(globalThis.Intl, Intl);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
