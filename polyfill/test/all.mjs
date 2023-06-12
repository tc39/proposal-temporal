#! /usr/bin/env -S node

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
import Pretty from '@pipobscure/demitasse-pretty';

// exhaustive date arithmetic tests, not suitable for test262
import './datemath.mjs';

// tests of internals, not suitable for test262
import './ecmascript.mjs';

// Power-of-10 math
import './math.mjs';

// Internal 96-bit integer implementation, not suitable for test262
import './timeduration.mjs';

Promise.resolve()
  .then(() => {
    return Demitasse.report(Pretty.reporter);
  })
  .then((failed) => process.exit(failed ? 1 : 0))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
