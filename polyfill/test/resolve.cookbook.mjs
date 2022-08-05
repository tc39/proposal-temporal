/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

export function globalPreload() {
  return `\
const { createRequire } = getBuiltin('module');
const { cwd } = getBuiltin('process');
const require = createRequire(cwd() + '/<preload>');
require('./script.js');
globalThis.assert = getBuiltin('assert').strict;
`;
}
