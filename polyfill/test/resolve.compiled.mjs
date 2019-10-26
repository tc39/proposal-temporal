/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import PKG from '../package.json';
export function resolve(specifier, parent, defaultResolve) {
  if (specifier === PKG.name) {
    specifier = new URL('../index.js', import.meta.url).toString();
  }
  return defaultResolve(specifier, parent);
}
