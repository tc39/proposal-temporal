if (module.parent && module.parent.id === 'internal/preload') {
  // Running unbundled as 'npm run playground'
  globalThis.__debug__ = true;
}

import('./shim.mjs').catch((err) => {
  console.error(err);
  process.exit(1);
});
