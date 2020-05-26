#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
import Pretty from '@pipobscure/demitasse-pretty';

// tests with long tedious output
import './datemath.mjs';
import './regex.mjs';

// tests of internals
import './ecmascript.mjs';

// tests of public API
import './exports.mjs';
import './now.mjs';
import './timezone.mjs';
import './absolute.mjs';
import './date.mjs';
import './time.mjs';
import './datetime.mjs';
import './duration.mjs';
import './yearmonth.mjs';
import './monthday.mjs';
import './intl.mjs';

// tests of userland objects
import './usertimezone.mjs';

Promise.resolve()
  .then(() => {
    return Demitasse.report(Pretty.reporter);
  })
  .then((failed) => process.exit(failed ? 1 : 0))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
