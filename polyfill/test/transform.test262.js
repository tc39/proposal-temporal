module.exports = function addCoverageOutput(code) {
  return `${code}
const fs = require('fs');
const {v4: uuid} = require('uuid');
const filename = '../coverage/tmp/transformer/' + uuid() + '.json';
fs.mkdirSync('../coverage/tmp/transformer/', { recursive: true });
fs.writeFileSync(filename, JSON.stringify(globalThis.__coverage__ || {}), 'utf-8');
`;
};
