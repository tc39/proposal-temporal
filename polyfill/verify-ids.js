const prefixes = [
  "sec-temporal.",
  "sec-temporal-",
  "sec-get-temporal.",
];

const abstractops = {
  "sec-temporal-comparetemporaldate": ["plaindate", "compare"],
  "sec-temporal-comparetemporaldatetime": ["plaindatetime", "compare"],
  "sec-temporal-comparetemporaltime": ["plaintime", "compare"],
  "sec-temporal-comparetemporalyearmonth": ["plainyearmonth", "compare"],
};

const fs = require('fs');
const biblio = fs.readFileSync("../biblio.json", "utf8");
const ids = JSON.parse(biblio)["<no location>"].map(e => e.id);

function pass(test) {
  test.result = {
    stderr: '',
    stdout: '',
    error: null
  };
  return test;
}

function fail(test, message) {
  test.result = {
    stderr: '',
    stdout: '',
    error: {
      message: `${message}\n`
    }
  };
  return test;
}

module.exports = function(test) {
  const path = test
    .file
    .split("/")
    .filter(p => p !== "test" && !p.endsWith(".js") && p !== "constructor")
    .map(p => p.toLowerCase());

  const esid = test.attrs.esid;
  if (!esid) {
    // TODO: fail.
    return pass(test, "No esid in " + test.file);
  }

  if (!ids.includes(esid)) {
    let message = `Didn't find ${esid} in spec`;
    return fail(test, message);
  }

  if (esid in abstractops) {
    if (abstractops[esid].join("\0") === path.join("\0")) {
      return pass(test);
    }
    let message = `${test.file}: ${esid} → ${abstractops[esid]} === ${path}`;
    return fail(test, message);
  }

  for (const prefix of prefixes) {
    if (esid.startsWith(prefix)) {
      const parts = esid.replace(prefix, "").replace("@@", "").split(/[\.\-]/);
      if (parts.join("\0") === path.join("\0")) {
        return pass(test);
      }
      let message = `${test.file}: ${esid} → ${parts}`;
      return fail(test, message);
    }
  }

  return fail(test, `Bad esid ${esid} in ${test.file}`);
};
