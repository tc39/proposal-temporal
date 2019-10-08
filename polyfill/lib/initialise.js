Promise.all([import('./temporal.mjs'), import('./intl.mjs')])
  .then(([module, intl]) => {
    const Temporal = (globalThis.Temporal = {});
    for (const [name, value] of Object.entries(module)) {
      Temporal[name] = value;
    }
    const pre = {
      format: Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, 'format'),
      formatToParts: Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, 'formatToParts')
    };
    Intl.DateTimeFormat = intl.DateTimeFormat;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
