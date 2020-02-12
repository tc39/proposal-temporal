/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import fs from 'fs';
const PKG = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));
export function resolve(specifier, parent, defaultResolve) {
  if (specifier === PKG.name) {
    specifier = new URL('../index.js', import.meta.url).toString();
  }
  return defaultResolve(specifier, parent);
}
